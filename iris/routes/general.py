import os
from flask import Blueprint, render_template, send_from_directory, current_app


general = Blueprint("general", __name__)


@general.route("/")
def home():
    """Route for the home page"""
    return render_template("general/home.html")


@general.route("/images/<path:image_path>")
def get_image(image_path: str):
    return send_from_directory(
        os.getcwd(),
        image_path
    )