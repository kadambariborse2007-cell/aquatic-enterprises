
"""
Customer reviews API (FastAPI + PostgreSQL).

Flow: visitor submits a review -> saved as "pending" -> admin approves it ->
only "approved" reviews appear on the website.

Admin endpoints use the existing JWT authentication from admin.py.
"""

import time
from collections import defaultdict, deque
from typing import Literal, Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, ConfigDict, Field

from database import get_connection
from admin import require_admin

router = APIRouter()

# ---------- table (created automatically on first use) ----------
_table_ready = False


def _ensure_table(connection) -> None:
    global _table_ready
    if _table_ready:
        return

    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS reviews (
            id         SERIAL PRIMARY KEY,
            name       VARCHAR(80) NOT NULL,
            rating     SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
            comment    TEXT NOT NULL,
            status     VARCHAR(10) NOT NULL DEFAULT 'pending',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
    )
    connection.commit()
    _table_ready = True


# ---------- schemas ----------
class ReviewIn(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=2, max_length=80)
    rating: int = Field(ge=1, le=5)
    comment: str = Field(min_length=5, max_length=1000)


class StatusIn(BaseModel):
    status: Literal["pending", "approved", "rejected"]


# ---------- spam protection: 3 reviews per IP per hour ----------
RATE_LIMIT = 3
RATE_WINDOW = 3600
_recent = defaultdict(deque)


def _check_rate_limit(ip: str) -> None:
    now = time.time()
    queue = _recent[ip]

    while queue and now - queue[0] > RATE_WINDOW:
        queue.popleft()

    if len(queue) >= RATE_LIMIT:
        raise HTTPException(
            status_code=429,
            detail="Too many reviews. Please try again later."
        )

    queue.append(now)


# ---------- response formatting ----------
def _to_dict(row, with_status: bool = False) -> dict:
    data = {
        "id": row[0],
        "name": row[1],
        "rating": row[2],
        "comment": row[3],
    }

    if with_status:
        data["status"] = row[4]
        data["created_at"] = row[5].isoformat()
    else:
        data["created_at"] = row[4].isoformat()

    return data


def _server_error(label: str, error: Exception):
    print(f"{label}:", repr(error), flush=True)
    return HTTPException(
        status_code=500,
        detail="Something went wrong. Please try again."
    )


# ---------- public endpoints ----------
@router.post("/reviews", status_code=201)
def create_review(review: ReviewIn, request: Request):
    ip = request.client.host if request.client else "unknown"
    _check_rate_limit(ip)

    try:
        with get_connection() as connection:
            _ensure_table(connection)

            connection.execute(
                "INSERT INTO reviews (name, rating, comment) VALUES (%s, %s, %s)",
                (review.name, review.rating, review.comment),
            )

            connection.commit()

    except Exception as error:
        raise _server_error("Review submit error", error)

    return {
        "message": "Thank you! Your review will appear after approval."
    }


@router.get("/reviews")
def list_approved_reviews(limit: int = 50):
    limit = max(1, min(limit, 100))

    try:
        with get_connection() as connection:
            _ensure_table(connection)

            rows = connection.execute(
                "SELECT id, name, rating, comment, created_at FROM reviews "
                "WHERE status = 'approved' ORDER BY created_at DESC LIMIT %s",
                (limit,),
            ).fetchall()

    except Exception as error:
        raise _server_error("Review list error", error)

    return [_to_dict(row) for row in rows]


@router.get("/reviews/summary")
def reviews_summary():
    try:
        with get_connection() as connection:
            _ensure_table(connection)

            rows = connection.execute(
                "SELECT rating, COUNT(*) FROM reviews "
                "WHERE status = 'approved' GROUP BY rating"
            ).fetchall()

    except Exception as error:
        raise _server_error("Review summary error", error)

    breakdown = {str(star): 0 for star in range(1, 6)}

    for rating, total in rows:
        breakdown[str(rating)] = total

    count = sum(breakdown.values())

    average = (
        round(
            sum(
                int(star) * total
                for star, total in breakdown.items()
            ) / count,
            1
        )
        if count
        else 0
    )

    return {
        "average": average,
        "count": count,
        "breakdown": breakdown
    }


# ---------- admin endpoints (JWT authentication required) ----------
@router.get(
    "/admin/reviews",
    dependencies=[Depends(require_admin)]
)
def admin_list_reviews(status: Optional[str] = None):
    query = (
        "SELECT id, name, rating, comment, status, created_at FROM reviews"
    )

    params = ()

    if status:
        query += " WHERE status = %s"
        params = (status,)

    query += " ORDER BY created_at DESC"

    try:
        with get_connection() as connection:
            _ensure_table(connection)

            rows = connection.execute(query, params).fetchall()

    except Exception as error:
        raise _server_error("Admin review list error", error)

    return [_to_dict(row, with_status=True) for row in rows]


@router.patch(
    "/admin/reviews/{review_id}",
    dependencies=[Depends(require_admin)]
)
def admin_set_status(review_id: int, body: StatusIn):
    try:
        with get_connection() as connection:
            _ensure_table(connection)

            result = connection.execute(
                "UPDATE reviews SET status = %s WHERE id = %s",
                (body.status, review_id),
            )

            updated = result.rowcount
            connection.commit()

    except Exception as error:
        raise _server_error("Admin review update error", error)

    if updated == 0:
        raise HTTPException(
            status_code=404,
            detail="Review not found."
        )

    return {
        "id": review_id,
        "status": body.status
    }


@router.delete(
    "/admin/reviews/{review_id}",
    dependencies=[Depends(require_admin)]
)
def admin_delete_review(review_id: int):
    try:
        with get_connection() as connection:
            _ensure_table(connection)

            result = connection.execute(
                "DELETE FROM reviews WHERE id = %s",
                (review_id,),
            )

            deleted = result.rowcount
            connection.commit()

    except Exception as error:
        raise _server_error("Admin review delete error", error)

    if deleted == 0:
        raise HTTPException(
            status_code=404,
            detail="Review not found."
        )

    return {
        "deleted": review_id
    }
