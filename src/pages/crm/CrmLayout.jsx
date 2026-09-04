import React from 'react';
import { useApp } from '../../context/AppContext';
import { CrmDashboard } from './CrmDashboard';
import { CrmLeadsKanban } from './CrmLeadsKanban';
import { CrmCustomers } from './CrmCustomers';
import { CrmProjects } from './CrmProjects';
import { CrmEstimates } from './CrmEstimates';
import { CrmLoanCases } from './CrmLoanCases';
import { Lead360AdminSettings } from './lead360/Lead360AdminSettings';
import { Lead360ExternalPortal } from './lead360/Lead360ExternalPortal';

// Modals
import { Lead360Modal } from './lead360/Lead360Modal';
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
  UserCheck,
  Sparkles,
  Sliders,
  Award
} from 'lucide-react';

export const CrmLayout = () => {
  const { 
    crmSection, 
    setCrmSection, 
    setActiveView, 
    leads, 
    customers, 
    projects, 
    loanCases,
    activeRole,
    setActiveRole,
    setSelectedLeadForDetail,
    showToast
  } = useApp();

  return (
    <div className="crm-layout">
      {/* Sidebar */}
      <aside className="crm-sidebar">
        <div className="crm-sidebar-header">
          <div className="brand-mark" style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #ff6f00, #ea580c)' }}>
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
          {/* PRIMARY FLAGSHIP LEAD MODULE */}
          <div 
            onClick={() => setCrmSection('leads')}
            className={`crm-nav-item ${crmSection === 'leads' ? 'active' : ''}`}
            style={{ borderLeft: crmSection === 'leads' ? '3px solid #ff6f00' : 'none' }}
          >
            <Sparkles size={18} color="#ff6f00" />
            <span className="nav-text" style={{ fontWeight: '700' }}>
              LEAD 360° AUTOPILOT ({leads.length})
            </span>
          </div>

          <div 
            onClick={() => setCrmSection('admin_settings')}
            className={`crm-nav-item ${crmSection === 'admin_settings' ? 'active' : ''}`}
          >
            <Sliders size={18} />
            <span className="nav-text">Lead Admin Controls</span>
          </div>

          <div 
            onClick={() => setCrmSection('external_portal')}
            className={`crm-nav-item ${crmSection === 'external_portal' ? 'active' : ''}`}
          >
            <Award size={18} />
            <span className="nav-text">CA / CS Outsource Desk</span>
          </div>

          <div 
            onClick={() => setCrmSection('dashboard')}
            className={`crm-nav-item ${crmSection === 'dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span className="nav-text">Command Center</span>
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
            <span className="badge badge-saffron" style={{ fontSize: '0.75rem' }}>
              Digital Udyog Seva • Lead 360° Autopilot
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
              17+ Sources • 17 Stages • AI Response • Voice-to-CRM
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* RBAC Active Role Switcher */}
            <div className="flex items-center gap-2" style={{ background: '#f8fafc', padding: '4px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700' }}>Active Role:</span>
              <select
                value={activeRole}
                onChange={e => {
                  setActiveRole(e.target.value);
                  showToast(`Switched active view permission to "${e.target.value}"`);
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontWeight: '700',
                  color: '#0b1727',
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                <option value="Admin">Admin Superuser</option>
                <option value="Senior Manager">Senior Manager</option>
                <option value="Sales RM">Sales RM</option>
                <option value="Telecaller">Telecaller</option>
                <option value="External Consultant">External Consultant (CA/CS)</option>
              </select>
            </div>

            <button 
              onClick={() => {
                setCrmSection('leads');
                const testLead = leads[0];
                if (testLead) setSelectedLeadForDetail(testLead);
              }}
              className="btn btn-sm btn-primary"
              style={{ background: 'linear-gradient(135deg, #ff6f00, #ea580c)' }}
            >
              <Sparkles size={14} />
              <span>Launch 360° Dossier</span>
            </button>
          </div>
        </header>

        {/* Section Router */}
        <main className="crm-content">
          {crmSection === 'leads' && <CrmLeadsKanban />}
          {crmSection === 'admin_settings' && <Lead360AdminSettings />}
          {crmSection === 'external_portal' && <Lead360ExternalPortal />}
          {crmSection === 'dashboard' && <CrmDashboard />}
          {crmSection === 'customers' && <CrmCustomers />}
          {crmSection === 'projects' && <CrmProjects />}
          {crmSection === 'estimates' && <CrmEstimates />}
          {crmSection === 'loans' && <CrmLoanCases />}
        </main>
      </div>

      {/* Global CRM Modals */}
      <Lead360Modal />
      <Customer360Modal />
      <ProjectDetailModal />
      <LoanCaseDetailModal />
      <NewLoanCaseModal />
    </div>
  );
};
