from sqlalchemy import Column, String, Numeric, Integer, Text, ForeignKey, DateTime
from datetime import datetime, timezone
import uuid
from app.core.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    artisan_id = Column(String(36), ForeignKey("artisans.id", ondelete="CASCADE"), nullable=False, default="artisan_demo_radha_1")
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    description_hindi = Column(Text, nullable=True)
    description_english = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    material = Column(String(100), nullable=True)
    craft_type = Column(String(100), nullable=True)
    image_url = Column(Text, nullable=True)
    enhanced_image_url = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=False, default=0.0)
    estimated_material_cost = Column(Numeric(10, 2), nullable=True)
    estimated_making_cost = Column(Numeric(10, 2), nullable=True)
    stock = Column(Integer, default=1)
    status = Column(String(50), default="published")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
