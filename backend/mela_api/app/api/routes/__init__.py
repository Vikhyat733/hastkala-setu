"""API Routes Package."""
from app.api.routes.health import router as health_router
from app.api.routes.auth import router as auth_router
from app.api.routes.products import router as products_router
from app.api.routes.marketplace import router as marketplace_router
from app.api.routes.buyers import router as buyers_router
from app.api.routes.orders import router as orders_router
from app.api.routes.payments import router as payments_router
from app.api.routes.earnings import router as earnings_router
from app.api.routes.ai import router as ai_router

__all__ = [
    "health_router",
    "auth_router",
    "products_router",
    "marketplace_router",
    "buyers_router",
    "orders_router",
    "payments_router",
    "earnings_router",
    "ai_router",
]
