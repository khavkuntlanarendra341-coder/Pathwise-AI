from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routes.analyze import router as analyze_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PathWise AI",
    description="AI-Powered Student Financial & Career Copilot",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    analyze_router,
    prefix="/api"
)


@app.get("/")
def root():
    return {
        "message": "PathWise AI backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }