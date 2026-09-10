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

    // Client-side fallback: actually apply enhancement using canvas
    try {
      const enhancedDataUrl = await this.applyCanvasEnhancement(imageDataUrl);
      return {
        success: true,
        originalImage: imageDataUrl,
        enhancedImage: enhancedDataUrl,
        operationsApplied: [
          'Client-side enhancement applied',
          'Brightness & contrast adjusted',
          '(Local processing fallback)'
        ],
        isDevFallback: true,
        statusMessage: 'Photo corrected using local enhancement filters',
      };
    } catch (e) {
      return {
        success: true,
        originalImage: imageDataUrl,
        enhancedImage: imageDataUrl,
        operationsApplied: [
          'Enhancement unavailable',
          'Original image preserved'
        ],
        isDevFallback: true,
        statusMessage: 'Enhancement unavailable — original image used',
      };
    }
  }

  private applyCanvasEnhancement(imageDataUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No context');
        
        ctx.filter = 'contrast(1.1) brightness(1.05) saturate(1.1)';
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.onerror = reject;
      img.src = imageDataUrl;
    });
  }
}

export const imageEnhancementService = new ImageEnhancementService();
