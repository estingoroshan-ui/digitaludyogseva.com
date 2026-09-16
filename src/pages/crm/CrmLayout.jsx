import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CrmDashboard } from './CrmDashboard';
import { CrmLeadsKanban } from './CrmLeadsKanban';
import { CrmCustomers } from './CrmCustomers';
import { CrmProjects } from './CrmProjects';
import { CrmEstimates } from './CrmEstimates';
import { CrmLoanCases } from './CrmLoanCases';
import { Lead360AdminSettings } from './lead360/Lead360AdminSettings';
import { Lead360ExternalPortal } from './lead360/Lead360ExternalPortal';

// New Business Hub & Ecosystem Modules
import { BusinessHubCabins } from './cabins/BusinessHubCabins';
import { FranchiseManager } from './franchise/FranchiseManager';
import { MachineryTradingHub } from './trading/MachineryTradingHub';
import { AiSubsidyEligibilityEngine } from './subsidy/AiSubsidyEligibilityEngine';
import { CrmHrmDesk } from './hrm/CrmHrmDesk';
import { ClientBillingManager } from './bookkeeping/ClientBillingManager';

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
  Award,
  DoorOpen,
  Settings,
  Package,
  Calculator,
  Receipt,
  BookOpen
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
    cabins,
    franchises,
    activeRole,
    setActiveRole,
    setSelectedLeadForDetail,
    showToast
  } = useApp();

  return (
    <div className="crm-layout">
      {/* Sidebar */}
      <aside className="crm-sidebar" style={{ overflowY: 'auto' }}>
        <div className="crm-sidebar-header">
          <div className="brand-mark" style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #ff6f00, #ea580c)' }}>
            <Building2 size={18} />
          </div>
          <div className="brand-text">
            <h2 style={{ fontSize: '1.1rem', color: '#fff', margin: 0 }}>DUS Master CRM</h2>
            <div style={{ fontSize: '0.68rem', color: '#ffa726', fontWeight: '600' }}>
              Business Hub Ecosystem
            </div>
          </div>
        </div>

        <nav className="crm-nav">
          {/* SECTION 1: BUSINESS HUB BUILDING & DESKS */}
          <div style={{ padding: '6px 12px 2px', fontSize: '0.68rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '800', letterSpacing: '0.05em' }}>
            Business Hub Building
          </div>

          <div 
            onClick={() => setCrmSection('cabins')}
            className={`crm-nav-item ${crmSection === 'cabins' ? 'active' : ''}`}
            style={{ borderLeft: crmSection === 'cabins' ? '3px solid #ff6f00' : 'none' }}
          >
            <DoorOpen size={18} color="#ff6f00" />
            <span className="nav-text" style={{ fontWeight: '700' }}>
              7 Business Cabins
            </span>
          </div>

          <div 
            onClick={() => setCrmSection('franchises')}
            className={`crm-nav-item ${crmSection === 'franchises' ? 'active' : ''}`}
          >
            <Award size={18} color="#fbbf24" />
            <span className="nav-text">Kendra Franchises ({franchises.length})</span>
          </div>

          <div 
            onClick={() => setCrmSection('trading')}
            className={`crm-nav-item ${crmSection === 'trading' ? 'active' : ''}`}
          >
            <Settings size={18} color="#14b8a6" />
            <span className="nav-text">Machinery &amp; B2B Trading</span>
          </div>

          <div 
            onClick={() => setCrmSection('subsidy_ai')}
            className={`crm-nav-item ${crmSection === 'subsidy_ai' ? 'active' : ''}`}
          >
            <Calculator size={18} color="#818cf8" />
            <span className="nav-text" style={{ fontWeight: '700' }}>AI Subsidy Calculator</span>
          </div>

          <div 
            onClick={() => setCrmSection('hrm')}
            className={`crm-nav-item ${crmSection === 'hrm' ? 'active' : ''}`}
          >
            <Users size={18} color="#ec4899" />
            <span className="nav-text">HRM &amp; Cabin Staff</span>
          </div>

          {/* SECTION 2: PIPELINES & CASE HUB */}
          <div style={{ padding: '12px 12px 2px', fontSize: '0.68rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '800', letterSpacing: '0.05em' }}>
            Pipelines &amp; Operations
          </div>

          <div 
            onClick={() => setCrmSection('leads')}
            className={`crm-nav-item ${crmSection === 'leads' ? 'active' : ''}`}
          >
            <Sparkles size={18} color="#ff8f00" />
            <span className="nav-text">
              LEAD 360° Autopilot ({leads.length})
            </span>
          </div>

          <div 
            onClick={() => setCrmSection('loans')}
            className={`crm-nav-item ${crmSection === 'loans' ? 'active' : ''}`}
          >
            <Banknote size={18} color="#4ade80" />
            <span className="nav-text">Loan Cases Hub ({loanCases.length})</span>
          </div>

          <div 
            onClick={() => setCrmSection('projects')}
            className={`crm-nav-item ${crmSection === 'projects' ? 'active' : ''}`}
          >
            <Briefcase size={18} color="#60a5fa" />
            <span className="nav-text">PROJECT Cases ({projects.length})</span>
          </div>

          <div 
            onClick={() => setCrmSection('customers')}
            className={`crm-nav-item ${crmSection === 'customers' ? 'active' : ''}`}
          >
            <Users size={18} color="#c084fc" />
            <span className="nav-text">CUSTOMER 360° ({customers.length})</span>
          </div>

          <div 
            onClick={() => setCrmSection('estimates')}
            className={`crm-nav-item ${crmSection === 'estimates' ? 'active' : ''}`}
          >
            <FileText size={18} />
            <span className="nav-text">Estimates &amp; Billing</span>
          </div>

          <div 
            onClick={() => setCrmSection('client_bookkeeping')}
            className={`crm-nav-item ${crmSection === 'client_bookkeeping' ? 'active' : ''}`}
            style={{ borderLeft: crmSection === 'client_bookkeeping' ? '3px solid #ff6f00' : 'none' }}
          >
            <BookOpen size={18} color="#f59e0b" />
            <span className="nav-text" style={{ fontWeight: crmSection === 'client_bookkeeping' ? '800' : '500' }}>
              Client Bill Books Desk
            </span>
          </div>

          {/* SECTION 3: MANAGEMENT */}
          <div style={{ padding: '12px 12px 2px', fontSize: '0.68rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '800', letterSpacing: '0.05em' }}>
            Management
          </div>

          <div 
            onClick={() => setCrmSection('dashboard')}
            className={`crm-nav-item ${crmSection === 'dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span className="nav-text">Command Center</span>
          </div>

          <div 
            onClick={() => setCrmSection('external_portal')}
            className={`crm-nav-item ${crmSection === 'external_portal' ? 'active' : ''}`}
          >
            <Award size={18} />
            <span className="nav-text">CA / CS Outsource Desk</span>
          </div>

          <div 
            onClick={() => setCrmSection('admin_settings')}
            className={`crm-nav-item ${crmSection === 'admin_settings' ? 'active' : ''}`}
          >
            <Sliders size={18} />
            <span className="nav-text">Lead Admin Controls</span>
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
              Digital Udyog Seva • Unified Business Hub
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
              7 Cabins • Kendra Franchises • Machinery Hub • AI Subsidy • Full Admin Control
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
                <option value="Admin">Admin Superuser (Full Control)</option>
                <option value="Senior Manager">Senior Manager</option>
                <option value="Sales RM">Sales RM</option>
                <option value="Telecaller">Cabin Telecaller</option>
                <option value="External Consultant">External Consultant (CA/CS)</option>
              </select>
            </div>

            {/* Notification Center Bell */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="btn btn-sm btn-outline"
                style={{
                  position: 'relative',
                  padding: '6px 10px',
                  background: '#f8fafc',
                  borderColor: '#cbd5e1',
                  color: '#0b1727'
                }}
                title="Inbound Lead Alerts & Automations"
              >
                <Bell size={16} color="#ff6f00" />
                <span 
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: '#ef4444',
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {leads.length > 9 ? '9+' : leads.length}
                </span>
              </button>

              {/* Notification Dropdown Popover */}
              {showNotifications && (
                <div
                  style={{
                    position: 'absolute',
                    top: '40px',
                    right: 0,
                    width: '360px',
                    background: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    border: '1px solid #e2e8f0',
                    zIndex: 1000,
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ background: '#0b1727', color: '#fff', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} color="#ff6f00" />
                      <strong style={{ fontSize: '0.88rem' }}>Live Lead Automation Center</strong>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Auto WhatsApp Ready</span>
                  </div>

                  <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                    {leads.slice(0, 4).map(ld => (
                      <div
                        key={ld.id}
                        style={{
                          padding: '12px 14px',
                          borderBottom: '1px solid #f1f5f9',
                          cursor: 'pointer',
                          transition: 'background 0.15s'
                        }}
                        onClick={() => {
                          setSelectedLeadForDetail(ld);
                          setShowNotifications(false);
                        }}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <strong style={{ fontSize: '0.88rem', color: '#0b1727' }}>{ld.name}</strong>
                          <span className="badge badge-saffron" style={{ fontSize: '0.65rem' }}>
                            {ld.leadSource?.channel || ld.source || 'Web Inbound'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          {ld.service} • {ld.district || 'Rajasthan'}
                        </div>
                        <div className="flex items-center justify-between mt-2" style={{ fontSize: '0.72rem' }}>
                          <span style={{ color: '#15803d', fontWeight: '700' }}>
                            {ld.eligibilityScore ? `✓ ${ld.eligibilityScore}% Score` : '⭐ Check Eligibility'}
                          </span>
                          <span style={{ color: '#2563eb', fontWeight: '600' }}>
                            Open Dossier →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: '10px 14px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setCrmSection('leads');
                        setShowNotifications(false);
                      }}
                      className="btn btn-sm btn-outline w-full"
                      style={{ fontSize: '0.78rem', borderColor: '#cbd5e1' }}
                    >
                      View All {leads.length} Leads in Pipeline
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setCrmSection('cabins')}
              className="btn btn-sm btn-primary"
              style={{ background: 'linear-gradient(135deg, #ff6f00, #ea580c)' }}
            >
              <DoorOpen size={14} />
              <span>Business Hub Cabins</span>
            </button>
          </div>
        </header>

        {/* Section Router */}
        <main className="crm-content">
          {crmSection === 'cabins' && <BusinessHubCabins />}
          {crmSection === 'franchises' && <FranchiseManager />}
          {crmSection === 'trading' && <MachineryTradingHub />}
          {crmSection === 'subsidy_ai' && <AiSubsidyEligibilityEngine />}
          {crmSection === 'hrm' && <CrmHrmDesk />}

          {crmSection === 'leads' && <CrmLeadsKanban />}
          {crmSection === 'admin_settings' && <Lead360AdminSettings />}
          {crmSection === 'external_portal' && <Lead360ExternalPortal />}
          {crmSection === 'dashboard' && <CrmDashboard />}
          {crmSection === 'customers' && <CrmCustomers />}
          {crmSection === 'projects' && <CrmProjects />}
          {crmSection === 'estimates' && <CrmEstimates />}
          {crmSection === 'client_bookkeeping' && <ClientBillingManager />}
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
