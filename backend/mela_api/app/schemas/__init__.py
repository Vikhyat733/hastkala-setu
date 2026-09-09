from app.schemas.health import HealthResponse
from app.schemas.artisan import ArtisanBase, ArtisanCreate, ArtisanResponse
from app.schemas.product import ProductBase, ProductCreate, ProductResponse
from app.schemas.order import (
    OrderCreateRequest,
    OrderResponse,
    OrderItemResponse,
    OrderItemCreate,
    OrderStatusUpdateRequest,
)

# Aliases for backwards compatibility
OrderCreate = OrderCreateRequest

__all__ = [
    "HealthResponse",
    "ArtisanBase",
    "ArtisanCreate",
    "ArtisanResponse",
    "ProductBase",
    "ProductCreate",
    "ProductResponse",
    "OrderCreateRequest",
    "OrderCreate",
    "OrderResponse",
    "OrderItemResponse",
    "OrderItemCreate",
    "OrderStatusUpdateRequest",
]
