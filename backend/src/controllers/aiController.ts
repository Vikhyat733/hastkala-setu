import { Request, Response } from 'express';
import { processCraftImageWithGemini } from '../services/geminiService.js';
import { calculateFairArtisanPrice } from '../services/pricingEngine.js';

export const analyzeCraftImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageBase64, mimeType, apiKey, craftHint } = req.body;

    let base64 = imageBase64;
    let type = mimeType || 'image/jpeg';

    // If multipart file uploaded
    if (req.file) {
      base64 = req.file.buffer.toString('base64');
      type = req.file.mimetype;
    }

    if (!base64 && !craftHint) {
      res.status(400).json({ error: 'Please provide either an image or a craftHint' });
      return;
    }

    const result = await processCraftImageWithGemini(base64 || '', type, apiKey, craftHint);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error analyzing craft image:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
};

export const getFairPriceEstimate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, materialsCost, laborHours, hourlyWage } = req.body;
    if (!category) {
      res.status(400).json({ error: 'category is required' });
      return;
    }

    const breakdown = calculateFairArtisanPrice({
      category,
      materialsCost: Number(materialsCost),
      laborHours: Number(laborHours),
      hourlyWage: Number(hourlyWage)
    });

    res.json({ success: true, data: breakdown });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
