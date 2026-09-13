import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CabinInvoiceModal } from './CabinInvoiceModal';
import { 
  Building2, 
  DoorOpen, 
  Users, 
  Receipt, 
  ArrowRight, 
  TrendingUp, 
  Phone, 
  FileText, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Clock, 
  Search, 
  IndianRupee,
  Layers,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

export const BusinessHubCabins = () => {
  const { 
    cabins, 
    cabinBills, 
    leads, 
    loanCases, 
    dispatchCaseToCabin, 
    showToast 
  } = useApp();

  const [selectedCabinForInvoice, setSelectedCabinForInvoice] = useState(null);
  const [selectedCabinFilter, setSelectedCabinFilter] = useState('All');
  const [transferCaseId, setTransferCaseId] = useState('');
  const [transferTargetCabin, setTransferTargetCabin] = useState('cabin-2');
  const [transferNote, setTransferNote] = useState('');
  const [billSearch, setBillSearch] = useState('');

  // Total Hub Revenue calculation
  const totalRevenueNum = cabinBills.reduce((acc, curr) => acc + (curr.total || curr.amount || 0), 0);
  const totalActiveCases = cabins.reduce((acc, curr) => acc + curr.activeCases, 0);

  const handleQuickDispatch = (e) => {
    e.preventDefault();
    if (!transferCaseId) return;
    dispatchCaseToCabin(transferCaseId, transferTargetCabin, transferNote);
    setTransferCaseId('');
    setTransferNote('');
  };

  const filteredBills = cabinBills.filter(b => {
    const matchesSearch = b.customerName.toLowerCase().includes(billSearch.toLowerCase()) ||
                          b.cabinName.toLowerCase().includes(billSearch.toLowerCase()) ||
                          b.id.toLowerCase().includes(billSearch.toLowerCase());
    const matchesCabin = selectedCabinFilter === 'All' || b.cabinId === selectedCabinFilter;
    return matchesSearch && matchesCabin;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Banner & Hub Stats */}
      <div style={{
        background: 'linear-gradient(135deg, #070e17 0%, #0b1727 60%, #1e293b 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '30px',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: 'var(--shadow-xl)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #ff6f00, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Building2 size={26} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.6rem', color: '#fff', margin: 0, fontWeight: 800 }}>
                  Business Hub Command Center — 7 Multi-Department Desks
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0, marginTop: '4px' }}>
                  Unified Physical &amp; Digital Building Desk Control: Consulting ➔ Documentation ➔ Subsidy ➔ Bank ➔ Machinery ➔ Trading ➔ Franchises
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedCabinForInvoice(cabins[1])}
                className="btn btn-primary btn-sm"
              >
                <Receipt size={16} />
                <span>Issue Department Bill</span>
              </button>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Active Cabin Desks</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffa726', fontFamily: 'var(--font-mono)' }}>
                7 Cabins Operational
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Live Processing Files</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#4ade80', fontFamily: 'var(--font-mono)' }}>
                {totalActiveCases} Active Cases
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Total Invoices Issued</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
                {cabinBills.length} Bills (₹{totalRevenueNum.toLocaleString('en-IN')})
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Today's Walk-in Footfall</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f472b6', fontFamily: 'var(--font-mono)' }}>
                45 Entrepreneurs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inter-Cabin File Dispatcher Toolbar */}
      <div style={{ background: '#fff', padding: '20px 24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Send size={18} color="#ff6f00" />
          <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: '700', color: 'var(--navy-950)' }}>
            Inter-Cabin File Transfer &amp; Handover Engine
          </h3>
          <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '9999px', fontWeight: '700' }}>
            Instant Handover
          </span>
        </div>

        <form onSubmit={handleQuickDispatch} className="grid" style={{ gridTemplateColumns: '1fr 1.3fr 1.5fr auto', gap: '14px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>
              Select File / Case ID *
            </label>
            <select 
              className="form-control"
              value={transferCaseId}
              onChange={(e) => setTransferCaseId(e.target.value)}
              required
            >
              <option value="">-- Choose Active Case --</option>
              {loanCases.map(lc => (
                <option key={lc.id} value={lc.id}>{lc.id} - {lc.applicantName} ({lc.scheme})</option>
              ))}
              {leads.slice(0, 5).map(l => (
                <option key={l.id} value={l.id}>{l.leadCode} - {l.name} ({l.service})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>
              Forward to Target Cabin Desk *
            </label>
            <select 
              className="form-control"
              value={transferTargetCabin}
              onChange={(e) => setTransferTargetCabin(e.target.value)}
              required
            >
              {cabins.map(c => (
                <option key={c.id} value={c.id}>{c.cabinNumber} — {c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>
              Instructions / Handover Note
            </label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Consultation done. Please draft DPR & prepare MCA docs."
              value={transferNote}
              onChange={(e) => setTransferNote(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '10px 18px', height: '42px' }}>
            <Send size={15} />
            <span>Dispatch File</span>
          </button>
        </form>
      </div>

      {/* 7 Cabins Grid Layout */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800, color: 'var(--navy-950)' }}>
              Business Hub Desks &amp; Department Cabins
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', margin: 0, marginTop: '2px' }}>
              Physical building cabin management with dedicated incharge, live walk-ins, and individual billing
            </p>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {cabins.map((cabin) => (
            <div 
              key={cabin.id}
              style={{
                background: '#fff',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--slate-200)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
                transition: 'var(--transition)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span style={{
                    background: cabin.accentColor,
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {cabin.cabinNumber}
                  </span>

                  <span style={{
                    fontSize: '0.75rem',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    background: '#f1f5f9',
                    color: '#475569',
                    fontWeight: '600'
                  }}>
                    {cabin.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--navy-950)', marginBottom: '4px' }}>
                  {cabin.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)', marginBottom: '14px', lineHeight: 1.4 }}>
                  {cabin.role}
                </p>

                {/* Incharge card */}
                <div style={{ background: 'var(--slate-50)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--slate-200)', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Desk Incharge:</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--navy-900)' }}>{cabin.head}</div>
                  <div className="flex items-center gap-2 mt-1" style={{ fontSize: '0.78rem', color: '#ff6f00' }}>
                    <Phone size={12} />
                    <span>{cabin.phone}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Active Files</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: cabin.accentColor, fontFamily: 'var(--font-mono)' }}>
                      {cabin.activeCases}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Month Invoiced</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--navy-900)', fontFamily: 'var(--font-mono)' }}>
                      {cabin.monthRevenue}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', borderTop: '1px solid var(--slate-100)', paddingTop: '14px' }}>
                <button 
                  onClick={() => setSelectedCabinForInvoice(cabin)}
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', fontSize: '0.8rem' }}
                >
                  <Receipt size={14} />
                  <span>Cut Bill (₹{cabin.defaultFee})</span>
                </button>

                <button 
                  onClick={() => {
                    setSelectedCabinFilter(cabin.id);
                    showToast(`Filtered billing logs for ${cabin.cabinNumber}!`);
                  }}
                  className="btn btn-sm"
                  style={{ background: 'var(--slate-100)', color: 'var(--slate-700)', width: '100%', fontSize: '0.8rem' }}
                >
                  <FileText size={14} />
                  <span>View Bills</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cabin Billing & Invoicing Register */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--slate-200)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--navy-950)', margin: 0 }}>
              Department-Wise Billing &amp; Invoicing Register
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
              Individual receipts generated by respective cabins with unified company ledger
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ position: 'relative', minWidth: '220px' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input 
                type="text" 
                className="form-control"
                style={{ paddingLeft: '32px', fontSize: '0.85rem' }}
                placeholder="Search invoice or client..."
                value={billSearch}
                onChange={(e) => setBillSearch(e.target.value)}
              />
            </div>

            <select 
              className="form-control" 
              style={{ fontSize: '0.85rem' }}
              value={selectedCabinFilter}
              onChange={(e) => setSelectedCabinFilter(e.target.value)}
            >
              <option value="All">All 7 Cabins</option>
              {cabins.map(c => (
                <option key={c.id} value={c.id}>{c.cabinNumber} - {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Issuing Cabin Desk</th>
                <th>Client Name &amp; Contact</th>
                <th>Service Narration</th>
                <th>Base Amount</th>
                <th>GST (18%)</th>
                <th>Total (₹)</th>
                <th>Payment Mode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => (
                <tr key={bill.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--navy-900)' }}>
                    {bill.id}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ff6f00' }}>
                      {bill.cabinName}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: 'var(--navy-900)' }}>{bill.customerName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>{bill.phone}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--slate-700)', maxWidth: '280px' }}>
                    {bill.serviceDescription}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>₹{Number(bill.amount).toLocaleString('en-IN')}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: '#64748b' }}>₹{Number(bill.gstAmount || 0).toLocaleString('en-IN')}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', color: 'var(--navy-950)' }}>
                    ₹{Number(bill.total || bill.amount).toLocaleString('en-IN')}
                  </td>
                  <td>
                    <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                      {bill.paymentMode || 'UPI'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${bill.status.includes('Paid') ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.72rem' }}>
                      {bill.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedCabinForInvoice && (
        <CabinInvoiceModal 
          cabin={selectedCabinForInvoice}
          onClose={() => setSelectedCabinForInvoice(null)}
        />
      )}
    </div>
  );
};
