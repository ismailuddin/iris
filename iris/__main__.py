import os
import pathlib
import glob
import click
from iris import create_app
from iris.models.db import db
from iris.models.files import File
from iris.utils.files import build_filelist, populate_db_with_filelist


@click.group()
def main():
    pass


@main.command(help="Launch server")
@click.option("--folder", "-f", help="Folder to discover files")
@click.option("--extension", "-e", help="Extension to filter on", default=".png")
@click.option("--port", "-p", help="Port to run server on", default=5000)
def launch(folder: str, extension: str, port: int):
    database_dir = pathlib.Path(
        os.path.join(os.getcwd(), folder, ".iris")
    )
    database_dir.mkdir(exist_ok=True, parents=True)
    database_file = pathlib.Path(os.path.join(database_dir, "data.db"))
    glob_pattern = os.path.join(folder, "**", f"*{extension}")
    app = create_app(
        instance_path=os.path.join(folder),
        database_uri=f"sqlite:///{database_file}"
    )
    with app.app_context():
        if not database_file.exists():
            db.create_all()
            filelist = build_filelist(glob_pattern)
            print(f"Found {len(filelist)} files.")
            print("Populating database...")
            populate_db_with_filelist(filelist)

    app.run(host="0.0.0.0", port=port, debug=True)

if __name__ == "__main__":
    launch()