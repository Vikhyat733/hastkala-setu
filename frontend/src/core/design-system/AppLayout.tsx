import React, { useMemo } from 'react';
import { useMela } from '../../context/MelaContext';
import { DesktopSidebar, NavTab } from './DesktopSidebar';
import { BottomNavigation } from './BottomNavigation';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentRoute, navigate, t } = useMela();

  // Screens that should have the Sidebar / BottomNav
  const isMainScreen = [
    '/dashboard',
    '/marketplace',
    '/orders',
    '/profile',
    '/earnings',
    '/my-products',
    '/sell',
  ].includes(currentRoute);

  // Map route to active tab
  const currentTab = useMemo<NavTab | null>(() => {
    if (currentRoute === '/dashboard') return 'home';
    if (currentRoute === '/marketplace') return 'market';
    if (currentRoute === '/orders') return 'orders';
    if (currentRoute === '/profile') return 'profile';
    // Sub-screens under home/profile might just highlight 'home' or 'profile'
    if (currentRoute === '/earnings' || currentRoute === '/my-products' || currentRoute === '/sell') return 'home';
    return null;
  }, [currentRoute]);

  const handleTabChange = (tab: NavTab) => {
    if (tab === 'home') navigate('/dashboard');
    else if (tab === 'market') navigate('/marketplace');
    else if (tab === 'orders') navigate('/orders');
    else if (tab === 'profile') navigate('/profile');
  };

  if (!isMainScreen) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF6F0] selection:bg-[#C04B27]/20 selection:text-[#C04B27]">
      {/* Desktop Sidebar (hidden on mobile) */}
      <DesktopSidebar
        currentTab={currentTab || 'home'}
        onTabChange={handleTabChange}
        labels={{
          home: t.nav?.home || 'Home',
          market: t.nav?.market || 'Market',
          orders: t.nav?.orders || 'Orders',
          profile: t.nav?.profile || 'Profile',
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Mobile Bottom Navigation (hidden on desktop) */}
        {/* We keep this here so it's global for main screens, and hide it on md+ */}
        <div className="md:hidden">
          <BottomNavigation
            currentTab={currentTab || 'home'}
            onTabChange={handleTabChange}
            labels={{
              home: t.nav?.home || 'Home',
              market: t.nav?.market || 'Market',
              orders: t.nav?.orders || 'Orders',
              profile: t.nav?.profile || 'Profile',
            }}
          />
        </div>
      </div>
    </div>
  );
};
