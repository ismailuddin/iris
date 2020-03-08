import glob
import pathlib
from typing import List
from tqdm import tqdm
from ..models.files import File
from .. import db


def build_filelist(glob_pattern: str) -> List[dict]:
    files = glob.glob(glob_pattern)
    filelist = []
    for file in files:
        fp = pathlib.Path(file)
        filelist.append({
            "path": file,
            "category": fp.parts[-2],
            "filename": fp.name,
        })
    return filelist


def populate_db_with_filelist(filelist: List[dict]):
    for file in tqdm(filelist):
        db.session.add(
            File(**file)
        )
    db.session.commit()