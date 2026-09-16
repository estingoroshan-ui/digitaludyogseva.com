import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  Sparkles, ShieldCheck, AlertTriangle, CheckCircle2, TrendingUp, 
  IndianRupee, Building2, User, Phone, MapPin, Award, FileText, 
  Download, Printer, Share2, Check, RefreshCw, Calendar, Clock, 
  CreditCard, PieChart, Layers, HelpCircle, ArrowRight, MessageSquare, 
  ThumbsUp, ThumbsDown, Lock, Unlock, PhoneCall
} from 'lucide-react';

export const LeadEligibilityEngine = ({ lead, onSaveToLead }) => {
  const { showToast, cabins } = useApp();

  // 1. Demographics & Personal
  const [applicantName, setApplicantName] = useState(lead?.name || '');
  const [phone, setPhone] = useState(lead?.phone || lead?.mobile || '');
  const [address, setAddress] = useState(lead?.district ? `${lead.district}, ${lead.state || 'Rajasthan'}` : 'Jaipur, Rajasthan');
  const [education, setEducation] = useState('Graduate'); // '8th_Pass', '10th_Pass', '12th_Pass', 'Graduate', 'Post_Graduate', 'Technical_ITI'
  const [dependents, setDependents] = useState(3);
  const [socialCategory, setSocialCategory] = useState('Special'); // 'Special' (Women/SC/ST/OBC/Minority/PH/Ex-Serviceman) | 'General'
  const [locationType, setLocationType] = useState('Rural'); // 'Rural' | 'Urban'

  // 2. Business & Market
  const [businessName, setBusinessName] = useState(lead?.businessName || `${lead?.name || 'Applicant'} Enterprises`);
  const [businessSector, setBusinessSector] = useState('Manufacturing'); // 'Manufacturing' | 'Service' | 'Agro_Processing' | 'Trading'
  const [businessExperienceYears, setBusinessExperienceYears] = useState(4);
  const [locationAdvantage, setLocationAdvantage] = useState(true); // Highway/commercial access
  const [marketingType, setMarketingType] = useState('B2B_Wholesale'); // 'Retail_Local', 'B2B_Wholesale', 'ECommerce_Online', 'Govt_Tender'

  // 3. Financials & Net Worth
  const [applicantMonthlyIncome, setApplicantMonthlyIncome] = useState(45000);
  const [familyAnnualIncome, setFamilyAnnualIncome] = useState(750000);
  const [propertyAssetsValue, setPropertyAssetsValue] = useState(3500000); // House / Land / Commercial
  const [liquidSecuritiesValue, setLiquidSecuritiesValue] = useState(600000); // FD, Insurance surrender value, Mutual funds
  const [totalLiabilities, setTotalLiabilities] = useState(400000); // Existing debt
  const [activeMonthlyEmi, setActiveMonthlyEmi] = useState(12000);

  // 4. CIBIL & Bureau Health
  const [cibilScore, setCibilScore] = useState(742);
  const [dpdHistory, setDpdHistory] = useState('0'); // '0', '30+', '60+', '90+'
  const [hasSettlement, setHasSettlement] = useState(false); // Written off / Settled flag
  const [cibilReportAttached, setCibilReportAttached] = useState(true);

  // 5. Loan Request & Project Cost
  const [requestedProjectCost, setRequestedProjectCost] = useState(2500000); // 25 Lakhs
  const [promoterContribution, setPromoterContribution] = useState(250000); // 10% own equity

  // 6. Chargeable Audit State
  const [auditFeeStatus, setAuditFeeStatus] = useState(lead?.eligibilityAuditFee || 'Paid'); // 'Unpaid', 'Paid', 'Waived'
  const [auditFeeAmount, setAuditFeeAmount] = useState(999);

  // 7. Appointment Booking State
  const [selectedCabinId, setSelectedCabinId] = useState('cabin-01');
  const [appointmentDate, setAppointmentDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [appointmentTime, setAppointmentTime] = useState('11:30 AM');
  const [appointmentType, setAppointmentType] = useState('In-Person Walk-in');

  // Sub-view: 'scorecard' | 'schemes' | 'bank_brief' | 'suggestions'
  const [activeSubTab, setActiveSubTab] = useState('scorecard');

  // Calculations
  const netWorth = (propertyAssetsValue + liquidSecuritiesValue) - totalLiabilities;
  const foirRatio = Math.round((activeMonthlyEmi / (applicantMonthlyIncome || 1)) * 100);

  // Compute Loan Approval Score (0-100)
  let calculatedScore = 50;
  
  // CIBIL weight (30 pts)
  if (cibilScore >= 750) calculatedScore += 30;
  else if (cibilScore >= 700) calculatedScore += 22;
  else if (cibilScore >= 650) calculatedScore += 12;
  else calculatedScore += 0;

  // DPD & Settlement Penalty
  if (hasSettlement) calculatedScore -= 25;
  if (dpdHistory === '90+') calculatedScore -= 20;
  else if (dpdHistory === '60+') calculatedScore -= 12;
  else if (dpdHistory === '30+') calculatedScore -= 6;

  // Net Worth & Security weight (20 pts)
  if (netWorth >= requestedProjectCost) calculatedScore += 20;
  else if (netWorth >= requestedProjectCost * 0.5) calculatedScore += 14;
  else calculatedScore += 6;

  // Experience & Location (15 pts)
  if (businessExperienceYears >= 3) calculatedScore += 8;
  if (locationAdvantage) calculatedScore += 7;

  // FOIR Debt Burden (15 pts)
  if (foirRatio <= 30) calculatedScore += 15;
  else if (foirRatio <= 50) calculatedScore += 8;
  else calculatedScore -= 5;

  // Clamp 0 to 99
  const approvalChance = Math.min(Math.max(calculatedScore, 18), 96);

  // Scheme Calculations
  // PMEGP
  const pmegpMaxCap = businessSector === 'Manufacturing' ? 5000000 : 2000000;
  const pmegpEffectiveCost = Math.min(requestedProjectCost, pmegpMaxCap);
  let pmegpSubsidyPercent = 15;
  let pmegpMarginPercent = 10;
  if (socialCategory === 'Special') {
    pmegpMarginPercent = 5;
    pmegpSubsidyPercent = locationType === 'Rural' ? 35 : 25;
  } else {
    pmegpMarginPercent = 10;
    pmegpSubsidyPercent = locationType === 'Rural' ? 25 : 15;
  }
  const pmegpSubsidyAmount = Math.round(pmegpEffectiveCost * (pmegpSubsidyPercent / 100));
  const pmegpBankLoan = pmegpEffectiveCost - Math.round(pmegpEffectiveCost * (pmegpMarginPercent / 100));

  // Rajasthan MLUPY (Mukhyamantri Laghu Udyog Protsahan Yojana)
  let mlupyInterestSubsidy = 8; // 8% up to 25L, 6% up to 5Cr, 5% up to 10Cr
  if (requestedProjectCost > 50000000) mlupyInterestSubsidy = 5;
  else if (requestedProjectCost > 2500000) mlupyInterestSubsidy = 6;
  const mlupyEffectiveInterest = Math.max(10.5 - mlupyInterestSubsidy, 2.5); // Nominal bank rate 10.5% minus subsidy

  // PMFME (Food Processing)
  const isAgro = businessSector === 'Agro_Processing';
  const pmfmeSubsidyAmount = isAgro ? Math.min(Math.round(requestedProjectCost * 0.35), 1000000) : 0;

  // Mudra Category
  let mudraCategory = 'Tarun (₹5L - ₹10L/₹20L)';
  if (requestedProjectCost <= 50000) mudraCategory = 'Shishu (Up to ₹50,000)';
  else if (requestedProjectCost <= 500000) mudraCategory = 'Kishore (₹50,000 to ₹5 Lakh)';

  // Action Suggestions Generator
  const suggestions = [];
  if (hasSettlement) {
    suggestions.push({
      type: 'critical',
      title: 'Settled/Written-Off Flag Found in CIBIL',
      text: 'बैंक मैनेजर सेटलमेंट फाइल को तत्काल रिजेक्ट कर सकता है। समाधान: संबंधित बैंक से No Dues Certificate (NDC) लेकर सिबिल में सिबिल डिस्प्यूट फाइल करें या परिवार के किसी अन्य सदस्य को मुख्य आवेदक बनाएं।'
    });
  }
  if (cibilScore < 720) {
    suggestions.push({
      type: 'warning',
      title: 'CIBIL Score Needs Improvement (Current: ' + cibilScore + ')',
      text: 'क्रेडिट कार्ड व कंज्यूमर ड्यूज को 30 दिनों में पूर्ण भुगतान करें। स्कोर 720+ होते ही सरकारी बैंक (SBI/PNB) से फाइल तेजी से पास होगी।'
    });
  }
  if (foirRatio > 45) {
    suggestions.push({
      type: 'warning',
      title: 'High Existing EMI Ratio (' + foirRatio + '%)',
      text: 'आपकी आमदनी का बड़ा हिस्सा पुरानी किस्तों में जा रहा है। को-एप्लिकेंट (पत्नी/पिता) की आय जोड़ें ताकि बैंक DSCR और FOIR नॉर्म्स पूरे हो सकें।'
    });
  }
  suggestions.push({
    type: 'recommendation',
    title: 'Recommended Scheme Strategy for Maximum Profit',
    text: `सामान्य कमर्शियल लोन (11.5% ब्याज) की जगह 'राजस्थान MLUPY' या 'PMEGP' में अप्लाई करें। इससे आपको ₹${pmegpSubsidyAmount.toLocaleString('en-IN')} तक की कैपिटल सब्सिडी अथवा ${mlupyInterestSubsidy}% ब्याज की वार्षिक छूट मिलेगी!`
  });
  if (promoterContribution < requestedProjectCost * 0.1) {
    suggestions.push({
      type: 'recommendation',
      title: 'Increase Margin Money to 10%',
      text: 'बैंक को 5% के बजाय 10% मार्जिन दिखाने पर बैंक का भरोसा बढ़ता है और फाइल बिना किसी ऑब्जेक्शन के पहले राउंड में ही पास हो जाती है।'
    });
  }

  const handleSaveData = () => {
    if (onSaveToLead) {
      onSaveToLead({
        eligibilityScore: approvalChance,
        cibilScore,
        netWorth,
        bestScheme: `PMEGP (${pmegpSubsidyPercent}% Subsidy) + MLUPY (${mlupyInterestSubsidy}% Interest Subvention)`,
        subsidyAmount: pmegpSubsidyAmount,
        projectCost: requestedProjectCost,
        bankLoan: pmegpBankLoan,
        auditFeeStatus,
        eligibilityStatus: approvalChance >= 70 ? 'Approved (Prime)' : approvalChance >= 50 ? 'Conditionally Qualified' : 'Needs Repair'
      });
    }
    showToast(`Eligibility Scorecard & Bank Profile saved for ${applicantName}!`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#0b1727' }}>
      
      {/* Top Banner: Eligibility & Underwriting Command */}
      <div style={{
        background: 'linear-gradient(135deg, #070e17 0%, #1e1b4b 50%, #312e81 100%)',
        color: '#fff',
        padding: '20px 24px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-saffron" style={{ fontSize: '0.72rem' }}>
                7-Pillar Credit Underwriting Engine
              </span>
              <span className="badge" style={{ background: auditFeeStatus === 'Paid' ? '#10b981' : '#f59e0b', color: '#fff', fontSize: '0.72rem' }}>
                {auditFeeStatus === 'Paid' ? '✓ Paid Audit Verified' : '⚠ Audit Fee Pending'}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, color: '#fff' }}>
              Loan Eligibility, Scheme Matcher &amp; Bank Brief Dossier
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#cbd5e1' }}>
              Client Credit Profiling • CIBIL &amp; DPD Analysis • Rajasthan &amp; Central Subsidies • Executive Bank Profile
            </p>
          </div>

          {/* Quick Score Capsule */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '14px',
            padding: '12px 20px',
            textAlign: 'center',
            minWidth: '180px'
          }}>
            <div style={{ fontSize: '0.72rem', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
              Sanction Probability
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: approvalChance >= 75 ? '#4ade80' : approvalChance >= 50 ? '#fbbf24' : '#f87171', lineHeight: 1.1 }}>
              {approvalChance}%
            </div>
            <div style={{ fontSize: '0.75rem', color: '#e2e8f0', marginTop: '2px', fontWeight: '600' }}>
              {approvalChance >= 75 ? '★ Prime (High Approval)' : approvalChance >= 50 ? '● Moderate (Conditional)' : '▲ High Risk (Needs Fix)'}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e2e8f0', paddingBottom: '4px', flexWrap: 'wrap' }}>
        {[
          { id: 'scorecard', label: '1. 7-Pillar Underwriting Form & Scorecard', icon: ShieldCheck },
          { id: 'schemes', label: '2. Rajasthan & Central Scheme Matrix', icon: Award },
          { id: 'bank_brief', label: '3. 1-Page Executive Bank Brief Profile', icon: FileText },
          { id: 'suggestions', label: `4. AI Suggestions & Improvements (${suggestions.length})`, icon: Sparkles }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: isActive ? '700' : '600',
                background: isActive ? '#ff6f00' : '#f8fafc',
                color: isActive ? '#fff' : '#475569',
                fontSize: '0.85rem',
                boxShadow: isActive ? '0 4px 12px rgba(255, 111, 0, 0.25)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: 7-PILLAR UNDERWRITING FORM & SCORECARD */}
      {/* ======================================================== */}
      {activeSubTab === 'scorecard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Quick Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div className="card" style={{ padding: '14px 18px', borderLeft: '4px solid #3b82f6' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>CIBIL Bureau Score</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '900', color: cibilScore >= 750 ? '#15803d' : cibilScore >= 680 ? '#b45309' : '#b91c1c' }}>
                {cibilScore} / 900
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                DPD Status: <strong style={{ color: dpdHistory === '0' ? '#15803d' : '#b91c1c' }}>{dpdHistory === '0' ? 'Clean (0 DPD)' : `${dpdHistory} Days Overdue`}</strong>
              </div>
            </div>

            <div className="card" style={{ padding: '14px 18px', borderLeft: '4px solid #10b981' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>Calculated Net Worth</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0b1727' }}>
                ₹{(netWorth / 100000).toFixed(2)} Lakhs
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Assets: ₹{(propertyAssetsValue/100000).toFixed(1)}L | Debt: ₹{(totalLiabilities/100000).toFixed(1)}L
              </div>
            </div>

            <div className="card" style={{ padding: '14px 18px', borderLeft: '4px solid #f59e0b' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>Debt Burden (FOIR)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '900', color: foirRatio <= 40 ? '#15803d' : '#b91c1c' }}>
                {foirRatio}%
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Monthly EMI: ₹{activeMonthlyEmi.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="card" style={{ padding: '14px 18px', borderLeft: '4px solid #ff6f00' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>Max Eligible Subsidy</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#ff6f00' }}>
                ₹{(pmegpSubsidyAmount / 100000).toFixed(2)} Lakhs
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                {pmegpSubsidyPercent}% under PMEGP {locationType}
              </div>
            </div>
          </div>

          {/* Form Sections */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* Left Column: Demographics & CIBIL */}
            <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} color="#ff6f00" />
                Pillar 1 &amp; 4: Applicant &amp; CIBIL Bureau Health
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Applicant Name</label>
                  <input 
                    type="text" 
                    value={applicantName} 
                    onChange={e => setApplicantName(e.target.value)} 
                    className="input input-sm w-full" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Mobile Number</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    className="input input-sm w-full" 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Social Category</label>
                  <select 
                    value={socialCategory} 
                    onChange={e => setSocialCategory(e.target.value)} 
                    className="input input-sm w-full"
                  >
                    <option value="Special">Special (Women / SC / ST / OBC / Ex-Serviceman / PH)</option>
                    <option value="General">General (Male Open Category)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Location Type</label>
                  <select 
                    value={locationType} 
                    onChange={e => setLocationType(e.target.value)} 
                    className="input input-sm w-full"
                  >
                    <option value="Rural">Rural (35% Subsidy Eligible)</option>
                    <option value="Urban">Urban (25% Subsidy Eligible)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Education Level</label>
                  <select 
                    value={education} 
                    onChange={e => setEducation(e.target.value)} 
                    className="input input-sm w-full"
                  >
                    <option value="8th_Pass">8th Class Pass (Eligible up to 10L)</option>
                    <option value="10th_Pass">10th Class Pass</option>
                    <option value="12th_Pass">12th Standard</option>
                    <option value="Graduate">Graduate (Any Stream)</option>
                    <option value="Post_Graduate">Post Graduate / Master</option>
                    <option value="Technical_ITI">Technical / ITI / Diploma</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Dependent Family Members</label>
                  <input 
                    type="number" 
                    value={dependents} 
                    onChange={e => setDependents(Number(e.target.value))} 
                    className="input input-sm w-full" 
                  />
                </div>
              </div>

              {/* CIBIL Analysis Block */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '4px' }}>
                <div className="flex justify-between items-center mb-2">
                  <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0b1727' }}>CIBIL Credit Score</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: '900', color: cibilScore >= 750 ? '#15803d' : '#b91c1c' }}>
                    {cibilScore}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="900" 
                  step="5" 
                  value={cibilScore} 
                  onChange={e => setCibilScore(Number(e.target.value))} 
                  style={{ width: '100%', accentColor: '#ff6f00', cursor: 'pointer' }} 
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">DPD (Late EMI History)</label>
                    <select 
                      value={dpdHistory} 
                      onChange={e => setDpdHistory(e.target.value)} 
                      className="input input-sm w-full"
                    >
                      <option value="0">0 DPD (All EMIs on time)</option>
                      <option value="30+">30+ DPD (Occasional late pay)</option>
                      <option value="60+">60+ DPD (Frequent late pay)</option>
                      <option value="90+">90+ DPD (Critical NPA risk)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Loan Settlement / Written-off?</label>
                    <select 
                      value={hasSettlement ? 'yes' : 'no'} 
                      onChange={e => setHasSettlement(e.target.value === 'yes')} 
                      className="input input-sm w-full"
                      style={{ color: hasSettlement ? '#b91c1c' : '#15803d', fontWeight: '700' }}
                    >
                      <option value="no">No Settlement (Clean Track)</option>
                      <option value="yes">Yes, Settled / Written-off</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Business & Financial Standing */}
            <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} color="#10b981" />
                Pillar 2 &amp; 3: Business Viability &amp; Financial Net Worth
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Proposed Business Name</label>
                  <input 
                    type="text" 
                    value={businessName} 
                    onChange={e => setBusinessName(e.target.value)} 
                    className="input input-sm w-full" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Sector</label>
                  <select 
                    value={businessSector} 
                    onChange={e => setBusinessSector(e.target.value)} 
                    className="input input-sm w-full"
                  >
                    <option value="Manufacturing">Manufacturing (Up to 50L)</option>
                    <option value="Service">Service Desk (Up to 20L)</option>
                    <option value="Agro_Processing">Agro / Food Processing</option>
                    <option value="Trading">Trading / Retail (Mudra)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Marketing / Sales Type</label>
                  <select 
                    value={marketingType} 
                    onChange={e => setMarketingType(e.target.value)} 
                    className="input input-sm w-full"
                  >
                    <option value="B2B_Wholesale">B2B Wholesale / Bulk Supply</option>
                    <option value="Retail_Local">Local Retail Shop Footfall</option>
                    <option value="ECommerce_Online">Online / E-Commerce Channel</option>
                    <option value="Govt_Tender">Government Tender Supply</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Location Advantage?</label>
                  <select 
                    value={locationAdvantage ? 'yes' : 'no'} 
                    onChange={e => setLocationAdvantage(e.target.value === 'yes')} 
                    className="input input-sm w-full"
                  >
                    <option value="yes">Yes (Industrial / Main Highway)</option>
                    <option value="no">No (Interior / Remote)</option>
                  </select>
                </div>
              </div>

              {/* Financial Assets & Debt Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Property Assets (₹)</label>
                  <input 
                    type="number" 
                    value={propertyAssetsValue} 
                    onChange={e => setPropertyAssetsValue(Number(e.target.value))} 
                    className="input input-sm w-full" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Liquid FD / LIC / MF (₹)</label>
                  <input 
                    type="number" 
                    value={liquidSecuritiesValue} 
                    onChange={e => setLiquidSecuritiesValue(Number(e.target.value))} 
                    className="input input-sm w-full" 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Applicant Monthly Income (₹)</label>
                  <input 
                    type="number" 
                    value={applicantMonthlyIncome} 
                    onChange={e => setApplicantMonthlyIncome(Number(e.target.value))} 
                    className="input input-sm w-full" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Active Monthly Loan EMI (₹)</label>
                  <input 
                    type="number" 
                    value={activeMonthlyEmi} 
                    onChange={e => setActiveMonthlyEmi(Number(e.target.value))} 
                    className="input input-sm w-full" 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Total Loan Project Cost (₹)</label>
                  <input 
                    type="number" 
                    value={requestedProjectCost} 
                    onChange={e => setRequestedProjectCost(Number(e.target.value))} 
                    className="input input-sm w-full" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Promoter Margin Ready (₹)</label>
                  <input 
                    type="number" 
                    value={promoterContribution} 
                    onChange={e => setPromoterContribution(Number(e.target.value))} 
                    className="input input-sm w-full" 
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '12px' }}>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '700' }}>
                Chargeable Eligibility Audit:
              </span>
              <select
                value={auditFeeStatus}
                onChange={e => setAuditFeeStatus(e.target.value)}
                className="input input-sm"
                style={{ fontWeight: '700', color: auditFeeStatus === 'Paid' ? '#15803d' : '#b45309' }}
              >
                <option value="Paid">Paid ₹999 (Audit Unlocked)</option>
                <option value="Unpaid">Unpaid (Payment Pending)</option>
                <option value="Waived">Waived (Complimentary VIP)</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveSubTab('schemes')}
                className="btn btn-sm btn-outline"
                style={{ borderColor: '#ff6f00', color: '#ff6f00' }}
              >
                <span>View Scheme Matches</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={handleSaveData}
                className="btn btn-sm btn-primary"
                style={{ background: 'linear-gradient(135deg, #ff6f00, #ea580c)' }}
              >
                <ShieldCheck size={16} />
                <span>Save Scorecard to Lead Dossier</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: RAJASTHAN & CENTRAL GOVERNMENT SCHEMES MATRIX */}
      {/* ======================================================== */}
      {activeSubTab === 'schemes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px 20px' }}>
            <div className="flex items-center gap-2 mb-1">
              <Award size={20} color="#16a34a" />
              <strong style={{ fontSize: '1rem', color: '#166534' }}>
                Matched Government Schemes for {applicantName} (Location: {locationType}, Category: {socialCategory})
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#15803d' }}>
              The engine has evaluated national guidelines and Rajasthan State MSME industrial policies for maximum subsidy lock-in.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            
            {/* 1. Rajasthan MLUPY */}
            <div className="card" style={{ padding: '20px', border: '2px solid #3b82f6', borderRadius: '14px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-10px', right: '16px', background: '#3b82f6', color: '#fff', fontSize: '0.68rem', fontWeight: '800', padding: '2px 10px', borderRadius: '20px' }}>
                RAJASTHAN STATE TOP SCHEME
              </div>
              <h4 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: '800', color: '#1e40af' }}>
                Mukhyamantri Laghu Udyog Protsahan (MLUPY)
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 14px' }}>
                Government of Rajasthan Industry Department interest subvention scheme for manufacturing, service, and trading units.
              </p>
              
              <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '10px', marginBottom: '14px' }}>
                <div className="flex justify-between items-center mb-1">
                  <span style={{ fontSize: '0.8rem', color: '#475569' }}>Eligible Interest Subsidy:</span>
                  <strong style={{ fontSize: '0.95rem', color: '#1e40af' }}>{mlupyInterestSubsidy}% Per Annum</strong>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span style={{ fontSize: '0.8rem', color: '#475569' }}>Nominal Bank Interest:</span>
                  <span style={{ fontSize: '0.85rem' }}>~10.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '700' }}>Effective Net Interest:</span>
                  <strong style={{ fontSize: '1.1rem', color: '#15803d' }}>{mlupyEffectiveInterest}% Only</strong>
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>✓ Loan up to ₹25 Lakh @ 8% subsidy</div>
                <div>✓ Loan up to ₹5 Crore @ 6% subsidy</div>
                <div>✓ Simple online portal clearance via Rajasthan Single Sign-On (SSO)</div>
              </div>
            </div>

            {/* 2. PMEGP (Central KVIC) */}
            <div className="card" style={{ padding: '20px', border: '2px solid #ff6f00', borderRadius: '14px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-10px', right: '16px', background: '#ff6f00', color: '#fff', fontSize: '0.68rem', fontWeight: '800', padding: '2px 10px', borderRadius: '20px' }}>
                CENTRAL GOVT HIGHEST SUBSIDY
              </div>
              <h4 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: '800', color: '#c2410c' }}>
                PMEGP (Prime Minister Employment Generation)
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 14px' }}>
                Ministry of MSME &amp; KVIC flagship credit-linked capital subsidy scheme for new enterprise setup.
              </p>

              <div style={{ background: '#fff7ed', padding: '12px', borderRadius: '10px', marginBottom: '14px' }}>
                <div className="flex justify-between items-center mb-1">
                  <span style={{ fontSize: '0.8rem', color: '#475569' }}>Eligible Subsidy %:</span>
                  <strong style={{ fontSize: '0.95rem', color: '#ea580c' }}>{pmegpSubsidyPercent}% ({locationType})</strong>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span style={{ fontSize: '0.8rem', color: '#475569' }}>Estimated Grant Amount:</span>
                  <strong style={{ fontSize: '1.1rem', color: '#15803d' }}>₹{pmegpSubsidyAmount.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: '0.8rem', color: '#475569' }}>Mandatory Margin:</span>
                  <span style={{ fontSize: '0.85rem' }}>{pmegpMarginPercent}% (₹{Math.round(pmegpEffectiveCost * (pmegpMarginPercent/100)).toLocaleString('en-IN')})</span>
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>✓ Term loan locked in 3-Year Subsidy TDR</div>
                <div>✓ Clean transfer to bank branch without physical collateral requirement</div>
              </div>
            </div>

            {/* 3. Mudra Yojana */}
            <div className="card" style={{ padding: '20px', border: '1px solid #cbd5e1', borderRadius: '14px' }}>
              <h4 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: '800', color: '#0b1727' }}>
                Pradhan Mantri Mudra Yojana (PMMY)
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 14px' }}>
                Collateral-free micro enterprise financing for retail, service, and small commercial traders.
              </p>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', marginBottom: '14px' }}>
                <div className="flex justify-between items-center mb-1">
                  <span style={{ fontSize: '0.8rem', color: '#475569' }}>Matched Category:</span>
                  <strong style={{ fontSize: '0.88rem', color: '#0b1727' }}>{mudraCategory}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: '0.8rem', color: '#475569' }}>Processing:</span>
                  <span style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: '700' }}>Zero Processing Fee</span>
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>✓ Tarun category recently enhanced up to ₹20 Lakhs in Union Budget</div>
                <div>✓ Quick 7-day bank sanction turnaround</div>
              </div>
            </div>

            {/* 4. CGTMSE Collateral-Free */}
            <div className="card" style={{ padding: '20px', border: '1px solid #cbd5e1', borderRadius: '14px' }}>
              <h4 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: '800', color: '#0b1727' }}>
                CGTMSE Credit Guarantee Scheme
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 14px' }}>
                Credit guarantee cover up to ₹5 Crore without third-party guarantee or property mortgage.
              </p>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', marginBottom: '14px' }}>
                <div className="flex justify-between items-center mb-1">
                  <span style={{ fontSize: '0.8rem', color: '#475569' }}>Guarantee Cover:</span>
                  <strong style={{ fontSize: '0.88rem', color: '#0b1727' }}>Up to 85% by Trust</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: '0.8rem', color: '#475569' }}>Property Mortgage:</span>
                  <span style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: '700' }}>Not Required</span>
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>✓ Ideal for applicants with lower immovable property assets</div>
                <div>✓ Supported by all PSUs (SBI, PNB, BOB, Canara Bank)</div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: 1-PAGE EXECUTIVE BANK BRIEF PROFILE */}
      {/* ======================================================== */}
      {activeSubTab === 'bank_brief' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>
                1-Page Executive Bank Brief Dossier
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                Formatted for Bank Branch Manager &amp; Credit Underwriter appraisal
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="btn btn-sm btn-outline"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Printer size={15} />
                <span>Print / Save PDF</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText?.(`BANK BRIEF DOSSIER - ${applicantName}\nProject: ${businessName}\nCost: ₹${requestedProjectCost}\nScore: ${approvalChance}%\nCIBIL: ${cibilScore}\nNet Worth: ₹${netWorth}`);
                  showToast('Bank Brief summary copied to clipboard!');
                }}
                className="btn btn-sm btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0b1727' }}
              >
                <Share2 size={15} />
                <span>Share Brief</span>
              </button>
            </div>
          </div>

          {/* Printable 1-Page Bank Brief Sheet */}
          <div 
            id="printable-bank-brief"
            style={{
              background: '#fff',
              border: '2px solid #0b1727',
              borderRadius: '8px',
              padding: '28px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              fontFamily: 'Inter, sans-serif',
              color: '#0f172a'
            }}
          >
            {/* Bank Sheet Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0b1727', paddingBottom: '14px', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.08em', color: '#ff6f00', textTransform: 'uppercase' }}>
                  Digital Udyog Seva • Credit Appraisal Desk
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '900', margin: '2px 0 0', color: '#0b1727' }}>
                  CONFIDENTIAL EXECUTIVE BANK BRIEF DOSSIER
                </h2>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Reference Code: DUS-BB-{lead?.id || 'LD101'} | Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>

              <div style={{ textAlign: 'right', background: '#f8fafc', padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Target Institution</div>
                <strong style={{ fontSize: '0.95rem', color: '#0b1727' }}>State Bank of India (SBI) / PNB</strong>
                <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: '700' }}>Recommended for Sanction</div>
              </div>
            </div>

            {/* Grid 1: Basic & Business Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', marginBottom: '6px' }}>
                  1. Promoter Profile
                </div>
                <table style={{ width: '100%', fontSize: '0.82rem' }}>
                  <tbody>
                    <tr><td style={{ color: '#64748b', padding: '3px 0' }}>Promoter Name:</td><td><strong>{applicantName}</strong></td></tr>
                    <tr><td style={{ color: '#64748b', padding: '3px 0' }}>Contact / Mobile:</td><td><strong>{phone}</strong></td></tr>
                    <tr><td style={{ color: '#64748b', padding: '3px 0' }}>Education:</td><td><strong>{education}</strong></td></tr>
                    <tr><td style={{ color: '#64748b', padding: '3px 0' }}>Category &amp; Area:</td><td><strong>{socialCategory} ({locationType})</strong></td></tr>
                  </tbody>
                </table>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', marginBottom: '6px' }}>
                  2. Enterprise &amp; Viability
                </div>
                <table style={{ width: '100%', fontSize: '0.82rem' }}>
                  <tbody>
                    <tr><td style={{ color: '#64748b', padding: '3px 0' }}>Enterprise Name:</td><td><strong>{businessName}</strong></td></tr>
                    <tr><td style={{ color: '#64748b', padding: '3px 0' }}>Sector / Activity:</td><td><strong>{businessSector}</strong></td></tr>
                    <tr><td style={{ color: '#64748b', padding: '3px 0' }}>Industry Experience:</td><td><strong>{businessExperienceYears} Years</strong></td></tr>
                    <tr><td style={{ color: '#64748b', padding: '3px 0' }}>Marketing Channel:</td><td><strong>{marketingType}</strong></td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Grid 2: Means of Finance & Project Cost */}
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: '14px 18px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#9a3412', textTransform: 'uppercase', marginBottom: '8px' }}>
                3. Proposed Means of Finance (PMEGP / MLUPY Structuring)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#7c2d12' }}>Total Project Cost</div>
                  <strong style={{ fontSize: '1.1rem', color: '#0b1727' }}>₹{requestedProjectCost.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#7c2d12' }}>Promoter Margin ({pmegpMarginPercent}%)</div>
                  <strong style={{ fontSize: '1.1rem', color: '#ea580c' }}>₹{Math.round(requestedProjectCost * (pmegpMarginPercent/100)).toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#7c2d12' }}>Term Loan Requested</div>
                  <strong style={{ fontSize: '1.1rem', color: '#1e40af' }}>₹{Math.round(requestedProjectCost * 0.65).toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#7c2d12' }}>Working Capital / CC</div>
                  <strong style={{ fontSize: '1.1rem', color: '#15803d' }}>₹{Math.round(requestedProjectCost * 0.25).toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>

            {/* Grid 3: Credit Metrics & Bureau Standing */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>CIBIL Bureau Score</div>
                <strong style={{ fontSize: '1.25rem', color: cibilScore >= 720 ? '#15803d' : '#b91c1c' }}>{cibilScore} / 900</strong>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>DPD: {dpdHistory} Days | Settlement: {hasSettlement ? 'Yes' : 'None'}</div>
              </div>

              <div style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>Total Net Worth</div>
                <strong style={{ fontSize: '1.25rem', color: '#0b1727' }}>₹{(netWorth / 100000).toFixed(2)} Lakhs</strong>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Security Cover: ~{Math.round((netWorth / requestedProjectCost) * 100)}%</div>
              </div>

              <div style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>Estimated DSCR</div>
                <strong style={{ fontSize: '1.25rem', color: '#15803d' }}>1.85 (High Coverage)</strong>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Benchmarked above 1.50 norm</div>
              </div>
            </div>

            {/* Executive Recommendation Footer */}
            <div style={{ borderTop: '2px dashed #cbd5e1', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '0.82rem', color: '#0b1727' }}>Lead Consultant Recommendation:</strong>
                <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                  Applicant satisfies all basic RBI MSME norms. Recommended for immediate login under <strong>PMEGP / MLUPY Scheme</strong>.
                </div>
              </div>

              <div style={{ textAlign: 'right', minWidth: '150px' }}>
                <div style={{ borderBottom: '1px solid #0b1727', width: '130px', margin: '0 0 4px auto' }}></div>
                <div style={{ fontSize: '0.72rem', fontWeight: '700' }}>Senior Credit Analyst</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Digital Udyog Seva Desk #04</div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: AI SUGGESTIONS, IMPROVEMENTS & APPOINTMENT */}
      {/* ======================================================== */}
      {activeSubTab === 'suggestions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ background: '#f8fafc', padding: '18px 22px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#ff6f00" />
              Actionable AI Recommendations for 100% Loan Sanction
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
              These suggestions help the applicant rectify profile deficiencies before the bank manager raises an objection.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {suggestions.map((sug, idx) => (
              <div 
                key={idx}
                style={{
                  background: sug.type === 'critical' ? '#fef2f2' : sug.type === 'warning' ? '#fffbeb' : '#f0fdf4',
                  borderLeft: `5px solid ${sug.type === 'critical' ? '#dc2626' : sug.type === 'warning' ? '#f59e0b' : '#16a34a'}`,
                  borderRadius: '8px',
                  padding: '16px 20px'
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  {sug.type === 'critical' ? (
                    <AlertTriangle size={18} color="#dc2626" />
                  ) : sug.type === 'warning' ? (
                    <AlertTriangle size={18} color="#f59e0b" />
                  ) : (
                    <CheckCircle2 size={18} color="#16a34a" />
                  )}
                  <strong style={{ fontSize: '0.95rem', color: '#0b1727' }}>
                    {sug.title}
                  </strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: '1.5' }}>
                  {sug.text}
                </p>
              </div>
            ))}
          </div>

          {/* Cabin Consultant Appointment Booking */}
          <div className="card" style={{ padding: '22px', border: '1px solid #fed7aa', background: 'linear-gradient(135deg, #fffaf5, #fff)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={20} color="#ff6f00" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: '#0b1727' }}>
                Schedule Cabin Consultant In-Person / Video Meeting
              </h3>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#64748b' }}>
              Book an appointment with specialized officers at DUS Business Hub Cabins (Cabin #01 Feasibility, #03 Subsidy, #04 Banking Liaison).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Select Cabin &amp; Head</label>
                <select 
                  value={selectedCabinId} 
                  onChange={e => setSelectedCabinId(e.target.value)} 
                  className="input input-sm w-full"
                >
                  <option value="cabin-01">Cabin #01: Business Feasibility Desk (Dr. R. K. Saxena)</option>
                  <option value="cabin-03">Cabin #03: Govt Schemes &amp; Subsidy (Vikramaditya Rathore)</option>
                  <option value="cabin-04">Cabin #04: Banking Liaison Desk (Sunil Manchanda - Ex-SBI)</option>
                  <option value="cabin-02">Cabin #02: Legal &amp; CA/CS Documentation</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Date</label>
                <input 
                  type="date" 
                  value={appointmentDate} 
                  onChange={e => setAppointmentDate(e.target.value)} 
                  className="input input-sm w-full" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Time Slot</label>
                <select 
                  value={appointmentTime} 
                  onChange={e => setAppointmentTime(e.target.value)} 
                  className="input input-sm w-full"
                >
                  <option value="10:30 AM">10:30 AM - Morning Slot</option>
                  <option value="11:30 AM">11:30 AM - Morning Slot</option>
                  <option value="02:30 PM">02:30 PM - Post Lunch</option>
                  <option value="04:00 PM">04:00 PM - Evening Slot</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Meeting Mode</label>
                <select 
                  value={appointmentType} 
                  onChange={e => setAppointmentType(e.target.value)} 
                  className="input input-sm w-full"
                >
                  <option value="In-Person Walk-in">In-Person Cabin Visit</option>
                  <option value="Google Meet Video">Google Meet Video Call</option>
                  <option value="Telephonic Consultation">Phone Consultation</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  showToast(`Appointment confirmed for ${applicantName} on ${appointmentDate} at ${appointmentTime}!`);
                }}
                className="btn btn-sm btn-primary"
                style={{ background: 'linear-gradient(135deg, #ff6f00, #ea580c)', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Calendar size={15} />
                <span>Confirm Appointment &amp; Send Calendar Invite</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
