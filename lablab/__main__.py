import flask
import argparse

from lablab.service import start
from lablab.utils import find_images


def parse_args():
    parser = argparse.ArgumentParser(description="image labeller")
    parser.add_argument('path')
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    print("Searching for images ...")
    images = find_images(args.path)
    print("{} images found".format(len(images)))
    start(args.path, images)

