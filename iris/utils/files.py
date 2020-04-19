import glob
import os
from pathlib import Path
import shutil
from typing import List
from tqdm import tqdm
from ..models.files import File, Tag
from ..models.config import ConfigValue
from .. import db
import pandas as pd


def get_uniq_categories() -> List[str]:
    """Infers the categories for the files based on the top level
    directories in the specified folder
    
    Returns:
        List[str]: List of categories
    """
    folder = ConfigValue.get_folder()
    _categories = glob.glob(os.path.join(folder, "**"))
    return [Path(p).parts[-1] for p in _categories]


def recursive_file_discover(folder: str) -> tuple:
    """Generator based approach to discovering files in the specified folder
    
    Args:
        folder (str): The folder to search in
    
    Yields:
        tuple: The root path as the first element, and a list of the files
    """
    for root, dirs, files in os.walk(folder):
        yield root, files


def build_filelist(folder: str, extension: str = ".png") -> tuple:
    """Builds a file list with associated metadata for each file.
    
    Args:
        folder (str): The folder to look inside
        extension (str, optional): The extension to filter the files on.
            Defaults to ".png".
    
    Returns:
        tuple: First element is a list of files represented by a dictionary
            with metadata, second element is a list of the discovered tags
    """
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
                fp = Path(path)
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


def populate_db_with_filelist(filelist: List[dict], all_tags: List[str]) -> None:
    """Populates the database with the file list built using the
    `build_filelist()` function.
    
    Args:
        filelist (List[dict]): The filelist output of the `build_filelist()`
            function
        all_tags (List[str]): All the possible tags discovered
    """
    tags = list(set(all_tags))
    tag_dict = {}
    for tag in tqdm(tags):
        t = Tag(name=tag)
        tag_dict[tag] = t
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

def reform_path(path: Path, category: str) -> str:
    """Reforms the path to include the newly assigned category
    
    Args:
        path (pathlib.Path): Path of the file
        category (str): New category
    
    Returns:
        str: Reformed path
    """
    p = Path(path)
    parts = list(p.parts)
    parts[1] = category
    return os.path.join(*parts)


def get_mismatched_files() -> pd.DataFrame:
    """Generates a DataFrame of all files in the database.
    
    Returns:
        pd.DataFrame: Pandas DataFrame of database Files table.
    """
    _files = File.query.all()
    if len(_files) > 0:
        files = [f.json for f in _files]
        files = pd.DataFrame(files)
        files["path_category"] = files.path.apply(lambda x: Path(x).parts[1])
        return files[files.category != files.path_category].copy()
    return None


def reorganise_files(mismatched_files: pd.DataFrame):
    """Reorganises files into the new directories according to the
    newly assigned categories.
    """
    
    mismatched_files["dest"] = mismatched_files[["path", "category"]].apply(
        lambda x: reform_path(x["path"], x["category"]), axis=1
    )
    for ix in mismatched_files.index:
        row = mismatched_files.loc[ix]
        file_id = int(row["id"])
        file: File = File.query.get(file_id)
        src, dest = row["path"], row["dest"]
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.move(src, dest)
        file.path = dest
    db.session.commit()


def create_new_category(name: str):
    """Creates a new folder to serve as a new category for files to be 
    labelled as
    
    Args:
        name (str): New category name
    """
    root_folder = ConfigValue.get_folder()
    new_folder = os.path.join(root_folder, name)
    new_folder_fp =Path(new_folder)
    if new_folder_fp.is_dir():
        raise FileExistsError("Folder already exists")
    new_folder_fp.mkdir(exist_ok=True, parents=True)
