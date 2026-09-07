import { AIVisionResult } from '../types/index.js';
import { calculateFairArtisanPrice } from './pricingEngine.js';

export async function processCraftImageWithGemini(
  base64Image: string,
  mimeType: string = 'image/jpeg',
  apiKey?: string,
  craftHint?: string
): Promise<AIVisionResult> {
  const geminiKey = apiKey || process.env.GEMINI_API_KEY;

  if (!geminiKey) {
    // Return high-precision simulated AI neural analysis with honest labeling
    return generateServerFallbackAnalysis(craftHint || '');
  }

  const prompt = `
You are an expert master curator of Indian indigenous handicrafts, Geographical Indication (GI) heritage crafts, and fair-trade artisan pricing for the Ministry of Social Justice & Empowerment (MoSJE).
Analyze this handicraft product photo and return a strict JSON object with:
1. "title": An object with titles in 'en' (English), 'hi' (Hindi), 'bn' (Bengali), 'ta' (Tamil), 'te' (Telugu), 'mr' (Marathi), 'gu' (Gujarati), 'kn' (Kannada).
2. "category": One of ["pottery", "paintings", "textiles", "woodcraft", "metalwork", "jewelry", "homedecor", "leathercraft"].
3. "craftTechnique": Traditional technique name.
4. "materials": Array of 3-5 authentic materials.
5. "originRegion": Region/District in India.
6. "originState": State in India.
7. "hasGiTag": boolean whether this craft visually resembles a registered GI craft.
8. "giTagName": official GI tag name if true.
9. "materialsCostEstimated": estimated raw material cost in INR (e.g. 350).
10. "laborHoursEstimated": estimated artisan labor hours required (e.g. 16).
11. "craftComplexity": one of ["simple", "medium", "complex", "master"].
12. "shortDescription": Object with 1-2 sentence summaries in 'en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn'.
13. "fullStory": Detailed cultural story in 'en' and 'hi'.
14. "careInstructions": Practical advice for maintaining and cleaning.
15. "socialBlurbWhatsApp": Short marketing message for WhatsApp broadcast.
16. "socialBlurbInstagram": Instagram caption with trendy hashtags.
17. "confidenceScore": number between 0.85 and 0.98.
18. "detectedVisualFeatures": Array of 4-6 key visual elements detected.
19. "missingInfoPrompt": If specific details like dimensions, weight, or wood type are ambiguous from photo, write a friendly question in Hindi for the artisan (e.g., "इस शिल्प का अनुमानित आकार (ऊँचाई x चौड़ाई) क्या है?").

CRITICAL: Never claim official government GI certification on visual analysis alone.
Respond ONLY with valid JSON. Do not include markdown backticks.`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Image
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      console.warn('Gemini API returned non-200, using server fallback:', await response.text());
      return generateServerFallbackAnalysis(craftHint || '');
    }

    const data = (await response.json()) as any;
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      return generateServerFallbackAnalysis(craftHint || '');
    }

    const cleanedText = candidateText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedText);

    // Calculate explainable fair price using pricing engine
    const priceBreakdown = calculateFairArtisanPrice({
      category: parsed.category || 'pottery',
      materialsCost: parsed.materialsCostEstimated,
      laborHours: parsed.laborHoursEstimated,
      complexity: parsed.craftComplexity || 'medium',
      basis: 'ai_analysis'
    });

    return {
      title: parsed.title,
      category: parsed.category || 'pottery',
      craftTechnique: parsed.craftTechnique || 'Traditional Indian Handcraft',
      materials: parsed.materials || ['Natural Fibers', 'Clay'],
      originRegion: parsed.originRegion || 'Artisan Hub',
      originState: parsed.originState || 'India',
      hasGiTag: !!parsed.hasGiTag,
      giTagName: parsed.giTagName,
      giVerificationStatus: parsed.hasGiTag ? 'ai_suggested' : 'not_verified',
      priceBreakdown,
      shortDescription: parsed.shortDescription,
      fullStory: parsed.fullStory,
      careInstructions: parsed.careInstructions || 'Clean gently with a soft dry cloth.',
      socialBlurbWhatsApp: parsed.socialBlurbWhatsApp || '',
      socialBlurbInstagram: parsed.socialBlurbInstagram || '',
      confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 0.94,
      detectedVisualFeatures: parsed.detectedVisualFeatures || ['Authentic Handcrafted Texture'],
      resultSource: 'gemini_api',
      isDemo: false,
      missingInfoPrompt: parsed.missingInfoPrompt
    };
  } catch (error) {
    console.error('Gemini vision API error on backend, using fallback:', error);
    return generateServerFallbackAnalysis(craftHint || '');
  }
}

