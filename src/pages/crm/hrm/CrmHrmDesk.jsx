import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  Users, 
  Building2, 
  CheckCircle2, 
  Search, 
  Award, 
  TrendingUp, 
  Phone, 
  Briefcase, 
  Calendar, 
  ShieldCheck,
  Plus
} from 'lucide-react';

export const CrmHrmDesk = () => {
  const { cabinStaff, cabins, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCabinFilter, setSelectedCabinFilter] = useState('All');

  const filteredStaff = cabinStaff.filter(stf => {
    const matchesSearch = stf.name.toLowerCase().includes(search.toLowerCase()) ||
                          stf.role.toLowerCase().includes(search.toLowerCase());
    const matchesCabin = selectedCabinFilter === 'All' || stf.cabinId === selectedCabinFilter;
    return matchesSearch && matchesCabin;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #070e17 0%, #1e293b 60%, #334155 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '30px',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: 'var(--shadow-xl)'
      }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #ff6f00, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Users size={26} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', color: '#fff', margin: 0, fontWeight: 800 }}>
                HRM, Staff &amp; Cabin Desk Controllers
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0, marginTop: '4px' }}>
                Department-wise staff allocation, desk attendance, monthly targets, active case loads and commission splits
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Total Staff Strength</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffa726', fontFamily: 'var(--font-mono)' }}>
              {cabinStaff.length} Officers
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Today's Attendance</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#4ade80', fontFamily: 'var(--font-mono)' }}>
              100% Present
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Active Cases in Hands</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
              {cabinStaff.reduce((acc, s) => acc + s.activeCases, 0)} Files
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Avg File Turnaround</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f472b6', fontFamily: 'var(--font-mono)' }}>
              3.4 Days
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div style={{ background: '#fff', padding: '18px 24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--slate-200)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div className="flex items-center gap-3 flex-1" style={{ minWidth: '280px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input 
              type="text" 
              className="form-control"
              style={{ paddingLeft: '36px' }}
              placeholder="Search staff by name or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select 
            className="form-control"
            style={{ maxWidth: '200px' }}
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

      {/* Staff Table */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--slate-200)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Officer ID</th>
                <th>Staff Officer Name</th>
                <th>Assigned Cabin Desk</th>
                <th>Professional Role</th>
                <th>Attendance</th>
                <th>Active Files</th>
                <th>Monthly Target</th>
                <th>Achieved</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((stf) => {
                const cabinObj = cabins.find(c => c.id === stf.cabinId);
                return (
                  <tr key={stf.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>{stf.id}</td>
                    <td style={{ fontWeight: '800', color: 'var(--navy-950)' }}>{stf.name}</td>
                    <td>
                      <span style={{ fontSize: '0.82rem', fontWeight: '700', color: cabinObj?.accentColor || '#ff6f00' }}>
                        {cabinObj?.cabinNumber} ({cabinObj?.name.split(' ')[0]})
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--slate-700)' }}>{stf.role}</td>
                    <td>
                      <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                        ● {stf.attendance}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', color: '#2563eb' }}>
                      {stf.activeCases} Cases
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{stf.targetMonth}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#059669' }}>
                      {stf.achievedMonth}
                    </td>
                    <td>
                      <span className="badge badge-saffron" style={{ fontSize: '0.72rem' }}>
                        High Performer
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
