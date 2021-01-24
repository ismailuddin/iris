import math
from typing import Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from ..models import File
from ..utils.files import get_uniq_categories
from ..dependencies import get_db
from sqlalchemy.orm import Session

api_router = APIRouter()


@api_router.get("/api/get_files")
def get_files(
    category: str = None,
    page: int = 1,
    per_page: int = 25,
    db: Session = Depends(get_db),
):
    """Returns all the files present in the database"""
    categories = sorted(get_uniq_categories())
    if category is None:
        category = categories[0]
    query = (
        db.query(File)
        .filter_by(category=category)
    )
    total = query.order_by(None).count()
    files = (
        query
        .limit(per_page)
        .offset((page - 1) * per_page)
        .all()
    )
    return {
        "categories": categories,
        "selected_category": category,
        "n_pages": math.ceil(total / per_page),
        "files": [file.json for file in files],
        "total": total,
    }


# @api.route("/api/file/<int:_id>/set_label", methods=["POST"])
# def set_file_label(_id: int):
#     """Sets the file labels on the file specified by the ID"""
#     body = request.get_json()
#     file = File.query.get(_id)
#     file.category = body["category"]
#     db.session.commit()
#     return jsonify({
#         "response": f"File {file.filename} successfully re-labelled"
#     })


# @api.route("/api/reorganise_files")
# def perform_file_reorganisation():
#     mismatched_files = get_mismatched_files()
#     if mismatched_files.shape[0] > 0:
#         reorganise_files(mismatched_files)
#         return Response(
#             "Files successfully moved",
#             status=200
#         )
#     return Response(
#         "No files to move!",
#         status=200
#     )


# @api.route("/api/new_category", methods=["POST"])
# def new_category():
#     body = request.get_json()
#     category_name = body["category_name"]
#     try:
#         create_new_category(category_name)
#         return Response(status=200)
#     except FileExistsError:
#         return Response(status=500)
