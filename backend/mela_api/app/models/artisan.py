from sqlalchemy import Column, String, Boolean, DateTime
from datetime import datetime, timezone
import uuid
from app.core.database import Base


class Artisan(Base):
    __tablename__ = "artisans"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    phone = Column(String(20), unique=True, nullable=False)
    state = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    craft_category = Column(String(100), nullable=True)
    preferred_language = Column(String(10), default="hi")
    upi_id = Column(String(100), nullable=True)
    is_verified = Column(Boolean, default=False)
    bio = Column(String(500), nullable=True)
    profile_image = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

