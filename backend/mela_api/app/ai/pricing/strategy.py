"""Pricing Strategy Subsystem

Defines the modular pricing strategy interface, with:
- DevelopmentPricingStrategy: Product-aware deterministic cost & margin calculation based on actual craft category, material, and artisan labor inputs.
- MLMarketPricingStrategy: Future placeholder for trained econometric / ML pricing models.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import math


class BasePricingStrategy(ABC):
    """Abstract interface for MELA pricing strategies."""

    @abstractmethod
    def calculate_price(
        self,
        title: Optional[str] = None,
        category: Optional[str] = None,
        material: Optional[str] = None,
        craft_type: Optional[str] = None,
        description: Optional[str] = None,
        raw_material_cost: Optional[float] = None,
        making_cost: Optional[float] = None,
        crafting_hours: Optional[float] = None,
        hourly_wage: Optional[float] = None,
    ) -> Dict[str, Any]:
        """Calculates fair artisan recommended price and cost breakdown."""
        pass


class DevelopmentPricingStrategy(BasePricingStrategy):
    """
    Deterministic, product-aware development pricing strategy.
    
    Uses category, material, and craft-specific cost benchmarks if artisan inputs are missing,
    or calculates exact margins when artisan supplies material and labor costs.
    
    IMPORTANT:
    Does not invent fake live market signals. Uses honest cost-plus fair trade artisan margin.
    """

    # Category and craft specific baseline estimates (material cost, labor hours, complexity factor)
    CATEGORY_BASELINES = {
        "bags": {"mat": 180.0, "hours": 2.5, "wage": 90.0, "multiplier": 1.45, "name_hi": "बैग और एक्सेसरीज़"},
        "jute": {"mat": 180.0, "hours": 2.5, "wage": 90.0, "multiplier": 1.45, "name_hi": "जूट शिल्प"},
        "pottery": {"mat": 100.0, "hours": 2.0, "wage": 90.0, "multiplier": 1.45, "name_hi": "मिट्टी के बर्तन"},
        "terracotta": {"mat": 110.0, "hours": 2.2, "wage": 95.0, "multiplier": 1.45, "name_hi": "टेराकोटा"},
        "clay": {"mat": 90.0, "hours": 2.0, "wage": 85.0, "multiplier": 1.40, "name_hi": "मिट्टी कला"},
        "jewellery": {"mat": 140.0, "hours": 2.0, "wage": 100.0, "multiplier": 1.50, "name_hi": "आभूषण व गहने"},
        "bangles": {"mat": 110.0, "hours": 1.5, "wage": 90.0, "multiplier": 1.45, "name_hi": "चूड़ियाँ व कंगन"},
        "brass": {"mat": 220.0, "hours": 3.0, "wage": 110.0, "multiplier": 1.50, "name_hi": "पीतल शिल्प"},
        "textiles": {"mat": 350.0, "hours": 4.5, "wage": 100.0, "multiplier": 1.50, "name_hi": "वस्त्र व हथकरघा"},
        "saree": {"mat": 750.0, "hours": 8.0, "wage": 120.0, "multiplier": 1.55, "name_hi": "साड़ी"},
        "scarf": {"mat": 280.0, "hours": 3.0, "wage": 95.0, "multiplier": 1.45, "name_hi": "दुपट्टा व शॉल"},
        "handloom": {"mat": 320.0, "hours": 4.0, "wage": 100.0, "multiplier": 1.50, "name_hi": "हथकरघा"},
        "woodcraft": {"mat": 260.0, "hours": 3.5, "wage": 100.0, "multiplier": 1.50, "name_hi": "काष्ठ कला"},
        "wood": {"mat": 260.0, "hours": 3.5, "wage": 100.0, "multiplier": 1.50, "name_hi": "लकड़ी शिल्प"},
        "art": {"mat": 150.0, "hours": 3.5, "wage": 110.0, "multiplier": 1.55, "name_hi": "कला व पेंटिंग"},
        "painting": {"mat": 150.0, "hours": 4.0, "wage": 110.0, "multiplier": 1.55, "name_hi": "चित्रकारी"},
        "home": {"mat": 120.0, "hours": 2.0, "wage": 90.0, "multiplier": 1.40, "name_hi": "गृह सज्जा"},
        "bamboo": {"mat": 110.0, "hours": 2.0, "wage": 85.0, "multiplier": 1.40, "name_hi": "बाँस व बेंत"},
        "natural": {"mat": 130.0, "hours": 1.5, "wage": 80.0, "multiplier": 1.40, "name_hi": "प्राकृतिक उत्पाद"},
    }

    def _resolve_category_baseline(self, text_corpus: str) -> Dict[str, Any]:
        """Matches craft keywords in product text to determine realistic baseline costs."""
        text_lower = text_corpus.lower()
        for key, baseline in self.CATEGORY_BASELINES.items():
            if key in text_lower:
                return baseline
        # Default handicrafts baseline
        return {"mat": 160.0, "hours": 2.5, "wage": 95.0, "multiplier": 1.45, "name_hi": "हस्तशिल्प"}

    def calculate_price(
        self,
        title: Optional[str] = None,
        category: Optional[str] = None,
        material: Optional[str] = None,
        craft_type: Optional[str] = None,
        description: Optional[str] = None,
        raw_material_cost: Optional[float] = None,
        making_cost: Optional[float] = None,
        crafting_hours: Optional[float] = None,
        hourly_wage: Optional[float] = None,
    ) -> Dict[str, Any]:
        combined_text = f"{title or ''} {category or ''} {material or ''} {craft_type or ''} {description or ''}"
        baseline = self._resolve_category_baseline(combined_text)

        # 1. Determine material cost
        if raw_material_cost is not None and raw_material_cost > 0:
            final_mat_cost = round(float(raw_material_cost), 2)
        else:
            final_mat_cost = baseline["mat"]

        # 2. Determine labor/making cost
        if making_cost is not None and making_cost > 0:
            final_making_cost = round(float(making_cost), 2)
        else:
            hours = crafting_hours if (crafting_hours is not None and crafting_hours > 0) else baseline["hours"]
            wage = hourly_wage if (hourly_wage is not None and hourly_wage > 0) else baseline["wage"]
            final_making_cost = round(hours * wage, 2)

        # 3. Calculate base total cost
        total_cost = round(final_mat_cost + final_making_cost, 2)

        # 4. Multiplier and Suggested Price
        multiplier = baseline["multiplier"]
        raw_suggested = total_cost * multiplier

        # Round to attractive integer pricing (e.g. nearest 10 or 50)
        if raw_suggested >= 1000:
            suggested_price = float(round(raw_suggested / 50) * 50)
        elif raw_suggested >= 300:
            suggested_price = float(round(raw_suggested / 10) * 10)
        else:
            suggested_price = float(round(raw_suggested / 5) * 5)

        # Guarantee suggested price covers at least base cost + 20% minimum viable margin
        if suggested_price <= total_cost:
            suggested_price = float(round((total_cost * 1.25) / 10) * 10)

        min_viable_price = float(round((total_cost * 1.15) / 10) * 10)
        max_market_price = float(round((suggested_price * 1.30) / 10) * 10)
        estimated_profit = round(suggested_price - total_cost, 2)
        margin_pct = round((estimated_profit / suggested_price) * 100, 1) if suggested_price > 0 else 0.0

        int_total = int(round(total_cost))
        int_mat = int(round(final_mat_cost))
        int_make = int(round(final_making_cost))
        int_sugg = int(round(suggested_price))
        int_profit = int(round(estimated_profit))

        explanation_hi = (
            f"आपकी अनुमानित लागत ₹{int_total} (सामग्री ₹{int_mat} + कारीगरी ₹{int_make}) है। "
            f"MELA ₹{int_sugg} की कीमत की सलाह देता है ताकि लगभग ₹{int_profit} ({margin_pct}%) का उचित लाभ मिल सके।"
        )
        explanation_en = (
            f"Your estimated cost is ₹{int_total} (Materials ₹{int_mat} + Labor ₹{int_make}). "
            f"MELA suggests ₹{int_sugg}, giving an estimated artisan profit of ₹{int_profit} ({margin_pct}% margin)."
        )

        return {
            "success": True,
            "currency": "INR",
            "suggested_price": suggested_price,
            "min_viable_price": min_viable_price,
            "max_market_price": max_market_price,
            "estimated_material_cost": final_mat_cost,
            "estimated_making_cost": final_making_cost,
            "total_cost": total_cost,
            "estimated_profit": estimated_profit,
            "margin_percentage": margin_pct,
            "explanation_hindi": explanation_hi,
            "explanation_english": explanation_en,
            "strategy_used": "DevelopmentPricingStrategy",
        }


class MLMarketPricingStrategy(BasePricingStrategy):
    """
    Placeholder for future ML / econometric market-demand pricing strategy.
    
    When an ML model is trained on authentic handicraft market transactions,
    this strategy will query feature vectors without changing API signatures.
    """

    def calculate_price(
        self,
        title: Optional[str] = None,
        category: Optional[str] = None,
        material: Optional[str] = None,
        craft_type: Optional[str] = None,
        description: Optional[str] = None,
        raw_material_cost: Optional[float] = None,
        making_cost: Optional[float] = None,
        crafting_hours: Optional[float] = None,
        hourly_wage: Optional[float] = None,
    ) -> Dict[str, Any]:
        # Gracefully delegates to development strategy until live weights are loaded
        return DevelopmentPricingStrategy().calculate_price(
            title=title,
            category=category,
            material=material,
            craft_type=craft_type,
            description=description,
            raw_material_cost=raw_material_cost,
            making_cost=making_cost,
            crafting_hours=crafting_hours,
            hourly_wage=hourly_wage,
        )
