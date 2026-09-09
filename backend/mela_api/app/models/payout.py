"""Payout Account Model for Artisan Settlements"""
from sqlalchemy import Column, String, Boolean, DateTime
from datetime import datetime, timezone
import uuid
from app.core.database import Base


class PayoutAccount(Base):
    __tablename__ = "payout_accounts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    artisan_id = Column(String(36), unique=True, nullable=False)
    account_holder_name = Column(String(150), nullable=False)
    payout_type = Column(String(50), nullable=False, default="UPI")
    upi_id = Column(String(100), nullable=True)
    account_masked = Column(String(50), nullable=True)
    bank_name = Column(String(100), nullable=True)
    ifsc_code = Column(String(20), nullable=True)
    is_verified = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
