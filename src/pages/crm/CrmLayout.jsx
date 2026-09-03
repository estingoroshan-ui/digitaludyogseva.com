import React from 'react';
import { useApp } from '../../context/AppContext';
import { CrmDashboard } from './CrmDashboard';
import { CrmLeadsKanban } from './CrmLeadsKanban';
import { CrmCustomers } from './CrmCustomers';
import { CrmProjects } from './CrmProjects';
import { CrmEstimates } from './CrmEstimates';
import { CrmLoanCases } from './CrmLoanCases';

// Modals
import { LeadDetailModal } from './LeadDetailModal';
import { Customer360Modal } from './Customer360Modal';
import { ProjectDetailModal } from './ProjectDetailModal';
import { LoanCaseDetailModal } from './LoanCaseDetailModal';
import { NewLoanCaseModal } from './NewLoanCaseModal';

import { 
  Building2, 
  LayoutDashboard, 
  Kanban, 
  Users, 
  Briefcase,
  FileText, 
  Banknote, 
  ArrowLeft, 
  Bell, 
  Search, 
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const CrmLayout = () => {
  const { crmSection, setCrmSection, setActiveView, leads, customers, projects, loanCases } = useApp();

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
            <div style={{ fontSize: '0.68rem', color: '#ffa726', fontWeight: '600' }}>
              Managed by <a href="https://digitalvyaparseva.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>Digital Vyapar Seva</a>
            </div>
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
            <span className="nav-text">LEAD Pipeline ({leads.length})</span>
          </div>

          <div 
            onClick={() => setCrmSection('customers')}
            className={`crm-nav-item ${crmSection === 'customers' ? 'active' : ''}`}
          >
            <Users size={18} />
            <span className="nav-text">CUSTOMER 360° ({customers.length})</span>
          </div>

          <div 
            onClick={() => setCrmSection('projects')}
            className={`crm-nav-item ${crmSection === 'projects' ? 'active' : ''}`}
          >
            <Briefcase size={18} />
            <span className="nav-text">PROJECT Cases ({projects.length})</span>
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
            <span className="nav-text">Loan Cases Hub ({loanCases.length})</span>
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
          {crmSection === 'projects' && <CrmProjects />}
          {crmSection === 'estimates' && <CrmEstimates />}
          {crmSection === 'loans' && <CrmLoanCases />}
        </main>
      </div>

      {/* Global CRM Modals */}
      <LeadDetailModal />
      <Customer360Modal />
      <ProjectDetailModal />
      <LoanCaseDetailModal />
      <NewLoanCaseModal />
    </div>
  );
};
