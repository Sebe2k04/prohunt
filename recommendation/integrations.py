from flask import Flask, request, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

app = Flask(__name__)
CORS(app)

def scrape_github_data(username):
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920x1080")

    driver = webdriver.Chrome(options=chrome_options)
    driver.get(f"https://github.com/{username}")

    wait = WebDriverWait(driver, 10)

    # Get total repositories count
    try:
        repo_count = wait.until(EC.presence_of_element_located((By.XPATH, "//a[contains(@href, '?tab=repositories')]/span"))).text
    except:
        repo_count = "Unknown"

    # Get contributions chart
    try:
        contribution_cells = driver.find_elements(By.XPATH, "//td[contains(@class, 'ContributionCalendar-day')]")
        contributions = [cell.get_attribute("data-count") or "0" for cell in contribution_cells]
    except:
        contributions = []

    # Get repositories and their data
    driver.get(f"https://github.com/{username}?tab=repositories")

    try:
        repo_elements = wait.until(EC.presence_of_all_elements_located((By.XPATH, "//h3[@class='wb-break-all']/a")))
        repositories = [repo.text for repo in repo_elements]
    except:
        repositories = []

    repo_data = {}
    for repo in repositories:
        driver.get(f"https://github.com/{username}/{repo}")

        try:
            recent_commit = wait.until(EC.presence_of_element_located((By.XPATH, "//relative-time"))).get_attribute("datetime")
        except:
            recent_commit = "No commits found"

        try:
            total_commits = driver.find_element(By.XPATH, "//span[@class='d-none d-sm-inline']/strong").text
        except:
            total_commits = "Unknown"

        repo_data[repo] = {
            "Recent Commit": recent_commit,
            "Total Commits": total_commits
        }

    driver.quit()
    
    return {
        "username": username,
        "total_repos": repo_count,
        "contributions_chart": contributions,
        "repositories": repo_data
    }

@app.route('/integrate/github', methods=['POST'])
def integrate_github():
    data = request.get_json()
    username = data.get('username')

    if not username:
        return jsonify({"error": "Username is required"}), 400

    github_data = scrape_github_data(username)
    return jsonify(github_data)

if __name__ == '__main__':
    app.run(debug=True)
