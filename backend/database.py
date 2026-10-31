import os
import psycopg
from dotenv import load_dotenv

load_dotenv()

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
def get_connection():
    database_url = os.getenv("DATABASE_URL")
    password = os.getenv("DB_PASSWORD")

    if not database_url:
        raise RuntimeError("DATABASE_URL is not set.")

    if not password:
        raise RuntimeError("DB_PASSWORD is not set.")

    return psycopg.connect(
        database_url,
        password=password
    )