from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
from scipy.sparse import csr_matrix
from scipy.stats import pearsonr
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import TfidfVectorizer
from flask_cors import CORS, cross_origin


import json

with open("data.json", "r") as file:
    users = json.load(file) 
app = Flask(__name__)
cors = CORS(app) # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = 'Content-Type'

# project = {
#     "project_id": 101,
#     "project_name": "AI Chatbot Development",
#     "required_skills": ["Python"],
#     "preferred_skills": ["Deep Learning", "Cloud Computing"],
#     "complexity": "High",
#     "location": "New York",
#     "shift": "Day",
#     "compensation_type": "Price",
#     "domain":"AI"
# }


def fixed_jaccard_similarity(user_skills, preferred_skills):
    user_skills_set = set(user_skills)  # Convert list to set
    project_skills_set = set(preferred_skills)  # Convert list to set
    intersection = len(user_skills_set & project_skills_set)  # Find common skills
    union = len(user_skills_set | project_skills_set)
    denominator = len(project_skills_set)  # Fix denominator to preferred skills only
    return intersection / denominator if denominator != 0 else 0
    # return intersection / union if union != 0 else 0

def content_based(users, project):
    try:
        for user in users:
            # Calculate Jaccard similarity for skills
            score = fixed_jaccard_similarity(user["skills"], project["preferred_skills"])
            # Ensure the score is assigned with the correct key
            user["content_based"] = float(score)  # Convert to float to ensure numeric value
    except Exception as e:
        print(f"Error in content-based filtering: {str(e)}")
        # Assign default score if there's an error
        for user in users:
            user["content_based"] = 0.0
    return users



def collaborative_based(users, project):
    if len(users) == 0:
        return []
        
    # Add default collaborative score to each user
    for user in users:
        user['collaborative_score'] = 0.5  # Default middle score
        
    # If we have enough users, try to calculate actual scores
    if len(users) > 1:
        try:
            # Create a basic DataFrame with required structure
            df = pd.DataFrame({
                'user_id': [user['user_id'] for user in users],
                'project_id': [project['project_id']] * len(users),
                'interaction': [1] * len(users)  # Default interaction value
            })
            
            # Create pivot table with the guaranteed structure
            user_project_matrix = df.pivot_table(
                index='user_id', 
                columns='project_id', 
                values='interaction',
                aggfunc='size', 
                fill_value=0
            )
            
            # Calculate simple similarity score based on project domain
            for user in users:
                matching_domain = any(p.get('domain') == project['domain'] 
                                    for p in user.get('completed_projects', []))
                user['collaborative_score'] = 0.8 if matching_domain else 0.3
                
        except Exception as e:
            print(f"Error in collaborative filtering: {str(e)}")
            # Keep default scores if something goes wrong
    
    return users

# Popularity-Based Filtering
def popularity_based(users):
    for user in users:
        result = user["feedback"] * 0.1
        if user["projects_completed"]>10:
            result += 0.5
        else:
            result = result + ((user["projects_completed"]/2)*0.1)

        user["popularity_score"] = result
        # print("p",user["popularity_score"])
    return users

# Pre-Requisite-Based Filtering
def pre_requisite_based(users, project):
    filtered_users = []
    for user in users:
        meets_requirements = (
            set(project["required_skills"]).issubset(set(user["skills"]))

        )
        if meets_requirements:
            user["pre_requisite_score"] = 1
            filtered_users.append(user)
    return filtered_users


