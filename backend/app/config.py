# app/config.py
from pathlib import Path
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

DATABASE_URL = config("DATABASE_URL")
SECRET_KEY = config("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(config("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
REFRESH_TOKEN_EXPIRE_MINUTES = int(config("REFRESH_TOKEN_EXPIRE_MINUTES", 60*24*7))
UPLOAD_DIR = config("UPLOAD_DIR", str(BASE_DIR / "uploads" / "scans"))
MODEL_PATH = config("MODEL_PATH", str(BASE_DIR / "ml" / "chest_xray_cnn_model.keras"))
