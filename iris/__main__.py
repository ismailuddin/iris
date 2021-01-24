import os
import pathlib
import click
import uvicorn
# from .models.db import db
# from .models.files import File
# from .models.config import ConfigValue
# from .utils.files import build_filelist, populate_db_with_filelist
from .database import create_session_base

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
    from . import app
    from . import models
    models.Base.metadata.create_all(bind=engine)
    # if not database_file.exists():
    #     db.create_all()
    # filelist, all_tags = build_filelist(folder)
    # print(f"Found {len(filelist)} files.")
    print("Populating database...")
    # populate_db_with_filelist(filelist, all_tags)
    # ConfigValue.set_database_file(uri=database_uri)
    # ConfigValue.set_folder(folder=folder)
    uvicorn.run(app, host=host, port=port)

if __name__ == "__main__":
    launch()    
