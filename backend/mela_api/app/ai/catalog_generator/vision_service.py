"""Vision Analysis Service Interface & Multimodal AI Adapter

Connects to multimodal AI models (Google Gemini / OpenAI Vision) when API keys are configured.
If no key is configured, honestly reports is_available=False without fabricating visual results.
"""
import os
import json
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)


class VisionAnalysisService:
    """Multimodal vision analyzer for artisan product images."""

    def __init__(self):
        self.gemini_api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        self.openai_api_key = os.getenv("OPENAI_API_KEY")

    def is_configured(self) -> bool:
        """Check if any real multimodal vision provider is available."""
        return bool(self.gemini_api_key or self.openai_api_key)

    async def analyze_product_image_and_transcript(
        self,
        image_base64: Optional[str],
        transcript: str,
        language: str = "hi"
    ) -> Optional[Dict[str, Any]]:
        """
        Analyze image + transcript using multimodal LLM (Gemini or OpenAI).
        Returns structured dictionary if successful, or None if unavailable / error.
        """
        if not self.is_configured():
            return None

        # If Gemini key is available, call Google Gemini multimodal vision API
        if self.gemini_api_key:
            return await self._call_gemini_vision(image_base64, transcript, language)
        elif self.openai_api_key:
            return await self._call_openai_vision(image_base64, transcript, language)

        return None

    async def _call_gemini_vision(
        self,
        image_base64: Optional[str],
        transcript: str,
        language: str
    ) -> Optional[Dict[str, Any]]:
        import httpx

        prompt = f"""
You are MELA AI, an intelligent catalog generator for Indian rural artisans.
Analyze the provided product image and artisan spoken description:
Artisan Voice Transcript: "{transcript}"
Target Primary Language: "{language}"

Extract factual, accurate product details based ONLY on what is visible in the image and stated in the transcript.
Do not invent unsupported heritage or false origins.
Differentiate between:
- Observed from image (shape, color, material appearance, category)
- Stated by artisan (material, dimensions, making technique, inner lining, origin)
- Inferred cautiously

Return a strictly valid JSON object with:
{{
  "title_hindi": "Product title in Hindi (concise, clear)",
  "title_english": "Product title in English (concise, clear)",
  "category": "Accurate e-commerce category in Hindi/English (e.g. बैग और एक्सेसरीज़ / Bags & Accessories)",
  "material": "Specific materials used (e.g. जूट और सूती लाइनिंग / Jute & Cotton Lining)",
  "craft_type": "Specific craft technique (e.g. हस्तनिर्मित जूट शिल्प / Handcrafted Jute Craft)",
  "description_hindi": "Rich, accurate description in Hindi highlighting artisan craft and genuine features",
  "description_english": "Accurate English description highlighting artisan craft and genuine features",
  "keywords": ["5 to 7 specific product keywords without generic filler"],
  "suggested_tags": ["handcrafted", "fair_trade", "eco_friendly"],
  "confidence": 0.95,
  "observed_visuals": ["list of 2-3 visual observations from image"],
  "confirmation_question": "Optional confirmation question in Hindi if uncertain, e.g. क्या यह जूट का बैग है?, or null if certain"
}}
"""
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_api_key}"
            contents: list = []
            parts: list = [{"text": prompt}]

            if image_base64:
                # Remove data url prefix if present
                clean_base64 = image_base64
                mime_type = "image/jpeg"
                if "base64," in image_base64:
                    parts_data = image_base64.split("base64,")
                    clean_base64 = parts_data[1]
                    if "image/png" in parts_data[0]:
                        mime_type = "image/png"
                    elif "image/webp" in parts_data[0]:
                        mime_type = "image/webp"

                parts.append({
                    "inline_data": {
                        "mime_type": mime_type,
                        "data": clean_base64
                    }
                })

            contents.append({"parts": parts})

            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(url, json={"contents": contents})
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        text_response = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                        clean_text = text_response.strip()
                        if clean_text.startswith("```json"):
                            clean_text = clean_text[7:]
                        if clean_text.endswith("```"):
                            clean_text = clean_text[:-3]
                        parsed = json.loads(clean_text.strip())
                        return parsed
        except Exception as e:
            logger.warning(f"Gemini vision call failed: {e}")

        return None

    async def _call_openai_vision(
        self,
        image_base64: Optional[str],
        transcript: str,
        language: str
    ) -> Optional[Dict[str, Any]]:
        import httpx

        prompt = f"""
You are MELA AI, an intelligent catalog generator for Indian rural artisans.
Analyze the provided product image and artisan spoken description:
Artisan Voice Transcript: "{transcript}"
Target Primary Language: "{language}"

Return a strictly valid JSON object with: title_hindi, title_english, category, material, craft_type, description_hindi, description_english, keywords, suggested_tags, confidence, observed_visuals, confirmation_question.
"""
        try:
            headers = {
                "Authorization": f"Bearer {self.openai_api_key}",
                "Content-Type": "application/json",
            }
            messages: list = [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt}
                    ]
                }
            ]
            if image_base64:
                img_url = image_base64 if image_base64.startswith("data:") else f"data:image/jpeg;base64,{image_base64}"
                messages[0]["content"].append({
                    "type": "image_url",
                    "image_url": {"url": img_url}
                })

            payload = {
                "model": "gpt-4o-mini",
                "messages": messages,
                "response_format": {"type": "json_object"},
                "max_tokens": 1000
            }

            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    content = data["choices"][0]["message"]["content"]
                    return json.loads(content)
        except Exception as e:
            logger.warning(f"OpenAI vision call failed: {e}")

        return None


vision_analysis_service = VisionAnalysisService()
