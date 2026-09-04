import React, { useState } from 'react';
import { FileText, Send, Download, CheckCircle2, AlertTriangle, IndianRupee, Sparkles, MessageSquare, ArrowRight, ShieldAlert } from 'lucide-react';
import { coreServicesPricingMaster } from '../../../data/mockData';

export const Lead360EstimateProposal = ({ lead, onSaveEstimateProposal, showToast }) => {
  const [selectedServiceId, setSelectedServiceId] = useState(
    coreServicesPricingMaster.find(s => s.name === lead.service)?.id || coreServicesPricingMaster[0].id
  );

  const activeServiceObj = coreServicesPricingMaster.find(s => s.id === selectedServiceId) || coreServicesPricingMaster[0];

  const [quantity, setQuantity] = useState(1);
  const [basePrice, setBasePrice] = useState(activeServiceObj.basePrice);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountReason, setDiscountReason] = useState('');
  const [scopeOfWork, setScopeOfWork] = useState(
    `Complete statutory execution and filing for ${activeServiceObj.name}, including legal drafting, government fee reconciliation, and formal certification.`
  );
  const [deliverables, setDeliverables] = useState(activeServiceObj.packages.join(', '));
  const [sentVia, setSentVia] = useState('WhatsApp');

  const handleServiceChange = (srvId) => {
    const srv = coreServicesPricingMaster.find(s => s.id === srvId);
    if (srv) {
      setSelectedServiceId(srvId);
      setBasePrice(srv.basePrice);
      setDiscountAmount(0);
      setDeliverables(srv.packages.join(', '));
      setScopeOfWork(`Complete statutory execution and filing for ${srv.name}, including legal drafting, government fee reconciliation, and formal certification.`);
    }
  };

  const taxableAmount = Math.max(0, (basePrice * quantity) - discountAmount);
  const gstAmount = taxableAmount * 0.18;
  const totalAmount = taxableAmount + gstAmount;

  const handleCreateProposal = (e) => {
    e.preventDefault();

    const payload = {
      serviceName: activeServiceObj.name,
      basePrice,
      quantity,
      discountAmount,
      discountReason: discountAmount > 0 ? discountReason || 'Sales RM concession' : 'None',
      taxableAmount,
      gstAmount,
      totalAmount,
      scopeOfWork,
      deliverables,
      sentVia
    };

    if (onSaveEstimateProposal) {
      onSaveEstimateProposal(payload);
    }
  };

  const proposalStatuses = ['Draft', 'Sent', 'Viewed', 'Accepted', 'Rejected', 'Expired'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
      {/* 1. Dynamic Estimate & Pricing Configurator */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
        <div className="flex justify-between items-center mb-4">
          <h4 style={{ fontSize: '1.1rem', color: '#0b1727', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={16} />
            </span>
            <span>Estimate & Pricing Engine</span>
          </h4>
          <span className="badge badge-purple">18% Statutory GST</span>
        </div>

        <form onSubmit={handleCreateProposal}>
          {/* Service Selector */}
          <div className="form-group mb-3">
            <label className="form-label">Select Core Service Master *</label>
            <select
              className="form-control"
              value={selectedServiceId}
              onChange={e => handleServiceChange(e.target.value)}
              style={{ fontWeight: '600' }}
            >
              {coreServicesPricingMaster.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} (Base Price: ₹{s.basePrice.toLocaleString('en-IN')}) — {s.category}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px' }}>
            <div className="form-group">
              <label className="form-label">Base Rate (₹)</label>
              <input
                type="number"
                className="form-control"
                value={basePrice}
                onChange={e => setBasePrice(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Discount Concession (₹)</label>
              <input
                type="number"
                className="form-control"
                value={discountAmount}
                onChange={e => setDiscountAmount(Number(e.target.value))}
              />
            </div>
          </div>

          {discountAmount > 0 && (
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: '10px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9a3412', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                <ShieldAlert size={14} /> Price Change Audit Log Entry Required:
              </div>
              <input
                type="text"
                required
                placeholder="Reason for discount e.g. 'Founder festive promo concession'..."
                className="form-control"
                value={discountReason}
                onChange={e => setDiscountReason(e.target.value)}
                style={{ fontSize: '0.82rem' }}
              />
            </div>
          )}

          {/* Scope & Deliverables */}
          <div className="form-group mb-3">
            <label className="form-label">Scope of Work Brief</label>
            <textarea
              rows={2}
              className="form-control"
              value={scopeOfWork}
              onChange={e => setScopeOfWork(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            ></textarea>
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Included Deliverables</label>
            <input
              type="text"
              className="form-control"
              value={deliverables}
              onChange={e => setDeliverables(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            />
          </div>

          {/* Calculation Table Strip */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
            <div className="flex justify-between" style={{ fontSize: '0.85rem', color: '#64748b' }}>
              <span>Taxable Value:</span>
              <strong style={{ color: '#0b1727', fontFamily: 'var(--font-mono)' }}>
                ₹{taxableAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </strong>
            </div>
            <div className="flex justify-between" style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
              <span>GST (18% Statutory):</span>
              <strong style={{ color: '#0b1727', fontFamily: 'var(--font-mono)' }}>
                ₹{gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </strong>
            </div>
            <div className="flex justify-between" style={{ fontSize: '1.1rem', fontWeight: '800', color: '#059669', borderTop: '2px solid #cbd5e1', paddingTop: '8px', marginTop: '6px' }}>
              <span>Grand Total:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>
                ₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" style={{ padding: '10px', fontSize: '0.92rem' }}>
            <Sparkles size={16} />
            <span>Generate Formal Proposal & Dispatch to Client</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>

      {/* 2. Proposals Tracker & Lifecycle */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
        <div className="flex justify-between items-center mb-4">
          <h4 style={{ fontSize: '1.05rem', color: '#0b1727', margin: 0 }}>
            Proposals & Quotes Tracker ({(lead.proposals || []).length})
          </h4>
        </div>

        {(lead.proposals || []).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 10px', color: '#94a3b8', border: '1px dashed #cbd5e1', borderRadius: '10px' }}>
            No formal proposal created yet. Use the pricing engine on the left to generate one.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {lead.proposals.map((prop, idx) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="badge badge-saffron" style={{ fontSize: '0.72rem' }}>{prop.proposalCode}</span>
                    <h5 style={{ fontSize: '0.98rem', color: '#0b1727', margin: '4px 0 0' }}>{prop.title}</h5>
                  </div>
                  <span className={`badge ${prop.status === 'Accepted' ? 'badge-emerald' : 'badge-blue'}`}>
                    {prop.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '8px' }}>
                  {prop.scopeOfWork}
                </div>

                <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', color: '#334155', marginBottom: '12px' }}>
                  <strong>Deliverables:</strong> {prop.deliverables}
                </div>

                <div className="flex justify-between items-center" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                  <div>
                    <small style={{ color: '#64748b', fontSize: '0.72rem' }}>Total Amount</small>
                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#059669', fontFamily: 'var(--font-mono)' }}>
                      ₹{Number(prop.totalValue).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => showToast && showToast(`Proposal PDF ${prop.proposalCode} downloaded!`)}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                    >
                      <Download size={13} /> PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast && showToast(`Proposal sent to ${lead.phone} on WhatsApp!`)}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '5px 12px', fontSize: '0.78rem', background: '#059669' }}
                    >
                      <MessageSquare size={13} /> WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
