from flask import Flask, current_app, jsonify, send_file
from flask_cors import CORS
from PIL import Image
from .utils import resize_image
import os

app = Flask(__name__)
CORS(app)

PREVIEW_SIZE = (40, 40)


@app.route('/images')
def get_images():
    return jsonify(current_app.images)


@app.route("/preview/<int:img_id>")
def get_preview(img_id):
    img = current_app.images[img_id]
    data_io = resize_image(img["path"], PREVIEW_SIZE)
    data_io.seek(0)
    return send_file(data_io, "image/png")


@app.route("/image/<int:img_id>")
def get_image(img_id):
    img = current_app.images[img_id]
    path = os.path.abspath(img["path"])
    return send_file(path)


def start(root_path, images):
    app.images = images
    app.run(port=3800)