import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Printer, CheckCircle, FileText, IndianRupee, Trash2 } from 'lucide-react';

export const CrmEstimates = () => {
  const { estimates, addEstimate } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [viewEstimate, setViewEstimate] = useState(null);

  const [clientName, setClientName] = useState('');
  const [items, setItems] = useState([
    { desc: 'Private Limited Incorporation Fee', amount: 4999 }
  ]);

  const addItem = () => {
    setItems([...items, { desc: '', amount: 1000 }]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === 'amount' ? Number(value) : value;
    setItems(updated);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const subtotal = items.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const tax = subtotal * 0.18; // 18% GST
  const grandTotal = subtotal + tax;

  const handleSave = (e) => {
    e.preventDefault();
    if (!clientName) return;

    addEstimate({
      client: clientName,
      items: items,
      tax: tax,
      total: grandTotal
    });

    setShowModal(false);
    setClientName('');
    setItems([{ desc: 'Private Limited Incorporation Fee', amount: 4999 }]);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#0b1727' }}>Estimates & Invoicing</h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Generate formal fee quotations and GST-compliant proforma invoices for clients.
          </p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="btn btn-primary btn-sm"
        >
          <Plus size={16} />
          <span>New Quotation / Estimate</span>
        </button>
      </div>

      {/* Estimates Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {estimates.map(est => (
          <div key={est.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="badge badge-saffron" style={{ marginBottom: '6px' }}>{est.status}</span>
                <h4 style={{ fontSize: '1.15rem' }}>{est.client}</h4>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#64748b', fontWeight: '700' }}>
                {est.id}
              </span>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '12px 0', margin: '14px 0' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Line Items:</div>
              {est.items.map((item, idx) => (
                <div key={idx} className="flex justify-between" style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>
                  <span>{item.desc}</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>₹{Number(item.amount).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div>
                <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Total (incl. 18% GST)</small>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0b1727', fontFamily: 'var(--font-mono)' }}>
                  ₹{Number(est.total).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>
              </div>

              <button 
                onClick={() => setViewEstimate(est)} 
                className="btn btn-sm btn-outline"
              >
                <Printer size={14} />
                <span>View / Print</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem' }}>Create Client Quotation / Estimate</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Client / Business Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Apex Industrial Solutions Ltd"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                  />
                </div>

                <div style={{ margin: '20px 0 10px' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ fontWeight: '700', fontSize: '0.88rem' }}>Line Items</span>
                    <button type="button" onClick={addItem} className="btn btn-sm btn-outline" style={{ padding: '3px 8px', fontSize: '0.78rem' }}>
                      <Plus size={13} /> Add Item
                    </button>
                  </div>

                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center mb-2">
                      <input
                        type="text"
                        required
                        placeholder="Service Description"
                        className="form-control"
                        style={{ flex: 2 }}
                        value={item.desc}
                        onChange={e => updateItem(idx, 'desc', e.target.value)}
                      />
                      <input
                        type="number"
                        required
                        placeholder="Amount"
                        className="form-control"
                        style={{ flex: 1 }}
                        value={item.amount}
                        onChange={e => updateItem(idx, 'amount', e.target.value)}
                      />
                      {items.length > 1 && (
                        <button type="button" onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', marginTop: '16px' }}>
                  <div className="flex justify-between" style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between" style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                    <span>GST (18%):</span>
                    <span>₹{tax.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between" style={{ fontSize: '1rem', fontWeight: '800', color: '#0b1727', borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '8px' }}>
                    <span>Grand Total:</span>
                    <span>₹{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Save & Issue Estimate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print / View Modal */}
      {viewEstimate && (
        <div className="modal-overlay" onClick={() => setViewEstimate(null)}>
          <div className="modal-card" style={{ maxWidth: '650px', background: '#fff' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Estimate #{viewEstimate.id}</h3>
              <button onClick={() => setViewEstimate(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div className="modal-body" style={{ padding: '30px' }}>
              <div className="flex justify-between items-start" style={{ borderBottom: '2px solid #0b1727', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', color: '#0b1727' }}>Digital Udyog Seva</h2>
                  <small style={{ color: '#64748b' }}>Corporate Advisory & Financial Consulting</small>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '700' }}>Date: {viewEstimate.date}</div>
                  <small style={{ color: '#ff6f00', fontWeight: '700' }}>Official Quotation</small>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <small style={{ color: '#64748b', textTransform: 'uppercase' }}>Billed To:</small>
                <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>{viewEstimate.client}</div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                    <th style={{ padding: '8px 12px' }}>Description</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {viewEstimate.items.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 12px' }}>{item.desc}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                        ₹{Number(item.amount).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td style={{ padding: '8px 12px', fontWeight: '600' }}>CGST (9%) + SGST (9%)</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                      ₹{Number(viewEstimate.tax).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr style={{ borderTop: '2px solid #0b1727', fontWeight: '800', fontSize: '1.1rem' }}>
                    <td style={{ padding: '12px 12px' }}>Grand Total Payable</td>
                    <td style={{ padding: '12px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#0b1727' }}>
                      ₹{Number(viewEstimate.total).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>

              <p style={{ fontSize: '0.78rem', color: '#64748b', textAlign: 'center', marginTop: '30px' }}>
                This is a computer-generated proforma quotation valid for 15 days from the date of issue.
              </p>
            </div>

            <div className="modal-footer">
              <button onClick={() => window.print()} className="btn btn-primary">
                <Printer size={16} /> Print / Save as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
