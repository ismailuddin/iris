from flask import Blueprint, render_template

general = Blueprint("general", __name__)

@general.route("/")
def home():
    return render_template("general/home.html")