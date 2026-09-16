import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, Briefcase, FileText, CheckSquare, Clock, MapPin, User, Building, 
  Award, CheckCircle2, Calendar, PackageCheck, Send, AlertCircle, 
  Truck, ArrowRight, RotateCcw, AlertTriangle, ShieldCheck, IndianRupee, 
  Phone, Mail, MessageSquare, ExternalLink, Download, Upload, Plus, 
  Check, RefreshCw, Layers, Sparkles, Building2, HelpCircle
} from 'lucide-react';

export const ProjectDetailModal = () => {
  const { 
    selectedProjectForDetail, 
    setSelectedProjectForDetail, 
    toggleProjectTask, 
    updateProjectStatus, 
    showToast 
  } = useApp();

  // Active Tab:
  // 'pipeline_10' | 'dept_queries' | 'bank_liaison' | 'subsidy_claim' | 'qa_handover' | 'outsource_desk' | 'docs_agreement' | 'tasks_notes'
  const [activeTab, setActiveTab] = useState('pipeline_10');

  // Modals inside detail:
  const [showBounceModal, setShowBounceModal] = useState(false);
  const [bounceReason, setBounceReason] = useState('');
  
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [queryRaisedBy, setQueryRaisedBy] = useState('DIC Scrutiny Desk');
  const [queryText, setQueryText] = useState('');
  const [queryReply, setQueryReply] = useState('');

  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('');

  const [newNoteText, setNewNoteText] = useState('');

  if (!selectedProjectForDetail) return null;
  const proj = selectedProjectForDetail;

  // Fallback defaults if missing in older project objects
  const executionMode = proj.executionMode || 'In_House';
  const serviceStream = proj.serviceStream || (proj.serviceCategory?.includes('Banking') ? 'Govt_Scheme_Loan' : 'Fast_Compliance');
  const legalAgreement = proj.legalAgreement || {
    signed: true,
    agreementNo: 'DUS-AGR-2026-081',
    signedDate: '2026-08-20',
    feePackage: 'Consultancy Retainer Fee Collected',
    initialFeeCollected: 15000,
    agreementDoc: 'Signed_Legal_Agreement.pdf'
  };

  const qaHandover = proj.qaHandover || {
    status: 'Approved_For_Submission',
    collectedBy: 'Pooja Sharma (Support Desk)',
    verifiedBy: 'Virendra Singh (Operations Head)',
    bouncedHistory: []
  };

  const departmentDetails = proj.departmentDetails || {
    departmentName: 'District Industries Centre (DIC) / MSME Desk',
    portalName: 'Govt Department Portal',
    applicationNo: 'APP-2026-88190',
    submissionDate: '2026-08-25',
    portalStatus: 'Under Scrutiny',
    queries: []
  };

  const bankLiaison = proj.bankLiaison || {
    bankName: 'State Bank of India (SBI)',
    branchName: 'Main SME Branch',
    branchManager: 'Branch Credit Manager',
    branchPhone: '+91 94140 00000',
    fileReceivedDate: '2026-09-01',
    scrutinyStatus: 'Technical Appraisal In-Progress',
    cmaRevisionRequired: false,
    cmaRevisionNotes: '',
    sanctionStatus: 'Under Appraisal',
    sanctionAmount: 2500000
  };

  const subsidyClaim = proj.subsidyClaim || {
    schemeName: 'Capital / Interest Subsidy Scheme',
    subsidyAmountExpected: 500000,
    targetDaysToClaim: 30,
    claimWindowDeadline: '2026-10-15',
    daysRemaining: 25,
    claimPortal: 'Nodal Bank Subsidy Portal',
    claimStatus: 'Awaiting 1st Loan Disbursal',
    tdrAccountNo: 'TDR-PENDING',
    fastActionRequired: false
  };

  const outsourceDetails = proj.outsourceDetails || {
    vendorName: 'M/s External Legal & Associate Consultants',
    contactPerson: 'Lead Advocate / CA',
    phone: '+91 98290 00000',
    agreedCost: 5000,
    paidStatus: 'Paid (100%)',
    handoverDate: '2026-08-28',
    deliveryDueDate: '2026-09-15',
    vendorStatus: 'Work in progress at Government Office',
    deliverableUploaded: false
  };

  // 10-Stage Pipeline Definition
  const pipelineStages = [
    { id: 'Lead_Consult', step: 1, label: 'Lead & Product Consult', desc: 'Scheme feasibility & product alignment' },
    { id: 'Eligibility_Agreement', step: 2, label: 'Eligibility & Legal Agreement', desc: 'Scoring, audit fee & legal contract' },
    { id: 'Support_Collection', step: 3, label: 'Support Doc Collection', desc: 'Online links sent, fees & KYC gathered' },
    { id: 'Operations_QA', step: 4, label: 'Operations QA Check', desc: 'Verification; bounce back if incomplete' },
    { id: 'Dept_Portal', step: 5, label: 'Dept Portal Submission', desc: 'KVIC / DIC / PWD / FoSCoS portal application' },
    { id: 'Dept_Query', step: 6, label: 'Dept Query & Objection Reply', desc: 'Tracking objections & portal replies' },
    { id: 'DLFC_Interview', step: 7, label: 'DLFC / Committee Interview', desc: 'Task force scrutiny or direct bank transfer' },
    { id: 'Bank_Branch_Liaison', step: 8, label: 'Bank Branch Scrutiny & Revision', desc: 'Valuation, search report, CMA revisions' },
    { id: 'Bank_Sanctioned', step: 9, label: 'Bank Sanction & Disbursal', desc: 'Sanction letter issued & 1st drawdown' },
    { id: 'Subsidy_Claim', step: 10, label: 'Subsidy Claim & Target Timer', desc: 'TDR locked, portal subsidy claim follow-up' }
  ];

  // Helper to determine current stage index
  const currentStageIndex = pipelineStages.findIndex(s => s.id === proj.lifecycleStage) !== -1 
    ? pipelineStages.findIndex(s => s.id === proj.lifecycleStage) 
    : 4;

  // Advance to specific stage
  const handleAdvanceStage = (stageId, stageLabel) => {
    proj.lifecycleStage = stageId;
    proj.currentStatus = stageLabel;
    updateProjectStatus(proj.id, stageLabel, `Progressed to ${stageLabel}`, proj.currentLocation);
    showToast(`Project #${proj.projectCode} progressed to "${stageLabel}"!`);
  };

  // Handle Bouncing to Support Desk
  const handleBounceToSupport = () => {
    if (!bounceReason) {
      showToast('Please provide a reason for bouncing the file back to support!');
      return;
    }
    qaHandover.status = 'Bounced_To_Support';
    qaHandover.bouncedHistory.unshift({
      date: new Date().toLocaleDateString('en-GB'),
      reason: bounceReason
    });
    proj.lifecycleStage = 'Support_Collection';
    proj.currentStatus = 'Bounced to Support Desk (Missing Docs)';
    proj.currentProcess = `Operations QA Rejected: ${bounceReason}`;
    
    setShowBounceModal(false);
    setBounceReason('');
    showToast(`File bounced back to Support Desk for customer re-collection!`);
  };

  // Handle QA Approval
  const handleApproveQA = () => {
    qaHandover.status = 'Approved_For_Submission';
    proj.lifecycleStage = 'Dept_Portal';
    proj.currentStatus = 'Approved for Govt Submission';
    proj.currentProcess = 'All documents verified; file ready for online department portal submission';
    showToast(`✓ Documents verified! Project approved for Department Submission.`);
  };

  // Handle Adding Department Query
  const handleAddQuery = (e) => {
    e.preventDefault();
    if (!queryText) return;

    departmentDetails.queries.unshift({
      id: `QRY-0${departmentDetails.queries.length + 1}`,
      raisedBy: queryRaisedBy,
      date: new Date().toISOString().split('T')[0],
      objectionText: queryText,
      replyText: queryReply || 'Reply draft in preparation by operations team.',
      replyDate: queryReply ? new Date().toISOString().split('T')[0] : 'Pending',
      status: queryReply ? 'Reply Submitted on Portal' : 'Action Required',
      clientNotified: true
    });

    proj.lifecycleStage = 'Dept_Query';
    proj.currentStatus = `Dept Query: ${queryRaisedBy}`;
    setShowQueryModal(false);
    setQueryText('');
    setQueryReply('');
    showToast(`Department query logged & WhatsApp alert drafted for ${proj.customerName}!`);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => setSelectedProjectForDetail(null)}>
      <div 
        className="modal-card" 
        style={{ maxWidth: '980px', padding: 0, overflow: 'hidden', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }} 
        onClick={e => e.stopPropagation()}
      >
        {/* ======================================================== */}
        {/* TOP HEADER: PROJECT DOSSIER & REAL-WORLD STATUS          */}
        {/* ======================================================== */}
        <div style={{ background: 'linear-gradient(135deg, #0b1727 0%, #1e293b 50%, #0f172a 100%)', color: '#fff', padding: '18px 24px' }}>
          <div className="flex justify-between items-start flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="badge badge-saffron" style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                  {proj.projectCode}
                </span>
                <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                  {serviceStream === 'Govt_Scheme_Loan' ? '🏛️ Govt Scheme Loan' : serviceStream === 'Fast_Compliance' ? '⚡ Fast Compliance' : '📊 DPR & Financial'}
                </span>
                <span className={`badge ${executionMode === 'In_House' ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.72rem' }}>
                  {executionMode === 'In_House' ? '🏢 In-House Desk' : '🤝 Outsourced Partner'}
                </span>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.72rem' }}>
                  Stage {currentStageIndex + 1}/10: {proj.currentStatus}
                </span>
                {legalAgreement.signed && (
                  <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                    ✓ Legal Contract Signed
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: '1.35rem', color: '#fff', margin: '2px 0 0', fontWeight: '800' }}>
                {proj.service}
              </h2>
              <div className="flex items-center gap-4 flex-wrap" style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '4px' }}>
                <span style={{ color: '#ffa726', fontWeight: '700' }}>Client: {proj.customerName}</span>
                <span>• Contact: <strong>{proj.contactPerson}</strong> ({proj.phone})</span>
                <span>• Assigned: <strong>{proj.assignedPerson?.name || 'Cabin Officer'}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Quick Bounce or Approve Shortcut */}
              {qaHandover.status === 'Bounced_To_Support' ? (
                <button
                  type="button"
                  onClick={handleApproveQA}
                  className="btn btn-sm btn-primary"
                  style={{ background: '#10b981', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Check size={13} /> QA Verify &amp; Handover
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowBounceModal(true)}
                  className="btn btn-sm btn-outline-white"
                  style={{ fontSize: '0.75rem', borderColor: '#f87171', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="If documents are missing, bounce back to support desk"
                >
                  <RotateCcw size={13} /> Bounce to Support
                </button>
              )}

              <button 
                onClick={() => setSelectedProjectForDetail(null)} 
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Close Modal"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 8 HIGH-PERFORMANCE NAVIGATION TABS                       */}
        {/* ======================================================== */}
        <div style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', display: 'flex', overflowX: 'auto', padding: '0 10px' }}>
          {[
            { id: 'pipeline_10', label: '1. 10-Stage Lifecycle Stepper' },
            { id: 'dept_queries', label: `2. Dept Queries & Objections (${departmentDetails.queries?.length || 0})` },
            { id: 'bank_liaison', label: '3. Bank Branch & Revision Liaison' },
            { id: 'subsidy_claim', label: `4. Subsidy Claim (${subsidyClaim.daysRemaining}d left)` },
            { id: 'qa_handover', label: `5. Support vs Ops QA (${qaHandover.status === 'Bounced_To_Support' ? '⚠️ Bounced' : '✓ Ready'})` },
            { id: 'outsource_desk', label: `6. In-House / Outsource (${executionMode === 'Outsourced' ? 'Outsourced' : 'In-House'})` },
            { id: 'docs_agreement', label: `7. Documents & Legal Contract (${proj.documents?.length || 0})` },
            { id: 'tasks_notes', label: `8. Tasks & Notes (${proj.tasks?.filter(t => t.done).length || 0}/${proj.tasks?.length || 0})` }
          ].map(t => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #ff6f00' : '3px solid transparent',
                  color: isActive ? '#ff6f00' : '#475569',
                  fontWeight: isActive ? '800' : '600',
                  padding: '12px 14px',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s'
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* MODAL BODY CONTENT CONTAINER                             */}
        {/* ======================================================== */}
        <div style={{ padding: '22px', overflowY: 'auto', flex: 1, background: '#fff', color: '#0b1727' }}>

          {/* ======================================================== */}
          {/* TAB 1: 10-STAGE LIFECYCLE PIPELINE STEPPER               */}
          {/* ======================================================== */}
          {activeTab === 'pipeline_10' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
                <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                  <div>
                    <h4 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '800', color: '#0b1727' }}>
                      End-to-End Operational Lifecycle Pipeline
                    </h4>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                      Click on any stage to advance the project or inspect requirements at that milestone.
                    </p>
                  </div>
                  <span className="badge badge-saffron" style={{ fontSize: '0.8rem' }}>
                    Current Milestone: {pipelineStages[currentStageIndex]?.label}
                  </span>
                </div>

                {/* Stepper Progress Bar */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginTop: '14px' }}>
                  {pipelineStages.map((stage, idx) => {
                    const isPassed = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    const isUpcoming = idx > currentStageIndex;

                    return (
                      <div
                        key={stage.id}
                        onClick={() => handleAdvanceStage(stage.id, stage.label)}
                        style={{
                          background: isCurrent ? '#fff' : isPassed ? '#f0fdf4' : '#f8fafc',
                          border: isCurrent ? '2px solid #ff6f00' : isPassed ? '1px solid #86efac' : '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '12px',
                          cursor: 'pointer',
                          boxShadow: isCurrent ? '0 4px 12px rgba(255,111,0,0.15)' : 'none',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: isCurrent ? '#ff6f00' : isPassed ? '#10b981' : '#cbd5e1',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.72rem',
                            fontWeight: '800'
                          }}>
                            {isPassed ? '✓' : stage.step}
                          </span>
                          <span style={{ fontSize: '0.68rem', fontWeight: '700', color: isCurrent ? '#ff6f00' : isPassed ? '#15803d' : '#94a3b8' }}>
                            {isCurrent ? 'ACTIVE NOW' : isPassed ? 'COMPLETED' : 'UPCOMING'}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.84rem', fontWeight: '700', color: isCurrent ? '#0b1727' : '#334155', lineHeight: '1.2' }}>
                          {stage.label}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', lineHeight: '1.3' }}>
                          {stage.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Active Stage Context Card */}
              <div className="card" style={{ padding: '18px', borderLeft: '4px solid #ff6f00' }}>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <span className="badge badge-saffron" style={{ fontSize: '0.7rem' }}>
                      Stage #{pipelineStages[currentStageIndex]?.step} Live Status
                    </span>
                    <h3 style={{ fontSize: '1.15rem', margin: '4px 0 2px', fontWeight: '800' }}>
                      {proj.currentProcess}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      📍 Physical Jurisdiction Location: <strong>{proj.currentLocation}</strong>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {currentStageIndex < pipelineStages.length - 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const next = pipelineStages[currentStageIndex + 1];
                          handleAdvanceStage(next.id, next.label);
                        }}
                        className="btn btn-sm btn-primary"
                        style={{ background: 'linear-gradient(135deg, #ff6f00, #ea580c)', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <span>Advance to Next Stage ({pipelineStages[currentStageIndex + 1]?.label})</span>
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: DEPARTMENT QUERIES & OBJECTIONS                   */}
          {/* (User explicit: "kvic kvib Dic collector AHD ya other   */}
          {/*  department se objection aata hai to track karein")      */}
          {/* ======================================================== */}
          {activeTab === 'dept_queries' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '800' }}>
                    Government Department Objections &amp; Query Desk
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                    Target Department: <strong>{departmentDetails.departmentName}</strong> • Portal: <strong>{departmentDetails.portalName}</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowQueryModal(true)}
                  className="btn btn-sm btn-primary"
                  style={{ background: '#d97706', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <Plus size={14} /> Log New Department Query
                </button>
              </div>

              {/* Queries List */}
              {departmentDetails.queries && departmentDetails.queries.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {departmentDetails.queries.map((q, idx) => (
                    <div key={q.id || idx} className="card" style={{ padding: '16px', borderLeft: q.status.includes('Resolved') ? '4px solid #10b981' : '4px solid #ef4444' }}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>{q.id || `QRY-0${idx + 1}`}</span>
                          <strong style={{ fontSize: '0.9rem', color: '#0b1727' }}>Raised by: {q.raisedBy}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>• Date: {q.date}</span>
                        </div>
                        <span className={`badge ${q.status.includes('Resolved') ? 'badge-emerald' : 'badge-rose'}`} style={{ fontSize: '0.72rem' }}>
                          {q.status}
                        </span>
                      </div>

                      {/* Objection Body */}
                      <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px', padding: '10px 14px', marginBottom: '10px' }}>
                        <div style={{ fontSize: '0.72rem', color: '#be123c', fontWeight: '800', textTransform: 'uppercase' }}>
                          Official Department Objection / Notice:
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#9f1239', marginTop: '2px', fontWeight: '600' }}>
                          "{q.objectionText}"
                        </div>
                      </div>

                      {/* Reply Body */}
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', marginBottom: '10px' }}>
                        <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: '800', textTransform: 'uppercase' }}>
                          Portal Reply Submitted by DUS Operations Team:
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#166534', marginTop: '2px' }}>
                          "{q.replyText}"
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                          Reply Submitted Date: <strong>{q.replyDate}</strong>
                        </div>
                      </div>

                      {/* WhatsApp Notify Client Shortcut */}
                      <div className="flex justify-between items-center pt-2 border-t text-xs">
                        <span style={{ color: '#059669', fontWeight: '700' }}>
                          ✓ Customer Notified on WhatsApp / SMS
                        </span>
                        <a
                          href={`https://wa.me/?text=Namaste%20${encodeURIComponent(proj.customerName)},%20regarding%20your%20${encodeURIComponent(proj.service)}%20file:%20Query%20from%20${encodeURIComponent(q.raisedBy)}%20has%20been%20replied%20on%20the%20portal.`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline"
                          style={{ fontSize: '0.72rem', padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px', color: '#059669' }}
                        >
                          <MessageSquare size={12} /> Send WhatsApp Alert
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f8fafc', borderRadius: '12px' }}>
                  <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 8px' }} />
                  <h4 style={{ margin: 0, color: '#0b1727' }}>Zero Department Objections Pending!</h4>
                  <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                    Application #{departmentDetails.applicationNo} on {departmentDetails.portalName} is currently proceeding smoothly without objections.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: BANK BRANCH PROCESSING & REVISION LIAISON         */}
          {/* (User explicit: "file Bank Branch mein a jaati Hai...    */}
          {/*  documents revise karana Bank ka kya process hoga")      */}
          {/* ======================================================== */}
          {activeTab === 'bank_liaison' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <h4 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '800' }}>
                      Bank Branch Appraisal &amp; Liaison Desk
                    </h4>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                      Liaising directly with Branch Credit Manager &amp; Valuation Officers for sanction approval.
                    </p>
                  </div>
                  <span className={`badge ${bankLiaison.sanctionStatus === 'Sanctioned' ? 'badge-emerald' : 'badge-blue'}`} style={{ fontSize: '0.82rem' }}>
                    Sanction Status: {bankLiaison.sanctionStatus}
                  </span>
                </div>
              </div>

              {/* Bank Contact & Scrutiny Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                <div className="card" style={{ padding: '14px' }}>
                  <small style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: '700' }}>Bank &amp; Branch</small>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0b1727' }}>{bankLiaison.bankName}</div>
                  <div style={{ fontSize: '0.78rem', color: '#475569' }}>{bankLiaison.branchName}</div>
                </div>

                <div className="card" style={{ padding: '14px' }}>
                  <small style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: '700' }}>Branch Manager In-Charge</small>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0b1727' }}>{bankLiaison.branchManager}</div>
                  <div style={{ fontSize: '0.78rem', color: '#475569' }}>📞 {bankLiaison.branchPhone}</div>
                </div>

                <div className="card" style={{ padding: '14px' }}>
                  <small style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: '700' }}>Sanction Target Amount</small>
                  <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#15803d', fontFamily: 'var(--font-mono)' }}>
                    ₹{Number(bankLiaison.sanctionAmount || 0).toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>File Inward: {bankLiaison.fileReceivedDate}</div>
                </div>
              </div>

              {/* CMA & Project Report Revision Section */}
              <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '16px' }}>
                <div className="flex justify-between items-center mb-2">
                  <strong style={{ fontSize: '0.9rem', color: '#0b1727' }}>CMA &amp; Project Report Bank Revision:</strong>
                  <span className={`badge ${bankLiaison.cmaRevisionRequired ? 'badge-amber' : 'badge-emerald'}`}>
                    {bankLiaison.cmaRevisionRequired ? '⚠️ Revision Required by Bank' : '✓ CMA Accepted by Bank'}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#475569', margin: '4px 0 10px' }}>
                  {bankLiaison.cmaRevisionNotes || 'No financial revisions pending from bank branch.'}
                </p>
                {bankLiaison.bankQueryLetter && (
                  <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '6px', fontSize: '0.8rem', borderLeft: '3px solid #2563eb' }}>
                    <strong>Bank Query / Scrutiny Letter:</strong> {bankLiaison.bankQueryLetter}
                  </div>
                )}
              </div>

              {/* Sanction Letter Upload or Status */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#15803d', textTransform: 'uppercase' }}>Official Bank Sanction Letter</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#166534', marginTop: '2px' }}>
                    {bankLiaison.sanctionLetterDoc || 'Sanction Letter In-Process with Zonal Approval Desk'}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      bankLiaison.sanctionStatus = 'Sanctioned';
                      handleAdvanceStage('Bank_Sanctioned', 'Bank Loan Sanctioned');
                      showToast(`✓ Loan Sanction for ₹${bankLiaison.sanctionAmount} marked as APPROVED!`);
                    }}
                    className="btn btn-sm btn-primary"
                    style={{ background: '#15803d' }}
                  >
                    ✓ Mark Bank Loan Sanctioned
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: SUBSIDY CLAIM TRACKER & TARGET COUNTDOWN TIMER    */}
          {/* (User explicit: "note Dal dete Hain ki kitne Dinon mein   */}
          {/*  claim karana hai... Fast process karane mein")           */}
          {/* ======================================================== */}
          {activeTab === 'subsidy_claim' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: subsidyClaim.daysRemaining < 20 ? 'linear-gradient(135deg, #7f1d1d, #991b1b)' : 'linear-gradient(135deg, #0b1727, #1e293b)',
                color: '#fff',
                padding: '20px 24px',
                borderRadius: '12px'
              }}>
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <span className="badge badge-saffron" style={{ fontSize: '0.72rem' }}>
                      Official Subsidy Claim Portal Follow-up
                    </span>
                    <h3 style={{ fontSize: '1.3rem', margin: '4px 0 2px', fontWeight: '800' }}>
                      {subsidyClaim.schemeName}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                      Portal: <strong>{subsidyClaim.claimPortal}</strong> • TDR Ref: <strong>{subsidyClaim.tdrAccountNo}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', background: 'rgba(255,255,255,0.1)', padding: '10px 18px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#fef08a', fontWeight: '800', textTransform: 'uppercase' }}>Claim Countdown Timer</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                      {subsidyClaim.daysRemaining} Days Left
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#e2e8f0' }}>Deadline: {subsidyClaim.claimWindowDeadline}</div>
                  </div>
                </div>
              </div>

              {/* Fast Action Checklist */}
              <div className="card" style={{ padding: '16px' }}>
                <h4 style={{ fontSize: '0.95rem', margin: '0 0 10px', color: '#0b1727' }}>Fast-Track Subsidy Claim Checklist:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Verify 1st Loan Tranche Disbursal Advice from Bank', done: true },
                    { label: 'Collect Term Deposit Receipt (TDR) / Subsidy Reserve Fund Certificate', done: subsidyClaim.tdrAccountNo !== 'TDR-PENDING' },
                    { label: 'Submit Online Claim Form on Nodal Subsidy Portal', done: subsidyClaim.claimStatus.includes('Claim Filed') },
                    { label: 'Physical Inspection sign-off by Joint Director / Lead District Manager', done: false }
                  ].map((chk, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded" style={{ background: chk.done ? '#f0fdf4' : '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <span style={{ color: chk.done ? '#10b981' : '#94a3b8', fontWeight: '900' }}>{chk.done ? '✓' : '○'}</span>
                      <span style={{ fontSize: '0.84rem', color: chk.done ? '#166534' : '#334155', fontWeight: chk.done ? '700' : '500' }}>
                        {chk.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      subsidyClaim.claimStatus = 'Claim Filed on Nodal Portal';
                      showToast(`Claim submission recorded on ${subsidyClaim.claimPortal}!`);
                    }}
                    className="btn btn-sm btn-primary"
                    style={{ background: '#ff6f00' }}
                  >
                    Update Subsidy Claim as Filed
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: SUPPORT DESK VS OPERATIONS QA HANDOVER            */}
          {/* (User explicit: "documents complete nahin hota hai to     */}
          {/*  wapas usko support mein bhejte hain")                    */}
          {/* ======================================================== */}
          {activeTab === 'qa_handover' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '800' }}>
                  Support Desk ⮂ Operations Quality Handover Loop
                </h4>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  Ensure 100% document compliance before submitting to government portals to prevent rejections.
                </p>
              </div>

              {/* QA Status Box */}
              <div className="card" style={{ padding: '18px', borderLeft: qaHandover.status === 'Bounced_To_Support' ? '5px solid #ef4444' : '5px solid #10b981' }}>
                <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                  <div>
                    <span className={`badge ${qaHandover.status === 'Bounced_To_Support' ? 'badge-rose' : 'badge-emerald'}`} style={{ fontSize: '0.8rem' }}>
                      {qaHandover.status === 'Bounced_To_Support' ? '⚠️ BOUNCED BACK TO SUPPORT' : '✓ APPROVED FOR SUBMISSION'}
                    </span>
                    <h4 style={{ margin: '6px 0 2px', fontSize: '1.05rem', color: '#0b1727' }}>
                      Collected by: {qaHandover.collectedBy} • Verified by: {qaHandover.verifiedBy}
                    </h4>
                  </div>

                  <div className="flex gap-2">
                    {qaHandover.status === 'Bounced_To_Support' ? (
                      <button
                        type="button"
                        onClick={handleApproveQA}
                        className="btn btn-sm btn-primary"
                        style={{ background: '#10b981' }}
                      >
                        ✓ Mark Fixed &amp; Handover to Operations
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowBounceModal(true)}
                        className="btn btn-sm btn-outline"
                        style={{ borderColor: '#ef4444', color: '#ef4444' }}
                      >
                        <RotateCcw size={13} /> Bounce Back to Support
                      </button>
                    )}
                  </div>
                </div>

                {/* Audit history of bounces */}
                {qaHandover.bouncedHistory && qaHandover.bouncedHistory.length > 0 && (
                  <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px', padding: '12px', marginTop: '10px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#be123c', fontWeight: '800', textTransform: 'uppercase' }}>
                      Bounced History &amp; Rejection Reason:
                    </div>
                    {qaHandover.bouncedHistory.map((b, i) => (
                      <div key={i} style={{ fontSize: '0.82rem', color: '#9f1239', marginTop: '4px' }}>
                        📅 <strong>{b.date}:</strong> {b.reason}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: IN-HOUSE VS OUTSOURCED EXECUTION DESK             */}
          {/* (User explicit: "inmein se kuchh kam hamare office mein   */}
          {/*  kiye jaate Hain kuchh Ham outsour se kam karvate Hain") */}
          {/* ======================================================== */}
          {activeTab === 'outsource_desk' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '800' }}>
                    Execution Routing: In-House Office vs Outsourced Partner
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                    Track vendor payouts, deadlines, and delivery deliverables for external work.
                  </p>
                </div>

                {/* Mode Switcher */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      proj.executionMode = 'In_House';
                      showToast('Execution switched to In-House Office Desk.');
                    }}
                    className={`btn btn-sm ${executionMode === 'In_House' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ background: executionMode === 'In_House' ? '#10b981' : '' }}
                  >
                    🏢 In-House DUS Desk
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      proj.executionMode = 'Outsourced';
                      showToast('Execution switched to Outsourced External Partner.');
                    }}
                    className={`btn btn-sm ${executionMode === 'Outsourced' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ background: executionMode === 'Outsourced' ? '#d97706' : '' }}
                  >
                    🤝 Outsourced Partner
                  </button>
                </div>
              </div>

              {executionMode === 'Outsourced' ? (
                <div className="card" style={{ padding: '18px', borderLeft: '5px solid #d97706' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#d97706', fontWeight: '800', marginBottom: '4px' }}>
                    EXTERNAL OUTSOURCE VENDOR DETAILS
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <small style={{ color: '#64748b', fontSize: '0.72rem' }}>Vendor / Firm Name</small>
                      <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>{outsourceDetails.vendorName}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>👤 {outsourceDetails.contactPerson}</div>
                    </div>

                    <div>
                      <small style={{ color: '#64748b', fontSize: '0.72rem' }}>Vendor Contact Phone</small>
                      <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>📞 {outsourceDetails.phone}</div>
                      <a href={`tel:${outsourceDetails.phone}`} style={{ fontSize: '0.75rem', color: '#2563eb' }}>Click to Call Vendor</a>
                    </div>

                    <div>
                      <small style={{ color: '#64748b', fontSize: '0.72rem' }}>Agreed Outsource Payout</small>
                      <div style={{ fontWeight: '900', fontSize: '1.2rem', color: '#15803d', fontFamily: 'var(--font-mono)' }}>
                        ₹{Number(outsourceDetails.agreedCost || 0).toLocaleString('en-IN')}
                      </div>
                      <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>{outsourceDetails.paidStatus}</span>
                    </div>

                    <div>
                      <small style={{ color: '#64748b', fontSize: '0.72rem' }}>Delivery Due Date</small>
                      <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#ea580c' }}>📅 {outsourceDetails.deliveryDueDate}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Handed Over: {outsourceDetails.handoverDate}</div>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                    <strong>Vendor Current Status:</strong> {outsourceDetails.vendorStatus}
                  </div>

                  <div className="flex justify-between items-center flex-wrap gap-2 pt-2 border-t">
                    <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                      Deliverable File: <strong>{outsourceDetails.deliverableFile || 'Pending Upload from Vendor'}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        outsourceDetails.deliverableUploaded = true;
                        outsourceDetails.deliverableFile = 'License_Final_Certificate.pdf';
                        showToast('Vendor deliverable uploaded & saved to client vault!');
                      }}
                      className="btn btn-sm btn-primary"
                      style={{ background: '#ff6f00', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <Upload size={13} /> Upload Output Deliverable
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card" style={{ padding: '18px', borderLeft: '5px solid #10b981' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#15803d', fontWeight: '800', marginBottom: '4px' }}>
                    IN-HOUSE DUS CABIN EXECUTION
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0b1727' }}>
                    Assigned Desk: {proj.assignedDesk || 'Cabin #02 (Legal & CA Desk)'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
                    Assigned Executive: <strong>{proj.assignedPerson?.name}</strong> ({proj.assignedPerson?.role})
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                    Direct internal processing under DUS Standard Operating Procedures.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: DOCUMENTS VAULT & SIGNED LEGAL CONTRACT           */}
          {/* (User explicit: "unki agreement banate hain isase aage   */}
          {/*  legal problem se Bach saken")                            */}
          {/* ======================================================== */}
          {activeTab === 'docs_agreement' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Legal Agreement Banner */}
              <div style={{
                background: 'linear-gradient(135deg, #0b1727, #1e293b)',
                color: '#fff',
                padding: '16px 20px',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                    ✓ Statutory Protection Agreement Active
                  </span>
                  <h4 style={{ fontSize: '1.1rem', margin: '3px 0 0', color: '#fff' }}>
                    Signed Legal Consultancy Agreement ({legalAgreement.agreementNo})
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                    Signed: <strong>{legalAgreement.signedDate}</strong> • Terms: {legalAgreement.feePackage}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => showToast(`Opening ${legalAgreement.agreementDoc}...`)}
                  className="btn btn-sm btn-outline-white"
                  style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <FileText size={14} /> View Agreement PDF
                </button>
              </div>

              {/* Documents Checklist */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 style={{ fontSize: '1rem', margin: 0 }}>Project Document Checklist &amp; Status:</h4>
                  <button onClick={() => showToast('Attach document dialog opened')} className="btn btn-sm btn-outline">
                    + Attach New Document
                  </button>
                </div>

                <div className="table-wrapper">
                  <table className="data-table" style={{ fontSize: '0.85rem' }}>
                    <thead>
                      <tr>
                        <th>Document Title</th>
                        <th>Mandatory</th>
                        <th>Verification Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proj.documents && proj.documents.map((doc, idx) => (
                        <tr key={idx}>
                          <td><strong>{doc.name}</strong></td>
                          <td>{doc.required ? <span className="badge badge-amber">Required</span> : 'Optional'}</td>
                          <td>
                            <span className={`badge ${doc.status === 'Verified' ? 'badge-emerald' : 'badge-rose'}`}>
                              {doc.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => {
                                doc.status = 'Verified';
                                showToast(`${doc.name} marked as Verified!`);
                              }}
                              className="btn btn-sm btn-outline"
                              style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                            >
                              Verify
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 8: TASKS, NOTES & STAFF ACTIVITY LOGS                */}
          {/* ======================================================== */}
          {activeTab === 'tasks_notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Tasks List */}
              <div className="card" style={{ padding: '16px' }}>
                <div className="flex justify-between items-center mb-3">
                  <h4 style={{ fontSize: '1rem', margin: 0 }}>Action Items &amp; Tasks:</h4>
                  <button onClick={() => setShowNewTaskModal(true)} className="btn btn-sm btn-outline" style={{ fontSize: '0.75rem' }}>
                    + Add Task
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {proj.tasks && proj.tasks.map(t => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-2 rounded"
                      style={{ background: t.done ? '#f0fdf4' : '#f8fafc', border: '1px solid #e2e8f0' }}
                    >
                      <label className="flex items-center gap-3 cursor-pointer" style={{ flex: 1 }}>
                        <input
                          type="checkbox"
                          checked={t.done}
                          onChange={() => toggleProjectTask(proj.id, t.id)}
                        />
                        <span style={{ fontSize: '0.85rem', textDecoration: t.done ? 'line-through' : 'none', color: t.done ? '#64748b' : '#0b1727' }}>
                          {t.task}
                        </span>
                      </label>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Due: <strong>{t.dueDate}</strong> • 👤 {t.assignee}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Note Section */}
              <div className="card" style={{ padding: '16px' }}>
                <h4 style={{ fontSize: '1rem', margin: '0 0 10px' }}>Log Internal Staff Activity Note:</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter case note e.g. Met client at Sitapura unit regarding electricity meter..."
                    className="form-control"
                    value={newNoteText}
                    onChange={e => setNewNoteText(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newNoteText) return;
                      showToast(`Note logged for project #${proj.projectCode}!`);
                      setNewNoteText('');
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ======================================================== */}
        {/* MODAL FOOTER                                             */}
        {/* ======================================================== */}
        <div style={{ background: '#f8fafc', padding: '14px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Project Ref: <strong>{proj.id}</strong> • Customer: <strong>{proj.customerName}</strong>
          </div>
          <button
            type="button"
            onClick={() => setSelectedProjectForDetail(null)}
            className="btn btn-sm btn-primary"
            style={{ background: '#0b1727' }}
          >
            Close Dossier
          </button>
        </div>

      </div>

      {/* ======================================================== */}
      {/* POPUP: BOUNCE BACK TO SUPPORT DESK MODAL                 */}
      {/* ======================================================== */}
      {showBounceModal && (
        <div className="modal-overlay" style={{ zIndex: 1200 }} onClick={() => setShowBounceModal(false)}>
          <div className="modal-card" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ background: '#ef4444', color: '#fff' }}>
              <h4 style={{ fontSize: '1.05rem', margin: 0, color: '#fff' }}>Bounce File Back to Support Desk</h4>
              <button onClick={() => setShowBounceModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '12px' }}>
                Specify what documents or details are incomplete. The support team will follow up with <strong>{proj.customerName}</strong> to re-collect them.
              </p>
              <div className="form-group mb-3">
                <label className="form-label">Rejection / Missing Documents Reason *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Industrial electricity bill missing, machinery quotation lacked GST breakdown..."
                  className="form-control"
                  value={bounceReason}
                  onChange={e => setBounceReason(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowBounceModal(false)} className="btn btn-outline btn-sm">Cancel</button>
              <button
                onClick={handleBounceToSupport}
                className="btn btn-primary btn-sm"
                style={{ background: '#ef4444' }}
              >
                Confirm Bounce to Support
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* POPUP: LOG NEW DEPARTMENT QUERY / OBJECTION MODAL        */}
      {/* ======================================================== */}
      {showQueryModal && (
        <div className="modal-overlay" style={{ zIndex: 1200 }} onClick={() => setShowQueryModal(false)}>
          <div className="modal-card" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4 style={{ fontSize: '1.05rem', margin: 0 }}>Log Government Department Objection</h4>
              <button onClick={() => setShowQueryModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleAddQuery}>
              <div className="modal-body">
                <div className="form-group mb-3">
                  <label className="form-label">Department / Scrutiny Desk *</label>
                  <select
                    value={queryRaisedBy}
                    onChange={e => setQueryRaisedBy(e.target.value)}
                    className="form-control"
                  >
                    <option value="DIC GM Scrutiny Desk">DIC GM Scrutiny Desk</option>
                    <option value="KVIC State Office Desk">KVIC State Office Desk</option>
                    <option value="District Collector Committee">District Collector Committee</option>
                    <option value="Animal Husbandry (AHD) Dept">Animal Husbandry (AHD) Dept</option>
                    <option value="RSPCB Pollution Regional Office">RSPCB Pollution Regional Office</option>
                    <option value="FSSAI FoSCoS Scrutiny Desk">FSSAI FoSCoS Scrutiny Desk</option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Objection / Query Text *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Enter exact objection text from government portal..."
                    className="form-control"
                    value={queryText}
                    onChange={e => setQueryText(e.target.value)}
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">DUS Reply Draft (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Enter reply submitted or planned..."
                    className="form-control"
                    value={queryReply}
                    onChange={e => setQueryReply(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowQueryModal(false)} className="btn btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save &amp; Notify Client</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* POPUP: ADD TASK MODAL                                    */}
      {/* ======================================================== */}
      {showNewTaskModal && (
        <div className="modal-overlay" style={{ zIndex: 1200 }} onClick={() => setShowNewTaskModal(false)}>
          <div className="modal-card" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4 style={{ fontSize: '1.05rem', margin: 0 }}>Add New Project Task</h4>
              <button onClick={() => setShowNewTaskModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group mb-3">
                <label className="form-label">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule branch manager visit"
                  className="form-control"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                />
              </div>
              <div className="form-group mb-3">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={newTaskDue}
                  onChange={e => setNewTaskDue(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowNewTaskModal(false)} className="btn btn-outline btn-sm">Cancel</button>
              <button
                onClick={() => {
                  if (!newTaskTitle) return;
                  proj.tasks.push({
                    id: `T-0${proj.tasks.length + 1}`,
                    task: newTaskTitle,
                    done: false,
                    dueDate: newTaskDue || '2026-09-15',
                    assignee: proj.assignedPerson?.name || 'Staff'
                  });
                  showToast('Task added to project!');
                  setShowNewTaskModal(false);
                  setNewTaskTitle('');
                }}
                className="btn btn-primary btn-sm"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
