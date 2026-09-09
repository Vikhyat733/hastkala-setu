/**
 * Order Management Service
 * 
 * Interacts with FastAPI /api/v1/orders endpoints with atomic stock deduction,
 * canonical state machine progression, purchase price snapshots, and cancellation.
 */
import { API_BASE_URL } from '../api/apiClient';

export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY_TO_DISPATCH'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  product_id: string;
  product_title_snapshot: string;
  product_image_snapshot?: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  buyer_id: string;
  artisan_id: string;
  status: OrderStatus;
  subtotal: number;
  delivery_charge: number;
  total: number;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
  artisan_name?: string;
  artisan_location?: string;
}

export interface CreateOrderPayload {
  buyer_id?: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  items: {
    product_id: string;
    quantity: number;
  }[];
}

export interface DefaultAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const DEFAULT_ADDRESS_KEY = 'mela_buyer_default_address';
const LOCAL_ORDERS_CACHE_KEY = 'mela_orders_local_cache';

export class OrderService {
  // ─── Default Address Management ───
  getDefaultAddress(): DefaultAddress | null {
    try {
      const stored = localStorage.getItem(DEFAULT_ADDRESS_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  saveDefaultAddress(addr: DefaultAddress): void {
    try {
      localStorage.setItem(DEFAULT_ADDRESS_KEY, JSON.stringify(addr));
    } catch (e) {
      console.warn('Failed to save default address:', e);
    }
  }

  // ─── Order API Calls ───
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Order creation failed' }));
      throw new Error(err.detail || 'Failed to create order');
    }

    const created: Order = await response.json();
    this._cacheOrderLocally(created);
    return created;
  }

  async listOrders(params?: { buyer_id?: string; artisan_id?: string; status?: string }): Promise<Order[]> {
    const url = new URL(`${API_BASE_URL}/orders/`);
    if (params?.buyer_id) url.searchParams.append('buyer_id', params.buyer_id);
    if (params?.artisan_id) url.searchParams.append('artisan_id', params.artisan_id);
    if (params?.status && params.status !== 'ALL') url.searchParams.append('status', params.status);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data: Order[] = await response.json();
        this._updateLocalCache(data);
        return data;
      }
    } catch (err) {
      console.warn('[OrderService] Backend offline, reading local cache:', err);
    }

    return this.getLocalOrders();
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('[OrderService] getOrderById failed:', err);
    }

    const all = this.getLocalOrders();
    return all.find((o) => o.id === orderId) || null;
  }

  async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Status update failed' }));
      throw new Error(err.detail || 'Failed to update order status');
    }

    const updated: Order = await response.json();
    this._cacheOrderLocally(updated);
    return updated;
  }

  async cancelOrder(orderId: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Cancellation failed' }));
      throw new Error(err.detail || 'Failed to cancel order');
    }

    const cancelled: Order = await response.json();
    this._cacheOrderLocally(cancelled);
    return cancelled;
  }

  // ─── Local Caching Helpers ───
  getLocalOrders(): Order[] {
    try {
      const stored = localStorage.getItem(LOCAL_ORDERS_CACHE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private _cacheOrderLocally(order: Order): void {
    const existing = this.getLocalOrders();
    const updated = [order, ...existing.filter((o) => o.id !== order.id)];
    try {
      localStorage.setItem(LOCAL_ORDERS_CACHE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Local cache save error:', e);
    }
  }

  private _updateLocalCache(orders: Order[]): void {
    try {
      localStorage.setItem(LOCAL_ORDERS_CACHE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn('Local cache update error:', e);
    }
  }
}

export const orderService = new OrderService();
