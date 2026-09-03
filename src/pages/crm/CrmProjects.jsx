import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Briefcase, 
  Search, 
  Filter, 
  MapPin, 
  User, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Building,
  Plus
} from 'lucide-react';

export const CrmProjects = () => {
  const { projects, setSelectedProjectForDetail } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = projects.filter(p => {
    const matchesSearch = 
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      p.service.toLowerCase().includes(search.toLowerCase()) ||
      p.projectCode.toLowerCase().includes(search.toLowerCase()) ||
      p.currentLocation.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || p.currentStatus.includes(statusFilter);
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#0b1727' }}>Project & Case Execution Command Hub</h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Active government submissions, RoC/KVIC filings, bank loan dossiers, and jurisdiction location tracking.
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <div style={{ position: 'relative', width: '280px' }}>
            <input
              type="text"
              placeholder="Search code, client, location, service..."
              className="form-control"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            className="form-control"
            style={{ width: '180px' }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Initiated">Initiated</option>
            <option value="Govt Submission">Govt Submission</option>
            <option value="Completed">Completed / Sanctioned</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Project Code</th>
              <th>Client / Entity</th>
              <th>Service</th>
              <th>Current Status & Location</th>
              <th>Assigned Officer</th>
              <th>Tasks Done</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(proj => {
              const completedTasks = proj.tasks?.filter(t => t.done).length || 0;
              const totalTasks = proj.tasks?.length || 0;

              return (
                <tr key={proj.id}>
                  <td>
                    <div style={{ fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#ff6f00' }}>
                      {proj.projectCode}
                    </div>
                    <small style={{ color: '#64748b' }}>{proj.id}</small>
                  </td>

                  <td>
                    <div style={{ fontWeight: '700', color: '#0b1727' }}>{proj.customerName}</div>
                    <small style={{ color: '#64748b' }}>{proj.contactPerson} ({proj.phone})</small>
                  </td>

                  <td>
                    <div style={{ fontWeight: '600', color: '#2563eb' }}>{proj.service}</div>
                    <small style={{ color: '#64748b' }}>Dept: {proj.department}</small>
                  </td>

                  <td>
                    <span className="badge badge-emerald" style={{ marginBottom: '4px', display: 'inline-block' }}>
                      {proj.currentStatus}
                    </span>
                    <div className="flex items-center gap-1" style={{ fontSize: '0.78rem', color: '#475569' }}>
                      <MapPin size={12} color="#059669" />
                      <span>{proj.currentLocation}</span>
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: '600', color: '#0b1727' }}>{proj.assignedPerson?.name}</div>
                    <small style={{ color: '#059669' }}>{proj.assignedPerson?.role}</small>
                  </td>

                  <td>
                    <div className="flex items-center gap-2">
                      <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>{completedTasks}/{totalTasks}</span>
                      <div style={{ width: '50px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${(completedTasks / (totalTasks || 1)) * 100}%`, height: '100%', background: '#059669' }}></div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <button 
                      onClick={() => setSelectedProjectForDetail(proj)}
                      className="btn btn-sm btn-primary"
                    >
                      <span>12-Step Dossier</span>
                      <ArrowUpRight size={13} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
