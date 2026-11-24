import React, { useState, useEffect } from 'react';
import { useRouter, getApiUrl } from '../../../router/Router';
import { useApp } from '../../../context/AppContext';
import { 
  FileText, 
  FileCheck, 
  Search, 
  Filter, 
  Upload, 
  Download, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Folder, 
  Building2, 
  Calendar, 
  MoreVertical, 
  Plus, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  FileWarning, 
  Archive, 
  UserCheck,
  Tag
} from 'lucide-react';

export const DocumentsModule = () => {
  const { navigate } = useRouter();
  const { showToast } = useApp();

  // Active view filter
  const [activeFolderView, setActiveFolderView] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Preview & Upload Modal States
  const [previewDoc, setPreviewDoc] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  // 8 Dashboard KPI metrics
  const [stats, setStats] = useState({
    totalDocs: 142,
    verifiedDocs: 98,
    pendingDocs: 32,
    rejectedDocs: 6,
    expiredDocs: 4,
    missingDocs: 18,
    requestedDocs: 24,
    recentlyUploaded: 12
  });

  // Document Vault State
  const [documents, setDocuments] = useState([
    {
      id: 1,
      doc_code: 'DOC-2026-101',
      title: 'Udyam Registration Certificate',
      customer_name: 'Sharma Agro Solutions Pvt. Ltd.',
      customer_code: 'CUST-301',
      lead_name: 'Sharma Agro Solutions',
      project_name: 'PMEGP Agro Processing Unit',
      category: 'Business Registration',
      sub_category: 'MSME / Udyam',
      file_size: '1.2 MB',
      file_type: 'PDF',
      upload_date: '20 Nov 2026',
      uploaded_by: 'Client Portal',
      status: 'Verified',
      verified_by: 'Sunita Choudhary',
      verification_date: '21 Nov 2026',
      notes: 'Udyam number UDYAM-RJ-14-0029141 verified active.'
    },
    {
      id: 2,
      doc_code: 'DOC-2026-102',
      title: 'Detailed Project Report (DPR) - ₹25 Lakhs',
      customer_name: 'Sharma Agro Solutions Pvt. Ltd.',
      customer_code: 'CUST-301',
      lead_name: 'Sharma Agro Solutions',
      project_name: 'PMEGP Agro Processing Unit',
      category: 'Project Reports & DPR',
      sub_category: 'Bank Viability Report',
      file_size: '3.8 MB',
      file_type: 'PDF',
      upload_date: '22 Nov 2026',
      uploaded_by: 'Pooja Verma (DPR Specialist)',
      status: 'Verified',
      verified_by: 'Rajesh Verma',
      verification_date: '23 Nov 2026',
      notes: 'DSCR 2.14, IRR 28.5%, BEP 38.2%. Compliant with KVIC guidelines.'
    },
    {
      id: 3,
      doc_code: 'DOC-2026-103',
      title: 'GST Return GSTR-3B (Last 6 Months)',
      customer_name: 'Amit Enterprises',
      customer_code: 'CUST-302',
      lead_name: 'Amit Enterprises',
      project_name: 'MUDRA Working Capital Expansion',
      category: 'Financial Documents',
      sub_category: 'GST Returns',
      file_size: '4.2 MB',
      file_type: 'PDF',
      upload_date: '21 Nov 2026',
      uploaded_by: 'Amit Kumar',
      status: 'Verified',
      verified_by: 'Priyanka Sen',
      verification_date: '22 Nov 2026',
      notes: 'Nil default detected. Monthly turnover verified with bank statements.'
    },
    {
      id: 4,
      doc_code: 'DOC-2026-104',
      title: 'Plant & Machinery Quotation with Proforma Invoice',
      customer_name: 'Sharma Agro Solutions Pvt. Ltd.',
      customer_code: 'CUST-301',
      lead_name: 'Sharma Agro Solutions',
      project_name: 'PMEGP Agro Processing Unit',
      category: 'Quotations & Invoices',
      sub_category: 'OEM Supplier Quotation',
      file_size: '850 KB',
      file_type: 'PDF',
      upload_date: '23 Nov 2026',
      uploaded_by: 'Client Portal',
      status: 'Under Review',
      verified_by: 'Pending Assignment',
      verification_date: null,
      notes: 'Awaiting GST compliance validation on supplier quotation.'
    },
    {
      id: 5,
      doc_code: 'DOC-2026-105',
      title: 'Bank Sanction Letter - Bank of Baroda',
      customer_name: 'Goyal Agro Tech',
      customer_code: 'CUST-304',
      lead_name: 'Goyal Agro Tech',
      project_name: 'State Subsidy Solar Cold Room',
      category: 'Bank Sanction & Letters',
      sub_category: 'Term Loan Sanction',
      file_size: '1.5 MB',
      file_type: 'PDF',
      upload_date: '18 Nov 2026',
      uploaded_by: 'Meenakshi Jain',
      status: 'Verified',
      verified_by: 'Anil Tyagi',
      verification_date: '19 Nov 2026',
      notes: 'Sanctioned ₹15.00 Lakhs @ 8.65% ROI. Margin 10% deposited.'
    },
    {
      id: 6,
      doc_code: 'DOC-2026-106',
      title: 'Land Possession & Rent Agreement Deed',
      customer_name: 'ABC Manufacturing Pvt Ltd',
      customer_code: 'CUST-303',
      lead_name: 'ABC Manufacturing',
      project_name: 'CGTMSE Engineering Workshop',
      category: 'Legal & Property',
      sub_category: 'Registered Lease Deed',
      file_size: '6.4 MB',
      file_type: 'PDF',
      upload_date: '24 Nov 2026',
      uploaded_by: 'Deepak Rawat',
      status: 'Under Review',
      verified_by: 'Pending Verification',
      verification_date: null,
      notes: '5-year lease verified. Sub-registrar stamp attached.'
    },
    {
      id: 7,
      doc_code: 'DOC-2026-107',
      title: 'Audited Balance Sheet & P&L (FY 2024-25)',
      customer_name: 'Amit Enterprises',
      customer_code: 'CUST-302',
      lead_name: 'Amit Enterprises',
      project_name: 'MUDRA Working Capital Expansion',
      category: 'Financial Documents',
      sub_category: 'Audited Financials',
      file_size: '2.9 MB',
      file_type: 'PDF',
      upload_date: '19 Nov 2026',
      uploaded_by: 'Client Portal',
      status: 'Verified',
      verified_by: 'Rajesh Verma',
      verification_date: '20 Nov 2026',
      notes: 'UDIN verified on ICAI portal. CA certified.'
    },
    {
      id: 8,
      doc_code: 'DOC-2026-108',
      title: 'Electricity Bill & Factory NOC',
      customer_name: 'Khandelwal Engineering Works',
      customer_code: 'CUST-305',
      lead_name: 'Khandelwal Engineering',
      project_name: 'PMEGP Tool Room Unit',
      category: 'Legal & Property',
      sub_category: 'Utility Bill',
      file_size: '620 KB',
      file_type: 'PDF',
      upload_date: '15 Nov 2026',
      uploaded_by: 'Client Portal',
      status: 'Expired',
      verified_by: 'Sunita Choudhary',
      verification_date: '16 Nov 2026',
      notes: 'Bill is older than 3 months. Fresh latest bill requested from client.'
    }
  ]);

  // Load from backend API if available
  useEffect(() => {
    fetch(getApiUrl('api/v1/documents.php?action=list'))
      .then(res => res.json())
      .then(data => {
        if (data.success && data.documents && data.documents.length > 0) {
          setDocuments(data.documents);
          if (data.stats) {
            setStats({
              totalDocs: data.stats.total_documents,
              verifiedDocs: data.stats.verified,
              pendingDocs: data.stats.pending,
              rejectedDocs: data.stats.rejected,
              expiredDocs: data.stats.expired,
              missingDocs: data.stats.missing,
              requestedDocs: data.stats.requested,
              recentlyUploaded: data.stats.recently_uploaded
            });
          }
        }
      })
      .catch(() => {});
  }, []);

  // Filter Logic
  const filteredDocs = documents.filter(doc => {
    const term = searchTerm.toLowerCase();
    const searchMatch = 
      doc.title.toLowerCase().includes(term) ||
      doc.customer_name.toLowerCase().includes(term) ||
      doc.doc_code.toLowerCase().includes(term);

    const catMatch = categoryFilter === 'all' || doc.category === categoryFilter;

    let statusMatch = true;
    if (statusFilter === 'verified') statusMatch = doc.status === 'Verified';
    else if (statusFilter === 'pending') statusMatch = doc.status === 'Under Review' || doc.status === 'Pending';
    else if (statusFilter === 'rejected') statusMatch = doc.status === 'Rejected';
    else if (statusFilter === 'expired') statusMatch = doc.status === 'Expired';

    let folderMatch = true;
    if (activeFolderView === 'pending') folderMatch = doc.status === 'Under Review' || doc.status === 'Pending';
    else if (activeFolderView === 'expiring') folderMatch = doc.status === 'Expired';
    else if (activeFolderView === 'customer') folderMatch = doc.customer_code === 'CUST-301';

    return searchMatch && catMatch && statusMatch && folderMatch;
  });

  const handleVerifyAction = (docId, newStatus) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          status: newStatus,
          verified_by: 'Admin Officer',
          verification_date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        };
      }
      return d;
    }));

    if (previewDoc && previewDoc.id === docId) {
      setPreviewDoc(prev => ({
        ...prev,
        status: newStatus,
        verified_by: 'Admin Officer',
        verification_date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      }));
    }

    showToast(`Document marked as ${newStatus}`, 'success');

    // Call API
    fetch(getApiUrl('api/v1/documents.php?action=verify'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: docId, status: newStatus })
    }).catch(() => {});
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#002970', margin: '0 0 4px 0' }}>
            Document Management Workspace
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748B', margin: 0 }}>
            Centralized secure vault for client KYC, business registrations, DPR reports, quotations and bank sanctions
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="button"
            onClick={() => showToast('Exporting document verification register...', 'info')}
            style={{
              padding: '10px 18px',
              background: '#FFFFFF',
              color: '#002970',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Download size={16} />
            <span>Export Register</span>
          </button>
          <button 
            type="button"
            onClick={() => setShowUploadModal(true)}
            style={{
              padding: '10px 22px',
              background: '#00BAF2',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,186,242,0.25)'
            }}
          >
            <Upload size={16} />
            <span>+ Upload Document</span>
          </button>
        </div>
      </div>

      {/* 8 Dashboard KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '14px',
        marginBottom: '24px'
      }}>
        {/* Card 1: Total Documents */}
        <div 
          onClick={() => { setActiveFolderView('all'); setStatusFilter('all'); }}
          style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px 18px', border: '1px solid #E2E8F0', cursor: 'pointer', transition: 'all 0.15s ease' }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>Total Documents</div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#002970' }}>{stats.totalDocs}</div>
          <div style={{ fontSize: '0.74rem', color: '#00BAF2', marginTop: '2px', fontWeight: '600' }}>Active in vault</div>
        </div>

        {/* Card 2: Verified Documents */}
        <div 
          onClick={() => { setActiveFolderView('all'); setStatusFilter('verified'); }}
          style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px 18px', border: '1px solid #E2E8F0', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>Verified Documents</div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#16A34A' }}>{stats.verifiedDocs}</div>
          <div style={{ fontSize: '0.74rem', color: '#16A34A', marginTop: '2px', fontWeight: '600' }}>KYC &amp; DPR approved</div>
        </div>

        {/* Card 3: Pending Verification */}
        <div 
          onClick={() => { setActiveFolderView('pending'); setStatusFilter('pending'); }}
          style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px 18px', border: '1px solid #E2E8F0', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>Pending Verification</div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#F59E0B' }}>{stats.pendingDocs}</div>
          <div style={{ fontSize: '0.74rem', color: '#F59E0B', marginTop: '2px', fontWeight: '600' }}>Action required</div>
        </div>

        {/* Card 4: Rejected Documents */}
        <div 
          onClick={() => { setActiveFolderView('all'); setStatusFilter('rejected'); }}
          style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px 18px', border: '1px solid #E2E8F0', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>Rejected Documents</div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#DC2626' }}>0{stats.rejectedDocs}</div>
          <div style={{ fontSize: '0.74rem', color: '#DC2626', marginTop: '2px', fontWeight: '600' }}>Resubmission needed</div>
        </div>

        {/* Card 5: Expired Documents */}
        <div 
          onClick={() => { setActiveFolderView('expiring'); setStatusFilter('expired'); }}
          style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px 18px', border: '1px solid #E2E8F0', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>Expired Documents</div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#7C3AED' }}>0{stats.expiredDocs}</div>
          <div style={{ fontSize: '0.74rem', color: '#7C3AED', marginTop: '2px', fontWeight: '600' }}>Renewal required</div>
        </div>

        {/* Card 6: Missing Documents */}
        <div 
          onClick={() => showToast('Displaying checklist of 18 missing client documents', 'info')}
          style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px 18px', border: '1px solid #E2E8F0', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>Missing Documents</div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#E11D48' }}>{stats.missingDocs}</div>
          <div style={{ fontSize: '0.74rem', color: '#E11D48', marginTop: '2px', fontWeight: '600' }}>Pending from borrower</div>
        </div>

        {/* Card 7: Documents Requested */}
        <div 
          onClick={() => showToast('Listing 24 active document requisition requests', 'info')}
          style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px 18px', border: '1px solid #E2E8F0', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>Documents Requested</div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0284C7' }}>{stats.requestedDocs}</div>
          <div style={{ fontSize: '0.74rem', color: '#0284C7', marginTop: '2px', fontWeight: '600' }}>Sent to client portal</div>
        </div>

        {/* Card 8: Recently Uploaded */}
        <div 
          onClick={() => { setActiveFolderView('all'); setStatusFilter('all'); }}
          style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px 18px', border: '1px solid #E2E8F0', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>Recently Uploaded</div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0D9488' }}>{stats.recentlyUploaded}</div>
          <div style={{ fontSize: '0.74rem', color: '#0D9488', marginTop: '2px', fontWeight: '600' }}>Uploaded past 48 hrs</div>
        </div>
      </div>

      {/* 9 Document Sub-views / Folders */}
      <div style={{
        display: 'flex',
        gap: '6px',
        background: '#F8FAFC',
        padding: '6px',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
        marginBottom: '20px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'all', label: 'All Documents' },
          { id: 'customer', label: 'Customer-wise Folders' },
          { id: 'lead', label: 'Lead-wise Folders' },
          { id: 'project', label: 'Project-wise Folders' },
          { id: 'scheme', label: 'Scheme-wise Docs' },
          { id: 'pending', label: 'Pending Verification' },
          { id: 'missing', label: 'Missing Documents' },
          { id: 'expiring', label: 'Expiring Documents' },
          { id: 'archived', label: 'Archived Documents' }
        ].map(tab => {
          const isActive = activeFolderView === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFolderView(tab.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#00BAF2' : 'transparent',
                color: isActive ? '#FFFFFF' : '#475569',
                fontWeight: isActive ? '700' : '600',
                fontSize: '0.84rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid #E2E8F0',
        marginBottom: '20px',
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr 1fr auto',
        gap: '12px',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input 
            type="text"
            placeholder="Search document title, customer, or DOC ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem', color: '#1E293B' }}
          >
            <option value="all">All Categories ▾</option>
            <option value="Business Registration">Business Registration</option>
            <option value="Project Reports & DPR">Project Reports &amp; DPR</option>
            <option value="Financial Documents">Financial Documents</option>
            <option value="Quotations & Invoices">Quotations &amp; Invoices</option>
            <option value="Bank Sanction & Letters">Bank Sanctions &amp; Letters</option>
            <option value="Legal & Property">Legal &amp; Property</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem', color: '#1E293B' }}
          >
            <option value="all">Verification Status ▾</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending / Under Review</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <div>
          <input 
            type="text"
            placeholder="Date Range ▾"
            onFocus={(e) => e.target.type = 'date'}
            onBlur={(e) => e.target.type = 'text'}
            style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
          />
        </div>

        <div>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setStatusFilter('all');
              setActiveFolderView('all');
            }}
            style={{
              padding: '9px 16px',
              background: '#F1F5F9',
              color: '#475569',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Document Workspace Table */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '14px 18px', fontSize: '0.82rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Doc Reference</th>
                <th style={{ padding: '14px 18px', fontSize: '0.82rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Document Name &amp; File</th>
                <th style={{ padding: '14px 18px', fontSize: '0.82rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Customer / Project</th>
                <th style={{ padding: '14px 18px', fontSize: '0.82rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '14px 18px', fontSize: '0.82rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Upload Date</th>
                <th style={{ padding: '14px 18px', fontSize: '0.82rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Verification Status</th>
                <th style={{ padding: '14px 18px', fontSize: '0.82rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                    No documents found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredDocs.map(doc => {
                  const isVerified = doc.status === 'Verified';
                  const isReview = doc.status === 'Under Review' || doc.status === 'Pending';
                  const isExpired = doc.status === 'Expired';
                  const isRejected = doc.status === 'Rejected';

                  return (
                    <tr key={doc.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      {/* Doc Reference */}
                      <td style={{ padding: '14px 18px', fontFamily: 'monospace', fontWeight: '700', color: '#002970', fontSize: '0.86rem' }}>
                        {doc.doc_code}
                      </td>

                      {/* Title & File Type */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#EFF6FF', color: '#008BCB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileText size={18} />
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', color: '#002970', fontSize: '0.9rem' }}>{doc.title}</div>
                            <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                              {doc.file_type} • {doc.file_size}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Customer & Project */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: '600', color: '#1E293B', fontSize: '0.88rem' }}>{doc.customer_name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{doc.project_name}</div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: '#F1F5F9',
                          color: '#475569',
                          fontSize: '0.78rem',
                          fontWeight: '600'
                        }}>
                          {doc.category}
                        </span>
                      </td>

                      {/* Upload Date & By */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontSize: '0.88rem', color: '#334155', fontWeight: '500' }}>{doc.upload_date}</div>
                        <div style={{ fontSize: '0.76rem', color: '#64748B' }}>By: {doc.uploaded_by}</div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          background: isVerified ? '#DCFCE7' : isReview ? '#FEF3C7' : isExpired ? '#EDE9FE' : '#FEE2E2',
                          color: isVerified ? '#16A34A' : isReview ? '#D97706' : isExpired ? '#7C3AED' : '#DC2626'
                        }}>
                          {isVerified ? '✓ Verified' : isReview ? '⏳ Under Review' : isExpired ? '⚠ Expired' : '✕ Rejected'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => setPreviewDoc(doc)}
                            style={{
                              padding: '6px 12px',
                              background: '#002970',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '6px',
                              fontWeight: '600',
                              fontSize: '0.82rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <Eye size={13} />
                            <span>Preview</span>
                          </button>

                          <a
                            href={getApiUrl(`api/v1/generate_pdf.php?type=receipt&id=${doc.id}&mode=download`)}
                            download={`${doc.doc_code}_${doc.title}.pdf`}
                            style={{
                              padding: '6px 10px',
                              background: '#F1F5F9',
                              color: '#002970',
                              border: '1px solid #CBD5E1',
                              borderRadius: '6px',
                              fontWeight: '600',
                              fontSize: '0.82rem',
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Download size={13} />
                            <span>PDF</span>
                          </a>

                          {/* Quick Verification Actions */}
                          {isReview && (
                            <button
                              type="button"
                              onClick={() => handleVerifyAction(doc.id, 'Verified')}
                              title="Quick Approve"
                              style={{
                                padding: '6px 8px',
                                background: '#DCFCE7',
                                color: '#16A34A',
                                border: '1px solid #86EFAC',
                                borderRadius: '6px',
                                cursor: 'pointer'
                              }}
                            >
                              <CheckCircle2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DOCUMENT PREVIEW WORKSPACE MODAL */}
      {previewDoc && (
        <DocumentPreviewModal 
          document={previewDoc} 
          onClose={() => setPreviewDoc(null)} 
          onVerify={(status) => handleVerifyAction(previewDoc.id, status)}
        />
      )}

      {/* UPLOAD DOCUMENT MODAL */}
      {showUploadModal && (
        <UploadDocumentModal 
          onClose={() => setShowUploadModal(false)}
          onUpload={(newDoc) => {
            setDocuments([newDoc, ...documents]);
            setShowUploadModal(false);
            showToast(`Document ${newDoc.title} uploaded successfully`, 'success');
          }}
        />
      )}
    </div>
  );
};

// -----------------------------------------------------------------
// COMPONENT: DOCUMENT PREVIEW MODAL WORKSPACE
// -----------------------------------------------------------------
const DocumentPreviewModal = ({ document, onClose, onVerify }) => {
  const [zoom, setZoom] = useState(100);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        maxWidth: '1100px',
        width: '100%',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Workspace Toolbar Header */}
        <div style={{
          background: '#002970',
          padding: '16px 24px',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Document Verification Workspace • {document.doc_code}
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '2px 0 0 0' }}>{document.title}</h2>
          </div>

          {/* Action Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Zoom Controls */}
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: '6px', padding: '2px 6px' }}>
              <button 
                type="button" 
                onClick={() => setZoom(prev => Math.max(50, prev - 10))}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '4px' }}
              >
                <ZoomOut size={16} />
              </button>
              <span style={{ fontSize: '0.82rem', padding: '0 6px', fontWeight: '600' }}>{zoom}%</span>
              <button 
                type="button" 
                onClick={() => setZoom(prev => Math.min(200, prev + 10))}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '4px' }}
              >
                <ZoomIn size={16} />
              </button>
            </div>

            <a
              href={getApiUrl(`api/v1/generate_pdf.php?type=receipt&id=${document.id}&mode=download`)}
              download={`${document.doc_code}.pdf`}
              style={{
                padding: '7px 14px',
                background: '#00BAF2',
                color: '#FFFFFF',
                borderRadius: '6px',
                fontSize: '0.84rem',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={14} />
              <span>Download</span>
            </a>

            <button
              type="button"
              onClick={() => window.print()}
              style={{
                padding: '7px 14px',
                background: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.84rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Printer size={14} />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '1.6rem',
                cursor: 'pointer',
                marginLeft: '8px'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Workspace Body: Split View (Preview Canvas + Details Panel) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', flex: 1, overflow: 'hidden' }}>
          
          {/* Left Canvas: Document Simulation Render */}
          <div style={{
            background: '#475569',
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}>
            <div style={{
              background: '#FFFFFF',
              width: `${(zoom / 100) * 580}px`,
              minHeight: '750px',
              padding: '40px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              borderRadius: '4px',
              color: '#1E293B',
              fontSize: '0.9rem',
              lineHeight: '1.6'
            }}>
              {/* Official Seal Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #002970', paddingBottom: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748B', letterSpacing: '1px' }}>
                  GOVERNMENT OF INDIA / STATUTORY COMPLIANCE VAULT
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#002970', marginTop: '4px' }}>
                  {document.title}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#008BCB', fontWeight: '700', marginTop: '2px' }}>
                  Document Reference: {document.doc_code}
                </div>
              </div>

              {/* Verified Watermark Stamp */}
              {document.status === 'Verified' && (
                <div style={{
                  border: '2px solid #16A34A',
                  color: '#16A34A',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontWeight: '800',
                  margin: '16px 0',
                  letterSpacing: '1px'
                }}>
                  ✓ VERIFIED &amp; ATTESTED BY DIGITAL UDYOG SEVA
                </div>
              )}

              {/* Metadata Details in Canvas */}
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
                  <div><strong>Applicant:</strong> {document.customer_name}</div>
                  <div><strong>Customer Code:</strong> {document.customer_code}</div>
                  <div><strong>Associated Project:</strong> {document.project_name}</div>
                  <div><strong>Category:</strong> {document.category}</div>
                  <div><strong>Upload Date:</strong> {document.upload_date}</div>
                  <div><strong>Uploaded By:</strong> {document.uploaded_by}</div>
                </div>
              </div>

              {/* Simulated DPR / Document Excerpt */}
              <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                <h4 style={{ color: '#002970', margin: '0 0 8px 0' }}>Executive Summary &amp; Compliance Notes</h4>
                <p>
                  {document.notes || 'This document has been ingested into the Digital Udyog Seva centralized vault for banking viability review, scheme eligibility evaluation, and term loan underwriting.'}
                </p>
                <div style={{ marginTop: '20px', padding: '12px', borderLeft: '4px solid #00BAF2', background: '#F0F9FF' }}>
                  <strong>Statutory Integrity:</strong> Cryptographic SHA-256 hash verified. Document matches original issuing authority parameters.
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Audit Trail & Verification Controls */}
          <div style={{
            background: '#FFFFFF',
            borderLeft: '1px solid #E2E8F0',
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#002970', marginBottom: '16px' }}>
                Verification Audit Desk
              </h3>

              <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Current Status</div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '800',
                  marginTop: '4px',
                  color: document.status === 'Verified' ? '#16A34A' : document.status === 'Rejected' ? '#DC2626' : '#D97706'
                }}>
                  {document.status}
                </div>
                {document.verified_by && (
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '6px' }}>
                    Reviewed by: <strong>{document.verified_by}</strong> on {document.verification_date || 'N/A'}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Audit Officer Remarks
                </label>
                <textarea
                  defaultValue={document.notes}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    color: '#1E293B',
                    lineHeight: '1.5'
                  }}
                  placeholder="Enter verification remarks or reason for rejection..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={() => onVerify('Verified')}
                style={{
                  width: '100%',
                  padding: '11px',
                  background: '#16A34A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <CheckCircle2 size={16} />
                <span>Approve &amp; Mark Verified</span>
              </button>

              <button
                type="button"
                onClick={() => onVerify('Rejected')}
                style={{
                  width: '100%',
                  padding: '11px',
                  background: '#FEE2E2',
                  color: '#DC2626',
                  border: '1px solid #FCA5A5',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <XCircle size={16} />
                <span>Reject Document</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

// -----------------------------------------------------------------
// COMPONENT: UPLOAD DOCUMENT MODAL
// -----------------------------------------------------------------
const UploadDocumentModal = ({ onClose, onUpload }) => {
  const [title, setTitle] = useState('');
  const [customer, setCustomer] = useState('Sharma Agro Solutions Pvt. Ltd.');
  const [category, setCategory] = useState('Business Registration');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!title.trim()) return;

    const newDoc = {
      id: Date.now(),
      doc_code: `DOC-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      customer_name: customer,
      customer_code: 'CUST-301',
      lead_name: customer,
      project_name: 'PMEGP Business Loan',
      category: category,
      sub_category: 'Client Upload',
      file_size: '1.4 MB',
      file_type: 'PDF',
      upload_date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      uploaded_by: 'Staff Admin',
      status: 'Under Review',
      verified_by: 'Pending',
      verification_date: null,
      notes: notes || 'Uploaded for verification audit.'
    };

    onUpload(newDoc);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        maxWidth: '560px',
        width: '100%',
        padding: '28px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#002970', margin: 0 }}>
            Upload Client Document
          </h2>
          <button 
            type="button" 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.4rem', color: '#64748B', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
              Select Customer / Applicant *
            </label>
            <select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
            >
              <option value="Sharma Agro Solutions Pvt. Ltd.">Sharma Agro Solutions Pvt. Ltd. (CUST-301)</option>
              <option value="Amit Enterprises">Amit Enterprises (CUST-302)</option>
              <option value="ABC Manufacturing Pvt Ltd">ABC Manufacturing Pvt Ltd (CUST-303)</option>
              <option value="Goyal Agro Tech">Goyal Agro Tech (CUST-304)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
              Document Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
            >
              <option value="Business Registration">Business Registration (Udyam / PAN / GST)</option>
              <option value="Project Reports & DPR">Project Reports &amp; Bank Viability DPR</option>
              <option value="Financial Documents">Financial Documents (ITR / Balance Sheet)</option>
              <option value="Quotations & Invoices">Machinery Quotations &amp; Proforma</option>
              <option value="Bank Sanction & Letters">Bank Sanction &amp; Letters</option>
              <option value="Legal & Property">Legal, Lease &amp; Land Records</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
              Document Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Udyam Registration Certificate"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
            />
          </div>

          {/* File Picker */}
          <div style={{ border: '2px dashed #CBD5E1', borderRadius: '10px', padding: '24px', textAlign: 'center', background: '#F8FAFC' }}>
            <Upload size={28} color="#00BAF2" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#002970' }}>Click to select file or drag &amp; drop</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>PDF, PNG, JPG up to 25 MB</div>
            <input type="file" style={{ marginTop: '12px', fontSize: '0.82rem' }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: '10px 18px', background: '#FFFFFF', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!title.trim()}
            style={{
              padding: '10px 24px',
              background: title.trim() ? '#00BAF2' : '#CBD5E1',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              cursor: title.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            Upload to Vault
          </button>
        </div>
      </div>
    </div>
  );
};
