import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useRouter } from '../router/Router';
import {
  PhoneCall,
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  ArrowRight,
  Award,
  Banknote,
  Briefcase,
  ShieldCheck,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Calculator,
  Sparkles,
  HelpCircle,
  Building2,
  Landmark,
  TrendingUp,
  Percent,
  Layers,
  Home
} from 'lucide-react';

export const Navbar = ({ onOpenApplyModal }) => {
  const { activeView, setActiveView } = useApp();
  const { navigate, currentPath } = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null); // 'schemes' | 'loans' | 'services' | null
  const megaMenuTimeoutRef = useRef(null);

  const handleMouseEnter = (menu) => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setActiveMegaMenu(menu);
  };

  const handleMouseLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 200);
  };

  const navigateTo = (path, view = 'website') => {
    setActiveView(view);
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 900, background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', boxShadow: '0 2px 10px rgba(0, 41, 112, 0.05)' }}>
      {/* Top Utility Bar */}
      <div className="top-utility-bar" style={{ background: '#001B48', color: '#E2E8F0', fontSize: '0.78rem', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#38BDF8', fontWeight: '600' }}>
              <ShieldCheck size={14} color="#4ADE80" /> ISO 9001:2015 Certified
            </span>
            <span className="hidden-mobile" style={{ color: '#475569' }}>|</span>
            <button
              onClick={() => navigateTo('/about')}
              style={{ background: 'transparent', border: 'none', color: '#CBD5E1', cursor: 'pointer', fontSize: '0.78rem', padding: 0 }}
              className="hidden-mobile"
            >
              About Us
            </button>
            <span className="hidden-mobile" style={{ color: '#475569' }}>|</span>
            <button
              onClick={() => navigateTo('/knowledge')}
              style={{ background: 'transparent', border: 'none', color: '#CBD5E1', cursor: 'pointer', fontSize: '0.78rem', padding: 0 }}
              className="hidden-mobile"
            >
              Knowledge Center
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href="tel:18008901234"
              style={{ color: '#FDE68A', textDecoration: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <PhoneCall size={13} color="#FDE68A" />
              <span>Toll Free: 1800-890-1234</span>
            </a>
            <span style={{ color: '#94A3B8' }}>|</span>
            <button
              onClick={() => navigate('/portal/customer')}
              style={{ background: 'transparent', border: 'none', color: '#38BDF8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: '700', padding: 0 }}
            >
              <User size={13} />
              <span>Customer Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container">
        <div className="navbar-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>

          {/* Brand Logo with Official Circular Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigateTo('/'); }}
            className="brand-logo"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}
          >
            <img
              src="/assets/logo.webp"
              alt="Digital Udyog Seva Logo"
              style={{ width: '40px', height: '40px', objectFit: 'contain', flexShrink: 0 }}
            />
            <div className="brand-text">
              <h1 style={{ fontSize: '1.18rem', fontWeight: '800', color: '#002970', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.15, whiteSpace: 'nowrap' }}>
                Digital Udyog Seva
              </h1>
              <span className="brand-subtitle" style={{ fontSize: '0.64rem', fontWeight: '700', color: '#00BAF2', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginTop: '1px', whiteSpace: 'nowrap' }}>
                Government Scheme &amp; Advisory
              </span>
            </div>
          </a>

          {/* Desktop Navigation with Mega Menus */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center' }}>
            <ul className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2px', listStyle: 'none', margin: 0, padding: 0 }}>

              {/* 1. Home */}
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('/')}
                  className={`nav-link ${currentPath === '/' ? 'active' : ''}`}
                  style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '0.84rem', fontWeight: '600' }}
                >
                  Home
                </button>
              </li>

              {/* 2. Government Schemes (Mega Menu) */}
              <li
                onMouseEnter={() => handleMouseEnter('schemes')}
                onMouseLeave={handleMouseLeave}
                style={{ position: 'relative' }}
              >
                <button
                  type="button"
                  onClick={() => navigateTo('/schemes')}
                  className={`nav-link ${currentPath.startsWith('/schemes') || currentPath.startsWith('/subsidies') ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '6px 10px', borderRadius: '6px', fontSize: '0.84rem', fontWeight: '600' }}
                >
                  <span>Govt Schemes</span>
                  <ChevronDown size={13} color="#64748B" />
                </button>

                {activeMegaMenu === 'schemes' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '-60px',
                      width: '660px',
                      background: '#FFFFFF',
                      borderRadius: '12px',
                      boxShadow: '0 20px 40px rgba(0, 41, 112, 0.15)',
                      border: '1px solid #E2E8F0',
                      padding: '22px',
                      zIndex: 1000,
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '18px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#002970', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Landmark size={14} color="#00BAF2" /> Central Government Programs
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <a href="/schemes?type=pmegp" onClick={(e) => { e.preventDefault(); navigateTo('/schemes?type=pmegp'); }} style={{ textDecoration: 'none', color: '#1E293B', display: 'block', padding: '6px 8px', borderRadius: '6px', background: '#F8FAFC' }}>
                          <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#002970' }}>PMEGP Scheme (35% Subsidy)</div>
                          <div style={{ fontSize: '0.73rem', color: '#64748B' }}>Up to ₹50 Lakhs manufacturing &amp; ₹20L service</div>
                        </a>
                        <a href="/schemes?type=mudra" onClick={(e) => { e.preventDefault(); navigateTo('/schemes?type=mudra'); }} style={{ textDecoration: 'none', color: '#1E293B', display: 'block', padding: '6px 8px', borderRadius: '6px' }}>
                          <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#002970' }}>Pradhan Mantri Mudra Yojana</div>
                          <div style={{ fontSize: '0.73rem', color: '#64748B' }}>Loans up to ₹10 Lakhs with zero collateral</div>
                        </a>
                        <a href="/schemes?type=cgtmse" onClick={(e) => { e.preventDefault(); navigateTo('/schemes?type=cgtmse'); }} style={{ textDecoration: 'none', color: '#1E293B', display: 'block', padding: '6px 8px', borderRadius: '6px' }}>
                          <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#002970' }}>CGTMSE Collateral-Free Loans</div>
                          <div style={{ fontSize: '0.73rem', color: '#64748B' }}>Credit guarantee up to ₹5 Crores without mortgage</div>
                        </a>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#002970', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Percent size={14} color="#16A34A" /> State Subsidies &amp; Grants
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <a href="/subsidies" onClick={(e) => { e.preventDefault(); navigateTo('/subsidies'); }} style={{ textDecoration: 'none', color: '#1E293B', display: 'block', padding: '6px 8px', borderRadius: '6px', background: '#F8FAFC' }}>
                          <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#002970' }}>State Capital Investment Subsidy</div>
                          <div style={{ fontSize: '0.73rem', color: '#64748B' }}>15% to 25% reimbursement on plant &amp; machinery</div>
                        </a>
                        <a href="/subsidies" onClick={(e) => { e.preventDefault(); navigateTo('/subsidies'); }} style={{ textDecoration: 'none', color: '#1E293B', display: 'block', padding: '6px 8px', borderRadius: '6px' }}>
                          <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#002970' }}>Interest Subvention / Re-imbursement</div>
                          <div style={{ fontSize: '0.73rem', color: '#64748B' }}>5% to 7% annual interest discount on term loans</div>
                        </a>
                        <div style={{ paddingTop: '8px', borderTop: '1px solid #E2E8F0', marginTop: '2px', display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => navigateTo('/schemes')}
                            style={{ background: '#002970', color: '#fff', border: 'none', borderRadius: '6px', padding: '7px 10px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                          >
                            <span>All Schemes</span>
                            <ArrowRight size={13} />
                          </button>
                          <button
                            onClick={() => navigateTo('/subsidies')}
                            style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0', borderRadius: '6px', padding: '7px 10px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                          >
                            <Percent size={13} />
                            <span>Subsidies</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>

              {/* 3. Business Loans (Mega Menu) */}
              <li
                onMouseEnter={() => handleMouseEnter('loans')}
                onMouseLeave={handleMouseLeave}
                style={{ position: 'relative' }}
              >
                <button
                  type="button"
                  onClick={() => navigateTo('/loans')}
                  className={`nav-link ${currentPath.startsWith('/loans') ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '6px 10px', borderRadius: '6px', fontSize: '0.84rem', fontWeight: '600' }}
                >
                  <span>Business Loans</span>
                  <ChevronDown size={13} color="#64748B" />
                </button>

                {activeMegaMenu === 'loans' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '-80px',
                      width: '620px',
                      background: '#FFFFFF',
                      borderRadius: '12px',
                      boxShadow: '0 20px 40px rgba(0, 41, 112, 0.15)',
                      border: '1px solid #E2E8F0',
                      padding: '22px',
                      zIndex: 1000,
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '18px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#002970', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Banknote size={14} color="#00BAF2" /> MSME Funding Products
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <a href="/loans#working-capital" onClick={(e) => { e.preventDefault(); navigateTo('/loans'); }} style={{ textDecoration: 'none', color: '#002970', fontWeight: '700', fontSize: '0.85rem', padding: '6px 8px', borderRadius: '6px', background: '#F8FAFC', display: 'block' }}>
                          Cash Credit (CC) &amp; Overdraft (OD)
                          <div style={{ fontSize: '0.73rem', color: '#64748B', fontWeight: '400' }}>For daily working capital &amp; raw materials</div>
                        </a>
                        <a href="/loans#machinery" onClick={(e) => { e.preventDefault(); navigateTo('/loans'); }} style={{ textDecoration: 'none', color: '#002970', fontWeight: '700', fontSize: '0.85rem', padding: '6px 8px', borderRadius: '6px', display: 'block' }}>
                          Machinery &amp; Equipment Loans
                          <div style={{ fontSize: '0.73rem', color: '#64748B', fontWeight: '400' }}>Up to 85% equipment financing with 7-yr tenure</div>
                        </a>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#002970', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FileSpreadsheet size={14} color="#16A34A" /> DPR &amp; Bank Documentation
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <a href="/services#dpr" onClick={(e) => { e.preventDefault(); navigateTo('/services'); }} style={{ textDecoration: 'none', color: '#002970', fontWeight: '700', fontSize: '0.85rem', padding: '6px 8px', borderRadius: '6px', background: '#F8FAFC', display: 'block' }}>
                          Bank-Compliant Project Report (DPR)
                          <div style={{ fontSize: '0.73rem', color: '#64748B', fontWeight: '400' }}>5-Yr financial projections, CMA data, DSCR</div>
                        </a>
                        <a href="/eligibility" onClick={(e) => { e.preventDefault(); navigateTo('/eligibility'); }} style={{ textDecoration: 'none', color: '#002970', fontWeight: '700', fontSize: '0.85rem', padding: '6px 8px', borderRadius: '6px', display: 'block' }}>
                          Instant 100-Point Scorecard
                          <div style={{ fontSize: '0.73rem', color: '#64748B', fontWeight: '400' }}>Check sanction probability before bank submission</div>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </li>

              {/* 4. Services (Mega Menu) */}
              <li
                onMouseEnter={() => handleMouseEnter('services')}
                onMouseLeave={handleMouseLeave}
                style={{ position: 'relative' }}
              >
                <button
                  type="button"
                  onClick={() => navigateTo('/services')}
                  className={`nav-link ${currentPath.startsWith('/services') ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '6px 10px', borderRadius: '6px', fontSize: '0.84rem', fontWeight: '600' }}
                >
                  <span>Services</span>
                  <ChevronDown size={13} color="#64748B" />
                </button>

                {activeMegaMenu === 'services' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '-140px',
                      width: '700px',
                      background: '#FFFFFF',
                      borderRadius: '12px',
                      boxShadow: '0 20px 40px rgba(0, 41, 112, 0.15)',
                      border: '1px solid #E2E8F0',
                      padding: '22px',
                      zIndex: 1000,
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '16px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#002970', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                        Incorporation
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
                        <a href="/services" onClick={(e) => { e.preventDefault(); navigateTo('/services'); }} style={{ color: '#334155', textDecoration: 'none', padding: '3px 0' }}>Private Limited Company</a>
                        <a href="/services" onClick={(e) => { e.preventDefault(); navigateTo('/services'); }} style={{ color: '#334155', textDecoration: 'none', padding: '3px 0' }}>LLP Registration</a>
                        <a href="/services" onClick={(e) => { e.preventDefault(); navigateTo('/services'); }} style={{ color: '#334155', textDecoration: 'none', padding: '3px 0' }}>One Person Company (OPC)</a>
                        <a href="/services" onClick={(e) => { e.preventDefault(); navigateTo('/services'); }} style={{ color: '#334155', textDecoration: 'none', padding: '3px 0' }}>Section 8 NGO / Trust</a>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#002970', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                        Registrations &amp; Tax
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
                        <a href="/services" onClick={(e) => { e.preventDefault(); navigateTo('/services'); }} style={{ color: '#334155', textDecoration: 'none', padding: '3px 0' }}>GST Registration &amp; Filing</a>
                        <a href="/services" onClick={(e) => { e.preventDefault(); navigateTo('/services'); }} style={{ color: '#334155', textDecoration: 'none', padding: '3px 0' }}>Udyam MSME Certificate</a>
                        <a href="/services" onClick={(e) => { e.preventDefault(); navigateTo('/services'); }} style={{ color: '#334155', textDecoration: 'none', padding: '3px 0' }}>Trademark (™) Registration</a>
                        <a href="/services" onClick={(e) => { e.preventDefault(); navigateTo('/services'); }} style={{ color: '#334155', textDecoration: 'none', padding: '3px 0' }}>FSSAI Food License</a>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#002970', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                        Financial Advisory
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
                        <a href="/services" onClick={(e) => { e.preventDefault(); navigateTo('/services'); }} style={{ color: '#334155', textDecoration: 'none', padding: '3px 0' }}>DPR &amp; CMA Data Prep</a>
                        <a href="/services" onClick={(e) => { e.preventDefault(); navigateTo('/services'); }} style={{ color: '#334155', textDecoration: 'none', padding: '3px 0' }}>CA Net Worth Certificate</a>
                        <a href="/services" onClick={(e) => { e.preventDefault(); navigateTo('/services'); }} style={{ color: '#334155', textDecoration: 'none', padding: '3px 0' }}>Income Tax Return (ITR)</a>
                        <a href="/services" onClick={(e) => { e.preventDefault(); navigateTo('/services'); }} style={{ color: '#334155', textDecoration: 'none', padding: '3px 0' }}>Industrial Subsidy Audits</a>
                      </div>
                    </div>
                  </div>
                )}
              </li>

              {/* 5. Eligibility Check */}
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('/eligibility')}
                  className={`nav-link ${currentPath === '/eligibility' ? 'active' : ''}`}
                  style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '0.84rem', fontWeight: '600' }}
                >
                  Eligibility Check
                </button>
              </li>

              {/* 6. Track Case */}
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('/track')}
                  className={`nav-link ${currentPath === '/track' ? 'active' : ''}`}
                  style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '0.84rem', fontWeight: '600' }}
                >
                  Track Case
                </button>
              </li>

              {/* 7. Contact Us */}
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('/contact')}
                  className={`nav-link ${currentPath === '/contact' ? 'active' : ''}`}
                  style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '0.84rem', fontWeight: '600' }}
                >
                  Contact
                </button>
              </li>
            </ul>
          </nav>

          {/* Desktop Right Action Buttons */}
          <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => navigate('/portal/customer')}
              className="btn btn-outline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '7px',
                borderColor: '#CBD5E1',
                color: '#002970',
                fontSize: '0.82rem',
                fontWeight: '700',
                background: '#F8FAFC',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              title="Customer Login & Case Tracking"
            >
              <User size={14} color="#00BAF2" />
              <span>Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onOpenApplyModal) onOpenApplyModal();
                else navigateTo('/eligibility');
              }}
              className="btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 16px',
                borderRadius: '7px',
                background: '#002970',
                color: '#FFFFFF',
                fontSize: '0.84rem',
                fontWeight: '700',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0, 41, 112, 0.2)',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              <Sparkles size={14} color="#00BAF2" />
              <span>Apply Now</span>
            </button>
          </div>

          {/* Mobile App Header Controls */}
          <div className="mobile-header-controls">
            <a
              href="tel:18008901234"
              className="mobile-phone-btn"
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                background: '#F1F5F9',
                color: '#002970',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.78rem',
                fontWeight: '700',
                textDecoration: 'none'
              }}
              title="Call Helpline"
            >
              <PhoneCall size={14} color="#00BAF2" />
              <span>1800</span>
            </a>

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

      {/* Mobile Slide-in Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src="/assets/logo.webp"
                  alt="Digital Udyog Seva Logo"
                  style={{ width: '38px', height: '38px', objectFit: 'contain' }}
                />
                <div className="brand-text">
                  <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: '800', color: '#002970' }}>Digital Udyog Seva</h3>
                  <span style={{ fontSize: '0.68rem', color: '#00BAF2', fontWeight: '700' }}>Govt Scheme &amp; Advisory</span>
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

            {/* Helpline Info */}
            <div className="mobile-drawer-helpline" style={{ background: '#001B48', padding: '14px', borderRadius: '10px', margin: '14px' }}>
              <div style={{ color: '#FDE68A', fontWeight: '800', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <PhoneCall size={14} /> Helpline: 1800-890-1234
              </div>
              <div style={{ color: '#94A3B8', fontSize: '0.74rem', marginTop: '4px' }}>
                Central &amp; State Schemes Advisory Desk (9 AM - 7 PM)
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="mobile-drawer-menu" style={{ padding: '0 14px' }}>
              <button onClick={() => navigateTo('/')} className="mobile-menu-item">
                <Home size={18} color="#00BAF2" />
                <span>Home</span>
              </button>
              <button onClick={() => navigateTo('/schemes')} className="mobile-menu-item">
                <Award size={18} color="#002970" />
                <span>Government Schemes</span>
              </button>
              <button onClick={() => navigateTo('/loans')} className="mobile-menu-item">
                <Banknote size={18} color="#16A34A" />
                <span>Business Loans</span>
              </button>
              <button onClick={() => navigateTo('/subsidies')} className="mobile-menu-item">
                <Percent size={18} color="#D97706" />
                <span>Subsidy Schemes</span>
              </button>
              <button onClick={() => navigateTo('/services')} className="mobile-menu-item">
                <Layers size={18} color="#00BAF2" />
                <span>Our Services</span>
              </button>
              <button onClick={() => navigateTo('/eligibility')} className="mobile-menu-item">
                <Calculator size={18} color="#002970" />
                <span>Eligibility Check</span>
              </button>
              <button onClick={() => navigateTo('/track')} className="mobile-menu-item">
                <Search size={18} color="#00BAF2" />
                <span>Track Application</span>
              </button>
              <button onClick={() => navigateTo('/knowledge')} className="mobile-menu-item">
                <FileText size={18} color="#64748B" />
                <span>Knowledge Center</span>
              </button>
              <button onClick={() => navigateTo('/contact')} className="mobile-menu-item">
                <Briefcase size={18} color="#64748B" />
                <span>Contact Us</span>
              </button>

              <div style={{ margin: '14px 0', borderTop: '1px solid #E2E8F0' }} />

              <button
                onClick={() => navigateTo('/portal/customer')}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  background: '#002970',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <User size={16} color="#00BAF2" />
                <span>Customer Portal Login</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
