import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calculator, ArrowRight, Percent, Calendar, IndianRupee, ShieldCheck } from 'lucide-react';

export const LoanCalculator = () => {
  const { addLead, showToast } = useApp();

  const [amount, setAmount] = useState(1500000); // 15 Lakhs
  const [interestRate, setInterestRate] = useState(9.5); // 9.5%
  const [tenureYears, setTenureYears] = useState(5); // 5 Years

  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);

  // EMI Formula
  const calculateEMI = () => {
    const P = amount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest)
    };
  };

  const { emi, totalPayment, totalInterest } = calculateEMI();
  const principalPercent = Math.round((amount / totalPayment) * 100);
  const interestPercent = 100 - principalPercent;

  const handleApply = (e) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone) return;

    addLead({
      name: applicantName,
      phone: applicantPhone,
      email: 'Via Loan EMI Calculator',
      service: `Business Loan (₹${(amount / 100000).toFixed(1)} Lakhs @ ${interestRate}%)`,
      value: Math.round(amount * 0.015), // 1.5% commission value
      source: 'Loan EMI Calculator',
      assignedTo: 'Anil Tyagi (Loan Specialist)',
      notes: `Requested Loan Amount: ₹${amount.toLocaleString('en-IN')}, Tenure: ${tenureYears} Yrs, Est EMI: ₹${emi.toLocaleString('en-IN')}/mo`
    });

    setShowApplyForm(false);
    setApplicantName('');
    setApplicantPhone('');
    showToast(`Loan application of ₹${amount.toLocaleString('en-IN')} submitted to loan underwriting team!`);
  };

  return (
    <div className="calc-card">
      {/* Left Slider Inputs */}
      <div className="calc-inputs">
        <div className="flex items-center gap-2 mb-4">
          <Calculator size={22} color="#ff6f00" />
          <h3 style={{ fontSize: '1.4rem' }}>MSME & Business Loan EMI Calculator</h3>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '30px' }}>
          Simulate monthly repayment, bank interest, and calculate your eligibility for PMEGP, Mudra, and commercial credit.
        </p>

        {/* Loan Amount Slider */}
        <div className="calc-slider-group">
          <div className="calc-slider-header">
            <span className="calc-slider-label">Loan Amount Required</span>
            <span className="calc-slider-val">₹ {amount.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min="100000"
            max="10000000"
            step="50000"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="calc-slider"
          />
          <div className="flex justify-between" style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
            <span>₹ 1 Lakh</span>
            <span>₹ 50 Lakhs</span>
            <span>₹ 1 Crore</span>
          </div>
        </div>

        {/* Interest Rate Slider */}
        <div className="calc-slider-group">
          <div className="calc-slider-header">
            <span className="calc-slider-label">Annual Interest Rate (% p.a.)</span>
            <span className="calc-slider-val">{interestRate} %</span>
          </div>
          <input
            type="range"
            min="7.5"
            max="16.0"
            step="0.25"
            value={interestRate}
            onChange={e => setInterestRate(Number(e.target.value))}
            className="calc-slider"
          />
          <div className="flex justify-between" style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
            <span>7.5% (Govt Subsidized)</span>
            <span>11.5% (Mudra/Bank)</span>
            <span>16.0% (NBFC)</span>
          </div>
        </div>

        {/* Tenure Slider */}
        <div className="calc-slider-group">
          <div className="calc-slider-header">
            <span className="calc-slider-label">Repayment Tenure</span>
            <span className="calc-slider-val">{tenureYears} Years ({tenureYears * 12} Months)</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={tenureYears}
            onChange={e => setTenureYears(Number(e.target.value))}
            className="calc-slider"
          />
          <div className="flex justify-between" style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
            <span>1 Year</span>
            <span>5 Years</span>
            <span>10 Years</span>
          </div>
        </div>
      </div>

      {/* Right Results Panel */}
      <div className="calc-results">
        <div>
          <div className="badge badge-saffron" style={{ marginBottom: '16px' }}>
            Instant Repayment Quote
          </div>

          <div className="emi-display-box">
            <small style={{ color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
              Estimated Monthly EMI
            </small>
            <div className="emi-amount">₹ {emi.toLocaleString('en-IN')}</div>
            <small style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>per month for {tenureYears * 12} months</small>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            <div className="flex justify-between" style={{ fontSize: '0.9rem' }}>
              <span style={{ color: '#94a3b8' }}>Principal Amount:</span>
              <span style={{ fontWeight: '700', fontFamily: 'var(--font-mono)' }}>₹ {amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between" style={{ fontSize: '0.9rem' }}>
              <span style={{ color: '#94a3b8' }}>Total Interest Payable:</span>
              <span style={{ fontWeight: '700', color: '#ffa726', fontFamily: 'var(--font-mono)' }}>₹ {totalInterest.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between" style={{ fontSize: '0.95rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
              <span style={{ color: '#fff', fontWeight: '600' }}>Total Amount Payable:</span>
              <span style={{ fontWeight: '800', color: '#4ade80', fontFamily: 'var(--font-mono)', fontSize: '1.1rem' }}>
                ₹ {totalPayment.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Visual Ratio Bar */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${principalPercent}%`, background: '#3b82f6' }} title={`Principal: ${principalPercent}%`} />
              <div style={{ width: `${interestPercent}%`, background: '#f59e0b' }} title={`Interest: ${interestPercent}%`} />
            </div>
            <div className="flex justify-between" style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>
              <span>■ Principal ({principalPercent}%)</span>
              <span>■ Interest ({interestPercent}%)</span>
            </div>
          </div>
        </div>

        {/* Application Trigger */}
        <div>
          {showApplyForm ? (
            <form onSubmit={handleApply} style={{ background: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '12px' }}>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  className="form-control"
                  style={{ background: '#0b1727', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                  value={applicantName}
                  onChange={e => setApplicantName(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <input
                  type="tel"
                  required
                  placeholder="Mobile Number (+91)"
                  className="form-control"
                  style={{ background: '#0b1727', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                  value={applicantPhone}
                  onChange={e => setApplicantPhone(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary w-full">
                  Confirm Loan Inquiry
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowApplyForm(false)} 
                  className="btn btn-outline-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button 
              onClick={() => setShowApplyForm(true)} 
              className="btn btn-primary w-full btn-lg"
            >
              <span>Apply for this Loan Offer</span>
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
