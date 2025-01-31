import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
from scipy.sparse import csr_matrix
from scipy.stats import pearsonr
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics import precision_score, recall_score, f1_score, accuracy_score


# 
from sklearn.feature_extraction.text import TfidfVectorizer
import json

with open("data.json", "r") as file:
    users = json.load(file) 
    # all_users = json.load(file) 
# users = [
#     {
#         "user_id": 1,
#         "name": "Alice",
#         "skills": ["Python", "Machine Learning", "NLP", "Deep Learning"],  # Missing 'NLP'
#         "certifications": ["AWS Certified ML", "Deep Learning"],
#         "projects_completed": 10,
#         "feedback": 4.8,
#         "location": "New York",
#         "availability": "Available",
#         "communication": 4.7,
#         "shift": "Day",
#         "compensation_type": "Price",
#         "completed_projects": [{"project_id": 106, "domain": "AI"}, {"project_id": 108, "domain": "Fintech"}]
#     },
#     {
#         "user_id": 2,
#         "name": "Bob",
#         "skills": ["JavaScript", "React", "Node.js"],
#         "certifications": ["Full Stack Developer"],
#         "projects_completed": 7,
#         "feedback": 4.5,
#         "location": "San Francisco",
#         "availability": "Unavailable",
#         "communication": 4.2,
#         "shift": "Night",
#         "compensation_type": "Share",
#         "completed_projects": [{"project_id": 107, "domain": "Fintech"}, {"project_id": 102, "domain": "Web"}]
#     },
#     {
#         "user_id": 3,
#         "name": "Charlie",
#         "skills": ["Python", "Data Science", "Data Engineering", "Machine Learning"],
#         "certifications": ["Data Engineer"],
#         "projects_completed": 15,
#         "feedback": 4.9,
#         "location": "New York",
#         "availability": "Available",
#         "communication": 4.9,
#         "shift": "Day",
#         "compensation_type": "Price",
#         "completed_projects": [{"project_id": 106, "domain": "AI"}, {"project_id": 105, "domain": "Web"}]
#     },
# ]



project = {
    "project_id": 101,
    "project_name": "AI Chatbot Development",
    "required_skills": ["Python"],
    "preferred_skills": ["Deep Learning", "Cloud Computing"],
    "complexity": "High",
    "location": "New York",
    "shift": "Day",
    "compensation_type": "Price",
    "domain":"AI"
}

# data = [
#     { "user_id": 1, "project_id": 101, "domain": "AI" },
#     { "user_id": 1, "project_id": 102, "domain": "Web" },
#     { "user_id": 2, "project_id": 101, "domain": "AI" },
#     { "user_id": 2, "project_id": 103, "domain": "Blockchain" },
#     { "user_id": 3, "project_id": 102, "domain": "Web" },
#     { "user_id": 3, "project_id": 104, "domain": "Mobile" }
# ]
# Content-Based Filtering with Cosine Similarity for Preferred Skills
# def content_based(users, project):
#     for user in users:
#         # Skill match calculation
#         user["skill_match"] = len(set(user["skills"]).intersection(set(project["required_skills"]))) / len(project["required_skills"])
        
#         # Preferred skill match using cosine similarity
#         preferred_skills_vector = np.zeros(len(project["preferred_skills"]))
#         user_skills_vector = np.zeros(len(project["preferred_skills"]))
        
#         for idx, skill in enumerate(project["preferred_skills"]):
#             if skill in user["skills"]:
#                 user_skills_vector[idx] = 1
        
#         similarity = cosine_similarity([user_skills_vector], [preferred_skills_vector])[0]
#         user["preferred_skills_match"] = similarity[0]
#         print(similarity[0])
#         # Location match
#         user["location_match"] = 1 if user["location"] == project["location"] else 0
#         # Certification match
#         user["certification_match"] = len(user["certifications"])
    
#     return users

def content_based(users, project):
    for user in users:
        user_skills_str = " ".join(user["skills"])
        project_skills_str = " ".join(project["preferred_skills"])
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform([user_skills_str, project_skills_str])
        # print("u",cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])[0][0])
        user["content_based"] = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])[0][0]
    return users


# Collaborative Filtering
# def collaborative_based(historical_data, user_id):
#     df = pd.DataFrame(historical_data)
#     user_project_matrix = pd.pivot_table(df, values="rating", index="user_id", columns="project_id").fillna(0)
#     sparse_matrix = csr_matrix(user_project_matrix)
#     svd = TruncatedSVD(n_components=2)
#     latent_matrix = svd.fit_transform(sparse_matrix)
#     user_index = list(user_project_matrix.index).index(user_id)
#     similarity = cosine_similarity([latent_matrix[user_index]], latent_matrix)[0]
#     similar_users = sorted(list(enumerate(similarity)), key=lambda x: x[1], reverse=True)
#     return {i: score for i, score in similar_users}


