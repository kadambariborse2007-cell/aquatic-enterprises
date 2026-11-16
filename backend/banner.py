"""
Offers / announcement banner API.
One banner message that can be switched on or off from the dashboard.
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from admin import require_admin
from database import get_connection

router = APIRouter()

_table_ready = False


class BannerIn(BaseModel):
    message: str = Field(default="", max_length=200)
    link: str = Field(default="", max_length=255)
    active: bool = False


def _ensure_table(connection) -> None:
    global _table_ready
    if _table_ready:
        return

    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS site_banner (
            id      INTEGER PRIMARY KEY,
            message VARCHAR(200) NOT NULL DEFAULT '',
            link    VARCHAR(255) NOT NULL DEFAULT '',
            active  BOOLEAN NOT NULL DEFAULT FALSE
        )
        """
    )

    connection.execute(
        """
        INSERT INTO site_banner (id, message, link, active)
        VALUES (1, '', '', FALSE)
        ON CONFLICT (id) DO NOTHING
        """
    )

    connection.commit()
    _table_ready = True


def _server_error(label: str, error: Exception):
    print(f"{label}:", repr(error), flush=True)
    return HTTPException(
        status_code=500,
        detail="Something went wrong. Please try again."
    )


@router.get("/banner")
def get_banner():
    try:
        with get_connection() as connection:
            _ensure_table(connection)

            row = connection.execute(
                "SELECT message, link, active FROM site_banner WHERE id = 1"
            ).fetchone()
    except Exception as error:
        raise _server_error("Banner load error", error)

    return {"message": row[0], "link": row[1], "active": row[2]}


@router.put("/admin/banner", dependencies=[Depends(require_admin)])
def update_banner(body: BannerIn):
    message = body.message.strip()

    if body.active and not message:
        raise HTTPException(
            status_code=400,
            detail="Please type a message before switching the banner on."
        )

    try:
        with get_connection() as connection:
            _ensure_table(connection)

            connection.execute(
                """
                UPDATE site_banner
                SET message = %s, link = %s, active = %s
                WHERE id = 1
                """,
                (message, body.link.strip(), body.active),
            )

            connection.commit()
    except Exception as error:
        raise _server_error("Banner update error", error)

    return {"updated": True}