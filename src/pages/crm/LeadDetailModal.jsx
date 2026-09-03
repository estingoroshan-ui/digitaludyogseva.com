import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  IndianRupee, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  Send, 
  Plus, 
  Share2,
  Sparkles,
  ArrowRight,
  Flame,
  Check
} from 'lucide-react';

export const LeadDetailModal = () => {
  const { 
    selectedLeadForDetail, 
    setSelectedLeadForDetail, 
    addFollowUpToLead, 
    recordLeadPayment, 
    convertLeadToCustomerAndProject,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('source'); // 'source' | 'sales' | 'followup' | 'interested' | 'eligibility' | 'quotation' | 'payment' | 'converted'

  // Followup form state
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpTime, setFollowUpTime] = useState('11:00 AM');
  const [followUpType, setFollowUpType] = useState('Phone Call');
  const [followUpNotes, setFollowUpNotes] = useState('');

  // Payment form state
  const [payAmount, setPayAmount] = useState('');
  const [payMode, setPayMode] = useState('UPI (Google Pay)');
  const [payUtr, setPayUtr] = useState('');

  if (!selectedLeadForDetail) return null;
  const lead = selectedLeadForDetail;

  const handleAddFollowUp = (e) => {
    e.preventDefault();
    if (!followUpDate || !followUpNotes) return;
    addFollowUpToLead(lead.id, {
      type: followUpType,
      date: followUpDate,
      time: followUpTime,
      notes: followUpNotes
    });
    setFollowUpDate('');
    setFollowUpNotes('');
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();
    if (!payAmount) return;
    recordLeadPayment(lead.id, {
      advancePaid: Number(payAmount),
      balanceDue: Math.max(0, (lead.quotation?.total || lead.value * 1.18) - Number(payAmount)),
      mode: payMode,
      utrNo: payUtr || `UPI/${Date.now().toString().slice(-10)}`,
      receiptNo: `REC-2026-${Math.floor(100 + Math.random() * 900)}`,
      paymentDate: new Date().toISOString().split('T')[0]
    });
    setPayAmount('');
    setPayUtr('');
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedLeadForDetail(null)}>
      <div 
        className="modal-card" 
        style={{ maxWidth: '820px', padding: 0, overflow: 'hidden' }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div style={{ background: 'linear-gradient(135deg, #0b1727, #12233b)', color: '#fff', padding: '20px 24px' }}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3">
                <span className="badge badge-saffron" style={{ fontSize: '0.72rem' }}>
                  {lead.id}
                </span>
                <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                  Stage: {lead.stage}
                </span>
                {lead.interested?.temperature && (
                  <span className="badge badge-rose" style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Flame size={12} /> {lead.interested.temperature} Intent
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: '1.45rem', color: '#fff', marginTop: '6px' }}>{lead.name}</h2>
              <div className="flex items-center gap-4" style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
                <span className="flex items-center gap-1"><Phone size={13} /> {lead.phone}</span>
                <span className="flex items-center gap-1"><Mail size={13} /> {lead.email}</span>
                <span className="flex items-center gap-1" style={{ color: '#4ade80' }}>
                  <IndianRupee size={13} /> Deal Value: ₹{Number(lead.value).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedLeadForDetail(null)} 
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 8-Tab Navigation Bar */}
        <div style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', display: 'flex', overflowX: 'auto', padding: '4px 16px' }}>
          {[
            { id: 'source', label: 'Lead Source' },
            { id: 'sales', label: 'Sales' },
            { id: 'followup', label: `Follow-up (${lead.followUps?.length || 0})` },
            { id: 'interested', label: 'Interested' },
            { id: 'eligibility', label: 'Eligibility' },
            { id: 'quotation', label: 'Quotation' },
            { id: 'payment', label: 'Payment' },
            { id: 'converted', label: lead.converted?.isConverted ? 'Converted ✅' : 'Convert 🚀' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #ff6f00' : '3px solid transparent',
                color: activeTab === tab.id ? '#ff6f00' : '#475569',
                fontWeight: activeTab === tab.id ? '700' : '600',
                padding: '12px 14px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body Contents */}
        <div className="modal-body" style={{ minHeight: '340px', maxHeight: '60vh', overflowY: 'auto' }}>
          {/* TAB 1: LEAD SOURCE */}
          {activeTab === 'source' && (
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#0b1727' }}>Lead Attribution & Source Channel</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div>
                  <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>Inbound Channel</small>
                  <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0b1727', marginTop: '2px' }}>
                    {lead.leadSource?.channel || lead.source || 'Website Direct'}
                  </div>
                </div>

                <div>
                  <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>Marketing Campaign</small>
                  <div style={{ fontSize: '1rem', fontWeight: '600', color: '#2563eb', marginTop: '2px' }}>
                    {lead.leadSource?.campaign || 'Organic General Inbound'}
                  </div>
                </div>

                <div>
                  <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>Referrer / Partner Source</small>
                  <div style={{ fontSize: '0.92rem', color: '#334155', marginTop: '2px' }}>
                    {lead.leadSource?.referrer || 'Direct Entry'}
                  </div>
                </div>

                <div>
                  <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>Target Landing Page</small>
                  <div style={{ fontSize: '0.88rem', color: '#64748b', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    {lead.leadSource?.landingPage || '/'}
                  </div>
                </div>

                <div>
                  <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>Caller / Lead Location</small>
                  <div style={{ fontSize: '0.92rem', color: '#0b1727', fontWeight: '600', marginTop: '2px' }}>
                    📍 {lead.leadSource?.ipCity || 'India'}
                  </div>
                </div>

                <div>
                  <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>UTM Medium</small>
                  <div style={{ fontSize: '0.92rem', color: '#059669', fontWeight: '600', marginTop: '2px' }}>
                    {lead.leadSource?.utmMedium || 'cpc'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SALES */}
          {activeTab === 'sales' && (
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#0b1727' }}>Sales Assignment & Pipeline Metrics</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Assigned Sales Executive</small>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0b1727', marginTop: '4px' }}>
                    {lead.sales?.assignedExecutive || lead.assignedTo || 'Neha Sharma'}
                  </div>
                  <small style={{ color: '#2563eb' }}>Dept: {lead.sales?.department || 'Corporate Advisory'}</small>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Expected Deal Value</small>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#059669', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    ₹{Number(lead.sales?.dealValue || lead.value).toLocaleString('en-IN')}
                  </div>
                  <small style={{ color: '#64748b' }}>Target Close: {lead.sales?.targetCloseDate || '2026-09-10'}</small>
                </div>
              </div>

              <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '10px' }}>
                <div className="flex justify-between items-center mb-2">
                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Estimated Conversion Probability</span>
                  <strong style={{ color: '#ff6f00', fontSize: '0.95rem' }}>{lead.sales?.salesProbability || '80%'}</strong>
                </div>
                <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: lead.sales?.salesProbability || '80%', height: '100%', background: 'linear-gradient(90deg, #ff6f00, #10b981)' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FOLLOW-UP */}
          {activeTab === 'followup' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 style={{ fontSize: '1.1rem', color: '#0b1727' }}>Follow-up Interaction Log</h4>
                <span className="badge badge-blue">{lead.followUps?.length || 0} Scheduled / Completed</span>
              </div>

              {/* History */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {(lead.followUps || []).map((f, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-saffron" style={{ fontSize: '0.7rem' }}>{f.type}</span>
                        <strong style={{ fontSize: '0.92rem' }}>{f.date} at {f.time}</strong>
                      </div>
                      <p style={{ color: '#475569', fontSize: '0.85rem', marginTop: '6px' }}>"{f.notes}"</p>
                    </div>
                    <span className={`badge ${f.status === 'Completed' ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.72rem' }}>
                      {f.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add Follow-up Form */}
              <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '18px' }}>
                <h5 style={{ fontSize: '0.95rem', marginBottom: '12px', color: '#0b1727' }}>+ Schedule Next Call / Meeting</h5>
                <form onSubmit={handleAddFollowUp}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <label className="form-label">Follow-up Date *</label>
                      <input type="date" required className="form-control" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Time</label>
                      <input type="text" className="form-control" value={followUpTime} onChange={e => setFollowUpTime(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Channel</label>
                      <select className="form-control" value={followUpType} onChange={e => setFollowUpType(e.target.value)}>
                        <option value="Phone Call">Phone Call</option>
                        <option value="WhatsApp">WhatsApp Message</option>
                        <option value="Office Meeting">Office Meeting</option>
                        <option value="Video Conference">Video Call</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Agenda / Follow-up Remarks *</label>
                    <input type="text" required placeholder="e.g. Call to verify pending electricity bill and send final quote." className="form-control" value={followUpNotes} onChange={e => setFollowUpNotes(e.target.value)} />
                  </div>

                  <button type="submit" className="btn btn-primary btn-sm">
                    <Plus size={14} /> Schedule Follow-up
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: INTERESTED */}
          {activeTab === 'interested' && (
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#0b1727' }}>Customer Service Interest & Scope</h4>
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Interest Temperature</small>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#e11d48', marginTop: '2px' }}>
                      🔥 {lead.interested?.temperature || 'Hot'}
                    </div>
                  </div>
                  <div>
                    <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Budget Range</small>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0b1727', marginTop: '2px' }}>
                      {lead.interested?.budget || `₹${lead.value}`}
                    </div>
                  </div>
                  <div>
                    <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Target Timeline</small>
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#059669', marginTop: '2px' }}>
                      ⚡ {lead.interested?.timeline || 'Immediate'}
                    </div>
                  </div>
                  <div>
                    <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Primary Service</small>
                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#2563eb', marginTop: '2px' }}>
                      {lead.service}
                    </div>
                  </div>
                </div>
              </div>

              <h5 style={{ fontSize: '0.95rem', marginBottom: '10px' }}>Selected Package Modules:</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(lead.interested?.selectedPackages || [lead.service]).map((pkg, i) => (
                  <div key={i} className="flex items-center gap-2" style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '10px 14px', borderRadius: '8px', fontSize: '0.88rem' }}>
                    <CheckCircle2 size={16} color="#059669" />
                    <span style={{ fontWeight: '600', color: '#334155' }}>{pkg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ELIGIBILITY */}
          {activeTab === 'eligibility' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 style={{ fontSize: '1.1rem', color: '#0b1727' }}>Applicant Eligibility Matrix</h4>
                <span className="badge badge-emerald">
                  <ShieldCheck size={14} /> {lead.eligibility?.verdict || 'Pre-Approved'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <small style={{ color: '#64748b', fontSize: '0.75rem' }}>CIBIL Credit Score</small>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#059669', fontFamily: 'var(--font-mono)' }}>
                    {lead.eligibility?.cibilScore || 760}
                  </div>
                  <small style={{ color: '#059669', fontSize: '0.75rem' }}>● Excellent Repayment</small>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Annual Turnover</small>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0b1727' }}>
                    {lead.eligibility?.annualTurnover || '₹25L+'}
                  </div>
                  <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Verified via Statement</small>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <small style={{ color: '#64748b', fontSize: '0.75rem' }}>GST Status</small>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: '#2563eb' }}>
                    {lead.eligibility?.gstStatus || 'Eligible for New GST'}
                  </div>
                  <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Zero Prior Defaults</small>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Residency & Nationality</small>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: '#0b1727' }}>
                    {lead.eligibility?.residencyStatus || 'Indian Resident (PAN & Aadhaar)'}
                  </div>
                  <small style={{ color: '#059669', fontSize: '0.75rem' }}>MCA DIN Cleared</small>
                </div>
              </div>

              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '14px 18px', borderRadius: '10px', color: '#065f46', fontSize: '0.9rem' }}>
                <strong>Eligibility Officer Recommendation:</strong> Client fulfills all criteria for expedited corporate incorporation and subsidized loan application. No additional security required.
              </div>
            </div>
          )}

          {/* TAB 6: QUOTATION */}
          {activeTab === 'quotation' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 style={{ fontSize: '1.1rem', color: '#0b1727' }}>Formal Service Quotation</h4>
                  <small style={{ color: '#64748b' }}>Quote Reference: <strong>{lead.quotation?.quoteNo || 'QUO-2026-AUTO'}</strong></small>
                </div>
                <span className="badge badge-saffron">{lead.quotation?.status || 'Active'}</span>
              </div>

              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                      <th style={{ padding: '10px 14px' }}>Item Description</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(lead.quotation?.items || [{ desc: lead.service, amount: lead.value }]).map((it, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 14px' }}>{it.desc}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                          ₹{Number(it.amount).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ color: '#64748b' }}>
                      <td style={{ padding: '8px 14px' }}>Subtotal</td>
                      <td style={{ padding: '8px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                        ₹{Number(lead.quotation?.subtotal || lead.value).toLocaleString('en-IN')}
                      </td>
                    </tr>
                    <tr style={{ color: '#64748b' }}>
                      <td style={{ padding: '8px 14px' }}>GST (18% Statutory)</td>
                      <td style={{ padding: '8px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                        ₹{Number(lead.quotation?.gst || lead.value * 0.18).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr style={{ fontWeight: '800', fontSize: '1.05rem', borderTop: '2px solid #0b1727' }}>
                      <td style={{ padding: '12px 14px' }}>Grand Total</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#0b1727' }}>
                        ₹{Number(lead.quotation?.total || lead.value * 1.18).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex gap-2 justify-end">
                <button 
                  onClick={() => showToast(`Quotation PDF downloaded and shared to ${lead.phone}!`)}
                  className="btn btn-outline btn-sm"
                >
                  <FileText size={14} /> Download PDF
                </button>
                <button 
                  onClick={() => showToast(`Quotation sent via WhatsApp to ${lead.phone}!`)}
                  className="btn btn-primary btn-sm"
                >
                  <Send size={14} /> Dispatch to Client WhatsApp
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: PAYMENT */}
          {activeTab === 'payment' && (
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#0b1727' }}>Advance & Payment Collection</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                  <small style={{ color: '#065f46', fontSize: '0.75rem', fontWeight: '700' }}>Amount Collected</small>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#059669', fontFamily: 'var(--font-mono)' }}>
                    ₹{Number(lead.payment?.advancePaid || 0).toLocaleString('en-IN')}
                  </div>
                  <small style={{ color: '#065f46' }}>Status: <strong>{lead.payment?.status || 'Pending'}</strong></small>
                </div>

                <div style={{ background: '#fff7ed', padding: '16px', borderRadius: '10px', border: '1px solid #fed7aa' }}>
                  <small style={{ color: '#9a3412', fontSize: '0.75rem', fontWeight: '700' }}>Balance Due</small>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ea580c', fontFamily: 'var(--font-mono)' }}>
                    ₹{Number(lead.payment?.balanceDue || lead.value * 1.18).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </div>
                  <small style={{ color: '#9a3412' }}>Payable on Milestone</small>
                </div>
              </div>

              {lead.payment?.advancePaid > 0 && (
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                  <div className="flex justify-between" style={{ fontSize: '0.85rem' }}>
                    <span style={{ color: '#64748b' }}>Transaction Ref / UTR:</span>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>{lead.payment.utrNo}</strong>
                  </div>
                  <div className="flex justify-between" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                    <span style={{ color: '#64748b' }}>Receipt Number:</span>
                    <strong style={{ color: '#2563eb' }}>{lead.payment.receiptNo}</strong>
                  </div>
                </div>
              )}

              {/* Record Payment Form */}
              <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '18px' }}>
                <h5 style={{ fontSize: '0.95rem', marginBottom: '12px' }}>+ Record Client Token / Advance Payment</h5>
                <form onSubmit={handleRecordPayment}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <label className="form-label">Payment Amount (₹) *</label>
                      <input 
                        type="number" 
                        required 
                        placeholder="e.g. 3000" 
                        className="form-control" 
                        value={payAmount} 
                        onChange={e => setPayAmount(e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="form-label">Payment Mode</label>
                      <select className="form-control" value={payMode} onChange={e => setPayMode(e.target.value)}>
                        <option value="UPI (Google Pay / PhonePe)">UPI (GPay / PhonePe)</option>
                        <option value="NEFT / Netbanking">NEFT / Netbanking</option>
                        <option value="Debit / Credit Card">Debit / Credit Card</option>
                        <option value="Cash Office Receipt">Cash Office Receipt</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">UTR / Reference No.</label>
                      <input 
                        type="text" 
                        placeholder="UPI/38291..." 
                        className="form-control" 
                        value={payUtr} 
                        onChange={e => setPayUtr(e.target.value)} 
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-sm">
                    <IndianRupee size={14} /> Confirm & Generate Money Receipt
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 8: CONVERTED */}
          {activeTab === 'converted' && (
            <div style={{ textAlign: 'center', padding: '24px 10px' }}>
              {lead.converted?.isConverted ? (
                <div>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <CheckCircle2 size={38} />
                  </div>
                  <h3 style={{ fontSize: '1.4rem', color: '#065f46' }}>Lead Successfully Converted!</h3>
                  <p style={{ color: '#475569', marginTop: '8px', maxWidth: '500px', margin: '8px auto 20px' }}>
                    Client account has been activated in Customer 360° and execution case project has been launched.
                  </p>
                  <div className="flex justify-center gap-3">
                    <span className="badge badge-blue">Customer ID: {lead.converted.customerId || 'CUST-301'}</span>
                    <span className="badge badge-emerald">Project ID: {lead.converted.projectId || 'PRJ-2026-001'}</span>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fff7ed', color: '#ff6f00', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Sparkles size={34} />
                  </div>
                  <h3 style={{ fontSize: '1.35rem', color: '#0b1727' }}>Ready to Convert this Lead?</h3>
                  <p style={{ color: '#64748b', fontSize: '0.92rem', maxWidth: '540px', margin: '8px auto 24px', lineHeight: '1.6' }}>
                    Converting will automatically:
                    <br />
                    1. Create a <strong>Customer 360° Profile</strong> with KYC dossier & Document Vault.
                    <br />
                    2. Launch a <strong>Case Execution Project</strong> with 12 lifecycle stages, tasks & assigned CA/CS.
                    <br />
                    3. Mark this lead as <strong>WON/CONVERTED</strong> in the CRM pipeline.
                  </p>

                  <button 
                    onClick={() => {
                      convertLeadToCustomerAndProject(lead.id);
                    }}
                    className="btn btn-primary btn-lg"
                  >
                    <Sparkles size={18} />
                    <span>Convert to Customer & Launch Project Now</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
