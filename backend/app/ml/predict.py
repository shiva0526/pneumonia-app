# app/ml/predict.py
import io
import numpy as np
from PIL import Image
# from tensorflow.keras.preprocessing.image import img_to_array
# from tensorflow.keras.models import load_model
from tensorflow import keras

# Configuration
MODEL_PATH = "app/ml/chest_xray_cnn_model.keras"
CLASS_NAMES = ['NORMAL', 'BACTERIAL', 'VIRAL']
IMG_SIZE = 150
CONFIDENCE_THRESHOLD = 0.6

# Load the model once at import time
model = keras.models.load_model(MODEL_PATH)

def predict_from_bytes(file_bytes):
    """
    Takes image bytes, preprocesses, predicts, and returns label, confidence, and full probabilities.
    """
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE))
    arr = keras.preprocessing.image.img_to_array(img) / 255.0
    arr = np.expand_dims(arr, axis=0)

    prediction = model.predict(arr)[0]
    class_index = np.argmax(prediction)
    confidence = float(np.max(prediction))

    # Handle uncertain predictions (non-chest X-rays)
    if confidence < CONFIDENCE_THRESHOLD:
        return "Uncertain / Unknown", confidence, prediction.tolist()

    return CLASS_NAMES[class_index], confidence, prediction.tolist()
