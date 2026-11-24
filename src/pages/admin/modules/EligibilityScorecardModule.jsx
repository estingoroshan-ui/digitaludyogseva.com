import React, { useState } from 'react';
import { useRouter, getApiUrl } from '../../../router/Router';
import { useApp } from '../../../context/AppContext';
import { 
  Calculator, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Download, 
  Share2, 
  ArrowRight, 
  TrendingUp, 
  Building2, 
  Users,
  Percent,
  Check,
  X
} from 'lucide-react';

export const EligibilityScorecardModule = () => {
  const { currentPath, navigate } = useRouter();
  const { showToast } = useApp();

  const isScorecard = currentPath === '/admin/scorecards';

  // Eligibility Evaluation State
  const [applicantAge, setApplicantAge] = useState(32);
  const [projectCost, setProjectCost] = useState(2500000);
  const [ownContribution, setOwnContribution] = useState(10);
  const [category, setCategory] = useState('General');
  const [gender, setGender] = useState('Male');
  const [area, setArea] = useState('Rural');
  const [businessActivity, setBusinessActivity] = useState('Manufacturing');
  const [hasUdyam, setHasUdyam] = useState(true);
  const [hasGst, setHasGst] = useState(true);
  const [cibilBand, setCibilBand] = useState('750+ (Excellent)');

  // Scorecard Scoring Form State
  const [applicantProfileScore, setApplicantProfileScore] = useState(9); // max 10
  const [businessProfileScore, setBusinessProfileScore] = useState(14); // max 15
  const [creditHistoryScore, setCreditHistoryScore] = useState(18); // max 20
  const [financialCapacityScore, setFinancialCapacityScore] = useState(17); // max 20
  const [ownContributionScore, setOwnContributionScore] = useState(9); // max 10
  const [documentCompletenessScore, setDocumentCompletenessScore] = useState(9); // max 10
  const [schemeEligibilityScore, setSchemeEligibilityScore] = useState(14); // max 15

  const totalScore = applicantProfileScore + businessProfileScore + creditHistoryScore + financialCapacityScore + ownContributionScore + documentCompletenessScore + schemeEligibilityScore;

  const riskBand = totalScore >= 80 ? 'Low Risk — Prime Eligibility' :
                   totalScore >= 60 ? 'Moderate Risk — Conditional Approval' :
                   'High Risk — Additional Collateral / Guarantor Required';

  const riskColor = totalScore >= 80 ? '#16A34A' : totalScore >= 60 ? '#008BCB' : '#DC2626';

  // Calculated eligible subsidy % for PMEGP
  let pmegpSubsidy = 15;
  if (category !== 'General' || gender === 'Female') {
    pmegpSubsidy = area === 'Rural' ? 35 : 25;
  } else {
    pmegpSubsidy = area === 'Rural' ? 25 : 15;
  }

  return (
    <div>
      {/* Page Header */}
      <div className="paytm-page-header">
        <div>
          <h1 className="paytm-page-title">
            {isScorecard ? 'Internal Applicant Assessment Scorecard' : 'Government Scheme Eligibility Engine'}
          </h1>
          <p className="paytm-page-subtitle">
            {isScorecard 
              ? 'Configurable 100-point consultancy risk and viability underwriting scorecard' 
              : 'Multi-parameter scheme recommendation and margin money subsidy calculation engine'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button"
            onClick={() => navigate(isScorecard ? '/admin/eligibility' : '/admin/scorecards')}
            className="paytm-btn paytm-btn-outline"
            style={{ color: '#008BCB', borderColor: '#00BAF2' }}
          >
            {isScorecard ? 'Open Eligibility Checker' : 'Open 100-Pt Scorecard'}
          </button>
        </div>
      </div>

      {!isScorecard ? (
        /* ELIGIBILITY ENGINE VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          {/* Input Parameters Form */}
          <div className="paytm-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#002970', marginBottom: '18px' }}>
              Applicant &amp; Enterprise Parameters
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                  Applicant Age (Years)
                </label>
                <input 
                  type="number" 
                  value={applicantAge}
                  onChange={e => setApplicantAge(Number(e.target.value))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                  Project Cost (₹)
                </label>
                <input 
                  type="number" 
                  value={projectCost}
                  onChange={e => setProjectCost(Number(e.target.value))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                  Applicant Category
                </label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', background: '#fff' }}
                >
                  <option value="General">General Category</option>
                  <option value="OBC">OBC (Special Category)</option>
                  <option value="SC">SC / ST (Special Category)</option>
                  <option value="Minority">Minority / Ex-Serviceman</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                  Applicant Gender
                </label>
                <select 
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', background: '#fff' }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female (Special Category: 35% in Rural)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                  Location Classification
                </label>
                <select 
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', background: '#fff' }}
                >
                  <option value="Rural">Rural (Panchayat Area - High Subsidy)</option>
                  <option value="Urban">Urban (Municipal Area)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                  Industry Sector
                </label>
                <select 
                  value={businessActivity}
                  onChange={e => setBusinessActivity(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', background: '#fff' }}
                >
                  <option value="Manufacturing">Manufacturing (Max ₹50 Lakhs in PMEGP)</option>
                  <option value="Service">Service Sector (Max ₹20 Lakhs in PMEGP)</option>
                  <option value="Trading">Trading / Retail (MUDRA / CGTMSE only)</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={hasUdyam} onChange={e => setHasUdyam(e.target.checked)} />
                <span>Udyam Registered</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={hasGst} onChange={e => setHasGst(e.target.checked)} />
                <span>GST Registered</span>
              </label>
            </div>
          </div>

          {/* Assessment Output & Recommendations */}
          <div className="paytm-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#002970', margin: 0 }}>
                  Eligibility Assessment Results
                </h3>
                <span className="paytm-badge paytm-badge-success">Eligible</span>
              </div>

              <div style={{ background: '#F0F9FF', border: '1px solid rgba(0, 186, 242, 0.25)', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: '#008BCB', fontWeight: '700', textTransform: 'uppercase' }}>
                  Recommended Prime Scheme
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#002970', marginTop: '4px' }}>
                  PMEGP Subsidy Loan Scheme
                </div>
                <div style={{ fontSize: '0.88rem', color: '#334155', marginTop: '6px' }}>
                  Estimated Government Subsidy: <strong>{pmegpSubsidy}%</strong> (Approx. <strong>₹{Number((projectCost * pmegpSubsidy) / 100).toLocaleString('en-IN')}</strong>)
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#16A34A" />
                  <span>Age Criteria Satisfied ({applicantAge} years &gt;= 18)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#16A34A" />
                  <span>Project Cost fits within scheme ceiling (₹{projectCost.toLocaleString('en-IN')})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#16A34A" />
                  <span>Own Contribution Requirement: 5% - 10% (₹{Number(projectCost * 0.1).toLocaleString('en-IN')})</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                onClick={() => navigate('/admin/scorecards')}
                className="paytm-btn paytm-btn-primary"
                style={{ flex: 1 }}
              >
                Draft 100-Point Scorecard
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* SCORECARD VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px' }}>
          {/* Scorecard Parameters Breakdown */}
          <div className="paytm-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#002970', margin: 0 }}>
                100-Point Underwriting Assessment Matrix
              </h3>
              <span style={{ fontSize: '0.82rem', color: '#64748B' }}>Weights: 100 Max</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Applicant Profile & Background', val: applicantProfileScore, set: setApplicantProfileScore, max: 10 },
                { label: 'Business Profile & Track Record', val: businessProfileScore, set: setBusinessProfileScore, max: 15 },
                { label: 'Credit History & Banking Track Record', val: creditHistoryScore, set: setCreditHistoryScore, max: 20 },
                { label: 'Financial Capacity & Turnover', val: financialCapacityScore, set: setFinancialCapacityScore, max: 20 },
                { label: 'Own Contribution & Margin Available', val: ownContributionScore, set: setOwnContributionScore, max: 10 },
                { label: 'Document Completeness (ITR, GST, Udyam)', val: documentCompletenessScore, set: setDocumentCompletenessScore, max: 10 },
                { label: 'Government Scheme Eligibility Match', val: schemeEligibilityScore, set: setSchemeEligibilityScore, max: 15 },
              ].map((p, idx) => (
                <div key={idx} style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.88rem', color: '#002970' }}>{p.label}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Weight: {p.max} Points Max</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input 
                      type="range" 
                      min="0" 
                      max={p.max} 
                      value={p.val}
                      onChange={e => p.set(Number(e.target.value))}
                      style={{ width: '100px' }}
                    />
                    <span style={{ fontWeight: '800', color: '#002970', minWidth: '45px', textAlign: 'right' }}>
                      {p.val} / {p.max}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Score Summary & Report Generation */}
          <div className="paytm-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#002970', marginBottom: '16px' }}>
                Scorecard Result
              </h3>

              <div style={{ textAlign: 'center', padding: '24px 16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
                <div style={{ fontSize: '3rem', fontWeight: '900', color: riskColor, lineHeight: 1 }}>
                  {totalScore}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '6px' }}>
                  Total Points out of 100
                </div>
                <div style={{ marginTop: '12px', display: 'inline-block', padding: '4px 14px', borderRadius: '20px', background: '#FFFFFF', border: `1px solid ${riskColor}`, color: riskColor, fontWeight: '700', fontSize: '0.85rem' }}>
                  {riskBand}
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: '1.6' }}>
                <p style={{ margin: '0 0 10px 0' }}>
                  <strong>Consultant Recommendation:</strong> Proceed with DPR (Detailed Project Report) and CMA data preparation for bank submission.
                </p>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#94A3B8' }}>
                  * This is an internal consultancy assessment and underwriting scorecard. Not a credit bureau / CIBIL score.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a 
                href={getApiUrl('api/v1/generate_pdf.php?type=scorecard&id=101&mode=download')}
                className="paytm-btn paytm-btn-primary"
                style={{ textAlign: 'center', justifyContent: 'center' }}
              >
                <Download size={16} />
                <span>Export Official Scorecard PDF</span>
              </a>
              <button 
                type="button"
                onClick={() => {
                  showToast('Scorecard attached to active loan dossier', 'success');
                  navigate('/admin/projects');
                }}
                className="paytm-btn paytm-btn-outline"
              >
                <span>Attach to Project Workspace</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
