from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine
from app.api.routes import (
    health_router,
    auth_router,
    products_router,
    marketplace_router,
    buyers_router,
    orders_router,
    payments_router,
    earnings_router,
    ai_router,
)

# Initialize database schema tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for MELA - AI-powered mobile marketplace and virtual business manager for rural artisans (SIH26090)",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers under /api/v1
api_prefix = settings.API_V1_PREFIX
app.include_router(health_router, prefix=api_prefix, tags=["Health"])
app.include_router(auth_router, prefix=f"{api_prefix}/auth", tags=["Authentication"])
app.include_router(products_router, prefix=f"{api_prefix}/products", tags=["Products"])
app.include_router(marketplace_router, prefix=f"{api_prefix}/marketplace", tags=["Marketplace"])
app.include_router(buyers_router, prefix=f"{api_prefix}/buyers", tags=["Buyers"])
app.include_router(orders_router, prefix=f"{api_prefix}/orders", tags=["Orders"])
app.include_router(payments_router, prefix=f"{api_prefix}/payments", tags=["Payments"])
app.include_router(earnings_router, prefix=f"{api_prefix}/earnings", tags=["Earnings"])
app.include_router(ai_router, prefix=f"{api_prefix}/ai", tags=["AI"])


@app.get("/")
def root():
    return {
        "message": "Welcome to MELA API. Access /docs for interactive documentation or /api/v1/health for service status."
    }
