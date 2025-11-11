from fastapi import FastAPI
from .auth.auth_routes import router as auth_routes

app = FastAPI()

@app.get("/")
def get_root():
    return {"message": "Hello World | Inicio"}

app.include_router(auth_routes, prefix="/auth")

