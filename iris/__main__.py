import os
import pathlib
import click
import uvicorn
from .database import create_session_base
from .config import Config

@click.group()
def main():
    pass


@main.command(help="Launch server")
@click.option("--folder", "-f", help="Folder to discover files")
@click.option("--host", "-h", help="Host address to run server on", default="127.0.0.1")
@click.option("--port", "-p", help="Port to run server on", default=5000)
def launch(folder: str, host: str, port: int):
    database_dir = pathlib.Path(
        os.path.join(os.getcwd(), folder, ".iris")
    )
    database_dir.mkdir(exist_ok=True, parents=True)
    database_file = pathlib.Path(os.path.join(database_dir, "data.db"))
    database_uri = f"sqlite:///{database_file}"
    engine = create_session_base(database_uri)

    from .utils.files import build_filelist, populate_db_with_filelist
    from .server import app
    from . import models

    if not database_file.exists():
        models.Base.metadata.create_all(bind=engine)
        filelist, all_tags = build_filelist(folder)
        print(f"Found {len(filelist)} files.")
        print("Populating database...")
        populate_db_with_filelist(filelist, all_tags)
    Config.DATABASE_URI = database_uri
    Config.FOLDER = folder
    uvicorn.run(app, host=host, port=port)

if __name__ == "__main__":
    launch()    
