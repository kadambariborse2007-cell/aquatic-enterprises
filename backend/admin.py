from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, EmailStr

from database import get_connection
from auth import verify_password, create_admin_token, decode_token

router = APIRouter(prefix="/admin", tags=["Admin"])


class AdminLoginData(BaseModel):
    email: EmailStr
    password: str


def require_admin(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Admin login required.")

    token = authorization.split(" ", 1)[1]

    try:
        payload = decode_token(token)

        if payload.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Admin access only.")

        email = payload.get("sub")

        with get_connection() as connection:
            admin = connection.execute(
                "SELECT id, name, email FROM admins WHERE email = %s",
                (email,)
            ).fetchone()

        if not admin:
            raise HTTPException(status_code=401, detail="Admin account not found.")

        return {
            "id": admin[0],
            "name": admin[1],
            "email": admin[2]
        }

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired admin token.")


@router.post("/login")
def admin_login(data: AdminLoginData):
    email = str(data.email).strip().lower()

    with get_connection() as connection:
        admin = connection.execute(
            """
            SELECT id, name, email, password_hash
            FROM admins
            WHERE email = %s
            """,
            (email,)
        ).fetchone()

    if not admin or not verify_password(data.password, admin[3]):
        raise HTTPException(status_code=401, detail="Invalid admin email or password.")

    token = create_admin_token(admin[2])

    return {
        "success": True,
        "message": "Admin login successful.",
        "access_token": token,
        "token_type": "bearer",
        "admin": {
            "id": admin[0],
            "name": admin[1],
            "email": admin[2]
        }
    }


@router.get("/me")
def admin_me(authorization: str = Header(None)):
    return require_admin(authorization)
