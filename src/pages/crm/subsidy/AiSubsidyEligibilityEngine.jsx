import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  Sparkles, 
  Banknote, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Calculator, 
  FileText, 
  Send, 
  IndianRupee, 
  Building2, 
  Check, 
  Info,
  Layers,
  Award
} from 'lucide-react';

export const AiSubsidyEligibilityEngine = () => {
  const { addLead, addLoanCase, showToast, setActiveView, setCrmSection } = useApp();

  // Inputs
  const [projectCost, setProjectCost] = useState(2500000); // 25 Lakh default
  const [sector, setSector] = useState('Manufacturing'); // 'Manufacturing' | 'Service'
  const [socialCategory, setSocialCategory] = useState('Special'); // 'Special' (Women/SC/ST/OBC/Minority/PH) | 'General'
  const [location, setLocation] = useState('Rural'); // 'Rural' | 'Urban'
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [businessName, setBusinessName] = useState('');

  // AI Calculations according to KVIC PMEGP guidelines
  // Max project cost: Manufacturing 50 Lakh, Service 20 Lakh
  const maxProjectCap = sector === 'Manufacturing' ? 5000000 : 2000000;
  const effectiveCost = Math.min(projectCost, maxProjectCap);

  let subsidyPercentage = 15;
  let promoterContributionPercent = 10;

  if (socialCategory === 'Special') {
    promoterContributionPercent = 5;
    if (location === 'Rural') {
      subsidyPercentage = 35;
    } else {
      subsidyPercentage = 25;
    }
  } else {
    // General
    promoterContributionPercent = 10;
    if (location === 'Rural') {
      subsidyPercentage = 25;
    } else {
      subsidyPercentage = 15;
    }
  }

  const subsidyAmount = Math.round(effectiveCost * (subsidyPercentage / 100));
  const promoterOwnMoney = Math.round(effectiveCost * (promoterContributionPercent / 100));
  const bankLoanAmount = effectiveCost - promoterOwnMoney;
  const termLoanSplit = Math.round(bankLoanAmount * 0.7);
  const workingCapitalSplit = Math.round(bankLoanAmount * 0.3);

  const handleRegisterAndDispatch = (e) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone) {
      showToast('Please enter Applicant Name and Mobile Number', 'error');
      return;
    }

    const newCase = addLoanCase({
      applicantName,
      applicantPhone,
      businessName: businessName || `${applicantName} Enterprises`,
      scheme: `PMEGP (${subsidyPercentage}% Subsidy)`,
      projectCost: effectiveCost,
      loanAmount: bankLoanAmount,
      subsidyEligible: subsidyAmount,
      promoterEquity: promoterOwnMoney,
      targetBank: 'State Bank of India (SBI)',
      stage: 'Eligibility Approved',
      deskNotes: `Auto-qualified by AI Engine: ${subsidyPercentage}% Subsidy (₹${subsidyAmount.toLocaleString('en-IN')}) under ${location} ${socialCategory} category.`
    });

    showToast(`Case #${newCase.id} created and dispatched to Cabin #01 (Consulting) & Cabin #03 (Govt Subsidy)!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #070e17 0%, #1e1b4b 50%, #4338ca 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '30px',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: 'var(--shadow-xl)'
      }}>
        <div className="flex items-center gap-3 mb-3">
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'linear-gradient(135deg, #ff6f00, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', color: '#fff', margin: 0, fontWeight: 800 }}>
              AI Government Subsidy &amp; Bank Eligibility Engine
            </h1>
            <p style={{ color: '#c7d2fe', fontSize: '0.88rem', margin: 0, marginTop: '2px' }}>
              Instant Subsidy Calculator for PMEGP (up to 35%), Mudra, Stand-Up India &amp; Automated Bank Document Checklist
            </p>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.15fr 1fr', gap: '24px', alignItems: 'flex-start' }}>
        {/* Left: Input Form */}
        <div style={{ background: '#fff', padding: '28px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--navy-950)', marginBottom: '18px' }}>
            Enter Project &amp; Applicant Criteria
          </h2>

          {/* Project Cost Slider */}
          <div style={{ marginBottom: '22px' }}>
            <div className="flex items-center justify-between mb-2">
              <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--slate-700)' }}>
                Total Project Cost (Machinery + Civil + Working Capital)
              </label>
              <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ff6f00', fontFamily: 'var(--font-mono)' }}>
                ₹{(effectiveCost / 100000).toFixed(2)} Lakh
              </span>
            </div>
            <input 
              type="range" 
              min="200000" 
              max="5000000" 
              step="50000"
              value={effectiveCost}
              onChange={(e) => setProjectCost(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#ff6f00', cursor: 'pointer' }}
            />
            <div className="flex items-center justify-between mt-1" style={{ fontSize: '0.75rem', color: '#64748b' }}>
              <span>₹2 Lakh</span>
              <span>₹25 Lakh (Avg)</span>
              <span>₹50 Lakh (Max PMEGP)</span>
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>
                Industry Sector
              </label>
              <select 
                className="form-control"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
              >
                <option value="Manufacturing">Manufacturing (Max ₹50 Lakh)</option>
                <option value="Service">Service / Trading (Max ₹20 Lakh)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>
                Location of Proposed Unit
              </label>
              <select 
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="Rural">Rural / Gram Panchayat (Highest Subsidy)</option>
                <option value="Urban">Urban / Municipal Area</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>
              Beneficiary Category (For Subsidy Percentage)
            </label>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSocialCategory('Special')}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: `2px solid ${socialCategory === 'Special' ? '#ff6f00' : 'var(--slate-200)'}`,
                  background: socialCategory === 'Special' ? '#fff7ed' : '#fff',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '0.88rem', fontWeight: '800', color: socialCategory === 'Special' ? '#c2410c' : 'var(--navy-900)' }}>
                  Special Category (35%)
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                  Women, SC, ST, OBC, Minority, Ex-Servicemen, PH
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSocialCategory('General')}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: `2px solid ${socialCategory === 'General' ? '#ff6f00' : 'var(--slate-200)'}`,
                  background: socialCategory === 'General' ? '#fff7ed' : '#fff',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '0.88rem', fontWeight: '800', color: socialCategory === 'General' ? '#c2410c' : 'var(--navy-900)' }}>
                  General Category
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                  General Male (25% Rural, 15% Urban)
                </div>
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--slate-100)', paddingTop: '18px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--navy-950)', marginBottom: '12px' }}>
              Client Dispatch Details
            </h3>

            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Applicant Full Name *"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  required
                />
              </div>

              <div>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Mobile Phone Number *"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <input 
                type="text" 
                className="form-control"
                placeholder="Proposed Enterprise Name (e.g. Balaji Agro & Food Processing)"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>

            <button 
              type="button"
              onClick={handleRegisterAndDispatch}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
            >
              <Send size={16} />
              <span>Create File &amp; Dispatch to Cabin #01 &amp; #03</span>
            </button>
          </div>
        </div>

        {/* Right: AI Output Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Highlight Card */}
          <div style={{
            background: 'linear-gradient(135deg, #0b1727 0%, #1e293b 100%)',
            color: '#fff',
            borderRadius: 'var(--radius-xl)',
            padding: '28px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <div className="flex items-center justify-between mb-3">
              <span className="badge badge-saffron" style={{ fontSize: '0.78rem' }}>
                AI Verified Scheme Match
              </span>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>PMEGP / KVIC Govt Portal</span>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>
              Eligible Government Capital Subsidy:
            </div>
            <div style={{ fontSize: '2.8rem', fontWeight: '800', color: '#4ade80', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
              {subsidyPercentage}%
              <span style={{ fontSize: '1.4rem', color: '#fff', marginLeft: '10px' }}>
                (₹{subsidyAmount.toLocaleString('en-IN')})
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px' }}>
              Directly credited by KVIC as non-refundable subsidy locked in 3-year TDR
            </div>

            {/* Financial Split Grid */}
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '18px' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Promoter Margin ({promoterContributionPercent}%)</div>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffa726', fontFamily: 'var(--font-mono)' }}>
                  ₹{promoterOwnMoney.toLocaleString('en-IN')}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Bank Loan Sanction</div>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
                  ₹{bankLoanAmount.toLocaleString('en-IN')}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Term Loan (Machinery)</div>
                <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                  ₹{termLoanSplit.toLocaleString('en-IN')}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Working Capital (Cash Credit)</div>
                <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                  ₹{workingCapitalSplit.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* Document Checklist */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--navy-950)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#ff6f00" />
              <span>Auto-Generated Bank &amp; DIC Document Checklist</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Aadhaar Card & PAN Card (Linked with mobile OTP)',
                'Educational Certificate / 8th Pass Marksheet',
                socialCategory === 'Special' ? 'Category / Caste Certificate (OBC/SC/ST/Women proof)' : 'Resident Certificate / Domicile Proof',
                'Rural Area Certificate signed by Sarpanch / Gram Sevak',
                'Detailed Project Report (DPR) with 5-year CMA financial projections',
                'Proforma Invoice / Technical Machinery Quotation with GSTIN',
                'Rent Agreement / Land Ownership Registry of the unit',
                'EDP Training Certificate (2-day online portal module)'
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center gap-2" style={{ fontSize: '0.82rem', color: 'var(--slate-700)' }}>
                  <CheckCircle2 size={15} color="#16a34a" style={{ flexShrink: 0 }} />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
