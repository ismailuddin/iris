import os
import pathlib
import glob
import click
from flask import session
from iris import create_app
from iris.models.db import db
from iris.models.files import File
from iris.models.config import ConfigValue
from iris.utils.files import build_filelist, populate_db_with_filelist
# import gunicorn.app.base


# class StandaloneApplication(gunicorn.app.base.BaseApplication):
#     def __init__(self, app, options=None):
#         self.options = options or {}
#         self.application = app
#         super().__init__()
    
#     def load_config(self):
#         config = {key: value for key, value in self.options.items()
#                   if key in self.cfg.settings and value is not None}
#         for key, value in config.items():
#             self.cfg.set(key.lower(), value)

#     def load(self):
#         return self.application


@click.group()
def main():
    pass


@main.command(help="Launch server")
@click.option("--folder", "-f", help="Folder to discover files")
@click.option("--host", "-h", help="Host address to run server on", default="127.0.0.1")
@click.option("--port", "-p", help="Port to run server on", default=5000)
def launch(folder: str, extension: str, host: str, port: int):
    database_dir = pathlib.Path(
        os.path.join(os.getcwd(), folder, ".iris")
    )
    database_dir.mkdir(exist_ok=True, parents=True)
    database_file = pathlib.Path(os.path.join(database_dir, "data.db"))
    database_uri = f"sqlite:///{database_file}"
    app = create_app(
        instance_path=os.path.join(folder),
        database_uri=database_uri
    )
    with app.app_context():
        if not database_file.exists():
            db.create_all()
            filelist, all_tags = build_filelist(folder)
            print(f"Found {len(filelist)} files.")
            print("Populating database...")
            populate_db_with_filelist(filelist, all_tags)
            ConfigValue.set_database_file(uri=database_uri)
            ConfigValue.set_folder(folder=folder)
        # options = {
        #     "bind": f"{host}:{port}",
        #     "workers": 1,
        # }
        # StandaloneApplication(app, options).run()
        app.run(host=host, port=port)

if __name__ == "__main__":
    launch()    
