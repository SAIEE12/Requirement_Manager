from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from . import database
from app.database import engine, Base
import os

from fastapi.responses import HTMLResponse
from data_population.main_populator import run_population
from app.api.endpoints.roles import router as roles_router
from app.api.endpoints.users import router as users_router
from app.api.endpoints.auth import router as auth_router
from app.api.endpoints.clients import router as clients_router
from app.api.endpoints.domains import router as domains_router
from app.api.endpoints.locations import router as locations_router


def create_app():
    app = FastAPI()

    app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # This is the default URL for Create React App
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

    # Get the directory of the current file
    current_dir = os.path.dirname(os.path.realpath(__file__))
    # Go up one level to the 'backend' directory
    backend_dir = os.path.dirname(current_dir)
    # Construct the path to the static folder
    static_dir = os.path.join(backend_dir, "static")

    # Mount the static directory using the absolute path
    app.mount("/static", StaticFiles(directory=static_dir), name="static")


    # Routes
    app.include_router(roles_router, prefix="/api/roles", tags=["roles"])
    app.include_router(users_router, prefix="/api/users", tags=["users"])
    app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
    app.include_router(clients_router, prefix="/api/clients", tags=["clients"])
    app.include_router(domains_router, prefix="/api/domains", tags=["domains"])
    app.include_router(locations_router, prefix="/api/locations", tags=["locations"])

    # Create database tables
    Base.metadata.create_all(bind=engine)

    @app.get("/")
    async def root():
        return {"message": "Hello World"}

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
    return {"message": "Hello World"}

# Dummy endpoint for database population
@app.post("/dev/populate-db")
async def populate_database(db: Session = Depends(get_db)):
    # This flag can be set based on an environment variable
    is_development = os.getenv("FASTAPI_ENV", "development") == "development"
    
    if is_development:
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