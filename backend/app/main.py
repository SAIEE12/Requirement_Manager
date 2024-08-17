from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import database

app = FastAPI()

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