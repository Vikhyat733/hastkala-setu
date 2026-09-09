import React from 'react';
import { MelaProvider, useMela } from './context/MelaContext';
import { SplashScreen } from './features/splash/SplashScreen';
import { LanguageScreen } from './features/language/LanguageScreen';
import { OnboardingScreen } from './features/onboarding/OnboardingScreen';
import { LoginScreen } from './features/authentication/LoginScreen';
import { OtpScreen } from './features/authentication/OtpScreen';
import { DashboardScreen } from './features/dashboard/DashboardScreen';

import { ProductCreationFlow } from './features/product_creation/ProductCreationFlow';
import { MyProductsScreen } from './features/product_creation/screens/MyProductsScreen';
import { MyOrdersScreen } from './features/orders/MyOrdersScreen';
import { MarketplaceScreen } from './features/marketplace/MarketplaceScreen';
import { EarningsScreen } from './features/earnings/EarningsScreen';
import { ProfileScreen } from './features/profile/ProfileScreen';
import { AppLayout } from './core/design-system/AppLayout';

const MelaRouter: React.FC = () => {
  const { currentRoute } = useMela();

  switch (currentRoute) {
    case '/splash':
      return <SplashScreen />;
    case '/language':
      return <LanguageScreen />;
    case '/onboarding':
      return <OnboardingScreen />;
    case '/login':
      return <LoginScreen />;
    case '/otp':
      return <OtpScreen />;
    case '/dashboard':
      return <DashboardScreen />;
    case '/sell':
      return <ProductCreationFlow />;
    case '/my-products':
      return <MyProductsScreen />;
    case '/orders':
      return <MyOrdersScreen />;
    case '/marketplace':
      return <MarketplaceScreen />;
    case '/earnings':
      return <EarningsScreen />;
    case '/profile':
      return <ProfileScreen />;
    default:
      return <SplashScreen />;
  }
};


export const App: React.FC = () => {
  return (
    <MelaProvider>
      <AppLayout>
        <MelaRouter />
      </AppLayout>
    </MelaProvider>
  );
};

export default App;
