import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { NewFranchiseModal } from './NewFranchiseModal';
import { 
  Award, 
  MapPin, 
  Users, 
  TrendingUp, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Wallet, 
  CheckCircle, 
  ArrowUpRight, 
  Building2, 
  Percent,
  Banknote,
  FileCheck
} from 'lucide-react';

export const FranchiseManager = () => {
  const { 
    franchises, 
    approveFranchisePayout, 
    isNewFranchiseModalOpen, 
    setIsNewFranchiseModalOpen, 
    showToast 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');

  // Stats
  const totalWallets = franchises.reduce((acc, f) => acc + (f.walletBalance || 0), 0);
  const totalEarnings = franchises.reduce((acc, f) => acc + (f.totalEarned || 0), 0);

  const filteredFranchises = franchises.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === 'All' || f.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '30px',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: 'var(--shadow-xl)'
      }}>
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #ff6f00, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Award size={26} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', color: '#fff', margin: 0, fontWeight: 800 }}>
                Kendra Franchise Partner Network (Online + Offline)
              </h1>
              <p style={{ color: '#c7d2fe', fontSize: '0.88rem', margin: 0, marginTop: '4px' }}>
                Manage district &amp; tehsil Kendra franchises, territory allocation, lead inflows, and automated 40% commission payouts
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsNewFranchiseModalOpen(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Onboard New Kendra</span>
          </button>
        </div>

        {/* KPI Strip */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.06)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1', textTransform: 'uppercase', fontWeight: '700' }}>Active Kendras</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffa726', fontFamily: 'var(--font-mono)' }}>
              {franchises.length} Centers
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.06)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1', textTransform: 'uppercase', fontWeight: '700' }}>Sanctioned Loan Volume</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#4ade80', fontFamily: 'var(--font-mono)' }}>
              ₹11.65 Cr+
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.06)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1', textTransform: 'uppercase', fontWeight: '700' }}>Pending Commission Wallets</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#facc15', fontFamily: 'var(--font-mono)' }}>
              ₹{totalWallets.toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.06)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1', textTransform: 'uppercase', fontWeight: '700' }}>Total Payouts Disbursed</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              ₹{totalEarnings.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ background: '#fff', padding: '20px 24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-1" style={{ minWidth: '280px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="text" 
                className="form-control"
                style={{ paddingLeft: '36px' }}
                placeholder="Search by center name, district, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select 
              className="form-control"
              style={{ maxWidth: '180px' }}
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="All">All States</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Gujarat">Gujarat</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span style={{ fontSize: '0.82rem', color: 'var(--slate-600)', fontWeight: '600' }}>
              Showing {filteredFranchises.length} of {franchises.length} Kendra Centers
            </span>
          </div>
        </div>
      </div>

      {/* Franchise Cards Grid */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {filteredFranchises.map((f) => (
          <div 
            key={f.id}
            style={{
              background: '#fff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--slate-200)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'var(--transition)'
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span style={{
                  background: '#fef3c7',
                  color: '#b45309',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {f.code}
                </span>

                <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                  {f.status}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--navy-950)', marginBottom: '6px' }}>
                {f.name}
              </h3>

              <div className="flex items-center gap-2 mb-3" style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>
                <MapPin size={14} color="#ff6f00" />
                <span>{f.district}, {f.state} (PIN: {f.pinCode})</span>
              </div>

              {/* Operator card */}
              <div style={{ background: 'var(--slate-50)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--slate-200)', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Franchise Operator:</div>
                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--navy-900)' }}>{f.owner}</div>
                <div className="flex items-center gap-3 mt-1" style={{ fontSize: '0.78rem', color: 'var(--slate-600)' }}>
                  <span>{f.phone}</span>
                  <span>•</span>
                  <span style={{ color: '#2563eb' }}>{f.commissionRate} Cut</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Active Leads</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#2563eb', fontFamily: 'var(--font-mono)' }}>
                    {f.activeLeads}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Sanctioned Volume</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#059669', fontFamily: 'var(--font-mono)' }}>
                    {f.sanctionedVolume}
                  </div>
                </div>
              </div>

              {/* Wallet Strip */}
              <div style={{ background: 'linear-gradient(135deg, #0b1727, #1e293b)', color: '#fff', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Unpaid Commission Wallet</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ffa726', fontFamily: 'var(--font-mono)' }}>
                    ₹{f.walletBalance.toLocaleString('en-IN')}
                  </div>
                </div>

                {f.walletBalance > 0 && (
                  <button 
                    onClick={() => approveFranchisePayout(f.id, f.walletBalance)}
                    className="btn btn-sm btn-primary"
                    style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  >
                    <CheckCircle size={14} />
                    <span>Approve Payout</span>
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--slate-100)', paddingTop: '14px' }}>
              <a 
                href={`tel:${f.phone}`} 
                className="btn btn-outline btn-sm" 
                style={{ flex: 1, fontSize: '0.8rem' }}
              >
                <Phone size={13} />
                <span>Call Center</span>
              </a>
              <button 
                onClick={() => showToast(`Opening case files assigned to ${f.code}...`)}
                className="btn btn-sm" 
                style={{ flex: 1, background: 'var(--slate-100)', color: 'var(--slate-700)', fontSize: '0.8rem' }}
              >
                <span>View Cases</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Onboard Franchise Modal */}
      {isNewFranchiseModalOpen && (
        <NewFranchiseModal onClose={() => setIsNewFranchiseModalOpen(false)} />
      )}
    </div>
  );
};
