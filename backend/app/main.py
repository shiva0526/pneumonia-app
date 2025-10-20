# app/main.py
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.database import Base, engine
from app.config import UPLOAD_DIR
from app.routers import auth as auth_router, scan as scan_router

# create tables (for dev). For migrations, use Alembic.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pneumonia Detector API")

# serve uploaded images at /uploads/scans/<filename>
# UPLOAD_DIR should point to backend/uploads/scans
app.mount("/uploads/scans", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.include_router(auth_router.router)
app.include_router(scan_router.router)
