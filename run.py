import pathlib
import os
from app import app, db
from app.models.files import File
from app.utils.files import build_filelist, populate_db_with_filelist

DATABASE_FILE = "./app/files.db"

if pathlib.Path(DATABASE_FILE).exists():
    os.remove(DATABASE_FILE)
    db.create_all()
    filelist = build_filelist("./data/**/*.txt")
    populate_db_with_filelist(filelist)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)