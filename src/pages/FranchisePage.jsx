import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, TrendingUp, Users, ShieldCheck, IndianRupee, ArrowRight, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const FranchisePage = () => {
  const { addLead, showToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    experience: 'Cyber Cafe / CSC Operator'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    addLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      service: 'Franchise Partner Registration',
      value: 25000,
      source: 'Franchise Landing Page',
      assignedTo: 'Franchise Onboarding Head',
      notes: `Location: ${formData.city}, ${formData.state}. Background: ${formData.experience}`
    });

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    setSubmitted(true);
    showToast('Franchise partner application received! Our onboarding team will contact you.');
  };

  return (
    <div className="section" style={{ background: '#f8fafc', minHeight: '80vh' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="badge badge-saffron" style={{ marginBottom: '12px' }}>
            National Partner Network
          </span>
          <h2>Digital Udyog Seva Kendra Partner Program</h2>
          <p>
            Start your own district business registration, tax compliance, and loan facilitation center. Deliver 50+ services with zero CA staff needed.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'flex-start', marginBottom: '60px' }}>
          {/* Left: Value Proposition & Tiers */}
          <div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Why Partner with Digital Udyog Seva?</h3>
            <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '24px' }}>
              Thousands of shop owners, tax consultants, CSC operators, cyber cafe owners, and entrepreneurs across India are creating steady monthly incomes exceeding <strong>₹50,000 to ₹1,50,000</strong>. You simply collect customer requirements; our centralized team of Chartered Accountants and legal experts handles the government filings.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
                <IndianRupee size={24} color="#059669" />
                <h4 style={{ fontSize: '1.05rem', margin: '10px 0 4px' }}>Up to 40% Commission</h4>
                <small style={{ color: '#64748b' }}>Industry-highest revenue share on registrations and loan DPRs.</small>
              </div>

              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
                <Users size={24} color="#2563eb" />
                <h4 style={{ fontSize: '1.05rem', margin: '10px 0 4px' }}>CRM Partner Portal</h4>
                <small style={{ color: '#64748b' }}>Real-time dashboard to monitor cases, invoices, and automated payouts.</small>
              </div>

              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
                <Award size={24} color="#ff6f00" />
                <h4 style={{ fontSize: '1.05rem', margin: '10px 0 4px' }}>Authorized Certificate</h4>
                <small style={{ color: '#64748b' }}>Official Digital Udyog Seva Kendra branding and certification.</small>
              </div>
            </div>

            <h4 style={{ fontSize: '1.15rem', marginBottom: '14px' }}>Partner Tiers</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>Authorized Service Center</strong>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Ideal for cyber cafes, photostat shops & CSC operators</div>
                </div>
                <span className="badge badge-emerald">Available</span>
              </div>

              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>District Master Franchise</strong>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Exclusive district rights + override commission on sub-centers</div>
                </div>
                <span className="badge badge-saffron">Premium</span>
              </div>
            </div>
          </div>

          {/* Right: Partner Application Form */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '6px' }}>Apply for Franchise</h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '20px' }}>
              Fill out the form below to lock your district territory.
            </p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h4>Application Submitted!</h4>
                <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '8px' }}>
                  Thank you, <strong>{formData.name}</strong>. Our state franchise director will call you on <strong>{formData.phone}</strong> with the partner agreement kit.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Ramesh Chandra"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">WhatsApp Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    className="form-control"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email ID</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="ramesh@gmail.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">City / Town</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Gorakhpur"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Uttar Pradesh"
                      value={formData.state}
                      onChange={e => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Current Profession / Business</label>
                  <select
                    className="form-control"
                    value={formData.experience}
                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                  >
                    <option value="Cyber Cafe / CSC Operator">Cyber Cafe / CSC Operator</option>
                    <option value="Tax Consultant / Accountant">Tax Consultant / Accountant</option>
                    <option value="Insurance / DSA Agent">Insurance / DSA Agent</option>
                    <option value="New Entrepreneur">New Entrepreneur / Graduate</option>
                    <option value="Other Commercial Store">Other Commercial Store</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary w-full btn-lg" style={{ marginTop: '10px' }}>
                  <span>Submit Franchise Application</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
