from flask import request, Blueprint, jsonify

api = Blueprint("api", __name__)

@api.route("/api/test")
def test():
    return "Hi"