from flask import Flask, request, jsonify
from bs4 import BeautifulSoup
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Function to scrape GitHub data
def fetch_github_data(user_name):
    response = requests.get(f"https://github.com/{user_name}")
    soup = BeautifulSoup(response.text, "html.parser")
    all_datas = soup.find_all("span", class_="Counter")
    repo = all_datas[0].text.strip() if all_datas else "0"
    stars = all_datas[3].text.strip() if len(all_datas) > 3 else "0"
    return {"platform": "GitHub", "username": user_name, "repositories": repo, "stars": stars}

# Function to scrape LeetCode data
def fetch_leetcode_data(user_name):
    response = requests.get(f"https://leetcode.com/{user_name}")
    soup = BeautifulSoup(response.text, "html.parser")
    problems_solved = soup.find("span", class_="text-[24px]").text.strip() if soup.find("span", class_="text-[24px]") else "0"
    return {"platform": "LeetCode", "username": user_name, "problems_solved": problems_solved}

# Function to scrape HackerRank data
def fetch_hackerrank_data(user_name):
    response = requests.get(f"https://www.hackerrank.com/{user_name}")
    soup = BeautifulSoup(response.text, "html.parser")
    badges = len(soup.find_all("div", class_="badge-card")) if soup.find_all("div", class_="badge-card") else "0"
    return {"platform": "HackerRank", "username": user_name, "badges": badges}

# Function to scrape LinkedIn data
def fetch_linkedin_data(user_name):
    # LinkedIn restricts scraping without authentication — Placeholder for demo purposes
    return {"platform": "LinkedIn", "username": user_name, "status": "LinkedIn scraping requires authentication"}

@app.route('/integrate/<platform>', methods=['POST'])
def integrate(platform):
    data = request.json
    user_name = data.get('username')

    if not user_name:
        return jsonify({"error": "Username is required"}), 400

    platform = platform.lower()
    if platform == "github":
        result = fetch_github_data(user_name)
    elif platform == "leetcode":
        result = fetch_leetcode_data(user_name)
    elif platform == "hackerrank":
        result = fetch_hackerrank_data(user_name)
    elif platform == "linkedin":
        result = fetch_linkedin_data(user_name)
    else:
        result = {"error": "Platform not supported"}

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5000)