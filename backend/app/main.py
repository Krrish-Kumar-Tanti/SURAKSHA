from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title="SURAKSHA Backend",
    version="1.0.0",
    description="Security Deposit / FDR Control Tower — SIH26265",
)

# Enable CORS for frontend applications (Vite port 3000 and 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root & Health endpoints
@app.get("/")
def root():
    return {
        "service": "SURAKSHA Control Tower Backend",
        "sih": "SIH26265",
        "status": "online",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
def health():
    return {"status": "ok", "service": "SURAKSHA Control Tower Backend", "sih": "SIH26265"}

# Include all API v1 endpoints
app.include_router(api_router)