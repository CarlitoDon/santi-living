
import os
import psycopg2
from urllib.parse import urlparse

# Let's get DATABASE_URL from .env.local
with open(".env.local") as f:
    for line in f:
        if line.startswith("DATABASE_URL="):
            db_url = line.split("=", 1)[1].strip().strip('"')

conn = psycopg2.connect(db_url)
cursor = conn.cursor()
cursor.execute("""
    SELECT event_id, event_type, source, medium, campaign, city, gclid, wbraid, gbraid, event_timestamp
    FROM lead_events
    ORDER BY event_timestamp DESC
    LIMIT 20
""")
columns = [desc[0] for desc in cursor.description]
rows = cursor.fetchall()
import json
print(json.dumps([dict(zip(columns, r)) for r in rows], default=str, indent=2))
cursor.close()
conn.close()
