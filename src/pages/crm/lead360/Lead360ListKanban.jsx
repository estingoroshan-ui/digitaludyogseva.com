import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  Plus, Search, Filter, Phone, Mail, Calendar, User, IndianRupee, 
  CheckCircle2, ArrowRight, Clock, Table as TableIcon, Kanban as KanbanIcon, 
  Flame, Send, Sparkles, ExternalLink, MessageSquare, Mic, Play, RefreshCw
} from 'lucide-react';

export const Lead360ListKanban = () => {
  const { 
    leads, 
    updateLeadStage, 
    addLead, 
    setSelectedLeadForDetail, 
    convertLeadToCustomerAndProject, 
    leadStages, 
    leadSources,
    showToast 
  } = useApp();

  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'
  const [selectedStageFilter, setSelectedStageFilter] = useState('All');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Private Limited Company Registration',
    value: 7499,
    source: 'Google PPC Search Ads',
    district: 'Jaipur',
    state: 'Rajasthan',
    businessName: '',
    notes: ''
  });

  // Filtered Leads
  const filteredLeads = leads.filter(l => {
    const term = search.toLowerCase();
    const matchesSearch = 
      l.name.toLowerCase().includes(term) ||
      (l.service && l.service.toLowerCase().includes(term)) ||
      (l.phone && l.phone.includes(term)) ||
      (l.id && l.id.toLowerCase().includes(term)) ||
      (l.leadCode && l.leadCode.toLowerCase().includes(term)) ||
      (l.district && l.district.toLowerCase().includes(term));

    const matchesStage = selectedStageFilter === 'All' || l.stage === selectedStageFilter;
    const matchesSource = selectedSourceFilter === 'All' || (l.leadSource?.channel || l.source) === selectedSourceFilter;
    return matchesSearch && matchesStage && matchesSource;
  });

  const handleCreateLead = (e) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.phone) return;

    const created = addLead(newLeadForm);
    setShowAddModal(false);
    setNewLeadForm({
      name: '',
      phone: '',
      email: '',
      service: 'Private Limited Company Registration',
      value: 7499,
      source: 'Google PPC Search Ads',
      district: 'Jaipur',
      state: 'Rajasthan',
      businessName: '',
      notes: ''
    });
    setSelectedLeadForDetail(created);
  };

  return (
    <div>
      {/* Autopilot Principle Live Simulation Bar */}
      <div style={{ background: 'linear-gradient(90deg, #fff7ed, #ecfdf5)', border: '1px solid #fed7aa', borderRadius: '12px', padding: '14px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div className="flex items-center gap-3">
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ff6f00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={18} />
          </div>
          <div>
            <strong style={{ color: '#0b1727', fontSize: '0.95rem' }}>360° Autopilot Principle Active</strong>
            <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
              Inbound Lead → Auto Attribution → AI Response → Voice-to-CRM → Quotes → Eligibility → 1-Click Convert
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const testLead = leads[0];
              if (testLead) {
                setSelectedLeadForDetail(testLead);
                showToast(`Opened 360° Dossier for ${testLead.name}! Test any tab or voice memo.`);
              }
            }}
            className="btn btn-sm btn-primary"
            style={{ fontSize: '0.8rem', padding: '6px 14px', background: '#0b1727' }}
          >
            <Play size={13} fill="#fff" />
            <span>Test Autopilot on Lead #LD-101</span>
          </button>
        </div>
      </div>

      {/* Top Header & Easy Controls */}
      <div className="flex justify-between items-center mb-5 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 style={{ fontSize: '1.5rem', color: '#0b1727', margin: 0 }}>Lead 360° Management Hub</h2>
            <span className="badge badge-saffron" style={{ fontSize: '0.75rem' }}>
              {leads.length} Total Leads
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>
            Complete 360° Lead Management with AI, Voice-to-CRM, Auto-Assignment, In-App Calls & Autopilot Conversion.
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
              <span>Pipeline Kanban</span>
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '260px' }}>
            <input
              type="text"
              placeholder="Search by ID, name, phone, city..."
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
            <span>+ Ingest New Lead</span>
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
            padding: '5px 12px',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: selectedStageFilter === 'All' ? '700' : '600',
            background: selectedStageFilter === 'All' ? '#0b1727' : '#f1f5f9',
            color: selectedStageFilter === 'All' ? '#fff' : '#475569'
          }}
        >
          All ({leads.length})
        </button>

        {leadStages.slice(0, 8).map(st => {
          const count = leads.filter(l => l.stage === st.name).length;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setSelectedStageFilter(st.name)}
              style={{
                padding: '5px 12px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: selectedStageFilter === st.name ? '700' : '600',
                background: selectedStageFilter === st.name ? '#ff6f00' : '#f1f5f9',
                color: selectedStageFilter === st.name ? '#fff' : '#475569'
              }}
            >
              {st.name} ({count})
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. EASY LIST / TABLE VIEW                                     */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'table' && (
        <div className="table-wrapper" style={{ boxShadow: 'var(--shadow-sm)', borderRadius: '12px' }}>
          <table className="data-table">
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ width: '90px' }}>Lead ID</th>
                <th>Prospect / Contact</th>
                <th>Service Requested</th>
                <th>Deal Value</th>
                <th>Source & Channel</th>
                <th>Stage & Quick Advance</th>
                <th>Assigned Officer</th>
                <th style={{ textAlign: 'right' }}>360° Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    No leads found matching your search query or filter.
                  </td>
                </tr>
              ) : (
                filteredLeads.map(lead => (
                  <tr key={lead.id} style={{ transition: 'background-color 0.15s' }}>
                    {/* Lead ID */}
                    <td>
                      <div style={{ fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#ff6f00' }}>
                        {lead.leadCode || lead.id}
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
                        {lead.district && (
                          <span>📍 {lead.district}, {lead.state}</span>
                        )}
                      </div>
                    </td>

                    {/* Service */}
                    <td>
                      <div style={{ fontWeight: '600', color: '#2563eb', fontSize: '0.9rem' }}>
                        {lead.service}
                      </div>
                      <small style={{ color: '#e11d48', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                        <Flame size={12} /> {lead.leadScore || 85}% Intent Score
                      </small>
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
                        {leadStages.map(s => (
                          <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </td>

                    {/* Assigned To */}
                    <td>
                      <div className="flex items-center gap-2">
                        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#ff6f00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '700' }}>
                          {(lead.sales?.assignedExecutive || 'N').charAt(0)}
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
                          {lead.sales?.assignedExecutive || 'Neha Sharma'}
                        </span>
                      </div>
                    </td>

                    {/* Quick Action Buttons */}
                    <td style={{ textAlign: 'right' }}>
                      <div className="flex items-center gap-2 justify-end">
                        {/* WhatsApp Direct */}
                        <a
                          href={`https://wa.me/91${lead.phone.replace(/[^0-9]/g, '').slice(-10)}?text=Namaste%20${encodeURIComponent(lead.name)},%20greetings%20from%20Digital%20Udyog%20Seva%20regarding%20${encodeURIComponent(lead.service)}.`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline"
                          style={{ padding: '6px 9px', color: '#059669', borderColor: '#86efac', background: '#f0fdf4' }}
                          title="Chat on WhatsApp"
                        >
                          <MessageSquare size={13} />
                        </a>

                        {/* Open 360° Dossier */}
                        <button
                          type="button"
                          onClick={() => setSelectedLeadForDetail(lead)}
                          className="btn btn-sm btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                        >
                          <span>360° Dossier</span>
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
      {/* 2. KANBAN COLUMN VIEW                                         */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'kanban' && (
        <div className="kanban-board" style={{ overflowX: 'auto', display: 'flex', gap: '16px', paddingBottom: '16px' }}>
          {leadStages.slice(0, 8).map(stage => {
            const stageLeads = filteredLeads.filter(l => l.stage === stage.name);
            const stageTotal = stageLeads.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);

            return (
              <div key={stage.id} className="kanban-column" style={{ minWidth: '280px' }}>
                <div className="kanban-column-header">
                  <div className="kanban-column-title">
                    <span>{stage.name}</span>
                    <span className="kanban-count">{stageLeads.length}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#059669' }}>
                    ₹{stageTotal.toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {stageLeads.length === 0 ? (
                    <div style={{ padding: '30px 10px', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
                      No leads in {stage.name}
                    </div>
                  ) : (
                    stageLeads.map(lead => (
                      <div key={lead.id} className="kanban-card">
                        <div className="flex justify-between items-start">
                          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                            {lead.leadCode || lead.id}
                          </span>
                          <span className="badge badge-saffron" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                            {lead.leadSource?.channel || lead.source}
                          </span>
                        </div>

                        <div className="kanban-card-title">{lead.name}</div>
                        <div style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: '600' }}>
                          {lead.service}
                        </div>

                        <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <div className="flex items-center gap-2">
                            <Phone size={12} />
                            <span>{lead.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User size={12} />
                            <span>{lead.sales?.assignedExecutive || 'Neha Sharma'}</span>
                          </div>
                        </div>

                        <div className="kanban-card-meta" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                          <div style={{ fontWeight: '800', color: '#0b1727', fontFamily: 'var(--font-mono)' }}>
                            ₹{Number(lead.value || 0).toLocaleString('en-IN')}
                          </div>

                          <select
                            value={lead.stage}
                            onChange={e => updateLeadStage(lead.id, e.target.value)}
                            style={{
                              fontSize: '0.72rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1',
                              background: '#fff',
                              cursor: 'pointer'
                            }}
                          >
                            {leadStages.map(s => (
                              <option key={s.id} value={s.name}>Move: {s.name}</option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={() => setSelectedLeadForDetail(lead)}
                          className="btn btn-sm btn-outline w-full"
                          style={{ fontSize: '0.78rem', padding: '5px 8px', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', borderColor: '#ff8f00', color: '#e65100', background: '#fff7ed' }}
                        >
                          <span>Open 360° Lead Dossier</span>
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
              <h3 style={{ fontSize: '1.25rem', color: '#0b1727' }}>Ingest New Lead into Autopilot CRM</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead}>
              <div className="modal-body">
                <div className="form-group mb-3">
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Phone / Mobile Number *</label>
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

                <div className="form-group mb-3">
                  <label className="form-label">Service Interested In</label>
                  <select
                    className="form-control"
                    value={newLeadForm.service}
                    onChange={e => setNewLeadForm({ ...newLeadForm, service: e.target.value })}
                  >
                    <option value="Private Limited Company Registration">Private Limited Company Registration</option>
                    <option value="PMEGP Govt Loan (35% Capital Subsidy)">PMEGP Govt Loan (35% Subsidy)</option>
                    <option value="Mudra Loan (Tarun Scheme)">Mudra Loan (Tarun Scheme)</option>
                    <option value="GST Registration + 1 Yr Return Filing">GST Registration + 1 Yr Return</option>
                    <option value="Trademark Registration (™) Form TM-A">Trademark (™) Registration</option>
                    <option value="FSSAI Food Business License">FSSAI Food Business License</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Estimated Deal Value (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newLeadForm.value}
                      onChange={e => setNewLeadForm({ ...newLeadForm, value: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Lead Inbound Source</label>
                    <select
                      className="form-control"
                      value={newLeadForm.source}
                      onChange={e => setNewLeadForm({ ...newLeadForm, source: e.target.value })}
                    >
                      {leadSources.map(s => (
                        <option key={s.id} value={s.name}>{s.name} ({s.category})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Requirement Brief & Initial Notes</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Urgent registration needed for government tender."
                    className="form-control"
                    value={newLeadForm.notes}
                    onChange={e => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  ></textarea>
                </div>

                <div style={{ background: '#ecfdf5', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', color: '#065f46', marginTop: '12px' }}>
                  ✓ <strong>Autopilot Preview:</strong> Source attributed, auto-assigned by rule, AI WhatsApp response scheduled.
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
                  <span>Ingest Lead & Open 360° Dossier</span>
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
