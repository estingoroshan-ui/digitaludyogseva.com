import React from 'react';
import { useRouter } from '../router/Router';
import { ShieldCheck, Award, Users, CheckCircle2, Building2, MapPin, PhoneCall, Mail } from 'lucide-react';

export const AboutUsPage = () => {
  const { navigate } = useRouter();

  return (
    <div style={{ background: '#F4F8FC', minHeight: '100vh', padding: '36px 0 60px 0' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Corporate Profile &amp; Governance
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#002970', margin: '6px 0 10px 0' }}>
            About Digital Udyog Seva
          </h1>
          <p style={{ fontSize: '0.96rem', color: '#475569', margin: 0, lineHeight: '1.6' }}>
            India's Premier Business &amp; MSME Advisory Platform — bridging entrepreneurs with Government Schemes, Subsidized Loans, and Statutory Corporate Registrations.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '36px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '28px', boxShadow: '0 4px 14px rgba(0, 41, 112, 0.05)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#EFF6FF', color: '#002970', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Award size={24} color="#00BAF2" />
            </div>
            <h3 style={{ fontSize: '1.20rem', fontWeight: '800', color: '#002970', marginBottom: '8px' }}>Our Mission</h3>
            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: '1.6', margin: 0 }}>
              To empower 1,00,000+ Indian micro and small enterprises by democratizing access to central and state government subsidies, bankable project reports (DPR), and transparent corporate compliance.
            </p>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '28px', boxShadow: '0 4px 14px rgba(0, 41, 112, 0.05)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <ShieldCheck size={24} color="#16A34A" />
            </div>
            <h3 style={{ fontSize: '1.20rem', fontWeight: '800', color: '#002970', marginBottom: '8px' }}>Integrity &amp; Standards</h3>
            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: '1.6', margin: 0 }}>
              We operate under strict ISO 9001:2015 quality frameworks and ISO 27001 data confidentiality protocols. All financial modeling and DPR preparation is executed by qualified in-house Chartered Accountants.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '36px', boxShadow: '0 4px 16px rgba(0, 41, 112, 0.05)', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#002970', marginBottom: '20px' }}>
            What Sets Our Advisory Desk Apart
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Licensed Chartered Accountants', desc: 'Direct technical consultation with CAs and Company Secretaries for SPICe+, CMA data, and DSCR modeling.' },
              { title: 'Verified Bank Liaison Desk', desc: 'Guidance across nationalized banks (SBI, BoB, PNB, Canara) and leading private MSME financial institutions.' },
              { title: 'Zero Collateral CGTMSE Focus', desc: 'Specialized support for manufacturing and food processing units seeking debt without residential mortgage.' },
              { title: 'Real-Time Milestone Tracking', desc: 'Complete case transparency through customer portal dashboards and automated WhatsApp status alerts.' }
            ].map((p, idx) => (
              <div key={idx} style={{ padding: '16px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <CheckCircle2 size={18} color="#16A34A" style={{ marginBottom: '8px' }} />
                <h4 style={{ fontSize: '0.96rem', fontWeight: '800', color: '#002970', marginBottom: '4px' }}>{p.title}</h4>
                <p style={{ fontSize: '0.80rem', color: '#64748B', lineHeight: '1.5', margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Offices */}
        <div style={{ background: '#001B48', color: '#FFFFFF', borderRadius: '16px', padding: '36px', boxShadow: '0 12px 32px rgba(0, 41, 112, 0.2)' }}>
          <h3 style={{ fontSize: '1.30rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '20px' }}>
            Headquarters &amp; Regional Presence
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <div style={{ fontWeight: '800', color: '#00BAF2', fontSize: '0.96rem', marginBottom: '4px' }}>Jaipur Executive Office</div>
              <p style={{ fontSize: '0.84rem', color: '#CBD5E1', lineHeight: '1.5', margin: '0 0 10px 0' }}>
                Tonk Road, Near Gandhi Nagar, Jaipur, Rajasthan 302015
              </p>
              <div style={{ fontSize: '0.80rem', color: '#94A3B8' }}>Serving Rajasthan, Gujarat &amp; Northern Zone</div>
            </div>

            <div>
              <div style={{ fontWeight: '800', color: '#00BAF2', fontSize: '0.96rem', marginBottom: '4px' }}>Noida Regulatory &amp; Tech Hub</div>
              <p style={{ fontSize: '0.84rem', color: '#CBD5E1', lineHeight: '1.5', margin: '0 0 10px 0' }}>
                Sector 62, Electronic City, Noida, Uttar Pradesh 201301
              </p>
              <div style={{ fontSize: '0.80rem', color: '#94A3B8' }}>Serving Delhi NCR, Uttar Pradesh &amp; Central Ministry Desk</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
