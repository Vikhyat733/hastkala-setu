import { RuralAppProductItem } from '../../../types';

export interface RuralArtisanUser {
  name: string;
  phone: string;
  village: string;
  state: string;
  avatar: string;
  rating: number;
  totalEarnings: number;
  totalOrders: number;
  pendingPayment: number;
  bankAccountLinked: boolean;
  bankName: string;
  accountNumberMasked: string;
  sahayakName: string;
  sahayakPhone: string;
}

export const DEFAULT_RURAL_ARTISAN: RuralArtisanUser = {
  name: 'सीता देवी',
  phone: '9876543210',
  village: 'रामपुर',
  state: 'उत्तर प्रदेश',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  rating: 4.9,
  totalEarnings: 18450,
  totalOrders: 28,
  pendingPayment: 2400,
  bankAccountLinked: true,
  bankName: 'स्टेट बैंक ऑफ इंडिया (SBI)',
  accountNumberMasked: '•••• •••• 4592',
  sahayakName: 'रमेश कुमार (ग्राम समन्वयक)',
  sahayakPhone: '+91 98112 34567'
};

export const INITIAL_RURAL_PRODUCTS: RuralAppProductItem[] = [
  {
    id: 'rural-p-1',
    name: 'बाँस की टोकरी',
    category: 'घर सजावट',
    price: 800,
    estimatedPriceRange: '₹700 - ₹900',
    description: 'यह टोकरी बाँस से बनी है। यह मजबूत और सुंदर है। घर में फल, सब्जियां या सजावट रखने के लिए बहुत अच्छी है।',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&auto=format&fit=crop&q=80',
    status: 'published',
    dateAdded: '2026-08-30',
    viewsCount: 142,
    ordersCount: 3
  },
  {
    id: 'rural-p-2',
    name: 'हाथ से बुना दुपट्टा',
    category: 'कपड़ा',
    price: 1200,
    estimatedPriceRange: '₹1,100 - ₹1,400',
    description: 'शुद्ध सूती धागों से हथकरघे पर बुना गया पारंपरिक लाल-गुलाबी दुपट्टा। बहुत मुलायम और आरामदायक है।',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    status: 'published',
    dateAdded: '2026-08-28',
    viewsCount: 98,
    ordersCount: 2
  },
  {
    id: 'rural-p-3',
    name: 'मिट्टी का घड़ा',
    category: 'सजावट',
    price: 600,
    estimatedPriceRange: '₹500 - ₹700',
    description: 'प्राकृतिक काली-लाल मिट्टी से चाक पर गढ़ा गया पारंपरिक मटका। पानी को प्राकृतिक रूप से शीतल और मीठा रखता है।',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80',
    status: 'published',
    dateAdded: '2026-08-25',
    viewsCount: 215,
    ordersCount: 5
  }
];

export const DEMO_CRAFT_PRESETS = [
  {
    id: 'preset-basket',
    name: 'बाँस की टोकरी (Bamboo Basket)',
    category: 'घर सजावट',
    defaultPrice: 800,
    priceRange: '₹700 - ₹900',
    description: 'यह टोकरी बाँस से बनी है। यह मजबूत और सुंदर है। घर में फल, सब्जियां या सजावट रखने के लिए अच्छी है।',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&auto=format&fit=crop&q=80',
    audioText: 'नमस्ते! यह बाँस की टोकरी है। श्रेणी घर सजावट। यह टोकरी मजबूत और टिकाऊ बाँस से बनी है। एआई अनुशंसित कीमत सात सौ से नौ सौ रुपये है।'
  },
  {
    id: 'preset-dupatta',
    name: 'हाथ से बुना दुपट्टा (Handwoven Dupatta)',
    category: 'कपड़ा',
    defaultPrice: 1200,
    priceRange: '₹1,100 - ₹1,400',
    description: 'शुद्ध सूती धागों से हथकरघे पर बुना गया पारंपरिक दुपट्टा। बहुत मुलायम और रंगों से भरपूर है।',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    audioText: 'नमस्ते! यह हाथ से बुना पारंपरिक दुपट्टा है। श्रेणी कपड़ा। यह हथकरघे पर शुद्ध धागों से तैयार किया गया है। एआई अनुशंसित कीमत ग्यारह सौ से चौदह सौ रुपये है।'
  },
  {
    id: 'preset-pot',
    name: 'मिट्टी का घड़ा (Clay Water Pot)',
    category: 'सजावट',
    defaultPrice: 600,
    priceRange: '₹500 - ₹700',
    description: 'प्राकृतिक मिट्टी से चाक पर गढ़ा गया पारंपरिक मटका। पानी को शीतल रखता है।',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80',
    audioText: 'नमस्ते! यह प्राकृतिक मिट्टी का पारंपरिक घड़ा है। श्रेणी सजावट और उपयोगिता। एआई अनुशंसित कीमत पांच सौ से सात सौ रुपये है।'
  },
  {
    id: 'preset-jewelry',
    name: 'हाथ का कड़ा व झुमका (Terracotta Jewelry)',
    category: 'आभूषण',
    defaultPrice: 450,
    priceRange: '₹400 - ₹550',
    description: 'मिट्टी और प्राकृतिक रंगों से सजाया गया पारंपरिक हस्तनिर्मित आभूषण।',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80',
    audioText: 'नमस्ते! यह हस्तनिर्मित आभूषण है। सुंदर मिट्टी और प्राकृतिक रंगों से बना। एआई अनुशंसित कीमत चार सौ से साढ़े पांच सौ रुपये है।'
  }
];

export const RURAL_CATEGORIES = [
  { id: 'basket', name: 'टोकरी', icon: '🧺' },
  { id: 'apparel', name: 'कपड़ा', icon: '👗' },
  { id: 'jewelry', name: 'आभूषण', icon: '💍' },
  { id: 'decor', name: 'सजावट', icon: '🏺' },
  { id: 'more', name: 'और', icon: '⋯' }
];

export const VALUE_PROPOSITIONS = [
  {
    icon: '💡',
    title: 'AI आपकी मदद करता है',
    desc: 'फोटो से जानकारी और कीमत देता है'
  },
  {
    icon: '🌐',
    title: 'आपकी भाषा में',
    desc: 'हिंदी और अन्य भाषाओं में काम करें'
  },
  {
    icon: '🌿',
    title: 'बेचने का आसान तरीका',
    desc: 'सारा देश आपका सामान देखेगा'
  },
  {
    icon: '🤝',
    title: 'आपके हुनर की पहचान',
    desc: 'आपका हुनर, आपकी कमाई'
  }
];
