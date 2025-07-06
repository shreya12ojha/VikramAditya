import json
import re

def clean_text(text):
    # Remove common boilerplate using regex
    patterns = [
        r"Skip to main Content.*?Home Missions",  # Remove top navigation
        r"Website owned and maintained by.*?FAQs",  # Remove footer
        r"Ver \d+\.\d+;.*?Web-Srv-[A-Za-z]+",  # Remove version/server info
        r"SignUp Login Logout",  # Remove account menu
        r"Search Search Follow Us",  # Remove social menu
        r"©\s*[\d\-]+.*?All rights reserved",  # Copyrights
    ]

    for pattern in patterns:
        text = re.sub(pattern, '', text, flags=re.DOTALL | re.IGNORECASE)

    # Remove excessive whitespace and line breaks
    text = re.sub(r'\s+', ' ', text).strip()

    return text

# Load cleaned_data.json
with open("cleaned_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Clean each entry
for entry in data:
    content = entry.get("content", "")
    entry["content"] = clean_text(content)

# Save the cleaned output
with open("cleaned_data_stripped.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✅ cleaned_data_stripped.json has been created successfully.")
