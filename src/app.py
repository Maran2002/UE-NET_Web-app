from flask import Flask, request, jsonify
import tensorflow as tf
from flask_cors import CORS
from PIL import Image
import io
import numpy as np
import os
os.environ["SM_FRAMEWORK"] = "tf.keras"
import segmentation_models as sm
from segmentation_models import Unet
sm.set_framework('tf.keras')
sm.framework()


app = Flask(__name__)
CORS(app)
# Load the U-Net model with EfficientNetB3
model = Unet('efficientnetb3', input_shape=(256, 256, 3), activation='softmax', classes=3)
model.load_weights('models/model.h5')

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    img = Image.open(io.BytesIO(file.read()))
    img = img.resize((256, 256))
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)

    preds = model.predict(img)
    preds_test_thresh = np.argmax(preds, axis=-1).astype(np.uint8)
    mask = preds_test_thresh[0, :, :].tolist()

    return jsonify({'prediction': mask})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)
