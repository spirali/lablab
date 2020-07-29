from flask import Flask, current_app, jsonify, send_file, request, abort
from flask_cors import CORS
from PIL import Image
from .utils import resize_image, atomic_write, check_extension
from .image import find_images
from .annotation import save_annotation
import os

app = Flask(__name__)
CORS(app)

PREVIEW_SIZE = (40, 40)

def _get_img_path(app, img_id):
    img = app.images[img_id]
    return os.path.abspath(os.path.join(app.root_path, img["path"]))

def _get_image_path(app, image_path):
    if check_extension(image_path):
        return os.path.abspath(os.path.join(app.root_path, image_path))
    else:
         abort(404)

@app.route('/images')
def get_images():
    images = find_images(current_app.root_path)
    return jsonify(images)


@app.route("/preview/<path:image_path>")
def get_preview(image_path):
    real_path = _get_image_path(current_app, image_path)
    data_io = resize_image(real_path, PREVIEW_SIZE)
    data_io.seek(0)
    return send_file(data_io, "image/png")


@app.route("/image/<path:image_path>")
def get_image(image_path):
    real_path = _get_image_path(current_app, image_path)
    return send_file(real_path)


@app.route('/annotation/<path:image_path>', methods=["POST"])
def upload_image(image_path):
    real_path = _get_image_path(current_app, image_path)
    target_path = real_path + ".lab"
    save_annotation(request.json, target_path, real_path)
    return jsonify("Ok")


def start(root_path):
    app.root_path = root_path
    app.run(port=3800)


