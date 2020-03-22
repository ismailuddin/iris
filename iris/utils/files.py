import glob
import os
import pathlib
from typing import List
from tqdm import tqdm
from ..models.files import File, Tag
from ..models.config import ConfigValue
from .. import db


def get_uniq_categories() -> List[str]:
    folder = ConfigValue.get_folder()
    _categories = glob.glob(os.path.join(folder, "**"))
    return [pathlib.Path(p).parts[-1] for p in _categories]


def recursive_file_discover(folder: str):
    for root, dirs, files in os.walk(folder):
        yield root, files


def build_filelist(folder: str, extension: str = ".png") -> List[dict]:
    filelist: List[dict] = []
    all_tags: List[str] = []
    file_generator = recursive_file_discover(folder)
    while True:
        try:
            root, files = next(file_generator)
            for file in files:
                if ".iris" in root:
                    continue
                if file[0] == ".":
                    continue
                path = os.path.join(root, file)
                fp = pathlib.Path(path)
                category = fp.parts[1]
                if len(fp.parts) > 3:
                    tags = list(fp.parts[2:-1])
                else:
                    tags = []
                filelist.append({
                    "path": path,
                    "filename": fp.name,
                    "tags": tags,
                    "category": category
                })
                all_tags.extend(tags)
        except StopIteration:
            break
    return filelist, all_tags


def populate_db_with_filelist(filelist: List[dict], all_tags: List[str]):
    tags = list(set(all_tags))
    tag_dict = {}
    for tag in tqdm(tags):
        t = Tag(name=tag)
        tag_dict[tag] = t
        # db.session.add(t)
    for file in tqdm(filelist):
        file_tags = file["tags"]
        _tag_instances = list(filter(lambda x: x[0] in file_tags, tag_dict.items()))
        tag_instances = [x[1] for x in _tag_instances]
        f = File(
            path=file["path"],
            filename=file["filename"],
            category=file["category"],
            tags=tag_instances
        )
        db.session.add(f)
    db.session.commit()
