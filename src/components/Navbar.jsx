import React, { useState } from 'react';
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
  Sparkles,
  Menu,
  X,
  Home,
  Layers,
  Award,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const Navbar = () => {
  const { activeView, setActiveView } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateTo = (view) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="site-header">
      {/* Top Strip - Clean desktop announcement (hidden on mobile) */}
      <div className="top-bar">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <ShieldCheck size={14} color="#ff6f00" />
              <span>India's Trusted Business &amp; MSME Advisory Platform</span>
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
            onClick={(e) => { e.preventDefault(); navigateTo('website'); }} 
            className="brand-logo"
          >
            <div className="brand-mark">
              <Building2 size={22} />
            </div>
            <div className="brand-text">
              <h1>Digital Udyog Seva</h1>
              <span className="brand-subtitle">Business Registration &amp; Loan Hub</span>
            </div>
          </a>

          {/* Desktop Navigation Items */}
          <nav className="desktop-nav">
            <ul className="nav-links">
              <li>
                <button 
                  type="button"
                  onClick={() => navigateTo('website')} 
                  className={`nav-link ${activeView === 'website' ? 'active' : ''}`}
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => navigateTo('services')} 
                  className={`nav-link ${activeView === 'services' ? 'active' : ''}`}
                >
                  Services
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => navigateTo('loans')} 
                  className={`nav-link ${activeView === 'loans' ? 'active' : ''}`}
                >
                  Govt Loans &amp; Schemes
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => navigateTo('track')} 
                  className={`nav-link ${activeView === 'track' ? 'active' : ''}`}
                >
                  Track Case
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => navigateTo('franchise')} 
                  className={`nav-link ${activeView === 'franchise' ? 'active' : ''}`}
                >
                  Become Franchise
                </button>
              </li>
            </ul>
          </nav>

          {/* Desktop Quick Actions */}
          <div className="desktop-actions flex items-center gap-3">
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

          {/* Mobile App Header Controls */}
          <div className="mobile-header-controls">
            <button 
              onClick={() => setActiveView('crm')}
              className="mobile-crm-badge"
              title="Launch CRM Portal"
            >
              <LayoutDashboard size={14} />
              <span>CRM</span>
            </button>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-toggle-btn"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile App Slide-in Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-sheet" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className="mobile-drawer-header">
              <div className="brand-logo">
                <div className="brand-mark" style={{ width: '36px', height: '36px' }}>
                  <Building2 size={18} />
                </div>
                <div className="brand-text">
                  <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Digital Udyog Seva</h3>
                  <span style={{ fontSize: '0.68rem', color: '#ff6f00', fontWeight: '700' }}>Official Mobile App View</span>
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-drawer-close"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Helpline Banner */}
            <div className="mobile-drawer-helpline">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={16} color="#4ade80" />
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#fff' }}>Verified Business Hub</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                Direct filing assistance with licensed CAs &amp; CS for 50+ corporate registrations.
              </p>
            </div>

            {/* Navigation List */}
            <div className="mobile-drawer-menu">
              <button 
                onClick={() => navigateTo('website')}
                className={`mobile-menu-item ${activeView === 'website' ? 'active' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="menu-icon-box"><Home size={18} /></div>
                  <span className="menu-text">Home Dashboard</span>
                </div>
                <ChevronRight size={16} className="menu-arrow" />
              </button>

              <button 
                onClick={() => navigateTo('services')}
                className={`mobile-menu-item ${activeView === 'services' ? 'active' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="menu-icon-box"><Layers size={18} /></div>
                  <div>
                    <div className="menu-text">All Services</div>
                    <span className="menu-subtext">50+ Business &amp; Tax Solutions</span>
                  </div>
                </div>
                <span className="drawer-badge">50+</span>
              </button>

              <button 
                onClick={() => navigateTo('loans')}
                className={`mobile-menu-item ${activeView === 'loans' ? 'active' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="menu-icon-box"><Banknote size={18} /></div>
                  <div>
                    <div className="menu-text">Govt Loans &amp; Schemes</div>
                    <span className="menu-subtext">PMEGP 35% Subsidy &amp; Mudra</span>
                  </div>
                </div>
                <span className="drawer-badge badge-subsidy">35% Subsidy</span>
              </button>

              <button 
                onClick={() => navigateTo('track')}
                className={`mobile-menu-item ${activeView === 'track' ? 'active' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="menu-icon-box"><Search size={18} /></div>
                  <div>
                    <div className="menu-text">Track Application</div>
                    <span className="menu-subtext">Live Case Tracking</span>
                  </div>
                </div>
                <ChevronRight size={16} className="menu-arrow" />
              </button>

              <button 
                onClick={() => navigateTo('franchise')}
                className={`mobile-menu-item ${activeView === 'franchise' ? 'active' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="menu-icon-box"><Award size={18} /></div>
                  <div>
                    <div className="menu-text">Become Franchise</div>
                    <span className="menu-subtext">Earn Up to 40% Commission</span>
                  </div>
                </div>
                <span className="drawer-badge badge-earn">Earn 40%</span>
              </button>

              <div className="drawer-divider" />

              <button 
                onClick={() => navigateTo('crm')}
                className="mobile-menu-item crm-highlight-item"
              >
                <div className="flex items-center gap-3">
                  <div className="menu-icon-box" style={{ background: 'rgba(255, 111, 0, 0.2)', color: '#ffa726' }}>
                    <LayoutDashboard size={18} />
                  </div>
                  <div>
                    <div className="menu-text" style={{ color: '#ffa726' }}>CRM Admin Portal</div>
                    <span className="menu-subtext">Leads, Cases, CA Billing</span>
                  </div>
                </div>
                <ArrowRight size={16} color="#ffa726" />
              </button>
            </div>

            {/* Quick Contact Buttons */}
            <div className="mobile-drawer-actions">
              <a 
                href="https://wa.me/919876543210?text=Hi%20Digital%20Udyog%20Seva,%20I%20need%20assistance" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="drawer-action-btn whatsapp-btn"
              >
                <MessageCircle size={16} />
                <span>WhatsApp Expert</span>
              </a>
              <a 
                href="tel:18008901234" 
                className="drawer-action-btn call-btn"
              >
                <Phone size={16} />
                <span>Call Helpdesk</span>
              </a>
            </div>

            {/* Drawer Footer */}
            <div className="mobile-drawer-footer">
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Managed by <a href="https://digitalvyaparseva.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#ffa726', fontWeight: '700' }}>Digital Vyapar Seva ↗</a>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                ISO 9001:2015 Certified Portal
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
