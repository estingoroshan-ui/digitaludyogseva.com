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
  ChevronDown,
  HelpCircle,
  PhoneCall,
  Check,
  X as XIcon,
  IndianRupee,
  Layers,
  Flame,
  Send
} from 'lucide-react';

export const HomePage = () => {
  const { 
    popularServices, 
    loanSchemes, 
    setSelectedService, 
    setActiveView, 
    trackApplication, 
    showToast,
    addLead
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [trackInput, setTrackInput] = useState('');
  const [trackedResult, setTrackedResult] = useState(null);

  // Franchise Simulator State
  const [monthlyClients, setMonthlyClients] = useState(35);
  const estimatedIncome = Math.round(monthlyClients * 1850);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Category Tabs
  const categories = [
    'All',
    'Business Registration',
    'Tax & Compliance',
    'Govt Registration',
    'Intellectual Property',
    'Licensing',
    'Loan & DPR'
  ];

  // Filtered services
  const filteredServices = popularServices.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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

  const faqs = [
    {
      q: 'How long does Private Limited Company registration take in India?',
      a: 'With Digital Udyog Seva, complete company incorporation typically takes 7 to 10 working days, subject to MCA (Ministry of Corporate Affairs) processing. This includes Name Reservation (RUN form), 2 Digital Signatures (DSC Class 3), DIN allotment, SPICe+ Part B filing, PAN, TAN, and Certificate of Incorporation (COI).'
    },
    {
      q: 'Who is eligible for the 35% PMEGP Government Loan Subsidy?',
      a: 'Under the Prime Minister Employment Generation Programme (PMEGP), special categories (including Women entrepreneurs, SC/ST, OBC, Minorities, and Ex-servicemen) in rural/semi-urban areas are eligible for up to 35% capital subsidy. General category urban applicants receive 15%, and rural general receive 25% subsidy on project costs up to ₹50 Lakhs.'
    },
    {
      q: 'Do I need to visit any government office physically?',
      a: 'No! The entire filing process is 100% digital and paperless through the Digital Udyog Seva platform. You simply upload your documents to our encrypted vault, and our assigned Chartered Accountants and Company Secretaries execute all filings online.'
    },
    {
      q: 'What is the Digital Udyog Seva Kendra Franchise Partner program?',
      a: 'Our Kendra Franchise program empowers local cyber cafes, CSC operators, tax consultants, and entrepreneurs to offer 50+ corporate, tax, and loan services in their district. You collect customer inquiries, and our backend CA team executes all filings. Partners earn up to 40% commission on every transaction.'
    },
    {
      q: 'Is GST registration mandatory for all new businesses?',
      a: 'GST registration is mandatory if your annual turnover exceeds ₹40 Lakhs for goods (₹20 Lakhs in special states) or ₹20 Lakhs for service providers. It is also mandatory for e-commerce sellers, interstate suppliers, and businesses participating in government tenders.'
    }
  ];

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        
        <div className="container">
          <div className="hero-grid">
            {/* Left Content */}
            <div className="hero-content">
              <div className="badge badge-saffron" style={{ marginBottom: '18px' }}>
                <Sparkles size={14} />
                <span>India's #1 Digital Business & Loan Advisory Platform</span>
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
                  <span>Find Service</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Popular Quick Search Chips */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '600' }}>Popular:</span>
                {['Private Limited', 'GST Registration', 'PMEGP Loan', 'Trademark (™)', 'Udyam MSME', 'FSSAI License'].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSearchQuery(chip === 'Trademark (™)' ? 'Trademark' : chip)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.18)',
                      borderRadius: '9999px',
                      color: '#e2e8f0',
                      fontSize: '0.75rem',
                      padding: '3px 10px',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    {chip}
                  </button>
                ))}
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
                <div style={{ background: 'rgba(11,23,39,0.7)', borderRadius: '12px', padding: '18px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '8px', fontWeight: '700' }}>
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
                  <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
                    Quick sample: <a href="#" onClick={(e) => { e.preventDefault(); setTrackInput('DUS-2026-8942'); }} style={{ color: '#ffa726', textDecoration: 'underline' }}>DUS-2026-8942</a> or <a href="#" onClick={(e) => { e.preventDefault(); setTrackInput('DUS-2026-9114'); }} style={{ color: '#ffa726', textDecoration: 'underline' }}>DUS-2026-9114</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ACCREDITATIONS STRIP */}
      <section className="accreditation-strip">
        <div className="container">
          <div className="accreditation-grid">
            <div className="accreditation-item">
              <Building size={16} color="#2563eb" />
              <span>MCA (Ministry of Corporate Affairs)</span>
            </div>
            <div className="accreditation-item">
              <Award size={16} color="#ff6f00" />
              <span>KVIC (Khadi & Village Industries)</span>
            </div>
            <div className="accreditation-item">
              <ShieldCheck size={16} color="#059669" />
              <span>MSME Udyam Govt Recognized</span>
            </div>
            <div className="accreditation-item">
              <CheckCircle2 size={16} color="#2563eb" />
              <span>FoSCoS Food Safety (FSSAI)</span>
            </div>
            <div className="accreditation-item">
              <Sparkles size={16} color="#ff6f00" />
              <span>DPIIT Startup India Enlisted</span>
            </div>
            <div className="accreditation-item">
              <ShieldCheck size={16} color="#059669" />
              <span>ISO 9001:2015 Quality Certified</span>
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

      {/* 3. HOW IT WORKS 4-STEP TIMELINE */}
      <section className="section" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-saffron" style={{ marginBottom: '12px' }}>
              Seamless Digital Process
            </span>
            <h2>How Digital Udyog Seva Works</h2>
            <p>
              Four simple steps from application to verified government certificate and bank sanction.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Select Service or Loan</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Choose from 50+ corporate incorporation, tax filing, trademark, or subsidized loan programs tailored to your state and business sector.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Upload Docs to Vault</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Submit required identification, address proof, and electricity bills to our 256-bit encrypted digital vault. Zero physical paperwork.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>CA & CS Portal Filing</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Assigned Chartered Accountants prepare statutory declarations, CMA data, and SPICe+ forms and file directly with RoC, KVIC, or GSTN.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">04</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Delivered to Doorstep</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Receive official incorporation certificate, PAN/TAN, DIN letters, or bank loan sanction letter online and physically by speed post.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. POPULAR SERVICES WITH TABBED FILTER */}
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

            {/* Category Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '24px' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                  style={{ borderRadius: '9999px', fontSize: '0.82rem' }}
                >
                  {cat}
                </button>
              ))}
            </div>
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

      {/* 5. INTERACTIVE LOAN CALCULATOR & SCHEMES */}
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

      {/* 6. COMPARISON TABLE: DIGITAL UDYOG SEVA VS LOCAL CONSULTANTS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-saffron" style={{ marginBottom: '12px' }}>
              Why Choose Digital Udyog Seva
            </span>
            <h2>Digital Platform vs Traditional Local Agents</h2>
            <p>
              Compare our streamlined digital ecosystem against conventional unorganized consultants.
            </p>
          </div>

          <div className="comparison-card">
            <table className="comparison-table">
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ textAlign: 'left', width: '36%' }}>Feature / Comparison Factor</th>
                  <th style={{ textAlign: 'left', width: '32%', color: '#ff6f00', background: '#fff7ed' }}>
                    Digital Udyog Seva Platform
                  </th>
                  <th style={{ textAlign: 'left', width: '32%', color: '#64748b' }}>
                    Traditional Local Consultants
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Transparent Pricing</strong></td>
                  <td style={{ color: '#059669', background: '#f0fdf4', fontWeight: '700' }}>
                    ✓ 100% Fixed & Published Online (Zero Hidden Charges)
                  </td>
                  <td style={{ color: '#e11d48' }}>
                    ✗ Vague quotations with unexpected last-minute fees
                  </td>
                </tr>
                <tr>
                  <td><strong>Live Online Tracking</strong></td>
                  <td style={{ color: '#059669', background: '#f0fdf4', fontWeight: '700' }}>
                    ✓ 24x7 Real-time Case Tracking with Stage Updates
                  </td>
                  <td style={{ color: '#e11d48' }}>
                    ✗ Repeated follow-up phone calls with no visibility
                  </td>
                </tr>
                <tr>
                  <td><strong>Professional Team</strong></td>
                  <td style={{ color: '#059669', background: '#f0fdf4', fontWeight: '700' }}>
                    ✓ Verified In-House CAs, CSs, and Ex-Bankers
                  </td>
                  <td style={{ color: '#e11d48' }}>
                    ✗ Third-party sub-contractors and middlemen
                  </td>
                </tr>
                <tr>
                  <td><strong>Turnaround Speed</strong></td>
                  <td style={{ color: '#059669', background: '#f0fdf4', fontWeight: '700' }}>
                    ✓ SLA Bound (e.g. 7-10 Days for Pvt Ltd)
                  </td>
                  <td style={{ color: '#e11d48' }}>
                    ✗ 3 to 6 weeks with frequent resubmission delays
                  </td>
                </tr>
                <tr>
                  <td><strong>Document Security</strong></td>
                  <td style={{ color: '#059669', background: '#f0fdf4', fontWeight: '700' }}>
                    ✓ 256-bit Encrypted Digital Vault Storage
                  </td>
                  <td style={{ color: '#e11d48' }}>
                    ✗ Physical paper copies susceptible to misplacement
                  </td>
                </tr>
                <tr>
                  <td><strong>Govt Subsidies & DPRs</strong></td>
                  <td style={{ color: '#059669', background: '#f0fdf4', fontWeight: '700' }}>
                    ✓ Direct KVIC/PMEGP CMA bank integration
                  </td>
                  <td style={{ color: '#e11d48' }}>
                    ✗ Limited knowledge of central government schemes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. KENDRA FRANCHISE EARNINGS SIMULATOR */}
      <section className="section" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-saffron" style={{ marginBottom: '12px' }}>
              Franchise Partner Program
            </span>
            <h2>Digital Udyog Seva Kendra — Earnings Simulator</h2>
            <p>
              Slide to see how much you can earn every month by running an authorized Business Services Kendra in your district.
            </p>
          </div>

          <div className="simulator-card">
            <div className="simulator-grid">
              <div>
                <span className="badge badge-saffron" style={{ marginBottom: '14px' }}>
                  Interactive Monthly Income Calculator
                </span>
                <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '12px' }}>
                  Empower Local Entrepreneurs & Earn Steady Commission
                </h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '28px', lineHeight: '1.6' }}>
                  Process GST registrations, company setups, ITRs, and government loan project reports from your shop, CSC kiosk, or office. Zero technical knowledge required — our centralized CA/CS team does all filings.
                </p>

                {/* Slider */}
                <div style={{ marginBottom: '20px' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#e2e8f0' }}>Expected Monthly Client Applications:</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', fontSize: '1.3rem', color: '#ffa726' }}>
                      {monthlyClients} Applications / Month
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={monthlyClients}
                    onChange={e => setMonthlyClients(Number(e.target.value))}
                    className="calc-slider"
                  />
                  <div className="flex justify-between" style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                    <span>10 (Part-time)</span>
                    <span>50 (Active Store)</span>
                    <span>100+ (Master Kendra)</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setActiveView('franchise')}
                    className="btn btn-primary btn-lg"
                  >
                    <span>Apply for Kendra Franchise</span>
                    <ArrowRight size={18} />
                  </button>
                  <button 
                    onClick={() => setActiveView('crm')}
                    className="btn btn-outline-white btn-lg"
                  >
                    <span>Partner CRM Portal</span>
                  </button>
                </div>
              </div>

              {/* Right Projected Metrics */}
              <div>
                <div className="income-metric-box">
                  <small style={{ color: '#cbd5e1', textTransform: 'uppercase', fontSize: '0.78rem', letterSpacing: '0.08em', fontWeight: '700' }}>
                    Projected Monthly Partner Earnings
                  </small>
                  <div className="income-metric-val">
                    ₹{estimatedIncome.toLocaleString('en-IN')}
                  </div>
                  <small style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                    Based on ₹1,850 avg payout per registration/loan DPR
                  </small>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '16px', marginTop: '18px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} color="#4ade80" />
                      <span>Weekly payouts directly into bank account</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} color="#4ade80" />
                      <span>Authorized District Branding & Signboard Kit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} color="#4ade80" />
                      <span>Personal Dedicated CA Relationship Manager</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. REAL CLIENT TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-emerald" style={{ marginBottom: '12px' }}>
              Verified Client Reviews
            </span>
            <h2>Trusted by 18,500+ Indian Businesses</h2>
            <p>
              Here is what founders, MSME proprietors, and industrial units across India have to say about Digital Udyog Seva.
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div>
                <div style={{ color: '#f59e0b', fontSize: '1.1rem', marginBottom: '14px' }}>★★★★★</div>
                <p className="testimonial-quote">
                  "Incorporating Sharma Agro Solutions Pvt Ltd was completely hassle-free. Got our Certificate of Incorporation, PAN, TAN, and HDFC bank account in just 8 days without visiting any office in Jaipur. Outstanding service by CA Rajesh Verma."
                </p>
              </div>

              <div className="testimonial-author">
                <div className="testimonial-avatar">SS</div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', margin: 0 }}>Sunil Kumar Sharma</h4>
                  <small style={{ color: '#64748b' }}>Founder, Sharma Agro Solutions Pvt Ltd • Jaipur</small>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div>
                <div style={{ color: '#f59e0b', fontSize: '1.1rem', marginBottom: '14px' }}>★★★★★</div>
                <p className="testimonial-quote">
                  "Applied for ₹25 Lakhs PMEGP loan for our textile unit in Surat. Digital Udyog Seva prepared our CMA project report and handled bank liaisoning with SBI. Our loan got sanctioned with full 35% capital subsidy lock!"
                </p>
              </div>

              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{ background: '#2563eb' }}>PD</div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', margin: 0 }}>Pooja Devi</h4>
                  <small style={{ color: '#64748b' }}>Proprietor, Pooja Fashion Hub • Surat, Gujarat</small>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div>
                <div style={{ color: '#f59e0b', fontSize: '1.1rem', marginBottom: '14px' }}>★★★★★</div>
                <p className="testimonial-quote">
                  "We registered our drone startup as an LLP and filed 2 trademarks with DPIIT startup recognition. The CRM tracking portal kept us updated at every single stage. Fast, reliable, and totally transparent."
                </p>
              </div>

              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{ background: '#059669' }}>KM</div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', margin: 0 }}>Karan Malhotra</h4>
                  <small style={{ color: '#64748b' }}>Designated Partner, Apex Robotics LLP • Bengaluru</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section className="section" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-saffron" style={{ marginBottom: '12px' }}>
              Common Queries Answered
            </span>
            <h2>Frequently Asked Questions</h2>
            <p>
              Everything you need to know about company registration, tax filings, and business loans in India.
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-item">
                <div 
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={20} 
                    style={{ 
                      transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0)', 
                      transition: 'transform 0.2s',
                      color: openFaq === idx ? '#ff6f00' : '#64748b',
                      flexShrink: 0
                    }} 
                  />
                </div>
                {openFaq === idx && (
                  <div className="faq-answer">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. HIGH IMPACT BOTTOM CTA BANNER */}
      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <span className="badge badge-saffron" style={{ marginBottom: '16px' }}>
              Get Started in 5 Minutes
            </span>
            <h2 style={{ color: '#fff', fontSize: '2.6rem', marginBottom: '16px' }}>
              Ready to Incorporate or Secure Govt Funding?
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto 32px', lineHeight: '1.6' }}>
              Join thousands of thriving Indian entrepreneurs. Our senior CA and legal team is ready to guide your business registration today.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <button 
                onClick={() => {
                  const el = document.getElementById('popular-services');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-primary btn-lg"
              >
                <span>Explore All Services</span>
                <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => setActiveView('crm')}
                className="btn btn-outline-white btn-lg"
              >
                <span>Launch CRM Command Center</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
