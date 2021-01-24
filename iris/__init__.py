__version__ = "0.1.0"

import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
# from .config import Config
# from .models.db import db
from .routers.api import api_router
from .routers.frontend import frontend_router


package_dir = os.path.abspath(os.path.dirname(__file__))
static_folder = os.path.abspath(os.path.join(package_dir, "public"))


app = FastAPI(version=__version__)
app.mount("/public", StaticFiles(directory=static_folder))


app.include_router(api_router)
app.include_router(frontend_router)
