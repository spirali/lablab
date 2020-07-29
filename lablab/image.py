from .utils import check_extension
from .annotation import load_annotation
import os
from PIL import Image


def find_images(path):

    result = {}
    id_counter = 0
    for root, dirs, files in os.walk(path):
        root_path = os.path.relpath(root, path)
        for name in files:
            if check_extension(name):
                new_id = id_counter
                image_path = os.path.join(root_path, name)
                result[image_path] = load_image(new_id, path, image_path)
    return result


def load_image(new_id, root, image_path):
    real_path = os.path.abspath(os.path.join(root, image_path))
    img = Image.open(real_path)
    width, height = img.size

    image_info = {
        "id": new_id,
        "path": image_path,
        "width": width,
        "height": height,
    }

    lab_path = real_path + ".lab"
    if os.path.isfile(lab_path):
        image_info["annotation"] = load_annotation(lab_path, real_path)
        print(image_info)

    return image_info
