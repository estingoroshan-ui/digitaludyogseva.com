import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Banknote, 
  Building2, 
  User, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  IndianRupee 
} from 'lucide-react';

export const NewLoanCaseModal = () => {
  const { isNewLoanModalOpen, setIsNewLoanModalOpen, addLoanCase, lendersMaster } = useApp();

  const [formData, setFormData] = useState({
    applicantName: '',
    businessName: '',
    customerType: 'Proprietorship',
    contact: '',
    email: '',
    city: '',
    state: 'Gujarat',
    pinCode: '',
    pan: '',
    aadhaarLast4: '',
    vintageYears: 2.5,
    gstin: '',
    udyamNumber: '',
    annualTurnover: 3500000,
    scheme: 'PMEGP Govt Loan',
    loanType: 'Term Loan + Working Capital',
    requiredAmount: 2500000,
    loanPurpose: '',
    cibilScore: 750,
    existingLoans: 0,
    existingEmi: 0,
    preferredBank: 'State Bank of India (SBI)',
    preferredBranch: 'Commercial Branch',
    subsidyCategory: 'Special (Women / Urban 25%)'
  });

  if (!isNewLoanModalOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.applicantName || !formData.businessName || !formData.requiredAmount) {
      alert('Please fill all mandatory fields (Applicant, Business Name, Loan Amount).');
      return;
    }

    addLoanCase(formData);
    setIsNewLoanModalOpen(false);
  };

  return (
    <div className="crm-modal-backdrop" onClick={() => setIsNewLoanModalOpen(false)}>
      <div 
        className="crm-modal-container"
        style={{ maxWidth: '840px', maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ background: '#0b1727', color: '#fff', padding: '20px 24px', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-saffron">New Loan File Dossier</span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>DUS Banking & Underwriting Engine</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#fff', fontWeight: '800' }}>
              Register Government / Bank Loan Case
            </h3>
          </div>
          <button 
            onClick={() => setIsNewLoanModalOpen(false)}
            className="btn btn-ghost"
            style={{ color: '#fff', padding: '6px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', overflowY: 'auto', maxHeight: 'calc(92vh - 160px)' }}>
          {/* Section 1: Applicant Profile */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.92rem', color: '#0b1727', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} color="#ff6f00" />
              <span>1. Primary Borrower / Promoter Information</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div>
                <label className="form-label">Applicant Full Name *</label>
                <input 
                  type="text" 
                  name="applicantName" 
                  required
                  placeholder="e.g. Ramesh Chandra Sharma" 
                  value={formData.applicantName} 
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div>
                <label className="form-label">Mobile Number *</label>
                <input 
                  type="text" 
                  name="contact" 
                  required
                  placeholder="+91 98XXX XXXXX" 
                  value={formData.contact} 
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div>
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="borrower@gmail.com" 
                  value={formData.email} 
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div>
                <label className="form-label">PAN Card Number</label>
                <input 
                  type="text" 
                  name="pan" 
                  placeholder="ABCDE1234F" 
                  value={formData.pan} 
                  onChange={handleChange}
                  className="form-control"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>

              <div>
                <label className="form-label">Aadhaar (Last 4 Digits)</label>
                <input 
                  type="text" 
                  name="aadhaarLast4" 
                  placeholder="4821" 
                  maxLength={4}
                  value={formData.aadhaarLast4} 
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div>
                <label className="form-label">City & State</label>
                <input 
                  type="text" 
                  name="city" 
                  placeholder="City, State" 
                  value={formData.city} 
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Business & Enterprise Profile */}
          <div style={{ marginBottom: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.92rem', color: '#0b1727', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={16} color="#ff6f00" />
              <span>2. Business Entity & Statutory Registrations</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div>
                <label className="form-label">Business / Firm Name *</label>
                <input 
                  type="text" 
                  name="businessName" 
                  required
                  placeholder="e.g. Sharma Agro Industries" 
                  value={formData.businessName} 
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div>
                <label className="form-label">Constitution Type</label>
                <select name="customerType" value={formData.customerType} onChange={handleChange} className="form-control">
                  <option value="Proprietorship">Proprietorship</option>
                  <option value="Partnership">Partnership Firm</option>
                  <option value="Private Limited">Private Limited Company</option>
                  <option value="LLP">Limited Liability Partnership (LLP)</option>
                  <option value="Individual">Individual / New Startup</option>
                </select>
              </div>

              <div>
                <label className="form-label">Business Vintage (Years)</label>
                <input 
                  type="number" 
                  step="0.5"
                  name="vintageYears" 
                  value={formData.vintageYears} 
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div>
                <label className="form-label">GSTIN (If Registered)</label>
                <input 
                  type="text" 
                  name="gstin" 
                  placeholder="24ABCDE1234F1Z5" 
                  value={formData.gstin} 
                  onChange={handleChange}
                  className="form-control"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>

              <div>
                <label className="form-label">Udyam MSME Number</label>
                <input 
                  type="text" 
                  name="udyamNumber" 
                  placeholder="UDYAM-XX-00-0000000" 
                  value={formData.udyamNumber} 
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div>
                <label className="form-label">Annual Turnover (₹)</label>
                <input 
                  type="number" 
                  name="annualTurnover" 
                  value={formData.annualTurnover} 
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Loan Scheme & Banking Details */}
          <div style={{ marginBottom: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.92rem', color: '#0b1727', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Banknote size={16} color="#ff6f00" />
              <span>3. Loan Scheme, Required Capital & Preferred Bank</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div>
                <label className="form-label">Target Scheme *</label>
                <select name="scheme" value={formData.scheme} onChange={handleChange} className="form-control">
                  <option value="PMEGP Govt Loan">PMEGP (Up to ₹50L + 15-35% Subsidy)</option>
                  <option value="Mudra Tarun Scheme">Mudra Tarun (₹5L - ₹10L Collateral Free)</option>
                  <option value="Mudra Kishor Scheme">Mudra Kishor (₹50k - ₹5L)</option>
                  <option value="CGTMSE Collateral-Free">CGTMSE Guarantee Loan (Up to ₹2-5 Cr)</option>
                  <option value="Machinery Loan (MSME)">Machinery & Equipment Term Loan</option>
                  <option value="Working Capital (CC/OD)">Working Capital Cash Credit / OD</option>
                  <option value="Commercial Business Loan">Commercial Bank Business Loan</option>
                </select>
              </div>

              <div>
                <label className="form-label">Required Loan Amount (₹) *</label>
                <input 
                  type="number" 
                  name="requiredAmount" 
                  required
                  placeholder="2500000" 
                  value={formData.requiredAmount} 
                  onChange={handleChange}
                  className="form-control"
                  style={{ fontWeight: '800', fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div>
                <label className="form-label">Borrower CIBIL Score</label>
                <input 
                  type="number" 
                  name="cibilScore" 
                  placeholder="750" 
                  value={formData.cibilScore} 
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div>
                <label className="form-label">Preferred Lender Bank</label>
                <select name="preferredBank" value={formData.preferredBank} onChange={handleChange} className="form-control">
                  {lendersMaster.map(l => (
                    <option key={l.id} value={l.name}>{l.name} ({l.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Preferred Branch</label>
                <input 
                  type="text" 
                  name="preferredBranch" 
                  placeholder="e.g. Commercial SME Branch" 
                  value={formData.preferredBranch} 
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div>
                <label className="form-label">PMEGP Subsidy Category</label>
                <select name="subsidyCategory" value={formData.subsidyCategory} onChange={handleChange} className="form-control">
                  <option value="General Urban (15%)">General Urban (15% Subsidy)</option>
                  <option value="General Rural (25%)">General Rural (25% Subsidy)</option>
                  <option value="Special (Women / Urban 25%)">Special Category / Women Urban (25% Subsidy)</option>
                  <option value="Special (Rural / Women 35%)">Special Category / Rural / Women (35% Subsidy)</option>
                  <option value="N/A">Not Applicable</option>
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Purpose of Loan & Project Summary</label>
                <textarea 
                  name="loanPurpose" 
                  rows={2} 
                  placeholder="Describe machinery purchase, civil works, raw material stock, or expansion requirements..." 
                  value={formData.loanPurpose} 
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <button 
              type="button" 
              onClick={() => setIsNewLoanModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ fontWeight: '700', padding: '10px 24px' }}
            >
              <CheckCircle2 size={16} />
              <span>Create Loan Docket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
