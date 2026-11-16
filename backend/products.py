"""
Product catalogue API (categories + pump models).

Tables are created automatically on first use and filled once with the
starting data (copied from the website's categories.js).
"""
import re 
import json
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from admin import require_admin
from database import get_connection
router = APIRouter()

_tables_ready = False

STARTING_DATA = [
    {
        "slug": "borewell-submersible",
        "name": "Borewell Submersible Pumps",
        "image": "/images/borewell-submersible-pumps.jpg",
        "tagline": "Reliable water supply from deep borewells",
        "description": "Borewell submersible pumpsets sit deep inside the borewell and push water up to your tank. They are built for continuous use and are available for 75 mm and 100 mm borewells, in water-filled and oil-filled motor versions.",
        "price": "₹ 12,000 - 25,000",
        "highlights": [
            "Motor range from 0.5 HP to 3 HP",
            "Suitable for 75 mm and 100 mm borewells",
            "Water-filled and oil-filled motor options",
            "ISI marked and star rated models available",
            "Supplied with 3 metre cable and non-return valve (NRV)",
        ],
        "applications": ["Homes and bungalows", "Apartments and societies", "Farms and small irrigation"],
        "series": [
            {"name": "CORA 75 + UMAI", "hp": "0.5 – 1.5 HP", "info": "For 75 mm borewells, 210V single phase"},
            {"name": "CORA + LX PLUS", "hp": "0.5 – 2.0 HP", "info": "For 100 mm borewells, 220V, star rated models available"},
            {"name": "CORA + XUMA DX", "hp": "0.5 – 2.0 HP", "info": "For 100 mm borewells, 220V single phase"},
            {"name": "CORA + RLX", "hp": "0.5 – 2.0 HP", "info": "For 100 mm borewells, 220V single phase"},
            {"name": "CORA + UMN (Oil Filled)", "hp": "0.5 – 3.0 HP", "info": "For 100 mm borewells, oil filled motor"},
        ],
    },
    {
        "slug": "self-priming-monobloc",
        "name": "Monobloc & Domestic Pumps",
        "image": "/images/monobloc-domestic-pumps.jpg",
        "tagline": "Everyday water supply for your home",
        "description": "Monobloc pumps are compact surface pumps that lift water from a sump, tank or ground-level source to your overhead tank. Self-priming models start easily and are ideal for daily domestic use.",
        "price": "₹ 4,500 – 9,000",
        "highlights": [
            "Self-priming design for easy start-up",
            "0.5 HP to 1.5 HP for domestic models",
            "Compact and easy to install",
            "Durable body options: aluminium, die cast and cast iron",
            "Heavy-duty AGRIBLOC range available for farm use",
        ],
        "applications": ["Overhead tank filling", "Garden and lawn watering", "Small farm and plantation use"],
        "series": [
            {"name": "AQUA", "hp": "0.5 – 1.5 HP", "info": "Self-priming monobloc, 25x25 mm, 220V"},
            {"name": "CUTE PLUS", "hp": "0.5 – 1.0 HP", "info": "Compact mini monobloc, 240V"},
            {"name": "PERISTAR", "hp": "0.5 – 1.5 HP", "info": "Self-priming monobloc (V, SZX, GS, ZDX models)"},
            {"name": "PERIJET", "hp": "0.5 – 1.5 HP", "info": "Self-priming jet pump, 230V"},
            {"name": "TSJ", "hp": "1.0 HP", "info": "Two-stage jet pump"},
            {"name": "AGRIBLOC", "hp": "0.5 – 3.0 HP", "info": "Centrifugal monobloc for farm and heavy-duty use"},
        ],
    },
    {
        "slug": "booster",
        "name": "Booster & Pressure Systems",
        "image": "/images/booster-pressure-systems.jpg",
        "tagline": "Strong, steady water pressure at every tap",
        "description": "Booster systems raise the pressure of your existing water supply so showers, taps and upper floors get a strong, steady flow. Multistage models come with a pressure tank for smooth, quiet operation.",
        "price": "₹ 8,000 – 16,000",
        "highlights": [
            "Automatic start and stop with pressure control",
            "Multistage models with pressure tank",
            "0.5 HP to 2 HP options",
            "Suitable for multiple shower heads",
            "Quiet and energy-efficient operation",
        ],
        "applications": ["Bathrooms and showers", "Upper floors and duplexes", "Hotels, hostels and small buildings"],
        "series": [
            {"name": "MULTIBOOST", "hp": "0.5 – 2.0 HP", "info": "Multistage pressure booster system, 220V"},
            {"name": "PERIBOOST PLUS", "hp": "0.5 – 1.0 HP", "info": "Compact pressure booster, 220V"},
        ],
    },
    {
        "slug": "openwell-submersible",
        "name": "Openwell & Vertical Pumps",
        "image": "/images/openwell-vertical-pumps.jpg",
        "tagline": "Powerful pumping from open wells and tanks",
        "description": "Openwell submersible pumps work inside open wells, tanks and ponds. Horizontal monobloc and vertical multistage models are available, covering both high-flow irrigation needs and high-head domestic supply.",
        "price": "₹ 9,000 – 18,000",
        "highlights": [
            "Horizontal monobloc and vertical multistage designs",
            "0.5 HP to 2 HP options",
            "Single phase and three phase models",
            "Star rated and ISI marked models available",
            "Stainless steel models for long life",
        ],
        "applications": ["Open well water supply", "Irrigation and sprinklers", "Tank and pond pumping"],
        "series": [
            {"name": "OPAL i", "hp": "0.5 – 2.0 HP", "info": "Openwell submersible monobloc, star rated, 220V"},
            {"name": "MONOSUB R", "hp": "0.5 – 2.0 HP", "info": "Openwell submersible, single and three phase"},
            {"name": "MULTISUB", "hp": "1.0 – 1.5 HP", "info": "Vertical multistage openwell submersible, 240V"},
        ],
    },
    {
        "slug": "dewatering-sewage",
        "name": "Dewatering & Sewage Pumps",
        "image": "/images/dewatering-sewage-pumps.jpg",
        "tagline": "Tough pumps for drainage and wastewater",
        "description": "Dewatering and sewage pumps remove water from basements, pits and drains, and handle wastewater containing solids. Built with strong casings and large free passage to resist clogging.",
        "price": "₹ 10,000 – 22,000",
        "highlights": [
            "Handles dirty water and wastewater with solids",
            "Free passage from 10 mm up to 100 mm",
            "Float switch models for automatic operation",
            "Single phase and three phase options",
            "Strong, corrosion-resistant construction",
        ],
        "applications": ["Basement and parking drainage", "Sewage and drain pits", "Construction sites and sumps"],
        "series": [
            {"name": "AMA PORTER", "hp": "1.0 – 2.0 HP", "info": "Vertical dewatering pump, single and three phase"},
            {"name": "AMA DRAINER", "hp": "Not specified", "info": "Vertical dewatering pump, 230V"},
            {"name": "KSTP", "hp": "1.0 – 3.0 HP", "info": "Sewage submersible pump, 50 mm outlet"},
            {"name": "AMAREX IN", "hp": "1.1 – 5.6 HP", "info": "Wastewater submersible pump, three phase"},
            {"name": "KRTU", "hp": "1.5 – 12.7 HP", "info": "Non-clog submersible sewage pump"},
        ],
    },
]


