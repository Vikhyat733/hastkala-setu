"""Pricing Intelligence Subsystem (Modular Adapter)"""
from typing import Dict, Any, Optional
from app.ai.pricing.strategy import BasePricingStrategy, DevelopmentPricingStrategy, MLMarketPricingStrategy


class PricingEstimator:
    """Estimates fair artisan selling prices with transparent breakdown of materials, making cost, and profit."""

    def __init__(self, strategy: Optional[BasePricingStrategy] = None):
        self.strategy = strategy or DevelopmentPricingStrategy()

    def set_strategy(self, strategy: BasePricingStrategy):
        self.strategy = strategy

    def estimate_price(
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
        """Calculates product-specific price recommendations."""
        return self.strategy.calculate_price(
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


pricing_estimator = PricingEstimator()
