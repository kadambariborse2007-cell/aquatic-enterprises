"""
Image upload API (admin and staff only).
Images are stored on Cloudinary so they survive Render restarts.
"""
import io
import os
import uuid
from pathlib import Path

import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool

from admin import require_admin

router = APIRouter()

# Kept because main.py still serves old images from this folder.
UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

MAX_SIZE = 5 * 1024 * 1024  # 5 MB

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)


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

    if _image_extension(data) is None:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG or WEBP images are allowed."
        )

    try:
        result = await run_in_threadpool(
            cloudinary.uploader.upload,
            io.BytesIO(data),
            folder="aquatic-enterprises",
            public_id=uuid.uuid4().hex,
            resource_type="image",
        )
    except Exception as error:
        print("Cloudinary upload error:", repr(error), flush=True)
        raise HTTPException(
            status_code=500,
            detail="Image upload failed. Please try again."
        )

    return {"path": result["secure_url"]}