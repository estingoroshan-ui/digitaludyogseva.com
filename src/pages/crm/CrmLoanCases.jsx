import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Banknote, 
  Search, 
  Filter, 
  Plus, 
  LayoutList, 
  Kanban, 
  TrendingUp, 
  Building2, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  Award, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Briefcase,
  AlertCircle
} from 'lucide-react';

export const CrmLoanCases = () => {
  const { 
    loanCases, 
    setSelectedLoanForDetail, 
    setIsNewLoanModalOpen, 
    updateLoanCaseStage,
    loanStagesMaster 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedScheme, setSelectedScheme] = useState('ALL');
  const [selectedBank, setSelectedBank] = useState('ALL');
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'

  // Filtered loan cases
  const filteredCases = useMemo(() => {
    return loanCases.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = 
        c.id.toLowerCase().includes(q) ||
        c.applicantName.toLowerCase().includes(q) ||
        c.businessName.toLowerCase().includes(q) ||
        (c.city && c.city.toLowerCase().includes(q)) ||
        (c.bankDetails?.lenderName && c.bankDetails.lenderName.toLowerCase().includes(q));

      const matchScheme = selectedScheme === 'ALL' || c.scheme.toLowerCase().includes(selectedScheme.toLowerCase());
      const matchBank = selectedBank === 'ALL' || (c.bankDetails?.lenderName && c.bankDetails.lenderName.toLowerCase().includes(selectedBank.toLowerCase()));
      const matchStage = selectedStage === 'ALL' || c.stage === selectedStage;

      return matchSearch && matchScheme && matchBank && matchStage;
    });
  }, [loanCases, search, selectedScheme, selectedBank, selectedStage]);

  // Executive KPI Calculations
  const stats = useMemo(() => {
    const totalPipeline = loanCases.reduce((acc, c) => acc + (Number(c.requiredAmount) || 0), 0);
    const inUnderwriting = loanCases.filter(c => ['Doc Collection', 'DPR Preparation', 'Portal Login', 'Bank Underwriting'].includes(c.stage)).length;
    
    const sanctionedCases = loanCases.filter(c => ['Sanctioned', 'Disbursed', 'Subsidy Claimed'].includes(c.stage));
    const totalSanctioned = sanctionedCases.reduce((acc, c) => acc + (Number(c.bankDetails?.sanctionedAmount) || Number(c.requiredAmount) || 0), 0);
    
    const disbursedCases = loanCases.filter(c => ['Disbursed', 'Subsidy Claimed'].includes(c.stage));
    const totalDisbursed = disbursedCases.reduce((acc, c) => acc + (Number(c.bankDetails?.disbursedAmount) || Number(c.requiredAmount) || 0), 0);
    
    const subsidyCases = loanCases.filter(c => c.subsidy?.eligible);
    const totalSubsidyClaimed = subsidyCases.reduce((acc, c) => acc + (Number(c.subsidy?.subsidyAmount) || 0), 0);

    return {
      totalCount: loanCases.length,
      totalPipeline,
      inUnderwriting,
      sanctionedCount: sanctionedCases.length,
      totalSanctioned,
      disbursedCount: disbursedCases.length,
      totalDisbursed,
      totalSubsidyClaimed
    };
  }, [loanCases]);

  const formatLakhsCr = (amount) => {
    if (!amount) return '₹0';
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(amount / 100000).toFixed(1)} Lakhs`;
  };

  const getStageBadge = (stage) => {
    switch (stage) {
      case 'Sanctioned':
        return <span className="badge badge-emerald"><CheckCircle2 size={12} /> Sanction Letter Issued</span>;
      case 'Disbursed':
        return <span className="badge badge-emerald" style={{ background: '#059669', color: '#fff' }}><Award size={12} /> Disbursed</span>;
      case 'Subsidy Claimed':
        return <span className="badge badge-emerald" style={{ background: '#047857', color: '#fff' }}>Subsidy TDR Locked</span>;
      case 'Bank Underwriting':
        return <span className="badge badge-blue"><Clock size={12} /> Bank Underwriting & FI</span>;
      case 'Portal Login':
        return <span className="badge badge-blue">JanSamarth Portal Logged</span>;
      case 'DPR Preparation':
        return <span className="badge badge-amber">DPR & CMA In Prep</span>;
      case 'Doc Collection':
        return <span className="badge badge-amber">Docs Collection</span>;
      case 'Rejected':
        return <span className="badge" style={{ background: '#fee2e2', color: '#dc2626' }}>Query / Rejected</span>;
      default:
        return <span className="badge badge-slate">New Lead / Inquiry</span>;
    }
  };

  // Grouping for Kanban view
  const kanbanColumns = [
    { id: 'lead_docs', title: '1. Inquiry & Docs', stages: ['Inquiry', 'Doc Collection'] },
    { id: 'dpr_portal', title: '2. DPR, CMA & Portal', stages: ['DPR Preparation', 'Portal Login'] },
    { id: 'bank_underwriting', title: '3. Bank Underwriting & FI', stages: ['Bank Underwriting'] },
    { id: 'sanctioned', title: '4. Sanction Letter Issued', stages: ['Sanctioned'] },
    { id: 'disbursed_subsidy', title: '5. Disbursed & Subsidy', stages: ['Disbursed', 'Subsidy Claimed'] }
  ];

  return (
    <div className="crm-loan-cases">
      {/* Top Banner */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-saffron">DUS Banking & Underwriting Hub</span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>• JanSamarth / KVIC / Lead Bank Liaison</span>
          </div>
          <h2 style={{ fontSize: '1.65rem', color: '#0b1727', margin: 0, fontWeight: '800' }}>
            Government & MSME Loan Cases
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Comprehensive loan docketing, CMA financial modelling, bank branch tracking, and capital subsidy management.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Toggle */}
          <div style={{ background: '#f1f5f9', padding: '3px', borderRadius: '8px', display: 'flex', gap: '2px' }}>
            <button 
              onClick={() => setViewMode('table')}
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-white' : 'btn-ghost'}`}
              style={{ padding: '6px 10px', fontSize: '0.8rem' }}
              title="Table Grid View"
            >
              <LayoutList size={15} />
              <span>Table</span>
            </button>
            <button 
              onClick={() => setViewMode('kanban')}
              className={`btn btn-sm ${viewMode === 'kanban' ? 'btn-white' : 'btn-ghost'}`}
              style={{ padding: '6px 10px', fontSize: '0.8rem' }}
              title="Pipeline Stage View"
            >
              <Kanban size={15} />
              <span>Pipeline</span>
            </button>
          </div>

          <button 
            onClick={() => setIsNewLoanModalOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ fontWeight: '700' }}
          >
            <Plus size={16} />
            <span>+ New Loan Case</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="crm-stats-grid mb-6">
        <div className="crm-stat-card">
          <div>
            <div className="crm-stat-title">Active Loan Pipeline</div>
            <div className="crm-stat-value" style={{ color: '#0b1727' }}>
              {formatLakhsCr(stats.totalPipeline)}
            </div>
            <div className="crm-stat-trend" style={{ color: '#64748b' }}>
              <span>{stats.totalCount} active files in system</span>
            </div>
          </div>
          <div className="crm-stat-icon" style={{ background: '#f8fafc', color: '#0b1727' }}>
            <Banknote size={24} />
          </div>
        </div>

        <div className="crm-stat-card">
          <div>
            <div className="crm-stat-title">In Bank Underwriting</div>
            <div className="crm-stat-value" style={{ color: '#2563eb' }}>
              {stats.inUnderwriting} Cases
            </div>
            <div className="crm-stat-trend" style={{ color: '#2563eb' }}>
              <span>CMA, Portal & Branch FI</span>
            </div>
          </div>
          <div className="crm-stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Clock size={24} />
          </div>
        </div>

        <div className="crm-stat-card">
          <div>
            <div className="crm-stat-title">Sanctioned Amount</div>
            <div className="crm-stat-value" style={{ color: '#10b981' }}>
              {formatLakhsCr(stats.totalSanctioned)}
            </div>
            <div className="crm-stat-trend" style={{ color: '#10b981' }}>
              <TrendingUp size={14} />
              <span>{stats.sanctionedCount} Sanction Letters issued</span>
            </div>
          </div>
          <div className="crm-stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <FileCheck size={24} />
          </div>
        </div>

        <div className="crm-stat-card">
          <div>
            <div className="crm-stat-title">Total Disbursed</div>
            <div className="crm-stat-value" style={{ color: '#059669' }}>
              {formatLakhsCr(stats.totalDisbursed)}
            </div>
            <div className="crm-stat-trend" style={{ color: '#059669' }}>
              <span>{stats.disbursedCount} Loans in borrower account</span>
            </div>
          </div>
          <div className="crm-stat-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
            <Award size={24} />
          </div>
        </div>

        <div className="crm-stat-card">
          <div>
            <div className="crm-stat-title">Govt Subsidy Claimed</div>
            <div className="crm-stat-value" style={{ color: '#ff6f00' }}>
              {formatLakhsCr(stats.totalSubsidyClaimed)}
            </div>
            <div className="crm-stat-trend" style={{ color: '#ff6f00' }}>
              <span>PMEGP 15%-35% Margin Money</span>
            </div>
          </div>
          <div className="crm-stat-icon" style={{ background: '#fff7ed', color: '#ff6f00' }}>
            <ShieldCheck size={24} />
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div style={{ background: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Search Box */}
          <div className="relative" style={{ flex: '1', minWidth: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search by Case ID, Applicant, Business, City, or Bank..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '38px', fontSize: '0.88rem' }}
            />
          </div>

          {/* Scheme Quick Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['ALL', 'PMEGP', 'Mudra', 'CGTMSE', 'Machinery'].map(scheme => (
              <button
                key={scheme}
                onClick={() => setSelectedScheme(scheme)}
                className={`btn btn-xs ${selectedScheme === scheme ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.78rem', padding: '5px 12px', borderRadius: '20px' }}
              >
                {scheme === 'ALL' ? 'All Schemes' : scheme}
              </button>
            ))}
          </div>

          {/* Bank Dropdown */}
          <select 
            value={selectedBank} 
            onChange={(e) => setSelectedBank(e.target.value)}
            className="form-control"
            style={{ width: 'auto', minWidth: '160px', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Partner Banks</option>
            <option value="SBI">State Bank of India (SBI)</option>
            <option value="PNB">Punjab National Bank (PNB)</option>
            <option value="Baroda">Bank of Baroda (BOB)</option>
            <option value="Canara">Canara Bank</option>
            <option value="Union">Union Bank of India</option>
          </select>

          {/* Stage Dropdown */}
          <select 
            value={selectedStage} 
            onChange={(e) => setSelectedStage(e.target.value)}
            className="form-control"
            style={{ width: 'auto', minWidth: '160px', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Underwriting Stages</option>
            {loanStagesMaster.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content: Table View */}
      {viewMode === 'table' ? (
        <div className="table-wrapper" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Applicant & Unit</th>
                <th>Scheme & Purpose</th>
                <th>Loan Amount</th>
                <th>Target Bank & Branch</th>
                <th>Credit & CIBIL</th>
                <th>Processing Stage</th>
                <th>Subsidy Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '48px 20px', color: '#94a3b8' }}>
                    <div style={{ display: 'inline-flex', padding: '16px', background: '#f8fafc', borderRadius: '50%', marginBottom: '12px' }}>
                      <AlertCircle size={32} style={{ color: '#cbd5e1' }} />
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#475569' }}>No loan cases match your filter</div>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Try changing your scheme, bank, or search criteria.</div>
                  </td>
                </tr>
              ) : (
                filteredCases.map(c => (
                  <tr 
                    key={c.id} 
                    style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                    onClick={() => setSelectedLoanForDetail(c)}
                  >
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', color: '#0b1727', fontSize: '0.88rem' }}>
                        {c.id}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{c.applicationDate}</div>
                    </td>

                    <td>
                      <div style={{ fontWeight: '700', color: '#0b1727', fontSize: '0.92rem' }}>
                        {c.businessName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        👤 {c.applicantName} • <span style={{ color: '#ff6f00' }}>{c.city}</span>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: '700', color: '#2563eb', fontSize: '0.85rem' }}>
                        {c.scheme}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.loanPurpose}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: '800', fontFamily: 'var(--font-mono)', fontSize: '0.96rem', color: '#0b1727' }}>
                        ₹{Number(c.requiredAmount).toLocaleString('en-IN')}
                      </div>
                      {c.bankDetails?.sanctionedAmount > 0 && (
                        <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '700' }}>
                          ✓ Sanc: ₹{Number(c.bankDetails.sanctionedAmount).toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>

                    <td>
                      <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.85rem' }}>
                        {c.bankDetails?.lenderName || 'Not Assigned'}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        {c.bankDetails?.branch || 'Branch Review'}
                      </div>
                    </td>

                    <td>
                      <div className="flex items-center gap-1.5">
                        <span style={{ 
                          fontWeight: '800', 
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.88rem',
                          color: c.cibilScore >= 750 ? '#059669' : c.cibilScore >= 700 ? '#d97706' : '#dc2626'
                        }}>
                          {c.cibilScore || 'N/A'}
                        </span>
                        <span className="badge badge-slate" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                          {c.cibilStatus || 'Good'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        Vintage: {c.vintageYears} Yrs
                      </div>
                    </td>

                    <td>
                      {getStageBadge(c.stage)}
                    </td>

                    <td>
                      {c.subsidy?.eligible ? (
                        <div>
                          <span className="badge badge-saffron" style={{ fontSize: '0.72rem' }}>
                            {c.subsidy.subsidyPercent}% Subsidy
                          </span>
                          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '700', marginTop: '2px' }}>
                            ₹{Number(c.subsidy.subsidyAmount).toLocaleString('en-IN')}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Non-Subsidy</span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLoanForDetail(c);
                        }}
                        className="btn btn-sm btn-outline"
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        <span>View Docket</span>
                        <ChevronRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Kanban Pipeline View */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', alignItems: 'start' }}>
          {kanbanColumns.map(col => {
            const colCases = filteredCases.filter(c => col.stages.includes(c.stage));
            const colTotal = colCases.reduce((acc, c) => acc + (Number(c.requiredAmount) || 0), 0);

            return (
              <div 
                key={col.id}
                style={{ 
                  background: '#f8fafc', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0', 
                  padding: '14px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.92rem', color: '#0b1727', fontWeight: '700' }}>
                      {col.title}
                    </h4>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      {colCases.length} files • {formatLakhsCr(colTotal)}
                    </div>
                  </div>
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#fff', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#0b1727' }}>
                    {colCases.length}
                  </span>
                </div>

                {colCases.length === 0 ? (
                  <div style={{ padding: '24px 12px', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
                    No files in this stage
                  </div>
                ) : (
                  colCases.map(c => (
                    <div 
                      key={c.id}
                      onClick={() => setSelectedLoanForDetail(c)}
                      style={{ 
                        background: '#fff', 
                        borderRadius: '10px', 
                        padding: '14px', 
                        border: '1px solid #e2e8f0', 
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        cursor: 'pointer',
                        transition: 'transform 0.15s, box-shadow 0.15s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                      }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', fontSize: '0.76rem', color: '#ff6f00' }}>
                          {c.id}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          {c.city}
                        </span>
                      </div>

                      <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0b1727', marginBottom: '4px' }}>
                        {c.businessName}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: '600', marginBottom: '8px' }}>
                        {c.scheme}
                      </div>

                      <div className="flex justify-between items-center pt-2" style={{ borderTop: '1px solid #f1f5f9' }}>
                        <div style={{ fontWeight: '800', fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: '#0b1727' }}>
                          ₹{Number(c.requiredAmount).toLocaleString('en-IN')}
                        </div>
                        <span className="badge badge-slate" style={{ fontSize: '0.68rem' }}>
                          CIBIL {c.cibilScore}
                        </span>
                      </div>

                      <div style={{ marginTop: '8px', fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Building2 size={12} />
                        <span>{c.bankDetails?.lenderName || 'Bank Pending'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
