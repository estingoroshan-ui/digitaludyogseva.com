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
  X,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Printer,
  Compass,
  Briefcase,
  Layers,
  ArrowLeft
} from 'lucide-react';

export const EligibilityScorecardModule = () => {
  const { currentPath, navigate } = useRouter();
  const { showToast } = useApp();

  const isScorecardOnly = currentPath === '/admin/scorecards';
  const [assessmentStep, setAssessmentStep] = useState(1);

  // -------------------------------------------------------------
  // COMPREHENSIVE 8-STAGE PARAMETERS STATE
  // -------------------------------------------------------------
  // Stage 1: Applicant Selection & Basic Info
  const [customerName, setCustomerName] = useState('Sharma Agro Solutions Pvt. Ltd.');
  const [customerCode, setCustomerCode] = useState('CUST-301');
  const [applicantMobile, setApplicantMobile] = useState('9829011223');
  const [applicantState, setApplicantState] = useState('Rajasthan');
  const [applicantDistrict, setApplicantDistrict] = useState('Jaipur');

  // Stage 2: Social & Demographic Profile (Mandatory for PMEGP / Stand-Up India)
  const [applicantAge, setApplicantAge] = useState(34);
  const [applicantGender, setApplicantGender] = useState('Male'); // Male, Female, Transgender
  const [socialCategory, setSocialCategory] = useState('Special'); // General, Special (SC, ST, OBC, Minority, Women, Ex-Servicemen, Divyang, Hill Area)
  const [educationLevel, setEducationLevel] = useState('Graduate / Degree Holder'); // Below 8th, 8th Pass, 10th Pass, 12th Pass, Graduate

  // Stage 3: Enterprise & Industry Profile
  const [constitution, setConstitution] = useState('Private Limited'); // Proprietorship, Partnership, Private Limited, LLP, SHG
  const [activityType, setActivityType] = useState('Manufacturing'); // Manufacturing / Processing, Service Sector, Trading
  const [industrySector, setIndustrySector] = useState('Agro & Food Processing');
  const [locationType, setLocationType] = useState('Rural'); // Rural Area (25%-35% subsidy), Urban Area (15%-25% subsidy)

  // Stage 4: Project Cost & Financial Estimates
  const [machineryCost, setMachineryCost] = useState(1800000);
  const [buildingCost, setBuildingCost] = useState(400000);
  const [workingCapital, setWorkingCapital] = useState(300000);
  const [expectedAnnualTurnover, setExpectedAnnualTurnover] = useState(4500000);
  const [expectedNetProfitMargin, setExpectedNetProfitMargin] = useState(16); // %
  const [dscrRatio, setDscrRatio] = useState(2.14);

  // Stage 5: Credit & Banking Viability
  const [cibilScoreBand, setCibilScoreBand] = useState('750+ (Prime Grade)'); // 750+, 700-749, 650-699, <650
  const [existingLoanAmount, setExistingLoanAmount] = useState(0);
  const [preferredBank, setPreferredBank] = useState('Bank of Baroda');
  const [collateralOffered, setCollateralOffered] = useState('Collateral-Free via CGTMSE Guarantee');

  // Stage 6: Document Readiness Checklist
  const [docReadiness, setDocReadiness] = useState({
    aadhaarPan: true,
    udyamRegistration: true,
    detailedProjectReport: true,
    machineryQuotations: true,
    bankStatements: true,
    itrFinancials: true,
    landRecordsLease: true
  });

  // Calculations
  const totalProjectCost = Number(machineryCost || 0) + Number(buildingCost || 0) + Number(workingCapital || 0);

  // PMEGP Subsidy Logic
  // General Category: 15% Urban, 25% Rural. Special Category (Women/SC/ST/OBC/Minority/Divyang/NER): 25% Urban, 35% Rural.
  const isSpecialBeneficiary = socialCategory === 'Special' || applicantGender === 'Female';
  let pmegpSubsidyPercent = 15;
  let promoterContributionPercent = 10;

  if (isSpecialBeneficiary) {
    pmegpSubsidyPercent = locationType === 'Rural' ? 35 : 25;
    promoterContributionPercent = 5;
  } else {
    pmegpSubsidyPercent = locationType === 'Rural' ? 25 : 15;
    promoterContributionPercent = 10;
  }

  const promoterContributionAmount = (totalProjectCost * promoterContributionPercent) / 100;
  const pmegpSubsidyAmount = Math.min(
    (totalProjectCost * pmegpSubsidyPercent) / 100,
    activityType === 'Manufacturing' ? 1750000 : 700000
  );
  const bankTermLoanAmount = totalProjectCost - promoterContributionAmount;

  // 100-Point Scorecard Underwriting Algorithm
  const applicantScore = (applicantAge >= 21 && applicantAge <= 55 ? 5 : 3) + (educationLevel.includes('Graduate') ? 5 : 4) + (applicantGender === 'Female' || socialCategory === 'Special' ? 5 : 4); // max 15
  const businessScore = (activityType === 'Manufacturing' ? 10 : 8) + (locationType === 'Rural' ? 5 : 4) + (industrySector.includes('Agro') ? 5 : 4); // max 20
  const financialScore = (totalProjectCost >= 1000000 && totalProjectCost <= 5000000 ? 10 : 8) + (expectedNetProfitMargin >= 15 ? 5 : 3) + (dscrRatio >= 2.0 ? 5 : 3); // max 20
  const creditScore = cibilScoreBand.startsWith('750') ? 20 : cibilScoreBand.startsWith('700') ? 16 : 10; // max 20
  const promoterScore = promoterContributionPercent <= 10 ? 10 : 8; // max 10
  const docScore = Object.values(docReadiness).filter(Boolean).length * 2.14; // max 15

  const totalScorecardPoints = Math.min(100, Math.round(applicantScore + businessScore + financialScore + creditScore + promoterScore + docScore));

  const riskBand = totalScorecardPoints >= 85 ? 'Grade A+ — Prime Eligibility (Instant Approval Track)' :
                   totalScorecardPoints >= 70 ? 'Grade A — Low Risk (High Likelihood of Bank Sanction)' :
                   totalScorecardPoints >= 55 ? 'Grade B — Moderate Risk (Conditional Approval)' :
                   'Grade C — High Risk (Additional Collateral or Guarantor Required)';

  const riskBadgeColor = totalScorecardPoints >= 85 ? '#16A34A' : totalScorecardPoints >= 70 ? '#008BCB' : totalScorecardPoints >= 55 ? '#F59E0B' : '#DC2626';

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#002970', margin: '0 0 4px 0' }}>
            Government Scheme Eligibility &amp; Underwriting Engine
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748B', margin: 0 }}>
            Multi-scheme margin money subsidy calculation, bank viability underwriting and 100-point risk scorecard
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={() => setAssessmentStep(assessmentStep === 8 ? 1 : 8)}
            style={{
              padding: '10px 18px',
              background: '#FFFFFF',
              color: '#002970',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Award size={16} color="#00BAF2" />
            <span>{assessmentStep === 8 ? 'Back to Parameters' : 'View 100-Point Scorecard'}</span>
          </button>

          <a
            href={getApiUrl('api/v1/generate_pdf.php?type=scorecard&id=101&mode=download')}
            download="Eligibility_Assessment_Report_Sharma_Agro.pdf"
            style={{
              padding: '10px 20px',
              background: '#00BAF2',
              color: '#FFFFFF',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '0.88rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,186,242,0.25)'
            }}
          >
            <Download size={16} />
            <span>Download Official Report PDF</span>
          </a>
        </div>
      </div>

      {/* Top 4 KPI Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '18px 20px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748B' }}>Total Project Outlay</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#002970', marginTop: '4px' }}>
            ₹{(totalProjectCost / 100000).toFixed(2)} Lakhs
          </div>
          <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '2px' }}>Machinery + Shed + WC</div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '18px 20px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748B' }}>Eligible PMEGP Subsidy</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#16A34A', marginTop: '4px' }}>
            {pmegpSubsidyPercent}% (₹{(pmegpSubsidyAmount / 100000).toFixed(2)}L)
          </div>
          <div style={{ fontSize: '0.76rem', color: '#16A34A', marginTop: '2px', fontWeight: '700' }}>
            Non-Refundable Government Grant
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '18px 20px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748B' }}>Promoter Margin Money</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#002970', marginTop: '4px' }}>
            {promoterContributionPercent}% (₹{(promoterContributionAmount / 100000).toFixed(2)}L)
          </div>
          <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '2px' }}>Borrower Equity Required</div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '18px 20px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748B' }}>Viability Underwriting Score</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: riskBadgeColor, marginTop: '4px' }}>
            {totalScorecardPoints} / 100
          </div>
          <div style={{ fontSize: '0.76rem', color: riskBadgeColor, marginTop: '2px', fontWeight: '700' }}>
            Grade A+ Prime Eligibility
          </div>
        </div>
      </div>

      {/* Main Assessment Layout: Split Screen (Parameters + Multi-Scheme Comparison & Scorecard) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Interactive Parameters Workspace */}
        <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
          
          {/* Stage Tab Buttons */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px', marginBottom: '20px', overflowX: 'auto' }}>
            {[
              { num: 1, label: 'Applicant' },
              { num: 2, label: 'Social & Area' },
              { num: 3, label: 'Enterprise' },
              { num: 4, label: 'Financials' },
              { num: 5, label: 'Documents' }
            ].map(st => {
              const active = assessmentStep === st.num;
              return (
                <button
                  key={st.num}
                  type="button"
                  onClick={() => setAssessmentStep(st.num)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: active ? '#00BAF2' : '#F1F5F9',
                    color: active ? '#FFFFFF' : '#475569',
                    fontWeight: active ? '700' : '600',
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Step {st.num}: {st.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: APPLICANT PROFILE */}
          {assessmentStep === 1 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#002970', marginBottom: '16px' }}>
                Applicant &amp; Business Information
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Select Existing Customer / Lead
                  </label>
                  <select
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
                  >
                    <option value="Sharma Agro Solutions Pvt. Ltd.">Sharma Agro Solutions Pvt. Ltd. (CUST-301)</option>
                    <option value="Amit Enterprises">Amit Enterprises (CUST-302)</option>
                    <option value="ABC Manufacturing Pvt Ltd">ABC Manufacturing Pvt Ltd (CUST-303)</option>
                    <option value="Goyal Agro Tech">Goyal Agro Tech (CUST-304)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Registered Mobile Number
                  </label>
                  <input
                    type="text"
                    value={applicantMobile}
                    onChange={(e) => setApplicantMobile(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    State / UT
                  </label>
                  <input
                    type="text"
                    value={applicantState}
                    onChange={(e) => setApplicantState(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    District
                  </label>
                  <input
                    type="text"
                    value={applicantDistrict}
                    onChange={(e) => setApplicantDistrict(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAssessmentStep(2)}
                style={{ padding: '10px 20px', background: '#00BAF2', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
              >
                Continue to Social &amp; Area Demographics →
              </button>
            </div>
          )}

          {/* TAB 2: SOCIAL & DEMOGRAPHIC */}
          {assessmentStep === 2 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#002970', marginBottom: '16px' }}>
                Social Category &amp; Location Parameters
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Gender of Key Promoter
                  </label>
                  <select
                    value={applicantGender}
                    onChange={(e) => setApplicantGender(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female (Eligible for 35% Subsidy &amp; Stand-Up India)</option>
                    <option value="Transgender">Transgender</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Social Category Classification
                  </label>
                  <select
                    value={socialCategory}
                    onChange={(e) => setSocialCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
                  >
                    <option value="Special">Special (SC / ST / OBC / Minority / Ex-Servicemen / Divyang)</option>
                    <option value="General">General Category</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Unit Location Type
                  </label>
                  <select
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
                  >
                    <option value="Rural">Rural Area (35% Special Subsidy / 25% General)</option>
                    <option value="Urban">Urban Area (25% Special Subsidy / 15% General)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Education Qualification
                  </label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
                  >
                    <option value="Graduate / Degree Holder">Graduate / Degree Holder</option>
                    <option value="12th Passed">12th Passed</option>
                    <option value="10th Passed">10th Passed</option>
                    <option value="8th Passed">8th Passed (Min requirement for PMEGP above ₹10L)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setAssessmentStep(1)}
                  style={{ padding: '10px 18px', background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setAssessmentStep(3)}
                  style={{ padding: '10px 20px', background: '#00BAF2', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Continue to Enterprise Profile →
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ENTERPRISE PROFILE */}
          {assessmentStep === 3 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#002970', marginBottom: '16px' }}>
                Enterprise &amp; Constitution Profile
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Entity Legal Constitution
                  </label>
                  <select
                    value={constitution}
                    onChange={(e) => setConstitution(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
                  >
                    <option value="Private Limited">Private Limited Company</option>
                    <option value="LLP">Limited Liability Partnership (LLP)</option>
                    <option value="Proprietorship">Sole Proprietorship</option>
                    <option value="Partnership">Registered Partnership Firm</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Activity Sector
                  </label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
                  >
                    <option value="Manufacturing">Manufacturing / Processing (Max ₹50L PMEGP)</option>
                    <option value="Service Sector">Service Sector (Max ₹20L PMEGP)</option>
                    <option value="Trading">Trading / Business (Eligible under MUDRA)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Industry Vertical
                </label>
                <select
                  value={industrySector}
                  onChange={(e) => setIndustrySector(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
                >
                  <option value="Agro & Food Processing">Agro &amp; Food Processing Industry</option>
                  <option value="Engineering & Metal Fabrication">Engineering &amp; Metal Fabrication</option>
                  <option value="Textiles, Apparels & Garments">Textiles, Apparels &amp; Garments</option>
                  <option value="Solar & Renewable Energy">Solar &amp; Renewable Energy Equipment</option>
                  <option value="Healthcare & Pharmaceuticals">Healthcare &amp; Diagnostics</option>
                  <option value="Packaging & Paper Products">Packaging &amp; Corrugated Paper</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setAssessmentStep(2)}
                  style={{ padding: '10px 18px', background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setAssessmentStep(4)}
                  style={{ padding: '10px 20px', background: '#00BAF2', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Continue to Financial Estimates →
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: FINANCIAL ESTIMATES */}
          {assessmentStep === 4 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#002970', marginBottom: '16px' }}>
                Project Cost &amp; Debt Viability Estimates
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Plant &amp; Machinery (₹)
                  </label>
                  <input
                    type="number"
                    value={machineryCost}
                    onChange={(e) => setMachineryCost(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Civil Works / Shed (₹)
                  </label>
                  <input
                    type="number"
                    value={buildingCost}
                    onChange={(e) => setBuildingCost(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Working Capital (₹)
                  </label>
                  <input
                    type="number"
                    value={workingCapital}
                    onChange={(e) => setWorkingCapital(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Applicant CIBIL Score Band
                  </label>
                  <select
                    value={cibilScoreBand}
                    onChange={(e) => setCibilScoreBand(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
                  >
                    <option value="750+ (Prime Grade)">750+ (Prime Grade - Zero Red Flags)</option>
                    <option value="700-749 (Standard)">700-749 (Standard Acceptable)</option>
                    <option value="650-699 (Borderline)">650-699 (Borderline - Requires Review)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Collateral Security Type
                  </label>
                  <select
                    value={collateralOffered}
                    onChange={(e) => setCollateralOffered(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
                  >
                    <option value="Collateral-Free via CGTMSE Guarantee">Collateral-Free via CGTMSE Guarantee</option>
                    <option value="Self Property Mortgaged">Residential / Industrial Property</option>
                    <option value="Third Party Guarantor">Third Party Guarantor</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setAssessmentStep(3)}
                  style={{ padding: '10px 18px', background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setAssessmentStep(5)}
                  style={{ padding: '10px 20px', background: '#00BAF2', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Continue to Document Readiness →
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: DOCUMENT READINESS */}
          {assessmentStep === 5 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#002970', marginBottom: '16px' }}>
                Document Readiness &amp; KYC Verification Check
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                {[
                  { key: 'aadhaarPan', label: 'Aadhaar & PAN Cards' },
                  { key: 'udyamRegistration', label: 'Udyam Registration Certificate' },
                  { key: 'detailedProjectReport', label: 'Bank Viable DPR Report' },
                  { key: 'machineryQuotations', label: 'Machinery Quotations & Invoices' },
                  { key: 'bankStatements', label: '6 Months Current Bank Statement' },
                  { key: 'itrFinancials', label: 'Last 2 Years ITR / Balance Sheet' },
                  { key: 'landRecordsLease', label: 'Factory Land Title / Lease Deed' }
                ].map(d => (
                  <label key={d.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', cursor: 'pointer', fontSize: '0.86rem' }}>
                    <input 
                      type="checkbox"
                      checked={docReadiness[d.key]}
                      onChange={(e) => setDocReadiness({ ...docReadiness, [d.key]: e.target.checked })}
                    />
                    <span style={{ fontWeight: '600', color: '#1E293B' }}>{d.label}</span>
                  </label>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setAssessmentStep(4)}
                  style={{ padding: '10px 18px', background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast('Assessment recalculation complete!', 'success');
                  }}
                  style={{ padding: '10px 22px', background: '#16A34A', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}
                >
                  ✓ Re-calculate Viability Matrix
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Multi-Scheme Recommendation Matrix & Scorecard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Top Recommendation: PMEGP Scheme */}
          <div style={{
            background: 'linear-gradient(135deg, #002970 0%, #001845 100%)',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 8px 24px rgba(0,41,112,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ background: '#00BAF2', color: '#FFFFFF', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>
                Top Recommended Scheme
              </span>
              <span style={{ fontSize: '0.85rem', color: '#93C5FD' }}>KVIC / MSME MoF</span>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: '10px 0 4px 0' }}>
              PMEGP — Prime Minister's Employment Generation
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#BFDBFE', margin: '0 0 16px 0' }}>
              Highest non-refundable capital subsidy scheme for MSME manufacturing &amp; processing.
            </p>

            {/* Matrix details */}
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '14px', marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#93C5FD' }}>Subsidy Grant (%)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#86EFAC' }}>{pmegpSubsidyPercent}%</div>
              </div>

              <div>
                <div style={{ fontSize: '0.74rem', color: '#93C5FD' }}>Subsidy Amount (₹)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#86EFAC' }}>
                  ₹{(pmegpSubsidyAmount / 100000).toFixed(2)} Lakhs
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.74rem', color: '#93C5FD' }}>Promoter Share</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>{promoterContributionPercent}% (₹{(promoterContributionAmount / 100000).toFixed(2)}L)</div>
              </div>

              <div>
                <div style={{ fontSize: '0.74rem', color: '#93C5FD' }}>Bank Term Loan</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>₹{(bankTermLoanAmount / 100000).toFixed(2)} Lakhs</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href={getApiUrl('api/v1/generate_pdf.php?type=scorecard&id=101&mode=inline')}
                target="_blank"
                rel="noreferrer"
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#00BAF2',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.86rem',
                  textDecoration: 'none'
                }}
              >
                View Assessment PDF
              </a>
              <button
                type="button"
                onClick={() => {
                  showToast('Assessment attached to customer profile CUST-301', 'success');
                }}
                style={{
                  padding: '10px 16px',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '0.86rem',
                  cursor: 'pointer'
                }}
              >
                Save to Customer
              </button>
            </div>
          </div>

          {/* Alternative Scheme Cards */}
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px' }}>
            <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#002970', margin: '0 0 14px 0' }}>
              Alternative Government Scheme Matches
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Scheme 2: MUDRA */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px', background: '#F8FAFC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: '700', color: '#002970', fontSize: '0.92rem' }}>Pradhan Mantri MUDRA Yojana (Tarun)</div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#16A34A', background: '#DCFCE7', padding: '3px 8px', borderRadius: '12px' }}>Eligible</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
                  Up to ₹10.00 Lakhs collateral-free credit for expansion with concessional interest rate.
                </div>
              </div>

              {/* Scheme 3: CGTMSE */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px', background: '#F8FAFC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: '700', color: '#002970', fontSize: '0.92rem' }}>CGTMSE Collateral-Free Guarantee</div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#008BCB', background: '#E0F2FE', padding: '3px 8px', borderRadius: '12px' }}>High Match</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
                  Up to ₹5.00 Crore credit guarantee cover without third-party asset mortgage.
                </div>
              </div>

              {/* Scheme 4: State Industrial Subsidy */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px', background: '#F8FAFC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: '700', color: '#002970', fontSize: '0.92rem' }}>State MSME Capital Investment Subsidy</div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#7C3AED', background: '#EDE9FE', padding: '3px 8px', borderRadius: '12px' }}>State Policy</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
                  25% capital subsidy + 5% interest subvention for agro manufacturing in industrial zones.
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
