import React from 'react';
import { useApp } from '../context/AppContext';
import { LoanCalculator } from '../components/LoanCalculator';
import { ShieldCheck, Banknote, CheckCircle2, ArrowRight, Percent, Award } from 'lucide-react';

export const LoansPage = () => {
  const { loanSchemes, addLead, showToast } = useApp();

  return (
    <div className="section" style={{ background: '#f8fafc', minHeight: '80vh' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="badge badge-emerald" style={{ marginBottom: '12px' }}>
            Govt Subsidized & MSME Loans
          </span>
          <h2>Government Schemes & Commercial Business Loans</h2>
          <p>
            Get expert DPR (Detailed Project Report) preparation, bank sanction assistance, and subsidy maximization through KVIC, MSME, and leading public/private sector banks.
          </p>
        </div>

        {/* EMI Calculator */}
        <div style={{ marginBottom: '60px' }}>
          <LoanCalculator />
        </div>

        {/* Schemes Deep Dive */}
        <h3 style={{ fontSize: '1.6rem', marginBottom: '24px', textAlign: 'center' }}>
          Featured Business Financing Schemes
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {loanSchemes.map(scheme => (
            <div key={scheme.id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="badge badge-blue">{scheme.type}</span>
                  <Award size={20} color="#ff6f00" />
                </div>

                <h4 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>{scheme.name}</h4>
                <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '20px' }}>{scheme.tagline}</p>

                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '16px', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>Max Loan</small>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#0b1727' }}>{scheme.maxAmount}</div>
                  </div>
                  <div>
                    <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>Interest Rate</small>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#059669' }}>{scheme.interestRate}</div>
                  </div>
                </div>

                <h5 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '10px', color: '#334155' }}>Key Highlights:</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  {scheme.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2" style={{ fontSize: '0.85rem', color: '#475569' }}>
                      <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => {
                  addLead({
                    name: 'Scheme Inquirer',
                    phone: 'Pending Callback',
                    email: 'Scheme Form',
                    service: scheme.name,
                    value: 10000,
                    source: 'Loans Page Inquiry',
                    assignedTo: 'Anil Tyagi (Loan Specialist)',
                    notes: `Inquired about ${scheme.name} (${scheme.maxAmount})`
                  });
                  showToast(`Inquiry registered for ${scheme.name}! Loan officer assigned.`);
                }}
                className="btn btn-outline w-full"
              >
                <span>Inquire for {scheme.name}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
