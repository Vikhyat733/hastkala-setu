/**
 * MELA Earnings & Payout Service
 * 
 * Interacts with FastAPI /api/v1/earnings endpoints.
 * Provides unified source of truth for artisan business revenue, completed order metrics,
 * time-filtered performance analytics, and payout account configuration.
 */
import { API_BASE_URL } from '../api/apiClient';

export type TimePeriod = 'this_month' | 'last_month' | 'all_time';

export interface PayoutAccount {
  is_connected: boolean;
  account_holder_name?: string;
  payout_type: string;
  upi_id?: string;
  account_masked?: string;
  bank_name?: string;
  is_verified: boolean;
  updated_at?: string;
}

export interface PayoutAccountPayload {
  account_holder_name: string;
  payout_type: string;
  upi_id?: string;
  account_number_masked?: string;
  ifsc_code?: string;
  bank_name?: string;
}

export interface RecentSaleItem {
  order_id: string;
  order_date: string;
  product_id: string;
  product_title: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  order_total: number;
  status: string;
  buyer_name: string;
  buyer_location: string;
}

export interface EarningsSummary {
  artisan_id: string;
  period: TimePeriod;
  total_sales: number;
  completed_orders: number;
  products_sold: number;
  platform_fee: number;
  delivery_fee: number;
  net_earnings: number;
  pending_orders_count: number;
  pending_orders_amount: number;
  currency: string;
  payout_status: 'CONNECTED' | 'NOT_CONNECTED';
  payout_account?: PayoutAccount;
}

const LOCAL_PAYOUT_KEY = 'mela_payout_account_local';

export class EarningsService {
  /**
   * Fetch summarized earnings metrics with time-period filtering.
   */
  async getSummary(period: TimePeriod = 'this_month', artisanId?: string): Promise<EarningsSummary> {
    const url = new URL(`${API_BASE_URL}/earnings/summary`);
    url.searchParams.append('period', period);
    if (artisanId) url.searchParams.append('artisan_id', artisanId);

    try {
      const response = await fetch(url.toString(), {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('[EarningsService] Backend offline, computing from local fallback:', err);
    }

    // Local fallback if backend is momentarily unreachable
    return {
      artisan_id: artisanId || 'artisan_demo_radha_1',
      period,
      total_sales: 0,
      completed_orders: 0,
      products_sold: 0,
      platform_fee: 0,
      delivery_fee: 0,
      net_earnings: 0,
      pending_orders_count: 0,
      pending_orders_amount: 0,
      currency: 'INR',
      payout_status: this.getLocalPayoutAccount()?.is_connected ? 'CONNECTED' : 'NOT_CONNECTED',
      payout_account: this.getLocalPayoutAccount() || undefined,
    };
  }

  /**
   * Fetch recent completed sales with product snapshots.
   */
  async getRecentSales(limit: number = 10, artisanId?: string): Promise<RecentSaleItem[]> {
    const url = new URL(`${API_BASE_URL}/earnings/recent`);
    url.searchParams.append('limit', limit.toString());
    if (artisanId) url.searchParams.append('artisan_id', artisanId);

    try {
      const response = await fetch(url.toString(), {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('[EarningsService] getRecentSales failed:', err);
    }

    return [];
  }

  /**
   * Retrieve configured payout account.
   */
  async getPayoutAccount(artisanId?: string): Promise<PayoutAccount> {
    const url = new URL(`${API_BASE_URL}/earnings/payout/account`);
    if (artisanId) url.searchParams.append('artisan_id', artisanId);

    try {
      const response = await fetch(url.toString(), {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data: PayoutAccount = await response.json();
        this.saveLocalPayoutAccount(data);
        return data;
      }
    } catch (err) {
      console.warn('[EarningsService] getPayoutAccount offline fallback:', err);
    }

    return this.getLocalPayoutAccount() || { is_connected: false, payout_type: 'UPI', is_verified: false };
  }

  /**
   * Configure or update payout account.
   */
  async savePayoutAccount(payload: PayoutAccountPayload, artisanId?: string): Promise<PayoutAccount> {
    const url = new URL(`${API_BASE_URL}/earnings/payout/account`);
    if (artisanId) url.searchParams.append('artisan_id', artisanId);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Failed to save payout account' }));
      throw new Error(err.detail || 'Failed to save payout account');
    }

    const saved: PayoutAccount = await response.json();
    this.saveLocalPayoutAccount(saved);
    return saved;
  }

  private getLocalPayoutAccount(): PayoutAccount | null {
    try {
      const stored = localStorage.getItem(LOCAL_PAYOUT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private saveLocalPayoutAccount(acc: PayoutAccount): void {
    try {
      localStorage.setItem(LOCAL_PAYOUT_KEY, JSON.stringify(acc));
    } catch (e) {
      console.warn('Failed to cache payout account:', e);
    }
  }
}

export const earningsService = new EarningsService();
