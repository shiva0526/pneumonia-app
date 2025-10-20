# app/routers/scan.py
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.deps import get_db, get_current_user
from app.ml.predict import predict_from_bytes
from app.utils.storage import save_file_local
from app.services.scan_service import create_scan, get_user_scans
from app.schemas.scan import ScanOut
import io

router = APIRouter(prefix="/scan", tags=["scan"])

@router.post("/predict", response_model=dict)
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        label, confidence, probs = predict_from_bytes(contents)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image or prediction failed")
    return {"prediction": label, "confidence": confidence, "probs": probs}

@router.post("/predict/save", response_model=ScanOut)
async def predict_and_save(file: UploadFile = File(...), db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    contents = await file.read()
    try:
        label, confidence, probs = predict_from_bytes(contents)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image or prediction failed")
    filename = save_file_local(contents, file.filename)
    scan = create_scan(db, current_user.id, filename, label, confidence, str(probs))
    # Map image_path to URL in response: we store filename; frontend should build URL: /uploads/scans/<filename>
    # But since ScanOut image_path is the filename, frontend can prefix server URL + /uploads/scans/
    return scan

@router.get("/history", response_model=list[ScanOut])
def history(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    scans = get_user_scans(db, current_user.id)
    return scans
