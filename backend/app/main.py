from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from . import database
import os

from fastapi.responses import HTMLResponse

app = FastAPI()

# Get the directory of the current file
current_dir = os.path.dirname(os.path.realpath(__file__))
# Go up one level to the 'backend' directory
backend_dir = os.path.dirname(current_dir)
# Construct the path to the static folder
static_dir = os.path.join(backend_dir, "static")

# Mount the static directory using the absolute path
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}

@app.get("/db-test")
def test_db(db: Session = Depends(get_db)):
    return {"message": "Database connection successful"}

@app.get("/test-favicon", response_class=HTMLResponse)
async def test_favicon():
    return """
    <!DOCTYPE html>
    <html>
        <head>
            <title>Favicon Test</title>
            <link rel="icon" type="image/x-icon" href="/static/favicon.ico">
        </head>
        <body>
            <h1>Favicon Test</h1>
        </body>
    </html>
    """