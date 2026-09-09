import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, getTranslations, Translations } from '../translations';
import { UserProfile } from '../services/auth/authService';
import { authService } from '../services/auth/mockAuthService';
import { apiClient, HealthResponse } from '../services/api/apiClient';

export type MelaRoute =
  | '/splash'
  | '/language'
  | '/onboarding'
  | '/login'
  | '/otp'
  | '/dashboard'
  | '/sell'
  | '/my-products'
  | '/orders'
  | '/marketplace'
  | '/earnings'
  | '/profile';



interface MelaContextType {
  currentRoute: MelaRoute;
  navigate: (route: MelaRoute) => void;
  goBack: () => void;
  selectedLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  onboardingCompleted: boolean;
  completeOnboarding: () => void;
  currentUser: UserProfile | null;
  pendingPhone: string;
  setPendingPhone: (phone: string) => void;
  isAuthenticated: boolean;
  loginSuccess: (user: UserProfile) => void;
  logout: () => void;
  backendHealth: HealthResponse | null;
  checkBackendStatus: () => Promise<void>;
}

const STORAGE_KEY_LANG = 'mela_selected_language';
const STORAGE_KEY_ONBOARDING = 'mela_onboarding_done';

const MelaContext = createContext<MelaContextType | undefined>(undefined);

export const MelaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation stack for back support
  const [routeHistory, setRouteHistory] = useState<MelaRoute[]>(['/splash']);
  const currentRoute = routeHistory[routeHistory.length - 1] || '/splash';

  // Language state (defaults to Hindi as per SIH rural artisan focus)
  const [selectedLanguage, setSelectedLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      if (saved === 'en' || saved === 'hi' || saved === 'mr' || saved === 'bn') return saved;
    } catch {}
    return 'hi';
  });

  // Onboarding completed flag
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ONBOARDING) === 'true';
    } catch {
      return false;
    }
  });

  // User & Auth state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [pendingPhone, setPendingPhone] = useState<string>('9876543210');
  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);

  const t = getTranslations(selectedLanguage);

  const setLanguage = (lang: Language) => {
    setSelectedLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch {}
  };

  const completeOnboarding = () => {
    setOnboardingCompleted(true);
    try {
      localStorage.setItem(STORAGE_KEY_ONBOARDING, 'true');
    } catch {}
  };

  const navigate = useCallback((newRoute: MelaRoute) => {
    setRouteHistory((prev) => {
      // Avoid duplicate consecutive routes
      if (prev[prev.length - 1] === newRoute) return prev;
      return [...prev, newRoute];
    });
  }, []);

  const goBack = useCallback(() => {
    setRouteHistory((prev) => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, prev.length - 1);
    });
  }, []);

  const loginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    navigate('/dashboard');
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  const checkBackendStatus = async () => {
    const health = await apiClient.checkHealth();
    setBackendHealth(health);
  };

  useEffect(() => {
    checkBackendStatus();
  }, []);

  return (
    <MelaContext.Provider
      value={{
        currentRoute,
        navigate,
        goBack,
        selectedLanguage,
        setLanguage,
        t,
        onboardingCompleted,
        completeOnboarding,
        currentUser,
        pendingPhone,
        setPendingPhone,
        isAuthenticated: Boolean(currentUser),
        loginSuccess,
        logout,
        backendHealth,
        checkBackendStatus,
      }}
    >
      {children}
    </MelaContext.Provider>
  );
};

export const useMela = (): MelaContextType => {
  const context = useContext(MelaContext);
  if (!context) {
    throw new Error('useMela must be used within a MelaProvider');
  }
  return context;
};
