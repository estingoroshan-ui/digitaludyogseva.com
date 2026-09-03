import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Phone, 
  Mail, 
  Calendar, 
  User, 
  IndianRupee, 
  CheckCircle2, 
  ArrowRight,
  Clock
} from 'lucide-react';

export const CrmLeadsKanban = () => {
  const { leads, updateLeadStage, addLead, setSelectedLeadForDetail } = useApp();
  const [search, setSearch] = useState('');
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

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.service.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search)
  );

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

  return (
    <div>
      {/* Top Header & Actions */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#0b1727' }}>Leads Pipeline & Kanban</h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Monitor and advance leads through the sales stages. Drag or select stage to convert.
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <div style={{ position: 'relative', width: '260px' }}>
            <input
              type="text"
              placeholder="Search leads, phone, service..."
              className="form-control"
              style={{ padding: '8px 14px', fontSize: '0.88rem' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} />
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
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
                {stageLeads.map(lead => (
                  <div key={lead.id} className="kanban-card">
                    <div className="flex justify-between items-start">
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                        {lead.id}
                      </span>
                      <span className="badge badge-saffron" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                        {lead.source}
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
                        <span>{lead.assignedTo || 'Unassigned'}</span>
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
                ))}

                {stageLeads.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94a3b8', fontSize: '0.82rem', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
                    No leads in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem' }}>Add New CRM Lead</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label className="form-label">Client Name *</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. Ramesh Kumar"
                      value={newLeadForm.name}
                      onChange={e => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      className="form-control"
                      placeholder="+91 98765 43210"
                      value={newLeadForm.phone}
                      onChange={e => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="ramesh@company.in"
                      value={newLeadForm.email}
                      onChange={e => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Estimated Value (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newLeadForm.value}
                      onChange={e => setNewLeadForm({ ...newLeadForm, value: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label className="form-label">Service Required</label>
                    <select
                      className="form-control"
                      value={newLeadForm.service}
                      onChange={e => setNewLeadForm({ ...newLeadForm, service: e.target.value })}
                    >
                      <option value="Private Limited Company Registration">Private Limited Registration</option>
                      <option value="GST Registration & Filing">GST Registration & Filing</option>
                      <option value="PMEGP Govt Loan (₹25L)">PMEGP Govt Loan</option>
                      <option value="Mudra Loan (Tarun)">Mudra Loan (Tarun)</option>
                      <option value="Trademark (™) Registration">Trademark Registration</option>
                      <option value="FSSAI Food License">FSSAI Food License</option>
                      <option value="Udyam / MSME Registration">Udyam Registration</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Lead Source</label>
                    <select
                      className="form-control"
                      value={newLeadForm.source}
                      onChange={e => setNewLeadForm({ ...newLeadForm, source: e.target.value })}
                    >
                      <option value="Website Form">Website Form</option>
                      <option value="Direct Walk-in">Direct Walk-in</option>
                      <option value="Franchise Partner">Franchise Partner</option>
                      <option value="Google Ads">Google Ads</option>
                      <option value="Referral">Referral</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Assigned Executive</label>
                  <select
                    className="form-control"
                    value={newLeadForm.assignedTo}
                    onChange={e => setNewLeadForm({ ...newLeadForm, assignedTo: e.target.value })}
                  >
                    <option value="Neha Sharma">Neha Sharma (Senior Associate)</option>
                    <option value="Rahul Mehta">Rahul Mehta (Corporate Consultant)</option>
                    <option value="Anil Tyagi">Anil Tyagi (Loan Specialist)</option>
                    <option value="Suresh Patil">Suresh Patil (Tax Analyst)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Case Notes / Requirements</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Enter customer specific discussion details..."
                    value={newLeadForm.notes}
                    onChange={e => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save & Add to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