def _ensure_tables(connection) -> None:
    global _tables_ready
    if _tables_ready:
        return

    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS categories (
            id           SERIAL PRIMARY KEY,
            slug         VARCHAR(80) UNIQUE NOT NULL,
            name         VARCHAR(120) NOT NULL,
            image        VARCHAR(255) NOT NULL DEFAULT '',
            tagline      VARCHAR(255) NOT NULL DEFAULT '',
            description  TEXT NOT NULL DEFAULT '',
            price        VARCHAR(80) NOT NULL DEFAULT '',
            highlights   JSONB NOT NULL DEFAULT '[]'::jsonb,
            applications JSONB NOT NULL DEFAULT '[]'::jsonb,
            sort_order   INTEGER NOT NULL DEFAULT 0
        )
        """
    )

    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS pump_models (
            id            SERIAL PRIMARY KEY,
            category_slug VARCHAR(80) NOT NULL
                REFERENCES categories(slug) ON UPDATE CASCADE ON DELETE CASCADE,
            name          VARCHAR(120) NOT NULL,
            hp            VARCHAR(60) NOT NULL DEFAULT '',
            info          VARCHAR(255) NOT NULL DEFAULT '',
            sort_order    INTEGER NOT NULL DEFAULT 0
        )
        """
    )

    count = connection.execute("SELECT COUNT(*) FROM categories").fetchone()[0]

    if count == 0:
        for order, category in enumerate(STARTING_DATA):
            connection.execute(
                """
                INSERT INTO categories
                (slug, name, image, tagline, description, price,
                 highlights, applications, sort_order)
                VALUES (%s, %s, %s, %s, %s, %s, %s::jsonb, %s::jsonb, %s)
                """,
                (
                    category["slug"],
                    category["name"],
                    category["image"],
                    category["tagline"],
                    category["description"],
                    category["price"],
                    json.dumps(category["highlights"]),
                    json.dumps(category["applications"]),
                    order,
                ),
            )

            for model_order, model in enumerate(category["series"]):
                connection.execute(
                    """
                    INSERT INTO pump_models
                    (category_slug, name, hp, info, sort_order)
                    VALUES (%s, %s, %s, %s, %s)
                    """,
                    (
                        category["slug"],
                        model["name"],
                        model["hp"],
                        model["info"],
                        model_order,
                    ),
                )

    connection.commit()
    _tables_ready = True


