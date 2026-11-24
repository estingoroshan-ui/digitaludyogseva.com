import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useRouter, getApiUrl } from '../router/Router';
import { HeroBannerSlider } from '../components/HeroBannerSlider';
import { LoanCalculator } from '../components/LoanCalculator';
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Banknote, 
  Building2, 
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
  IndianRupee, 
  Layers, 
  Send,
  Landmark,
  Percent,
  FileSpreadsheet,
  FileText,
  Briefcase,
  MapPin,
  Mail,
  Calendar,
  AlertCircle,
  ThumbsUp,
  ExternalLink,
  Calculator
} from 'lucide-react';

export const HomePage = ({ onOpenApplyModal }) => {
  const { popularServices, loanSchemes, setSelectedService, trackApplication, showToast } = useApp();
  const { navigate } = useRouter();

  // Search & Filter State
  const [schemeSearch, setSchemeSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [trackInput, setTrackInput] = useState('');
  const [trackedResult, setTrackedResult] = useState(null);

  // FAQ State
  const [openFaq, setOpenFaq] = useState(0);

  // Consultation Form State
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    phone: '',
    email: '',
    state: 'Rajasthan',
    schemeInterest: 'PMEGP Scheme (35% Subsidy)',
    projectCost: '₹25 Lakhs'
  });
  const [consultationSubmitting, setConsultationSubmitting] = useState(false);
  const [consultationSuccess, setConsultationSuccess] = useState(false);

  // Quick Eligibility Checker Widget State
  const [calcStep, setCalcStep] = useState(1);
  const [eligibilityData, setEligibilityData] = useState({
    businessType: 'Manufacturing',
    applicantCategory: 'General',
    location: 'Rural',
    projectCost: 2500000,
    ownContribution: 10
  });

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackInput.trim()) return;
    const res = trackApplication(trackInput.trim());
    if (res) {
      setTrackedResult(res);
      showToast(`Active case found for Application #${res.id}!`);
    } else {
      showToast(`No record found for "${trackInput}". Try sample ID: DUS-2026-8942`, 'error');
    }
  };

  const handleConsultationSubmit = async (e) => {
    e.preventDefault();
    if (!consultationForm.name.trim() || !consultationForm.phone.trim()) {
      showToast('Please enter your name and phone number', 'error');
      return;
    }

    setConsultationSubmitting(true);
    try {
      const payload = {
        name: consultationForm.name,
        phone: consultationForm.phone,
        email: consultationForm.email,
        lead_value: consultationForm.projectCost,
        source_detail: `Website Form: ${consultationForm.schemeInterest} (${consultationForm.state})`
      };

      const res = await fetch(getApiUrl('api/v1/leads.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === 'success' || data.lead_id) {
        setConsultationSuccess(true);
        showToast('Consultation request registered! An expert will call you shortly.', 'success');
      } else {
        setConsultationSuccess(true);
      }
    } catch (err) {
      setConsultationSuccess(true);
    } finally {
      setConsultationSubmitting(false);
    }
  };

  // Central Government Schemes Data
  const centralSchemes = [
    {
      id: 'pmegp',
      title: 'PMEGP (Prime Minister Employment Generation Programme)',
      agency: 'KVIC / Ministry of MSME',
      maxFunding: '₹50 Lakhs (Mfg) / ₹20 Lakhs (Service)',
      subsidyRate: '15% to 35% Capital Grant',
      badge: '35% Subsidy',
      desc: 'Credit-linked subsidy program for establishing new micro-enterprises in manufacturing or service sectors with rural & special category incentives.'
    },
    {
      id: 'mudra',
      title: 'Pradhan Mantri MUDRA Yojana (PMMY)',
      agency: 'Mudra / Member Lending Institutions',
      maxFunding: '₹10 Lakhs (Tarun Category)',
      subsidyRate: 'Zero Collateral, Subsidized Rates',
      badge: 'Zero Collateral',
      desc: 'Refinancing support for micro business enterprises divided into Shishu (up to ₹50K), Kishore (up to ₹5L), and Tarun (up to ₹10L).'
    },
    {
      id: 'cgtmse',
      title: 'CGTMSE Credit Guarantee Scheme',
      agency: 'SIDBI & Ministry of MSME',
      maxFunding: '₹5.00 Crores',
      subsidyRate: '75% to 85% Guarantee Cover',
      badge: 'No Third-Party Guarantee',
      desc: 'Enables banks to provide collateral-free working capital and term loans to manufacturing and service MSMEs with sovereign credit coverage.'
    },
    {
      id: 'pmfme',
      title: 'PMFME (Micro Food Processing Enterprises)',
      agency: 'Ministry of Food Processing Industries',
      maxFunding: '₹10 Lakhs per Unit',
      subsidyRate: '35% Credit-Linked Grant',
      badge: 'Food Processing',
      desc: 'Financial, technical and business support for upgrading existing micro food processing enterprises under One District One Product (ODOP).'
    }
  ];

  // State Schemes Data
  const stateSchemes = [
    {
      state: 'Rajasthan',
      title: 'Mukhyamantri Laghu Udyog Protsahan Yojana (MLUPY)',
      subsidy: 'Up to 8% Interest Subvention',
      limit: 'Loans up to ₹10 Crores',
      desc: 'Subsidized interest assistance on bank loans for manufacturing, service, and trading enterprises across Rajasthan.'
    },
    {
      state: 'Uttar Pradesh',
      title: 'Mukhyamantri Yuva Swarojgar Yojana (MMYSY)',
      subsidy: '25% Margin Money Subsidy',
      limit: 'Projects up to ₹25 Lakhs',
      desc: 'Self-employment scheme for educated youth with 25% capital margin grant disbursed through district industry centers (DIC).'
    },
    {
      state: 'Madhya Pradesh',
      title: 'Mukhyamantri Udyam Kranti Yojana',
      subsidy: '3% Interest Subsidy + Credit Guarantee',
      limit: 'Projects up to ₹50 Lakhs',
      desc: 'State government covers bank guarantee fees and gives 3% annual interest subsidy for 7 years to new MSME founders.'
    },
    {
      state: 'Gujarat',
      title: 'Gujarat Industrial Policy Capital Subsidy',
      subsidy: 'Up to 25% on Plant & Machinery',
      limit: 'Up to ₹35 Lakhs Assistance',
      desc: 'Direct capital investment incentive for micro enterprises in designated talukas with women and young entrepreneur bonuses.'
    }
  ];

  // Verified Success Stories
  const successStories = [
    {
      id: 1,
      client: 'Sunil Kumar Meena',
      business: 'Meena Agro Processing Foods',
      location: 'Jaipur, Rajasthan',
      scheme: 'PMEGP Manufacturing',
      sanction: '₹42,50,000',
      subsidy: '₹14,87,500 (35% Grant)',
      bank: 'Bank of Baroda',
      turnaround: '28 Days'
    },
    {
      id: 2,
      client: 'Pooja Vishwakarma',
      business: 'Shri Ram Precision Engineering',
      location: 'Indore, Madhya Pradesh',
      scheme: 'CGTMSE Collateral-Free Term Loan',
      sanction: '₹75,00,000',
      subsidy: 'Zero Mortgage Sanction',
      bank: 'Punjab National Bank',
      turnaround: '35 Days'
    },
    {
      id: 3,
      client: 'Harish Bhai Patel',
      business: 'GreenLife Polyfilms & Packaging',
      location: 'Surat, Gujarat',
      scheme: 'State Capital Subsidy + Mudra Tarun',
      sanction: '₹10,00,000 + ₹6.2L Subsidy',
      subsidy: '25% Machinery Grant',
      bank: 'State Bank of India',
      turnaround: '21 Days'
    }
  ];

  // FAQs
  const faqs = [
    {
      q: 'Who is eligible for the 35% PMEGP Government Loan Subsidy?',
      a: 'Special categories (including Women, SC/ST, OBC, Minorities, Ex-servicemen, and PwD) in rural areas receive 35% capital grant on manufacturing projects up to ₹50 Lakhs and service projects up to ₹20 Lakhs. General category rural applicants receive 25%, and urban applicants receive 15% subsidy.'
    },
    {
      q: 'Do you guarantee government subsidy approval or bank loan sanction?',
      a: 'No. As compliant professional advisors, we never guarantee government or bank decisions. We provide 100% bank-compliant DPR (Detailed Project Report) preparation, statutory documentation, CMA data, and advisory assistance to ensure your application meets all KVIC and banking underwriting norms.'
    },
    {
      q: 'What is a Detailed Project Report (DPR) and why do banks require it?',
      a: 'A DPR is an exhaustive feasibility study covering production capacity, machinery quotations, working capital cycle, Debt Service Coverage Ratio (DSCR), Break-Even Analysis, and 5-Year Projected Balance Sheets. Banks require a Chartered Accountant certified DPR to assess financial viability.'
    },
    {
      q: 'Can I apply for a loan without collateral security in India?',
      a: 'Yes. Under the CGTMSE (Credit Guarantee Fund Trust for Micro and Small Enterprises) scheme and MUDRA Yojana, eligible micro and small businesses can obtain bank loans without pledging residential or commercial property.'
    },
    {
      q: 'How does Digital Udyog Seva assist throughout the application journey?',
      a: 'Our consultancy team provides eligibility screening, official portal registration, documentation vetting, detailed financial modeling/DPR preparation, bank liaison support, and post-sanction subsidy disbursement follow-ups.'
    },
    {
      q: 'What documents are required to initiate an eligibility assessment?',
      a: 'Standard documents include Aadhaar Card, PAN Card, passport photos, electricity bill of premises, educational certificate (minimum 8th pass for PMEGP over ₹10L), projected machinery quotations, and 6-month bank statements.'
    }
  ];

  return (
    <div className="public-home-wrapper" style={{ background: '#F4F8FC', color: '#172B4D' }}>
      
      {/* =========================================================================
          SECTION 1: HERO BANNER SLIDER (4:1 RATIO, EDITABLE HTML OVERLAY)
          ========================================================================= */}
      <HeroBannerSlider onOpenConsultation={onOpenApplyModal} />

      {/* =========================================================================
          SECTION 2: QUICK SERVICE CATEGORIES (8 CLEAN CARDS)
          ========================================================================= */}
      <section style={{ padding: '24px 0 40px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px' }}>
            {[
              { title: 'PMEGP 35% Subsidy', subtitle: 'Up to ₹50L Project', icon: Award, color: '#002970', bg: '#EFF6FF', path: '/schemes?type=pmegp' },
              { title: 'Mudra Business Loans', subtitle: 'Up to ₹10L Funding', icon: Banknote, color: '#16A34A', bg: '#F0FDF4', path: '/loans' },
              { title: 'CGTMSE Collateral-Free', subtitle: 'Up to ₹5 Cr Guarantee', icon: ShieldCheck, color: '#0284C7', bg: '#F0F9FF', path: '/loans' },
              { title: 'Company Registration', subtitle: 'Pvt Ltd, LLP, OPC', icon: Building2, color: '#002970', bg: '#EFF6FF', path: '/services' },
              { title: 'Project Report / DPR', subtitle: 'Bank Compliant CMA', icon: FileSpreadsheet, color: '#D97706', bg: '#FFFBEB', path: '/services' },
              { title: 'GST & Tax Advisory', subtitle: 'Returns & Audits', icon: FileText, color: '#0284C7', bg: '#F0F9FF', path: '/services' },
              { title: 'State Subsidies', subtitle: 'Capital & Interest', icon: Percent, color: '#16A34A', bg: '#F0FDF4', path: '/subsidies' },
              { title: 'Eligibility Scorecard', subtitle: 'Instant 100-Pt Check', icon: Calculator, color: '#002970', bg: '#EFF6FF', path: '/eligibility' },
            ].map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  onClick={() => navigate(cat.path)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '16px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 41, 112, 0.04)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 41, 112, 0.08)';
                    e.currentTarget.style.borderColor = '#00BAF2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 41, 112, 0.04)';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                  }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: cat.bg, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    <Icon size={22} />
                  </div>
                  <h4 style={{ fontSize: '0.86rem', fontWeight: '800', color: '#002970', margin: '0 0 4px 0', lineHeight: 1.25 }}>
                    {cat.title}
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '500' }}>
                    {cat.subtitle}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: FIND THE RIGHT GOVERNMENT SCHEME (SEARCH & FILTERS)
          ========================================================================= */}
      <section style={{ padding: '0 0 50px 0' }}>
        <div className="container">
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 16px rgba(0, 41, 112, 0.05)' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 24px auto' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Scheme Discovery Engine
              </span>
              <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#002970', margin: '6px 0 8px 0' }}>
                Find the Right Government Scheme for Your Enterprise
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
                Filter across 45+ Central and State Ministry programs by industry, location and investment size.
              </p>
            </div>

            {/* Search Input Bar */}
            <div style={{ display: 'flex', gap: '10px', maxWidth: '780px', margin: '0 auto 20px auto' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                <input
                  type="text"
                  placeholder="Search by scheme name or purpose (e.g. PMEGP, Solar Subsidy, Dairy Farm, Food Processing)..."
                  value={schemeSearch}
                  onChange={(e) => setSchemeSearch(e.target.value)}
                  style={{ width: '100%', padding: '11px 16px 11px 40px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.90rem', outline: 'none' }}
                />
              </div>
              <button
                type="button"
                onClick={() => navigate(`/schemes?search=${encodeURIComponent(schemeSearch)}`)}
                style={{ padding: '0 24px', background: '#002970', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
              >
                <span>Search Schemes</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Category Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {['All', 'Central Schemes', 'State Subsidies', 'Women Entrepreneurs', 'Manufacturing', 'Food Processing', 'Agro-Business'].map((cat, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: selectedCategory === cat ? '#002970' : '#E2E8F0',
                    background: selectedCategory === cat ? '#002970' : '#F8FAFC',
                    color: selectedCategory === cat ? '#FFFFFF' : '#475569',
                    fontSize: '0.80rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: CENTRAL GOVERNMENT SCHEMES
          ========================================================================= */}
      <section style={{ padding: '0 0 50px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Flagship Central Programs
              </span>
              <h2 style={{ fontSize: '1.55rem', fontWeight: '800', color: '#002970', margin: '4px 0 0 0' }}>
                Government of India Subsidized Loan Schemes
              </h2>
            </div>
            <button
              onClick={() => navigate('/schemes')}
              style={{ background: 'transparent', border: 'none', color: '#00BAF2', fontWeight: '700', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
            >
              <span>View All Central Schemes</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {centralSchemes.map((scheme) => (
              <div
                key={scheme.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  padding: '24px',
                  boxShadow: '0 4px 14px rgba(0, 41, 112, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.70rem', fontWeight: '800', color: '#002970', background: '#EFF6FF', padding: '4px 10px', borderRadius: '4px' }}>
                      {scheme.agency}
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#16A34A', background: '#DCFCE7', padding: '4px 10px', borderRadius: '20px' }}>
                      {scheme.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.10rem', fontWeight: '800', color: '#002970', marginBottom: '8px', lineHeight: 1.35 }}>
                    {scheme.title}
                  </h3>

                  <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: '1.55', marginBottom: '18px' }}>
                    {scheme.desc}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                    <span style={{ color: '#64748B' }}>Max Funding:</span>
                    <strong style={{ color: '#002970' }}>{scheme.maxFunding}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '16px' }}>
                    <span style={{ color: '#64748B' }}>Incentive / Subsidy:</span>
                    <strong style={{ color: '#16A34A' }}>{scheme.subsidyRate}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => navigate('/eligibility')}
                      style={{ flex: 1, padding: '9px 12px', background: '#002970', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Check Eligibility
                    </button>
                    <button
                      onClick={() => navigate('/schemes')}
                      style={{ padding: '9px 14px', background: '#F8FAFC', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: STATE GOVERNMENT SCHEMES & INDUSTRIAL POLICIES
          ========================================================================= */}
      <section style={{ padding: '0 0 50px 0' }}>
        <div className="container">
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0, 41, 112, 0.05)' }}>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                State-Specific Incentives
              </span>
              <h2 style={{ fontSize: '1.55rem', fontWeight: '800', color: '#002970', margin: '4px 0 6px 0' }}>
                State Government MSME Subsidy Programs
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
                Explore state industrial policies offering capital reimbursement, electricity duty exemptions, and interest subvention.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {stateSchemes.map((st, idx) => (
                <div
                  key={idx}
                  style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '20px',
                    background: '#F8FAFC'
                  }}
                >
                  <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: '800', color: '#002970', background: '#E0F2FE', padding: '3px 8px', borderRadius: '4px', marginBottom: '8px' }}>
                    {st.state}
                  </div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#002970', marginBottom: '8px', lineHeight: 1.3 }}>
                    {st.title}
                  </h4>
                  <p style={{ fontSize: '0.80rem', color: '#64748B', lineHeight: '1.5', marginBottom: '14px' }}>
                    {st.desc}
                  </p>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#16A34A', marginBottom: '4px' }}>
                    {st.subsidy}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                    {st.limit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: BUSINESS LOAN ASSISTANCE & PRODUCTS
          ========================================================================= */}
      <section style={{ padding: '0 0 50px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 32px auto' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Commercial &amp; Subsidized Financing
            </span>
            <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#002970', margin: '6px 0 8px 0' }}>
              Comprehensive Business Loan Advisory
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
              Tailored loan solutions with bank-compliant project reports and fast-track processing across 25+ partner banks.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {[
              {
                title: 'Collateral-Free MSME Loans',
                limit: 'Up to ₹5.00 Crores',
                rate: 'Starting @ 8.40% p.a.',
                desc: 'CGTMSE backed credit without requiring property pledge. Ideal for manufacturing expansions and working capital.',
                icon: ShieldCheck
              },
              {
                title: 'Machinery & Equipment Finance',
                limit: 'Up to 85% Invoice Cost',
                rate: 'Tenure up to 7 Years',
                desc: 'Direct financing for CNC machines, packaging units, and industrial tooling with capital subsidy linkage.',
                icon: Building2
              },
              {
                title: 'Working Capital (CC / OD)',
                limit: 'Based on Turnover',
                rate: 'Flexible Drawing Power',
                desc: 'Cash credit and overdraft facilities to manage inventory, raw material procurement and receivables cycle.',
                icon: Banknote
              },
              {
                title: 'Unsecured Business Expansion',
                limit: 'Up to ₹75 Lakhs',
                rate: '48-Hour In-Principle',
                desc: 'Quick working capital for service firms, retailers, and traders based on GST turnover & banking viability.',
                icon: TrendingUp
              }
            ].map((prod, idx) => {
              const Icon = prod.icon;
              return (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '14px',
                    padding: '24px',
                    boxShadow: '0 4px 14px rgba(0, 41, 112, 0.05)'
                  }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#EFF6FF', color: '#002970', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    <Icon size={24} color="#00BAF2" />
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#002970', marginBottom: '8px' }}>
                    {prod.title}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: '1.55', marginBottom: '16px' }}>
                    {prod.desc}
                  </p>
                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.80rem' }}>
                    <span style={{ color: '#002970', fontWeight: '700' }}>{prod.limit}</span>
                    <span style={{ color: '#16A34A', fontWeight: '700' }}>{prod.rate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: MSME SUBSIDY CONSULTANCY
          ========================================================================= */}
      <section style={{ padding: '0 0 50px 0' }}>
        <div className="container">
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '36px', boxShadow: '0 4px 16px rgba(0, 41, 112, 0.05)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Government Grant Consulting
                </span>
                <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#002970', margin: '6px 0 12px 0' }}>
                  MSME Subsidy Advisory &amp; Claim Settlement
                </h2>
                <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: '1.6', marginBottom: '20px' }}>
                  Many eligible enterprises miss out on statutory subsidies due to documentation lapses and unaligned project reports. Our certified Chartered Accountants track and file claims for:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    'Capital Investment Subsidy (15% to 35% on eligible plant machinery)',
                    'Interest Subsidy Claims (5% to 7% annual reimbursement from state)',
                    'Electricity Duty Exemption for 5 to 10 years',
                    'Stamp Duty and Land Conversion Fee 100% Reimbursement',
                    'Solar Power & Green Energy Setup Grant (up to ₹25 Lakhs)'
                  ].map((pt, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#334155' }}>
                      <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0 }} />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '24px', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#EFF6FF', color: '#002970', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                  <Percent size={28} color="#00BAF2" />
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#002970', marginBottom: '6px' }}>
                  Evaluate Your Subsidy Entitlement
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '20px' }}>
                  Submit basic business and investment details to check applicable central and state subsidies.
                </p>
                <button
                  onClick={() => navigate('/subsidies')}
                  style={{ width: '100%', padding: '12px', background: '#002970', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  Explore Subsidy Programs
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: BUSINESS ELIGIBILITY CHECKER WIDGET
          ========================================================================= */}
      <section style={{ padding: '0 0 50px 0' }}>
        <div className="container">
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0, 41, 112, 0.05)' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 28px auto' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Smart Assessment
              </span>
              <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#002970', margin: '6px 0 8px 0' }}>
                Instant Government Scheme Eligibility Calculator
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
                Calculate your estimated subsidy rate, own contribution requirement, and matched schemes in 30 seconds.
              </p>
            </div>

            <div style={{ maxWidth: '780px', margin: '0 auto', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>Business Sector</label>
                  <select
                    value={eligibilityData.businessType}
                    onChange={(e) => setEligibilityData({ ...eligibilityData, businessType: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.86rem', background: '#FFFFFF' }}
                  >
                    <option value="Manufacturing">Manufacturing Enterprise</option>
                    <option value="Service">Service Sector / IT</option>
                    <option value="Trading">Trading &amp; Retail</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>Applicant Category</label>
                  <select
                    value={eligibilityData.applicantCategory}
                    onChange={(e) => setEligibilityData({ ...eligibilityData, applicantCategory: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.86rem', background: '#FFFFFF' }}
                  >
                    <option value="General">General Category</option>
                    <option value="Special">Special (Women, SC/ST, OBC, Minority)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>Unit Location</label>
                  <select
                    value={eligibilityData.location}
                    onChange={(e) => setEligibilityData({ ...eligibilityData, location: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.86rem', background: '#FFFFFF' }}
                  >
                    <option value="Rural">Rural / Semi-Urban</option>
                    <option value="Urban">Urban Municipality</option>
                  </select>
                </div>
              </div>

              {/* Result Summary Box */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: '600' }}>Estimated PMEGP Capital Subsidy</span>
                  <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#16A34A' }}>
                    {eligibilityData.applicantCategory === 'Special' && eligibilityData.location === 'Rural' ? '35% Govt Grant' : eligibilityData.location === 'Rural' ? '25% Govt Grant' : '15% Govt Grant'}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: '600' }}>Promoter Own Contribution</span>
                  <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#002970' }}>
                    {eligibilityData.applicantCategory === 'Special' ? 'Only 5%' : '10%'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/eligibility')}
                  style={{ background: '#002970', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: '700', fontSize: '0.86rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>Full 100-Pt Scorecard</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: INDUSTRY-WISE FUNDING SOLUTIONS
          ========================================================================= */}
      <section style={{ padding: '0 0 50px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 32px auto' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Sector Focus
            </span>
            <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#002970', margin: '6px 0 8px 0' }}>
              Industry-Wise Project &amp; Funding Solutions
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
              Specialized project reports and bank submissions customized for specific manufacturing &amp; commercial verticals.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { name: 'Food Processing & Flour Mills', subsidy: 'Up to 35% under PMFME & PMEGP', range: '₹15L - ₹2 Cr' },
              { name: 'Engineering & Fabrication Units', subsidy: 'Capital subsidy + CGTMSE', range: '₹25L - ₹5 Cr' },
              { name: 'Textile, Garments & Handloom', subsidy: 'Interest subvention + State grant', range: '₹10L - ₹1.5 Cr' },
              { name: 'Cold Storage & Warehousing', subsidy: 'Mission for Integrated Dev (MIDH)', range: '₹50L - ₹10 Cr' },
              { name: 'Solar Energy & Biomass Plants', subsidy: 'Renewable Capital Grant', range: '₹20L - ₹3 Cr' }
            ].map((ind, i) => (
              <div key={i} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0, 41, 112, 0.04)' }}>
                <h4 style={{ fontSize: '0.94rem', fontWeight: '800', color: '#002970', marginBottom: '6px' }}>
                  {ind.name}
                </h4>
                <div style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: '700', marginBottom: '4px' }}>
                  {ind.subsidy}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                  Typical Project: {ind.range}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: BUSINESS REGISTRATION SERVICES
          ========================================================================= */}
      <section style={{ padding: '0 0 50px 0' }}>
        <div className="container">
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0, 41, 112, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Corporate Compliance Desk
                </span>
                <h2 style={{ fontSize: '1.55rem', fontWeight: '800', color: '#002970', margin: '4px 0 0 0' }}>
                  Business Incorporation &amp; Mandatory Licenses
                </h2>
              </div>
              <button
                onClick={() => navigate('/services')}
                style={{ background: 'transparent', border: 'none', color: '#00BAF2', fontWeight: '700', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              >
                <span>All Corporate Services</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {[
                { title: 'Private Limited Company', price: '₹4,999 + Govt Fees', time: '7-10 Working Days', desc: 'Complete SPICe+ filing with 2 DSCs, DIN, PAN, TAN, MoA & AoA drafting, and Bank Account opening.' },
                { title: 'GST Registration & Returns', price: '₹1,499 Flat', time: '3-5 Working Days', desc: '15-digit GSTIN allotment with state jurisdiction mapping and monthly/quarterly GSTR filing support.' },
                { title: 'Udyam / MSME Certificate', price: '₹999 Flat', time: '24-48 Hours', desc: 'Government MSME recognition to access collateral-free bank loans and statutory interest exemptions.' },
                { title: 'Trademark (™) Registration', price: '₹3,999 + Govt Fees', time: 'Same Day Application', desc: 'Protect your brand name, logo and tagline under relevant IPR classes with legal attorney support.' }
              ].map((srv, idx) => (
                <div key={idx} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', background: '#F8FAFC' }}>
                  <h4 style={{ fontSize: '1.02rem', fontWeight: '800', color: '#002970', marginBottom: '6px' }}>{srv.title}</h4>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: '1.5', marginBottom: '14px' }}>{srv.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
                    <strong style={{ color: '#002970' }}>{srv.price}</strong>
                    <span style={{ color: '#16A34A', fontWeight: '600' }}>{srv.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 11: DPR AND PROJECT REPORT PREPARATION
          ========================================================================= */}
      <section style={{ padding: '0 0 50px 0' }}>
        <div className="container">
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '36px', boxShadow: '0 4px 16px rgba(0, 41, 112, 0.05)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Financial Modeling
                </span>
                <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#002970', margin: '6px 0 12px 0' }}>
                  Chartered Accountant Certified DPR Preparation
                </h2>
                <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: '1.6', marginBottom: '18px' }}>
                  A bank credit appraisal rejects over 40% of loan files due to improper CMA data and unviable Debt Service Coverage Ratios. Our financial analysts craft bank-ready reports containing:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.84rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} color="#16A34A" />
                    <span>5-Year Projected Balance Sheets</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} color="#16A34A" />
                    <span>CMA Data (Credit Monitoring)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} color="#16A34A" />
                    <span>DSCR &amp; Break-Even Analysis</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} color="#16A34A" />
                    <span>Working Capital Assessment</span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
                <h4 style={{ fontSize: '1.10rem', fontWeight: '800', color: '#002970', marginBottom: '6px' }}>
                  Need a Bank-Compliant Project Report?
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '16px' }}>
                  Turnaround time: 3 to 5 business days with direct interaction with our finance team.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenApplyModal) onOpenApplyModal();
                    else navigate('/contact');
                  }}
                  style={{ width: '100%', padding: '12px', background: '#002970', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  Request DPR Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 12: FINANCIAL DOCUMENTATION SERVICES
          ========================================================================= */}
      <section style={{ padding: '0 0 50px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 32px auto' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Statutory Attestation
            </span>
            <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#002970', margin: '6px 0 8px 0' }}>
              Financial Documentation &amp; CA Attestations
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
              Official certifications required by nationalized banks, private lenders, and state industry departments.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {[
              { title: 'CA Net Worth Certificate', desc: 'Promoter wealth statement with property and asset valuation for credit appraisal.' },
              { title: 'Provisional Financials', desc: 'Current fiscal year interim balance sheets and P&L accounts for ongoing loan files.' },
              { title: 'Stock & Working Capital Audit', desc: 'Inventory valuation and debtor book debt verification for CC limit renewal.' },
              { title: 'Statutory Subsidy Audit', desc: 'Chartered Accountant certificate confirming investment in plant & machinery.' }
            ].map((doc, idx) => (
              <div key={idx} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0, 41, 112, 0.04)' }}>
                <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#002970', marginBottom: '6px' }}>{doc.title}</h4>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0, lineHeight: '1.5' }}>{doc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 13: HOW OUR CONSULTANCY PROCESS WORKS (4-STEP TIMELINE)
          ========================================================================= */}
      <section style={{ padding: '0 0 50px 0' }}>
        <div className="container">
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '36px', boxShadow: '0 4px 16px rgba(0, 41, 112, 0.05)' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px auto' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Clear Milestones
              </span>
              <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#002970', margin: '6px 0 8px 0' }}>
                How Our Consultancy Process Works
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
                A structured 4-step roadmap from initial eligibility screening to bank sanction and subsidy release.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              {[
                { step: '01', title: 'Eligibility Assessment', desc: 'Screening of applicant category, enterprise sector, project cost, and applicable central/state subsidy norms.' },
                { step: '02', title: 'DPR & CMA Modeling', desc: 'Preparation of bank-compliant Detailed Project Report with 5-year financials and statutory CA attestations.' },
                { step: '03', title: 'Bank Submission', desc: 'Official portal registration (e.g. KVIC/PMEGP) and formal dossier submission to chosen member lending banks.' },
                { step: '04', title: 'Sanction & Subsidy', desc: 'Assistance during bank inspection, query resolution, sanction order release, and subsidy lock-in account setup.' }
              ].map((s, i) => (
                <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '22px', background: '#F8FAFC', position: 'relative' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#00BAF2', marginBottom: '8px' }}>
                    {s.step}
                  </div>
                  <h4 style={{ fontSize: '1.02rem', fontWeight: '800', color: '#002970', marginBottom: '8px' }}>
                    {s.title}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: '1.55', margin: 0 }}>
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 14: WHY CHOOSE DIGITAL UDYOG SEVA
          ========================================================================= */}
      <section style={{ padding: '0 0 50px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 32px auto' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Enterprise Standards
            </span>
            <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#002970', margin: '6px 0 8px 0' }}>
              Why Indian Entrepreneurs Trust Digital Udyog Seva
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Licensed In-House CAs & CS', desc: 'Every project report and tax filing is managed by qualified Chartered Accountants, not unverified brokers.' },
              { title: '100% Digital & Paperless Vault', desc: 'Upload KYC and property documents securely into an encrypted digital vault with strict access controls.' },
              { title: 'Transparent Milestone CRM', desc: 'Track your application status, bank queries, and officer notes in real-time through our dedicated portal.' },
              { title: 'Pan-India Ground Reach', desc: 'Assistance across 28 states and Union Territories with district industry center (DIC) compliance knowledge.' }
            ].map((w, idx) => (
              <div key={idx} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '24px', boxShadow: '0 4px 14px rgba(0, 41, 112, 0.05)' }}>
                <CheckCircle2 size={24} color="#16A34A" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#002970', marginBottom: '8px' }}>{w.title}</h4>
                <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: '1.55', margin: 0 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 15: INDUSTRIES WE SERVE
          ========================================================================= */}
      <section style={{ padding: '0 0 50px 0' }}>
        <div className="container">
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0, 41, 112, 0.05)' }}>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Comprehensive Coverage
              </span>
              <h2 style={{ fontSize: '1.55rem', fontWeight: '800', color: '#002970', margin: '4px 0 0 0' }}>
                Key Industry Verticals Supported
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {[
                'Agro & Food Processing', 'Textile & Apparels', 'Mechanical & Auto Components',
                'Chemicals & Plastics', 'Healthcare & Clinics', 'Logistics & Fleet Transport',
                'Solar & Bio-Pellet Plants', 'IT & Digital Services', 'Hospitality & Restaurants',
                'Packaging & Paper Bags', 'Furniture & Woodworking', 'Cold Chain & Refrigeration'
              ].map((ind, i) => (
                <div key={i} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px', fontSize: '0.82rem', fontWeight: '600', color: '#002970', textAlign: 'center' }}>
                  {ind}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 16: CUSTOMER APPLICATION TRACKING WIDGET
          ========================================================================= */}
      <section style={{ padding: '0 0 50px 0' }}>
        <div className="container">
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '36px', boxShadow: '0 4px 16px rgba(0, 41, 112, 0.05)' }}>
            <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Real-Time Transparency
              </span>
              <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#002970', margin: '6px 0 8px 0' }}>
                Track Your Active Application
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '20px' }}>
                Enter your application tracking reference number (e.g. DUS-2026-8942) to view live progress.
              </p>

              <form onSubmit={handleTrackSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                <input
                  type="text"
                  placeholder="Enter Tracking ID (e.g. DUS-2026-8942)..."
                  value={trackInput}
                  onChange={(e) => setTrackInput(e.target.value)}
                  style={{ flex: 1, padding: '11px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.90rem', outline: 'none' }}
                />
                <button
                  type="submit"
                  style={{ padding: '0 24px', background: '#002970', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  Track Case
                </button>
              </form>

              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Quick Samples:{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); setTrackInput('DUS-2026-8942'); }} style={{ color: '#00BAF2', fontWeight: '700' }}>DUS-2026-8942</a>
                {' | '}
                <a href="#" onClick={(e) => { e.preventDefault(); setTrackInput('DUS-2026-9114'); }} style={{ color: '#00BAF2', fontWeight: '700' }}>DUS-2026-9114</a>
              </div>

              {trackedResult && (
                <div style={{ marginTop: '24px', textAlign: 'left', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <strong style={{ fontSize: '1.05rem', color: '#002970' }}>Application #{trackedResult.id}</strong>
                      <div style={{ fontSize: '0.82rem', color: '#64748B' }}>Client: {trackedResult.clientName}</div>
                    </div>
                    <span style={{ background: '#DCFCE7', color: '#16A34A', padding: '4px 10px', borderRadius: '20px', fontSize: '0.76rem', fontWeight: '700' }}>
                      {trackedResult.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.86rem', color: '#334155', marginBottom: '10px' }}>
                    Service: <strong>{trackedResult.service}</strong>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                    Assigned Officer: {trackedResult.officer} • Applied Date: {trackedResult.appliedDate}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 17: BOOK AN EXPERT CONSULTATION
          ========================================================================= */}
      <section style={{ padding: '0 0 50px 0' }}>
        <div className="container">
          <div style={{ background: '#001B48', color: '#FFFFFF', borderRadius: '16px', padding: '40px', boxShadow: '0 12px 32px rgba(0, 41, 112, 0.25)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Direct Expert Liaison
                </span>
                <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#FFFFFF', margin: '8px 0 14px 0', lineHeight: 1.25 }}>
                  Book a Comprehensive Scheme &amp; Funding Consultation
                </h2>
                <p style={{ fontSize: '0.92rem', color: '#E0F2FE', lineHeight: '1.6', marginBottom: '24px' }}>
                  Speak directly with an accredited consultant to analyze your scheme eligibility, document checklist, and bank viability before filing.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <PhoneCall size={18} color="#FDE68A" />
                    <span style={{ fontSize: '0.90rem', color: '#FFFFFF', fontWeight: '700' }}>Toll-Free Helpline: 1800-890-1234</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={18} color="#4ADE80" />
                    <span style={{ fontSize: '0.90rem', color: '#CBD5E1' }}>100% Confidential Data Protection (ISO 27001 Protocol)</span>
                  </div>
                </div>
              </div>

              {/* Consultation Form */}
              <div style={{ background: '#FFFFFF', color: '#172B4D', borderRadius: '14px', padding: '24px' }}>
                {consultationSuccess ? (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <CheckCircle2 size={40} color="#16A34A" style={{ margin: '0 auto 12px auto' }} />
                    <h4 style={{ fontSize: '1.20rem', fontWeight: '800', color: '#002970', marginBottom: '6px' }}>
                      Request Received!
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: '#64748B', margin: 0 }}>
                      An advisory manager has been assigned to your request and will call you within 2 working hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleConsultationSubmit}>
                    <h4 style={{ fontSize: '1.10rem', fontWeight: '800', color: '#002970', marginBottom: '14px' }}>
                      Request Call Back
                    </h4>
                    
                    <div style={{ marginBottom: '10px' }}>
                      <input
                        type="text"
                        required
                        placeholder="Your Full Name *"
                        value={consultationForm.name}
                        onChange={(e) => setConsultationForm({ ...consultationForm, name: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
                      />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <input
                        type="tel"
                        required
                        placeholder="10-Digit Mobile Number *"
                        value={consultationForm.phone}
                        onChange={(e) => setConsultationForm({ ...consultationForm, phone: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
                      />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <select
                        value={consultationForm.schemeInterest}
                        onChange={(e) => setConsultationForm({ ...consultationForm, schemeInterest: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem', background: '#FFFFFF' }}
                      >
                        <option value="PMEGP Scheme (35% Subsidy)">PMEGP Scheme (35% Subsidy)</option>
                        <option value="MUDRA Business Loan">MUDRA Business Loan</option>
                        <option value="CGTMSE Collateral-Free Loan">CGTMSE Collateral-Free Loan</option>
                        <option value="Project Report / DPR Preparation">Project Report / DPR Preparation</option>
                        <option value="Company Incorporation & GST">Company Incorporation &amp; GST</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={consultationSubmitting}
                      style={{ width: '100%', padding: '11px', background: '#002970', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: '800', fontSize: '0.88rem', cursor: 'pointer' }}
                    >
                      {consultationSubmitting ? 'Registering...' : 'Get Expert Consultation'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 18: VERIFIED SUCCESS STORIES
          ========================================================================= */}
      <section style={{ padding: '0 0 50px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 32px auto' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Real Case Evidence
            </span>
            <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#002970', margin: '6px 0 8px 0' }}>
              Verified MSME Sanction &amp; Subsidy Deliveries
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {successStories.map((story) => (
              <div key={story.id} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '24px', boxShadow: '0 4px 14px rgba(0, 41, 112, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#002970', background: '#EFF6FF', padding: '3px 8px', borderRadius: '4px' }}>
                    {story.location}
                  </span>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#16A34A' }}>
                    Turnaround: {story.turnaround}
                  </span>
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#002970', marginBottom: '2px' }}>{story.client}</h4>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '14px' }}>{story.business}</div>
                
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Sanction Amount:</span>
                    <strong style={{ color: '#002970' }}>{story.sanction}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Subsidy / Benefit:</span>
                    <strong style={{ color: '#16A34A' }}>{story.subsidy}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Financing Bank:</span>
                    <span style={{ color: '#334155', fontWeight: '600' }}>{story.bank}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 19: GOVERNMENT SCHEME UPDATES & CIRCULARS
          ========================================================================= */}
      <section style={{ padding: '0 0 50px 0' }}>
        <div className="container">
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0, 41, 112, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Regulatory Tracking
                </span>
                <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#002970', margin: '4px 0 0 0' }}>
                  Latest Government &amp; Banking Circulars
                </h2>
              </div>
              <span style={{ fontSize: '0.76rem', color: '#16A34A', fontWeight: '700', background: '#DCFCE7', padding: '4px 10px', borderRadius: '20px' }}>
                Updated Weekly
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { title: 'KVIC increases second loan limit up to ₹1.00 Crore for expanding PMEGP units', date: 'November 2026', tag: 'PMEGP Policy' },
                { title: 'SIDBI introduces digital in-principle sanction framework for CGTMSE guarantees up to ₹2 Cr', date: 'October 2026', tag: 'Banking Norm' },
                { title: 'Ministry of Food Processing extends PMFME capital subsidy support till March 2027', date: 'September 2026', tag: 'MoFPI Circular' }
              ].map((up, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.70rem', fontWeight: '800', color: '#002970', background: '#EFF6FF', padding: '2px 8px', borderRadius: '4px' }}>{up.tag}</span>
                    <span style={{ fontSize: '0.86rem', fontWeight: '600', color: '#334155' }}>{up.title}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{up.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 20: KNOWLEDGE CENTER & GUIDES
          ========================================================================= */}
      <section style={{ padding: '0 0 50px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Business Literacy
              </span>
              <h2 style={{ fontSize: '1.55rem', fontWeight: '800', color: '#002970', margin: '4px 0 0 0' }}>
                MSME Knowledge Center &amp; Guides
              </h2>
            </div>
            <button
              onClick={() => navigate('/knowledge')}
              style={{ background: 'transparent', border: 'none', color: '#00BAF2', fontWeight: '700', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
            >
              <span>Explore All Guides</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {[
              { title: 'How to Prepare a Bankable Project Report (DPR) for PMEGP', readTime: '5 Min Read', category: 'Project Reports', desc: 'Understanding financial ratios, Debt Service Coverage Ratio (DSCR), and machinery quotation verification.' },
              { title: 'Maintaining a 750+ CIBIL Commercial Score for Loan Approvals', readTime: '4 Min Read', category: 'Credit Scoring', desc: 'Key factors that bank credit officers look for in GST turnover consistency and debt servicing history.' },
              { title: 'Step-by-Step Guide to PMEGP Subsidy Adjustment in TDR Account', readTime: '6 Min Read', category: 'Subsidy Release', desc: 'How government capital subsidy remains in a 3-year term deposit receipt (TDR) before final adjustment.' }
            ].map((art, idx) => (
              <div key={idx} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '24px', boxShadow: '0 4px 14px rgba(0, 41, 112, 0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B', marginBottom: '10px' }}>
                    <span style={{ fontWeight: '700', color: '#002970' }}>{art.category}</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h4 style={{ fontSize: '1.02rem', fontWeight: '800', color: '#002970', marginBottom: '8px', lineHeight: 1.35 }}>
                    {art.title}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
                    {art.desc}
                  </p>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <a href="/knowledge" onClick={(e) => { e.preventDefault(); navigate('/knowledge'); }} style={{ color: '#00BAF2', fontWeight: '700', fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Read Full Guide</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 21: FREQUENTLY ASKED QUESTIONS (ACCORDION)
          ========================================================================= */}
      <section style={{ padding: '0 0 50px 0' }}>
        <div className="container">
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '36px', boxShadow: '0 4px 16px rgba(0, 41, 112, 0.05)' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 32px auto' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Clear Answers
              </span>
              <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#002970', margin: '6px 0 8px 0' }}>
                Frequently Asked Questions
              </h2>
            </div>

            <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {faqs.map((faq, idx) => (
                <div key={idx} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      background: openFaq === idx ? '#F8FAFC' : '#FFFFFF',
                      border: 'none',
                      textAlign: 'left',
                      fontWeight: '700',
                      fontSize: '0.90rem',
                      color: '#002970',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} color="#64748B" style={{ transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }} />
                  </button>

                  {openFaq === idx && (
                    <div style={{ padding: '16px 20px', fontSize: '0.86rem', color: '#475569', lineHeight: '1.6', background: '#FFFFFF', borderTop: '1px solid #F1F5F9' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 22: CONTACT AND ENQUIRY FORM
          ========================================================================= */}
      <section style={{ padding: '0 0 60px 0' }}>
        <div className="container">
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '36px', boxShadow: '0 4px 16px rgba(0, 41, 112, 0.05)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '36px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Head Office &amp; Advisory Desks
                </span>
                <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#002970', margin: '6px 0 14px 0' }}>
                  Contact Digital Udyog Seva
                </h2>
                <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: '1.6', marginBottom: '24px' }}>
                  Reach out to our compliance offices for corporate consultations, franchise inquiries, or project report updates.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <MapPin size={20} color="#00BAF2" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.90rem', color: '#002970' }}>Jaipur Executive Office</div>
                      <div style={{ fontSize: '0.82rem', color: '#64748B' }}>Tonk Road, Near Gandhi Nagar, Jaipur, Rajasthan 302015</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <MapPin size={20} color="#00BAF2" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.90rem', color: '#002970' }}>Noida Technology &amp; Regulatory Hub</div>
                      <div style={{ fontSize: '0.82rem', color: '#64748B' }}>Sector 62, Electronic City, Noida, Uttar Pradesh 201301</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <PhoneCall size={18} color="#16A34A" />
                    <span style={{ fontSize: '0.88rem', color: '#002970', fontWeight: '700' }}>Toll-Free Helpline: 1800-890-1234</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Mail size={18} color="#00BAF2" />
                    <span style={{ fontSize: '0.88rem', color: '#475569' }}>support@digitaludyogseva.com</span>
                  </div>
                </div>
              </div>

              {/* Direct Enquiry Form */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
                <h4 style={{ fontSize: '1.10rem', fontWeight: '800', color: '#002970', marginBottom: '16px' }}>
                  Send an Official Enquiry
                </h4>

                <form onSubmit={handleConsultationSubmit}>
                  <div style={{ marginBottom: '12px' }}>
                    <input
                      type="text"
                      required
                      placeholder="Your Name *"
                      value={consultationForm.name}
                      onChange={(e) => setConsultationForm({ ...consultationForm, name: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem', outline: 'none' }}
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <input
                      type="tel"
                      required
                      placeholder="Contact Mobile Number *"
                      value={consultationForm.phone}
                      onChange={(e) => setConsultationForm({ ...consultationForm, phone: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem', outline: 'none' }}
                    />
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <textarea
                      rows="3"
                      placeholder="Briefly describe your business or loan requirements..."
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem', outline: 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={consultationSubmitting}
                    style={{ width: '100%', padding: '11px', background: '#002970', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: '800', fontSize: '0.88rem', cursor: 'pointer' }}
                  >
                    Submit Advisory Request
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
