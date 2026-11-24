import React, { useState } from 'react';
import { useRouter, getApiUrl } from '../router/Router';
import { useApp } from '../context/AppContext';
import { 
  Calculator, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  Building2, 
  Percent, 
  Banknote,
  Send
} from 'lucide-react';

export const EligibilityWizardPage = ({ onOpenApplyModal }) => {
  const { navigate } = useRouter();
  const { showToast } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [wizardData, setWizardData] = useState({
    // Step 1: Personal
    fullName: '',
    mobile: '',
    email: '',
    gender: 'Male',
    socialCategory: 'Special', // 'General' | 'Special' (Women, SC/ST, OBC, Minority)
    state: 'Rajasthan',
    district: 'Jaipur',
    location: 'Rural', // 'Rural' | 'Urban'

    // Step 2: Business & Project
    businessName: '',
    businessType: 'Manufacturing',
    industry: 'Agro & Food Processing',
    stage: 'New Enterprise',
    projectCost: 2500000,
    requiredLoan: 2250000,
    ownContribution: 250000,

    // Step 3: Existing Compliance
    hasUdyam: 'No',
    hasGst: 'No',
    hasPan: 'Yes',
    educationLevel: 'Graduate',
    hasDefaulterHistory: 'No',

    // Consent
    consent: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);

  // Calculate Eligibility Score and Matched Schemes
  const calculateResult = () => {
    let score = 50;

    // Location & Category points
    if (wizardData.location === 'Rural') score += 15;
    if (wizardData.socialCategory === 'Special') score += 15;
    if (wizardData.hasDefaulterHistory === 'No') score += 10;
    if (wizardData.educationLevel === 'Graduate' || wizardData.educationLevel === 'Post Graduate') score += 10;

    score = Math.min(100, score);

    // Subsidy rate
    let subsidyRate = '15%';
    let subsidyScheme = 'PMEGP (Urban General)';
    if (wizardData.location === 'Rural' && wizardData.socialCategory === 'Special') {
      subsidyRate = '35%';
      subsidyScheme = 'PMEGP Rural Special (Maximum Grant)';
    } else if (wizardData.location === 'Rural') {
      subsidyRate = '25%';
      subsidyScheme = 'PMEGP Rural General';
    } else if (wizardData.socialCategory === 'Special') {
      subsidyRate = '25%';
      subsidyScheme = 'PMEGP Urban Special';
    }

    const estimatedGrant = Math.round(wizardData.projectCost * (parseInt(subsidyRate) / 100));

    return {
      score,
      subsidyRate,
      subsidyScheme,
      estimatedGrant,
      sanctionProbability: score >= 80 ? 'High (85%+ Probability)' : 'Moderate (Eligible with DPR Alignment)',
      matchedSchemes: [
        { name: 'PMEGP Capital Subsidy', benefit: `${subsidyRate} Government Grant (Approx. ₹${(estimatedGrant / 100000).toFixed(2)} Lakhs)` },
        { name: 'CGTMSE Sovereign Guarantee', benefit: 'Eligible for 75%-85% Collateral-Free Bank Guarantee' },
        { name: 'State Interest Subvention', benefit: `Eligible for 5% to 8% state interest subsidy in ${wizardData.state}` }
      ]
    };
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!wizardData.fullName.trim() || !wizardData.mobile.trim()) {
        showToast('Please enter your full name and mobile number', 'error');
        return;
      }
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFinalSubmit = async () => {
    const result = calculateResult();
    setAssessmentResult(result);

    setIsSubmitting(true);
    try {
      const payload = {
        name: wizardData.fullName,
        phone: wizardData.mobile,
        email: wizardData.email,
        lead_value: `₹${(wizardData.projectCost / 100000).toFixed(1)} Lakhs`,
        source_detail: `Smart Wizard (${result.score} Pts): ${wizardData.businessType} in ${wizardData.state} (${result.subsidyRate} Subsidy)`
      };

      await fetch(getApiUrl('api/v1/leads.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      showToast('Assessment recorded! Matched schemes generated.', 'success');
    } catch (e) {
      // Ignore network errors on local
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ background: '#F4F8FC', minHeight: '100vh', padding: '36px 0 60px 0' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Accredited Eligibility Engine
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#002970', margin: '6px 0 8px 0' }}>
            Smart Government Scheme &amp; Loan Eligibility Assessment
          </h1>
          <p style={{ fontSize: '0.90rem', color: '#64748B', margin: 0 }}>
            Complete the 4-step parameter check to calculate your sanction score, government capital subsidy, and verified scheme matches.
          </p>
        </div>

        {/* Wizard Container */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(0, 41, 112, 0.06)', overflow: 'hidden' }}>
          
          {/* Stepper Progress Bar */}
          {!assessmentResult && (
            <div style={{ background: '#001B48', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {[
                { s: 1, title: 'Personal Details' },
                { s: 2, title: 'Project & Investment' },
                { s: 3, title: 'Compliance & CIBIL' },
                { s: 4, title: 'Final Review' }
              ].map((st) => (
                <div key={st.s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: currentStep === st.s ? '#00BAF2' : currentStep > st.s ? '#16A34A' : 'rgba(255,255,255,0.2)',
                    color: currentStep === st.s ? '#001B48' : '#FFFFFF',
                    fontWeight: '800',
                    fontSize: '0.80rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {currentStep > st.s ? '✓' : st.s}
                  </div>
                  <span className="hidden-mobile" style={{ fontSize: '0.80rem', fontWeight: '600', color: currentStep >= st.s ? '#FFFFFF' : '#94A3B8' }}>
                    {st.title}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Result View */}
          {assessmentResult ? (
            <div style={{ padding: '36px 32px' }}>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #DCFCE7 0%, #BBF7D0 100%)',
                  border: '3px solid #16A34A',
                  color: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  fontSize: '1.75rem',
                  fontWeight: '900'
                }}>
                  {assessmentResult.score}
                </div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#002970', margin: '0 0 6px 0' }}>
                  Overall Sanction Viability: {assessmentResult.score}/100
                </h3>
                <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#16A34A', background: '#DCFCE7', padding: '4px 14px', borderRadius: '20px' }}>
                  {assessmentResult.sanctionProbability}
                </span>
              </div>

              {/* Key Entitlements */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Primary Matched Scheme</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#002970' }}>{assessmentResult.subsidyScheme}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Government Capital Grant</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#16A34A' }}>{assessmentResult.subsidyRate} Subsidy</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Estimated Subsidy Credit</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#002970' }}>₹{(assessmentResult.estimatedGrant / 100000).toFixed(2)} Lakhs</div>
                </div>
              </div>

              {/* Matched Schemes List */}
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ fontSize: '1.02rem', fontWeight: '800', color: '#002970', marginBottom: '12px' }}>
                  Matched Funding Programs &amp; Sovereign Guarantees
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {assessmentResult.matchedSchemes.map((sch, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#FFFFFF', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <CheckCircle2 size={18} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ fontSize: '0.90rem', color: '#002970' }}>{sch.name}</strong>
                        <div style={{ fontSize: '0.80rem', color: '#64748B' }}>{sch.benefit}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenApplyModal) onOpenApplyModal();
                    else navigate('/contact');
                  }}
                  style={{ padding: '12px 28px', background: '#002970', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '0.92rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Send size={16} />
                  <span>Book Formal DPR Consultation</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAssessmentResult(null)}
                  style={{ padding: '12px 20px', background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '8px', fontWeight: '600', fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  Recalculate
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '32px' }}>
              
              {/* STEP 1: PERSONAL DETAILS */}
              {currentStep === 1 && (
                <div>
                  <h3 style={{ fontSize: '1.20rem', fontWeight: '800', color: '#002970', marginBottom: '16px' }}>
                    Step 1: Promoter &amp; Location Details
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={wizardData.fullName}
                        onChange={(e) => setWizardData({ ...wizardData, fullName: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile number"
                        value={wizardData.mobile}
                        onChange={(e) => setWizardData({ ...wizardData, mobile: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>Social Category (Govt Subsidy)</label>
                      <select
                        value={wizardData.socialCategory}
                        onChange={(e) => setWizardData({ ...wizardData, socialCategory: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem', background: '#FFFFFF' }}
                      >
                        <option value="Special">Special (Women, SC/ST, OBC, Minority)</option>
                        <option value="General">General Category</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>Proposed Location</label>
                      <select
                        value={wizardData.location}
                        onChange={(e) => setWizardData({ ...wizardData, location: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem', background: '#FFFFFF' }}
                      >
                        <option value="Rural">Rural Area (Gram Panchayat - 35% Grant)</option>
                        <option value="Urban">Urban Municipality (15%-25% Grant)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>State</label>
                      <select
                        value={wizardData.state}
                        onChange={(e) => setWizardData({ ...wizardData, state: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem', background: '#FFFFFF' }}
                      >
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi NCR">Delhi NCR</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: PROJECT & INVESTMENT */}
              {currentStep === 2 && (
                <div>
                  <h3 style={{ fontSize: '1.20rem', fontWeight: '800', color: '#002970', marginBottom: '16px' }}>
                    Step 2: Business &amp; Investment Details
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>Business Sector</label>
                      <select
                        value={wizardData.businessType}
                        onChange={(e) => setWizardData({ ...wizardData, businessType: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem', background: '#FFFFFF' }}
                      >
                        <option value="Manufacturing">Manufacturing (Max ₹50L in PMEGP)</option>
                        <option value="Service">Service Sector (Max ₹20L in PMEGP)</option>
                        <option value="Trading">Trading &amp; Retail (Mudra Scheme)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>Enterprise Stage</label>
                      <select
                        value={wizardData.stage}
                        onChange={(e) => setWizardData({ ...wizardData, stage: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem', background: '#FFFFFF' }}
                      >
                        <option value="New Enterprise">New Setup (Fresh Loan &amp; Subsidy)</option>
                        <option value="Existing Enterprise">Existing Expansion (2nd PMEGP / CGTMSE)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>Total Project Cost (Plant, Machinery &amp; Working Capital)</label>
                    <select
                      value={wizardData.projectCost}
                      onChange={(e) => setWizardData({ ...wizardData, projectCost: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem', background: '#FFFFFF' }}
                    >
                      <option value={1000000}>₹10,00,000 (Mudra / Micro)</option>
                      <option value={2500000}>₹25,00,000 (PMEGP Standard)</option>
                      <option value={5000000}>₹50,00,000 (PMEGP Max Mfg)</option>
                      <option value={10000000}>₹1,00,00,000 (CGTMSE / 2nd PMEGP)</option>
                      <option value={20000000}>₹2,00,00,000+ (MSME Industrial Project)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 3: COMPLIANCE & ELIGIBILITY */}
              {currentStep === 3 && (
                <div>
                  <h3 style={{ fontSize: '1.20rem', fontWeight: '800', color: '#002970', marginBottom: '16px' }}>
                    Step 3: Statutory Readiness &amp; Credit Norms
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>Minimum Education Qualification</label>
                      <select
                        value={wizardData.educationLevel}
                        onChange={(e) => setWizardData({ ...wizardData, educationLevel: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem', background: '#FFFFFF' }}
                      >
                        <option value="Graduate">Graduate / Post Graduate</option>
                        <option value="12th Pass">12th Standard Passed</option>
                        <option value="10th Pass">10th Standard Passed</option>
                        <option value="8th Pass">8th Standard Passed (PMEGP Eligible)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>Any Past Loan Default or NPA?</label>
                      <select
                        value={wizardData.hasDefaulterHistory}
                        onChange={(e) => setWizardData({ ...wizardData, hasDefaulterHistory: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem', background: '#FFFFFF' }}
                      >
                        <option value="No">No — Clean Credit History</option>
                        <option value="Yes">Yes — Resolved / Pending</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.82rem', color: '#475569' }}>
                    <ShieldCheck size={16} color="#16A34A" style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                    Government subsidy programs strictly require 8th standard pass certificate for manufacturing projects over ₹10 Lakhs.
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & CONSENT */}
              {currentStep === 4 && (
                <div>
                  <h3 style={{ fontSize: '1.20rem', fontWeight: '800', color: '#002970', marginBottom: '16px' }}>
                    Step 4: Review Assessment Summary
                  </h3>

                  <div style={{ background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '18px', marginBottom: '20px', fontSize: '0.86rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B' }}>Promoter Name:</span>
                      <strong style={{ color: '#002970' }}>{wizardData.fullName}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B' }}>Contact Number:</span>
                      <strong style={{ color: '#002970' }}>{wizardData.mobile}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B' }}>Category &amp; Location:</span>
                      <span style={{ color: '#334155' }}>{wizardData.socialCategory} ({wizardData.location})</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B' }}>Proposed Project Cost:</span>
                      <strong style={{ color: '#16A34A' }}>₹{(wizardData.projectCost / 100000).toFixed(1)} Lakhs</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#475569', marginBottom: '20px' }}>
                    <input
                      type="checkbox"
                      id="consent-check"
                      checked={wizardData.consent}
                      onChange={(e) => setWizardData({ ...wizardData, consent: e.target.checked })}
                    />
                    <label htmlFor="consent-check">
                      I agree to receive advisory scheme evaluation and consultation support from Digital Udyog Seva specialists.
                    </label>
                  </div>
                </div>
              )}

              {/* Bottom Navigation Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '20px', marginTop: '20px' }}>
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    style={{ padding: '10px 20px', background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '8px', fontWeight: '700', fontSize: '0.86rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                ) : <div />}

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  style={{ padding: '11px 26px', background: '#002970', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '0.90rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>{currentStep === totalSteps ? (isSubmitting ? 'Generating Score...' : 'Generate My Scorecard') : 'Next Step'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
