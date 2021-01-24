import os
from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.templating import Jinja2Templates
from ..config import Config


PACKAGE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

frontend_router = APIRouter()
templates = Jinja2Templates(directory=os.path.join(PACKAGE_DIR, "templates"))


@frontend_router.get("/", response_class=HTMLResponse)
def home(request: Request):
    print(PACKAGE_DIR)
    return templates.TemplateResponse(
        "general/home.html",
        dict(request=request)
    )

@frontend_router.get("/get_image")
async def get_image(image_path: str):
    return FileResponse(
        os.path.join(
            os.getcwd(),
            image_path
        )
    )
