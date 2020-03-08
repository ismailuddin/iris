from typing import List
from .. import db

class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String(256))
    filename = db.Column(db.String(256))
    category = db.Column(db.String(256))

    @property
    def json(self):
        return {
            "id": self.id,
            "path": self.path,
            "filename": self.filename,
            "category": self.category
        }


def get_uniq_categories() -> List[str]:
    _categories = db.session.query(File.category).distinct().all()
    categories = [_c.category for _c in _categories]
    return categories