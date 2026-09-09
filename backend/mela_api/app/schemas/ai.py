from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class EnhanceImageRequest(BaseModel):
    image_base64: Optional[str] = None
    image_url: Optional[str] = None
    enhancement_level: Optional[str] = "studio"  # studio, neutral, crisp


class EnhanceImageResponse(BaseModel):
    success: bool
    status: str
    original_url: Optional[str] = None
    enhanced_url: str
    operations_applied: List[str]
    processing_time_ms: Optional[int] = 0
    dev_fallback: Optional[bool] = True  # True when using Pillow dev processing, not production AI
    error: Optional[str] = None


class TranscribeRequest(BaseModel):
    audio_base64: Optional[str] = None
    language_hint: Optional[str] = "hi"
    audio_format: Optional[str] = "webm"


class TranscribeResponse(BaseModel):
    success: bool
    language_detected: str
    confidence: float
    transcript: str
    duration_seconds: float


class CatalogRequest(BaseModel):
    transcript: str
    language: Optional[str] = "hi"
    image_base64: Optional[str] = None
    image_url: Optional[str] = None
    image_context: Optional[str] = None


class CatalogResponse(BaseModel):
    success: bool
    title: str
    title_hindi: Optional[str] = None
    title_english: Optional[str] = None
    title_marathi: Optional[str] = None
    title_bengali: Optional[str] = None
    description: str
    description_hindi: str
    description_english: str
    description_marathi: Optional[str] = None
    description_bengali: Optional[str] = None
    category: str
    material: str
    craft_type: str
    keywords: List[str]
    suggested_tags: List[str]
    confidence: Optional[float] = 0.95
    is_ai_analyzed: Optional[bool] = False
    dev_fallback: Optional[bool] = True
    confirmation_question: Optional[str] = None
    observed_visuals: Optional[List[str]] = None



class PricingRequest(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    material: Optional[str] = None
    craft_type: Optional[str] = None
    description: Optional[str] = None
    raw_material_cost: Optional[float] = None
    making_cost: Optional[float] = None
    crafting_hours: Optional[float] = None
    hourly_wage: Optional[float] = None


class PricingResponse(BaseModel):
    success: bool
    currency: str = "INR"
    suggested_price: float
    min_viable_price: float
    max_market_price: float
    estimated_material_cost: float
    estimated_making_cost: float
    total_cost: Optional[float] = None
    estimated_profit: float
    margin_percentage: float
    explanation_hindi: str
    explanation_english: str
    strategy_used: Optional[str] = "DevelopmentPricingStrategy"

