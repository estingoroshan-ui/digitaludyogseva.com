import React from 'react';
import { useRouter } from '../router/Router';
import { ShieldCheck, Phone, Mail, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

export const Footer = () => {
  const { navigate } = useRouter();

  return (
    <footer className="site-footer" style={{ background: '#001B48', color: '#E2E8F0', padding: '60px 0 30px 0', borderTop: '4px solid #00BAF2' }}>
      <div className="container">
        
        {/* Top 5-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '36px', marginBottom: '40px' }}>
          
          {/* Col 1: Brand & Credibility */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img 
                src="/assets/logo.webp" 
                alt="Digital Udyog Seva Logo" 
                style={{ width: '44px', height: '44px', objectFit: 'contain', background: '#FFFFFF', borderRadius: '50%', padding: '2px' }} 
              />
              <div>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>
                  Digital Udyog Seva
                </h3>
                <span style={{ color: '#00BAF2', fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Govt Scheme &amp; Advisory Hub
                </span>
              </div>
            </div>

            <p style={{ color: '#94A3B8', fontSize: '0.84rem', lineHeight: '1.6', marginBottom: '18px' }}>
              Empowering Indian MSMEs, manufacturing startups, and entrepreneurs with bank-compliant project reports, government subsidy claims, and statutory registrations.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#4ADE80' }}>
                <ShieldCheck size={16} />
                <span>ISO 9001:2015 Quality Certified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#38BDF8' }}>
                <CheckCircle2 size={16} />
                <span>KVIC &amp; MSME Advisory Network</span>
              </div>
            </div>
          </div>

          {/* Col 2: Government Schemes */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.96rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px', borderBottom: '2px solid #00BAF2', paddingBottom: '6px', display: 'inline-block' }}>
              Govt Schemes
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
              <li><a href="/schemes" onClick={(e) => { e.preventDefault(); navigate('/schemes'); }} style={{ color: '#CBD5E1', textDecoration: 'none' }}>PMEGP (35% Subsidy)</a></li>
              <li><a href="/schemes" onClick={(e) => { e.preventDefault(); navigate('/schemes'); }} style={{ color: '#CBD5E1', textDecoration: 'none' }}>Mudra Yojana (Shishu/Kishore/Tarun)</a></li>
              <li><a href="/schemes" onClick={(e) => { e.preventDefault(); navigate('/schemes'); }} style={{ color: '#CBD5E1', textDecoration: 'none' }}>CGTMSE Collateral-Free Loans</a></li>
              <li><a href="/schemes" onClick={(e) => { e.preventDefault(); navigate('/schemes'); }} style={{ color: '#CBD5E1', textDecoration: 'none' }}>PMFME Food Processing Scheme</a></li>
              <li><a href="/schemes" onClick={(e) => { e.preventDefault(); navigate('/schemes'); }} style={{ color: '#CBD5E1', textDecoration: 'none' }}>Stand-Up India for SC/ST &amp; Women</a></li>
              <li><a href="/subsidies" onClick={(e) => { e.preventDefault(); navigate('/subsidies'); }} style={{ color: '#CBD5E1', textDecoration: 'none' }}>State Capital Investment Subsidies</a></li>
            </ul>
          </div>

          {/* Col 3: Loans & DPR Advisory */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.96rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px', borderBottom: '2px solid #00BAF2', paddingBottom: '6px', display: 'inline-block' }}>
              Loans &amp; DPR
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
              <li><a href="/loans" onClick={(e) => { e.preventDefault(); navigate('/loans'); }} style={{ color: '#CBD5E1', textDecoration: 'none' }}>Machinery &amp; Equipment Finance</a></li>
              <li><a href="/loans" onClick={(e) => { e.preventDefault(); navigate('/loans'); }} style={{ color: '#CBD5E1', textDecoration: 'none' }}>Cash Credit (CC) &amp; Overdraft (OD)</a></li>
              <li><a href="/services" onClick={(e) => { e.preventDefault(); navigate('/services'); }} style={{ color: '#CBD5E1', textDecoration: 'none' }}>Bank Detailed Project Report (DPR)</a></li>
              <li><a href="/services" onClick={(e) => { e.preventDefault(); navigate('/services'); }} style={{ color: '#CBD5E1', textDecoration: 'none' }}>CMA Data &amp; Financial Modeling</a></li>
              <li><a href="/eligibility" onClick={(e) => { e.preventDefault(); navigate('/eligibility'); }} style={{ color: '#CBD5E1', textDecoration: 'none' }}>Instant 100-Pt Loan Scorecard</a></li>
              <li><a href="/track" onClick={(e) => { e.preventDefault(); navigate('/track'); }} style={{ color: '#CBD5E1', textDecoration: 'none' }}>Track Application Status</a></li>
            </ul>
          </div>

          {/* Col 4: Corporate Services */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.96rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px', borderBottom: '2px solid #00BAF2', paddingBottom: '6px', display: 'inline-block' }}>
              Corporate &amp; Tax
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
              <li><a href="/services" onClick={(e) => { e.preventDefault(); navigate('/services'); }} style={{ color: '#CBD5E1', textDecoration: 'none' }}>Private Limited Company</a></li>
              <li><a href="/services" onClick={(e) => { e.preventDefault(); navigate('/services'); }} style={{ color: '#CBD5E1', textDecoration: 'none' }}>Limited Liability Partnership (LLP)</a></li>
              <li><a href="/services" onClick={(e) => { e.preventDefault(); navigate('/services'); }} style={{ color: '#CBD5E1', textDecoration: 'none' }}>GST Registration &amp; Filing</a></li>
              <li><a href="/services" onClick={(e) => { e.preventDefault(); navigate('/services'); }} style={{ color: '#CBD5E1', textDecoration: 'none' }}>Udyam MSME Certificate</a></li>
              <li><a href="/services" onClick={(e) => { e.preventDefault(); navigate('/services'); }} style={{ color: '#CBD5E1', textDecoration: 'none' }}>Trademark Registration (™)</a></li>
              <li><a href="/services" onClick={(e) => { e.preventDefault(); navigate('/services'); }} style={{ color: '#CBD5E1', textDecoration: 'none' }}>FSSAI Food Safety License</a></li>
            </ul>
          </div>

          {/* Col 5: Head Office & Helplines */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.96rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px', borderBottom: '2px solid #00BAF2', paddingBottom: '6px', display: 'inline-block' }}>
              Corporate Office
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={16} color="#00BAF2" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Sector 62, Electronic City, Noida, Uttar Pradesh 201301</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={15} color="#FDE68A" />
                <span style={{ color: '#FFFFFF', fontWeight: '700' }}>Toll Free: 1800-890-1234</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} color="#00BAF2" />
                <span>support@digitaludyogseva.com</span>
              </div>
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => navigate('/customer/login')}
                  style={{
                    width: '100%',
                    padding: '7px 12px',
                    borderRadius: '6px',
                    background: '#002970',
                    border: '1px solid #00BAF2',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  Customer Portal Login
                </button>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => navigate('/employee/login')}
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#E2E8F0',
                      fontSize: '0.74rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Staff Login
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/admin/login')}
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#E2E8F0',
                      fontSize: '0.74rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Admin ERP
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Legal Disclaimer Box */}
        <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '16px 20px', marginBottom: '28px', fontSize: '0.74rem', color: '#94A3B8', lineHeight: '1.6' }}>
          <strong>Statutory Compliance Disclaimer:</strong> Digital Udyog Seva is an independent private corporate and financial consultancy organization providing professional Detailed Project Report (DPR) modeling, chartered accountant attestations, statutory legal filings, and liaison assistance. Digital Udyog Seva is not a government department, banking institution, or lending entity. Loan sanctions, interest subventions, and subsidy grants are subject to statutory eligibility guidelines and the sole discretion of the respective lending banks and government ministries.
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', fontSize: '0.78rem', color: '#94A3B8' }}>
          <div>
            © {new Date().getFullYear()} Digital Udyog Seva. All Rights Reserved. • ISO 9001:2015 Certified
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }} style={{ color: '#CBD5E1', textDecoration: 'none' }}>About Us</a>
            <span>•</span>
            <a href="/knowledge" onClick={(e) => { e.preventDefault(); navigate('/knowledge'); }} style={{ color: '#CBD5E1', textDecoration: 'none' }}>Knowledge Center</a>
            <span>•</span>
            <a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }} style={{ color: '#CBD5E1', textDecoration: 'none' }}>Contact Us</a>
            <span>•</span>
            <span style={{ color: '#94A3B8' }}>Privacy Policy</span>
            <span>•</span>
            <span style={{ color: '#94A3B8' }}>Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
