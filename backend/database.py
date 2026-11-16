import os
import psycopg
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))


def get_connection():
    database_url = os.getenv("DATABASE_URL")
    password = os.getenv("DB_PASSWORD")

    if not database_url:
        raise RuntimeError("DATABASE_URL is not set.")

    # Local: DB_PASSWORD alag se de sakte ho.
    # Neon/Render: password already DATABASE_URL ke andar hota hai.
    if password:
        return psycopg.connect(database_url, password=password)

    return psycopg.connect(database_url)