from flask import Flask, request, jsonify
from bs4 import BeautifulSoup
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv 
from supabase import create_client, Client

# Flask app setup
app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
# Supabase Configuration
SUPABASE_URL =  "https://cumzrjbmoweqbujxfqzt.supabase.co"  # Replace with your Supabase URL
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1bXpyamJtb3dlcWJ1anhmcXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMTY0OTQsImV4cCI6MjA1NjU5MjQ5NH0.jQqFnV2mf-iOhYKUxZWno6cNHzb7HzS4lRPpMFgOcfs"  # Replace with your Supabase API Key
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Function to scrape GitHub data
import requests
from bs4 import BeautifulSoup

def fetch_github_data(user_name):
    try:
        # Fetch the GitHub profile page
        response = requests.get(f"https://github.com/{user_name}")
        response.raise_for_status()  # Raise an error for bad status codes
        soup = BeautifulSoup(response.text, "html.parser")

        # Extract the username
        username_element = soup.find("span", class_="p-nickname vcard-username d-block")
        username = username_element.text.strip() if username_element else "Not Found"

        # Extract repository and stars data
        all_datas = soup.find_all("span", class_="Counter")
        repo = all_datas[0].text.strip() if all_datas else "0"
        stars = all_datas[3].text.strip() if len(all_datas) > 3 else "0"

        # Extract followers and following from the specified XPath
        # Convert XPath to BeautifulSoup selectors
        xpath_section = soup.select("body > div.application-main > main > div > div > div.Layout-main > div > div > div.Layout-sidebar > div > div > div.js-profile-editable-replace > div > div")
        followers = "0"
        following = "0"

        if xpath_section:
            # Find all <span> tags within the XPath section
            spans = xpath_section[0].find_all("span")
            if len(spans) >= 2:
                followers = spans[0].text.strip()  # First <span> contains followers
                following = spans[1].text.strip()  # Second <span> contains following

        return {
            "username": user_name,
            "repositories": repo,
            "stars": stars,
            "followers": followers,
            "following": following
        }

    except requests.exceptions.RequestException as e:
        print(f"Error fetching GitHub data for {user_name}: {str(e)}")
        return {
            "username": "Error",
            "repositories": "0",
            "stars": "0",
            "followers": "0",
            "following": "0"
        }
    
# Function to scrape LeetCode data
def fetch_leetcode_data(user_name):
    try:
        # Fetch data from the LeetCode stats API
        url = f"https://leetcode-stats-api.herokuapp.com/{user_name}"
        response = requests.get(url)

        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()

            # Extract relevant data
            result = {
                "username": user_name,
                "total_solved": str(data.get("totalSolved", "0")) + "/" + str(data.get("totalQuestions", "0")),
                "acceptance_rate": str(data.get("acceptanceRate", "0")),
                "ranking": str(data.get("ranking", "0")),
                "contribution_points": str(data.get("contributionPoints", "0")),
            }
            return result
        else:
            print(f"Failed to fetch LeetCode data for {user_name}: {response.status_code}")
            return {"error": "Failed to fetch LeetCode data"}
    except Exception as e:
        print(f"Error fetching LeetCode data for {user_name}: {str(e)}")
        return {"error": str(e)}
# Function to scrape HackerRank data
def fetch_hackerrank_data(user_name):
    response = requests.get(f"https://www.hackerrank.com/{user_name}")
    soup = BeautifulSoup(response.text, "html.parser")
    badges = len(soup.find_all("div", class_="badge-card")) if soup.find_all("div", class_="badge-card") else "0"
    return {"badges": badges}

# Function to handle LinkedIn (Placeholder)
def fetch_linkedin_data(user_name):
    return {"status": "LinkedIn scraping requires authentication"}

def get_existing_integrations(user_id):
    response = supabase.table("users").select("integrations").eq("id", user_id).single().execute()
    data = response.data  # Access the 'data' attribute correctly
    if data and data.get("integrations") is not None:
        return data.get("integrations", {})  # Return integrations or empty dict
    return {}  # Ensure it always returns a dictionary



# Function to update integrations data in Supabase
def update_integrations(user_id, platform, new_data):
    existing_data = get_existing_integrations(user_id)  # Fetch current integrations

    # Update only the specific platform's data
    existing_data[platform] = new_data

    # Push updated JSON back to Supabase
    response = supabase.table("users").update({"integrations": existing_data}).eq("id", user_id).execute()

    return response

import traceback  # Add this import at the top of your file

@app.route('/integrate/<platform>', methods=['POST'])
def integrate(platform):
    try:
        data = request.json
        user_id = data.get('user_id')
        user_name = data.get('username')
        print(f"User ID: {user_id}, Username: {user_name}, Platform: {platform}")
        if not user_id or not user_name:
            return jsonify({"error": "Missing user_id or username"}), 400

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
            return jsonify({"error": "Invalid platform"}), 400

        # Update Supabase with new data
        update_response = update_integrations(user_id, platform, result)

        if update_response.data:  # Check if data was successfully updated
            return jsonify({"success": True})  # Success response
        return jsonify({"error": "Failed to update Supabase"}), 500


    except Exception as e:
        print(f"Error in /integrate/{platform}: {str(e)}")
        traceback.print_exc()  # Log the full traceback
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
