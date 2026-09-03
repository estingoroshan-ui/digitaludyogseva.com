import React from 'react';
import { useApp } from '../../context/AppContext';
import { CrmDashboard } from './CrmDashboard';
import { CrmLeadsKanban } from './CrmLeadsKanban';
import { CrmCustomers } from './CrmCustomers';
import { CrmEstimates } from './CrmEstimates';
import { 
  Building2, 
  LayoutDashboard, 
  Kanban, 
  Users, 
  FileText, 
  Banknote, 
  ArrowLeft, 
  Bell, 
  Search, 
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const CrmLayout = () => {
  const { crmSection, setCrmSection, setActiveView, leads } = useApp();

  return (
    <div className="crm-layout">
      {/* Sidebar */}
      <aside className="crm-sidebar">
        <div className="crm-sidebar-header">
          <div className="brand-mark" style={{ width: '36px', height: '36px' }}>
            <Building2 size={18} />
          </div>
          <div className="brand-text">
            <h2 style={{ fontSize: '1.1rem', color: '#fff', margin: 0 }}>DUS CRM</h2>
            <span style={{ fontSize: '0.68rem', color: '#ffa726' }}>Enterprise Suite</span>
          </div>
        </div>

        <nav className="crm-nav">
          <div 
            onClick={() => setCrmSection('dashboard')}
            className={`crm-nav-item ${crmSection === 'dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span className="nav-text">Command Center</span>
          </div>

          <div 
            onClick={() => setCrmSection('leads')}
            className={`crm-nav-item ${crmSection === 'leads' ? 'active' : ''}`}
          >
            <Kanban size={18} />
            <span className="nav-text">Leads Pipeline ({leads.length})</span>
          </div>

          <div 
            onClick={() => setCrmSection('customers')}
            className={`crm-nav-item ${crmSection === 'customers' ? 'active' : ''}`}
          >
            <Users size={18} />
            <span className="nav-text">Customer Vault</span>
          </div>

          <div 
            onClick={() => setCrmSection('estimates')}
            className={`crm-nav-item ${crmSection === 'estimates' ? 'active' : ''}`}
          >
            <FileText size={18} />
            <span className="nav-text">Estimates & Billing</span>
          </div>

          <div 
            onClick={() => setCrmSection('loans')}
            className={`crm-nav-item ${crmSection === 'loans' ? 'active' : ''}`}
          >
            <Banknote size={18} />
            <span className="nav-text">Loan Cases Hub</span>
          </div>
        </nav>

        {/* Return to website */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button 
            onClick={() => setActiveView('website')}
            className="btn btn-sm btn-outline-white w-full"
            style={{ fontSize: '0.82rem' }}
          >
            <ArrowLeft size={14} />
            <span className="nav-text">Back to Website</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="crm-main">
        {/* Topbar */}
        <header className="crm-topbar">
          <div className="flex items-center gap-3">
            <span className="badge badge-saffron">Digital Udyog Seva Admin</span>
            <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>• Node ID: DUS-SRV-2026</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCrmSection('leads')}
              className="btn btn-sm btn-primary"
            >
              <span>+ Quick Lead</span>
            </button>

            <div className="flex items-center gap-2" style={{ background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ff6f00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.8rem' }}>
                AD
              </div>
              <div style={{ fontSize: '0.82rem' }}>
                <strong>Admin Director</strong>
                <div style={{ color: '#059669', fontSize: '0.72rem' }}>● Online & Synced</div>
              </div>
            </div>
          </div>
        </header>

        {/* Section Router */}
        <main className="crm-content">
          {crmSection === 'dashboard' && <CrmDashboard />}
          {crmSection === 'leads' && <CrmLeadsKanban />}
          {crmSection === 'customers' && <CrmCustomers />}
          {crmSection === 'estimates' && <CrmEstimates />}
          {crmSection === 'loans' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 style={{ fontSize: '1.6rem', color: '#0b1727' }}>Government & Bank Loan Underwriting</h2>
                  <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
                    Active PMEGP, Mudra, and Commercial loans being coordinated with SBI, PNB, and Bank of Baroda.
                  </p>
                </div>
              </div>

              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Application ID</th>
                      <th>Applicant / Unit</th>
                      <th>Scheme</th>
                      <th>Loan Amount</th>
                      <th>Target Bank</th>
                      <th>Stage</th>
                      <th>Underwriter</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>LN-2026-081</span></td>
                      <td><strong>Pooja Fashion Hub</strong></td>
                      <td>PMEGP Scheme (35% Subsidy)</td>
                      <td style={{ fontWeight: '800', fontFamily: 'var(--font-mono)' }}>₹25,00,000</td>
                      <td>State Bank of India (Surat)</td>
                      <td><span className="badge badge-emerald">Sanction Letter Issued</span></td>
                      <td>Anil Tyagi</td>
                    </tr>
                    <tr>
                      <td><span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>LN-2026-092</span></td>
                      <td><strong>Sharma Agro Foods</strong></td>
                      <td>Mudra Tarun Scheme</td>
                      <td style={{ fontWeight: '800', fontFamily: 'var(--font-mono)' }}>₹10,00,000</td>
                      <td>Punjab National Bank</td>
                      <td><span className="badge badge-blue">KVIC Forwarded</span></td>
                      <td>Neha Sharma</td>
                    </tr>
                    <tr>
                      <td><span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>LN-2026-104</span></td>
                      <td><strong>Apex BioSolutions</strong></td>
                      <td>CGTMSE Collateral-Free</td>
                      <td style={{ fontWeight: '800', fontFamily: 'var(--font-mono)' }}>₹45,00,000</td>
                      <td>Bank of Baroda</td>
                      <td><span className="badge badge-amber">CMA Data In Preparation</span></td>
                      <td>Rahul Mehta</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
