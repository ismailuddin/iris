import os
import pandas as pd
from .database import Database, create_session_base
from .models import File, Tag


class QueryBuilder:
    def __init__(self, folder: str):
        self.folder = folder
        self.session = None
        self._create_db_session_maker()

    def _create_db_session_maker(self):
        database_file = os.path.join(
            os.path.abspath(self.folder),
            ".iris",
            "data.db"
        )
        database_uri = f"sqlite:///{database_file}"
        create_session_base(database_uri)
        self.session = Database.session

    def get_all_files(self) -> pd.DataFrame:
        """Returns all files from the database as a Pandas DataFrame.

        Returns:
            pd.DataFrame: Files stored in database
        """
        db = self.session()
        files = db.query(File).all()
        return pd.DataFrame([f.json for f in files])
