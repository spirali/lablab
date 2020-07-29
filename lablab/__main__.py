import flask
import argparse

from lablab.service import start


def parse_args():
    parser = argparse.ArgumentParser(description="image labeller")
    parser.add_argument('path')
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    start(args.path)

