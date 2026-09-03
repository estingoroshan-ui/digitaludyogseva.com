import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LoanCalculator } from '../components/LoanCalculator';
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Banknote, 
  Building, 
  TrendingUp, 
  Clock, 
  FileCheck, 
  Award,
  Users,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

export const HomePage = () => {
  const { 
    popularServices, 
    loanSchemes, 
    setSelectedService, 
    setActiveView, 
    trackApplication, 
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [trackInput, setTrackInput] = useState('');
  const [trackedResult, setTrackedResult] = useState(null);

  // Filtered services
  const filteredServices = popularServices.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackInput) return;
    const res = trackApplication(trackInput);
    if (res) {
      setTrackedResult(res);
      showToast(`Case details found for Application #${res.id}!`);
    } else {
      showToast(`No active record found for "${trackInput}". Try sample ID: DUS-2026-8942`, 'error');
    }
  };

  return (
    <div>
      {/* SECTION 1: HERO */}
      <section className="hero-section">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        
        <div className="container">
          <div className="hero-grid">
            {/* Left Content */}
            <div className="hero-content">
              <div className="badge badge-saffron" style={{ marginBottom: '18px' }}>
                <Sparkles size={14} />
                <span>India's #1 Digital Business & Loan Advisory</span>
              </div>

              <h2>
                Start, Manage & <span className="highlight">Grow Your Business</span> — All in One Place.
              </h2>

              <p className="hero-subtitle">
                Company incorporation, GST filing, ITR, MSME certificates, trademark protection, and government-subsidized business loans (PMEGP & Mudra) — managed end-to-end with real-time CRM tracking.
              </p>

              {/* Global Quick Search Box */}
              <div className="hero-search-wrapper">
                <Search size={20} color="#94a3b8" style={{ marginLeft: '12px' }} />
                <input
                  type="text"
                  placeholder="Search 50+ services or loans (e.g. Pvt Ltd, GST, PMEGP, Trademark)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <button 
                  onClick={() => {
                    const el = document.getElementById('popular-services');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn btn-primary"
                >
                  <span>Explore</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="hero-trust-row">
                <div className="hero-trust-item">
                  <CheckCircle2 size={16} color="#4ade80" />
                  <span>Transparent Pricing</span>
                </div>
                <div className="hero-trust-item">
                  <ShieldCheck size={16} color="#4ade80" />
                  <span>Licensed CA & CS Assistance</span>
                </div>
                <div className="hero-trust-item">
                  <Clock size={16} color="#4ade80" />
                  <span>Guaranteed MCA Turnaround</span>
                </div>
              </div>
            </div>

            {/* Right Card / Interactive Stats Panel */}
            <div>
              <div className="hero-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>Ecosystem Performance</h3>
                  <span className="badge badge-emerald">Live 2026</span>
                </div>

                <div className="hero-stat-grid">
                  <div className="hero-stat-box">
                    <div className="hero-stat-num">18,500+</div>
                    <div className="hero-stat-lbl">Businesses Incorporated</div>
                  </div>
                  <div className="hero-stat-box">
                    <div className="hero-stat-num">₹140 Cr+</div>
                    <div className="hero-stat-lbl">Loan Sanctions Disbursed</div>
                  </div>
                  <div className="hero-stat-box">
                    <div className="hero-stat-num">4.9 ★</div>
                    <div className="hero-stat-lbl">Client Trust Rating</div>
                  </div>
                  <div className="hero-stat-box">
                    <div className="hero-stat-num">24-48 Hrs</div>
                    <div className="hero-stat-lbl">Avg Response Time</div>
                  </div>
                </div>

                {/* Quick Tracker Inside Hero */}
                <div style={{ background: 'rgba(11,23,39,0.7)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '8px', fontWeight: '600' }}>
                    Track Active Filing / Loan Application
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. DUS-2026-8942"
                      value={trackInput}
                      onChange={e => setTrackInput(e.target.value)}
                      className="form-control"
                      style={{ background: '#12233b', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.85rem' }}
                    />
                    <button 
                      onClick={handleTrack}
                      className="btn btn-sm btn-primary"
                    >
                      Track
                    </button>
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '0.72rem', color: '#cbd5e1' }}>
                    Quick test: <a href="#" onClick={(e) => { e.preventDefault(); setTrackInput('DUS-2026-8942'); }} style={{ color: '#ffa726', textDecoration: 'underline' }}>DUS-2026-8942</a> or <a href="#" onClick={(e) => { e.preventDefault(); setTrackInput('DUS-2026-9114'); }} style={{ color: '#ffa726', textDecoration: 'underline' }}>DUS-2026-9114</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRACKING MODAL / EXPANDED RESULT */}
      {trackedResult && (
        <section className="section" style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', padding: '40px 0' }}>
          <div className="container">
            <div className="tracker-box">
              <div className="flex items-center justify-between" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <span className="badge badge-blue">{trackedResult.status}</span>
                  <h3 style={{ fontSize: '1.35rem', marginTop: '6px' }}>Application #{trackedResult.id}</h3>
                  <small style={{ color: '#64748b' }}>Client: <strong>{trackedResult.clientName}</strong> ({trackedResult.businessName})</small>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0b1727' }}>{trackedResult.service}</div>
                  <small style={{ color: '#059669', fontWeight: '600' }}>Relationship Officer: {trackedResult.officer}</small>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="stepper">
                {trackedResult.stages.map((stage, i) => (
                  <div key={i} className={`step-item ${stage.done ? 'completed' : i === trackedResult.currentStage ? 'active' : ''}`}>
                    <div className="step-circle">
                      {stage.done ? <CheckCircle2 size={20} /> : i + 1}
                    </div>
                    <div className="step-label">{stage.label}</div>
                    <small style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{stage.date}</small>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center" style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Applied Date: <strong>{trackedResult.appliedDate}</strong> • Case is monitored 24x7.
                </span>
                <button onClick={() => setTrackedResult(null)} className="btn btn-sm btn-outline">
                  Close Tracker
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: POPULAR SERVICES */}
      <section id="popular-services" className="section">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-saffron" style={{ marginBottom: '12px' }}>
              Comprehensive Service Catalog
            </span>
            <h2>India's Most Popular Corporate & Legal Services</h2>
            <p>
              Get your business incorporated, taxes streamlined, and intellectual property secured with 100% online processing.
            </p>
          </div>

          <div className="services-grid">
            {filteredServices.map(service => (
              <div key={service.id} className="service-card">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="service-icon-box">
                      <Building size={24} />
                    </div>
                    <span className="badge badge-saffron" style={{ fontSize: '0.72rem' }}>
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="service-title">{service.name}</h3>
                  <p className="service-desc">{service.desc}</p>
                </div>

                <div>
                  <div className="service-meta">
                    <div>
                      <small style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Professional Fee</small>
                      <div className="service-price">{service.price}</div>
                    </div>
                    <div className="service-time">
                      <Clock size={14} />
                      <span>{service.time}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedService(service)}
                    className="btn btn-outline w-full"
                    style={{ marginTop: '16px' }}
                  >
                    <span>View Details & Apply</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <button 
              onClick={() => setActiveView('services')}
              className="btn btn-blue btn-lg"
            >
              <span>Explore All 50+ Services</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: INTERACTIVE LOAN CALCULATOR & SCHEMES */}
      <section className="section" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-emerald" style={{ marginBottom: '12px' }}>
              Government Subsidies & Banking
            </span>
            <h2>Business Loans & Capital Assistance</h2>
            <p>
              Calculate your exact monthly EMI, interest savings, and get paired with 25+ partner banks and NBFCs for PMEGP, Mudra, and MSME working capital.
            </p>
          </div>

          <LoanCalculator />

          {/* Scheme Cards Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginTop: '40px' }}>
            {loanSchemes.map(scheme => (
              <div key={scheme.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px' }}>
                <span className="badge badge-blue" style={{ marginBottom: '8px' }}>{scheme.type}</span>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>{scheme.name}</h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '16px' }}>{scheme.tagline}</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  <div className="flex justify-between">
                    <span style={{ color: '#64748b' }}>Max Funding:</span>
                    <strong style={{ color: '#0b1727' }}>{scheme.maxAmount}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#64748b' }}>Interest Rate:</span>
                    <strong style={{ color: '#059669' }}>{scheme.interestRate}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#64748b' }}>Subsidy / Perk:</span>
                    <strong style={{ color: '#ff6f00' }}>{scheme.subsidy}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: FRANCHISE BANNER */}
      <section className="section" style={{ background: 'linear-gradient(135deg, #0b1727, #12233b)', color: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'center' }}>
            <div>
              <span className="badge badge-saffron" style={{ marginBottom: '14px' }}>
                Digital Udyog Seva Kendra Partner
              </span>
              <h2 style={{ color: '#fff', fontSize: '2.4rem', marginBottom: '16px' }}>
                Start Your Own Business Services Center & Earn ₹50,000+ Monthly
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '1.05rem', marginBottom: '24px' }}>
                Join our nationwide network of 1,200+ franchise partners. Provide registration, licensing, tax filing, and loan services in your district with dedicated backend CA/CS execution support.
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveView('franchise')}
                  className="btn btn-primary btn-lg"
                >
                  <span>Become a Partner</span>
                  <ArrowRight size={18} />
                </button>
                <button 
                  onClick={() => setActiveView('crm')}
                  className="btn btn-outline-white btn-lg"
                >
                  <span>Open CRM Lead Center</span>
                </button>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '30px', border: '1px solid rgba(255,255,255,0.12)' }}>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px' }}>
                Partner Benefits & Support
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Earn up to 40% commission on every business service',
                  'Dedicated CRM Partner Dashboard with live commission ledger',
                  'Zero technical knowledge required — our CAs execute all filings',
                  'Marketing material, branded banner, and lead generation support',
                  'Weekly payout settlements directly to your bank account'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3" style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>
                    <CheckCircle2 size={18} color="#4ade80" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
