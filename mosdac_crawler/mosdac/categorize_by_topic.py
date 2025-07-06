import json
import re
from collections import defaultdict

# Load sectioned data
with open("cleaned_data_stripped.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Define topic categories and keywords
TOPIC_MAP = {
    "Satellite": ["INSAT", "OCEANSAT", "SCATSAT", "SARAL", "KALPANA", "MEGHATROPIQUES"],
    "Radar": ["Radar", "DWR", "Reflectivity", "Velocity", "Volumetric", "Doppler"],
    "Forecast": ["Forecast", "Prediction", "Weather", "Ocean", "Current", "Wind", "Rainfall"],
    "Land": ["Soil", "Moisture", "Vegetation", "Land", "River", "Inland"],
    "Ocean": ["Sea", "Ocean", "Waves", "Salinity", "Eddies", "Coastal"],
    "Atmosphere": ["Cloud", "Humidity", "Temperature", "Vapour", "Rain", "Aerosol", "Precipitation"],
    "Access": ["Data Access", "Download", "Catalog", "Order", "Product"]
}

# Normalize and match
def get_categories(text):
    tags = set()
    for category, keywords in TOPIC_MAP.items():
        for kw in keywords:
            if re.search(rf"\b{re.escape(kw)}\b", text, re.IGNORECASE):
                tags.add(category)
    return sorted(tags)

# Process entries
categorized_data = []

for page in data:
    combined_text = page["title"] + " " + " ".join(
        sec["heading"] + " " + sec["text"] for sec in page.get("sections", [])
    )
    tags = get_categories(combined_text)
    page["categories"] = tags
    categorized_data.append(page)

# Save the enriched file
with open("cleaned_data_tagged.json", "w", encoding="utf-8") as f:
    json.dump(categorized_data, f, ensure_ascii=False, indent=2)

# Optional: group by category
grouped = defaultdict(list)
for entry in categorized_data:
    for tag in entry["categories"]:
        grouped[tag].append(entry)

# Save grouped categories
with open("categorized_by_topic.json", "w", encoding="utf-8") as f:
    json.dump(grouped, f, ensure_ascii=False, indent=2)

print("✅ Categorization complete. Files saved:")
print("• cleaned_data_tagged.json")
print("• categorized_by_topic.json")
