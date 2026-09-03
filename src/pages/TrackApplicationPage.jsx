import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, CheckCircle2, Clock, FileText, Phone, User, ShieldCheck } from 'lucide-react';

export const TrackApplicationPage = () => {
  const { trackApplication, showToast } = useApp();
  const [appId, setAppId] = useState('DUS-2026-8942');
  const [result, setResult] = useState(() => trackApplication('DUS-2026-8942'));

  const handleSearch = (e) => {
    e.preventDefault();
    if (!appId) return;
    const res = trackApplication(appId);
    if (res) {
      setResult(res);
      showToast(`Case details loaded for #${res.id}`);
    } else {
      showToast(`No record found for "${appId}". Please verify the application ID.`, 'error');
    }
  };

  return (
    <div className="section" style={{ background: '#f8fafc', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="section-header">
          <span className="badge badge-saffron" style={{ marginBottom: '12px' }}>
            Live CRM Case Tracking
          </span>
          <h2>Track Your Application Status</h2>
          <p>
            Enter your Digital Udyog Seva unique case application number to inspect live government filing status, assigned officer, and document progress.
          </p>
        </div>

        {/* Input Bar */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', marginBottom: '32px' }}>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                required
                placeholder="Enter Application ID (e.g. DUS-2026-8942 or DUS-2026-9114)"
                value={appId}
                onChange={e => setAppId(e.target.value)}
                className="form-control"
                style={{ fontSize: '1rem', padding: '12px 16px' }}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg">
              <Search size={18} />
              <span>Track Now</span>
            </button>
          </form>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '12px', fontSize: '0.82rem', color: '#64748b' }}>
            <span>Quick Samples:</span>
            <button 
              type="button"
              onClick={() => { setAppId('DUS-2026-8942'); setResult(trackApplication('DUS-2026-8942')); }} 
              style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem' }}
            >
              DUS-2026-8942 (Company Incorporation)
            </button>
            <button 
              type="button"
              onClick={() => { setAppId('DUS-2026-9114'); setResult(trackApplication('DUS-2026-9114')); }} 
              style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem' }}
            >
              DUS-2026-9114 (PMEGP Loan)
            </button>
          </div>
        </div>

        {/* Status Card */}
        {result && (
          <div className="tracker-box">
            <div className="flex justify-between items-start" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '24px' }}>
              <div>
                <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>
                  {result.status}
                </span>
                <h3 style={{ fontSize: '1.4rem' }}>{result.service}</h3>
                <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
                  Applicant: <strong>{result.clientName}</strong> • {result.businessName}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '700' }}>Application ID</small>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#ff6f00' }}>{result.id}</div>
                <small style={{ color: '#94a3b8' }}>Filed on {result.appliedDate}</small>
              </div>
            </div>

            {/* Stepper */}
            <div className="stepper">
              {result.stages.map((stage, idx) => (
                <div key={idx} className={`step-item ${stage.done ? 'completed' : idx === result.currentStage ? 'active' : ''}`}>
                  <div className="step-circle">
                    {stage.done ? <CheckCircle2 size={20} /> : idx + 1}
                  </div>
                  <div className="step-label">{stage.label}</div>
                  <small style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{stage.date}</small>
                </div>
              ))}
            </div>

            {/* Meta Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', background: '#f8fafc', padding: '18px', borderRadius: '12px', marginTop: '30px' }}>
              <div>
                <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Assigned Legal / Loan Officer</small>
                <div style={{ fontWeight: '700', color: '#0b1727', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <User size={16} color="#2563eb" />
                  <span>{result.officer}</span>
                </div>
              </div>

              <div>
                <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Verification Integrity</small>
                <div style={{ fontWeight: '700', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <ShieldCheck size={16} color="#059669" />
                  <span>MCA / Govt Portal Synced</span>
                </div>
              </div>

              <div>
                <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Direct Case Support</small>
                <div style={{ fontWeight: '700', color: '#ff6f00', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <Phone size={16} color="#ff6f00" />
                  <span>+91 800-889-4422</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
