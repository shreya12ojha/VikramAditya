import json
from neo4j import GraphDatabase

# 🔁 Replace with your actual details
URI = "neo4j+s://12189838.databases.neo4j.io"
USERNAME = "neo4j"
PASSWORD = "QA9B9pMD2QdyteqtntmUEDmzH9npyPuB2eJgGgGLE8A"

driver = GraphDatabase.driver(URI, auth=(USERNAME, PASSWORD))

def create_page(tx, url, title, content):
    tx.run("""
        MERGE (p:Page {url: $url})
        SET p.title = $title,
            p.content = $content
    """, url=url, title=title, content=content)

# Load JSON data
with open("cleaned_data.json", "r", encoding="utf-8") as f:
    pages = json.load(f)

with driver.session() as session:
    for page in pages:
        url = page.get("url", "")
        title = page.get("title", "")
        content = page.get("content", "")
        session.write_transaction(create_page, url, title, content)

print("✅ Data import complete.")
