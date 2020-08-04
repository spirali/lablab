from glob import glob
import os
from lxml import etree
from .utils import find_image
from .annotation import save_annotation


def import_dir(path):
    abs_path = os.path.abspath(path)
    print("Imporing dir:", abs_path)
    for p in glob(os.path.join(abs_path, "**.xml")):
        base = p[:-4]
        image_path = find_image(base)
        if image_path is None:
            print("Image for {} not found".format(p))
            continue
        target = image_path + ".lab"
        if os.path.isfile(target):
            print("lab file for {} already exists".format(p))
            continue
        import_file(p, target, image_path)


def _import_point(id, element):
    bndbox = element.find("bndbox")
    xmin = float(bndbox.find("xmin").text)
    ymin = float(bndbox.find("ymin").text)
    xmax = float(bndbox.find("xmax").text)
    ymax = float(bndbox.find("ymax").text)
    x = (xmin + xmax) / 2
    y = (ymin + ymin) / 2
    return {"id": id, "x": x, "y": y}


def import_file(path, target_path, image_path):
    print("Importing: {}".format(path))
    try:
        root = etree.parse(path).getroot()
    except Exception as e:
        print("Invalid cannot parse file {}: {}".format(path, e))
        return

    objects = root.findall("object")
    if not objects:
        print("No objects")
        return

    items = [_import_point(i, element) for i, element in enumerate(objects)]

    annotation = {"items": items}
    save_annotation(annotation, target_path, image_path)
