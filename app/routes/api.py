from flask import request, Blueprint, jsonify
from ..models.files import File, get_uniq_categories
from .. import db

api = Blueprint("api", __name__)


@api.route("/api/get_files", methods=["POST"])
def get_files():
    body = request.get_json()
    categories = sorted(get_uniq_categories())
    if body["category"] is None:
        category = categories[0]
    else:
        category = body["category"]
    paginator = File.query.filter_by(category=category).paginate(
        body["page"], body["per_page"]
    )
    files = paginator.items
    return jsonify({
        "categories": categories,
        "selected_category": category,
        "n_pages": paginator.pages,
        "files": [file.json for file in files]
    })


@api.route("/api/file/<int:_id>/set_label", methods=["POST"])
def set_file_label(_id: int):
    body = request.get_json()
    file = File.query.get(_id)
    file.category = body["category"]
    db.session.commit()
    return jsonify({
        "response": f"File {file.filename} successfully re-labelled"
    })
