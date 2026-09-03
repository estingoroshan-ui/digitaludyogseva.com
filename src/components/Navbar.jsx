import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  PhoneCall, 
  ShieldCheck, 
  Search, 
  FileText, 
  Banknote, 
  HelpCircle, 
  LayoutDashboard, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const { activeView, setActiveView } = useApp();

  return (
    <header className="site-header">
      {/* Top Strip */}
      <div className="top-bar">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <ShieldCheck size={14} color="#ff6f00" />
              <span>Govt of India Startup & MSME Registered Portal</span>
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <span className="flex items-center gap-1" style={{ fontSize: '0.8rem' }}>
              <span style={{ color: '#94a3b8' }}>Managed by: </span>
              <a 
                href="https://digitalvyaparseva.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: '#ffa726', fontWeight: '700', textDecoration: 'none' }}
              >
                Digital Vyapar Seva ↗
              </a>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="badge badge-saffron" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
              ISO 9001:2015 Certified
            </span>
            <button 
              onClick={() => setActiveView('crm')}
              className="btn btn-sm btn-outline-white"
              style={{ background: 'rgba(255, 111, 0, 0.25)', border: '1px solid #ff8f00', color: '#ffa726' }}
            >
              <LayoutDashboard size={14} />
              <span>Launch CRM Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container">
        <div className="navbar-inner">
          {/* Brand Logo */}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setActiveView('website'); }} 
            className="brand-logo"
          >
            <div className="brand-mark">
              <Building2 size={24} />
            </div>
            <div className="brand-text">
              <h1>Digital Udyog Seva</h1>
              <span>Business Registration & Loan Hub</span>
            </div>
          </a>

          {/* Navigation Items */}
          <nav>
            <ul className="nav-links">
              <li>
                <button 
                  type="button"
                  onClick={() => setActiveView('website')} 
                  className={`nav-link ${activeView === 'website' ? 'active' : ''}`}
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => setActiveView('services')} 
                  className={`nav-link ${activeView === 'services' ? 'active' : ''}`}
                >
                  Services
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => setActiveView('loans')} 
                  className={`nav-link ${activeView === 'loans' ? 'active' : ''}`}
                >
                  Govt Loans & Schemes
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => setActiveView('track')} 
                  className={`nav-link ${activeView === 'track' ? 'active' : ''}`}
                >
                  Track Case
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => setActiveView('franchise')} 
                  className={`nav-link ${activeView === 'franchise' ? 'active' : ''}`}
                >
                  Become Franchise
                </button>
              </li>
            </ul>
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveView('crm')}
              className="btn btn-primary btn-sm"
              title="Open CRM Portal"
            >
              <LayoutDashboard size={16} />
              <span>CRM Portal</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
