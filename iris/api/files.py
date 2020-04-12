import os
import pathlib
from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import backref, relationship
from sqlalchemy.ext.declarative import declarative_base
import pandas as pd

Base = declarative_base()

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

    id = Column(Integer, primary_key=True)
    path = Column(String(256))
    filename = Column(String(256))
    category = Column(String(256))
    tags = relationship(
        "Tag", secondary=file_tags, lazy="subquery", backref=backref("files", lazy=True)
    )

    @property
    def json(self):
        return {
            "id": self.id,
            "path": self.path,
            "filename": self.filename,
            "category": self.category,
            "tags": [t.name for t in self.tags],
        }

class Query:
    """Class used for interacting with the database to acquire the image
    labels, as well as make modifications.
    """

    def __init__(self, folder: str):
        """Creates an instance of the Query class.
        
        Args:
            folder (str): The relative path to the folder where the images
                are stored. Same folder name passed when launching Iris from the 
                command line
        """
        self.folder = folder
        self.session_maker = None
        self._create_engine()

    def _create_engine(self):
        """Sets up the SQLAlchemy engine and session manager"""
        db_path = os.path.abspath(os.path.join(self.folder, ".iris", "data.db"))
        engine = create_engine(f"sqlite:///{db_path}")
        self.session_maker = sessionmaker(bind=engine)

    @contextmanager
    def session(self):
        """Provides a context manager for the session object used in
        SQLAlchemy.
        
        Yields:
            SQLAlchemy session
        """
        sess = self.session_maker()
        try:
            yield sess
            sess.commit()
        except:
            sess.rollback()
            raise
        finally:
            sess.close()

    def get_all_files(self) -> pd.DataFrame:
        """Returns all files from the database as a Pandas DataFrame.
        
        Returns:
            pd.DataFrame: Files stored in database.
        """
        with self.session() as sess:
            _files = sess.query(File).all()
            files = [f.json for f in _files]
            return pd.DataFrame(files)
        
    def update_file(self, _id: int, file_kwargs: dict={}):
        """Provides a way to update any of the attributes of each file stored
        in the database.
        
        Args:
            _id (int): The `id` of the file specified in the DataFrame column
            file_kwargs (dict, optional): A dictionary of the attributes to be
                updated. Only those attributes which exist on the file will be
                updated. Defaults to {}.
        """
        with self.session() as sess:
            file = sess.query(File).get(_id)
            for k, v in file_kwargs.items():
                setattr(file, k, v)
