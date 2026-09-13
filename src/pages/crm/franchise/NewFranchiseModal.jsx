import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  X, 
  Award, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Percent, 
  CheckCircle,
  Building
} from 'lucide-react';

export const NewFranchiseModal = ({ onClose }) => {
  const { addFranchise } = useApp();

  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('Rajasthan');
  const [pinCode, setPinCode] = useState('');
  const [commissionRate, setCommissionRate] = useState('40%');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !owner || !phone || !district) return;

    addFranchise({
      name,
      owner,
      phone,
      email: email || `${district.toLowerCase()}.kendra@digitaludyogseva.com`,
      district,
      state,
      pinCode: pinCode || '302001',
      commissionRate
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, #0b1727, #1e293b)', color: '#fff' }}>
          <div className="flex items-center gap-3">
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #ff6f00, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Award size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#fff' }}>Onboard Kendra Franchise Partner</h3>
              <span style={{ fontSize: '0.75rem', color: '#ffa726' }}>City / District Franchise Territory Allocation</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '24px' }}>
            <div className="form-group">
              <label className="form-label">Kendra Franchise Center Name *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Digital Udyog Seva Kendra - Sikar Road"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Partner / Operator Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Surendra Choudhary"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Number *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="+91 98290 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="kendra.partner@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">District Territory *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Sikar / Alwar"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">State</label>
                <select 
                  className="form-control"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Punjab">Punjab</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Pin Code</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="332001"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Franchise Commission Agreement (%)</label>
              <select 
                className="form-control"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
              >
                <option value="40%">Tier-1 Master Partner (40% Commission)</option>
                <option value="35%">Tier-2 District Partner (35% Commission)</option>
                <option value="30%">Tier-3 Tehsil Kendra (30% Commission)</option>
                <option value="25%">Standard Referral Agent (25% Commission)</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              <CheckCircle size={16} />
              <span>Issue Franchise License</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
