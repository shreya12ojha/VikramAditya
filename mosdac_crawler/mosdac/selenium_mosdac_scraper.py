from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select
import time
import json

# Setup headless Chrome
options = Options()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(options=options)

# Visit MOSDAC site
driver.get("https://www.mosdac.gov.in/")

time.sleep(5)  # Wait for JS to load

# Example: Navigate dropdown
try:
    # You'll need to inspect the dropdown element ID or class
    dropdown = Select(driver.find_element("id", "productSelect"))  # Replace with actual ID

    results = []

    for option in dropdown.options:
        print(f"Selected: {option.text}")
        dropdown.select_by_visible_text(option.text)
        time.sleep(3)  # Wait for content to update

        # Collect data from the page (simplified here)
        title = driver.title
        url = driver.current_url
        body = driver.find_element("tag name", "body").text

        results.append({
            "title": title,
            "url": url,
            "content": body.strip()
        })

    # Save results
    with open("selenium_data.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

except Exception as e:
    print("Error:", e)

finally:
    driver.quit()
