
import os

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

from database import get_connection
from auth import (
    hash_password,
    verify_password,
    create_token,
    decode_token,
)


# --------------------------------------------------
# FASTAPI APPLICATION
# --------------------------------------------------

app = FastAPI(title="Aquatic Enterprises API")


# --------------------------------------------------
# CORS CONFIGURATION
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# HOME & HEALTH CHECK
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Aquatic Enterprises backend is running!"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get("/db-health")
def database_health_check():

    print(
        "DATABASE_URL set:",
        bool(os.getenv("DATABASE_URL"))
    )

    print(
        "DB_PASSWORD set:",
        bool(os.getenv("DB_PASSWORD"))
    )

    try:
        with get_connection() as connection:

            result = connection.execute(
                "SELECT current_database()"
            ).fetchone()

        return {
            "status": "connected",
            "database": result[0]
        }

    except Exception as error:

        print("Database error:", repr(error), flush=True)

        raise HTTPException(
            status_code=500,
            detail="Database connection failed."
        )


# --------------------------------------------------
# REQUEST MODELS
# --------------------------------------------------

class RegisterData(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    password: str


class LoginData(BaseModel):
    email: EmailStr
    password: str


class EnquiryData(BaseModel):
    enquiry_type: str
    full_name: str
    email: EmailStr
    phone: str
    company: str | None = None
    message: str


# --------------------------------------------------
# CUSTOMER REGISTRATION
# --------------------------------------------------

@app.post("/register")
def register(data: RegisterData):

    email = str(data.email).strip().lower()

    if len(data.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters."
        )

    try:
        with get_connection() as connection:

            exists = connection.execute(
                "SELECT id FROM customers WHERE email = %s",
                (email,)
            ).fetchone()

            if exists:
                raise HTTPException(
                    status_code=400,
                    detail="Email already registered."
                )

            connection.execute(
                """
                INSERT INTO customers
                (name, email, phone, password_hash)
                VALUES (%s, %s, %s, %s)
                """,
                (
                    data.name.strip(),
                    email,
                    data.phone,
                    hash_password(data.password)
                )
            )

            connection.commit()

        return {
            "token": create_token(email),
            "name": data.name.strip()
        }

    except HTTPException:
        raise

    except Exception as error:

        print("Registration error:", repr(error))

        raise HTTPException(
            status_code=500,
            detail="Unable to register customer."
        )


# --------------------------------------------------
# CUSTOMER LOGIN
# --------------------------------------------------

@app.post("/login")
def login(data: LoginData):

    email = str(data.email).strip().lower()

    try:
        with get_connection() as connection:

            row = connection.execute(
                """
                SELECT name, password_hash
                FROM customers
                WHERE email = %s
                """,
                (email,)
            ).fetchone()

        if not row or not verify_password(
            data.password,
            row[1]
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password."
            )

        return {
            "token": create_token(email),
            "name": row[0]
        }

    except HTTPException:
        raise

    except Exception as error:

        print("Login error:", repr(error))

        raise HTTPException(
            status_code=500,
            detail="Unable to login. Please try again."
        )


# --------------------------------------------------
# GET LOGGED-IN CUSTOMER PROFILE
# --------------------------------------------------

@app.get("/me")
def me(
    authorization: str | None = Header(default=None)
):

    if not authorization or not authorization.startswith("Bearer "):

        raise HTTPException(
            status_code=401,
            detail="Not logged in."
        )

    try:
        payload = decode_token(
            authorization.split(" ", 1)[1]
        )

    except Exception:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token."
        )

    try:
        with get_connection() as connection:

            row = connection.execute(
                """
                SELECT name, email, phone
                FROM customers
                WHERE email = %s
                """,
                (payload["sub"],)
            ).fetchone()

        if not row:

            raise HTTPException(
                status_code=401,
                detail="User not found."
            )

        return {
            "name": row[0],
            "email": row[1],
            "phone": row[2]
        }

    except HTTPException:
        raise

    except Exception as error:

        print("Profile error:", repr(error))

        raise HTTPException(
            status_code=500,
            detail="Unable to load customer profile."
        )


# --------------------------------------------------
# CUSTOMER ENQUIRY SUBMISSION
# --------------------------------------------------

@app.post("/enquiries")
def create_enquiry(data: EnquiryData):

    try:

        with get_connection() as connection:

            connection.execute(
                """
                INSERT INTO enquiries
                (
                    enquiry_type,
                    full_name,
                    email,
                    phone,
                    company,
                    message
                )
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    data.enquiry_type.strip(),
                    data.full_name.strip(),
                    str(data.email).strip().lower(),
                    data.phone.strip(),
                    data.company.strip() if data.company else None,
                    data.message.strip()
                )
            )

            connection.commit()

        return {
            "success": True,
            "message": "Your enquiry has been submitted successfully."
        }

    except Exception as error:

        print("Enquiry submission error:", repr(error))

        raise HTTPException(
            status_code=500,
            detail="Unable to save your enquiry. Please try again."
        )
