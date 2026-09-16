import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, Plus, Building2, Phone, Mail, MapPin, CheckCircle2, 
  ShieldCheck, Download, Printer, Filter, UserCheck, IndianRupee, 
  FileText, ArrowRight, Layers, Sparkles, Sliders
} from 'lucide-react';

export const CrmCustomers = () => {
  const { customers, setSelectedCustomerFor360, showToast } = useApp();
  
  const [search, setSearch] = useState('');
  const [selectedRmFilter, setSelectedRmFilter] = useState('All');
  const [selectedKycFilter, setSelectedKycFilter] = useState('All');
  const [selectedCityFilter, setSelectedCityFilter] = useState('All');

  // Filter logic
  const filtered = customers.filter(c => {
    const term = search.toLowerCase();
    const matchesSearch = 
      c.name.toLowerCase().includes(term) ||
      (c.contactPerson && c.contactPerson.toLowerCase().includes(term)) ||
      (c.city && c.city.toLowerCase().includes(term)) ||
      (c.gstin && c.gstin.toLowerCase().includes(term)) ||
      (c.id && c.id.toLowerCase().includes(term));

    const rmName = c.assignedRm?.name || c.customer360?.relationshipManager || 'CA Rajesh Verma';
    const matchesRm = selectedRmFilter === 'All' || rmName === selectedRmFilter;
    const matchesKyc = selectedKycFilter === 'All' || c.kycStatus === selectedKycFilter;
    const matchesCity = selectedCityFilter === 'All' || (c.city && c.city.includes(selectedCityFilter));

    return matchesSearch && matchesRm && matchesKyc && matchesCity;
  });

  const totalBilledSum = customers.reduce((acc, c) => {
    const val = Number(String(c.totalBilled || '0').replace(/[^0-9]/g, '')) || 28500;
    return acc + val;
  }, 0);

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Customer ID,Client Name,Contact Person,Phone,City,GSTIN,KYC Status,Assigned RM,Total Billed\n" +
      filtered.map(c => 
        `"${c.id}","${c.name}","${c.contactPerson}","${c.phone}","${c.city}","${c.gstin}","${c.kycStatus}","${c.assignedRm?.name || c.customer360?.relationshipManager || 'CA Rajesh Verma'}","${c.totalBilled}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DUS_Customers_Master_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Customer directory exported to CSV successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top 4 KPI Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #3b82f6' }}>
          <small style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700' }}>Active Corporate Clients</small>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0b1727' }}>
            {customers.length} Entities
          </div>
          <div style={{ fontSize: '0.72rem', color: '#15803d' }}>● 100% KYC Verified</div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #10b981' }}>
          <small style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700' }}>Total Cumulative Billed</small>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#15803d', fontFamily: 'var(--font-mono)' }}>
            ₹{(totalBilledSum / 1000).toFixed(1)}k+
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Includes Legal, Tax &amp; Subsidy Bills</div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #f59e0b' }}>
          <small style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700' }}>Ledger Receivables (Due)</small>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#b45309', fontFamily: 'var(--font-mono)' }}>
            ₹17,000.00
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Across Active GST &amp; Loan Files</div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #ff6f00' }}>
          <small style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700' }}>Recurring Retainer Plans</small>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#ea580c' }}>
            4 Active
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Monthly GST &amp; Annual ROC</div>
        </div>
      </div>

      {/* Header & Controls */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#0b1727', margin: 0, fontWeight: '800' }}>
            Customer 360° Master Database
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '3px 0 0' }}>
            Complete Client Dossier • Personal &amp; Business Addresses • Assigned RM • Statements • Invoices &amp; Retainers
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportCsv}
            className="btn btn-sm btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#fff' }}
          >
            <Download size={14} /> Export CSV
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-sm btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#fff' }}
          >
            <Printer size={14} /> Print Roster
          </button>
        </div>
      </div>

      {/* Multi-Parameter Universal Filter Bar */}
      <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', minWidth: '260px', flex: 1 }}>
          <input
            type="text"
            placeholder="Search by company name, contact person, GSTIN, city..."
            className="input input-sm w-full"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* RM Filter */}
          <div className="flex items-center gap-1">
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>RM:</span>
            <select
              value={selectedRmFilter}
              onChange={e => setSelectedRmFilter(e.target.value)}
              className="input input-sm"
              style={{ fontSize: '0.8rem' }}
            >
              <option value="All">All Relationship Managers</option>
              <option value="CA Rajesh Verma">CA Rajesh Verma</option>
              <option value="Sunil Manchanda">Sunil Manchanda (Banking)</option>
              <option value="Vikramaditya Rathore">Vikramaditya Rathore (Subsidy)</option>
              <option value="Neha Sharma">Neha Sharma</option>
            </select>
          </div>

          {/* KYC Status Filter */}
          <div className="flex items-center gap-1">
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>KYC:</span>
            <select
              value={selectedKycFilter}
              onChange={e => setSelectedKycFilter(e.target.value)}
              className="input input-sm"
              style={{ fontSize: '0.8rem' }}
            >
              <option value="All">All KYC Statuses</option>
              <option value="Verified">Verified Only</option>
              <option value="Pending">Pending Verification</option>
            </select>
          </div>

          {/* District / City Filter */}
          <div className="flex items-center gap-1">
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>City:</span>
            <select
              value={selectedCityFilter}
              onChange={e => setSelectedCityFilter(e.target.value)}
              className="input input-sm"
              style={{ fontSize: '0.8rem' }}
            >
              <option value="All">All Cities</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Kota">Kota</option>
              <option value="Jodhpur">Jodhpur</option>
              <option value="Bengaluru">Bengaluru</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Customers Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Client Entity &amp; ID</th>
              <th>Contact &amp; Addresses</th>
              <th>Assigned Relationship Manager</th>
              <th>GSTIN / PAN</th>
              <th>KYC Status</th>
              <th>Active Engagements</th>
              <th>Lifetime Billed</th>
              <th style={{ textAlign: 'right' }}>Master Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No customer records matched your search or filter parameters.
                </td>
              </tr>
            ) : (
              filtered.map(client => {
                const rmName = client.assignedRm?.name || client.customer360?.relationshipManager || 'CA Rajesh Verma';
                return (
                  <tr key={client.id}>
                    {/* Entity Name */}
                    <td>
                      <div style={{ fontWeight: '800', color: '#0b1727', fontSize: '0.95rem' }}>
                        {client.name}
                      </div>
                      <span className="badge badge-saffron" style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                        {client.id}
                      </span>
                    </td>

                    {/* Contact Person & Address */}
                    <td>
                      <div style={{ fontWeight: '700', color: '#334155' }}>{client.contactPerson}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>📞 {client.phone}</div>
                      <small style={{ color: '#94a3b8' }}>📍 {client.city}</small>
                    </td>

                    {/* Assigned RM with avatar badge */}
                    <td>
                      <div className="flex items-center gap-2">
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800' }}>
                          {rmName.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1e40af' }}>{rmName}</div>
                          <small style={{ color: '#64748b' }}>Cabin #02 Desk</small>
                        </div>
                      </div>
                    </td>

                    {/* GSTIN */}
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' }}>
                        {client.gstin}
                      </span>
                    </td>

                    {/* KYC */}
                    <td>
                      <span className="badge badge-emerald">
                        <ShieldCheck size={12} /> {client.kycStatus}
                      </span>
                    </td>

                    {/* Services / Retainers */}
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {(client.activeServices || ['Company Compliance', 'GST Filing']).map((s, idx) => (
                          <span key={idx} className="badge badge-blue" style={{ fontSize: '0.68rem' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Total Billed */}
                    <td>
                      <div style={{ fontWeight: '900', fontFamily: 'var(--font-mono)', color: '#0b1727', fontSize: '0.95rem' }}>
                        {client.totalBilled}
                      </div>
                      <small style={{ color: '#059669' }}>LTV High</small>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedCustomerFor360(client)}
                          className="btn btn-sm btn-primary"
                          style={{ fontSize: '0.78rem', padding: '6px 14px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px', background: 'linear-gradient(135deg, #0b1727, #1e293b)' }}
                        >
                          <span>Customer 360°</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
