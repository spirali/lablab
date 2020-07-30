import flask
import argparse
import click

from lablab.service import start_service


@click.group()
def cli():
    pass


@cli.command()
@click.argument("path")
@click.option("--port", default=3800)
def serve(path, port):
    start_service(path, port)


if __name__ == "__main__":
    cli()