def _server_error(label: str, error: Exception):
    print(f"{label}:", repr(error), flush=True)
    return HTTPException(
        status_code=500,
        detail="Something went wrong. Please try again."
    )


def _load_categories(connection, slug=None) -> list:
    query = (
        "SELECT slug, name, image, tagline, description, price, "
        "highlights, applications FROM categories"
    )
    params = ()

    if slug:
        query += " WHERE slug = %s"
        params = (slug,)

    query += " ORDER BY sort_order, id"

    rows = connection.execute(query, params).fetchall()
    result = []

    for row in rows:
        models = connection.execute(
            "SELECT id, name, hp, info FROM pump_models "
            "WHERE category_slug = %s ORDER BY sort_order, id",
            (row[0],),
        ).fetchall()

        result.append(
            {
                "slug": row[0],
                "name": row[1],
                "image": row[2],
                "tagline": row[3],
                "description": row[4],
                "price": row[5],
                "highlights": row[6],
                "applications": row[7],
                "series": [
                    {"id": m[0], "name": m[1], "hp": m[2], "info": m[3]}
                    for m in models
                ],
            }
        )

    return result


# ---------- public endpoints ----------
@router.get("/categories")
def list_categories():
    try:
        with get_connection() as connection:
            _ensure_tables(connection)
            return _load_categories(connection)
    except Exception as error:
        raise _server_error("Category list error", error)


@router.get("/categories/{slug}")
def get_category(slug: str):
    try:
        with get_connection() as connection:
            _ensure_tables(connection)
            found = _load_categories(connection, slug)
    except Exception as error:
        raise _server_error("Category error", error)

    if not found:
        raise HTTPException(status_code=404, detail="Category not found.")

    return found[0]
# ---------- admin endpoints (admin and staff, JWT login required) ----------
class CategoryIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    image: str = Field(default="", max_length=255)
    tagline: str = Field(default="", max_length=255)
    description: str = Field(default="", max_length=2000)
    price: str = Field(default="", max_length=80)
    highlights: List[str] = []
    applications: List[str] = []


class ModelIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    hp: str = Field(default="", max_length=60)
    info: str = Field(default="", max_length=255)


def _clean_list(items: List[str]) -> List[str]:
    return [item.strip() for item in items if item.strip()]


@router.put(
    "/admin/categories/{slug}",
    dependencies=[Depends(require_admin)]
)
def admin_update_category(slug: str, body: CategoryIn):
    try:
        with get_connection() as connection:
            _ensure_tables(connection)

            result = connection.execute(
                """
                UPDATE categories
                SET name = %s, image = %s, tagline = %s, description = %s,
                    price = %s, highlights = %s::jsonb, applications = %s::jsonb
                WHERE slug = %s
                """,
                (
                    body.name.strip(),
                    body.image.strip(),
                    body.tagline.strip(),
                    body.description.strip(),
                    body.price.strip(),
                    json.dumps(_clean_list(body.highlights)),
                    json.dumps(_clean_list(body.applications)),
                    slug,
                ),
            )

            updated = result.rowcount
            connection.commit()

    except Exception as error:
        raise _server_error("Category update error", error)

    if updated == 0:
        raise HTTPException(status_code=404, detail="Category not found.")

    return {"updated": slug}


