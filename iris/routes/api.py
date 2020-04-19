from flask import request, Blueprint, jsonify, Response
from ..models.files import File
from ..utils.files import (
    get_uniq_categories,
    get_mismatched_files,
    reorganise_files,
    create_new_category
)
from .. import db

api = Blueprint("api", __name__)


@api.route("/api/get_files", methods=["POST"])
def get_files():
    """Returns all the files present in the database"""
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
        "files": [file.json for file in files],
        "total": paginator.total
    })


@api.route("/api/file/<int:_id>/set_label", methods=["POST"])
def set_file_label(_id: int):
    """Sets the file labels on the file specified by the ID"""
    body = request.get_json()
    file = File.query.get(_id)
    file.category = body["category"]
    db.session.commit()
    return jsonify({
        "response": f"File {file.filename} successfully re-labelled"
    })


@api.route("/api/reorganise_files")
def perform_file_reorganisation():
    mismatched_files = get_mismatched_files()
    if mismatched_files.shape[0] > 0:
        reorganise_files(mismatched_files)
        return Response(
            "Files successfully moved",
            status=200
        )
    return Response(
        "No files to move!",
        status=200
    )


@api.route("/api/new_category", methods=["POST"])
def new_category():
    body = request.get_json()
    category_name = body["category_name"]
    try:
        create_new_category(category_name)
        return Response(status=200)
    except FileExistsError:
        return Response(status=500)
