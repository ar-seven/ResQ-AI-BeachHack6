from fastapi import FastAPI
from osa import  models
from osa.database import engine
from resq.routers import ai_chat
from a2wsgi import ASGIMiddleware
from fastapi.middleware.cors import CORSMiddleware
origins = [
    "http://localhost:3000",
]
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


models.Base.metadata.create_all(engine)

app.include_router(ai_chat.router)
# app = ASGIMiddleware(app) 

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app,host='0.0.0.0', port=8000)