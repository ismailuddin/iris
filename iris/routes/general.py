import os
from flask import Blueprint, render_template, send_from_directory, current_app


general = Blueprint(
    "general", __name__, static_folder=os.getcwd(), static_url_path="/data"
)


@general.route("/")
def home():
    return render_template("general/home.html")
