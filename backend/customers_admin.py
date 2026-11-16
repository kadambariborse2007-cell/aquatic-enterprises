from fastapi import APIRouter, HTTPException, Header

from database import get_connection
from auth import decode_token

router = APIRouter(prefix="/admin", tags=["admin-customers"])


def require_admin(authorization: str | None):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not logged in.")
    try:
        payload = decode_token(authorization.split(" ", 1)[1])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access only.")


@router.get("/customers")
def list_customers(authorization: str | None = Header(default=None)):
    require_admin(authorization)

    try:
        with get_connection() as connection:
            has_created = connection.execute(
                """
                SELECT 1 FROM information_schema.columns
                WHERE table_name = 'customers' AND column_name = 'created_at'
                """
            ).fetchone()

            if has_created:
                rows = connection.execute(
                    """
                    SELECT id, name, email, phone, created_at
                    FROM customers
                    ORDER BY created_at DESC
                    """
                ).fetchall()
            else:
                rows = connection.execute(
                    """
                    SELECT id, name, email, phone, NULL
                    FROM customers
                    ORDER BY id DESC
                    """
                ).fetchall()

        return [
            {
                "id": r[0],
                "name": r[1],
                "email": r[2],
                "phone": r[3],
                "created_at": r[4].isoformat() if r[4] else None,
            }
            for r in rows
        ]

    except HTTPException:
        raise
    except Exception as error:
        print("Customers list error:", repr(error))
        raise HTTPException(status_code=500, detail="Unable to load customers.")