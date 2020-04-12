from typing import List
from .. import db


file_tags = db.Table(
    "file_tags",
    db.Column("tag_id", db.Integer, db.ForeignKey("tag.id"), primary_key=True),
    db.Column("file_id", db.Integer, db.ForeignKey("file.id"), primary_key=True)
)


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256))


class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String(256))
    filename = db.Column(db.String(256))
    category = db.Column(db.String(256))
    tags = db.relationship(
        "Tag",
        secondary=file_tags,
        lazy="subquery",
        backref=db.backref("files", lazy=True)
    )

    @property
    def json(self):
        return {
            "id": self.id,
            "path": self.path,
            "filename": self.filename,
            "category": self.category,
            "tags": [t.name for t in self.tags]
        }
