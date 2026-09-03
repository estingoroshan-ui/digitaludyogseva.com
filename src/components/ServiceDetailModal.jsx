import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle2, Clock, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

export const ServiceDetailModal = () => {
  const { selectedService, setSelectedService, addLead } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!selectedService) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    addLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email || 'Not provided',
      service: selectedService.name,
      value: selectedService.rawPrice || 5000,
      source: 'Website Service Modal',
      assignedTo: 'Lead Assignment Bot',
      notes: `Applied for ${selectedService.name} from City: ${formData.city || 'General'}`
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedService(null);
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedService(null)}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="badge badge-saffron" style={{ marginBottom: '6px' }}>
              {selectedService.category}
            </span>
            <h3 style={{ fontSize: '1.3rem' }}>{selectedService.name}</h3>
          </div>
          <button 
            onClick={() => setSelectedService(null)} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle2 size={36} />
              </div>
              <h3>Consultation Request Received!</h3>
              <p style={{ color: '#64748b', marginTop: '8px' }}>
                Our corporate filing manager will call you on <strong>{formData.phone}</strong> within 15 minutes.
              </p>
            </div>
          ) : (
            <>
              <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '20px' }}>
                {selectedService.desc}
              </p>

              <div style={{ display: 'flex', gap: '16px', background: '#f8fafc', padding: '14px', borderRadius: '8px', marginBottom: '24px' }}>
                <div>
                  <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>Govt / Professional Fee</small>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0b1727' }}>{selectedService.price}</div>
                </div>
                <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '16px' }}>
                  <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>Timeline</small>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem', fontWeight: '600', color: '#059669', marginTop: '2px' }}>
                    <Clock size={16} />
                    <span>{selectedService.time}</span>
                  </div>
                </div>
              </div>

              <h4 style={{ fontSize: '1rem', marginBottom: '12px' }}>Documents Required</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
                {selectedService.docs.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-2" style={{ fontSize: '0.88rem', color: '#334155' }}>
                    <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0 }} />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '14px', color: '#0b1727' }}>
                  Start Your Filing / Instant Callback
                </h4>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        className="form-control" 
                        placeholder="e.g. Rajesh Kumar" 
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label">Mobile Number *</label>
                      <input 
                        type="tel" 
                        required 
                        className="form-control" 
                        placeholder="+91 98765 43210" 
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <label className="form-label">Email ID</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        placeholder="rajesh@company.com" 
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label">City / State</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. Mumbai, Maharashtra" 
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-full btn-lg">
                    <span>Submit & Proceed to Filing</span>
                    <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
