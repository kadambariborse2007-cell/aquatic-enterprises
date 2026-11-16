"""
Image upload API (admin and staff only).
Saved files go to backend/uploads and are served at /uploads/<name>.
"""
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from admin import require_admin

router = APIRouter()

UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

MAX_SIZE = 5 * 1024 * 1024  # 5 MB


def _image_extension(data: bytes) -> str | None:
    if data.startswith(b"\xff\xd8\xff"):
        return ".jpg"
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return ".png"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return ".webp"
    return None


@router.post("/admin/upload-image", dependencies=[Depends(require_admin)])
async def upload_image(file: UploadFile = File(...)):
    data = await file.read(MAX_SIZE + 1)

    if len(data) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="Image must be under 5 MB.")

    extension = _image_extension(data)

    if extension is None:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG or WEBP images are allowed."
        )

    name = f"{uuid.uuid4().hex}{extension}"
    (UPLOAD_DIR / name).write_bytes(data)

    return {"path": f"/uploads/{name}"}