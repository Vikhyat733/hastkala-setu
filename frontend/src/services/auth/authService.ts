export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  state: string;
  district: string;
  craftCategory: string;
  isVerified: boolean;
  upiId: string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: UserProfile;
  token?: string;
}

export interface IAuthService {
  requestOtp(phone: string): Promise<{ success: boolean; message: string }>;
  verifyOtp(phone: string, otp: string): Promise<AuthResult>;
  getCurrentUser(): UserProfile | null;
  logout(): Promise<void>;
  isAuthenticated(): boolean;
}
