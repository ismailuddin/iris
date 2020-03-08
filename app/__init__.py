from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .config.flask import Config

app = Flask(__name__, static_folder="../public", static_url_path="/public")
app.config.from_object(Config)
db = SQLAlchemy(app)

from .routes.general import general
from .routes.api import api

app.register_blueprint(general)
app.register_blueprint(api)
