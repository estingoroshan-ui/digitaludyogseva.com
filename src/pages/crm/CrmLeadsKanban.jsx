import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Calendar, 
  User, 
  IndianRupee, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  Table as TableIcon,
  Kanban as KanbanIcon,
  Flame,
  Send,
  Sparkles,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export const CrmLeadsKanban = () => {
  const { leads, updateLeadStage, addLead, setSelectedLeadForDetail, convertLeadToCustomerAndProject, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' (default easy view) | 'kanban'
  const [selectedStageFilter, setSelectedStageFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Private Limited Company Registration',
    value: 7500,
    source: 'Direct Client',
    assignedTo: 'Neha Sharma',
    notes: ''
  });

  const stages = ['New Leads', 'Contacted', 'In Progress', 'Documents Pending', 'Converted'];

  // Filtered Leads
  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.service.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      (l.id && l.id.toLowerCase().includes(search.toLowerCase()));

    const matchesStage = selectedStageFilter === 'All' || l.stage === selectedStageFilter;
    return matchesSearch && matchesStage;
  });

  const handleCreateLead = (e) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.phone) return;

    addLead(newLeadForm);
    setShowAddModal(false);
    setNewLeadForm({
      name: '',
      phone: '',
      email: '',
      service: 'Private Limited Company Registration',
      value: 7500,
      source: 'Direct Client',
      assignedTo: 'Neha Sharma',
      notes: ''
    });
  };

  const getStageBadgeClass = (stage) => {
    switch (stage) {
      case 'New Leads': return 'badge-blue';
      case 'Contacted': return 'badge-amber';
      case 'In Progress': return 'badge-saffron';
      case 'Documents Pending': return 'badge-rose';
      case 'Converted': return 'badge-emerald';
      default: return 'badge-blue';
    }
  };

  return (
    <div>
      {/* Top Header & Easy Controls */}
      <div className="flex justify-between items-center mb-5 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 style={{ fontSize: '1.6rem', color: '#0b1727', margin: 0 }}>Leads Management Hub</h2>
            <span className="badge badge-saffron" style={{ fontSize: '0.75rem' }}>
              {leads.length} Total Leads
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>
            Quickly view, update stages, follow up, or launch full 8-step lifecycle dossiers.
          </p>
        </div>

        <div className="flex gap-3 items-center flex-wrap">
          {/* View Mode Toggle (Table / List vs Kanban) */}
          <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: '8px', padding: '3px' }}>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: viewMode === 'table' ? '700' : '600',
                background: viewMode === 'table' ? '#fff' : 'transparent',
                color: viewMode === 'table' ? '#0b1727' : '#64748b',
                boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <TableIcon size={15} />
              <span>Easy List View</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: viewMode === 'kanban' ? '700' : '600',
                background: viewMode === 'kanban' ? '#fff' : 'transparent',
                color: viewMode === 'kanban' ? '#0b1727' : '#64748b',
                boxShadow: viewMode === 'kanban' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <KanbanIcon size={15} />
              <span>Kanban Boxes</span>
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '250px' }}>
            <input
              type="text"
              placeholder="Search by name, phone, service..."
              className="form-control"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} />
            <span>+ Add Lead</span>
          </button>
        </div>
      </div>

      {/* Stage Quick Filter Chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700' }}>Filter Stage:</span>
        <button
          type="button"
          onClick={() => setSelectedStageFilter('All')}
          style={{
            padding: '5px 14px',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: selectedStageFilter === 'All' ? '700' : '600',
            background: selectedStageFilter === 'All' ? '#0b1727' : '#f1f5f9',
            color: selectedStageFilter === 'All' ? '#fff' : '#475569'
          }}
        >
          All ({leads.length})
        </button>

        {stages.map(st => {
          const count = leads.filter(l => l.stage === st).length;
          return (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStageFilter(st)}
              style={{
                padding: '5px 14px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: selectedStageFilter === st ? '700' : '600',
                background: selectedStageFilter === st ? '#ff6f00' : '#f1f5f9',
                color: selectedStageFilter === st ? '#fff' : '#475569'
              }}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. EASY LIST / TABLE VIEW (PRIMARY & HIGHLY COMFORTABLE)      */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'table' && (
        <div className="table-wrapper" style={{ boxShadow: 'var(--shadow-sm)', borderRadius: '12px' }}>
          <table className="data-table">
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ width: '80px' }}>Lead ID</th>
                <th>Prospect / Contact</th>
                <th>Service Requested</th>
                <th>Deal Value</th>
                <th>Source</th>
                <th>Stage & Quick Advance</th>
                <th>Assigned To</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    No leads found matching your search or filter.
                  </td>
                </tr>
              ) : (
                filteredLeads.map(lead => (
                  <tr key={lead.id} style={{ transition: 'background-color 0.15s' }}>
                    {/* Lead ID */}
                    <td>
                      <div style={{ fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#ff6f00' }}>
                        {lead.id}
                      </div>
                      <small style={{ color: '#94a3b8', fontSize: '0.72rem' }}>{lead.date}</small>
                    </td>

                    {/* Prospect Details */}
                    <td>
                      <div style={{ fontWeight: '700', color: '#0b1727', fontSize: '0.95rem' }}>
                        {lead.name}
                      </div>
                      <div className="flex items-center gap-3" style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '3px' }}>
                        <span className="flex items-center gap-1">
                          <Phone size={12} color="#059669" /> {lead.phone}
                        </span>
                        {lead.leadSource?.ipCity && (
                          <span>📍 {lead.leadSource.ipCity}</span>
                        )}
                      </div>
                    </td>

                    {/* Service */}
                    <td>
                      <div style={{ fontWeight: '600', color: '#2563eb', fontSize: '0.9rem' }}>
                        {lead.service}
                      </div>
                      {lead.interested?.temperature && (
                        <small style={{ color: '#e11d48', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                          <Flame size={12} /> {lead.interested.temperature} Intent
                        </small>
                      )}
                    </td>

                    {/* Value */}
                    <td>
                      <div style={{ fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#0b1727', fontSize: '0.95rem' }}>
                        ₹{Number(lead.value || 0).toLocaleString('en-IN')}
                      </div>
                      <small style={{ color: '#059669', fontSize: '0.72rem' }}>
                        {lead.sales?.salesProbability || '80%'} prob
                      </small>
                    </td>

                    {/* Source */}
                    <td>
                      <span className="badge badge-saffron" style={{ fontSize: '0.7rem' }}>
                        {lead.leadSource?.channel || lead.source || 'Website'}
                      </span>
                    </td>

                    {/* Stage with 1-Click Dropdown Changer */}
                    <td>
                      <select
                        value={lead.stage}
                        onChange={e => updateLeadStage(lead.id, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          background: lead.stage === 'Converted' ? '#dcfce7' : '#fff',
                          color: lead.stage === 'Converted' ? '#15803d' : '#0b1727',
                          fontWeight: '700',
                          fontSize: '0.82rem',
                          cursor: 'pointer'
                        }}
                      >
                        {stages.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>

                    {/* Assigned To */}
                    <td>
                      <div className="flex items-center gap-2">
                        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#ff6f00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '700' }}>
                          {(lead.sales?.assignedExecutive || lead.assignedTo || 'N').charAt(0)}
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
                          {lead.sales?.assignedExecutive || lead.assignedTo || 'Unassigned'}
                        </span>
                      </div>
                    </td>

                    {/* Quick Action Buttons */}
                    <td style={{ textAlign: 'right' }}>
                      <div className="flex items-center gap-2 justify-end">
                        {/* WhatsApp Direct */}
                        <a
                          href={`https://wa.me/91${lead.phone.replace(/[^0-9]/g, '').slice(-10)}?text=Hello%20${encodeURIComponent(lead.name)},%20greetings%20from%20Digital%20Udyog%20Seva%20regarding%20your%20inquiry%20for%20${encodeURIComponent(lead.service)}.`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline"
                          style={{ padding: '6px 9px', color: '#059669', borderColor: '#86efac', background: '#f0fdf4' }}
                          title="Chat on WhatsApp"
                        >
                          <MessageSquare size={13} />
                        </a>

                        {/* Open 8-Step Lifecycle Dossier */}
                        <button
                          type="button"
                          onClick={() => setSelectedLeadForDetail(lead)}
                          className="btn btn-sm btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                        >
                          <span>8-Step Dossier</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. KANBAN COLUMN VIEW (OPTIONAL ALTERNATIVE)                  */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'kanban' && (
        <div className="kanban-board">
          {stages.map(stage => {
            const stageLeads = filteredLeads.filter(l => l.stage === stage);
            const stageTotal = stageLeads.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);

            return (
              <div key={stage} className="kanban-column">
                <div className="kanban-column-header">
                  <div className="kanban-column-title">
                    <span>{stage}</span>
                    <span className="kanban-count">{stageLeads.length}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#059669' }}>
                    ₹{stageTotal.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Cards list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {stageLeads.length === 0 ? (
                    <div style={{ padding: '30px 10px', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
                      No leads in this stage
                    </div>
                  ) : (
                    stageLeads.map(lead => (
                      <div key={lead.id} className="kanban-card">
                        <div className="flex justify-between items-start">
                          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                            {lead.id}
                          </span>
                          <span className="badge badge-saffron" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                            {lead.leadSource?.channel || lead.source}
                          </span>
                        </div>

                        <div className="kanban-card-title">{lead.name}</div>
                        
                        <div style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: '600' }}>
                          {lead.service}
                        </div>

                        <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div className="flex items-center gap-2">
                            <Phone size={13} />
                            <span>{lead.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User size={13} />
                            <span>{lead.sales?.assignedExecutive || lead.assignedTo || 'Unassigned'}</span>
                          </div>
                        </div>

                        {lead.notes && (
                          <div style={{ fontSize: '0.75rem', background: '#f8fafc', padding: '6px 8px', borderRadius: '4px', color: '#475569', fontStyle: 'italic' }}>
                            "{lead.notes}"
                          </div>
                        )}

                        {/* Bottom Meta & Move Stage Dropdown */}
                        <div className="kanban-card-meta" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                          <div style={{ fontWeight: '800', color: '#0b1727', fontFamily: 'var(--font-mono)' }}>
                            ₹{Number(lead.value || 0).toLocaleString('en-IN')}
                          </div>

                          <select
                            value={lead.stage}
                            onChange={e => updateLeadStage(lead.id, e.target.value)}
                            style={{
                              fontSize: '0.75rem',
                              padding: '3px 6px',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1',
                              background: '#fff',
                              cursor: 'pointer',
                              fontWeight: '600',
                              color: '#334155'
                            }}
                          >
                            {stages.map(s => (
                              <option key={s} value={s}>Move: {s}</option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={() => setSelectedLeadForDetail(lead)}
                          className="btn btn-sm btn-outline w-full"
                          style={{ fontSize: '0.78rem', padding: '5px 8px', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', borderColor: '#ff8f00', color: '#e65100', background: '#fff7ed' }}
                        >
                          <span>8-Step Lifecycle Dossier</span>
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Lead Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', color: '#0b1727' }}>Create New Lead Entry</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Client / Founder Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    className="form-control"
                    value={newLeadForm.name}
                    onChange={e => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      className="form-control"
                      value={newLeadForm.phone}
                      onChange={e => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      placeholder="client@gmail.com"
                      className="form-control"
                      value={newLeadForm.email}
                      onChange={e => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Service Interested In</label>
                  <select
                    className="form-control"
                    value={newLeadForm.service}
                    onChange={e => setNewLeadForm({ ...newLeadForm, service: e.target.value })}
                  >
                    <option value="Private Limited Company Registration">Private Limited Company Registration</option>
                    <option value="PMEGP Govt Loan (35% Capital Subsidy)">PMEGP Govt Loan (35% Subsidy)</option>
                    <option value="Mudra Loan (Tarun Scheme)">Mudra Loan (Tarun Scheme)</option>
                    <option value="GST Registration + 1 Yr Filing">GST Registration + 1 Yr Filing</option>
                    <option value="Trademark (™) Registration">Trademark (™) Registration</option>
                    <option value="FSSAI Food Business License">FSSAI Food Business License</option>
                    <option value="MSME Udyam Govt Registration">MSME Udyam Govt Registration</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Estimated Value (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newLeadForm.value}
                      onChange={e => setNewLeadForm({ ...newLeadForm, value: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Lead Source</label>
                    <select
                      className="form-control"
                      value={newLeadForm.source}
                      onChange={e => setNewLeadForm({ ...newLeadForm, source: e.target.value })}
                    >
                      <option value="Website Form">Website Form</option>
                      <option value="Franchise Partner">Franchise Partner</option>
                      <option value="Google Inbound">Google Inbound</option>
                      <option value="Walk-in Client">Walk-in Client</option>
                      <option value="WhatsApp Direct">WhatsApp Direct</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Notes / Requirement Brief</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Client needs urgent incorporation in Jaipur for GST tender bidding."
                    className="form-control"
                    value={newLeadForm.notes}
                    onChange={e => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>Create Lead</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
