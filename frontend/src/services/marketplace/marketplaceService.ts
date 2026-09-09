/**
 * Marketplace Service Layer
 *
 * Responsibilities:
 * - Fetch public published products from backend API
 * - Category filtering and search query execution
 * - Product detail retrieval with artisan enrichment
 * - Local storage favorite products management
 */
import { API_BASE_URL } from '../api/apiClient';

export interface MarketplaceProduct {
  id: string;
  artisan_id: string;
  title: string;
  description?: string;
  description_hindi?: string;
  description_english?: string;
  category: string;
  material?: string;
  craft_type?: string;
  image_url?: string;
  enhanced_image_url?: string;
  price: number;
  estimated_material_cost?: number;
  estimated_making_cost?: number;
  stock: number;
  status: string;
  artisan_name: string;
  artisan_location: string;
  artisan_craft: string;
  artisan_verified: boolean;
  artisan_bio?: string;
  artisan_image?: string;
  is_favorite?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryItem {
  id: string;
  name_hindi: string;
  name_english: string;
  icon: string;
  product_count: number;
}

const FAVORITES_STORAGE_KEY = 'mela_favorite_product_ids';

export const STATIC_CATEGORIES: CategoryItem[] = [
  { id: 'all', name_hindi: 'सभी', name_english: 'All', icon: '✨', product_count: 0 },
  { id: 'textiles', name_hindi: 'वस्त्र व हथकरघा', name_english: 'Textiles', icon: '🧵', product_count: 0 },
  { id: 'pottery', name_hindi: 'मिट्टी के बर्तन', name_english: 'Pottery', icon: '🏺', product_count: 0 },
  { id: 'bags', name_hindi: 'बैग व एक्सेसरीज़', name_english: 'Bags & Accessories', icon: '👜', product_count: 0 },
  { id: 'jewellery', name_hindi: 'आभूषण व गहने', name_english: 'Jewellery', icon: '💍', product_count: 0 },
  { id: 'woodcraft', name_hindi: 'काष्ठ कला', name_english: 'Woodcraft', icon: '🪵', product_count: 0 },
  { id: 'art', name_hindi: 'कला व पेंटिंग', name_english: 'Art & Decor', icon: '🎨', product_count: 0 },
  { id: 'home', name_hindi: 'गृह सज्जा', name_english: 'Home & Living', icon: '🧺', product_count: 0 },
  { id: 'natural', name_hindi: 'प्राकृतिक उत्पाद', name_english: 'Natural Products', icon: '🌿', product_count: 0 },
];

export class MarketplaceService {
  getFavoriteIds(): string[] {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  isFavorite(productId: string): boolean {
    const ids = this.getFavoriteIds();
    return ids.includes(productId);
  }

  toggleFavorite(productId: string): boolean {
    try {
      const ids = this.getFavoriteIds();
      let updated: string[];
      let isFav = false;
      if (ids.includes(productId)) {
        updated = ids.filter((id) => id !== productId);
        isFav = false;
      } else {
        updated = [...ids, productId];
        isFav = true;
      }
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
      return isFav;
    } catch {
      return false;
    }
  }

  async getCategories(): Promise<CategoryItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/marketplace/categories`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const totalCount = data.reduce((sum: number, c: CategoryItem) => sum + (c.product_count || 0), 0);
          return [
            { id: 'all', name_hindi: 'सभी', name_english: 'All', icon: '✨', product_count: totalCount },
            ...data,
          ];
        }
      }
    } catch (err) {
      console.warn('[MarketplaceService] Failed to fetch backend categories:', err);
    }

    return STATIC_CATEGORIES;
  }

  async getProducts(params?: { category?: string; search?: string }): Promise<MarketplaceProduct[]> {
    const url = new URL(`${API_BASE_URL}/marketplace/products`);
    if (params?.category && params.category !== 'all') {
      url.searchParams.append('category', params.category);
    }
    if (params?.search && params.search.trim()) {
      url.searchParams.append('search', params.search.trim());
    }

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          const favoriteIds = this.getFavoriteIds();
          return data.map((item) => ({
            ...item,
            price: Number(item.price),
            is_favorite: favoriteIds.includes(item.id),
          }));
        }
      }
    } catch (err) {
      console.warn('[MarketplaceService] Failed to fetch marketplace products from backend:', err);
    }

    // Fallback seed products if backend offline
    const favoriteIds = this.getFavoriteIds();
    const fallbackList: MarketplaceProduct[] = [
      {
        id: 'prod-seed-jute-1',
        artisan_id: 'artisan_demo_radha_1',
        title: 'हस्तनिर्मित जूट बैग (Handcrafted Jute Bag)',
        description: '100% पर्यावरण-अनुकूल प्राकृतिक जूट बैग। इसमें सूती कपड़े की अंदरूनी लाइनिंग और मजबूत हैंडल लगे हैं।',
        description_hindi: 'यह जूट से बना हुआ हाथ का बैग है। इसे हाथ से बनाया गया है और इसमें कपड़े की मजबूत अंदरूनी लाइनिंग है।',
        description_english: 'Handcrafted eco-friendly natural jute bag with durable cotton cloth inner lining and strong shoulder handles.',
        category: 'बैग और एक्सेसरीज़ / Bags & Accessories',
        material: 'प्राकृतिक जूट (सूती कपड़े की अंदरूनी लाइनिंग सहित)',
        craft_type: 'हस्तनिर्मित जूट शिल्प / Handcrafted Jute Weaving',
        price: 650,
        stock: 8,
        status: 'published',
        image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
        enhanced_image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
        artisan_name: 'राधा देवी (Radha Devi)',
        artisan_location: 'जयपुर, राजस्थान',
        artisan_craft: 'जूट शिल्प व टेराकोटा',
        artisan_verified: true,
        artisan_bio: 'राधा जी जयपुर की एक अनुभवी शिल्पकार हैं जो पिछले 15 वर्षों से प्राकृतिक जूट और मिट्टी की कलाकृतियाँ तैयार कर रही हैं।',
        is_favorite: favoriteIds.includes('prod-seed-jute-1'),
      },
      {
        id: 'prod-seed-vase-2',
        artisan_id: 'artisan_demo_ramesh_2',
        title: 'टेराकोटा नक्काशीदार फूलदान (Terracotta Vase)',
        description: 'चाक पर हाथ से तराशा गया पारंपरिक टेराकोटा फूलदान। प्राकृतिक रंगों और जयपुरी मिट्टी से निर्मित।',
        description_hindi: 'यह सुंदर हस्तनिर्मित टेराकोटा फूलदान प्राकृतिक लाल मिट्टी से चाक पर बनाया गया है।',
        description_english: 'Handcrafted terracotta vase made on traditional potter wheels in Jaipur with 100% organic earth clay.',
        category: 'मिट्टी के बर्तन और सजावट / Pottery & Decor',
        material: 'प्राकृतिक लाल मिट्टी (Natural Terracotta Clay)',
        craft_type: 'चाक पर तराशी हस्तकला (Hand-turned Pottery)',
        price: 450,
        stock: 5,
        status: 'published',
        image_url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600',
        enhanced_image_url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600',
        artisan_name: 'रमेश प्रजापति (Ramesh Prajapati)',
        artisan_location: 'जयपुर, राजस्थान',
        artisan_craft: 'पारंपरिक चाक मिट्टी कला',
        artisan_verified: true,
        artisan_bio: 'रमेश जी 3 पीढ़ियों से पारंपरिक कुम्हार कला को जीवित रखे हुए हैं। वे केवल जैविक रंगों और स्थानीय मिट्टी का उपयोग करते हैं।',
        is_favorite: favoriteIds.includes('prod-seed-vase-2'),
      },
      {
        id: 'prod-seed-scarf-3',
        artisan_id: 'artisan_demo_sunita_3',
        title: 'हाथ की कढ़ाई वाला सूती दुपट्टा (Embroidered Cotton Scarf)',
        description: 'कच्छ की पारंपरिक अजरक और सुफ कढ़ाई से अलंकृत 100% शुद्ध सूती दुपट्टा।',
        description_hindi: 'हाथ की बारीक सुफ कढ़ाई से अलंकृत पारंपरिक सूती दुपट्टा।',
        description_english: 'Exquisite hand-embroidered pure cotton scarf crafted with traditional Kutch artisans needlework.',
        category: 'वस्त्र और हथकरघा / Handloom & Textiles',
        material: '100% शुद्ध हथकरघा सूती',
        craft_type: 'कच्छी हस्त कढ़ाई',
        price: 1200,
        stock: 4,
        status: 'published',
        image_url: 'https://images.unsplash.com/photo-1605007493699-af65834f8a00?auto=format&fit=crop&q=80&w=600',
        enhanced_image_url: 'https://images.unsplash.com/photo-1605007493699-af65834f8a00?auto=format&fit=crop&q=80&w=600',
        artisan_name: 'सुनीता बाई (Sunita Bai)',
        artisan_location: 'कच्छ, गुजरात',
        artisan_craft: 'कच्छी हथकरघा कढ़ाई',
        artisan_verified: true,
        artisan_bio: 'सुनीता जी कच्छ की सुफ और अजरक कढ़ाई की विशेषज्ञ हैं, जो ग्रामीण महिला स्वयं सहायता समूह का नेतृत्व करती हैं।',
        is_favorite: favoriteIds.includes('prod-seed-scarf-3'),
      },
      {
        id: 'prod-seed-box-4',
        artisan_id: 'artisan_demo_mohan_4',
        title: 'शीशम काष्ठ नक्काशीदार आभूषण डिब्बा (Carved Wooden Jewelry Box)',
        description: 'सहारनपुर की ठोस शीशम की लकड़ी पर बारीक हाथ की नक्काशी और पीतल के कब्जों से तैयार कलात्मक डिब्बा।',
        description_hindi: 'सहारनपुर की ठोस शीशम की लकड़ी पर हाथ की नक्काशी से बना कलात्मक आभूषण डिब्बा।',
        description_english: 'Artisan hand-carved solid Sheesham wood jewelry organizer box with brass hinges.',
        category: 'काष्ठ कला और गृह सज्जा / Woodcraft & Decor',
        material: 'प्राकृतिक शीशम की लकड़ी',
        craft_type: 'हाथ की नक्काशी',
        price: 950,
        stock: 6,
        status: 'published',
        image_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600',
        enhanced_image_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600',
        artisan_name: 'मोहन लाल (Mohan Lal)',
        artisan_location: 'सहारनपुर, उत्तर प्रदेश',
        artisan_craft: 'शीशम काष्ठ नक्काशी',
        artisan_verified: true,
        artisan_bio: 'सहारनपुर की प्रसिद्ध काष्ठ कला के सिद्धहस्त कारीगर, जो बारीक नक्काशी और पीतल की जड़ाई में पारंगत हैं।',
        is_favorite: favoriteIds.includes('prod-seed-box-4'),
      },
      {
        id: 'prod-seed-bangles-5',
        artisan_id: 'artisan_demo_radha_1',
        title: 'हस्तनिर्मित पीतल चूड़ियाँ (Handcrafted Brass Bangles Set)',
        description: 'पारंपरिक जयपुरी मीनाकारी और पीतल से निर्मित कलात्मक चूड़ियों का सेट।',
        description_hindi: 'पारंपरिक जयपुरी मीनाकारी और शुद्ध पीतल से निर्मित कलात्मक चूड़ियाँ।',
        description_english: 'Artisan handcrafted traditional Jaipur Meenakari brass bangles set.',
        category: 'आभूषण और गहने / Jewellery & Ornaments',
        material: 'शुद्ध पीतल व मीनाकारी (Pure Brass & Enamel)',
        craft_type: 'पारंपरिक मीनाकारी (Traditional Meenakari Craft)',
        price: 380,
        stock: 10,
        status: 'published',
        image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600',
        enhanced_image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600',
        artisan_name: 'राधा देवी (Radha Devi)',
        artisan_location: 'जयपुर, राजस्थान',
        artisan_craft: 'पारंपरिक मीनाकारी',
        artisan_verified: true,
        artisan_bio: 'राधा जी जयपुर की एक अनुभवी शिल्पकार हैं।',
        is_favorite: favoriteIds.includes('prod-seed-bangles-5'),
      },
    ];


    let filtered = fallbackList;
    if (params?.category && params.category !== 'all') {
      const cat = params.category.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.category.toLowerCase().includes(cat) ||
          p.title.toLowerCase().includes(cat) ||
          (p.material && p.material.toLowerCase().includes(cat))
      );
    }
    if (params?.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.material && p.material.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    return filtered;
  }

  async getProductById(id: string): Promise<MarketplaceProduct | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/marketplace/products/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const item = await response.json();
        return {
          ...item,
          price: Number(item.price),
          is_favorite: this.isFavorite(item.id),
        };
      }
    } catch (err) {
      console.warn('[MarketplaceService] Failed to fetch product detail from backend:', err);
    }

    // Search local fallback
    const all = await this.getProducts();
    return all.find((p) => p.id === id) || null;
  }
}

export const marketplaceService = new MarketplaceService();
