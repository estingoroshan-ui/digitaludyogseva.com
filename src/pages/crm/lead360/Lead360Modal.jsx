import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  X, User, Phone, Mail, Calendar, Clock, IndianRupee, CheckCircle2, 
  AlertCircle, TrendingUp, ShieldCheck, FileText, Send, Plus, Share2, 
  Sparkles, ArrowRight, Flame, MessageSquare, Mic, PhoneCall, Bot, 
  Check, Download, Paperclip, Users, Layers, Award, AlertTriangle, Eye
} from 'lucide-react';

import { Lead360VoiceRecorder } from './Lead360VoiceRecorder';
import { Lead360CallManager } from './Lead360CallManager';
import { Lead360AiAssistant } from './Lead360AiAssistant';
import { Lead360EstimateProposal } from './Lead360EstimateProposal';

export const Lead360Modal = () => {
  const { 
    selectedLeadForDetail, 
    setSelectedLeadForDetail,
    updateLeadStage,
    addNoteToLead,
    logCallToLead,
    addVoiceNoteToLead,
    addFollowUpToLead,
    toggleLeadTask,
    addLeadTask,
    saveLeadEstimateAndProposal,
    recordLeadPayment,
    assignExternalTask,
    triggerHumanHandover,
    reassignLeadStaff,
    convertLeadToCustomerAndProject,
    leadStages,
    externalConsultants,
    showToast,
    activeRole
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');

  // Form states for in-tab quick actions
  const [newNoteInput, setNewNoteInput] = useState('');
  const [newFollowupDate, setNewFollowupDate] = useState('');
  const [newFollowupNotes, setNewFollowupNotes] = useState('');
  const [newFollowupType, setNewFollowupType] = useState('Phone Call');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [reassignStaffName, setReassignStaffName] = useState('');
  const [reassignReason, setReassignReason] = useState('');
  const [showReassignModal, setShowReassignModal] = useState(false);

  // Payment form state
  const [payAmount, setPayAmount] = useState('');
  const [payMode, setPayMode] = useState('UPI (Google Pay)');
  const [payUtr, setPayUtr] = useState('');
  const [payType, setPayType] = useState('Token_Advance');

  // External task form state
  const [extConsultantName, setExtConsultantName] = useState(externalConsultants[0]?.name || 'CS Priya Nair (FCS 8921)');
  const [extRole, setExtRole] = useState('Company Secretary');
  const [extScope, setExtScope] = useState('');
  const [extDeliverable, setExtDeliverable] = useState('');
  const [extPayout, setExtPayout] = useState(1500);

  if (!selectedLeadForDetail) return null;
  const lead = selectedLeadForDetail;

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    addNoteToLead(lead.id, newNoteInput);
    setNewNoteInput('');
  };

  const handleAddFollowup = (e) => {
    e.preventDefault();
    if (!newFollowupDate || !newFollowupNotes.trim()) return;
    addFollowUpToLead(lead.id, {
      date: newFollowupDate,
      time: '11:00 AM',
      type: newFollowupType,
      notes: newFollowupNotes
    });
    setNewFollowupDate('');
    setNewFollowupNotes('');
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addLeadTask(lead.id, {
      title: newTaskTitle,
      type: 'General',
      priority: 'Medium',
      dueDate: 'Today'
    });
    setNewTaskTitle('');
  };

  const handleRecordPaymentSubmit = (e) => {
    e.preventDefault();
    if (!payAmount) return;
    recordLeadPayment(lead.id, {
      amount: Number(payAmount),
      mode: payMode,
      utrNo: payUtr || `UPI/${Date.now().toString().slice(-10)}`,
      type: payType
    });
    setPayAmount('');
    setPayUtr('');
  };

  const handleAssignExternalSubmit = (e) => {
    e.preventDefault();
    if (!extScope.trim() || !extDeliverable.trim()) return;
    assignExternalTask(lead.id, {
      consultantName: extConsultantName,
      role: extRole,
      scope: extScope,
      deliverable: extDeliverable,
      payoutAgreed: extPayout
    });
    setExtScope('');
    setExtDeliverable('');
  };

  const handleReassignSubmit = (e) => {
    e.preventDefault();
    if (!reassignStaffName) return;
    reassignLeadStaff(lead.id, reassignStaffName, reassignReason || 'Manager workload rebalance');
    setShowReassignModal(false);
    setReassignStaffName('');
    setReassignReason('');
  };

  const tabs = [
    { id: 'overview', label: '1. Overview' },
    { id: 'notes', label: `2. Notes (${lead.notes?.length || 0})` },
    { id: 'calls', label: `3. Calls (${lead.calls?.length || 0})` },
    { id: 'voice_notes', label: `4. Voice-to-CRM (${lead.voiceNotes?.length || 0})` },
    { id: 'ai_assistant', label: '5. AI Assistant & Summary' },
    { id: 'estimates_proposals', label: `6. Quotes & Proposals (${(lead.proposals?.length || 0) + (lead.estimates?.length || 0)})` },
    { id: 'followups', label: `7. Follow-ups (${lead.followUps?.length || 0})` },
    { id: 'tasks', label: `8. Tasks (${lead.tasks?.length || 0})` },
    { id: 'documents', label: `9. Documents Vault (${lead.documents?.length || 0})` },
    { id: 'payments', label: `10. Payments (${lead.payments?.length || 0})` },
    { id: 'external_work', label: `11. External CA/CS (${lead.externalTasks?.length || 0})` },
    { id: 'timeline', label: `12. Activity Timeline (${lead.activities?.length || 0})` },
    { id: 'audit_logs', label: `13. Audit Trail (${lead.auditLogs?.length || 0})` }
  ];

  return (
    <div className="modal-overlay" onClick={() => setSelectedLeadForDetail(null)}>
      <div 
        className="modal-card" 
        style={{ maxWidth: '1080px', padding: 0, overflow: 'hidden', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Top 360° Lead Dossier Header Strip */}
        <div style={{ background: 'linear-gradient(135deg, #0b1727, #1e293b)', color: '#fff', padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex justify-between items-start flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="badge badge-saffron" style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                  {lead.leadCode || lead.id}
                </span>
                <span className="badge badge-blue" style={{ fontSize: '0.75rem' }}>
                  Source: {lead.leadSource?.channel || lead.source || 'Website'}
                </span>
                <span className="badge badge-rose" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Flame size={12} /> {lead.leadScore || 85}% Intent (Hot)
                </span>
                <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                  Assigned RM: {lead.sales?.assignedExecutive || 'Neha Sharma'}
                </span>
              </div>

              <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: '6px 0 2px' }}>{lead.name}</h2>
              <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                {lead.businessName || 'Business Profile In Verification'} • 📍 {lead.district || lead.city || 'Jaipur'}, {lead.state || 'Rajasthan'}
              </div>

              <div className="flex items-center gap-4 flex-wrap" style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '6px' }}>
                <span className="flex items-center gap-1"><Phone size={13} color="#4ade80" /> {lead.phone}</span>
                <span className="flex items-center gap-1"><Mail size={13} /> {lead.email}</span>
                <span className="flex items-center gap-1" style={{ color: '#f59e0b', fontWeight: '700' }}>
                  💼 {lead.service}
                </span>
                <span className="flex items-center gap-1" style={{ color: '#4ade80', fontWeight: '700' }}>
                  <IndianRupee size={13} /> Deal: ₹{Number(lead.value).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/91${lead.phone.replace(/[^0-9]/g, '').slice(-10)}?text=Namaste%20${encodeURIComponent(lead.name)},%20greetings%20from%20Digital%20Udyog%20Seva%20regarding%20${encodeURIComponent(lead.service)}.`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm"
                style={{ background: '#059669', color: '#fff', padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                title="Open WhatsApp chat"
              >
                <MessageSquare size={14} /> WhatsApp
              </a>

              {/* Reassign Button */}
              <button
                type="button"
                onClick={() => setShowReassignModal(true)}
                className="btn btn-sm btn-outline-white"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                <Users size={13} /> Reassign
              </button>

              {/* Convert to Customer & Launch Project */}
              <button
                type="button"
                onClick={() => convertLeadToCustomerAndProject(lead.id)}
                className="btn btn-sm btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.82rem', background: 'linear-gradient(135deg, #ff6f00, #ea580c)' }}
              >
                <Sparkles size={14} /> Convert to Customer 🚀
              </button>

              {/* Close Button */}
              <button 
                onClick={() => setSelectedLeadForDetail(null)} 
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* 13-Tab Navigation Bar */}
        <div style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1', display: 'flex', overflowX: 'auto', padding: '2px 14px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #ff6f00' : '3px solid transparent',
                color: activeTab === tab.id ? '#ff6f00' : '#475569',
                fontWeight: activeTab === tab.id ? '700' : '600',
                padding: '10px 12px',
                fontSize: '0.82rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body Contents */}
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                  <small style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase' }}>Pipeline Stage</small>
                  <div style={{ marginTop: '4px' }}>
                    <select
                      value={lead.stage}
                      onChange={e => updateLeadStage(lead.id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: '700', fontSize: '0.85rem' }}
                    >
                      {leadStages.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                  <small style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase' }}>Next Scheduled Action</small>
                  <div style={{ fontWeight: '700', color: '#0b1727', fontSize: '0.92rem', marginTop: '4px' }}>
                    {lead.nextFollowup || 'Today, 04:00 PM'}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                  <small style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase' }}>Assigned Officer</small>
                  <div style={{ fontWeight: '700', color: '#2563eb', fontSize: '0.92rem', marginTop: '4px' }}>
                    {lead.sales?.assignedExecutive || 'Neha Sharma'}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                  <small style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase' }}>Deal Value (Taxable)</small>
                  <div style={{ fontWeight: '800', color: '#059669', fontSize: '1.1rem', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    ₹{Number(lead.value).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Business & Requirement Detail */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.98rem', color: '#0b1727', margin: '0 0 10px 0' }}>Client Business & Requirement Profile</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.88rem' }}>
                  <div><strong>Legal / Trade Name:</strong> {lead.businessName || `${lead.name} Enterprises`}</div>
                  <div><strong>Business Type:</strong> {lead.businessType || 'MSME Enterprise'}</div>
                  <div><strong>Selected Service:</strong> <span style={{ color: '#2563eb', fontWeight: '600' }}>{lead.service}</span></div>
                  <div><strong>Location:</strong> {lead.district || lead.city}, {lead.state}</div>
                </div>
                <div style={{ marginTop: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '10px', fontSize: '0.85rem', color: '#475569' }}>
                  <strong>Requirement Brief:</strong> {lead.requirement || 'Client looking for statutory compliance.'}
                </div>
              </div>

              {/* Embed AI Summary Widget on Overview */}
              <div style={{ background: '#fff', border: '1px solid #fed7aa', borderRadius: '12px', padding: '16px' }}>
                <div className="flex justify-between items-center mb-2">
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#9a3412', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={16} /> AI Assistant Recommendation:
                  </span>
                  <button onClick={() => setActiveTab('ai_assistant')} className="btn btn-sm btn-outline" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
                    Open Full AI Desk
                  </button>
                </div>
                <div style={{ fontSize: '0.88rem', color: '#7c2d12', lineHeight: '1.5' }}>
                  {lead.aiSummary?.recommendedNextAction || 'Send formal quotation and schedule discovery follow-up.'}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NOTES */}
          {activeTab === 'notes' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 style={{ fontSize: '1.05rem', color: '#0b1727', margin: 0 }}>Internal Staff Notes</h4>
                <span className="badge badge-blue">{lead.notes?.length || 0} Notes Saved</span>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="mb-4">
                <div className="form-group mb-2">
                  <textarea
                    rows={3}
                    required
                    placeholder="Write internal staff note e.g. 'Client agreed on price, documents verified'..."
                    className="form-control"
                    value={newNoteInput}
                    onChange={e => setNewNoteInput(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Plus size={14} /> Add Internal Note
                </button>
              </form>

              {/* Notes List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(lead.notes || []).map((n, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
                    <div className="flex justify-between items-center mb-1">
                      <strong style={{ fontSize: '0.85rem', color: '#2563eb' }}>{n.author}</strong>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{n.date}</span>
                    </div>
                    <p style={{ margin: 0, color: '#1e293b', fontSize: '0.88rem', lineHeight: '1.4' }}>{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CALLS */}
          {activeTab === 'calls' && (
            <Lead360CallManager 
              lead={lead} 
              onCallLogged={(callData) => logCallToLead(lead.id, callData)} 
            />
          )}

          {/* TAB 4: VOICE NOTES (VOICE TO CRM) */}
          {activeTab === 'voice_notes' && (
            <div>
              <Lead360VoiceRecorder 
                lead={lead} 
                onVoiceProcessed={(vData) => addVoiceNoteToLead(lead.id, vData)} 
              />

              {/* Voice Notes History */}
              {(lead.voiceNotes || []).length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h5 style={{ fontSize: '0.92rem', color: '#0b1727', marginBottom: '10px' }}>
                    Historical Voice Memos ({lead.voiceNotes.length})
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {lead.voiceNotes.map((vn, idx) => (
                      <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>Voice Memo ({vn.durationSeconds}s)</span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>By: {vn.staffName} • {vn.createdAt}</span>
                        </div>
                        <div style={{ fontSize: '0.88rem', color: '#1e293b', fontStyle: 'italic', margin: '6px 0' }}>
                          "{vn.transcript}"
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: '600' }}>
                          ✓ AI Extracted: {vn.aiExtractedIntent} ({vn.aiExtractedService})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: AI ASSISTANT */}
          {activeTab === 'ai_assistant' && (
            <Lead360AiAssistant 
              lead={lead} 
              onTriggerHandover={(reason) => triggerHumanHandover(lead.id, reason)} 
            />
          )}

          {/* TAB 6: ESTIMATES & PROPOSALS */}
          {activeTab === 'estimates_proposals' && (
            <Lead360EstimateProposal 
              lead={lead} 
              onSaveEstimateProposal={(payload) => saveLeadEstimateAndProposal(lead.id, payload)} 
              showToast={showToast} 
            />
          )}

          {/* TAB 7: FOLLOW-UPS */}
          {activeTab === 'followups' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 style={{ fontSize: '1.05rem', color: '#0b1727', margin: 0 }}>Autopilot Follow-up Schedule</h4>
                <span className="badge badge-amber">{lead.followUps?.length || 0} Scheduled / Completed</span>
              </div>

              {/* Schedule Follow-up Form */}
              <form onSubmit={handleAddFollowup} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label className="form-label">Follow-up Date *</label>
                    <input type="date" required className="form-control" value={newFollowupDate} onChange={e => setNewFollowupDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Type / Channel</label>
                    <select className="form-control" value={newFollowupType} onChange={e => setNewFollowupType(e.target.value)}>
                      <option value="Phone Call">Phone Call</option>
                      <option value="WhatsApp Follow-up">WhatsApp Follow-up</option>
                      <option value="Video Call">Video Call</option>
                      <option value="Office Meeting">Office Meeting</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Agenda / Remarks *</label>
                    <input type="text" required placeholder="e.g. Call to confirm advance payment..." className="form-control" value={newFollowupNotes} onChange={e => setNewFollowupNotes(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Plus size={14} /> Schedule Follow-up
                </button>
              </form>

              {/* List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(lead.followUps || []).map((f, idx) => (
                  <div key={idx} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-saffron" style={{ fontSize: '0.7rem' }}>{f.type}</span>
                        <strong style={{ fontSize: '0.9rem' }}>{f.date} {f.time ? `at ${f.time}` : ''}</strong>
                      </div>
                      <p style={{ margin: '4px 0 0', color: '#475569', fontSize: '0.85rem' }}>"{f.notes}"</p>
                    </div>
                    <span className={`badge ${f.status === 'Completed' ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.72rem' }}>
                      {f.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: TASKS */}
          {activeTab === 'tasks' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 style={{ fontSize: '1.05rem', color: '#0b1727', margin: 0 }}>Action Items & Tasks Checklist</h4>
                <span className="badge badge-blue">{lead.tasks?.length || 0} Tasks</span>
              </div>

              {/* Quick Add Task Form */}
              <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="+ Add new task e.g. 'Collect electricity bill NOC'..."
                  className="form-control"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                />
                <button type="submit" className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>
                  <Plus size={14} /> Add Task
                </button>
              </form>

              {/* Task Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(lead.tasks || []).map((t, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleLeadTask(lead.id, t.id)}
                    style={{
                      background: t.status === 'Completed' ? '#f0fdf4' : '#fff',
                      border: t.status === 'Completed' ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={t.status === 'Completed'}
                        onChange={() => {}}
                        style={{ width: '16px', height: '16px', accentColor: '#10b981', cursor: 'pointer' }}
                      />
                      <span style={{ textDecoration: t.status === 'Completed' ? 'line-through' : 'none', color: t.status === 'Completed' ? '#059669' : '#1e293b', fontSize: '0.88rem', fontWeight: '500' }}>
                        {t.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>Due: {t.dueDate || 'Today'}</span>
                      {t.isAutoGenerated && <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>Autopilot</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: '#0b1727', margin: 0 }}>Lead Document Vault</h4>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '2px 0 0' }}>
                    Uploaded documents persist permanently and transfer automatically to Customer 360 upon conversion.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Document upload dialog triggered.')}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} /> Upload Document
                </button>
              </div>

              {(lead.documents || []).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 10px', color: '#94a3b8' }}>
                  No documents uploaded on this lead yet.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                  {lead.documents.map((doc, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="badge badge-saffron" style={{ fontSize: '0.7rem' }}>{doc.category}</span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{doc.version || 'v1.0'}</span>
                      </div>
                      <div style={{ fontWeight: '700', color: '#0b1727', fontSize: '0.92rem', marginTop: '4px' }}>
                        {doc.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                        Uploaded: {doc.date} by {doc.uploadedBy}
                      </div>
                      {doc.remarks && (
                        <div style={{ fontSize: '0.78rem', color: '#059669', background: '#ecfdf5', padding: '4px 8px', borderRadius: '4px', marginTop: '6px' }}>
                          ✓ {doc.remarks}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 10: PAYMENTS */}
          {activeTab === 'payments' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 style={{ fontSize: '1.05rem', color: '#0b1727', margin: 0 }}>Advance, Token & Eligibility Payments</h4>
              </div>

              {/* Record Payment Form */}
              <form onSubmit={handleRecordPaymentSubmit} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
                <h5 style={{ fontSize: '0.9rem', color: '#0b1727', margin: '0 0 10px 0' }}>+ Record Payment Credit</h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.5fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label className="form-label">Amount (₹) *</label>
                    <input type="number" required placeholder="e.g. 3000" className="form-control" value={payAmount} onChange={e => setPayAmount(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Payment Type</label>
                    <select className="form-control" value={payType} onChange={e => setPayType(e.target.value)}>
                      <option value="Token_Advance">Token Advance</option>
                      <option value="Eligibility_Fee">Eligibility Fee</option>
                      <option value="Full_Payment">Full Settlement</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Mode</label>
                    <select className="form-control" value={payMode} onChange={e => setPayMode(e.target.value)}>
                      <option value="UPI (Google Pay)">UPI (GPay / PhonePe)</option>
                      <option value="NEFT / Netbanking">NEFT / Netbanking</option>
                      <option value="Cash Receipt">Cash Office Receipt</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">UTR / Reference No.</label>
                    <input type="text" placeholder="UPI/38291..." className="form-control" value={payUtr} onChange={e => setPayUtr(e.target.value)} />
                  </div>
                </div>

                <div style={{ background: '#ecfdf5', padding: '8px 12px', borderRadius: '6px', fontSize: '0.78rem', color: '#065f46', marginBottom: '10px' }}>
                  ✓ Customer T&C and Non-refundable Eligibility Policy Consent Automatically Recorded.
                </div>

                <button type="submit" className="btn btn-primary btn-sm">
                  <CheckCircle2 size={14} /> Confirm & Generate Official Money Receipt
                </button>
              </form>

              {/* Payment History List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(lead.payments || []).map((pay, idx) => (
                  <div key={idx} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-emerald">{pay.receiptNo}</span>
                        <strong style={{ fontSize: '0.95rem', color: '#0b1727' }}>₹{Number(pay.amount).toLocaleString('en-IN')}</strong>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>({pay.type})</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '3px' }}>
                        Mode: <strong>{pay.paymentMode}</strong> • UTR: <span style={{ fontFamily: 'var(--font-mono)' }}>{pay.transactionRef}</span> • Date: {pay.date}
                      </div>
                    </div>
                    <span className="badge badge-emerald">Verified & Credited</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: EXTERNAL CA/CS DELEGATION */}
          {activeTab === 'external_work' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: '#0b1727', margin: 0 }}>Third-Party / CA / CS / Advocate Task Delegation</h4>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '2px 0 0' }}>
                    Assign external experts with scoped task access. External professionals cannot view full database.
                  </p>
                </div>
              </div>

              {/* Delegate Sub-task Form */}
              <form onSubmit={handleAssignExternalSubmit} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                <h5 style={{ fontSize: '0.9rem', color: '#0b1727', margin: '0 0 10px 0' }}>+ Assign Sub-Task to Verified Professional</h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label className="form-label">Select External Partner</label>
                    <select className="form-control" value={extConsultantName} onChange={e => setExtConsultantName(e.target.value)}>
                      {externalConsultants.map(c => (
                        <option key={c.id} value={c.name}>{c.name} ({c.role})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Professional Role</label>
                    <select className="form-control" value={extRole} onChange={e => setExtRole(e.target.value)}>
                      <option value="Company Secretary">Company Secretary</option>
                      <option value="Chartered Accountant">Chartered Accountant</option>
                      <option value="Advocate">High Court Advocate</option>
                      <option value="Valuer">Chartered Valuer</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Agreed Payout (₹)</label>
                    <input type="number" className="form-control" value={extPayout} onChange={e => setExtPayout(Number(e.target.value))} />
                  </div>
                </div>

                <div className="form-group mb-2">
                  <label className="form-label">Required Deliverable *</label>
                  <input type="text" required placeholder="e.g. Approved MOA Main Objects & SPICe+ Part B signoff" className="form-control" value={extDeliverable} onChange={e => setExtDeliverable(e.target.value)} />
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Scope & Instructions</label>
                  <textarea rows={2} required placeholder="Detailed instructions for the consultant..." className="form-control" value={extScope} onChange={e => setExtScope(e.target.value)}></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-sm">
                  <Plus size={14} /> Assign Sub-Task
                </button>
              </form>

              {/* List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(lead.externalTasks || []).map((t, idx) => (
                  <div key={idx} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="badge badge-purple">{t.role}</span>
                      <span className="badge badge-emerald">Payout: ₹{t.payoutAgreed}</span>
                    </div>
                    <div style={{ fontWeight: '700', color: '#0b1727', fontSize: '0.92rem' }}>
                      {t.consultantName}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '4px' }}>
                      <strong>Deliverable:</strong> {t.deliverable}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                      Status: <strong>{t.status}</strong> • Deadline: {t.deadline}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 12: ACTIVITY TIMELINE */}
          {activeTab === 'timeline' && (
            <div>
              <h4 style={{ fontSize: '1.05rem', color: '#0b1727', marginBottom: '14px' }}>
                Complete Immutable Activity Ledger ({lead.activities?.length || 0})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(lead.activities || []).map((act, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff6f00', marginTop: '6px' }}></div>
                    <div style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px' }}>
                      <div className="flex justify-between items-center">
                        <strong style={{ fontSize: '0.88rem', color: '#0b1727' }}>{act.title}</strong>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{act.time}</span>
                      </div>
                      <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#475569' }}>{act.desc}</p>
                      <div style={{ fontSize: '0.72rem', color: '#2563eb', marginTop: '4px' }}>By: {act.staff}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 13: AUDIT LOGS */}
          {activeTab === 'audit_logs' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 style={{ fontSize: '1.05rem', color: '#0b1727', margin: 0 }}>Price, Discount & Security Audit Trail</h4>
                <span className="badge badge-emerald">Audited</span>
              </div>
              <table className="data-table">
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th>Action</th>
                    <th>Field</th>
                    <th>Old Value → New Value</th>
                    <th>User</th>
                    <th>Reason</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {(lead.auditLogs || []).map((a, idx) => (
                    <tr key={idx}>
                      <td><span className="badge badge-saffron">{a.action}</span></td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{a.field}</td>
                      <td style={{ fontWeight: '600' }}>{a.oldVal} → {a.newVal}</td>
                      <td>{a.user}</td>
                      <td style={{ fontSize: '0.8rem', color: '#475569' }}>{a.reason}</td>
                      <td style={{ fontSize: '0.75rem', color: '#64748b' }}>{a.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reassign Staff Modal Overlay */}
      {showReassignModal && (
        <div className="modal-overlay" style={{ zIndex: 1001 }} onClick={() => setShowReassignModal(false)}>
          <div className="modal-card" style={{ maxWidth: '450px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4 style={{ margin: 0 }}>Reassign Lead Officer</h4>
              <button onClick={() => setShowReassignModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleReassignSubmit}>
              <div className="modal-body">
                <div className="form-group mb-3">
                  <label className="form-label">Select New Assigned Executive *</label>
                  <select
                    required
                    className="form-control"
                    value={reassignStaffName}
                    onChange={e => setReassignStaffName(e.target.value)}
                  >
                    <option value="">-- Choose Staff Officer --</option>
                    <option value="Neha Sharma">Neha Sharma (Corporate Lead)</option>
                    <option value="Anil Tyagi">Anil Tyagi (Loan Specialist)</option>
                    <option value="Suresh Patil">Suresh Patil (Taxation Lead)</option>
                    <option value="Rahul Mehta">Rahul Mehta (Field Relationship Officer)</option>
                    <option value="Pooja Verma">Pooja Verma (Inbound Telecaller)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Reason for Reassignment *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Workload balancing or specialized advice..."
                    className="form-control"
                    value={reassignReason}
                    onChange={e => setReassignReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowReassignModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm Reassign & Log Audit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
