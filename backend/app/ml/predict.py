# app/ml/predict.py
import io
from PIL import Image
import numpy as np
from tensorflow import keras  # Single, correct import for all Keras functions
from app.config import MODEL_PATH

IMG_SIZE = 150
CLASS_NAMES = ['NORMAL', 'BACTERIAL', 'VIRAL']
CONFIDENCE_THRESHOLD = 0.6

# Load model at import time (once) using the keras object
_model = keras.models.load_model(MODEL_PATH)

def predict_from_bytes(file_bytes: bytes):
    """
    Takes image bytes, preprocesses the image, and returns predictions.
    """
    # Open and prepare the image
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE))

    # Convert image to numpy array using the correct Keras utility path
    arr = keras.utils.img_to_array(img) / 255.0
    
    # Add a batch dimension for the model
    arr = np.expand_dims(arr, 0)
    
    # Get model predictions
    preds = _model.predict(arr)[0].tolist()  # list of floats
    
    # Process the prediction results
    idx = int(np.argmax(preds))
    confidence = float(preds[idx])
    
    # Determine the final label based on the confidence threshold
    label = CLASS_NAMES[idx] if confidence >= CONFIDENCE_THRESHOLD else "Uncertain / Unknown"
    
    return label, confidence, preds
