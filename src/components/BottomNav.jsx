import React from 'react';
import { useRouter } from '../router/Router';
import { 
  Home, 
  Award, 
  Sparkles, 
  Search, 
  User 
} from 'lucide-react';

export const BottomNav = ({ onOpenApplyModal }) => {
  const { currentPath, navigate } = useRouter();

  const navItems = [
    { id: 'home', path: '/', label: 'Home', icon: Home },
    { id: 'schemes', path: '/schemes', label: 'Schemes', icon: Award },
    { id: 'apply', path: '#apply', label: 'Apply', icon: Sparkles, isAction: true },
    { id: 'track', path: '/track', label: 'Track', icon: Search },
    { id: 'account', path: '/portal/customer', label: 'Account', icon: User },
  ];

  return (
    <nav className="bottom-app-nav" aria-label="Mobile Navigation">
      <div className="bottom-app-nav-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === '/' 
            ? currentPath === '/' 
            : !item.isAction && currentPath.startsWith(item.path);

          if (item.isAction) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (onOpenApplyModal) onOpenApplyModal();
                  else navigate('/eligibility');
                }}
                className="bottom-nav-item bottom-nav-apply-tab"
                aria-label="Apply Now"
              >
                <div className="bottom-nav-icon-wrapper" style={{ color: '#00BAF2' }}>
                  <Icon size={20} strokeWidth={2.4} color="#00BAF2" />
                </div>
                <span className="bottom-nav-label" style={{ color: '#002970', fontWeight: '800' }}>
                  Apply
                </span>
              </button>
            );
          }
          
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.path)}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              aria-label={item.label}
            >
              <div className="bottom-nav-icon-wrapper">
                <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} color={isActive ? '#002970' : '#64748B'} />
                {isActive && <span className="bottom-nav-indicator" style={{ background: '#00BAF2' }} />}
              </div>
              <span className="bottom-nav-label" style={{ color: isActive ? '#002970' : '#64748B', fontWeight: isActive ? '700' : '500' }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
