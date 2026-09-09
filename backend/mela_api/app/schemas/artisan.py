from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class ArtisanBase(BaseModel):
    name: str
    phone: str
    state: Optional[str] = None
    district: Optional[str] = None
    craft_category: Optional[str] = None
    preferred_language: Optional[str] = "hi"
    upi_id: Optional[str] = None


class ArtisanCreate(ArtisanBase):
    pass


class ArtisanResponse(ArtisanBase):
    id: str
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
