import os
from io import BytesIO
from PIL import Image


def find_images(path):
    extensions = [".png", ".jpeg", ".jpg"]
    result = {}
    id_counter = 0
    for root, dirs, files in os.walk(path):
        for name in files:
            if any(name.endswith(e) for e in extensions):
                new_id = id_counter
                id_counter += 1
                result[new_id] = (load_image(new_id, os.path.join(root, name)))
    return result


def load_image(new_id, path):
    img = Image.open(path)
    width, height = img.size
    return {
        "id": new_id,
        "path": path,
        "width": width,
        "height": height,
    }


def resize_image(path, new_size):
    img = Image.open(path)
    img = img.resize(new_size)
    temp = BytesIO()
    img.save(temp, format="png")
    return temp