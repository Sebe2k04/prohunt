import pandas as pd
from scipy.stats import pearsonr

def recommend_users_for_project(users, project_id, domain):
    """
    Recommends users for a new project based on Pearson correlation similarity.
    Returns updated users with a 'collaborative_based' score.
    
    Parameters:
    - users: List of user dictionaries containing user_id and completed projects.
    - project_id: The new project ID for recommendations.
    - domain: The domain of the new project.

    Returns:
    - List of users with 'collaborative_based' score added.
    """
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
        user['collaborative_based'] = user_scores.get(user['user_id'], 0)  # Default to 0 if not found

    return users

# Sample Input Data
users = [
    { "user_id": 1, "completed_projects": [{"project_id": 101, "domain": "AI"}, {"project_id": 102, "domain": "AI"}] },
    { "user_id": 2, "completed_projects": [{"project_id": 101, "domain": "AI"}, {"project_id": 103, "domain": "Blockchain"}] },
    { "user_id": 3, "completed_projects": [{"project_id": 102, "domain": "Web"}, {"project_id": 104, "domain": "Mobile"}] },
    { "user_id": 4, "completed_projects": [{"project_id": 103, "domain": "Blockchain"}, {"project_id": 107, "domain": "AI"}] },
    { "user_id": 5, "completed_projects": [{"project_id": 107, "domain": "AI"}, {"project_id": 102, "domain": "AI"}] }
]

# Example Usage
project_id = 106  # New project
domain = "AI"     # Domain of new project

updated_users = recommend_users_for_project(users, project_id, domain)
print(updated_users)