# Ensemble Scoring
def ensemble_scoring(users, project):
    try:
        # First apply all scoring methods
        filtered_users = pre_requisite_based(users, project)
        if not filtered_users:  # If no users meet prerequisites
            return pd.DataFrame()  # Return empty DataFrame
            
        filtered_users = content_based(filtered_users, project)
        filtered_users = popularity_based(filtered_users)
        filtered_users = collaborative_based(filtered_users, project)

        # Create DataFrame from users with all required scores
        data = []
        for user in filtered_users:
            user_data = {
                'user_id': user.get('user_id'),
                'name': user.get('name'),
                'skills': user.get('skills', []),
                'content_based': float(user.get('content_based', 0.0)),
                'popularity_score': float(user.get('popularity_score', 0.0)),
                'pre_requisite_score': float(user.get('pre_requisite_score', 0.0)),
                'collaborative_score': float(user.get('collaborative_score', 0.0))
            }
            # Add any additional fields
            for k, v in user.items():
                if k not in user_data:
                    user_data[k] = v
            data.append(user_data)

        # Convert to DataFrame
        df = pd.DataFrame(data)
        
        # Calculate ensemble score
        df['ensemble_score'] = (
            df['content_based'] * 0.3 +
            df['popularity_score'] * 0.2 +
            df['pre_requisite_score'] * 0.3 +
            df['collaborative_score'] * 0.2
        )

        return df.sort_values(by="ensemble_score", ascending=False)
    except Exception as e:
        print(f"Error in ensemble scoring: {str(e)}")
        return pd.DataFrame()  # Return empty DataFrame in case of error

# Train XGBoost Model
def train_xgboost(data):
    X = data[["content_based", "popularity_score", "collaborative_score","pre_requisite_score"]]
    y = data["ensemble_score"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = XGBRegressor(objective="reg:squarederror", n_estimators=50, learning_rate=0.1, max_depth=4)
    model.fit(X_train, y_train)
    data["predicted_score"] = model.predict(X)
    return data.sort_values(by="predicted_score", ascending=False)



def get_recommendations(project):
    try:
        # Step 1: Filter users based on required skills
        filtered_users = []
        for user in users:
            if set(project["required_skills"]).issubset(set(user["skills"])):
                user_data = {
                    'user_id': user.get('user_id'),
                    'name': user.get('name'),
                    'skills': user.get('skills', []),
                    'feedback': user.get('feedback', 0),
                    'projects_completed': user.get('projects_completed', 0),
                    'completed_projects': user.get('completed_projects', [])
                }
                filtered_users.append(user_data)

        if not filtered_users:
            return "[]"  # Return empty JSON array if no users match

        # Step 2: Create DataFrame with initial user data
        df = pd.DataFrame(filtered_users)

        # Step 3: Calculate scores
        # Content-based score using skill matching
        df['content_based'] = df['skills'].apply(
            lambda x: fixed_jaccard_similarity(x, project['preferred_skills'])
        )

        # Popularity score
        df['popularity_score'] = df['feedback'] * 0.1 + \
            df.apply(lambda x: 0.5 if x['projects_completed'] > 10 
                    else (x['projects_completed']/2) * 0.1, axis=1)

        # Pre-requisite score (all filtered users meet requirements)
        df['pre_requisite_score'] = 1.0

        # Collaborative score based on domain matching
        df['collaborative_score'] = df['completed_projects'].apply(
            lambda x: 0.8 if any(p.get('domain') == project['domain'] for p in x) else 0.3
        )

        # Step 4: Calculate ensemble score
        df['ensemble_score'] = (
            df['content_based'] * 0.3 +
            df['popularity_score'] * 0.2 +
            df['pre_requisite_score'] * 0.3 +
            df['collaborative_score'] * 0.2
        )

        # Step 5: Sort and convert to JSON
        result = df.sort_values(by='ensemble_score', ascending=False)
        return result.to_json(orient='records')

    except Exception as e:
        print(f"Error in get_recommendations: {str(e)}")
        return "[]"  # Return empty JSON array in case of error

@app.route('/recommend', methods=['POST'])
@cross_origin()
def recommend():
    try:
        project = request.get_json()
        if not project:
            return jsonify({"error": "Invalid JSON"}), 400
        print("Received JSON:", project)
        recommendations = get_recommendations(project)
        return recommendations, 200
    except Exception as e:
        print(f"Error in recommend endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
