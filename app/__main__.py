from flask import Flask

app = Flask(__name__, static_folder="../public", static_url_path="/public")
app.config.from_object(Config)

from .routes.api import api