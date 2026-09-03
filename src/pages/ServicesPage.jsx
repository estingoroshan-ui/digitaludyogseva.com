import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Building, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ServicesPage = () => {
  const { popularServices, setSelectedService, setActiveView } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Business Registration', 'Tax & Compliance', 'Govt Registration', 'Intellectual Property', 'Licensing', 'Loan & DPR', 'Certification'];

  const filtered = popularServices.filter(s => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="section" style={{ minHeight: '80vh', background: '#f8fafc' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '36px' }}>
          <span className="badge badge-saffron" style={{ marginBottom: '12px' }}>
            MCA & Tax Compliances
          </span>
          <h2>Digital Corporate Services Directory</h2>
          <p>
            Choose from over 50+ government registrations, licenses, and tax filings handled by verified Chartered Accountants & Company Secretaries.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '36px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: '1', minWidth: '280px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Search by service name (e.g. GST, Private Limited, FSSAI)..."
                className="form-control"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          {filtered.map(service => (
            <div key={service.id} className="service-card">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="service-icon-box">
                    <Building size={24} />
                  </div>
                  <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                    {service.category}
                  </span>
                </div>

                <h3 className="service-title">{service.name}</h3>
                <p className="service-desc">{service.desc}</p>
              </div>

              <div>
                <div className="service-meta">
                  <div>
                    <small style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Fee</small>
                    <div className="service-price">{service.price}</div>
                  </div>
                  <div className="service-time">
                    <Clock size={14} />
                    <span>{service.time}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedService(service)}
                  className="btn btn-primary w-full"
                  style={{ marginTop: '16px' }}
                >
                  <span>Apply & Check Docs</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3>No services found matching "{search}"</h3>
            <p style={{ color: '#64748b', marginTop: '6px' }}>Try searching for general terms like "GST", "Loan", or "Company".</p>
          </div>
        )}
      </div>
    </div>
  );
};
