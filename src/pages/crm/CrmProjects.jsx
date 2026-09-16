import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Briefcase, Search, Filter, MapPin, User, CheckCircle2, 
  Clock, ArrowUpRight, Building, Plus, AlertCircle, AlertTriangle, 
  RotateCcw, Truck, FileText, Check, ShieldCheck, IndianRupee, 
  Layers, ExternalLink, Calendar, MessageSquare, Phone
} from 'lucide-react';

export const CrmProjects = () => {
  const { projects, setProjects, setSelectedProjectForDetail, showToast } = useApp();

  // Filters
  const [search, setSearch] = useState('');
  const [streamFilter, setStreamFilter] = useState('All'); // 'All' | 'Govt_Scheme_Loan' | 'Fast_Compliance' | 'DPR_Financial'
  const [executionFilter, setExecutionFilter] = useState('All'); // 'All' | 'In_House' | 'Outsourced'
  const [stageFilter, setStageFilter] = useState('All');

  // New Project Onboarding Modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newService, setNewService] = useState('PMEGP Govt Loan (₹25 Lakhs) & DPR');
  const [newStream, setNewStream] = useState('Govt_Scheme_Loan');
  const [newExecMode, setNewExecMode] = useState('In_House');
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorCost, setNewVendorCost] = useState('');
  const [newAgreementSigned, setNewAgreementSigned] = useState(true);
  const [newFee, setNewFee] = useState('15000');

  // Filter Logic
  const filtered = projects.filter(p => {
    const stream = p.serviceStream || (p.serviceCategory?.includes('Banking') ? 'Govt_Scheme_Loan' : 'Fast_Compliance');
    const mode = p.executionMode || 'In_House';
    const stage = p.lifecycleStage || 'Dept_Portal';

    const matchesSearch = 
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      p.service.toLowerCase().includes(search.toLowerCase()) ||
      p.projectCode.toLowerCase().includes(search.toLowerCase()) ||
      (p.currentLocation && p.currentLocation.toLowerCase().includes(search.toLowerCase())) ||
      (p.outsourceDetails?.vendorName && p.outsourceDetails.vendorName.toLowerCase().includes(search.toLowerCase()));
    
    const matchesStream = streamFilter === 'All' || stream === streamFilter;
    const matchesExecution = executionFilter === 'All' || mode === executionFilter;
    const matchesStage = stageFilter === 'All' || stage === stageFilter || p.currentStatus.includes(stageFilter);

    return matchesSearch && matchesStream && matchesExecution && matchesStage;
  });

  // KPI Calculations
  const totalCases = projects.length;
  const inHouseCount = projects.filter(p => (p.executionMode || 'In_House') === 'In_House').length;
  const outsourcedCount = projects.filter(p => p.executionMode === 'Outsourced').length;
  const activeQueriesCount = projects.filter(p => p.departmentDetails?.queries?.some(q => !q.status?.includes('Resolved'))).length;
  const activeSubsidyClaimsCount = projects.filter(p => p.lifecycleStage === 'Subsidy_Claim' || p.subsidyClaim?.fastActionRequired).length;

  const handleCreateNewProject = (e) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) return;

    const newIdNum = Math.floor(100 + Math.random() * 900);
    const newProjectObj = {
      id: `PRJ-2026-${newIdNum}`,
      projectCode: `DUS-PRJ-${newIdNum}`,
      customerId: `CUST-${newIdNum}`,
      customerName: newCustName,
      contactPerson: newCustName,
      phone: newCustPhone,
      service: newService,
      serviceCategory: newStream === 'Govt_Scheme_Loan' ? 'Govt Banking & Subsidies' : newStream === 'DPR_Financial' ? 'Financial Modeling' : 'Statutory Compliance',
      serviceStream: newStream,
      executionMode: newExecMode,
      assignedDesk: newExecMode === 'In_House' ? 'Cabin #03 (Govt Subsidy & Project Desk)' : 'Outsource Coordinator Desk',
      assignedPerson: {
        name: newExecMode === 'In_House' ? 'Vikramaditya Rathore' : 'Virendra Singh',
        role: newExecMode === 'In_House' ? 'Senior Project Consultant' : 'Outsource Manager',
        phone: '+91 97840 44192',
        email: 'consulting@digitaludyogseva.com'
      },
      lifecycleStage: 'Support_Collection',
      currentStatus: 'Support Doc Collection',
      currentProcess: 'Case onboarded; Online document upload & agreement links issued',
      currentLocation: 'DUS Headquarters, Jaipur',
      legalAgreement: {
        signed: newAgreementSigned,
        agreementNo: `DUS-AGR-2026-${newIdNum}`,
        signedDate: new Date().toISOString().split('T')[0],
        feePackage: `₹${Number(newFee).toLocaleString('en-IN')} Consultation Retainer`,
        initialFeeCollected: Number(newFee) || 15000,
        agreementDoc: 'Signed_Client_Agreement.pdf'
      },
      qaHandover: {
        status: 'In_Support_Collection',
        collectedBy: 'Pooja Sharma (Support Desk)',
        verifiedBy: 'Pending Verification',
        bouncedHistory: []
      },
      departmentDetails: {
        departmentName: 'District Industries Centre (DIC) / MSME Desk',
        portalName: 'Govt Department SSO Portal',
        applicationNo: 'Pending Generation',
        submissionDate: null,
        portalStatus: 'Drafted',
        queries: []
      },
      bankLiaison: {
        bankName: 'State Bank of India (SBI)',
        branchName: 'Main Commercial Branch',
        branchManager: 'Branch Credit Officer',
        branchPhone: '+91 94140 00000',
        fileReceivedDate: 'Pending',
        scrutinyStatus: 'Pending',
        cmaRevisionRequired: false,
        cmaRevisionNotes: '',
        sanctionStatus: 'Under Appraisal',
        sanctionAmount: 2500000
      },
      subsidyClaim: {
        schemeName: 'Government Subsidy Scheme',
        subsidyAmountExpected: 625000,
        targetDaysToClaim: 30,
        claimWindowDeadline: 'Pending Sanction',
        daysRemaining: 30,
        claimPortal: 'Nodal Subsidy Portal',
        claimStatus: 'Awaiting Sanction',
        tdrAccountNo: 'Pending',
        fastActionRequired: false
      },
      outsourceDetails: newExecMode === 'Outsourced' ? {
        vendorName: newVendorName || 'M/s External Legal Associates',
        contactPerson: 'Advocate In-charge',
        phone: '+91 98290 00000',
        agreedCost: Number(newVendorCost) || 5000,
        paidStatus: 'Pending',
        handoverDate: new Date().toISOString().split('T')[0],
        deliveryDueDate: '2026-09-25',
        vendorStatus: 'File assigned to external partner',
        deliverableUploaded: false
      } : null,
      documents: [
        { name: 'Applicant KYC (PAN & Aadhaar)', required: true, status: 'Verified' },
        { name: 'Business Premises Proof / Rent Deed', required: true, status: 'Pending' },
        { name: 'Project Machinery Quotations', required: true, status: 'Pending' }
      ],
      tasks: [
        { id: 'T-01', task: 'Collect signed legal agreement copy', done: newAgreementSigned, dueDate: '2026-09-10', assignee: 'Pooja Sharma' },
        { id: 'T-02', task: 'Complete document verification at Support Desk', done: false, dueDate: '2026-09-12', assignee: 'Pooja Sharma' }
      ],
      timeline: [
        { stage: 'Case Onboarded & Initial Fee Collected', targetDate: 'Today', actualDate: 'Today', done: true }
      ]
    };

    setProjects([newProjectObj, ...projects]);
    setShowNewModal(false);
    showToast(`✓ Project #${newProjectObj.projectCode} onboarded successfully!`);

    // Reset Form
    setNewCustName('');
    setNewCustPhone('');
    setNewVendorName('');
    setNewVendorCost('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#0b1727' }}>
      
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0b1727 0%, #1e293b 50%, #0f172a 100%)',
        color: '#fff',
        padding: '20px 24px',
        borderRadius: '14px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.25)'
      }}>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="badge badge-saffron" style={{ fontSize: '0.72rem' }}>
                MSME Project &amp; Government File Command Hub
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                Active Portfolio: ₹2.40+ Crore Underwriting
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '900', margin: 0, color: '#fff' }}>
              Project Execution, Department Objections &amp; Bank Liaison Desk
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#cbd5e1' }}>
              Track 10-stage lifecycle, DIC/KVIC queries, bank revisions, subsidy countdowns, and In-House vs Outsourced delivery.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="btn btn-sm btn-primary"
            style={{ background: 'linear-gradient(135deg, #ff6f00, #ea580c)', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} />
            <span>+ Onboard New Project / File</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div className="card" style={{ padding: '16px', borderLeft: '4px solid #ff6f00' }}>
          <small style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: '700' }}>Active Projects &amp; Files</small>
          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ea580c', fontFamily: 'var(--font-mono)' }}>
            {totalCases} Cases
          </div>
          <small style={{ color: '#64748b' }}>Govt Loans, DPRs &amp; Fast Compliance</small>
        </div>

        <div className="card" style={{ padding: '16px', borderLeft: '4px solid #10b981' }}>
          <small style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: '700' }}>Execution Routing Split</small>
          <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#15803d' }}>
            {inHouseCount} Office • {outsourcedCount} Outsource
          </div>
          <small style={{ color: '#64748b' }}>Internal Desks vs External CA/CS/Advocates</small>
        </div>

        <div className="card" style={{ padding: '16px', borderLeft: '4px solid #ef4444' }}>
          <small style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: '700' }}>Dept / Bank Active Objections</small>
          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#dc2626', fontFamily: 'var(--font-mono)' }}>
            {activeQueriesCount} Queries
          </div>
          <small style={{ color: '#dc2626', fontWeight: '600' }}>Immediate Portal Reply Required</small>
        </div>

        <div className="card" style={{ padding: '16px', borderLeft: '4px solid #3b82f6' }}>
          <small style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: '700' }}>Active Subsidy Claims (Timer)</small>
          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1d4ed8', fontFamily: 'var(--font-mono)' }}>
            {activeSubsidyClaimsCount} Files in Window
          </div>
          <small style={{ color: '#64748b' }}>Fast-Track Countdown Following Disbursal</small>
        </div>
      </div>

      {/* Multi-Dimensional Filter Bar */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 18px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1, minWidth: '300px' }}>
          {/* Universal Search */}
          <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
            <input
              type="text"
              placeholder="Search code, client, service, vendor, bank..."
              className="form-control"
              style={{ fontSize: '0.82rem', paddingLeft: '32px' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
          </div>

          {/* Service Stream */}
          <select
            className="form-control"
            style={{ width: '180px', fontSize: '0.82rem' }}
            value={streamFilter}
            onChange={e => setStreamFilter(e.target.value)}
          >
            <option value="All">All Streams</option>
            <option value="Govt_Scheme_Loan">🏛️ Govt Scheme Loans</option>
            <option value="Fast_Compliance">⚡ Fast Compliance &amp; Licenses</option>
            <option value="DPR_Financial">📊 DPR &amp; CMA Modeling</option>
          </select>

          {/* Execution Routing */}
          <select
            className="form-control"
            style={{ width: '170px', fontSize: '0.82rem' }}
            value={executionFilter}
            onChange={e => setExecutionFilter(e.target.value)}
          >
            <option value="All">All Execution</option>
            <option value="In_House">🏢 In-House Office</option>
            <option value="Outsourced">🤝 Outsourced Partner</option>
          </select>

          {/* Pipeline Stage */}
          <select
            className="form-control"
            style={{ width: '170px', fontSize: '0.82rem' }}
            value={stageFilter}
            onChange={e => setStageFilter(e.target.value)}
          >
            <option value="All">All Stages</option>
            <option value="Support_Collection">📥 Support Collection</option>
            <option value="Bounced">⚠️ Bounced to Support</option>
            <option value="Dept_Portal">🌐 Dept Portal Submission</option>
            <option value="Dept_Query">⚠️ Dept Query Active</option>
            <option value="Bank_Branch_Liaison">🏦 Bank Branch Scrutiny</option>
            <option value="Bank_Sanctioned">🎉 Bank Sanctioned</option>
            <option value="Subsidy_Claim">⏱️ Subsidy Claim Active</option>
          </select>
        </div>

        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700' }}>
          Showing {filtered.length} of {projects.length} Files
        </span>
      </div>

      {/* Projects Master Table */}
      <div className="table-wrapper">
        <table className="data-table" style={{ fontSize: '0.84rem' }}>
          <thead>
            <tr>
              <th>Case Code &amp; Client</th>
              <th>Service &amp; Stream</th>
              <th>Execution Routing</th>
              <th>10-Stage Milestone &amp; Current Location</th>
              <th>Legal Contract</th>
              <th>Key Dept / Bank Indicator</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(proj => {
              const stream = proj.serviceStream || (proj.serviceCategory?.includes('Banking') ? 'Govt_Scheme_Loan' : 'Fast_Compliance');
              const isOutsourced = proj.executionMode === 'Outsourced';
              const isBounced = proj.qaHandover?.status === 'Bounced_To_Support';
              const hasUnresolvedQuery = proj.departmentDetails?.queries?.some(q => !q.status?.includes('Resolved'));

              return (
                <tr key={proj.id}>
                  <td>
                    <div style={{ fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#ff6f00' }}>
                      {proj.projectCode}
                    </div>
                    <strong style={{ color: '#0b1727', fontSize: '0.88rem' }}>{proj.customerName}</strong>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      👤 {proj.contactPerson} ({proj.phone})
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: '700', color: '#0b1727' }}>{proj.service}</div>
                    <span className={`badge ${stream === 'Govt_Scheme_Loan' ? 'badge-blue' : stream === 'Fast_Compliance' ? 'badge-amber' : 'badge-purple'}`} style={{ fontSize: '0.68rem', marginTop: '2px' }}>
                      {stream === 'Govt_Scheme_Loan' ? '🏛️ Scheme Loan' : stream === 'Fast_Compliance' ? '⚡ Compliance' : '📊 DPR / CMA'}
                    </span>
                  </td>

                  <td>
                    {isOutsourced ? (
                      <div>
                        <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                          🤝 Outsourced
                        </span>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0b1727', marginTop: '2px' }}>
                          {proj.outsourceDetails?.vendorName || 'External Partner'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: '700' }}>
                          Cost: ₹{Number(proj.outsourceDetails?.agreedCost || 0).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                          🏢 In-House Desk
                        </span>
                        <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '2px' }}>
                          {proj.assignedPerson?.name || 'Cabin Desk'}
                        </div>
                      </div>
                    )}
                  </td>

                  <td>
                    <div className="flex items-center gap-1 mb-1">
                      {isBounced ? (
                        <span className="badge badge-rose" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <AlertTriangle size={11} /> Bounced to Support
                        </span>
                      ) : (
                        <span className="badge badge-saffron" style={{ fontSize: '0.7rem' }}>
                          {proj.currentStatus}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#334155', lineHeight: '1.2' }}>
                      {proj.currentProcess}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '3px' }}>
                      📍 {proj.currentLocation}
                    </div>
                  </td>

                  <td>
                    {proj.legalAgreement?.signed ? (
                      <div>
                        <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                          ✓ Signed
                        </span>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                          {proj.legalAgreement.agreementNo}
                        </div>
                      </div>
                    ) : (
                      <span className="badge badge-rose" style={{ fontSize: '0.68rem' }}>
                        Agreement Pending
                      </span>
                    )}
                  </td>

                  <td>
                    {hasUnresolvedQuery ? (
                      <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>
                        ⚠️ Dept Query Active
                      </span>
                    ) : proj.subsidyClaim?.fastActionRequired ? (
                      <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                        ⏱️ {proj.subsidyClaim.daysRemaining}d Subsidy Claim
                      </span>
                    ) : proj.bankLiaison?.sanctionStatus === 'Sanctioned' ? (
                      <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                        🎉 Bank Sanctioned
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {proj.departmentDetails?.portalStatus || 'In Process'}
                      </span>
                    )}
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div className="flex items-center gap-1 justify-end flex-wrap">
                      <button
                        type="button"
                        onClick={() => setSelectedProjectForDetail(proj)}
                        className="btn btn-sm btn-primary"
                        style={{ fontSize: '0.75rem', padding: '5px 12px', background: 'linear-gradient(135deg, #ff6f00, #ea580c)' }}
                      >
                        Open Dossier →
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ======================================================== */}
      {/* MODAL: ONBOARD NEW PROJECT / CASE                        */}
      {/* ======================================================== */}
      {showNewModal && (
        <div className="modal-overlay" style={{ zIndex: 1200 }} onClick={() => setShowNewModal(false)}>
          <div className="modal-card" style={{ maxWidth: '580px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4 style={{ fontSize: '1.15rem', margin: 0 }}>Onboard New Project &amp; File Execution</h4>
              <button onClick={() => setShowNewModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleCreateNewProject}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label className="form-label">Client / Business Name *</label>
                    <input type="text" required placeholder="e.g. Goyal Bio Fuels Pvt Ltd" className="form-control" value={newCustName} onChange={e => setNewCustName(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Client Mobile Phone *</label>
                    <input type="tel" required placeholder="+91 98290..." className="form-control" value={newCustPhone} onChange={e => setNewCustPhone(e.target.value)} />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Service Stream &amp; Category *</label>
                  <select value={newStream} onChange={e => setNewStream(e.target.value)} className="form-control">
                    <option value="Govt_Scheme_Loan">🏛️ Government Scheme Loans (PMEGP, MLUPY, PMFME, Mudra)</option>
                    <option value="Fast_Compliance">⚡ Fast Compliance &amp; Licensing (PWD, Labour, FSSAI, Pollution, GST)</option>
                    <option value="DPR_Financial">📊 Financial Modeling &amp; CMA Project Report</option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Service Title *</label>
                  <input type="text" required placeholder="e.g. PMEGP ₹35L Loan & Rice Mill DPR" className="form-control" value={newService} onChange={e => setNewService(e.target.value)} />
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Execution Routing *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="exec" value="In_House" checked={newExecMode === 'In_House'} onChange={() => setNewExecMode('In_House')} />
                      <span>🏢 In-House Office Desk</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="exec" value="Outsourced" checked={newExecMode === 'Outsourced'} onChange={() => setNewExecMode('Outsourced')} />
                      <span>🤝 Outsourced to External Partner</span>
                    </label>
                  </div>
                </div>

                {newExecMode === 'Outsourced' && (
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px', marginBottom: '14px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '10px' }}>
                      <div>
                        <label className="form-label text-xs">Outsource Vendor / CA / Advocate Firm</label>
                        <input type="text" placeholder="e.g. Shree Shyam Legal Consultants" className="form-control" value={newVendorName} onChange={e => setNewVendorName(e.target.value)} />
                      </div>
                      <div>
                        <label className="form-label text-xs">Agreed Vendor Payout (₹)</label>
                        <input type="number" placeholder="5000" className="form-control" value={newVendorCost} onChange={e => setNewVendorCost(e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                  <div>
                    <label className="form-label">Initial Consulting Fee (₹)</label>
                    <input type="number" placeholder="15000" className="form-control" value={newFee} onChange={e => setNewFee(e.target.value)} />
                  </div>
                  <div style={{ paddingTop: '24px' }}>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-800">
                      <input type="checkbox" checked={newAgreementSigned} onChange={e => setNewAgreementSigned(e.target.checked)} />
                      <span>Sign Legal Contract (विवादों से बचाव हेतु)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowNewModal(false)} className="btn btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Onboard Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
