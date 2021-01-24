from .database import Database


def get_db():
    db = Database.session()
    try:
        yield db
    finally:
        db.close()