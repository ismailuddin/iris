from flask import request, Blueprint, jsonify
import glob

api = Blueprint("api", __name__)

@api.route("/api/test")
def test():
    return "Hi"

@api.route("/api/images")
def get_images():
    images = glob.glob("./data/*.png")
    return jsonify({
        "images": images
    })