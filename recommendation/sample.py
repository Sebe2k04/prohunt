

import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
from scipy.sparse import csr_matrix
from sklearn.decomposition import TruncatedSVD


users = [
    {
        "user_id": 1,
        "name": "Alice",
        "skills": ["Python", "Machine Learning","NLP", "Deep Learning"],  # Missing 'NLP'
        "certifications": ["AWS Certified ML", "Deep Learning"],
        "projects_completed": 10,
        "feedback": 4.8,
        "location": "New York",
        "availability": "Available",
        "communication": 4.7,
        "shift": "Day",
        "compensation_type": "Price",
    },
    {
        "user_id": 2,
        "name": "Bob",
        "skills": ["JavaScript", "React", "Node.js"],
        "certifications": ["Full Stack Developer"],
        "projects_completed": 7,
        "feedback": 4.5,
        "location": "San Francisco",
        "availability": "Unavailable",
        "communication": 4.2,
        "shift": "Night",
        "compensation_type": "Share",
    },
    {
        "user_id": 3,
        "name": "Charlie",
        "skills": ["Python", "Data Science", "Data Engineering", "Machine Learning"],
        "certifications": ["Data Engineer"],
        "projects_completed": 15,
        "feedback": 4.9,
        "location": "New York",
        "availability": "Available",
        "communication": 4.9,
        "shift": "Day",
        "compensation_type": "Price",
    },
]

project = {
    "project_id": 101,
    "project_name": "AI Chatbot Development",
    "required_skills": ["Python", "Machine Learning", "NLP"],
    "preferred_skills": ["Deep Learning", "Cloud Computing"],
    "complexity": "High",
    "location": "New York",
    "shift": "Day",
    "compensation_type": "Price",
}


historical_data = [
    {"user_id": 1, "project_id": 201, "rating": 4.5},
    {"user_id": 1, "project_id": 202, "rating": 4.7},
    {"user_id": 2, "project_id": 201, "rating": 4.3},
    {"user_id": 3, "project_id": 203, "rating": 4.9},
    {"user_id": 3, "project_id": 204, "rating": 3.0},
]
# Content-Based Filtering
def content_based(users, project):
    for user in users:
        user["skill_match"] = len(set(user["skills"]).intersection(set(project["required_skills"]))) / len(project["required_skills"])
        user["location_match"] = 1 if user["location"] == project["location"] else 0
        user["certification_match"] = len(user["certifications"])
    
    return users

# Collaborative Filtering
def collaborative_based(historical_data, user_id):
    df = pd.DataFrame(historical_data)
    user_project_matrix = pd.pivot_table(df, values="rating", index="user_id", columns="project_id").fillna(0)
    sparse_matrix = csr_matrix(user_project_matrix)
    svd = TruncatedSVD(n_components=2)
    latent_matrix = svd.fit_transform(sparse_matrix)
    user_index = list(user_project_matrix.index).index(user_id)
    similarity = cosine_similarity([latent_matrix[user_index]], latent_matrix)[0]
    similar_users = sorted(list(enumerate(similarity)), key=lambda x: x[1], reverse=True)
    return {i: score for i, score in similar_users}

# Popularity-Based Filtering
def popularity_based(users):
    for user in users:
        user["popularity_score"] = user["feedback"] * user["projects_completed"] 
    return users

# Knowledge-Based Filtering
# def knowledge_based(users, project):
#     for user in users:
#         user["knowledge_score"] = 1 if project["complexity"] == "High" and len(user["certifications"]) > 1 else 0
#     return users

# Pre-Requisite-Based Filtering
def pre_requisite_based(users, project):
    filtered_users = []
    for user in users:
        meets_requirements = (
            len(set(user["skills"]).intersection(set(project["required_skills"]))) > 0
            and user["availability"] == "Available"
            and user["location"] == project["location"]
            and user["compensation_type"] == project["compensation_type"]
        )
        if meets_requirements:
            filtered_users.append(user)
    return filtered_users

# Skill-based filtering for required and preferred skills
def skill_based(users, project):
    filtered_users = []
    for user in users:
        if not set(project["required_skills"]).issubset(set(user["skills"])):
            continue  # User does not have all required skills, skip them
        user["preferred_skills_match"] = len(set(user["skills"]).intersection(set(project["preferred_skills"])))
        filtered_users.append(user)
    return filtered_users

# Ensemble Scoring
def ensemble_scoring(users, project, historical_data):
    users = content_based(users, project)
    users = popularity_based(users)
    # users = knowledge_based(users, project)
    filtered_users = pre_requisite_based(users, project)
    # filtered_users = skill_based(filtered_users, project)
      # Apply skill-based filtering
    collaborative_scores = collaborative_based(historical_data, user_id=1)
    for user in filtered_users:
        user["collaborative_score"] = collaborative_scores.get(user["user_id"], 0)
    print("f",filtered_users)
    data = pd.DataFrame(filtered_users)
    print(data)
    if 'skill_match' not in data.columns:
        print("Error: 'skill_match' is missing from the DataFrame!")
        return data
    data["ensemble_score"] = (
        data["skill_match"] * 0.3 +
        data["popularity_score"] * 0.3 +
        
        data["collaborative_score"] * 0.2
    )

    # data["knowledge_score"] * 0.2 +
    return data.sort_values(by="ensemble_score", ascending=False)

# Train XGBoost Model
def train_xgboost(data):
    X = data[["skill_match", "popularity_score", "collaborative_score"]]
    # "preferred_skills , knowledge_score"
    y = data["ensemble_score"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = XGBRegressor(objective="reg:squarederror", n_estimators=50, learning_rate=0.1, max_depth=4)
    model.fit(X_train, y_train)
    data["predicted_score"] = model.predict(X)
    return data.sort_values(by="predicted_score", ascending=False)

# Run the System
filtered_users = ensemble_scoring(users, project, historical_data)
print("data", filtered_users)
final_recommendations = train_xgboost(filtered_users)

# Display Results
print("Recommended Users for Project (Final Rankings):")
print(final_recommendations[["name", "predicted_score"]])
