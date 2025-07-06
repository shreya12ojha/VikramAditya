import json
from neo4j import GraphDatabase
from difflib import SequenceMatcher

# 🔐 Neo4j credentials
URI = "neo4j+s://12189838.databases.neo4j.io"
USERNAME = "neo4j"
PASSWORD = "QA9B9pMD2QdyteqtntmUEDmzH9npyPuB2eJgGgGLE8A"

# 📂 Load cleaned and normalized JSON
with open("cleaned_data_stripped.json", "r", encoding="utf-8") as f:
    pages = json.load(f)

# 🧽 Normalization function
def normalize(text):
    return ' '.join(text.lower().replace('\n', ' ').split())

# 🤏 Fuzzy similarity threshold
def is_similar(text1, text2, threshold=0.7):
    return SequenceMatcher(None, text1, text2).ratio() > threshold

# 🧠 Neo4j: create relationship
def create_mentions(tx, source_url, target_url):
    tx.run("""
        MATCH (a:Page {url: $source_url})
        MATCH (b:Page {url: $target_url})
        MERGE (a)-[:MENTIONS]->(b)
    """, source_url=source_url, target_url=target_url)

# 🚀 Start driver
driver = GraphDatabase.driver(URI, auth=(USERNAME, PASSWORD))

with driver.session() as session:
    for i, source in enumerate(pages):
        source_url = source["url"]
        source_content = normalize(source["content"])

        for j, target in enumerate(pages):
            target_url = target["url"]
            if source_url == target_url:
                continue

            target_title = normalize(target["title"])

            if len(target_title) < 5:
                continue

            # Direct, keyword-based or fuzzy match
            if target_title in source_content or is_similar(target_title, source_content):
                print(f"🔗 MENTIONS: '{source_url}' → '{target_url}'")
                session.write_transaction(create_mentions, source_url, target_url)

driver.close()
