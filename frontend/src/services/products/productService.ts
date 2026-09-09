/**
 * Product Service
 * Responsibilities:
 * - create product
 * - fetch products
 * - publish product
 * - validate product state
 * - cache in localStorage for offline resilience
 */
import { API_BASE_URL } from '../api/apiClient';

export interface ProductItem {
  id: string;
  artisan_id?: string;
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
  stock?: number;
  status: 'draft' | 'published' | 'archived';
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductPayload {
  title: string;
  description?: string;
  description_hindi?: string;
  description_english?: string;
  category: string;
  material?: string;
  craft_type?: string;
  price: number;
  estimated_material_cost?: number;
  estimated_making_cost?: number;
  stock?: number;
  image_url?: string;
  enhanced_image_url?: string;
  status?: string;
}

const LOCAL_PRODUCTS_KEY = 'mela_artisan_products';

export class ProductService {
  private getLocalProducts(): ProductItem[] {
    try {
      const stored = localStorage.getItem(LOCAL_PRODUCTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveLocalProducts(products: ProductItem[]): void {
    try {
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to save products in localStorage:', e);
    }
  }

  async getProducts(): Promise<ProductItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          this.saveLocalProducts(data);
          return data;
        }
      }
    } catch (err) {
      console.warn('Backend getProducts unavailable, using local cache:', err);
    }

    // Fallback to local storage or starter seed
    const local = this.getLocalProducts();
    if (local.length > 0) {
      return local;
    }

    const defaultSeed: ProductItem[] = [
      {
        id: 'seed-prod-1',
        title: 'हस्तनिर्मित मिट्टी का फूलदान (Terracotta Vase)',
        category: 'मिट्टी के बर्तन / Pottery',
        material: 'लाल मिट्टी (Terracotta)',
        craft_type: 'पारंपरिक चाक कला (Wheel Pottery)',
        price: 450,
        estimated_material_cost: 110,
        estimated_making_cost: 190,
        stock: 5,
        status: 'published',
        image_url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400',
        enhanced_image_url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400',
        description_hindi: 'हाथ से बना हुआ सुंदर टेराकोटा फूलदान, प्राकृतिक रंगों और पारंपरिक जयपुरी कला से सुसज्जित।',
        description_english: 'Artisan hand-turned terracotta vase decorated with organic earth pigments.',
        created_at: new Date().toISOString(),
      },
    ];

    this.saveLocalProducts(defaultSeed);
    return defaultSeed;
  }

  async createProduct(payload: CreateProductPayload): Promise<ProductItem> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const created: ProductItem = await response.json();
        const existing = this.getLocalProducts();
        const updated = [created, ...existing.filter((p) => p.id !== created.id)];
        this.saveLocalProducts(updated);
        return created;
      }
    } catch (err) {
      console.warn('Backend createProduct unavailable, storing locally:', err);
    }

    // Fallback offline creation
    const offlineProduct: ProductItem = {
      id: `local-${Date.now()}`,
      artisan_id: 'artisan-local',
      title: payload.title,
      description: payload.description || payload.description_hindi || payload.description_english || '',
      description_hindi: payload.description_hindi || '',
      description_english: payload.description_english || '',
      category: payload.category,
      material: payload.material || '',
      craft_type: payload.craft_type || '',
      image_url: payload.image_url || '',
      enhanced_image_url: payload.enhanced_image_url || payload.image_url || '',
      price: payload.price,
      estimated_material_cost: payload.estimated_material_cost || 0,
      estimated_making_cost: payload.estimated_making_cost || 0,
      stock: payload.stock || 1,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const existing = this.getLocalProducts();
    const updated = [offlineProduct, ...existing];
    this.saveLocalProducts(updated);
    return offlineProduct;
  }

  async updateProduct(id: string, updates: Partial<ProductItem>): Promise<ProductItem | null> {
    try {

      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updated: ProductItem = await response.json();
        const existing = this.getLocalProducts();
        const nextList = existing.map((p) => (p.id === id ? { ...p, ...updated } : p));
        this.saveLocalProducts(nextList);
        return updated;
      }
    } catch (err) {
      console.warn('Backend updateProduct failed, updating local state:', err);
    }

    // Local fallback update
    const existing = this.getLocalProducts();
    let updatedItem: ProductItem | null = null;
    const nextList = existing.map((p) => {
      if (p.id === id) {
        updatedItem = { ...p, ...updates, updated_at: new Date().toISOString() };
        return updatedItem;
      }
      return p;
    });

    if (updatedItem) {
      this.saveLocalProducts(nextList);
    }
    return updatedItem;
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const existing = this.getLocalProducts();
        this.saveLocalProducts(existing.filter((p) => p.id !== id));
        return true;
      }
    } catch (err) {
      console.warn('Backend deleteProduct failed, removing from local state:', err);
    }

    const existing = this.getLocalProducts();
    this.saveLocalProducts(existing.filter((p) => p.id !== id));
    return true;
  }
}

export const productService = new ProductService();