def collaborative_based(users, project):
    project_id = project["project_id"]
    domain = project["domain"]
    print("pr_id",project_id,domain)
    """
    Recommends users for a new project based on Pearson correlation similarity,
    returning a single average similarity score for each relevant user and 
    adding it to the users' data under the 'collaborative_based' key.
    
    Parameters:
    - users: List of dictionaries containing user_id, and their completed projects (project_id, domain).
    - project_id: The new project ID for which recommendations are needed.
    - domain: The domain of the new project.
    
    Returns:
    - List of users with the 'collaborative_based' score added to each user.
    """
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

    # Get users who have worked in the same domain
    relevant_users = df[df['domain'] == domain]['user_id'].unique()
    
    user_scores = {}
    for user in relevant_users:
        similar_users = similarity_matrix[user].drop(user)  # Exclude self-similarity
        avg_similarity = similar_users.mean()  # Compute the average similarity score
        user_scores[user] = round(avg_similarity, 4)

    # Add collaborative_based score to the users' data
    for user in users:
        user['collaborative_score'] = user_scores.get(user['user_id'], 0)  # Default to 0 if not found
        # print(user['collaborative_score'])
    return users

# Popularity-Based Filtering
def popularity_based(users):
    for user in users:
        result = (user["feedback"] /5) + (user["projects_completed"] * 0.1) 
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
        #             len(set(user["skills"]).intersection(set(project["required_skills"]))) > 0
            # and user["availability"] == "Available"
            # and user["location"] == project["location"]
            # and user["compensation_type"] == project["compensation_type"]
        if meets_requirements:
            filtered_users.append(user)
    return filtered_users

# Skill-based filtering for required and preferred skills
# def skill_based(users, project):
#     filtered_users = []
#     for user in users:
#         if not set(project["required_skills"]).issubset(set(user["skills"])):  # Check required skills
#             continue  # User does not have all required skills, skip them
#         user["preferred_skills_match"] = len(set(user["skills"]).intersection(set(project["preferred_skills"])))
#         filtered_users.append(user)
#     return filtered_users

# Ensemble Scoring
def ensemble_scoring(users, project):
    filtered_users = pre_requisite_based(users, project)
    users = content_based(filtered_users, project)
    users = popularity_based(users)
    collaborative_scores = collaborative_based(users, project)
    # print(users)
    data = pd.DataFrame(users)
    # print(filtered_users)
    data["ensemble_score"] = (
        data["content_based"] * 0.5 +
        data["popularity_score"] * 0.3 +
        data["collaborative_score"] * 0.2
    )
        # data["preferred_skills_match"] * 0.2

    return data.sort_values(by="ensemble_score", ascending=False)

# Train XGBoost Model
def train_xgboost(data):
    X = data[["content_based", "popularity_score", "collaborative_score"]]
    y = data["ensemble_score"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = XGBRegressor(objective="reg:squarederror", n_estimators=50, learning_rate=0.1, max_depth=4)
    model.fit(X_train, y_train)
    data["predicted_score"] = model.predict(X)
    return data.sort_values(by="predicted_score", ascending=False)


def get_relevant_users(users, project):
    return [
        user["user_id"]
        for user in users
        if set(project["required_skills"]).issubset(set(user["skills"]))
    ]

def evaluate_recommendations(name, final_recommendations, relevant_users):
    y_true = [1 if user in relevant_users else 0 for user in final_recommendations["user_id"]]
    y_pred = [1] * len(y_true)  # Predicted all as relevant for evaluation
    
    precision = precision_score(y_true, y_pred)
    recall = recall_score(y_true, y_pred)
    f1 = f1_score(y_true, y_pred)
    accuracy = accuracy_score(y_true, y_pred)

    print(f"\n{name} Evaluation:")
    print(f"Precision: {precision:.2f}")
    print(f"Recall: {recall:.2f}")
    print(f"F1-score: {f1:.2f}")
    print(f"Accuracy: {accuracy:.2f}")

relevant_users = get_relevant_users(users, project)
cb_users = pd.DataFrame(content_based(users.copy(), project))
evaluate_recommendations("Content-Based Filtering", cb_users, relevant_users)

pop_users = pd.DataFrame(popularity_based(users.copy()))
evaluate_recommendations("Popularity-Based Filtering", pop_users, relevant_users)

pre_req_users = pd.DataFrame(pre_requisite_based(users.copy(), project))
evaluate_recommendations("Pre-Requisite Filtering", pre_req_users, relevant_users)

ensemble_users = ensemble_scoring(users.copy(), project)
evaluate_recommendations("Ensemble Method", ensemble_users, relevant_users)

final_recommendations = train_xgboost(ensemble_users)
evaluate_recommendations("XGBoost Model", final_recommendations, relevant_users)
# # Run the System
# filtered_users = ensemble_scoring(users, project)
# # print(filtered_users)
# # print(filtered_users.content_based)
# final_recommendations = train_xgboost(filtered_users)



# Display Results
print("Recommended Users for Project (Final Rankings):")
print(final_recommendations)
