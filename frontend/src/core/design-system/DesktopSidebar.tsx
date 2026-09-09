import React from 'react';
import { Home, ShoppingBag, Package, User, Mic } from 'lucide-react';

export type NavTab = 'home' | 'market' | 'orders' | 'profile';

interface DesktopSidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  labels: {
    home: string;
    market: string;
    orders: string;
    profile: string;
  };
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
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
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 left-0 bg-white border-r border-[#E8E2D9] shadow-md z-40">
      {/* Brand Header */}
      <div className="h-16 flex flex-shrink-0 items-center px-6 border-b border-[#E8E2D9]">
        <h1 className="text-xl font-black tracking-tight text-[#1B4D3E]">MELA</h1>
        <span className="ml-2 text-[10px] font-bold bg-[#C04B27]/10 text-[#C04B27] px-2 py-0.5 rounded-full border border-[#C04B27]/20">
          SIH26090
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-150 select-none
                ${isActive 
                  ? 'bg-[#1B4D3E]/10 text-[#1B4D3E] font-bold' 
                  : 'text-[#6B5E59] hover:bg-stone-50 hover:text-[#261D1A] font-medium'}
              `}
            >
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-white shadow-sm' : ''}`}>
                {item.icon}
              </div>
              <span className="text-sm">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C04B27]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-[#E8E2D9]">
        <div className="bg-[#FAF6F0] rounded-2xl p-4 border border-[#E0D8CE] shadow-xs text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#C04B27]/10 text-[#C04B27] flex items-center justify-center">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-[#1B4D3E]">MELA Studio</h4>
            <p className="text-[10px] text-[#6B5E59]">Premium Desktop</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
