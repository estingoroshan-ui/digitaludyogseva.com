import React, { useState } from 'react';
import { useRouter } from '../../../router/Router';
import { useApp } from '../../../context/AppContext';
import { 
  FileCheck, 
  Search, 
  Filter, 
  Upload, 
  Download, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';

export const DocumentsModule = () => {
  const { navigate } = useRouter();
  const { showToast } = useApp();

  const [docsList, setDocsList] = useState([
    {
      id: 1,
      name: 'Udyam Registration Certificate',
      customer: 'Amit Enterprises',
      category: 'Business Registration',
      fileType: 'PDF (1.2 MB)',
      uploadDate: '2026-11-20',
      status: 'Verified',
      uploadedBy: 'Client Portal'
    },
    {
      id: 2,
      name: 'GST 3B Returns (Last 6 Months)',
      customer: 'Sharma Industries',
      category: 'Financial Documents',
      fileType: 'PDF (4.8 MB)',
      uploadDate: '2026-11-19',
      status: 'Verified',
      uploadedBy: 'CA Rajesh Verma'
    },
    {
      id: 3,
      name: 'PMEGP Detailed Project Report (DPR)',
      customer: 'ABC Manufacturing Pvt Ltd',
      category: 'Project Reports',
      fileType: 'PDF (2.4 MB)',
      uploadDate: '2026-11-18',
      status: 'Under Review',
      uploadedBy: 'DPR Team'
    },
    {
      id: 4,
      name: 'Machinery Quotation & Proforma Invoice',
      customer: 'Goyal Agro Tech',
      category: 'Quotations & Estimates',
      fileType: 'PDF (850 KB)',
      uploadDate: '2026-11-17',
      status: 'Under Review',
      uploadedBy: 'Machinery Desk'
    },
    {
      id: 5,
      name: 'Bank Sanction Letter - Bank of Baroda',
      customer: 'Goyal Agro Tech',
      category: 'Sanction & Disbursement',
      fileType: 'PDF (1.1 MB)',
      uploadDate: '2026-11-15',
      status: 'Verified',
      uploadedBy: 'Credit Team'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState('All');

  const filteredDocs = docsList.filter(d => {
    const term = searchTerm.toLowerCase();
    const nameMatch = d.name.toLowerCase().includes(term);
    const custMatch = d.customer.toLowerCase().includes(term);
    const catMatch = catFilter === 'All' || d.category === catFilter;
    return (nameMatch || custMatch) && catMatch;
  });

  return (
    <div>
      <div className="paytm-page-header">
        <div>
          <h1 className="paytm-page-title">Centralized Document Management</h1>
          <p className="paytm-page-subtitle">
            Secure vault for client KYC, business registrations, DPR reports, quotations and bank sanctions
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button"
            onClick={() => showToast('Choose file modal ready for upload', 'success')}
            className="paytm-btn paytm-btn-primary"
          >
            <Upload size={16} />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="paytm-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F1F5F9', padding: '8px 14px', borderRadius: '8px', width: '340px' }}>
            <Search size={16} color="#64748B" />
            <input 
              type="text" 
              placeholder="Search by document name or customer..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Business Registration', 'Financial Documents', 'Project Reports', 'Sanction & Disbursement'].map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setCatFilter(c)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: catFilter === c ? '#00BAF2' : '#E2E8F0',
                  background: catFilter === c ? '#E0F6FD' : '#FFFFFF',
                  color: catFilter === c ? '#002970' : '#475569',
                  fontSize: '0.78rem',
                  fontWeight: catFilter === c ? '700' : '500',
                  cursor: 'pointer'
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="paytm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="paytm-table-container" style={{ border: 'none' }}>
          <table className="paytm-table">
            <thead>
              <tr>
                <th>Document Title</th>
                <th>Client / Enterprise</th>
                <th>Category</th>
                <th>File Details</th>
                <th>Upload Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#002970' }}>{doc.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Uploaded by: {doc.uploadedBy}</div>
                  </td>
                  <td style={{ fontWeight: '600', color: '#334155' }}>
                    {doc.customer}
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#64748B' }}>
                    {doc.category}
                  </td>
                  <td style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#008BCB' }}>
                    {doc.fileType}
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#475569' }}>
                    {doc.uploadDate}
                  </td>
                  <td>
                    <span className={`paytm-badge ${doc.status === 'Verified' ? 'paytm-badge-success' : 'paytm-badge-warning'}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button 
                        type="button"
                        onClick={() => showToast(`Previewing ${doc.name}...`, 'success')}
                        className="paytm-btn paytm-btn-outline paytm-btn-sm"
                        title="Preview Document"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => showToast(`Downloading ${doc.name}...`, 'success')}
                        className="paytm-btn paytm-btn-outline paytm-btn-sm"
                        title="Download Document"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
