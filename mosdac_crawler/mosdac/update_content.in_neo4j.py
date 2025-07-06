import json
from neo4j import GraphDatabase

# 🔐 Neo4j credentials
URI = "neo4j+s://12189838.databases.neo4j.io"
USERNAME = "neo4j"
PASSWORD = "QA9B9pMD2QdyteqtntmUEDmzH9npyPuB2eJgGgGLE8A"

driver = GraphDatabase.driver(URI, auth=(USERNAME, PASSWORD))

def update_content(tx, url, cleaned_content):
    tx.run("""
        MATCH (p:Page {url: $url})
        SET p.content = $content
    """, url=url, content=cleaned_content)

# 🔄 Load cleaned content
with open("cleaned_data_stripped.json", "r", encoding="utf-8") as f:
    pages = json.load(f)

with driver.session() as session:
    for page in pages:
        session.write_transaction(update_content, page["url"], page["content"])

print("✅ Neo4j content updated with cleaned text.")
