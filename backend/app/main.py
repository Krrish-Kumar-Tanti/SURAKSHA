from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title="SURAKSHA Backend",
    version="1.0.0",
    description="Security Deposit / FDR Control Tower — SIH26265",
)

# Enable CORS for configured frontend origins.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoint
@app.get("/health")
def health():
    return {"status": "ok", "service": "SURAKSHA Control Tower Backend", "sih": "SIH26265"}

# Include all API v1 endpoints
app.include_router(api_router)