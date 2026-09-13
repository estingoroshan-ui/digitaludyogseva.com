import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  X, 
  Receipt, 
  Building2, 
  User, 
  Phone, 
  FileText, 
  IndianRupee, 
  CheckCircle,
  CreditCard,
  Building
} from 'lucide-react';

export const CabinInvoiceModal = ({ cabin, onClose }) => {
  const { createCabinBill, customers } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [serviceDescription, setServiceDescription] = useState(
    cabin ? `${cabin.name} - ${cabin.billingType}` : 'Department Consultation & Processing'
  );
  const [amount, setAmount] = useState(cabin ? cabin.defaultFee : 5000);
  const [includeGst, setIncludeGst] = useState(true);
  const [paymentMode, setPaymentMode] = useState('UPI QR');

  const gstAmount = includeGst ? Math.round(amount * 0.18) : 0;
  const total = Number(amount) + Number(gstAmount);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName || !amount) return;

    createCabinBill({
      cabinId: cabin?.id || 'cabin-2',
      cabinName: cabin ? `${cabin.cabinNumber} (${cabin.name})` : 'Business Hub Desk',
      customerName,
      phone: customerPhone || '+91 98290 00000',
      serviceDescription,
      amount: Number(amount),
      gstAmount,
      total,
      paymentMode
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, #0b1727, #1e293b)', color: '#fff' }}>
          <div className="flex items-center gap-3">
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: cabin?.accentColor || '#ff6f00', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Receipt size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#fff' }}>Generate Department Bill</h3>
              <span style={{ fontSize: '0.78rem', color: '#ffa726', fontWeight: '700' }}>
                {cabin ? `${cabin.cabinNumber} — ${cabin.name}` : 'Business Hub Cabin Billing'}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '24px' }}>
            {/* Quick Customer Picker */}
            <div className="form-group">
              <label className="form-label">Select Existing Client (Or Enter New)</label>
              <select 
                className="form-control"
                onChange={(e) => {
                  const cust = customers.find(c => c.name === e.target.value);
                  if (cust) {
                    setCustomerName(cust.name);
                    setCustomerPhone(cust.phone);
                  }
                }}
              >
                <option value="">-- Choose from Registered Clients --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.name}>{c.name} ({c.companyName || c.phone})</option>
                ))}
              </select>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Client / Entity Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Ramesh Agro Industries"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Client Mobile Phone</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="+91 98290 12345"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Service Description / Bill Narration *</label>
              <textarea 
                className="form-control" 
                rows="2"
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Base Amount (₹) *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748b', fontWeight: '700' }}>₹</span>
                  <input 
                    type="number" 
                    className="form-control" 
                    style={{ paddingLeft: '28px', fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '1.1rem' }}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Mode</label>
                <select 
                  className="form-control"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  <option value="UPI QR">UPI / QR Code</option>
                  <option value="NetBanking">Net Banking / NEFT</option>
                  <option value="RTGS">RTGS Bank Transfer</option>
                  <option value="Cheque">Bank Cheque</option>
                  <option value="Cash Counter">Cash Counter</option>
                  <option value="Unpaid">Mark as Pending (Post-Work)</option>
                </select>
              </div>
            </div>

            {/* GST Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', padding: '12px 14px', background: 'var(--slate-50)', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
              <input 
                type="checkbox" 
                id="includeGst"
                checked={includeGst} 
                onChange={(e) => setIncludeGst(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#ff6f00', cursor: 'pointer' }}
              />
              <label htmlFor="includeGst" style={{ fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', margin: 0 }}>
                Apply 18% GST (CGST 9% + SGST 9% with GST Tax Invoice)
              </label>
            </div>

            {/* Summary Box */}
            <div style={{ marginTop: '18px', padding: '16px', borderRadius: '10px', background: 'linear-gradient(135deg, #0b1727, #12233b)', color: '#fff' }}>
              <div className="flex items-center justify-between mb-2" style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                <span>Sub-Total:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#fff' }}>₹{Number(amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between mb-2" style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                <span>GST (18%):</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#fff' }}>₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '1.1rem', fontWeight: '800' }}>
                <span style={{ color: '#ffa726' }}>Total Invoice Amount:</span>
                <span style={{ color: '#4ade80', fontFamily: 'var(--font-mono)' }}>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              <CheckCircle size={16} />
              <span>Issue Department Invoice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
