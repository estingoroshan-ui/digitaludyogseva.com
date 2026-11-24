import React, { useState } from 'react';
import { useRouter, getApiUrl } from '../router/Router';
import { useApp } from '../context/AppContext';
import { MapPin, PhoneCall, Mail, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ContactUsPage = () => {
  const { navigate } = useRouter();
  const { showToast } = useApp();

  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    serviceRequired: 'PMEGP Scheme Advisory',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contactData.name.trim() || !contactData.phone.trim()) {
      showToast('Please enter your name and phone number', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: contactData.name,
        phone: contactData.phone,
        email: contactData.email,
        lead_value: 'Direct Contact Enquiry',
        source_detail: `Contact Us: ${contactData.serviceRequired} (${contactData.city}) - ${contactData.message}`
      };

      await fetch(getApiUrl('api/v1/leads.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setSubmitted(true);
      showToast('Enquiry received! Our team will contact you.', 'success');
    } catch (err) {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: '#F4F8FC', minHeight: '100vh', padding: '36px 0 60px 0' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#00BAF2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Corporate Reach
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#002970', margin: '6px 0 10px 0' }}>
            Contact Digital Udyog Seva
          </h1>
          <p style={{ fontSize: '0.94rem', color: '#475569', margin: 0, lineHeight: '1.6' }}>
            Have questions about scheme eligibility, DPR preparation, or application tracking? Connect directly with our consultation desks.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          
          {/* Office Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 14px rgba(0, 41, 112, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <MapPin size={20} color="#00BAF2" />
                <h3 style={{ fontSize: '1.10rem', fontWeight: '800', color: '#002970', margin: 0 }}>Jaipur Executive Office</h3>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: '1.5', margin: '0 0 12px 0' }}>
                Tonk Road, Near Gandhi Nagar, Jaipur, Rajasthan 302015
              </p>
              <div style={{ fontSize: '0.80rem', color: '#64748B' }}>
                Assisting Rajasthan, Madhya Pradesh, Gujarat &amp; Northern Region
              </div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 14px rgba(0, 41, 112, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <MapPin size={20} color="#00BAF2" />
                <h3 style={{ fontSize: '1.10rem', fontWeight: '800', color: '#002970', margin: 0 }}>Noida Regulatory &amp; Tech Hub</h3>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: '1.5', margin: '0 0 12px 0' }}>
                Sector 62, Electronic City, Noida, Uttar Pradesh 201301
              </p>
              <div style={{ fontSize: '0.80rem', color: '#64748B' }}>
                Assisting Delhi NCR, Uttar Pradesh &amp; Central Ministry Liaison
              </div>
            </div>

            <div style={{ background: '#001B48', color: '#FFFFFF', borderRadius: '14px', padding: '24px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '14px' }}>
                Direct Helplines
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PhoneCall size={16} color="#FDE68A" />
                  <span style={{ color: '#FDE68A', fontWeight: '800' }}>Toll-Free: 1800-890-1234</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} color="#00BAF2" />
                  <span style={{ color: '#CBD5E1' }}>support@digitaludyogseva.com</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="#4ADE80" />
                  <span style={{ color: '#94A3B8' }}>Hours: Mon - Sat: 9:00 AM - 7:00 PM</span>
                </div>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 4px 14px rgba(0, 41, 112, 0.05)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#002970', marginBottom: '8px' }}>
              Send an Official Enquiry
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', marginBottom: '20px' }}>
              Submit your inquiry and an advisory consultant will contact you within 2 business hours.
            </p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '36px 0' }}>
                <CheckCircle2 size={42} color="#16A34A" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '1.20rem', fontWeight: '800', color: '#002970', marginBottom: '6px' }}>
                  Enquiry Successfully Registered!
                </h4>
                <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: '1.6' }}>
                  Your inquiry has been assigned to our regional advisory desk. Thank you for connecting with Digital Udyog Seva.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  style={{ marginTop: '16px', padding: '10px 20px', background: '#002970', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.84rem', cursor: 'pointer' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anil Tyagi"
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit number"
                      value={contactData.phone}
                      onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>City / District</label>
                    <input
                      type="text"
                      placeholder="e.g. Jaipur"
                      value={contactData.city}
                      onChange={(e) => setContactData({ ...contactData, city: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. anil@industry.in"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>Service or Scheme Required</label>
                  <select
                    value={contactData.serviceRequired}
                    onChange={(e) => setContactData({ ...contactData, serviceRequired: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem', background: '#FFFFFF' }}
                  >
                    <option value="PMEGP Scheme Advisory">PMEGP Scheme (35% Subsidy)</option>
                    <option value="MUDRA Business Loan">MUDRA Business Loan</option>
                    <option value="CGTMSE Collateral-Free Loan">CGTMSE Collateral-Free Loan</option>
                    <option value="Project Report / DPR Preparation">Project Report / DPR Preparation</option>
                    <option value="State Industrial Subsidy Claims">State Industrial Subsidy Claims</option>
                    <option value="Company Incorporation (Pvt Ltd)">Company Incorporation (Pvt Ltd)</option>
                    <option value="GST & Tax Filings">GST &amp; Tax Filings</option>
                    <option value="Kendra Franchise Partner">Kendra Franchise Partner</option>
                  </select>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>Project Details / Query</label>
                  <textarea
                    rows="3"
                    placeholder="Provide brief details about your enterprise or loan requirement..."
                    value={contactData.message}
                    onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{ width: '100%', padding: '12px', background: '#002970', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '0.90rem', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Send size={16} />
                  <span>{submitting ? 'Submitting...' : 'Send Advisory Request'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
