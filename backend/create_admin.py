from database import get_connection
from auth import hash_password
from getpass import getpass

name = input("Enter admin name: ").strip()
email = input("Enter admin email: ").strip().lower()
password = getpass("Create admin password: ")
confirm = getpass("Confirm admin password: ")

if not name or not email:
    raise SystemExit("Name and email are required.")

if len(password) < 8:
    raise SystemExit("Password must be at least 8 characters.")

if password != confirm:
    raise SystemExit("Passwords do not match.")

with get_connection() as connection:
    existing = connection.execute(
        "SELECT id FROM admins WHERE email = %s",
        (email,)
    ).fetchone()

    if existing:
        raise SystemExit("This admin email already exists.")

    connection.execute(
        """
        INSERT INTO admins (name, email, password_hash)
        VALUES (%s, %s, %s)
        """,
        (name, email, hash_password(password))
    )

print("SUCCESS: Admin account created!")
