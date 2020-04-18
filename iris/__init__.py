__version__ = '0.1.0'

import os
from flask import Flask
from .config.flask import Config
from .models.db import db


def create_app(instance_path: str, database_uri: str):
    package_dir = os.path.abspath(os.path.dirname(__file__))
    static_folder = os.path.abspath(os.path.join(package_dir, "public"))
    app = Flask(__name__, static_folder=static_folder, static_url_path="/public")
    app.config.from_object(Config)
    app.config["INSTANCE_PATH"] = instance_path
    app.config["SQLALCHEMY_DATABASE_URI"] = database_uri

    db.init_app(app)

    from .routes.general import general
    from .routes.api import api

    app.register_blueprint(general)
    app.register_blueprint(api)
    return app
