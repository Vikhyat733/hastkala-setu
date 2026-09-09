import { IAuthService, AuthResult, UserProfile } from './authService';

export const MOCK_OTP_CODE = '123456';

const STORAGE_KEY_USER = 'mela_artisan_user';
const STORAGE_KEY_TOKEN = 'mela_auth_token';

export class MockAuthService implements IAuthService {
  private activePendingPhone: string | null = null;

  async requestOtp(phone: string): Promise<{ success: boolean; message: string }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      return {
        success: false,
        message: 'Invalid phone number format. Requires 10 digits.',
      };
    }

    this.activePendingPhone = cleaned;
    return {
      success: true,
      message: `OTP sent successfully. Demo code is ${MOCK_OTP_CODE}`,
    };
  }

  async verifyOtp(phone: string, otp: string): Promise<AuthResult> {
    await new Promise((resolve) => setTimeout(resolve, 700));

    const cleanedPhone = phone.replace(/\D/g, '');

    // Allow mock OTP
    if (otp === MOCK_OTP_CODE) {
      const demoUser: UserProfile = {
        id: 'artisan_demo_radha_1',
        name: 'राधा देवी / Radha Devi',
        phone: cleanedPhone || '9876543210',
        state: 'Rajasthan',
        district: 'Jaipur',
        craftCategory: 'Blue Pottery & Terracotta',
        isVerified: true,
        upiId: 'radha.artisan@upi',
      };

      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(demoUser));
        localStorage.setItem(STORAGE_KEY_TOKEN, 'demo_jwt_token_mela_sih_2026');
      } catch {
        // Safe fallback for in-memory or SSR
      }

      return {
        success: true,
        user: demoUser,
        token: 'demo_jwt_token_mela_sih_2026',
      };
    }

    return {
      success: false,
      message: 'Invalid OTP code. For development testing, use 123456.',
    };
  }

  getCurrentUser(): UserProfile | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    try {
      return Boolean(localStorage.getItem(STORAGE_KEY_TOKEN));
    } catch {
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    } catch {
      // ignore
    }
  }
}

// Singleton export
export const authService: IAuthService = new MockAuthService();
