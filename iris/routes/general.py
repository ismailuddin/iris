import os
from flask import (
    Blueprint,
    render_template,
    send_from_directory,
    current_app,
    send_file,
)
from ..models.files import File

general = Blueprint("general", __name__)


@general.route("/")
def home():
    """Route for the home page"""
    return render_template("general/home.html")


@general.route("/images/<int:id>")
def get_image(id: int):
    file = File.query.get(id)
    return send_file(file.path)
