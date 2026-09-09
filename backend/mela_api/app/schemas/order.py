from pydantic import BaseModel, ConfigDict, Field
from decimal import Decimal
from datetime import datetime
from typing import List, Optional


class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int = Field(default=1, ge=1)


class OrderItemResponse(BaseModel):
    id: str
    product_id: str
    product_title_snapshot: str
    product_image_snapshot: Optional[str] = None
    unit_price: Decimal
    quantity: int
    subtotal: Decimal

    model_config = ConfigDict(from_attributes=True)


class OrderCreateRequest(BaseModel):
    buyer_id: Optional[str] = "buyer_demo_user"
    shipping_name: str
    shipping_phone: str
    shipping_address: str
    shipping_city: str
    shipping_state: str
    shipping_pincode: str
    items: List[OrderItemCreate]


class OrderStatusUpdateRequest(BaseModel):
    status: str
    note: Optional[str] = None


class OrderResponse(BaseModel):
    id: str
    buyer_id: str
    artisan_id: str
    status: str
    subtotal: Decimal
    delivery_charge: Decimal
    total: Decimal
    shipping_name: str
    shipping_phone: str
    shipping_address: str
    shipping_city: str
    shipping_state: str
    shipping_pincode: str
    items: List[OrderItemResponse] = []
    created_at: datetime
    updated_at: datetime
    artisan_name: Optional[str] = None
    artisan_location: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
