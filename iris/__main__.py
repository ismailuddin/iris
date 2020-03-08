import os
import pathlib
import glob
import click
from iris import app, db
from iris.models.files import File
from iris.utils.files import build_filelist, populate_db_with_filelist


@click.group()
def main():
    pass


@main.command(help="Launch server")
@click.option("--folder", "-f", help="Folder to discover files")
@click.option("--extension", "-e", help="Extension to filter on", default=".png")
def launch(folder: str, extension: str):
    database_dir = pathlib.Path(
        os.path.join(os.getcwd(), ".iris")
    )
    database_dir.mkdir(exist_ok=True, parents=True)
    database_file = pathlib.Path(os.path.join(database_dir, "data.db"))
    glob_pattern = os.path.join(folder, "**", f"*{extension}")
    if not database_file.exists():
        db.create_all()
        filelist = build_filelist(glob_pattern)
        print(f"Found {len(filelist)} files.")
        print("Populating database...")
        populate_db_with_filelist(filelist)

    app.config["INSTANCE_PATH"] = os.path.join(folder)
    app.run(host="0.0.0.0", debug=True)

if __name__ == "__main__":
    launch()