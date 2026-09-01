import { CraftPriceBreakdown } from '../types/index.js';

export interface PricingInput {
  category: string;
  materialsCost?: number;
  laborHours?: number;
  hourlyWage?: number;
}

export function calculateFairArtisanPrice(input: PricingInput): CraftPriceBreakdown {
  const categoryBaseDefaults: Record<string, { materials: number; hours: number; hourlyRate: number }> = {
    pottery: { materials: 280, hours: 12, hourlyRate: 85 },
    paintings: { materials: 350, hours: 18, hourlyRate: 100 },
    textiles: { materials: 1200, hours: 32, hourlyRate: 105 },
    woodcraft: { materials: 220, hours: 8, hourlyRate: 95 },
    metalwork: { materials: 650, hours: 22, hourlyRate: 90 },
    jewelry: { materials: 450, hours: 10, hourlyRate: 95 },
    homedecor: { materials: 300, hours: 14, hourlyRate: 85 },
    leathercraft: { materials: 500, hours: 16, hourlyRate: 90 }
  };

  const defaults = categoryBaseDefaults[input.category.toLowerCase()] || categoryBaseDefaults.pottery;

  const rawMaterialCost = input.materialsCost ?? defaults.materials;
  const artisanLaborHours = input.laborHours ?? defaults.hours;
  const hourlyFairWageRate = input.hourlyWage ?? defaults.hourlyRate;
  const fairLaborCost = artisanLaborHours * hourlyFairWageRate;
  const packagingAndLogistics = Math.round((rawMaterialCost + fairLaborCost) * 0.08) + 60;

  const suggestedPrice = rawMaterialCost + fairLaborCost + packagingAndLogistics;
  const minPrice = Math.round(suggestedPrice * 0.88);
  const artisanDirectSharePercent = Math.round(((fairLaborCost + rawMaterialCost) / suggestedPrice) * 100);

  return {
    rawMaterialCost,
    artisanLaborHours,
    hourlyFairWageRate,
    fairLaborCost,
    packagingAndLogistics,
    suggestedPrice,
    minPrice,
    artisanDirectSharePercent
  };
}
