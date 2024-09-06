from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from . import database
from app.database import engine, Base
import os

from fastapi.responses import HTMLResponse
from data_population.main_populator import run_population
from app.api.endpoints import roles, users, auth, clients, domains, skills, locations, requirements, status
from app.core.errors import AppException, app_exception_handler
from app.middleware.logging import log_requests
from app.core.config import settings

def create_app():
    app = FastAPI(title=settings.PROJECT_NAME)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.add_exception_handler(AppException, app_exception_handler)
    app.middleware("http")(log_requests)
    
    # Get the directory of the current file
    current_dir = os.path.dirname(os.path.realpath(__file__))
    # Go up one level to the 'backend' directory
    backend_dir = os.path.dirname(current_dir)
    # Construct the path to the static folder
    static_dir = os.path.join(backend_dir, "static")

    # Mount the static directory using the absolute path
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

    # Routes
    app.include_router(requirements.router, prefix=f"{settings.API_V1_STR}/requirements", tags=["requirements"])
    app.include_router(roles.router, prefix=f"{settings.API_V1_STR}/roles", tags=["roles"])
    app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
    app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
    app.include_router(clients.router, prefix=f"{settings.API_V1_STR}/clients", tags=["clients"])
    app.include_router(domains.router, prefix=f"{settings.API_V1_STR}/domains", tags=["domains"])
    app.include_router(skills.router, prefix=f"{settings.API_V1_STR}/skills", tags=["skills"])
    app.include_router(locations.router, prefix=f"{settings.API_V1_STR}/locations", tags=["locations"])
    app.include_router(status.router, prefix=f"{settings.API_V1_STR}/status", tags=["status"])

    # Create database tables
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    return app

app = create_app()

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}

# Dummy endpoint for database population
@app.post(f"/dev/populate-db")
async def populate_database(db: Session = Depends(get_db)):
    if settings.FASTAPI_ENV == "development":
        try:
            run_population(db)
            return {"message": "Database populated successfully"}
        except Exception as e:
            return {"message": f"Error populating database: {str(e)}"}
    else:
        return {"message": "This endpoint is not available in production"}

@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}

@app.get(f"{settings.API_V1_STR}/db-test")
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