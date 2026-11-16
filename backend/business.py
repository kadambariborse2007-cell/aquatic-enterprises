"""
Business details API (phone, WhatsApp, email, address, working hours).
The table is created automatically and filled once with the current details.
"""
import re

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from admin import require_admin
from database import get_connection

router = APIRouter()

_table_ready = False

DEFAULTS = {
    "phone": "+91 9220770110",
    "whatsapp": "919220770110",
    "email": "aquaticajay@gmail.com",
    "address": "Ganpatipada, Old Thane-Belapur Road, Near Hindalco Company, Opp. Vitawa, Thane - 400605",
    "working_hours": "",
}


class BusinessIn(BaseModel):
    phone: str = Field(min_length=5, max_length=40)
    whatsapp: str = Field(min_length=5, max_length=40)
    email: str = Field(min_length=3, max_length=120)
    address: str = Field(default="", max_length=400)
    working_hours: str = Field(default="", max_length=200)


def _ensure_table(connection) -> None:
    global _table_ready
    if _table_ready:
        return

    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS business_settings (
            id            INTEGER PRIMARY KEY,
            phone         VARCHAR(40)  NOT NULL DEFAULT '',
            whatsapp      VARCHAR(40)  NOT NULL DEFAULT '',
            email         VARCHAR(120) NOT NULL DEFAULT '',
            address       VARCHAR(400) NOT NULL DEFAULT '',
            working_hours VARCHAR(200) NOT NULL DEFAULT ''
        )
        """
    )

    connection.execute(
        """
        INSERT INTO business_settings
        (id, phone, whatsapp, email, address, working_hours)
        VALUES (1, %s, %s, %s, %s, %s)
        ON CONFLICT (id) DO NOTHING
        """,
        (
            DEFAULTS["phone"],
            DEFAULTS["whatsapp"],
            DEFAULTS["email"],
            DEFAULTS["address"],
            DEFAULTS["working_hours"],
        ),
    )

    connection.commit()
    _table_ready = True


def _server_error(label: str, error: Exception):
    print(f"{label}:", repr(error), flush=True)
    return HTTPException(
        status_code=500,
        detail="Something went wrong. Please try again."
    )


@router.get("/business")
def get_business():
    try:
        with get_connection() as connection:
            _ensure_table(connection)

            row = connection.execute(
                """
                SELECT phone, whatsapp, email, address, working_hours
                FROM business_settings WHERE id = 1
                """
            ).fetchone()
    except Exception as error:
        raise _server_error("Business load error", error)

    return {
        "phone": row[0],
        "whatsapp": row[1],
        "email": row[2],
        "address": row[3],
        "working_hours": row[4],
    }


@router.put("/admin/business", dependencies=[Depends(require_admin)])
def update_business(body: BusinessIn):
    # wa.me links need digits only (country code included, no + or spaces)
    whatsapp = re.sub(r"\D", "", body.whatsapp)

    if len(whatsapp) < 10:
        raise HTTPException(
            status_code=400,
            detail="WhatsApp number must include the country code, for example 919220770110."
        )

    try:
        with get_connection() as connection:
            _ensure_table(connection)

            connection.execute(
                """
                UPDATE business_settings
                SET phone = %s, whatsapp = %s, email = %s,
                    address = %s, working_hours = %s
                WHERE id = 1
                """,
                (
                    body.phone.strip(),
                    whatsapp,
                    body.email.strip(),
                    body.address.strip(),
                    body.working_hours.strip(),
                ),
            )

            connection.commit()
    except Exception as error:
        raise _server_error("Business update error", error)

    return {"updated": True}