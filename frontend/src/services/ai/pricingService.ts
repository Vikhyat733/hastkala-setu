/**
 * AI Pricing Assistant Service
 *
 * Connects to backend POST /api/v1/ai/pricing.
 * Includes deterministic, product-aware fallback logic ensuring
 * product-specific price recommendations without hardcoded fixed numbers.
 */
import { API_BASE_URL } from '../api/apiClient';

export interface PricingRequestParams {
  title?: string;
  category?: string;
  material?: string;
  craftType?: string;
  description?: string;
  rawMaterialCost?: number;
  makingCost?: number;
  craftingHours?: number;
  hourlyWage?: number;
}

export interface PricingResult {
  success: boolean;
  currency: string;
  suggestedPrice: number;
  minViablePrice: number;
  maxMarketPrice: number;
  estimatedMaterialCost: number;
  estimatedMakingCost: number;
  totalCost: number;
  estimatedProfit: number;
  profitMarginPercent: number;
  explanationHindi: string;
  explanationEnglish: string;
  strategyUsed?: string;
}

// Category-based benchmark dictionary for local fallback
const FALLBACK_BENCHMARKS: Record<
  string,
  { mat: number; make: number; mult: number; nameHi: string }
> = {
  bags: { mat: 180, make: 220, mult: 1.45, nameHi: 'बैग और एक्सेसरीज़' },
  jute: { mat: 180, make: 220, mult: 1.45, nameHi: 'जूट शिल्प' },
  pottery: { mat: 100, make: 180, mult: 1.45, nameHi: 'मिट्टी के बर्तन' },
  terracotta: { mat: 110, make: 190, mult: 1.45, nameHi: 'टेराकोटा' },
  clay: { mat: 90, make: 170, mult: 1.4, nameHi: 'मिट्टी कला' },
  jewellery: { mat: 120, make: 160, mult: 1.5, nameHi: 'आभूषण व गहने' },
  bangles: { mat: 110, make: 140, mult: 1.45, nameHi: 'चूड़ियाँ व कंगन' },
  brass: { mat: 200, make: 240, mult: 1.5, nameHi: 'पीतल शिल्प' },
  textiles: { mat: 350, make: 450, mult: 1.5, nameHi: 'वस्त्र व हथकरघा' },
  saree: { mat: 750, make: 900, mult: 1.55, nameHi: 'साड़ी' },
  scarf: { mat: 250, make: 350, mult: 1.45, nameHi: 'दुपट्टा' },
  woodcraft: { mat: 280, make: 320, mult: 1.5, nameHi: 'काष्ठ कला' },
  wood: { mat: 280, make: 320, mult: 1.5, nameHi: 'लकड़ी शिल्प' },
  art: { mat: 150, make: 350, mult: 1.55, nameHi: 'कला व पेंटिंग' },
  home: { mat: 120, make: 180, mult: 1.4, nameHi: 'गृह सज्जा' },
  natural: { mat: 130, make: 120, mult: 1.4, nameHi: 'प्राकृतिक उत्पाद' },
};

function resolveBenchmark(text: string) {
  const t = text.toLowerCase();
  for (const [k, v] of Object.entries(FALLBACK_BENCHMARKS)) {
    if (t.includes(k)) return v;
  }
  return { mat: 160, make: 200, mult: 1.45, nameHi: 'हस्तशिल्प' };
}

export class PricingService {
  async getSuggestedPrice(params: PricingRequestParams): Promise<PricingResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/pricing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: params.title || '',
          category: params.category || '',
          material: params.material || '',
          craft_type: params.craftType || '',
          description: params.description || '',
          raw_material_cost: params.rawMaterialCost,
          making_cost: params.makingCost,
          crafting_hours: params.craftingHours,
          hourly_wage: params.hourlyWage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const mat = Number(data.estimated_material_cost);
        const make = Number(data.estimated_making_cost);
        const total = data.total_cost ? Number(data.total_cost) : mat + make;
        const sugg = Number(data.suggested_price);
        const profit = Number(data.estimated_profit);

        return {
          success: true,
          currency: data.currency || 'INR',
          suggestedPrice: sugg,
          minViablePrice: Number(data.min_viable_price),
          maxMarketPrice: Number(data.max_market_price),
          estimatedMaterialCost: mat,
          estimatedMakingCost: make,
          totalCost: total,
          estimatedProfit: profit,
          profitMarginPercent: Number(data.margin_percentage),
          explanationHindi: data.explanation_hindi,
          explanationEnglish: data.explanation_english,
          strategyUsed: data.strategy_used,
        };
      }
    } catch (err) {
      console.warn('[PricingService] Backend pricing offline, using product-aware deterministic calculation:', err);
    }

    // Deterministic client-side product calculation
    const corpus = `${params.title || ''} ${params.category || ''} ${params.material || ''} ${params.craftType || ''} ${params.description || ''}`;
    const benchmark = resolveBenchmark(corpus);

    const mat = (params.rawMaterialCost && params.rawMaterialCost > 0)
      ? params.rawMaterialCost
      : benchmark.mat;

    const make = (params.makingCost && params.makingCost > 0)
      ? params.makingCost
      : (params.craftingHours ? params.craftingHours * 90 : benchmark.make);

    const total = mat + make;
    let sugg = Math.round((total * benchmark.mult) / 10) * 10;
    if (sugg <= total) {
      sugg = Math.round((total * 1.25) / 10) * 10;
    }
    const profit = Math.max(0, sugg - total);
    const marginPct = sugg > 0 ? Math.round((profit / sugg) * 1000) / 10 : 0;

    return {
      success: true,
      currency: 'INR',
      suggestedPrice: sugg,
      minViablePrice: Math.round((total * 1.15) / 10) * 10,
      maxMarketPrice: Math.round((sugg * 1.30) / 10) * 10,
      estimatedMaterialCost: mat,
      estimatedMakingCost: make,
      totalCost: total,
      estimatedProfit: profit,
      profitMarginPercent: marginPct,
      explanationHindi: `आपकी अनुमानित लागत ₹${total} (सामग्री ₹${mat} + कारीगरी ₹${make}) है। MELA ₹${sugg} की कीमत की सलाह देता है जिससे लगभग ₹${profit} का लाभ रहे।`,
      explanationEnglish: `Your estimated cost is ₹${total} (Materials ₹${mat} + Labor ₹${make}). MELA recommends ₹${sugg}, yielding an estimated profit of ₹${profit}.`,
      strategyUsed: 'ClientDeterministicFallback',
    };
  }
}

export const pricingService = new PricingService();
