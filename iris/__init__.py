from flask import Flask
from .config.flask import Config
from .models.db import db


def create_app(instance_path: str, database_uri: str):
    app = Flask(__name__, static_folder="../public", static_url_path="/public")
    app.config.from_object(Config)
    app.config["INSTANCE_PATH"] = instance_path
    app.config["SQLALCHEMY_DATABASE_URI"] = database_uri

    db.init_app(app)

    from .routes.general import general
    from .routes.api import api

    app.register_blueprint(general)
    app.register_blueprint(api)
    return app
