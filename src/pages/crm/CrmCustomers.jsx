import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Plus, Building2, Phone, Mail, MapPin, CheckCircle2, Shield } from 'lucide-react';

export const CrmCustomers = () => {
  const { customers } = useApp();
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase()) ||
    c.gstin.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#0b1727' }}>Customer & Client Database</h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Registered companies, GSTIN records, KYC compliance, and ongoing service engagements.
          </p>
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            placeholder="Search company, person, GSTIN..."
            className="form-control"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Client / Business Name</th>
              <th>Contact Person</th>
              <th>Location</th>
              <th>GSTIN</th>
              <th>KYC Status</th>
              <th>Active Services</th>
              <th>Total Billed</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(client => (
              <tr key={client.id}>
                <td>
                  <div style={{ fontWeight: '700', color: '#0b1727' }}>{client.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>{client.id}</div>
                </td>
                <td>
                  <div>{client.contactPerson}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{client.phone}</div>
                </td>
                <td>
                  <div className="flex items-center gap-1" style={{ fontSize: '0.85rem' }}>
                    <MapPin size={13} color="#64748b" />
                    <span>{client.city}</span>
                  </div>
                </td>
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                    {client.gstin}
                  </span>
                </td>
                <td>
                  <span className="badge badge-emerald">
                    <CheckCircle2 size={12} /> {client.kycStatus}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {client.activeServices.map((s, idx) => (
                      <span key={idx} className="badge badge-blue" style={{ fontSize: '0.68rem' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#0b1727' }}>
                  {client.totalBilled}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
