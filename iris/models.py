from sqlalchemy import Column, ForeignKey, Boolean, Integer, String, Table
from sqlalchemy.orm import relationship, backref
from .database import Base


file_tags = Table(
    "file_tags",
    Base.metadata,
    Column("tag_id", Integer, ForeignKey("tag.id"), primary_key=True),
    Column("file_id", Integer, ForeignKey("file.id"), primary_key=True),
)


class Tag(Base):
    __tablename__ = "tag"

    id = Column(Integer, primary_key=True)
    name = Column(String(256))


class File(Base):
    __tablename__ = "file"

    id = Column(Integer, primary_key=True, index=True)
    path = Column(String(256))
    filename = Column(String(256))
    category = Column(String(256))
    tags = relationship(
        "Tag",
        secondary=file_tags,
        lazy="subquery",
        backref=backref("files", lazy=True)
    )