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
  const { leads, customers, estimates, setCrmSection } = useApp();

  const totalPipelineValue = leads.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
  const convertedCount = leads.filter(l => l.stage === 'Converted').length;

  return (
    <div>
      {/* Top Banner */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#0b1727' }}>Command Center Dashboard</h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Live performance indicators, filing pipelines, and daily revenue metrics.
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setCrmSection('leads')}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} />
            <span>Manage Pipeline</span>
          </button>
          <button 
            onClick={() => setCrmSection('estimates')}
            className="btn btn-outline btn-sm"
          >
            <FileText size={16} />
            <span>Create Quotation</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="crm-stats-grid">
        <div className="crm-stat-card">
          <div>
            <div className="crm-stat-title">Active Leads</div>
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
            <div className="crm-stat-title">Pipeline Potential</div>
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
            <div className="crm-stat-title">Loan Cases In-Progress</div>
            <div className="crm-stat-value">₹1.85 Cr</div>
            <div className="crm-stat-trend" style={{ color: '#2563eb' }}>
              <span>PMEGP & Mudra Subsidies</span>
            </div>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Banknote size={22} />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Leads + Active Projects */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
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
    </div>
  );
};
