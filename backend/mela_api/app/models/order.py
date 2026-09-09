from sqlalchemy import Column, String, Numeric, Integer, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.core.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    buyer_id = Column(String(36), nullable=False, default="buyer_demo_user")
    artisan_id = Column(String(36), nullable=False, default="artisan_demo_radha_1")
    status = Column(String(50), nullable=False, default="PENDING")
    
    # Financial fields
    subtotal = Column(Numeric(10, 2), nullable=False, default=0.0)
    delivery_charge = Column(Numeric(10, 2), nullable=False, default=0.0)
    total = Column(Numeric(10, 2), nullable=False, default=0.0)

    # Shipping address fields
    shipping_name = Column(String(255), nullable=False)
    shipping_phone = Column(String(20), nullable=False)
    shipping_address = Column(Text, nullable=False)
    shipping_city = Column(String(100), nullable=False)
    shipping_state = Column(String(100), nullable=False)
    shipping_pincode = Column(String(10), nullable=False)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationship to ordered items
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String(36), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(String(36), nullable=False)
    
    # Immutable Purchase Snapshots
    product_title_snapshot = Column(String(255), nullable=False)
    product_image_snapshot = Column(Text, nullable=True)
    unit_price = Column(Numeric(10, 2), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    subtotal = Column(Numeric(10, 2), nullable=False)

    order = relationship("Order", back_populates="items")
