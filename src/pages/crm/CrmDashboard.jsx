import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  IndianRupee, 
  FileText, 
  Banknote, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  Plus
} from 'lucide-react';

export const CrmDashboard = () => {
  const { leads, customers, estimates, loanCases, setSelectedLoanForDetail, setCrmSection } = useApp();

  const totalPipelineValue = leads.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
  const convertedCount = leads.filter(l => l.stage === 'Converted').length;

  const totalLoanPipeline = loanCases.reduce((acc, c) => acc + (Number(c.requiredAmount) || 0), 0);
  const totalLoanSanctioned = loanCases.filter(c => ['Sanctioned', 'Disbursed', 'Subsidy Claimed'].includes(c.stage))
    .reduce((acc, c) => acc + (Number(c.bankDetails?.sanctionedAmount) || Number(c.requiredAmount) || 0), 0);

  const formatLakhsCr = (amount) => {
    if (!amount) return '₹0';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    return `₹${(amount / 100000).toFixed(1)} Lakhs`;
  };

  return (
    <div>
      {/* Top Banner */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#0b1727' }}>Command Center Dashboard</h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Live performance indicators, government loan underwriting, and corporate compliance metrics.
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setCrmSection('loans')}
            className="btn btn-primary btn-sm"
          >
            <Banknote size={16} />
            <span>Loan Cases Hub</span>
          </button>
          <button 
            onClick={() => setCrmSection('leads')}
            className="btn btn-outline btn-sm"
          >
            <Plus size={16} />
            <span>Manage Pipeline</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="crm-stats-grid mb-6">
        <div className="crm-stat-card">
          <div>
            <div className="crm-stat-title">Active Inquiries</div>
            <div className="crm-stat-value">{leads.length}</div>
            <div className="crm-stat-trend" style={{ color: '#059669' }}>
              <TrendingUp size={14} />
              <span>+4 Today • High Intent</span>
            </div>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} />
          </div>
        </div>

        <div className="crm-stat-card">
          <div>
            <div className="crm-stat-title">Advisory Deals Pipeline</div>
            <div className="crm-stat-value">₹{totalPipelineValue.toLocaleString('en-IN')}</div>
            <div className="crm-stat-trend" style={{ color: '#ff6f00' }}>
              <span>{convertedCount} Leads Converted to Cases</span>
            </div>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IndianRupee size={22} />
          </div>
        </div>

        <div className="crm-stat-card">
          <div>
            <div className="crm-stat-title">Verified Corporate Clients</div>
            <div className="crm-stat-value">{customers.length + 1420}</div>
            <div className="crm-stat-trend" style={{ color: '#059669' }}>
              <CheckCircle2 size={14} />
              <span>100% KYC Verified</span>
            </div>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="crm-stat-card">
          <div>
            <div className="crm-stat-title">Govt & Bank Loan Pipeline</div>
            <div className="crm-stat-value" style={{ color: '#ff6f00' }}>{formatLakhsCr(totalLoanPipeline)}</div>
            <div className="crm-stat-trend" style={{ color: '#059669' }}>
              <span>{formatLakhsCr(totalLoanSanctioned)} Sanctioned</span>
            </div>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#fff7ed', color: '#ff6f00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Banknote size={22} />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Leads + Active Projects */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', marginBottom: '24px' }}>
        {/* Recent Leads Activity */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 style={{ fontSize: '1.15rem' }}>Recent Inquiries & Leads</h3>
            <button 
              onClick={() => setCrmSection('leads')} 
              style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>View All Pipeline</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {leads.slice(0, 5).map(lead => (
              <div 
                key={lead.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '12px 14px', 
                  borderRadius: '10px', 
                  background: '#f8fafc',
                  border: '1px solid #f1f5f9' 
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0b1727' }}>{lead.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {lead.service} • <span style={{ color: '#2563eb' }}>{lead.phone}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-saffron" style={{ fontSize: '0.72rem' }}>
                    {lead.stage}
                  </span>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    ₹{Number(lead.value || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Onboarding / Customer Status */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 style={{ fontSize: '1.15rem' }}>Key Client Accounts</h3>
            <button 
              onClick={() => setCrmSection('customers')} 
              style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>Directory</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {customers.map(cust => (
              <div key={cust.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <div className="flex justify-between items-center">
                  <span style={{ fontWeight: '700', fontSize: '0.92rem' }}>{cust.name}</span>
                  <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>{cust.kycStatus}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                  {cust.contactPerson} • {cust.city}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#2563eb', marginTop: '4px' }}>
                  GSTIN: {cust.gstin}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Government Loan & Banking Portfolio Row */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-saffron">Govt Loan Cases Hub</span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>PMEGP, Mudra, CGTMSE & MSME Bank Liaison</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#0b1727', margin: '4px 0 0' }}>
              Active Government & Commercial Loan Pipeline
            </h3>
          </div>

          <button 
            onClick={() => setCrmSection('loans')} 
            className="btn btn-outline btn-sm"
          >
            <span>Open All Loan Dockets ({loanCases.length})</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {loanCases.slice(0, 4).map(c => (
            <div 
              key={c.id}
              onClick={() => {
                setCrmSection('loans');
                setSelectedLoanForDetail(c);
              }}
              style={{ 
                background: '#f8fafc', 
                borderRadius: '12px', 
                padding: '16px', 
                border: '1px solid #e2e8f0', 
                cursor: 'pointer',
                transition: 'border-color 0.15s, background 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ff6f00';
                e.currentTarget.style.background = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.background = '#f8fafc';
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', fontSize: '0.8rem', color: '#ff6f00' }}>
                  {c.id}
                </span>
                <span className="badge badge-slate" style={{ fontSize: '0.7rem' }}>
                  {c.stage}
                </span>
              </div>

              <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0b1727' }}>
                {c.businessName}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>
                👤 {c.applicantName} • {c.scheme}
              </div>

              <div className="flex justify-between items-center pt-2" style={{ borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: '800', fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: '#0b1727' }}>
                  ₹{Number(c.requiredAmount).toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: '600' }}>
                  {c.bankDetails?.lenderName?.split(' ')[0] || 'Bank'} Branch
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

