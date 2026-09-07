import { CraftPriceBreakdown } from '../types/index.js';

export interface PricingInput {
  category: string;
  materialsCost?: number;
  laborHours?: number;
  hourlyWage?: number;
  complexity?: 'simple' | 'medium' | 'complex' | 'master';
  basis?: 'ai_analysis' | 'reference_data' | 'artisan_input';
}

/**
 * Explainable Fair Artisan Pricing Model (SIH26090 MoSJE Standard)
 * Ensures honest wage floor, transparent material cost, and fair artisan margin.
 */
export function calculateFairArtisanPrice(input: PricingInput): CraftPriceBreakdown {
  const categoryDefaults: Record<string, { materials: number; hours: number; hourlyRate: number; marginRate: number }> = {
    pottery: { materials: 320, hours: 14, hourlyRate: 85, marginRate: 0.18 },
    paintings: { materials: 350, hours: 18, hourlyRate: 100, marginRate: 0.20 },
    textiles: { materials: 1100, hours: 30, hourlyRate: 105, marginRate: 0.22 },
    woodcraft: { materials: 240, hours: 9, hourlyRate: 95, marginRate: 0.18 },
    metalwork: { materials: 680, hours: 22, hourlyRate: 90, marginRate: 0.20 },
    jewelry: { materials: 480, hours: 11, hourlyRate: 95, marginRate: 0.22 },
    homedecor: { materials: 320, hours: 14, hourlyRate: 85, marginRate: 0.18 },
    leathercraft: { materials: 520, hours: 16, hourlyRate: 90, marginRate: 0.20 }
  };

  const key = input.category ? input.category.toLowerCase() : 'pottery';
  const defaults = categoryDefaults[key] || categoryDefaults.pottery;

  const rawMaterialCost = Math.max(50, Math.round(input.materialsCost ?? defaults.materials));
  const artisanLaborHours = Math.max(1, Math.round(input.laborHours ?? defaults.hours));
  const hourlyFairWageRate = Math.max(50, Math.round(input.hourlyWage ?? defaults.hourlyRate));

  // 1. Direct Fair Labor Cost
  const fairLaborCost = artisanLaborHours * hourlyFairWageRate;

  // 2. Packaging & Safe Logistics (eco-friendly straw/corrugated cushioning + delivery fee)
  const packagingAndLogistics = Math.round((rawMaterialCost + fairLaborCost) * 0.07) + 50;

  // 3. Complexity Multiplier for Artisan Fair Margin
  const complexityMultiplier = 
    input.complexity === 'master' ? 1.4 :
    input.complexity === 'complex' ? 1.2 :
    input.complexity === 'simple' ? 0.85 : 1.0;

  const fairMargin = Math.round((rawMaterialCost + fairLaborCost) * defaults.marginRate * complexityMultiplier);

  // 4. Absolute Price Floor (No artisan sells below direct costs)
  const minPrice = rawMaterialCost + fairLaborCost + packagingAndLogistics;

  // 5. Recommended / Fair Price
  const suggestedPrice = minPrice + fairMargin;

  // 6. Realistic Market Benchmark Range (for transparent buyer guidance)
  const marketRangeMin = Math.round(minPrice * 0.98);
  const marketRangeMax = Math.round(suggestedPrice * 1.35);

  // 7. Direct Share to Artisan (Materials + Labor + Fair Margin)
  const artisanDirectSharePercent = Math.min(
    96, 
    Math.max(78, Math.round(((fairLaborCost + rawMaterialCost + fairMargin) / suggestedPrice) * 100))
  );

  return {
    rawMaterialCost,
    artisanLaborHours,
    hourlyFairWageRate,
    fairLaborCost,
    packagingAndLogistics,
    fairMargin,
    marketRangeMin,
    marketRangeMax,
    estimationBasis: input.basis || 'reference_data',
    suggestedPrice,
    minPrice,
    artisanDirectSharePercent
  };
}
