import React, { useState } from 'react';
import { Award, Briefcase, FileCheck, CheckCircle2, Clock, Upload, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const Lead360ExternalPortal = () => {
  const { leads, updateExternalTaskStatus, showToast, activeRole } = useApp();

  // Aggregate all external tasks across leads
  const allExternalTasks = leads.flatMap(l => 
    (l.externalTasks || []).map(t => ({ ...t, leadId: l.id, leadName: l.name, leadService: l.service }))
  );

  const [selectedTask, setSelectedTask] = useState(allExternalTasks[0] || null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [fileAttached, setFileAttached] = useState(false);

  const handleDeliverableSubmit = (e) => {
    e.preventDefault();
    if (!selectedTask) return;

    updateExternalTaskStatus(
      selectedTask.leadId,
      selectedTask.id,
      'In_Review',
      submissionNotes || 'Deliverable uploaded and submitted for Admin signoff.',
      'docs/statutory_deliverable_v1.pdf'
    );
    showToast(`Deliverable submitted for review! Admin will verify.`);
    setSubmissionNotes('');
    setFileAttached(false);
  };

  const handleAdminApprove = () => {
    if (!selectedTask) return;
    updateExternalTaskStatus(
      selectedTask.leadId,
      selectedTask.id,
      'Completed',
      'Approved and certified by Admin Desk.',
      selectedTask.submissionFileUrl || 'docs/statutory_deliverable_v1.pdf'
    );
    showToast(`External task #${selectedTask.id} approved and marked completed!`);
  };

  return (
    <div style={{ padding: '4px' }}>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h2 style={{ fontSize: '1.5rem', color: '#0b1727', margin: 0 }}>
              External Partner & Consultant Work Desk (CA / CS / Advocates)
            </h2>
            <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
              Scoped Partner Access
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '4px 0 0' }}>
            External professionals only see their specifically assigned lead tasks and documents. Full customer database remains protected.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Left: Assigned External Tasks List */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
          <h4 style={{ fontSize: '1.05rem', color: '#0b1727', marginBottom: '14px' }}>
            Assigned Case Sub-Tasks ({allExternalTasks.length})
          </h4>

          {allExternalTasks.length === 0 ? (
            <div style={{ padding: '40px 10px', textAlign: 'center', color: '#94a3b8' }}>
              No active outsourced tasks assigned.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {allExternalTasks.map((t, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedTask(t)}
                  style={{
                    background: selectedTask?.id === t.id ? '#f8fafc' : '#fff',
                    border: selectedTask?.id === t.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="badge badge-saffron" style={{ fontSize: '0.7rem' }}>{t.role}</span>
                    <span className={`badge ${t.status === 'Completed' ? 'badge-emerald' : t.status === 'In_Review' ? 'badge-amber' : 'badge-blue'}`} style={{ fontSize: '0.72rem' }}>
                      {t.status}
                    </span>
                  </div>

                  <div style={{ fontWeight: '700', color: '#0b1727', fontSize: '0.95rem' }}>
                    {t.consultantName}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                    Lead Case: <strong>{t.leadName}</strong> ({t.leadService})
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '6px', background: '#f1f5f9', padding: '6px 10px', borderRadius: '6px' }}>
                    <strong>Deliverable:</strong> {t.deliverable}
                  </div>

                  <div className="flex justify-between items-center" style={{ marginTop: '8px', fontSize: '0.78rem' }}>
                    <span style={{ color: '#dc2626', fontWeight: '600' }}>Deadline: {t.deadline}</span>
                    <span style={{ color: '#059669', fontWeight: '700' }}>Agreed Payout: ₹{t.payoutAgreed}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Task Execution, File Upload & Admin Approval */}
        {selectedTask ? (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="badge badge-blue">Task #{selectedTask.id}</span>
                <h4 style={{ fontSize: '1.1rem', color: '#0b1727', margin: '4px 0 0' }}>
                  {selectedTask.deliverable}
                </h4>
              </div>
              <span className="badge badge-emerald">Agreed: ₹{selectedTask.payoutAgreed}</span>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
                Scope & Backoffice Instructions:
              </div>
              <div style={{ fontSize: '0.88rem', color: '#1e293b', marginTop: '4px', lineHeight: '1.5' }}>
                {selectedTask.scope}
              </div>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleDeliverableSubmit}>
              <div className="form-group mb-3">
                <label className="form-label">Consultant Submission Remarks / Findings *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Completed statutory review of MOA objects clause and verified digital signatures..."
                  className="form-control"
                  value={submissionNotes}
                  onChange={e => setSubmissionNotes(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                ></textarea>
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Attach Deliverable Report / Signed PDF</label>
                <div
                  onClick={() => setFileAttached(true)}
                  style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: fileAttached ? '#ecfdf5' : '#f8fafc'
                  }}
                >
                  <Upload size={20} color={fileAttached ? '#059669' : '#64748b'} style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: '0.82rem', fontWeight: '600', color: fileAttached ? '#065f46' : '#475569' }}>
                    {fileAttached ? '✓ Statutory Report Attached (v1.pdf)' : 'Click to Upload Report / Document'}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary flex-1" style={{ padding: '8px' }}>
                  <span>Submit Deliverable for Admin Signoff</span>
                  <ArrowRight size={14} />
                </button>

                {activeRole === 'Admin' && (
                  <button
                    type="button"
                    onClick={handleAdminApprove}
                    className="btn btn-emerald"
                    style={{ padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}
                  >
                    <CheckCircle2 size={14} /> Approve & Pay
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
            Select an outsourced task to view details or submit deliverables.
          </div>
        )}
      </div>
    </div>
  );
};
