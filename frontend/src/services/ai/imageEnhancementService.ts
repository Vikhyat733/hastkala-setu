/**
 * Image Enhancement Service Abstraction
 *
 * Architecture:
 *   UI → ImageEnhancementService → Backend POST /api/v1/ai/enhance-image
 *      → Real Pillow processing (brightness, contrast, sharpness, crop, resize)
 *      → Enhanced JPEG base64 → UI
 *
 * IMPORTANT: The backend applies REAL photo correction filters (not AI in dev mode).
 * The UI should label this as "Photo Enhancement" not "AI Enhancement" unless a
 * production AI model is configured.
 *
 * Dev fallback: Pillow-based processing (autocontrast, brightness, contrast, sharpness, crop).
 * Production path: Replace backend enhancer with Gemini Vision / background-removal API.
 */
import { API_BASE_URL } from '../api/apiClient';

export interface EnhanceImageResult {
  success: boolean;
  originalImage: string;       // The user's original unmodified image
  enhancedImage: string;       // The actually processed image
  operationsApplied: string[]; // Accurate labels of what happened
  isDevFallback: boolean;      // true = Pillow processing, false = production AI
  statusMessage: string;       // Human-readable status (for transparency)
}

export class ImageEnhancementService {
  async enhanceImage(imageDataUrl: string): Promise<EnhanceImageResult> {
    // Attempt backend processing
    try {
      const response = await fetch(`${API_BASE_URL}/ai/enhance-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_base64: imageDataUrl,
          enhancement_level: 'standard',
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          return {
            success: true,
            originalImage: imageDataUrl,
            enhancedImage: data.enhanced_url || imageDataUrl,
            operationsApplied: data.operations_applied || [],
            isDevFallback: data.dev_fallback !== false,
            statusMessage: data.dev_fallback
              ? 'Photo corrected using standard enhancement filters'
              : 'Photo enhanced with AI studio processing',
          };
        }
      }
    } catch (err) {
      console.warn('[ImageEnhancementService] Backend unavailable, using client-side fallback:', err);
    }

    // Client-side fallback: apply CSS filter effects by returning original
    // with honest operations list describing what was attempted
    return {
      success: true,
      originalImage: imageDataUrl,
      enhancedImage: imageDataUrl, // No processing done — return original honestly
      operationsApplied: [
        'Server enhancement unavailable',
        'Original image preserved without modification',
        '(Reconnect to MELA backend for real enhancement)',
      ],
      isDevFallback: true,
      statusMessage: 'Enhancement server unavailable — original image used',
    };
  }
}

export const imageEnhancementService = new ImageEnhancementService();
