from fastapi import APIRouter
from app.schemas.ai import (
    EnhanceImageRequest,
    EnhanceImageResponse,
    TranscribeRequest,
    TranscribeResponse,
    CatalogRequest,
    CatalogResponse,
    PricingRequest,
    PricingResponse,
)
from app.ai.image_enhancement import image_enhancer
from app.ai.speech_to_text import speech_transcriber
from app.ai.catalog_generator import catalog_generator
from app.ai.pricing import pricing_estimator

router = APIRouter()


@router.post("/enhance-image", response_model=EnhanceImageResponse)
async def enhance_image(req: EnhanceImageRequest):
    """Enhance raw craft photo with background cleanup and studio lighting."""
    result = await image_enhancer.process_enhancement(
        image_base64=req.image_base64,
        image_url=req.image_url,
        enhancement_level=req.enhancement_level or "studio",
    )
    return result


@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe_voice(req: TranscribeRequest):
    """Transcribe vernacular artisan voice notes into text."""
    result = await speech_transcriber.transcribe_audio(
        audio_base64=req.audio_base64,
        language_hint=req.language_hint or "hi",
    )
    return result


@router.post("/catalog", response_model=CatalogResponse)
async def generate_catalog(req: CatalogRequest):
    """Generate structured e-commerce catalog from natural language transcript and product photo."""
    result = await catalog_generator.generate_catalog(
        transcript=req.transcript,
        language=req.language or "hi",
        image_base64=req.image_base64,
        image_url=req.image_url,
        image_context=req.image_context,
    )
    return result



@router.post("/pricing", response_model=PricingResponse)
def estimate_pricing(req: PricingRequest):
    """Calculate fair recommended market price with detailed cost breakdown."""
    result = pricing_estimator.estimate_price(
        title=req.title,
        category=req.category,
        material=req.material,
        craft_type=req.craft_type,
        description=req.description,
        raw_material_cost=req.raw_material_cost,
        making_cost=req.making_cost,
        crafting_hours=req.crafting_hours,
        hourly_wage=req.hourly_wage,
    )
    return result

