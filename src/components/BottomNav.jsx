import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Layers, 
  Banknote, 
  Search, 
  LayoutDashboard,
  Users
} from 'lucide-react';

export const BottomNav = () => {
  const { activeView, setActiveView } = useApp();

  const navItems = [
    { id: 'website', label: 'Home', icon: Home },
    { id: 'services', label: 'Services', icon: Layers },
    { id: 'loans', label: 'Loans', icon: Banknote },
    { id: 'track', label: 'Track', icon: Search },
    { id: 'crm', label: 'CRM', icon: LayoutDashboard, isSpecial: true },
  ];

  return (
    <nav className="bottom-app-nav" aria-label="Mobile Navigation">
      <div className="bottom-app-nav-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveView(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`bottom-nav-item ${isActive ? 'active' : ''} ${item.isSpecial ? 'special-crm' : ''}`}
              aria-label={item.label}
            >
              <div className="bottom-nav-icon-wrapper">
                <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
                {isActive && <span className="bottom-nav-indicator" />}
              </div>
              <span className="bottom-nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
