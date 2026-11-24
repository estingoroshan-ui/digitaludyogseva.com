import React from 'react';
import { useRouter } from '../router/Router';
import { FileText, ArrowRight, BookOpen, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

export const KnowledgePage = () => {
  const { navigate } = useRouter();

  const articles = [
    {
      id: 1,
      category: 'Detailed Project Reports',
      title: 'How to Prepare a Bank-Compliant DPR for PMEGP Manufacturing Units',
      readTime: '6 Min Read',
      date: 'November 2026',
      desc: 'Understanding key financial ratios, Debt Service Coverage Ratio (DSCR), Break-Even Point (BEP), and promoter equity norms required by nationalized banks.'
    },
    {
      id: 2,
      category: 'Government Subsidies',
      title: 'Demystifying the 35% PMEGP Capital Subsidy Disbursement Timeline',
      readTime: '5 Min Read',
      date: 'November 2026',
      desc: 'A complete step-by-step walkthrough of how government margin money subsidy is locked into a Term Deposit Receipt (TDR) for 3 years before final adjustment.'
    },
    {
      id: 3,
      category: 'Credit & Banking',
      title: '10 Actionable Steps to Improve Your Commercial CIBIL Score Above 750',
      readTime: '7 Min Read',
      date: 'October 2026',
      desc: 'How GST return consistency, timely servicing of trade payables, and debt-to-turnover ratio impact bank credit committee appraisals.'
    },
    {
      id: 4,
      category: 'MSME Compliance',
      title: 'Udyam Registration Benefits: Collateral-Free Loans & 45-Day Payment Rule',
      readTime: '4 Min Read',
      date: 'October 2026',
      desc: 'Learn how Section 43B(h) of the Income Tax Act protects MSME cash flow and how Udyam certification lowers bank interest rates.'
    },
    {
      id: 5,
      category: 'Food Processing Sector',
      title: 'PMFME Scheme Guidelines: How Food Processing Units Get 35% Grants',
      readTime: '8 Min Read',
      date: 'September 2026',
      desc: 'Guidelines for spice mills, flour mills, oil expellers, and bakery units under the One District One Product (ODOP) government initiative.'
    },
    {
      id: 6,
      category: 'Corporate Structuring',
      title: 'Private Limited vs LLP: Which Structure is Best for Availing Bank Debt?',
      readTime: '5 Min Read',
      date: 'September 2026',
      desc: 'A comparative analysis of legal liabilities, compliance burden, and banking preferences when applying for working capital limits.'
    }
  ];

  return (
    <div style={{ background: '#F4F8FC', minHeight: '100vh', padding: '36px 0 60px 0' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            MSME Advisory Literacy
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#002970', margin: '6px 0 10px 0' }}>
            Knowledge Center &amp; Scheme Guidelines
          </h1>
          <p style={{ fontSize: '0.94rem', color: '#475569', margin: 0, lineHeight: '1.6' }}>
            Expert guides, financial modeling insights, and statutory updates authored by our in-house Chartered Accountants and MSME specialists.
          </p>
        </div>

        {/* Articles Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {articles.map((art) => (
            <div
              key={art.id}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748B', marginBottom: '10px' }}>
                  <span style={{ fontWeight: '800', color: '#002970', background: '#EFF6FF', padding: '3px 8px', borderRadius: '4px' }}>
                    {art.category}
                  </span>
                  <span>{art.readTime}</span>
                </div>

                <h3 style={{ fontSize: '1.10rem', fontWeight: '800', color: '#002970', marginBottom: '8px', lineHeight: 1.35 }}>
                  {art.title}
                </h3>

                <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: '1.55', margin: 0 }}>
                  {art.desc}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>{art.date}</span>
                <button
                  type="button"
                  onClick={() => navigate('/eligibility')}
                  style={{ background: 'transparent', border: 'none', color: '#00BAF2', fontWeight: '700', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                >
                  <span>Apply with Guide</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
