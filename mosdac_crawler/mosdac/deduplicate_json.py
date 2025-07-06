import json
import hashlib

def hash_text(text):
    """Return MD5 hash of a string."""
    return hashlib.md5(text.encode('utf-8')).hexdigest()

# Load data from original file
with open("data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

seen_urls = set()
seen_content_hashes = set()
unique_items = []

for item in data:
    url = item.get("url", "").strip()
    content = item.get("content", "").strip()

    # Normalize content: lowercase + collapse whitespace
    normalized_content = ' '.join(content.lower().split())
    content_hash = hash_text(normalized_content)

    # Skip if duplicate URL or content
    if url in seen_urls or content_hash in seen_content_hashes:
        continue

    # Optional: skip entries with very small content (e.g., headers or templates)
    if len(normalized_content) < 100:
        continue

    seen_urls.add(url)
    seen_content_hashes.add(content_hash)
    unique_items.append(item)

# Write cleaned data
with open("cleaned_data.json", "w", encoding="utf-8") as f:
    json.dump(unique_items, f, ensure_ascii=False, indent=2)

print(f"✅ Original: {len(data)} entries → Cleaned: {len(unique_items)} unique entries.")