@router.post(
    "/admin/categories/{slug}/models",
    status_code=201,
    dependencies=[Depends(require_admin)]
)
def admin_add_model(slug: str, body: ModelIn):
    try:
        with get_connection() as connection:
            _ensure_tables(connection)

            exists = connection.execute(
                "SELECT 1 FROM categories WHERE slug = %s",
                (slug,),
            ).fetchone()

            if not exists:
                raise HTTPException(status_code=404, detail="Category not found.")

            new_id = connection.execute(
                """
                INSERT INTO pump_models (category_slug, name, hp, info, sort_order)
                VALUES (
                    %s, %s, %s, %s,
                    (SELECT COALESCE(MAX(sort_order), -1) + 1
                     FROM pump_models WHERE category_slug = %s)
                )
                RETURNING id
                """,
                (slug, body.name.strip(), body.hp.strip(), body.info.strip(), slug),
            ).fetchone()[0]

            connection.commit()

    except HTTPException:
        raise
    except Exception as error:
        raise _server_error("Model add error", error)

    return {"id": new_id}


@router.put(
    "/admin/models/{model_id}",
    dependencies=[Depends(require_admin)]
)
def admin_update_model(model_id: int, body: ModelIn):
    try:
        with get_connection() as connection:
            _ensure_tables(connection)

            result = connection.execute(
                "UPDATE pump_models SET name = %s, hp = %s, info = %s WHERE id = %s",
                (body.name.strip(), body.hp.strip(), body.info.strip(), model_id),
            )

            updated = result.rowcount
            connection.commit()

    except Exception as error:
        raise _server_error("Model update error", error)

    if updated == 0:
        raise HTTPException(status_code=404, detail="Model not found.")

    return {"updated": model_id}


@router.delete(
    "/admin/models/{model_id}",
    dependencies=[Depends(require_admin)]
)
def admin_delete_model(model_id: int):
    try:
        with get_connection() as connection:
            _ensure_tables(connection)

            result = connection.execute(
                "DELETE FROM pump_models WHERE id = %s",
                (model_id,),
            )

            deleted = result.rowcount
            connection.commit()

    except Exception as error:
        raise _server_error("Model delete error", error)

    if deleted == 0:
        raise HTTPException(status_code=404, detail="Model not found.")

    return {"deleted": model_id}
def _make_slug(connection, name: str) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-") or "category"
    slug = base
    number = 2

    while connection.execute(
        "SELECT 1 FROM categories WHERE slug = %s", (slug,)
    ).fetchone():
        slug = f"{base}-{number}"
        number += 1

    return slug


@router.post(
    "/admin/categories",
    status_code=201,
    dependencies=[Depends(require_admin)]
)
def admin_create_category(body: CategoryIn):
    try:
        with get_connection() as connection:
            _ensure_tables(connection)

            slug = _make_slug(connection, body.name.strip())

            connection.execute(
                """
                INSERT INTO categories
                (slug, name, image, tagline, description, price,
                 highlights, applications, sort_order)
                VALUES (
                    %s, %s, %s, %s, %s, %s, %s::jsonb, %s::jsonb,
                    (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM categories)
                )
                """,
                (
                    slug,
                    body.name.strip(),
                    body.image.strip(),
                    body.tagline.strip(),
                    body.description.strip(),
                    body.price.strip(),
                    json.dumps(_clean_list(body.highlights)),
                    json.dumps(_clean_list(body.applications)),
                ),
            )

            connection.commit()

    except Exception as error:
        raise _server_error("Category create error", error)

    return {"slug": slug}


@router.delete(
    "/admin/categories/{slug}",
    dependencies=[Depends(require_admin)]
)
def admin_delete_category(slug: str):
    try:
        with get_connection() as connection:
            _ensure_tables(connection)

            result = connection.execute(
                "DELETE FROM categories WHERE slug = %s",
                (slug,),
            )

            deleted = result.rowcount
            connection.commit()

    except Exception as error:
        raise _server_error("Category delete error", error)

    if deleted == 0:
        raise HTTPException(status_code=404, detail="Category not found.")

    return {"deleted": slug}