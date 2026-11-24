import React, { useState, useMemo } from 'react';
import { useRouter } from '../router/Router';
import { 
  Search, 
  Filter, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  X, 
  ExternalLink, 
  FileText, 
  Banknote, 
  Percent, 
  Building2, 
  MapPin, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const SchemesDiscoveryPage = ({ onOpenApplyModal }) => {
  const { navigate, queryParams } = useRouter();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState(queryParams.search || '');
  const [govLevel, setGovLevel] = useState('All'); // 'All' | 'Central' | 'State'
  const [selectedState, setSelectedState] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [businessType, setBusinessType] = useState('All'); // 'All' | 'Manufacturing' | 'Service' | 'Trading'
  const [stage, setStage] = useState('All'); // 'All' | 'New' | 'Existing'
  const [applicantCat, setApplicantCat] = useState('All'); // 'All' | 'General' | 'Women' | 'SC/ST' | 'OBC'
  const [subsidyType, setSubsidyType] = useState('All'); // 'All' | 'Capital Grant' | 'Interest Subvention'
  const [locationType, setLocationType] = useState('All'); // 'All' | 'Rural' | 'Urban'

  // Selected Scheme Detail Modal
  const [activeSchemeDetail, setActiveSchemeDetail] = useState(null);

  // Scheme Catalog
  const schemesData = [
    {
      id: 'pmegp',
      level: 'Central',
      state: 'All States',
      title: 'PMEGP (Prime Minister Employment Generation Programme)',
      agency: 'KVIC / Ministry of MSME',
      industry: 'Manufacturing, Service',
      businessType: 'Manufacturing, Service',
      stage: 'New Unit',
      applicantCat: 'General, Women, SC/ST, OBC',
      location: 'Rural, Urban',
      maxLoan: '₹50 Lakhs (Mfg) / ₹20 Lakhs (Service)',
      subsidy: '15% to 35% Capital Grant',
      subsidyType: 'Capital Grant',
      lastVerified: 'November 2026',
      officialUrl: 'https://www.kviconline.gov.in/pmegpeportal/',
      overview: 'PMEGP is a credit-linked subsidy programme aimed at generating self-employment opportunities through establishment of micro-enterprises in non-farm sector by helping traditional artisans and unemployed youth.',
      eligibility: [
        'Any individual above 18 years of age.',
        'At least VIII standard pass for projects above ₹10 Lakhs in manufacturing and above ₹5 Lakhs in service sector.',
        'Only newly established units are eligible for initial subsidy.',
        'Self Help Groups (SHGs) and institutions registered under Societies Registration Act, 1860.'
      ],
      benefits: [
        'Rural special category (Women, SC/ST, OBC, Minorities, Ex-servicemen): 35% subsidy.',
        'Rural general category: 25% subsidy.',
        'Urban special category: 25% subsidy.',
        'Urban general category: 15% subsidy.',
        'Promoter contribution is only 5% for special categories and 10% for general categories.'
      ],
      documents: [
        'Aadhaar Card and PAN Card of applicant.',
        'Educational qualification marksheet/certificate.',
        'Special category caste certificate (if applicable).',
        'Detailed Project Report (DPR) certified by CA.',
        'Quotations for proposed machinery and equipment.',
        'Rural area verification certificate (from Gram Panchayat).'
      ],
      process: '1. Online application on KVIC portal -> 2. DIC / KVIC District Committee scrutiny -> 3. Bank branch underwriting & inspection -> 4. Sanction and disbursement -> 5. 35% subsidy deposited in 3-year TDR.'
    },
    {
      id: 'mudra',
      level: 'Central',
      state: 'All States',
      title: 'Pradhan Mantri MUDRA Yojana (PMMY)',
      agency: 'Mudra / Member Lending Institutions',
      industry: 'Manufacturing, Service, Trading',
      businessType: 'Manufacturing, Service, Trading',
      stage: 'New, Existing',
      applicantCat: 'General, Women, SC/ST, OBC',
      location: 'Rural, Urban',
      maxLoan: '₹10 Lakhs (Tarun Category)',
      subsidy: 'Zero Collateral, Concessional Interest',
      subsidyType: 'Interest Subvention',
      lastVerified: 'November 2026',
      officialUrl: 'https://www.mudra.org.in/',
      overview: 'MUDRA provides refinance support to commercial banks, RRBs, Small Finance Banks and MFIs for lending to micro business units engaged in manufacturing, trading and services.',
      eligibility: [
        'Any Indian citizen with a business proposal for non-farm income generating activity.',
        'Credit requirement up to ₹10 Lakhs.',
        'Clean repayment record with no bank default history.'
      ],
      benefits: [
        'Shishu: Loans up to ₹50,000 for early starters.',
        'Kishore: Loans from ₹50,001 up to ₹5,00,000 for purchasing equipment.',
        'Tarun: Loans from ₹5,00,001 up to ₹10,00,000 for business expansion.',
        'Zero collateral security or third-party guarantee required.'
      ],
      documents: [
        'Identity & Address proofs (Aadhaar, Voter ID, Passport).',
        'Business address and proof of establishment (Udyam, GST).',
        '6-month bank statement.',
        'Quotations for machinery/items to be purchased.'
      ],
      process: '1. Apply at any commercial or small finance bank branch -> 2. Form submission with business proposal -> 3. Document verification -> 4. Sanction letter & Mudra Card disbursement.'
    },
    {
      id: 'cgtmse',
      level: 'Central',
      state: 'All States',
      title: 'CGTMSE Credit Guarantee Scheme for Micro & Small Enterprises',
      agency: 'SIDBI & Ministry of MSME',
      industry: 'Manufacturing, Service',
      businessType: 'Manufacturing, Service',
      stage: 'New, Existing',
      applicantCat: 'General, Women, SC/ST, OBC',
      location: 'Rural, Urban',
      maxLoan: '₹5.00 Crores',
      subsidy: '75% to 85% Sovereign Guarantee Cover',
      subsidyType: 'Capital Grant',
      lastVerified: 'October 2026',
      officialUrl: 'https://www.cgtmse.in/',
      overview: 'CGTMSE provides credit guarantee to member lending institutions to enable collateral-free credit delivery to micro and small enterprises.',
      eligibility: [
        'New and existing Micro and Small Enterprises.',
        'Valid Udyam Registration Certificate.',
        'Viable business model with satisfactory debt service coverage ratio (DSCR).'
      ],
      benefits: [
        'Guarantee cover up to 85% for micro-enterprises up to ₹5 Lakhs.',
        'Guarantee cover up to 85% for women-owned units and units in North-East.',
        'Zero mortgage of residential property or collateral needed.'
      ],
      documents: [
        'Bank-compliant Detailed Project Report (DPR) with CMA Data.',
        'Past 3 years audited financials (for existing enterprises).',
        'ITR acknowledgements and 12-month GST returns.',
        'KYC documents of promoters and directors.'
      ],
      process: '1. File submission at bank with DPR -> 2. Bank appraisal & sanction -> 3. Bank marks file on CGTMSE portal -> 4. Guarantee cover issued & loan disbursed.'
    },
    {
      id: 'pmfme',
      level: 'Central',
      state: 'All States',
      title: 'PM Formalisation of Micro Food Processing Enterprises (PMFME)',
      agency: 'Ministry of Food Processing Industries',
      industry: 'Agro & Food Processing',
      businessType: 'Manufacturing',
      stage: 'New, Existing',
      applicantCat: 'General, Women, SC/ST, OBC',
      location: 'Rural, Urban',
      maxLoan: '₹10 Lakhs Subsidy per Enterprise',
      subsidy: '35% Credit-Linked Capital Subsidy',
      subsidyType: 'Capital Grant',
      lastVerified: 'November 2026',
      officialUrl: 'https://pmfme.mofpi.gov.in/',
      overview: 'PMFME provides financial, technical, and business support for the upgradation and formalization of micro food processing units under One District One Product (ODOP) focus.',
      eligibility: [
        'Existing micro food processing units or new ODOP units.',
        'Ownership of unit should be in individual or partnership name.',
        'Willingness to formalize business compliance (FSSAI, GST).'
      ],
      benefits: [
        '35% credit-linked capital subsidy with maximum ceiling of ₹10 Lakhs.',
        'Seed capital for Self Help Groups (SHGs) up to ₹40,000 per member.',
        'Marketing and branding support for common clusters.'
      ],
      documents: [
        'Aadhaar, PAN, and Udyam Registration.',
        'Detailed food processing project report with plant layout.',
        'Machinery quotations compliant with food safety norms.',
        'Land ownership or lease deed for processing facility.'
      ],
      process: '1. Online submission through District Resource Person (DRP) -> 2. District Level Committee recommendation -> 3. Bank branch underwriting -> 4. Subsidy credit.'
    },
    {
      id: 'mlupy',
      level: 'State',
      state: 'Rajasthan',
      title: 'Mukhyamantri Laghu Udyog Protsahan Yojana (MLUPY)',
      agency: 'Government of Rajasthan (Industries Dept)',
      industry: 'Manufacturing, Service, Trading',
      businessType: 'Manufacturing, Service, Trading',
      stage: 'New, Existing',
      applicantCat: 'General, Women, SC/ST, OBC',
      location: 'Rural, Urban',
      maxLoan: 'Up to ₹10 Crores',
      subsidy: 'Up to 8% Annual Interest Subvention',
      subsidyType: 'Interest Subvention',
      lastVerified: 'November 2026',
      officialUrl: 'https://industries.rajasthan.gov.in/',
      overview: 'Provides subsidized interest rates on bank loans for setting up new enterprises or expanding existing units across Rajasthan.',
      eligibility: [
        'Resident of Rajasthan with proposed business in Rajasthan.',
        'Age 18 years and above.',
        'New or existing MSME units.'
      ],
      benefits: [
        '8% interest subsidy on loans up to ₹25 Lakhs.',
        '6% interest subsidy on loans from ₹25 Lakhs to ₹5 Crores.',
        '5% interest subsidy on loans from ₹5 Crores to ₹10 Crores.'
      ],
      documents: [
        'Rajasthan Domicile / Jan Aadhaar Card.',
        'Aadhaar and PAN Card.',
        'Project Report / Cost Estimates.',
        'Bank Account Details in Rajasthan.'
      ],
      process: '1. Online application via SSO Rajasthan portal -> 2. Scrutiny by District Industries Center (DIC) -> 3. Forwarding to bank -> 4. Quarterly interest subsidy disbursement.'
    },
    {
      id: 'mmysy',
      level: 'State',
      state: 'Uttar Pradesh',
      title: 'Mukhyamantri Yuva Swarojgar Yojana (MMYSY)',
      agency: 'Government of Uttar Pradesh (DIC)',
      industry: 'Manufacturing, Service',
      businessType: 'Manufacturing, Service',
      stage: 'New Unit',
      applicantCat: 'General, Women, SC/ST, OBC',
      location: 'Rural, Urban',
      maxLoan: '₹25 Lakhs (Mfg) / ₹10 Lakhs (Service)',
      subsidy: '25% Margin Money Subsidy',
      subsidyType: 'Capital Grant',
      lastVerified: 'October 2026',
      officialUrl: 'https://diupmsme.upsdc.gov.in/',
      overview: 'A flagship youth self-employment initiative of the Uttar Pradesh government offering 25% capital margin support for industrial and service setups.',
      eligibility: [
        'Resident of Uttar Pradesh aged 18 to 40 years.',
        'Minimum High School (10th pass) qualification.',
        'Should not be a defaulter with any financial institution.'
      ],
      benefits: [
        '25% margin money subsidy on project cost (max ₹6.25L for Mfg).',
        '25% margin money subsidy (max ₹2.5L for Service sector).',
        'Converted to grant after 2 years of successful business operation.'
      ],
      documents: [
        'UP Domicile Certificate & High School Marksheet.',
        'Aadhaar, PAN & Passport Photo.',
        'Project Profile prepared by technical consultant.',
        'Affidavit affirming no other government loan taken.'
      ],
      process: '1. Online submission on DIUPMSME portal -> 2. District level committee interview -> 3. Bank loan sanction -> 4. Margin subsidy transfer to bank.'
    }
  ];

  // Filter Logic
  const filteredSchemes = useMemo(() => {
    return schemesData.filter((s) => {
      // Search
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesSearch = s.title.toLowerCase().includes(q) ||
                              s.agency.toLowerCase().includes(q) ||
                              s.industry.toLowerCase().includes(q) ||
                              s.overview.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // Gov Level
      if (govLevel !== 'All' && s.level !== govLevel) return false;

      // State
      if (selectedState !== 'All' && s.state !== 'All States' && s.state !== selectedState) return false;

      // Business Type
      if (businessType !== 'All' && !s.businessType.includes(businessType)) return false;

      // Subsidy Type
      if (subsidyType !== 'All' && s.subsidyType !== subsidyType) return false;

      return true;
    });
  }, [searchTerm, govLevel, selectedState, businessType, subsidyType]);

  return (
    <div style={{ background: '#F4F8FC', minHeight: '100vh', padding: '30px 0 60px 0' }}>
      <div className="container">
        
        {/* Header Breadcrumb & Heading */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '6px' }}>
            <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#00BAF2' }}>Home</span>
            {' > '}
            <span style={{ fontWeight: '700', color: '#002970' }}>Government Schemes Directory</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#002970', margin: '0 0 8px 0' }}>
            Government Scheme Discovery &amp; Subsidy Catalog
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#475569', margin: 0, maxWidth: '800px' }}>
            Explore verified Central and State Government incentive programs with direct eligibility requirements, subsidy limits, and bank underwriting assistance.
          </p>
        </div>

        {/* Multi-Dimensional Filter Bar */}
        <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px', marginBottom: '28px', boxShadow: '0 4px 14px rgba(0, 41, 112, 0.05)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            
            {/* Search */}
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>Keyword Search</label>
              <input
                type="text"
                placeholder="Scheme name, subsidy, agency..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
              />
            </div>

            {/* Central / State */}
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>Government Level</label>
              <select
                value={govLevel}
                onChange={(e) => setGovLevel(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem', background: '#FFFFFF' }}
              >
                <option value="All">All Levels (Central &amp; State)</option>
                <option value="Central">Central Government</option>
                <option value="State">State Government</option>
              </select>
            </div>

            {/* State Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>Target State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem', background: '#FFFFFF' }}
              >
                <option value="All">Pan-India / All States</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
            </div>

            {/* Business Type */}
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>Business Sector</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem', background: '#FFFFFF' }}
              >
                <option value="All">All Sectors</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Service">Service Sector</option>
                <option value="Trading">Trading &amp; Retail</option>
              </select>
            </div>

            {/* Subsidy Benefit */}
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>Incentive Type</label>
              <select
                value={subsidyType}
                onChange={(e) => setSubsidyType(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem', background: '#FFFFFF' }}
              >
                <option value="All">All Incentive Types</option>
                <option value="Capital Grant">Capital Subsidy (Grant)</option>
                <option value="Interest Subvention">Interest Subvention (Rebate)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ fontSize: '0.88rem', color: '#475569' }}>
            Showing <strong>{filteredSchemes.length}</strong> verified government scheme(s)
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setGovLevel('All');
              setSelectedState('All');
              setBusinessType('All');
              setSubsidyType('All');
            }}
            style={{ background: 'transparent', border: 'none', color: '#00BAF2', fontSize: '0.80rem', fontWeight: '700', cursor: 'pointer' }}
          >
            Reset All Filters
          </button>
        </div>

        {/* Schemes Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
          {filteredSchemes.map((scheme) => (
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
                  <span style={{ fontSize: '0.70rem', fontWeight: '800', color: '#002970', background: '#EFF6FF', padding: '4px 8px', borderRadius: '4px' }}>
                    {scheme.level} Govt • {scheme.state}
                  </span>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#16A34A', background: '#DCFCE7', padding: '4px 10px', borderRadius: '20px' }}>
                    {scheme.subsidyType}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#002970', marginBottom: '8px', lineHeight: 1.35 }}>
                  {scheme.title}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '12px' }}>
                  Agency: <strong>{scheme.agency}</strong>
                </div>

                <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: '1.55', marginBottom: '16px' }}>
                  {scheme.overview}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                  <span style={{ color: '#64748B' }}>Max Funding Limit:</span>
                  <strong style={{ color: '#002970' }}>{scheme.maxLoan}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '16px' }}>
                  <span style={{ color: '#64748B' }}>Incentive / Subsidy:</span>
                  <strong style={{ color: '#16A34A' }}>{scheme.subsidy}</strong>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setActiveSchemeDetail(scheme)}
                    style={{ flex: 1, padding: '10px 14px', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.84rem', fontWeight: '700', color: '#002970', cursor: 'pointer' }}
                  >
                    View Full Details
                  </button>
                  <button
                    onClick={() => {
                      if (onOpenApplyModal) onOpenApplyModal();
                      else navigate('/eligibility');
                    }}
                    style={{ padding: '10px 16px', background: '#002970', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '0.84rem', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* =========================================================================
          SCHEME DETAIL POPUP MODAL
          ========================================================================= */}
      {activeSchemeDetail && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 27, 72, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 2500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setActiveSchemeDetail(null)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '720px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 41, 112, 0.35)',
              border: '1px solid #E2E8F0'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ background: '#001B48', color: '#FFFFFF', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#00BAF2', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {activeSchemeDetail.agency}
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#FFFFFF', margin: '6px 0 0 0' }}>
                  {activeSchemeDetail.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveSchemeDetail(null)}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              {/* Snapshot metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', background: '#F8FAFC', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Maximum Funding</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#002970' }}>{activeSchemeDetail.maxLoan}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Subsidy / Incentive</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#16A34A' }}>{activeSchemeDetail.subsidy}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Audit Verification Date</div>
                  <div style={{ fontSize: '0.90rem', fontWeight: '700', color: '#334155' }}>{activeSchemeDetail.lastVerified}</div>
                </div>
              </div>

              {/* Overview */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.96rem', fontWeight: '800', color: '#002970', marginBottom: '8px' }}>
                  Scheme Overview &amp; Objective
                </h4>
                <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                  {activeSchemeDetail.overview}
                </p>
              </div>

              {/* Eligibility Requirements */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.96rem', fontWeight: '800', color: '#002970', marginBottom: '8px' }}>
                  Mandatory Eligibility Requirements
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {activeSchemeDetail.eligibility.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: '#334155' }}>
                      <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Documents */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.96rem', fontWeight: '800', color: '#002970', marginBottom: '8px' }}>
                  Required Application Documents
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {activeSchemeDetail.documents.map((doc, i) => (
                    <div key={i} style={{ fontSize: '0.80rem', color: '#475569', background: '#F8FAFC', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                      • {doc}
                    </div>
                  ))}
                </div>
              </div>

              {/* Process */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.96rem', fontWeight: '800', color: '#002970', marginBottom: '8px' }}>
                  Application &amp; Sanction Roadmap
                </h4>
                <div style={{ fontSize: '0.84rem', color: '#334155', background: '#EFF6FF', padding: '12px 16px', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                  {activeSchemeDetail.process}
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                <a
                  href={activeSchemeDetail.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.80rem', color: '#00BAF2', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}
                >
                  <span>Official Ministry Source</span>
                  <ExternalLink size={13} />
                </a>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      setActiveSchemeDetail(null);
                      navigate('/eligibility');
                    }}
                    style={{ padding: '10px 18px', background: '#F1F5F9', color: '#002970', border: '1px solid #CBD5E1', borderRadius: '8px', fontWeight: '700', fontSize: '0.86rem', cursor: 'pointer' }}
                  >
                    Check Scorecard
                  </button>
                  <button
                    onClick={() => {
                      setActiveSchemeDetail(null);
                      if (onOpenApplyModal) onOpenApplyModal();
                      else navigate('/contact');
                    }}
                    style={{ padding: '10px 22px', background: '#002970', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.86rem', cursor: 'pointer' }}
                  >
                    Apply for Consultancy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
