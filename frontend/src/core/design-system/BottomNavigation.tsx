import React from 'react';
import { Home, ShoppingBag, Package, User } from 'lucide-react';

export type NavTab = 'home' | 'market' | 'orders' | 'profile';

interface BottomNavigationProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  labels: {
    home: string;
    market: string;
    orders: string;
    profile: string;
  };
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onTabChange,
  labels,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: labels.home, icon: <Home className="w-5 h-5" /> },
    { id: 'market', label: labels.market, icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'orders', label: labels.orders, icon: <Package className="w-5 h-5" /> },
    { id: 'profile', label: labels.profile, icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E2D9] max-w-md mx-auto shadow-lg"
    >
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                min-h-[48px] flex flex-col items-center justify-center gap-1
                transition-all duration-150 relative select-none
                ${isActive ? 'text-[#1B4D3E]' : 'text-[#6B5E59] hover:text-[#261D1A]'}
              `}
            >
              {/* Active Pill top indicator */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-[#C04B27] rounded-b-full" />
              )}
              <div
                className={`
                  p-1 rounded-xl transition-colors
                  ${isActive ? 'bg-[#1B4D3E]/10' : ''}
                `}
              >
                {item.icon}
              </div>
              <span className={`text-[11px] font-bold ${isActive ? 'text-[#1B4D3E]' : 'text-[#6B5E59]'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
