from fastapi import APIRouter
from app.schemas.health import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health_check():
    """Health check endpoint returning system status and service identifier."""
    return {
        "status": "ok",
        "service": "MELA API"
    }
