from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from decimal import Decimal
from datetime import datetime


class ProductBase(BaseModel):
    title: str
    description: Optional[str] = None
    description_hindi: Optional[str] = None
    description_english: Optional[str] = None
    category: Optional[str] = None
    material: Optional[str] = None
    craft_type: Optional[str] = None
    image_url: Optional[str] = None
    enhanced_image_url: Optional[str] = None
    price: Decimal = Decimal("0.0")
    estimated_material_cost: Optional[Decimal] = None
    estimated_making_cost: Optional[Decimal] = None
    stock: int = 1
    status: str = "published"


class ProductCreate(ProductBase):
    artisan_id: Optional[str] = "artisan_demo_radha_1"


class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    description_hindi: Optional[str] = None
    description_english: Optional[str] = None
    category: Optional[str] = None
    material: Optional[str] = None
    craft_type: Optional[str] = None
    image_url: Optional[str] = None
    enhanced_image_url: Optional[str] = None
    price: Optional[Decimal] = None
    stock: Optional[int] = None
    status: Optional[str] = None


class ProductResponse(ProductBase):
    id: str
    artisan_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MarketplaceProductResponse(ProductBase):
    id: str
    artisan_id: str
    artisan_name: Optional[str] = "राधा देवी (Radha Devi)"
    artisan_location: Optional[str] = "जयपुर, राजस्थान (Jaipur, Rajasthan)"
    artisan_craft: Optional[str] = "पारंपरिक हस्तशिल्प"
    artisan_verified: bool = True
    artisan_bio: Optional[str] = None
    artisan_image: Optional[str] = None
    is_favorite: bool = False
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CategoryItem(BaseModel):
    id: str
    name_hindi: str
    name_english: str
    icon: str
    product_count: int = 0
