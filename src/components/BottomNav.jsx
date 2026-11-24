import React from 'react';
import { useApp } from '../context/AppContext';
import { useRouter } from '../router/Router';
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
  const { navigate } = useRouter();

  const navItems = [
    { id: 'website', path: '/', label: 'Home', icon: Home },
    { id: 'services', path: '/services', label: 'Services', icon: Layers },
    { id: 'loans', path: '/loans', label: 'Loans', icon: Banknote },
    { id: 'track', path: '/track', label: 'Track', icon: Search },
    { id: 'crm', path: '/admin/dashboard', label: 'CRM', icon: LayoutDashboard, isSpecial: true },
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
                navigate(item.path);
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
