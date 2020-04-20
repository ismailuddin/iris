import io
import os
import re

from setuptools import find_packages
from setuptools import setup


this_directory = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(this_directory, 'README.md'), encoding='utf-8') as f:
    long_description = f.read()

with open("requirements.txt", "r") as file:
    requirements = [x.strip() for x in file.readlines()]

setup(
    name="iris",
    version="0.1.0",
    url="https://www.github.com/ismailuddin/iris",
    license='MIT',
    author="Ismail Uddin",
    author_email="ismail.sameeuddin@gmail.com",
    description="Browser based platform for labelling data",
    long_description=long_description,
    long_description_content_type='text/markdown',
    packages=find_packages(exclude=('tests',)),
    install_requires=requirements,
    classifiers=[
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
    ],
    entry_points={
        "console_scripts": ["iris=iris.__main__:main"]
    },
    include_package_data=True
)
