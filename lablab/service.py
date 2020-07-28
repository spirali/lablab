from flask import Flask, current_app, jsonify, send_file
from flask_cors import CORS
from PIL import Image
from .utils import resize_image, atomic_write
import os
import json

app = Flask(__name__)
CORS(app)

PREVIEW_SIZE = (40, 40)


@app.route('/images')
def get_images():
    return jsonify(current_app.images)


@app.route("/preview/<int:img_id>")
def get_preview(img_id):
    img = current_app.images[img_id]
    img_path = os.path.abspath(os.path.join(current_app.root_path, img["path"]))
    data_io = resize_image(img_path, PREVIEW_SIZE)
    data_io.seek(0)
    return send_file(data_io, "image/png")


@app.route("/image/<int:img_id>")
def get_image(img_id):
    img = current_app.images[img_id]
    img_path = os.path.abspath(os.path.join(current_app.root_path, img["path"]))
    return send_file(img_path)


@app.route('/annotation/<int:img_id>', methods=["POST"])
def upload_image(img_id):
    img = current_app.images[img_id]
    img_path = os.path.abspath(os.path.join(current_app.root_path, img["path"]))
    target_path = img_path + ".lab"
    atomic_write(target_path, json.dumps("test"))
    return jsonify("Ok")


def start(root_path, images):
    app.images = images
    app.root_path = root_path
    app.run(port=3800)


