import os
from io import BytesIO
from PIL import Image
import tempfile
import logging
import uuid
import hashlib


IMAGE_EXTENSIONS = [".png", ".jpeg", ".jpg"]


def check_extension(path):
    return any(path.endswith(e) for e in IMAGE_EXTENSIONS)


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


def hash_file(filename):
    BUFFER_SIZE = 1 << 23  # 8MB
    hasher = hashlib.sha256()
    with open(filename, "rb") as f:
        while True:
            data = f.read(BUFFER_SIZE)
            if not data:
                break
            hasher.update(data)
    return hasher.hexdigest()
