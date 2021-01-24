from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class Database:
    session = None

def create_session_base(database_uri: str):
    global SessionLocal
    engine = create_engine(
        database_uri, connect_args={"check_same_thread": False}
    )
    Database.session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return engine