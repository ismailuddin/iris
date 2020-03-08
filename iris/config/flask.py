import os


class Config:
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(os.getcwd(), '.iris', 'data.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    INSTANCE_PATH = None
