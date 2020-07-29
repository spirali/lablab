from .utils import atomic_write, hash_file

from jsonschema import validate
import json


LABLAB_FORMAT_VERSION = "0"


POINT_SCHEMA = {
    "type" : "object",
    "properties" : {
        "id" : {"type" : "number"},
        "x" : {"type" : "number"},
        "y" : {"type" : "number"},
    },
    "additionalProperties": False,
    "required": ["id", "x", "y"]
}

ANNOTATION_SCHEMA = {
    "type" : "object",
    "properties" : {
        "items" : {
          "type": "array",
            "items": POINT_SCHEMA
        }
    },
    "additionalProperties": False,
    "required": ["items"]
}

def save_annotation(annotation, target_path, img_path):
    validate(annotation, ANNOTATION_SCHEMA)
    lab = {
        "version": LABLAB_FORMAT_VERSION,
        "hash": hash_file(img_path),
        "annotation": annotation
    }
    atomic_write(target_path, json.dumps(lab))


def load_annotation(target_path, image_path):
    with open(target_path, "r") as f:
        lab = json.loads(f.read())
    if lab["version"] != LABLAB_FORMAT_VERSION:
        raise Exception("Invalid version")

    image_hash = hash_file(image_path)
    if lab["hash"] != image_hash:
        raise Exception("Invalid hash")

    annotation = lab["annotation"]
    validate(annotation, ANNOTATION_SCHEMA)
    return annotation