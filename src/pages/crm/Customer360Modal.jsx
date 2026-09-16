import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClientBillingManager } from './bookkeeping/ClientBillingManager';
import { 
  X, Building2, ShieldCheck, User, Phone, Mail, MapPin, IndianRupee, 
  CheckCircle2, FileText, Calendar, Clock, Award, Layers, HelpCircle, 
  History, Download, UploadCloud, Printer, Share2, Sparkles, AlertTriangle, 
  Folder, FolderPlus, Mic, Play, Pause, Plus, RefreshCw, CreditCard, 
  Receipt, ArrowUpRight, ArrowDownLeft, Bell, Check, Search, Filter, 
  Sliders, Eye, Lock, UserCheck, Briefcase, ChevronRight, MessageSquare
} from 'lucide-react';

export const Customer360Modal = () => {
  const { selectedCustomerFor360, setSelectedCustomerFor360, showToast, activeRole } = useApp();

  // Active Tab: 
  // 'overview' | 'profile_rm' | 'statement_billing' | 'subscriptions' | 'documents_vault' | 'notes_voice' | 'projects_tasks' | 'reminders_support' | 'audit_security'
  const [activeTab, setActiveTab] = useState('overview');

  // Sub-filter states
  const [docFolder, setDocFolder] = useState('All');
  const [billingSubTab, setBillingSubTab] = useState('statement'); // 'statement' | 'invoices' | 'credit_debit' | 'advance_receipts' | 'expenses'
  
  // Audio playback state
  const [playingAudioId, setPlayingAudioId] = useState(null);

  // New Note Form
  const [newNoteText, setNewNoteText] = useState('');
  
  // New Expense Form
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('Govt_Challan'); // 'Govt_Challan', 'Stamp_Duty', 'Notary', 'Travel', 'Other'

  // New Reminder Form
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('');

  // Reassign RM Modal
  const [showRmModal, setShowRmModal] = useState(false);
  const [selectedNewRm, setSelectedNewRm] = useState('CA Rajesh Verma');
  const [reassignReason, setReassignReason] = useState('');

  if (!selectedCustomerFor360) return null;
  const cust = selectedCustomerFor360;

  // Initial fallback states if not present in mock customer
  const personalAddress = cust.personalAddress || 'House No. 12, Rose Villa, Tonk Road, Jaipur, Rajasthan - 302015';
  const businessAddress = cust.kycProfile?.registeredAddress || cust.businessAddress || 'Plot 44, Agro Park Phase 2, Sitapura Industrial Area, Jaipur, Rajasthan - 302022';
  const assignedRm = cust.assignedRm || {
    name: cust.customer360?.relationshipManager || 'CA Rajesh Verma',
    role: 'Senior Partner & Credit Head',
    cabin: 'Cabin #02 (Legal & CA/CS Desk)',
    phone: '+91 98290 12345',
    email: 'rajesh.verma@digitaludyogseva.com',
    assignedDate: '15 Aug 2026',
    assignedBy: 'Admin Superuser'
  };

  // Sample Folder-wise Documents
  const folderCategories = [
    { id: 'All', label: 'All Files' },
    { id: 'KYC_Registrations', label: '📁 KYC & Registrations' },
    { id: 'Financials_Tax', label: '📁 Financials & ITR' },
    { id: 'Project_DPR', label: '📁 Project & DPR' },
    { id: 'Banking_Sanctions', label: '📁 Banking & Sanctions' },
    { id: 'Invoices_Receipts', label: '📁 Invoices & Receipts' }
  ];

  const allDocuments = cust.documentsVault || [
    { id: 'DOC-101', name: 'Certificate of Incorporation (SPICe+ Part B)', folder: 'KYC_Registrations', size: '2.4 MB', date: '01 Sep 2026', verified: true },
    { id: 'DOC-102', name: 'Memorandum of Association (MOA & AOA)', folder: 'KYC_Registrations', size: '4.1 MB', date: '30 Aug 2026', verified: true },
    { id: 'DOC-103', name: 'Udyam MSME Registration Certificate', folder: 'KYC_Registrations', size: '1.2 MB', date: '02 Sep 2026', verified: true },
    { id: 'DOC-104', name: 'Last 3-Years Audited Balance Sheets & P&L', folder: 'Financials_Tax', size: '8.6 MB', date: '25 Aug 2026', verified: true },
    { id: 'DOC-105', name: '12-Months Bank Current Account Statement', folder: 'Financials_Tax', size: '12.0 MB', date: '28 Aug 2026', verified: true },
    { id: 'DOC-106', name: 'PMEGP Detailed Project Report (DPR - 25L)', folder: 'Project_DPR', size: '6.5 MB', date: '20 Aug 2026', verified: true },
    { id: 'DOC-107', name: 'Machinery Quotation from Certified Vendor', folder: 'Project_DPR', size: '3.1 MB', date: '18 Aug 2026', verified: true },
    { id: 'DOC-108', name: 'State Bank of India (SBI) In-Principle Sanction', folder: 'Banking_Sanctions', size: '1.8 MB', date: '05 Sep 2026', verified: true },
    { id: 'DOC-109', name: 'Tax Invoice INV-2026-089 & Payment Receipt', folder: 'Invoices_Receipts', size: '840 KB', date: '28 Aug 2026', verified: true }
  ];

  const filteredDocs = docFolder === 'All' 
    ? allDocuments 
    : allDocuments.filter(d => d.folder === docFolder);

  // Statement of Account Ledger Entries
  const ledgerEntries = cust.ledgerEntries || [
    { date: '2026-08-28', particular: 'Tax Invoice: Pvt Ltd Incorporation & SPICe+ (INV-089)', debit: 8848.82, credit: 0, balance: 8848.82, ref: 'INV-089' },
    { date: '2026-08-28', particular: 'Payment Received via HDFC Netbanking (Receipt #REC-101)', debit: 0, credit: 8848.82, balance: 0.00, ref: 'REC-101' },
    { date: '2026-09-01', particular: 'Tax Invoice: PMEGP 5-Year CMA & DPR Preparation (INV-112)', debit: 18000.00, credit: 0, balance: 18000.00, ref: 'INV-112' },
    { date: '2026-09-01', particular: 'Advance Payment Received via NEFT (Receipt #REC-102)', debit: 0, credit: 10000.00, balance: 8000.00, ref: 'REC-102' },
    { date: '2026-09-03', particular: 'Debit Note: MCA Form RUN Name Extension Fee (DN-01)', debit: 1000.00, credit: 0, balance: 9000.00, ref: 'DN-01' },
    { date: '2026-09-05', particular: 'Credit Note: Goodwill Concession on ROC Filing (CN-01)', debit: 0, credit: 500.00, balance: 8500.00, ref: 'CN-01' }
  ];

  // Invoices Master
  const invoicesList = cust.invoicesList || [
    { id: 'INV-2026-089', date: '2026-08-28', service: 'Private Limited Company Registration', amount: 7499.00, gst: 1349.82, total: 8848.82, status: 'Paid', balance: 0 },
    { id: 'INV-2026-112', date: '2026-09-01', service: 'PMEGP Detailed Project Report (DPR)', amount: 15254.24, gst: 2745.76, total: 18000.00, status: 'Partially_Paid', balance: 8000 }
  ];

  // Credit / Debit Notes
  const creditDebitNotes = cust.creditDebitNotes || [
    { id: 'CN-2026-001', type: 'Credit Note', date: '2026-09-05', invoiceRef: 'INV-2026-112', amount: 500.00, reason: 'Promotional loyalty concession approved by Admin', status: 'Adjusted' },
    { id: 'DN-2026-001', type: 'Debit Note', date: '2026-09-03', invoiceRef: 'INV-2026-089', amount: 1000.00, reason: 'Additional Government ROC re-submission fee incurred', status: 'Billed' }
  ];

  // Advance Receipts
  const advanceReceipts = cust.advanceReceipts || [
    { receiptNo: 'REC-2026-101', date: '2026-08-28', amount: 8848.82, mode: 'HDFC Netbanking', utr: 'HDFC89127810', forInvoice: 'INV-2026-089' },
    { receiptNo: 'REC-2026-102', date: '2026-09-01', amount: 10000.00, mode: 'NEFT Transfer', utr: 'ICIC99812401', forInvoice: 'INV-2026-112' }
  ];

  // Expenses Track
  const customerExpenses = cust.expenses || [
    { id: 'EXP-01', date: '2026-08-29', category: 'Govt MCA Challan', desc: 'SPICe+ Part B Government statutory fee', amount: 1250, reimbursable: 'Billed to Client' },
    { id: 'EXP-02', date: '2026-08-30', category: 'Stamp Duty', desc: 'State of Rajasthan Electronic Stamp Duty on MOA', amount: 850, reimbursable: 'Paid by DUS' },
    { id: 'EXP-03', date: '2026-09-02', category: 'Notary & Affidavit', desc: 'Director Affidavit Form 48 notarization', amount: 400, reimbursable: 'Billed to Client' }
  ];

  // Recurring Subscriptions / Retainer Plans
  const subscriptions = cust.subscriptions || [
    { id: 'SUB-01', name: 'Monthly GST Return Filing & ITC Reconciliation', billingCycle: 'Monthly', fee: 1500, nextBillingDate: '2026-10-01', status: 'Active', autoReminder: true },
    { id: 'SUB-02', name: 'Annual ROC Compliance & Secretarial Audit Retainer', billingCycle: 'Annually', fee: 8500, nextBillingDate: '2027-04-30', status: 'Active', autoReminder: true }
  ];

  // Internal Notes with Voice Recordings
  const notesList = cust.internalNotes || [
    { id: 1, author: 'CA Rajesh Verma', date: '2026-09-02 11:30 AM', text: 'Client has provided all machine quotations. Met Branch Manager at SBI Industrial Branch; file will be sanctioned within 7 working days.', hasAudio: true, audioDuration: '01:45' },
    { id: 2, author: 'CS Priya Nair', date: '2026-08-31 04:15 PM', text: 'SPICe+ Part B cleared by RoC Jaipur without any resubmission remarks. COI dispatched.', hasAudio: false },
    { id: 3, author: 'Neha Sharma (RM)', date: '2026-08-28 02:00 PM', text: 'Onboarded client. Explained PMEGP 35% subsidy roadmap and assigned file to Cabin #02 & Cabin #04.', hasAudio: true, audioDuration: '02:10' }
  ];

  // Tasks & Support Tickets
  const clientTasks = cust.tasks || [
    { id: 'TSK-01', title: 'File GSTR-3B for August Month', assignedTo: 'CA Rajesh Verma', dueDate: '2026-09-20', priority: 'High', status: 'Pending' },
    { id: 'TSK-02', title: 'Collect SBI Bank Sanction TDR Deposit Copy', assignedTo: 'Sunil Manchanda', dueDate: '2026-09-10', priority: 'Urgent', status: 'In_Progress' },
    { id: 'TSK-03', title: 'Issue Paid Tax Receipt for Milestone #2', assignedTo: 'Accounts Desk', dueDate: '2026-09-06', priority: 'Medium', status: 'Completed' }
  ];

  // Security Access & Audit Trail
  const accessLogs = cust.accessLogs || [
    { id: 1, user: 'CA Rajesh Verma', role: 'Relationship Manager', action: 'Viewed Customer 360° & Downloaded DPR', ip: '103.24.12.89', time: '15 Sep 2026, 04:30 PM' },
    { id: 2, user: 'Pooja Agarwal', role: 'Franchise Desk', action: 'Updated Business Registered Address', ip: '103.24.12.92', time: '14 Sep 2026, 11:15 AM' },
    { id: 3, user: 'Admin Superuser', role: 'Super Admin', action: 'Approved Credit Note CN-2026-001 (₹500)', ip: '127.0.0.1', time: '12 Sep 2026, 02:40 PM' },
    { id: 4, user: 'Sunil Manchanda', role: 'Banking Liaison', action: 'Logged Call Notes on PMEGP Sanction Letter', ip: '103.24.12.89', time: '10 Sep 2026, 05:20 PM' }
  ];

  const handlePrintStatement = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedCustomerFor360(null)}>
      <div 
        className="modal-card" 
        style={{ maxWidth: '1100px', padding: 0, overflow: 'hidden', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }} 
        onClick={e => e.stopPropagation()}
      >
        {/* ======================================================== */}
        {/* TOP HEADER: MASTER CLIENT BAR                            */}
        {/* ======================================================== */}
        <div style={{ background: 'linear-gradient(135deg, #070e17 0%, #1e1b4b 50%, #172554 100%)', color: '#fff', padding: '20px 26px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex justify-between items-start flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="badge badge-saffron" style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                  {cust.id}
                </span>
                <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                  <ShieldCheck size={13} /> KYC {cust.kycStatus || 'Verified'}
                </span>
                <span className="badge" style={{ background: '#3b82f6', color: '#fff', fontSize: '0.75rem' }}>
                  {cust.customer360?.tier || 'Platinum Corporate'}
                </span>
                <span className="badge" style={{ background: '#8b5cf6', color: '#fff', fontSize: '0.75rem' }}>
                  RM: {assignedRm.name}
                </span>
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#fff', margin: '6px 0 2px' }}>
                {cust.name}
              </h2>

              <div className="flex items-center gap-4 flex-wrap" style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                <span className="flex items-center gap-1"><User size={13} /> {cust.contactPerson}</span>
                <span className="flex items-center gap-1"><Phone size={13} color="#4ade80" /> {cust.phone}</span>
                <span className="flex items-center gap-1"><MapPin size={13} /> {cust.city}</span>
                <span style={{ fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                  GSTIN: {cust.gstin}
                </span>
              </div>
            </div>

            {/* Quick Header Metric & Close */}
            <div className="flex items-center gap-3">
              <div style={{ textAlign: 'right', background: 'rgba(255,255,255,0.06)', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontSize: '0.7rem', color: '#93c5fd', textTransform: 'uppercase', fontWeight: '700' }}>Lifetime Billed</div>
                <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#4ade80', fontFamily: 'var(--font-mono)' }}>
                  {cust.totalBilled || '₹28,500'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#fca5a5' }}>
                  Outstanding: <strong>₹8,500</strong>
                </div>
              </div>

              <button 
                onClick={() => setSelectedCustomerFor360(null)} 
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Close Dossier"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB NAVIGATION STRIP (9 Enterprise Sections)              */}
        {/* ======================================================== */}
        <div style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', display: 'flex', overflowX: 'auto', padding: '0 12px' }}>
          {[
            { id: 'overview', label: '1. Master 360° Dashboard' },
            { id: 'profile_rm', label: '2. Profile & RM Allocation' },
            { id: 'statement_billing', label: '3. Statement, Invoices & Notes' },
            { id: 'subscriptions', label: `4. Subscriptions (${subscriptions.length})` },
            { id: 'documents_vault', label: `5. Document Vault (${allDocuments.length})` },
            { id: 'notes_voice', label: `6. Notes & Audio (${notesList.length})` },
            { id: 'projects_tasks', label: `7. Projects & Tasks (${clientTasks.length})` },
            { id: 'reminders_support', label: '8. Reminders & Support' },
            { id: 'audit_security', label: '9. Security & Access Logs' },
            { id: 'client_billing', label: '💼 10. Client Sales & Bill Book' }
          ].map(t => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
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
        {/* TAB BODY CONTENTS                                        */}
        {/* ======================================================== */}
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '22px' }}>
          
          {/* ------------------------------------------------------ */}
          {/* TAB 1: MASTER 360° DASHBOARD                           */}
          {/* ------------------------------------------------------ */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Quick 4 KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div className="card" style={{ padding: '16px', borderLeft: '4px solid #10b981' }}>
                  <small style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700' }}>Account Health Score</small>
                  <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#15803d' }}>
                    {cust.customer360?.healthScore || 95} / 100
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#15803d' }}>● Excellent Relationship &amp; Zero NPA</div>
                </div>

                <div className="card" style={{ padding: '16px', borderLeft: '4px solid #2563eb' }}>
                  <small style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700' }}>Assigned RM Officer</small>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1e40af', marginTop: '2px' }}>
                    {assignedRm.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{assignedRm.cabin}</div>
                </div>

                <div className="card" style={{ padding: '16px', borderLeft: '4px solid #f59e0b' }}>
                  <small style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700' }}>Ledger Outstanding</small>
                  <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#b45309', fontFamily: 'var(--font-mono)' }}>
                    ₹8,500.00
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>2 Billed Invoices • 1 Advance</div>
                </div>

                <div className="card" style={{ padding: '16px', borderLeft: '4px solid #8b5cf6' }}>
                  <small style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700' }}>Active Projects &amp; Subs</small>
                  <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#6d28d9' }}>
                    {(cust.projects?.length || 1) + subscriptions.length} Active
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>1 DPR Project • 2 Retainers</div>
                </div>
              </div>

              {/* Executive Summary & AI Insights */}
              <div style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', padding: '18px 22px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={18} color="#ff6f00" />
                  <strong style={{ fontSize: '0.98rem', color: '#0b1727' }}>AI Client Intelligence &amp; Relationship Digest:</strong>
                </div>
                <p style={{ margin: 0, color: '#334155', fontSize: '0.88rem', lineHeight: '1.6' }}>
                  {cust.customer360?.summary || 'Client profile established with active compliance tracking and prompt payment track. Currently expanding manufacturing capacity with ₹25 Lakhs PMEGP subsidy file logged at SBI Industrial Branch.'}
                </p>
              </div>

              {/* Two Column Address & Overview Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="card" style={{ padding: '18px' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 size={18} color="#2563eb" />
                    <strong style={{ fontSize: '0.92rem', color: '#0b1727' }}>Registered Commercial / Factory Address:</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: '1.5' }}>
                    {businessAddress}
                  </p>
                  <div style={{ marginTop: '8px', fontSize: '0.78rem', color: '#64748b' }}>
                    Status: <strong>Verified by RoC &amp; Electricity Utility Bill</strong>
                  </div>
                </div>

                <div className="card" style={{ padding: '18px' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <User size={18} color="#10b981" />
                    <strong style={{ fontSize: '0.92rem', color: '#0b1727' }}>Director / Signatory Personal Residential Address:</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: '1.5' }}>
                    {personalAddress}
                  </p>
                  <div style={{ marginTop: '8px', fontSize: '0.78rem', color: '#64748b' }}>
                    Signatory: <strong>{cust.contactPerson} (Aadhaar KYC Matched)</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------ */}
          {/* TAB 2: PROFILE & RM ALLOCATION                         */}
          {/* ------------------------------------------------------ */}
          {activeTab === 'profile_rm' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Assigned RM Card */}
              <div className="card" style={{ padding: '20px', border: '2px solid #93c5fd', background: 'linear-gradient(135deg, #f0fdf4, #eff6ff)' }}>
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '800' }}>
                      {assignedRm.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 style={{ fontSize: '1.2rem', margin: 0, color: '#0b1727' }}>{assignedRm.name}</h4>
                        <span className="badge badge-blue">{assignedRm.role}</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                        {assignedRm.cabin} • Assigned on: <strong>{assignedRm.assignedDate}</strong> by {assignedRm.assignedBy}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRmModal(true)}
                      className="btn btn-sm btn-outline"
                      style={{ background: '#fff', borderColor: '#2563eb', color: '#2563eb' }}
                    >
                      <UserCheck size={14} /> Reassign RM
                    </button>
                    <a
                      href={`tel:${assignedRm.phone}`}
                      className="btn btn-sm btn-primary"
                      style={{ background: '#059669' }}
                    >
                      <Phone size={14} /> Call RM
                    </a>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginTop: '16px', background: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Direct Phone</span>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{assignedRm.phone}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Official Email</span>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{assignedRm.email}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Assigned Desk</span>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{assignedRm.cabin}</div>
                  </div>
                </div>
              </div>

              {/* Master Addresses & Statutory Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="card" style={{ padding: '18px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '12px', color: '#0b1727' }}>
                    Entity Statutory Registrations
                  </h4>
                  <table style={{ width: '100%', fontSize: '0.85rem' }}>
                    <tbody>
                      <tr><td style={{ color: '#64748b', padding: '6px 0' }}>Legal Name:</td><td><strong>{cust.kycProfile?.legalName || cust.name}</strong></td></tr>
                      <tr><td style={{ color: '#64748b', padding: '6px 0' }}>GSTIN:</td><td><strong style={{ color: '#059669', fontFamily: 'var(--font-mono)' }}>{cust.gstin}</strong></td></tr>
                      <tr><td style={{ color: '#64748b', padding: '6px 0' }}>PAN Number:</td><td><strong style={{ fontFamily: 'var(--font-mono)' }}>{cust.kycProfile?.pan || 'AAECS1234F'}</strong></td></tr>
                      <tr><td style={{ color: '#64748b', padding: '6px 0' }}>CIN / Registration:</td><td><strong>{cust.cin || 'U01111RJ2026PTC089123'}</strong></td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="card" style={{ padding: '18px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '12px', color: '#0b1727' }}>
                    Signatory &amp; Personal Contacts
                  </h4>
                  <table style={{ width: '100%', fontSize: '0.85rem' }}>
                    <tbody>
                      <tr><td style={{ color: '#64748b', padding: '6px 0' }}>Authorized Person:</td><td><strong>{cust.contactPerson}</strong></td></tr>
                      <tr><td style={{ color: '#64748b', padding: '6px 0' }}>Mobile:</td><td><strong>{cust.phone}</strong></td></tr>
                      <tr><td style={{ color: '#64748b', padding: '6px 0' }}>Email:</td><td><strong>{cust.email || 'client@sharmaagro.in'}</strong></td></tr>
                      <tr><td style={{ color: '#64748b', padding: '6px 0' }}>Client Since:</td><td><strong>August 2026 (Active)</strong></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------ */}
          {/* TAB 3: STATEMENT OF ACCOUNT, INVOICES & NOTES          */}
          {/* ------------------------------------------------------ */}
          {activeTab === 'statement_billing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Sub Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { id: 'statement', label: '📄 Statement of Account (खाता)' },
                    { id: 'invoices', label: `Invoices (${invoicesList.length})` },
                    { id: 'credit_debit', label: `Credit / Debit Notes (${creditDebitNotes.length})` },
                    { id: 'advance_receipts', label: `Advance Receipts (${advanceReceipts.length})` },
                    { id: 'expenses', label: `Expenses (${customerExpenses.length})` }
                  ].map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBillingSubTab(b.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: billingSubTab === b.id ? '#0b1727' : '#f1f5f9',
                        color: billingSubTab === b.id ? '#fff' : '#475569',
                        fontWeight: billingSubTab === b.id ? '700' : '500',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrintStatement}
                    className="btn btn-sm btn-outline"
                    style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Printer size={14} /> Print Statement
                  </button>

                  <button
                    type="button"
                    onClick={() => showToast('PDF Statement exported successfully!')}
                    className="btn btn-sm btn-primary"
                    style={{ background: '#059669', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Download size={14} /> Download PDF
                  </button>
                </div>
              </div>

              {/* SUB-VIEW 1: STATEMENT OF ACCOUNT (LEDGER) */}
              {billingSubTab === 'statement' && (
                <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '20px' }}>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 style={{ fontSize: '1.1rem', margin: 0, color: '#0b1727' }}>
                        Customer Statement of Account (खाता विवरण)
                      </h4>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        All services billed, advances received, adjustments &amp; current outstanding
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Net Outstanding Due:</span>
                      <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#b91c1c', fontFamily: 'var(--font-mono)' }}>
                        ₹8,500.00
                      </div>
                    </div>
                  </div>

                  <div className="table-wrapper">
                    <table className="data-table" style={{ fontSize: '0.82rem' }}>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Particulars &amp; Work Description</th>
                          <th>Reference</th>
                          <th style={{ textAlign: 'right' }}>Debit (+)</th>
                          <th style={{ textAlign: 'right' }}>Credit (-)</th>
                          <th style={{ textAlign: 'right' }}>Balance (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ledgerEntries.map((l, idx) => (
                          <tr key={idx}>
                            <td>{l.date}</td>
                            <td><strong>{l.particular}</strong></td>
                            <td><span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>{l.ref}</span></td>
                            <td style={{ textAlign: 'right', color: l.debit ? '#b91c1c' : '#94a3b8', fontWeight: '700' }}>
                              {l.debit ? `₹${l.debit.toFixed(2)}` : '-'}
                            </td>
                            <td style={{ textAlign: 'right', color: l.credit ? '#15803d' : '#94a3b8', fontWeight: '700' }}>
                              {l.credit ? `₹${l.credit.toFixed(2)}` : '-'}
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>
                              ₹{l.balance.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUB-VIEW 2: INVOICES */}
              {billingSubTab === 'invoices' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {invoicesList.map(inv => (
                    <div key={inv.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong style={{ fontSize: '1rem', color: '#2563eb', fontFamily: 'var(--font-mono)' }}>{inv.id}</strong>
                          <span className={`badge ${inv.status === 'Paid' ? 'badge-emerald' : 'badge-amber'}`}>{inv.status}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '4px' }}>{inv.service}</div>
                        <small style={{ color: '#64748b' }}>Date: {inv.date}</small>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.15rem', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>
                          ₹{inv.total.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: inv.balance ? '#dc2626' : '#15803d' }}>
                          {inv.balance ? `Due: ₹${inv.balance.toLocaleString('en-IN')}` : 'Fully Paid'}
                        </div>
                        <button
                          type="button"
                          onClick={() => showToast(`Downloading Invoice ${inv.id}...`)}
                          className="btn btn-sm btn-outline mt-2"
                          style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                        >
                          <Download size={12} /> Download PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SUB-VIEW 3: CREDIT / DEBIT NOTES */}
              {billingSubTab === 'credit_debit' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="flex justify-between items-center mb-2">
                    <h5 style={{ margin: 0, fontSize: '0.95rem' }}>Credit &amp; Debit Adjustments</h5>
                    <button onClick={() => showToast('Generate Credit/Debit Note modal')} className="btn btn-sm btn-primary">
                      + Issue Credit/Debit Note
                    </button>
                  </div>
                  {creditDebitNotes.map(n => (
                    <div key={n.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`badge ${n.type === 'Credit Note' ? 'badge-emerald' : 'badge-rose'}`}>{n.type}</span>
                          <strong style={{ fontFamily: 'var(--font-mono)' }}>{n.id}</strong>
                          <small style={{ color: '#64748b' }}>Against {n.invoiceRef}</small>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>{n.reason}</div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <strong style={{ fontSize: '1.1rem', color: n.type === 'Credit Note' ? '#15803d' : '#b91c1c', fontFamily: 'var(--font-mono)' }}>
                          ₹{n.amount.toFixed(2)}
                        </strong>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{n.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SUB-VIEW 4: ADVANCE RECEIPTS */}
              {billingSubTab === 'advance_receipts' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="flex justify-between items-center mb-2">
                    <h5 style={{ margin: 0, fontSize: '0.95rem' }}>Advance Payment Receipts Issued</h5>
                    <button onClick={() => showToast('Issue Advance Receipt modal')} className="btn btn-sm btn-primary">
                      + Issue Advance Receipt
                    </button>
                  </div>
                  {advanceReceipts.map(rec => (
                    <div key={rec.receiptNo} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong style={{ color: '#15803d', fontFamily: 'var(--font-mono)' }}>{rec.receiptNo}</strong>
                          <span className="badge badge-blue">{rec.mode}</span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                          UTR: {rec.utr} • For: {rec.forInvoice} • Date: {rec.date}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#15803d', fontFamily: 'var(--font-mono)' }}>
                          ₹{rec.amount.toLocaleString('en-IN')}
                        </div>
                        <button onClick={() => showToast(`Printing receipt ${rec.receiptNo}`)} className="btn btn-sm btn-outline mt-1" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                          Print Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SUB-VIEW 5: EXPENSES TRACKER */}
              {billingSubTab === 'expenses' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="flex justify-between items-center mb-2">
                    <h5 style={{ margin: 0, fontSize: '0.95rem' }}>Client Out-of-Pocket Expenses Log</h5>
                    <button onClick={() => setShowExpenseModal(true)} className="btn btn-sm btn-primary">
                      + Record Expense
                    </button>
                  </div>
                  {customerExpenses.map(exp => (
                    <div key={exp.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="badge badge-saffron">{exp.category}</span>
                          <strong style={{ fontSize: '0.9rem' }}>{exp.desc}</strong>
                        </div>
                        <small style={{ color: '#64748b' }}>Date: {exp.date} • {exp.reimbursable}</small>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>
                          ₹{exp.amount.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ------------------------------------------------------ */}
          {/* TAB 4: RECURRING SUBSCRIPTIONS & RETAINER PLANS        */}
          {/* ------------------------------------------------------ */}
          {activeTab === 'subscriptions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', padding: '16px' }}>
                <strong style={{ color: '#9a3412', fontSize: '0.95rem' }}>
                  Recurring Compliance Retainers (बार-बार किए जाने वाले कार्य)
                </strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#7c2d12' }}>
                  Automated monthly/annual billing schedules with integrated compliance reminders so client never misses a tax deadline.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {subscriptions.map(sub => (
                  <div key={sub.id} className="card" style={{ padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-blue">{sub.billingCycle} Retainer</span>
                        <h4 style={{ fontSize: '1.05rem', margin: 0 }}>{sub.name}</h4>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                        Next Billing: <strong>{sub.nextBillingDate}</strong> • Auto-Reminders: <strong>{sub.autoReminder ? 'Active (WhatsApp + SMS)' : 'Off'}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0b1727', fontFamily: 'var(--font-mono)' }}>
                        ₹{sub.fee.toLocaleString('en-IN')} / {sub.billingCycle}
                      </div>
                      <span className="badge badge-emerald mt-1">Status: Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------ */}
          {/* TAB 5: FOLDER-WISE DOCUMENT VAULT                      */}
          {/* ------------------------------------------------------ */}
          {activeTab === 'documents_vault' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h4 style={{ fontSize: '1.1rem', margin: 0, color: '#0b1727' }}>
                    Folder-Wise Client Document Vault
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                    Centralized encrypted repository organized by folders
                  </p>
                </div>

                <button onClick={() => showToast('Upload document modal')} className="btn btn-sm btn-primary">
                  <UploadCloud size={14} /> Upload Document
                </button>
              </div>

              {/* Folder Filter Pills */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {folderCategories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setDocFolder(cat.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: docFolder === cat.id ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      background: docFolder === cat.id ? '#eff6ff' : '#fff',
                      color: docFolder === cat.id ? '#1e40af' : '#475569',
                      fontWeight: docFolder === cat.id ? '700' : '500',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Documents Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                {filteredDocs.map(doc => (
                  <div key={doc.id} className="card" style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="flex items-center gap-3">
                      <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0b1727' }}>{doc.name}</div>
                        <small style={{ color: '#64748b' }}>{doc.size} • {doc.date}</small>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button onClick={() => showToast(`Previewing ${doc.name}`)} className="btn btn-sm btn-outline" style={{ padding: '4px 8px' }}>
                        <Eye size={13} />
                      </button>
                      <button onClick={() => showToast(`Downloading ${doc.name}`)} className="btn btn-sm btn-outline" style={{ padding: '4px 8px' }}>
                        <Download size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------ */}
          {/* TAB 6: INTERNAL NOTES & VOICE RECORDINGS               */}
          {/* ------------------------------------------------------ */}
          {activeTab === 'notes_voice' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="flex justify-between items-center">
                <h4 style={{ fontSize: '1.1rem', margin: 0, color: '#0b1727' }}>
                  Internal Relationship Notes &amp; Voice-to-CRM Memos
                </h4>
              </div>

              {/* Add Note Input Form */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                <label className="text-xs font-bold text-slate-600 block mb-1">Add Note / Discussion Remark</label>
                <textarea
                  rows={2}
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  placeholder="Record customer discussion remark e.g. 'Bank manager agreed on 35% subsidy claim file'..."
                  className="input input-sm w-full mb-2"
                ></textarea>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => {
                      showToast('Audio voice recorder active! Speak into microphone...');
                    }}
                    className="btn btn-sm btn-outline"
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', borderColor: '#ef4444', color: '#ef4444' }}
                  >
                    <Mic size={14} /> Record Voice Memo
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!newNoteText.trim()) return;
                      showToast('Internal note saved!');
                      setNewNoteText('');
                    }}
                    className="btn btn-sm btn-primary"
                  >
                    + Add Note
                  </button>
                </div>
              </div>

              {/* Notes List with Audio Playback */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {notesList.map((n, idx) => (
                  <div key={n.id} className="card" style={{ padding: '16px' }}>
                    <div className="flex justify-between items-center mb-1">
                      <strong style={{ fontSize: '0.9rem', color: '#2563eb' }}>{n.author}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{n.date}</span>
                    </div>

                    <p style={{ margin: '4px 0 8px', fontSize: '0.88rem', color: '#334155', lineHeight: '1.5' }}>
                      {n.text}
                    </p>

                    {n.hasAudio && (
                      <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPlayingAudioId(playingAudioId === idx ? null : idx)}
                            style={{ width: '26px', height: '26px', borderRadius: '50%', border: 'none', background: playingAudioId === idx ? '#ef4444' : '#ff6f00', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            {playingAudioId === idx ? <Pause size={12} /> : <Play size={12} fill="#fff" />}
                          </button>
                          <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '600' }}>
                            {playingAudioId === idx ? '▶ Playing Audio Note...' : `🎧 Voice Memo Attached (${n.audioDuration})`}
                          </span>
                        </div>
                        <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>Encrypted Voice-to-CRM</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------ */}
          {/* TAB 7: PROJECTS & OPERATIONAL TASKS                    */}
          {/* ------------------------------------------------------ */}
          {activeTab === 'projects_tasks' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', margin: '0 0 12px', color: '#0b1727' }}>
                  Assigned Projects ({cust.projects?.length || 1} Total)
                </h4>
                {(cust.projects || [
                  { id: 'PRJ-2026-001', name: 'Sharma Agro MCA Incorporation & SPICe+', service: 'Private Limited Registration', status: 'Completed (RoC Approved)', progress: 100, assignedTo: 'CS Priya Nair' }
                ]).map((proj, idx) => (
                  <div key={idx} className="card" style={{ padding: '16px', marginBottom: '10px' }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="badge badge-saffron">{proj.id}</span>
                        <h4 style={{ fontSize: '1.05rem', margin: '4px 0' }}>{proj.name}</h4>
                        <small style={{ color: '#64748b' }}>Assigned Executive: <strong>{proj.assignedTo || 'CA Rajesh Verma'}</strong></small>
                      </div>
                      <span className="badge badge-emerald">{proj.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 style={{ fontSize: '1.05rem', margin: 0, color: '#0b1727' }}>Operational Tasks &amp; Deliverables</h4>
                  <button onClick={() => showToast('Create task modal')} className="btn btn-sm btn-outline">+ Add Task</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {clientTasks.map(t => (
                    <div key={t.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ fontSize: '0.9rem', color: '#0b1727' }}>{t.title}</strong>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Assigned to: {t.assignedTo} • Due: {t.dueDate}</div>
                      </div>
                      <span className={`badge ${t.status === 'Completed' ? 'badge-emerald' : t.status === 'In_Progress' ? 'badge-blue' : 'badge-amber'}`}>
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------ */}
          {/* TAB 8: REMINDERS & CLIENT SUPPORT HELPDESK             */}
          {/* ------------------------------------------------------ */}
          {activeTab === 'reminders_support' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Reminders Block */}
              <div className="card" style={{ padding: '18px' }}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Bell size={18} color="#ff6f00" />
                    <strong style={{ fontSize: '1rem', color: '#0b1727' }}>Automated Compliance Reminders (रिमाइंडर)</strong>
                  </div>
                  <button onClick={() => setShowReminderModal(true)} className="btn btn-sm btn-outline">+ Set Reminder</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ background: '#f8fafc', borderLeft: '4px solid #f59e0b', padding: '10px 14px', borderRadius: '6px' }}>
                    <div className="flex justify-between items-center">
                      <strong style={{ fontSize: '0.88rem' }}>GSTR-3B Monthly Return Filing Due</strong>
                      <span className="badge badge-amber">20 Sep 2026</span>
                    </div>
                    <small style={{ color: '#64748b' }}>Auto WhatsApp alert scheduled for client 3 days prior</small>
                  </div>

                  <div style={{ background: '#f8fafc', borderLeft: '4px solid #10b981', padding: '10px 14px', borderRadius: '6px' }}>
                    <div className="flex justify-between items-center">
                      <strong style={{ fontSize: '0.88rem' }}>PMEGP 3-Year TDR Deposit Subsidy Lock-in Verification</strong>
                      <span className="badge badge-emerald">15 Oct 2026</span>
                    </div>
                    <small style={{ color: '#64748b' }}>Bank inspection reminder with SBI Branch Manager</small>
                  </div>
                </div>
              </div>

              {/* Support Helpdesk */}
              <div className="card" style={{ padding: '18px' }}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <HelpCircle size={18} color="#2563eb" />
                    <strong style={{ fontSize: '1rem', color: '#0b1727' }}>Client Support Tickets &amp; Grievances</strong>
                  </div>
                  <button onClick={() => showToast('Create ticket modal')} className="btn btn-sm btn-outline">+ Create Ticket</button>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="badge badge-blue">TKT-2026-041</span>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', marginTop: '2px' }}>Inquiry regarding PMEGP 35% subsidy claim window</div>
                    <small style={{ color: '#64748b' }}>Logged on 31 Aug 2026 • Resolved by Sunil Manchanda</small>
                  </div>
                  <span className="badge badge-emerald">Resolved</span>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------ */}
          {/* TAB 9: SECURITY & ACCESS AUDIT LOGS                    */}
          {/* ------------------------------------------------------ */}
          {activeTab === 'audit_security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Lock size={18} color="#2563eb" />
                  <strong style={{ fontSize: '0.95rem', color: '#0b1727' }}>Enterprise Security &amp; Access Log Audit ("किसने कब लॉगिन करके क्या देखा")</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                  Immutable audit trail tracking every staff login, dossier view, document export, and profile modification.
                </p>
              </div>

              <div className="table-wrapper">
                <table className="data-table" style={{ fontSize: '0.82rem' }}>
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Officer / User</th>
                      <th>Role</th>
                      <th>Action Performed</th>
                      <th>IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessLogs.map(log => (
                      <tr key={log.id}>
                        <td>{log.time}</td>
                        <td><strong>{log.user}</strong></td>
                        <td><span className="badge badge-blue">{log.role}</span></td>
                        <td>{log.action}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: '#64748b' }}>{log.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 10: CLIENT SALES, PURCHASES & OUTSOURCED BILL BOOK    */}
          {/* ======================================================== */}
          {activeTab === 'client_billing' && (
            <div style={{ padding: '4px 0' }}>
              <ClientBillingManager customer={cust} />
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div style={{ background: '#f8fafc', padding: '14px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Customer Dossier #{cust.id} • DUS Master CRM Enterprise Ecosystem
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintStatement}
              className="btn btn-sm btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <Printer size={14} /> Print Summary
            </button>

            <button
              type="button"
              onClick={() => setSelectedCustomerFor360(null)}
              className="btn btn-sm btn-primary"
              style={{ background: '#0b1727' }}
            >
              Close
            </button>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* REASSIGN RM MODAL POPUP                                  */}
      {/* ======================================================== */}
      {showRmModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => setShowRmModal(false)}>
          <div className="modal-card" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Reassign Relationship Manager</h4>
              <button onClick={() => setShowRmModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group mb-3">
                <label className="form-label">Select New Relationship Manager</label>
                <select
                  value={selectedNewRm}
                  onChange={e => setSelectedNewRm(e.target.value)}
                  className="form-control"
                >
                  <option value="CA Rajesh Verma">CA Rajesh Verma (Cabin #02 - Legal &amp; Accounts)</option>
                  <option value="Sunil Manchanda">Sunil Manchanda (Cabin #04 - Banking Liaison)</option>
                  <option value="Vikramaditya Rathore">Vikramaditya Rathore (Cabin #03 - Govt Subsidy)</option>
                  <option value="Dr. R. K. Saxena">Dr. R. K. Saxena (Cabin #01 - Business Feasibility)</option>
                  <option value="Neha Sharma">Neha Sharma (Senior RM)</option>
                </select>
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Reason for Reassignment *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Client needs specialized banking liaison for SBI loan sanction..."
                  className="form-control"
                  value={reassignReason}
                  onChange={e => setReassignReason(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowRmModal(false)} className="btn btn-outline btn-sm">Cancel</button>
              <button
                onClick={() => {
                  assignedRm.name = selectedNewRm;
                  showToast(`Relationship Manager updated to ${selectedNewRm}!`);
                  setShowRmModal(false);
                }}
                className="btn btn-primary btn-sm"
              >
                Confirm Reassignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* RECORD EXPENSE MODAL POPUP                               */}
      {/* ======================================================== */}
      {showExpenseModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => setShowExpenseModal(false)}>
          <div className="modal-card" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Record Client Expense</h4>
              <button onClick={() => setShowExpenseModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group mb-3">
                <label className="form-label">Expense Description *</label>
                <input
                  type="text"
                  placeholder="e.g. RoC Govt Challan Fee"
                  className="form-control"
                  value={expTitle}
                  onChange={e => setExpTitle(e.target.value)}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label className="form-label">Amount (₹) *</label>
                  <input
                    type="number"
                    placeholder="1200"
                    className="form-control"
                    value={expAmount}
                    onChange={e => setExpAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select
                    value={expCategory}
                    onChange={e => setExpCategory(e.target.value)}
                    className="form-control"
                  >
                    <option value="Govt_Challan">Govt Challan</option>
                    <option value="Stamp_Duty">Stamp Duty</option>
                    <option value="Notary">Notary &amp; Affidavit</option>
                    <option value="Travel">Field / Travel</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowExpenseModal(false)} className="btn btn-outline btn-sm">Cancel</button>
              <button
                onClick={() => {
                  if (!expTitle || !expAmount) return;
                  customerExpenses.unshift({
                    id: `EXP-0${customerExpenses.length + 1}`,
                    date: new Date().toISOString().split('T')[0],
                    category: expCategory,
                    desc: expTitle,
                    amount: Number(expAmount),
                    reimbursable: 'Billed to Client'
                  });
                  showToast(`Expense of ₹${expAmount} logged for ${cust.name}!`);
                  setShowExpenseModal(false);
                  setExpTitle('');
                  setExpAmount('');
                }}
                className="btn btn-primary btn-sm"
              >
                Save Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SET REMINDER MODAL POPUP                                 */}
      {/* ======================================================== */}
      {showReminderModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => setShowReminderModal(false)}>
          <div className="modal-card" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Schedule Compliance Reminder</h4>
              <button onClick={() => setShowReminderModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group mb-3">
                <label className="form-label">Reminder Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Advance Tax 2nd Installment Due"
                  className="form-control"
                  value={reminderTitle}
                  onChange={e => setReminderTitle(e.target.value)}
                />
              </div>
              <div className="form-group mb-3">
                <label className="form-label">Reminder Due Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={reminderDate}
                  onChange={e => setReminderDate(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowReminderModal(false)} className="btn btn-outline btn-sm">Cancel</button>
              <button
                onClick={() => {
                  if (!reminderTitle) return;
                  showToast(`Reminder scheduled for ${reminderDate || 'due date'}!`);
                  setShowReminderModal(false);
                  setReminderTitle('');
                }}
                className="btn btn-primary btn-sm"
              >
                Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
