import math
from typing import Optional
from fastapi import APIRouter, Depends, Body, status
from ..models import File
from ..utils.files import (
    get_uniq_categories,
    create_new_category,
    reorganise_files,
)
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
    query = db.query(File).filter_by(category=category)
    total = query.order_by(None).count()
    files = query.limit(per_page).offset((page - 1) * per_page).all()
    return {
        "categories": categories,
        "selected_category": category,
        "n_pages": math.ceil(total / per_page),
        "files": [file.json for file in files],
        "total": total,
    }


@api_router.post("/api/relabel_file")
def relabel_file(
    _id: int = Body(...),
    category: str = Body(...),
    db: Session = Depends(get_db),
):
    file = db.query(File).filter(File.id == _id).first()
    file.category = category
    db.commit()
    return {"msg": f"File {file.filename} successfully re-labelled"}


@api_router.get("/api/reorganise_files", status_code=status.HTTP_202_ACCEPTED)
def perform_file_reorganisation():
    reorganise_files()


@api_router.put("/api/new_category", status_code=status.HTTP_201_CREATED)
def make_new_category(category_name: str):
    create_new_category(category_name)