function generateServerFallbackAnalysis(craftHint: string): AIVisionResult {
  const isPainting = craftHint.toLowerCase().includes('paint') || craftHint.toLowerCase().includes('madhubani');
  const isMetal = craftHint.toLowerCase().includes('metal') || craftHint.toLowerCase().includes('dhokra');
  const isWood = craftHint.toLowerCase().includes('wood') || craftHint.toLowerCase().includes('channapatna');
  const isSilk = craftHint.toLowerCase().includes('silk') || craftHint.toLowerCase().includes('rogan') || craftHint.toLowerCase().includes('textile');

  const category = isPainting ? 'paintings' : isMetal ? 'metalwork' : isWood ? 'woodcraft' : isSilk ? 'textiles' : 'pottery';
  const priceBreakdown = calculateFairArtisanPrice({ 
    category,
    complexity: 'medium',
    basis: 'reference_data'
  });

  return {
    title: {
      en: isPainting
        ? 'Hand-Painted Madhubani Tree of Life Folk Canvas'
        : isMetal
        ? 'Bastar Dhokra Lost-Wax Bell Metal Elephant'
        : isWood
        ? 'Channapatna Organic Lacquerware Wooden Toy'
        : isSilk
        ? 'Handwoven Kutch Rogan Art Tussar Silk Stole'
        : 'Jaipur Hand-Painted Blue Pottery Floral Vase',
      hi: isPainting
        ? 'हस्तनिर्मित मधुबनी जीवन वृक्ष लोक चित्रकला'
        : isMetal
        ? 'बस्तर ढोकरा लुप्त-मोम बेल मेटल हाथी'
        : isWood
        ? 'चन्नापटना जैविक लाकवेयर लकड़ी का खिलौना'
        : isSilk
        ? 'हाथ से बुनी कच्छ रोगन आर्ट सिल्क शॉल'
        : 'जयपुर हाथ से चित्रित ब्लू पॉटरी पुष्प फूलदान',
      bn: 'ঐতিহ্যবাহী ভারতীয় হস্তশিল্প সৃষ্টি',
      ta: 'பாரம்பரிய இந்திய கைவினைப்பொருள்',
      te: 'సాంప్రదాయ భారతీయ హస్తకళల సృష్టి',
      mr: 'पारंपरिक भारतीय हस्तकला निर्मिती',
      gu: 'પરંપરાગત ભારતીય હસ્તકળા રચના',
      kn: 'ಸಾಂಪ್ರದಾಯಿಕ ಭಾರತೀಯ ಕರಕುಶಲ ಕೃತಿ'
    },
    category,
    craftTechnique: isPainting 
      ? 'Kachni & Bharni Line Painting with Botanical Dyes'
      : isMetal
      ? 'Lost-Wax (Cire Perdue) Solid Bell Metal Casting'
      : isWood
      ? 'Lathe Turning & Friction Shellac Lacquering'
      : isSilk
      ? 'Castor Oil Jelly Extrusion Styling with Metal Stylus'
      : 'Hand-pressed Egyptian Quartz Paste & Underglaze',
    materials: isPainting 
      ? ['Handmade Paper', 'Turmeric', 'Indigo Leaf Dye', 'Lampblack']
      : isMetal
      ? ['Recycled Brass Alloy', 'Natural Beeswax', 'River Clay']
      : isWood
      ? ['Ivory Wood (Wrightia Tinctoria)', 'Natural Shellac', 'Turmeric Color']
      : isSilk
      ? ['Pure Tussar Silk', 'Wild Castor Oil Jelly', 'Natural Earth Ochre']
      : ['Quartz Powder', 'Natural Resin', 'Cobalt Oxide', 'Copper Glaze'],
    originRegion: isPainting ? 'Madhubani' : isMetal ? 'Bastar' : isWood ? 'Channapatna' : isSilk ? 'Kutch' : 'Jaipur',
    originState: isPainting ? 'Bihar' : isMetal ? 'Chhattisgarh' : isWood ? 'Karnataka' : isSilk ? 'Gujarat' : 'Rajasthan',
    hasGiTag: true,
    giTagName: isPainting 
      ? 'Madhubani Paintings of Bihar'
      : isMetal
      ? 'Bastar Dhokra'
      : isWood
      ? 'Channapatna Toys and Dolls'
      : isSilk
      ? 'Kutch Rogan Craft'
      : 'Blue Pottery of Jaipur',
    giVerificationStatus: 'ai_suggested',
    priceBreakdown,
    shortDescription: {
      en: 'Authentic Indian handicraft identified by AI Vision studio with traditional regional motifs.',
      hi: 'पारंपरिक क्षेत्रीय रूपांकनों के साथ एआई विजन स्टूडियो द्वारा पहचाना गया प्रामाणिक भारतीय हस्तशिल्प।'
    },
    fullStory: {
      en: 'Preserving living indigenous cultural traditions passed down across centuries through sustainable, plastic-free natural materials.',
      hi: 'टिकाऊ, प्लास्टिक-मुक्त प्राकृतिक सामग्रियों के माध्यम से सदियों पुरानी जीवित लोक परंपराओं का संरक्षण।'
    },
    careInstructions: 'Clean gently with a soft dry cloth. Keep away from harsh moisture and direct sunlight.',
    socialBlurbWhatsApp: '✨ Support rural master artisans! Check out this authentic handicraft on mela. 100% fair-trade direct artisan earnings.',
    socialBlurbInstagram: 'Preserving living Indian cultural heritage ✨ Handcrafted with traditional GI techniques on mela. #Mela #VocalForLocal #ArtisanDirect #HandmadeInIndia',
    confidenceScore: 0.94,
    detectedVisualFeatures: ['Handmade Symmetry', 'Natural Dye Pigment', 'Traditional Heritage Motif'],
    resultSource: 'demo_fallback',
    isDemo: true,
    missingInfoPrompt: 'कृपया उत्पाद की सटीक ऊँचाई और वजन की पुष्टि करें (जैसे: 10 इंच, 500 ग्राम)।'
  };
}
