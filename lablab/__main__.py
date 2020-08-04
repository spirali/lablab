import flask
import argparse
import click

from lablab.service import start_service
import lablab.importing


@click.group()
def cli():
    pass


@cli.command()
@click.argument("path")
@click.option("--port", default=3800)
def serve(path, port):
    start_service(path, port)


@cli.command("import")
@click.argument("path")
def import_dir(path):
    lablab.importing.import_dir(path)


if __name__ == "__main__":
    cli()
