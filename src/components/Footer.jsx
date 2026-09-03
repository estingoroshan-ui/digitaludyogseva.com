import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, ShieldCheck, Phone, Mail, MapPin, CheckCircle2, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  const { setActiveView } = useApp();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="brand-mark" style={{ width: '38px', height: '38px' }}>
                <Building2 size={20} />
              </div>
              <div className="brand-text">
                <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>Digital Udyog Seva</h3>
                <span style={{ color: '#ffa726', fontSize: '0.72rem' }}>Corporate & Financial Advisory</span>
              </div>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.6' }}>
              Empowering Indian entrepreneurs, MSMEs, and startups with digital business compliance, MCA filings, trademark protection, and subsidized bank loan approvals.
            </p>

            <div className="flex items-center gap-3">
              <span className="badge badge-emerald">
                <ShieldCheck size={14} /> 100% Data Confidentiality
              </span>
              <span className="badge badge-saffron">KVIC & MSME Partner</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-title">Popular Services</h4>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('services'); }} className="footer-link">Private Limited Registration</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('services'); }} className="footer-link">GST Registration & Returns</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('services'); }} className="footer-link">Trademark Registration (™)</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('services'); }} className="footer-link">Udyam / MSME Certificate</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('services'); }} className="footer-link">FSSAI Food Safety License</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('services'); }} className="footer-link">Income Tax Return (ITR)</a></li>
            </ul>
          </div>

          {/* Loan Hub */}
          <div>
            <h4 className="footer-title">Govt Business Loans</h4>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('loans'); }} className="footer-link">PMEGP Scheme (35% Subsidy)</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('loans'); }} className="footer-link">Mudra Shishu / Kishore / Tarun</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('loans'); }} className="footer-link">CGTMSE Collateral-Free Loans</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('loans'); }} className="footer-link">Detailed Project Reports (DPR)</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('loans'); }} className="footer-link">Loan Against Property (LAP)</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('loans'); }} className="footer-link">EMI & Eligibility Calculator</a></li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="footer-title">Corporate Office</h4>
            <ul className="footer-links">
              <li className="flex items-start gap-3" style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                <MapPin size={18} color="#ffa726" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>Sector 62, Noida Electronic City, Uttar Pradesh 201301</span>
              </li>
              <li className="flex items-center gap-3" style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                <Phone size={16} color="#ffa726" />
                <span>+91 800-889-4422 (Toll Free)</span>
              </li>
              <li className="flex items-center gap-3" style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                <Mail size={16} color="#ffa726" />
                <span>support@digitaludyogseva.com</span>
              </li>
            </ul>

            <div style={{ marginTop: '20px' }}>
              <button 
                onClick={() => setActiveView('franchise')}
                className="btn btn-sm btn-outline-white w-full"
              >
                <span>Partner with Us</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Digital Udyog Seva (DUS). All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span style={{ color: '#64748b' }}>Privacy Policy</span>
            <span style={{ color: '#64748b' }}>•</span>
            <span style={{ color: '#64748b' }}>Terms & Conditions</span>
            <span style={{ color: '#64748b' }}>•</span>
            <span style={{ color: '#64748b' }}>Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
