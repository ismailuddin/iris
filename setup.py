#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""The setup script."""

import os
from setuptools import find_packages
from setuptools import setup
import iris

this_directory = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(this_directory, "README.md"), encoding="utf-8") as f:
    long_description = f.read()

setup(
    name="iris-image-labelling",
    version=iris.__version__,
    url="https://www.github.com/ismailuddin/iris",
    license="MIT",
    author="Ismail Uddin",
    author_email="ismail.sameeuddin@gmail.com",
    description="Browser based platform for labelling data",
    long_description=long_description,
    long_description_content_type="text/markdown",
    packages=find_packages(exclude=("tests",)),
    install_requires=[
        "fastapi",
        "aiofiles",
        "uvicorn",
        "jinja2",
        "pandas",
        "sqlalchemy",
        "tqdm",
        "click"
    ],
    classifiers=[
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
    ],
    entry_points={"console_scripts": ["iris=iris.__main__:main"]},
    include_package_data=True,
)
