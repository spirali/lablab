import os
from io import BytesIO
from PIL import Image
import tempfile
import logging
import uuid


def find_images(path):
    extensions = [".png", ".jpeg", ".jpg"]
    result = {}
    id_counter = 0
    for root, dirs, files in os.walk(path):
        root_path = os.path.relpath(root, path)
        for name in files:
            if any(name.endswith(e) for e in extensions):
                new_id = id_counter
                id_counter += 1
                image_path = os.path.join(root_path, name)
                print(image_path)
                result[new_id] = load_image(new_id, path, image_path)
    return result


def load_image(new_id, root, image_path):
    path = os.path.abspath(os.path.join(root, image_path))
    img = Image.open(path)
    width, height = img.size
    return {
        "id": new_id,
        "path": image_path,
        "width": width,
        "height": height,
    }


def resize_image(path, new_size):
    img = Image.open(path)
    img = img.resize(new_size)
    temp = BytesIO()
    img.save(temp, format="png")
    return temp


def atomic_write(filename, content):
    tmp = None
    try:
        tmp = open(filename + uuid.uuid4().hex, "w")
        with tmp:
            tmp.write(content)
            tmp.flush()
            os.fsync(tmp.fileno())
        os.rename(tmp.name, filename)
        tmp = None
    finally:
        if tmp:
            os.unlink(tmp.name)