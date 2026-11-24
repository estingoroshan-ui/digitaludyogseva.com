import React from 'react';
import { useRouter } from '../router/Router';
import { Percent, CheckCircle2, Award, ShieldCheck, ArrowRight, Building2, Banknote } from 'lucide-react';

export const SubsidiesPage = ({ onOpenApplyModal }) => {
  const { navigate } = useRouter();

  const subsidies = [
    {
      title: 'PMEGP 35% Capital Subsidy',
      agency: 'KVIC & Ministry of MSME',
      rate: 'Up to 35% Capital Grant',
      maxCap: 'Max ₹17.50 Lakhs Subsidy (Mfg)',
      desc: 'Non-repayable margin money grant credited into 3-year term deposit receipt (TDR) account for new manufacturing & service micro units in rural areas.'
    },
    {
      title: 'PMFME Food Processing Grant',
      agency: 'Ministry of Food Processing Industries',
      rate: '35% Credit-Linked Subsidy',
      maxCap: 'Max ₹10.00 Lakhs per Unit',
      desc: 'Special incentive for food processing units (spices, flour, oil, bakery, pulses, packaging) under One District One Product (ODOP).'
    },
    {
      title: 'State Capital Investment Subsidy',
      agency: 'State Directorate of Industries (DIC)',
      rate: '15% to 25% on Plant & Machinery',
      maxCap: 'Up to ₹35 Lakhs depending on Zone',
      desc: 'Direct state reimbursement on verified equipment invoice costs upon commercial production launch.'
    },
    {
      title: 'Interest Subvention Scheme',
      agency: 'RBI & State MSME Departments',
      rate: '5% to 8% Annual Interest Rebate',
      maxCap: 'Tenure up to 5-7 Years',
      desc: 'Reimbursement of term loan interest charged by commercial banks, reducing borrower effective borrowing cost down to 3%-5%.'
    },
    {
      title: 'Electricity Duty & Tariff Concession',
      agency: 'State Electricity Regulatory Commissions',
      rate: '100% Exemption for 5-10 Years',
      maxCap: 'Significant Operational Cost Savings',
      desc: 'Zero electricity duty liability for newly commissioned micro, small, and medium manufacturing industrial power connections.'
    },
    {
      title: 'Stamp Duty & Land Conversion Exemption',
      agency: 'State Revenue & Industrial Development Authorities',
      rate: '100% Stamp Duty Exemption',
      maxCap: 'Applied on Industrial Land Allotment',
      desc: 'Full waiver or reimbursement of stamp duty charges paid during execution of lease deed in designated industrial parks (RIICO, UPSIDA, GIDC).'
    }
  ];

  return (
    <div style={{ background: '#F4F8FC', minHeight: '100vh', padding: '36px 0 60px 0' }}>
      <div className="container">
        
        {/* Breadcrumb */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '6px' }}>
            <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#00BAF2' }}>Home</span>
            {' > '}
            <span style={{ fontWeight: '700', color: '#002970' }}>MSME Subsidy Directory</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#002970', margin: '0 0 8px 0' }}>
            Government Subsidy Schemes &amp; Capital Grants
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#475569', margin: 0, maxWidth: '800px' }}>
            Comprehensive directory of non-repayable capital subsidies, interest rebates, and operational cost exemptions available for MSMEs across India.
          </p>
        </div>

        {/* Subsidies Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {subsidies.map((sub, idx) => (
            <div
              key={idx}
              style={{
                background: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '26px',
                boxShadow: '0 4px 14px rgba(0, 41, 112, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#002970', background: '#EFF6FF', padding: '4px 8px', borderRadius: '4px' }}>
                    {sub.agency}
                  </span>
                  <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#16A34A', background: '#DCFCE7', padding: '4px 10px', borderRadius: '20px' }}>
                    {sub.rate}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.18rem', fontWeight: '800', color: '#002970', marginBottom: '8px' }}>
                  {sub.title}
                </h3>
                <div style={{ fontSize: '0.80rem', fontWeight: '700', color: '#00BAF2', marginBottom: '12px' }}>
                  {sub.maxCap}
                </div>

                <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: '1.6', marginBottom: '18px' }}>
                  {sub.desc}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => navigate('/eligibility')}
                  style={{ flex: 1, padding: '10px 14px', background: '#002970', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.84rem', cursor: 'pointer' }}
                >
                  Check Subsidy Eligibility
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenApplyModal) onOpenApplyModal();
                    else navigate('/contact');
                  }}
                  style={{ padding: '10px 16px', background: '#F8FAFC', color: '#002970', border: '1px solid #CBD5E1', borderRadius: '8px', fontWeight: '700', fontSize: '0.84rem', cursor: 'pointer' }}
                >
                  Consult CA
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
