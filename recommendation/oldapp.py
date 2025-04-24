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
    for user in users:
        # user_skills_str = " ".join(user["skills"])
        # project_skills_str = " ".join(project["preferred_skills"]+project["required_skills"])
        # vectorizer = TfidfVectorizer()
        # tfidf_matrix = vectorizer.fit_transform([user_skills_str, project_skills_str])
        # user["content_based"] = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])[0][0]
    

        score = fixed_jaccard_similarity(user["skills"], project["preferred_skills"])
        user["content_based"] = score
    return users



def collaborative_based(users, project):
    project_id = project["project_id"]
    domain = project["domain"]
    print("pr_id",project_id,domain)
    # Flatten the data to have user_id, project_id, and domain for each completed project
    data = []
    for user in users:
        for project in user['completed_projects']:
            data.append({
                'user_id': user['user_id'],
                'project_id': project['project_id'],
                'domain': project['domain']
            })

    # Convert to DataFrame
    df = pd.DataFrame(data)

    # Create User-Project Interaction Matrix (Binary)
    user_project_matrix = df.pivot_table(index='user_id', columns='project_id', aggfunc='size', fill_value=0)

    # Compute Pearson Similarity Matrix
    user_ids = user_project_matrix.index
    similarity_matrix = pd.DataFrame(index=user_ids, columns=user_ids)

    for u1 in user_ids:
        for u2 in user_ids:
            if u1 == u2:
                similarity_matrix.loc[u1, u2] = 1  # Self similarity = 1
            else:
                corr, _ = pearsonr(user_project_matrix.loc[u1], user_project_matrix.loc[u2])
                similarity_matrix.loc[u1, u2] = max(0, corr) if not pd.isna(corr) else 0  # Ensure non-negative values
    relevant_users = df[df['domain'] == domain]['user_id'].unique()
    user_scores = {}
    for user in relevant_users:
        similar_users = similarity_matrix[user].drop(user)  # Exclude self-similarity
        avg_similarity = similar_users.mean()  # Compute the average similarity score
        user_scores[user] = round(avg_similarity, 4)
    for user in users:
        user['collaborative_score'] = user_scores.get(user['user_id'], 0)  # Default to 0 if not found
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
    filtered_users = pre_requisite_based(users, project)
    users = content_based(filtered_users, project)
    users = popularity_based(users)
    users = collaborative_based(users, project)
    # print(users)
    data = pd.DataFrame(users)
    # print(filtered_users)
    data["ensemble_score"] = (
        data["content_based"] * 0.3 +
        data["popularity_score"] * 0.2 +
        data["pre_requisite_score"] * 0.3 +
        data["collaborative_score"] * 0.2
    )
        # data["preferred_skills_match"] * 0.2

    return data.sort_values(by="ensemble_score", ascending=False)

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
    filtered_users = ensemble_scoring(users, project)
    final_recommendations = train_xgboost(filtered_users)
    return final_recommendations
    

@app.route('/recommend', methods=['POST'])
@cross_origin()
def recommend():
    project = request.get_json()
    if not project:
        return jsonify({"error": "Invalid JSON"}), 400
    print("Received JSON:", project)
    recommendations = get_recommendations(project)
    json_str = recommendations.to_json(orient='records', indent=4)
    return json_str

if __name__ == '__main__':
    app.run(debug=True)
