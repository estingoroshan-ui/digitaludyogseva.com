import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Building2, 
  ShieldCheck, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  IndianRupee, 
  CheckCircle2, 
  FileText, 
  Calendar, 
  Clock, 
  Award,
  Layers,
  HelpCircle,
  History,
  Download,
  UploadCloud
} from 'lucide-react';

export const Customer360Modal = () => {
  const { selectedCustomerFor360, setSelectedCustomerFor360, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'kyc' | 'services' | 'payments' | 'documents' | 'support' | 'projects' | 'history'

  if (!selectedCustomerFor360) return null;
  const cust = selectedCustomerFor360;

  return (
    <div className="modal-overlay" onClick={() => setSelectedCustomerFor360(null)}>
      <div 
        className="modal-card" 
        style={{ maxWidth: '860px', padding: 0, overflow: 'hidden' }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0b1727, #1b3557)', color: '#fff', padding: '22px 26px' }}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3">
                <span className="badge badge-saffron" style={{ fontSize: '0.72rem' }}>{cust.id}</span>
                <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                  <ShieldCheck size={12} /> KYC {cust.kycStatus}
                </span>
                <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                  {cust.customer360?.tier || 'Enterprise Client'}
                </span>
              </div>
              <h2 style={{ fontSize: '1.5rem', color: '#fff', marginTop: '8px' }}>{cust.name}</h2>
              <div className="flex items-center gap-4" style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
                <span className="flex items-center gap-1"><User size={13} /> {cust.contactPerson}</span>
                <span className="flex items-center gap-1"><Phone size={13} /> {cust.phone}</span>
                <span className="flex items-center gap-1"><MapPin size={13} /> {cust.city}</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedCustomerFor360(null)} 
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 8 Tabs Navigation */}
        <div style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', display: 'flex', overflowX: 'auto', padding: '4px 16px' }}>
          {[
            { id: 'overview', label: 'Customer 360°' },
            { id: 'kyc', label: 'KYC/Profile' },
            { id: 'services', label: `Services (${cust.services?.length || cust.activeServices?.length || 0})` },
            { id: 'payments', label: 'Payments' },
            { id: 'documents', label: `Documents (${cust.documents?.length || 0})` },
            { id: 'support', label: `Support (${cust.support?.length || 0})` },
            { id: 'projects', label: `Projects (${cust.projects?.length || 0})` },
            { id: 'history', label: 'Previous History' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === t.id ? '3px solid #2563eb' : '3px solid transparent',
                color: activeTab === t.id ? '#2563eb' : '#475569',
                fontWeight: activeTab === t.id ? '700' : '600',
                padding: '12px 14px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="modal-body" style={{ minHeight: '360px', maxHeight: '60vh', overflowY: 'auto' }}>
          {/* TAB 1: CUSTOMER 360° */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Account Health Score</small>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#059669', fontFamily: 'var(--font-mono)' }}>
                    {cust.customer360?.healthScore || 95} / 100
                  </div>
                  <small style={{ color: '#059669' }}>● Excellent Compliance</small>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Lifetime Billed Value</small>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0b1727', fontFamily: 'var(--font-mono)' }}>
                    {cust.totalBilled}
                  </div>
                  <small style={{ color: '#64748b' }}>Since {cust.customer360?.clientSince || '2026'}</small>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Relationship Manager</small>
                  <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#2563eb', marginTop: '4px' }}>
                    {cust.customer360?.relationshipManager || 'CA Rajesh Verma'}
                  </div>
                  <small style={{ color: '#64748b' }}>Dedicated Advisor</small>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Satisfaction Rating</small>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f59e0b', marginTop: '2px' }}>
                    {cust.customer360?.satisfactionRating || '5.0 ★'}
                  </div>
                  <small style={{ color: '#64748b' }}>Verified NPS</small>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.95rem', color: '#0b1727', marginBottom: '8px' }}>Executive Account Brief:</h4>
                <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {cust.customer360?.summary || 'Client profile established with active compliance tracking and zero pending tax issues.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: KYC/PROFILE */}
          {activeTab === 'kyc' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 style={{ fontSize: '1.1rem', color: '#0b1727' }}>Entity Master KYC Records</h4>
                <span className="badge badge-emerald">
                  <ShieldCheck size={14} /> Certified Corporate Identity
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div>
                  <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>Legal Entity Name</small>
                  <div style={{ fontWeight: '700', color: '#0b1727', marginTop: '2px' }}>
                    {cust.kycProfile?.legalName || cust.name}
                  </div>
                </div>

                <div>
                  <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>Trade / Brand Name</small>
                  <div style={{ fontWeight: '600', color: '#2563eb', marginTop: '2px' }}>
                    {cust.kycProfile?.tradeName || cust.name}
                  </div>
                </div>

                <div>
                  <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>Corporate PAN</small>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#0b1727', marginTop: '2px' }}>
                    {cust.kycProfile?.pan || 'AAECS1234F'}
                  </div>
                </div>

                <div>
                  <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>GSTIN Number</small>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#059669', marginTop: '2px' }}>
                    {cust.gstin}
                  </div>
                </div>

                <div>
                  <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>CIN / LLPIN / Reg ID</small>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color: '#64748b', marginTop: '2px' }}>
                    {cust.cin || 'U01111RJ2026PTC089123'}
                  </div>
                </div>

                <div>
                  <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>Authorized Signatory</small>
                  <div style={{ fontWeight: '600', color: '#0b1727', marginTop: '2px' }}>
                    {cust.kycProfile?.aadhaarSignatory || cust.contactPerson}
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>Registered Office Address</small>
                  <div style={{ color: '#334155', fontSize: '0.9rem', marginTop: '2px' }}>
                    {cust.kycProfile?.registeredAddress || cust.city}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES */}
          {activeTab === 'services' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 style={{ fontSize: '1.1rem', color: '#0b1727' }}>Subscribed Compliance & Advisory Services</h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(cust.services || cust.activeServices.map((s, i) => ({ id: `S-${i}`, name: s, category: 'Compliance', status: 'Active', fee: 'Subscribed' }))).map((srv, idx) => (
                  <div key={idx} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{srv.category}</span>
                        <strong style={{ fontSize: '0.95rem' }}>{srv.name}</strong>
                      </div>
                      <small style={{ color: '#64748b', display: 'block', marginTop: '4px' }}>
                        Start: {srv.startDate || 'Aug 2026'} • Renewal / Milestone: {srv.renewalDate || 'Annual'}
                      </small>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>{srv.status}</span>
                      <div style={{ fontWeight: '700', fontFamily: 'var(--font-mono)', marginTop: '4px', fontSize: '0.9rem' }}>{srv.fee}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENTS */}
          {activeTab === 'payments' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 style={{ fontSize: '1.1rem', color: '#0b1727' }}>Billing & Payments Ledger</h4>
                <button onClick={() => showToast('Full financial ledger statement exported!')} className="btn btn-outline btn-sm">
                  <Download size={14} /> Export Statement
                </button>
              </div>

              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Invoice No</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(cust.payments || []).map((pay, i) => (
                      <tr key={i}>
                        <td>{pay.date}</td>
                        <td><strong style={{ fontFamily: 'var(--font-mono)', color: '#2563eb' }}>{pay.invoiceNo}</strong></td>
                        <td style={{ fontWeight: '800', fontFamily: 'var(--font-mono)' }}>₹{Number(pay.amount).toLocaleString('en-IN')}</td>
                        <td>{pay.method}</td>
                        <td><span className="badge badge-emerald">{pay.status}</span></td>
                        <td>
                          <button onClick={() => showToast(`Downloading tax receipt for ${pay.invoiceNo}...`)} style={{ background: 'none', border: 'none', color: '#ff6f00', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}>
                            PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 style={{ fontSize: '1.1rem', color: '#0b1727' }}>Secure Document Vault</h4>
                <button onClick={() => showToast('Upload document modal triggered.')} className="btn btn-primary btn-sm">
                  <UploadCloud size={14} /> Upload Document
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                {(cust.documents || []).map((doc, idx) => (
                  <div key={idx} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="flex items-center gap-3">
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#0b1727' }}>{doc.name}</div>
                        <small style={{ color: '#64748b' }}>Verified by {doc.verifiedBy}</small>
                      </div>
                    </div>
                    <button onClick={() => showToast(`Opening document: ${doc.name}`)} className="btn btn-sm btn-outline" style={{ padding: '4px 8px' }}>
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SUPPORT */}
          {activeTab === 'support' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 style={{ fontSize: '1.1rem', color: '#0b1727' }}>Client Support & Helpdesk</h4>
                <button onClick={() => showToast('New support ticket generated for client.')} className="btn btn-outline btn-sm">
                  + Create Ticket
                </button>
              </div>

              {(cust.support?.length || 0) === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 10px', background: '#f8fafc', borderRadius: '10px' }}>
                  <CheckCircle2 size={32} color="#059669" style={{ margin: '0 auto 8px' }} />
                  <h5>No Open Support Tickets</h5>
                  <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Client has zero reported disputes or pending assistance requests.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {cust.support.map((t, i) => (
                    <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{t.ticketNo}</span>
                        <h5 style={{ fontSize: '0.92rem', marginTop: '4px' }}>{t.subject}</h5>
                        <small style={{ color: '#64748b' }}>Logged on {t.createdDate}</small>
                      </div>
                      <span className="badge badge-emerald">{t.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: PROJECTS */}
          {activeTab === 'projects' && (
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#0b1727' }}>Linked Corporate & Loan Projects</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(cust.projects || []).map((proj, i) => (
                  <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="badge badge-saffron" style={{ fontSize: '0.7rem' }}>{proj.id}</span>
                        <h4 style={{ fontSize: '1.05rem', margin: '4px 0' }}>{proj.name}</h4>
                        <small style={{ color: '#64748b' }}>Service: {proj.service}</small>
                      </div>
                      <span className="badge badge-blue">{proj.status}</span>
                    </div>

                    <div style={{ marginTop: '14px' }}>
                      <div className="flex justify-between" style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '4px' }}>
                        <span>Milestone Progression</span>
                        <strong>{proj.progress}%</strong>
                      </div>
                      <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${proj.progress}%`, height: '100%', background: '#2563eb' }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: PREVIOUS HISTORY */}
          {activeTab === 'history' && (
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#0b1727' }}>Chronological Audit & Communication Timeline</h4>
              <div style={{ position: 'relative', borderLeft: '2px solid #e2e8f0', marginLeft: '14px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {(cust.previousHistory || []).map((h, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-27px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', background: '#2563eb', border: '2px solid #fff' }}></div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{h.date} • by <strong>{h.performedBy}</strong></div>
                    <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#0b1727', marginTop: '2px' }}>{h.event}</div>
                    <p style={{ color: '#475569', fontSize: '0.85rem', marginTop: '4px' }}>{h.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
