import { Product, Order } from '../types/index.js';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'craft-1',
    title: {
      en: 'Hand-Painted Jaipur Blue Pottery Floral Vase',
      hi: 'हाथ से चित्रित जयपुर ब्लू पॉटरी पुष्प फूलदान',
      bn: 'হাতে আঁকা জয়পুর ব্লু পটারি ফুলদানি',
      ta: 'கைவினை ஜெய்ப்பூர் நீல மண்பாண்ட மலர் குவளை',
      te: 'చేతితో చిత్రించిన జైపూర్ బ్లూ పాట్టరీ పూలకుండీ',
      mr: 'हात कोरलेला जयपूर ब्लू पॉटरी फुलांचा फुलदाणी',
      gu: 'હાથે બનાવેલ જયપુર બ્લૂ પોટરી ફ્લાવર વાઝ',
      kn: 'ಕೈಯಿಂದ ಚಿತ್ರಿಸಿದ ಜೈಪುರ ನೀಲಿ ಮಡಕೆ ಹೂದಾನಿ'
    },
    shortDescription: {
      en: 'Authentic GI-tagged quartz pottery fired with cobalt oxide and Persian floral motifs.',
      hi: 'प्रामाणिक जीआई-टैग क्वार्ट्ज मिट्टी के बर्तन, कोबाल्ट ऑक्साइड और फारसी पुष्प रूपांकनों से सुसज्जित।'
    },
    fullStory: {
      en: 'Crafted without using clay, Jaipur Blue Pottery uses a unique Egyptian paste of powdered quartz stone, Fuller’s earth, and natural gum.',
      hi: 'मिट्टी के उपयोग के बिना निर्मित, जयपुर ब्लू पॉटरी में पिसे हुए क्वार्ट्ज पत्थर, मुल्तानी मिट्टी और प्राकृतिक गोंद का एक अनूठा मिश्रण प्रयोग होता है।'
    },
    category: 'pottery',
    price: 1850,
    originalPrice: 2400,
    images: [
      'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&auto=format&fit=crop&q=80'
    ],
    artisan: {
      id: 'artisan-1',
      name: 'Ramnarayan Kumhar',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      village: 'Kot Jewar, Jaipur',
      state: 'Rajasthan',
      craftSpecialty: 'Blue Pottery & Glaze Art',
      experienceYears: 32,
      bio: {
        en: '4th generation master potter carrying forward Rajasthan’s GI-certified blue pottery craft.',
        hi: 'राजस्थान की जीआई-प्रमाणित ब्लू पॉटरी कला को आगे बढ़ाने वाले चौथी पीढ़ी के मास्टर कुम्हार।'
      },
      verified: true,
      giCertifiedArtisan: true,
      nationalAwardee: true,
      totalProductsSold: 428,
      rating: 4.9,
      storyQuote: 'Every stroke of cobalt is a prayer to preservation of our royal Rajasthani heritage.'
    },
    originState: 'Rajasthan',
    originRegion: 'Jaipur',
    giTagStatus: {
      hasGiTag: true,
      giTagNumber: 'GI-244',
      registeredName: 'Blue Pottery of Jaipur'
    },
    materialsUsed: ['Quartz Powder', 'Natural Resin', 'Cobalt Oxide', 'Copper Glaze'],
    craftTechnique: 'Hand-pressed Egyptian Paste molding & Hand-brushed Freehand Underglaze Painting',
    productionTimeDays: 7,
    ecoFriendly: true,
    stockCount: 14,
    rating: 4.9,
    reviewCount: 46,
    reviews: [],
    priceBreakdown: {
      rawMaterialCost: 380,
      artisanLaborHours: 16,
      hourlyFairWageRate: 85,
      fairLaborCost: 1360,
      packagingAndLogistics: 110,
      suggestedPrice: 1850,
      minPrice: 1600,
      artisanDirectSharePercent: 82
    },
    tags: ['Jaipur', 'Blue Pottery', 'GI Tagged', 'Handmade'],
    createdAt: '2026-02-10'
  }
];

export const INITIAL_ORDERS: Order[] = [];
