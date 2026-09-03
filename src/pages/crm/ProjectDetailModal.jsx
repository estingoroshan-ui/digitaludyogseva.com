import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Briefcase, 
  FileText, 
  CheckSquare, 
  Clock, 
  MapPin, 
  User, 
  Building, 
  Award, 
  CheckCircle2, 
  Calendar, 
  PackageCheck, 
  Send,
  AlertCircle,
  Truck
} from 'lucide-react';

export const ProjectDetailModal = () => {
  const { 
    selectedProjectForDetail, 
    setSelectedProjectForDetail, 
    toggleProjectTask, 
    updateProjectStatus, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'requirement' | 'documents' | 'process' | 'tasks' | 'timeline' | 'completion'

  if (!selectedProjectForDetail) return null;
  const proj = selectedProjectForDetail;

  const statuses = [
    'Initiated',
    'Document Review',
    'Govt Submission (In Review)',
    'Processing in Department',
    'Query / Resubmission',
    'Approved (Sanctioned)',
    'Completed (Dispatched)'
  ];

  return (
    <div className="modal-overlay" onClick={() => setSelectedProjectForDetail(null)}>
      <div 
        className="modal-card" 
        style={{ maxWidth: '880px', padding: 0, overflow: 'hidden' }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div style={{ background: 'linear-gradient(135deg, #0b1727, #12233b)', color: '#fff', padding: '22px 26px' }}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3">
                <span className="badge badge-saffron" style={{ fontSize: '0.72rem' }}>{proj.id}</span>
                <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>Code: {proj.projectCode}</span>
                <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>{proj.currentStatus}</span>
              </div>
              <h2 style={{ fontSize: '1.45rem', color: '#fff', marginTop: '6px' }}>{proj.service}</h2>
              <div className="flex items-center gap-4" style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
                <span style={{ color: '#ffa726', fontWeight: '700' }}>Client: {proj.customerName}</span>
                <span>• Contact: {proj.contactPerson} ({proj.phone})</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedProjectForDetail(null)} 
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 12 Elements Navigation Tabs */}
        <div style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', display: 'flex', overflowX: 'auto', padding: '4px 16px' }}>
          {[
            { id: 'summary', label: '1. Service & Officer' },
            { id: 'requirement', label: '2. Requirement' },
            { id: 'documents', label: `3. Documents (${proj.documents?.length || 0})` },
            { id: 'process', label: '4. Status, Process & Location' },
            { id: 'tasks', label: `5. Tasks (${proj.tasks?.filter(t => t.done).length || 0}/${proj.tasks?.length || 0})` },
            { id: 'consultant', label: '6. Department & Consultant' },
            { id: 'timeline', label: '7. Timeline' },
            { id: 'completion', label: '8. Completion & Delivery' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === t.id ? '3px solid #059669' : '3px solid transparent',
                color: activeTab === t.id ? '#059669' : '#475569',
                fontWeight: activeTab === t.id ? '700' : '600',
                padding: '12px 14px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="modal-body" style={{ minHeight: '360px', maxHeight: '60vh', overflowY: 'auto' }}>
          {/* TAB 1: SERVICE & ASSIGNED PERSON */}
          {activeTab === 'summary' && (
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#0b1727' }}>
                Element 1 & 7: Core Service & Assigned Execution Officer
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '18px' }}>
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <span className="badge badge-blue" style={{ marginBottom: '8px' }}>
                    {proj.serviceCategory || 'Corporate Services'}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', color: '#0b1727', marginBottom: '8px' }}>{proj.service}</h3>
                  <div style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '10px' }}>
                    Project Code: <strong style={{ fontFamily: 'var(--font-mono)' }}>{proj.projectCode}</strong>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
                    Customer File: <strong style={{ color: '#2563eb' }}>{proj.customerName} ({proj.customerId})</strong>
                  </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                  <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>Assigned Execution Officer</small>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ff6f00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                      {proj.assignedPerson?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <strong style={{ fontSize: '1rem', color: '#0b1727' }}>{proj.assignedPerson?.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: '#059669' }}>{proj.assignedPerson?.role}</div>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: '12px', fontSize: '0.82rem', color: '#64748b' }}>
                    <div>📞 {proj.assignedPerson?.phone}</div>
                    <div>✉️ {proj.assignedPerson?.email}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REQUIREMENT */}
          {activeTab === 'requirement' && (
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#0b1727' }}>
                Element 2: Detailed Client Business Requirements & Intake Specs
              </h4>

              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ marginBottom: '16px' }}>
                  <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>Primary Business Objective</small>
                  <div style={{ fontSize: '1.05rem', fontWeight: '600', color: '#0b1727', marginTop: '2px', lineHeight: '1.5' }}>
                    {proj.requirement?.businessObjective}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', borderTop: '1px solid #e2e8f0', paddingTop: '14px', marginTop: '14px' }}>
                  <div>
                    <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Authorized Capital</small>
                    <div style={{ fontWeight: '700', color: '#0b1727' }}>{proj.requirement?.authorizedCapital}</div>
                  </div>
                  <div>
                    <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Paid-Up Capital</small>
                    <div style={{ fontWeight: '700', color: '#0b1727' }}>{proj.requirement?.paidUpCapital}</div>
                  </div>
                  <div>
                    <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Number of Directors</small>
                    <div style={{ fontWeight: '700', color: '#0b1727' }}>{proj.requirement?.directorsCount}</div>
                  </div>
                  <div>
                    <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Shareholding Split</small>
                    <div style={{ fontWeight: '700', color: '#2563eb' }}>{proj.requirement?.shareholdingSplit}</div>
                  </div>
                </div>

                {proj.requirement?.specialNotes && (
                  <div style={{ background: '#fff', border: '1px solid #fed7aa', padding: '12px 14px', borderRadius: '8px', marginTop: '16px', fontSize: '0.88rem', color: '#9a3412' }}>
                    <strong>Special Intake Notes:</strong> {proj.requirement.specialNotes}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 style={{ fontSize: '1.1rem', color: '#0b1727' }}>
                  Element 3: Case Compliance Documents Checklist
                </h4>
                <span className="badge badge-emerald">
                  {proj.documents?.filter(d => d.status === 'Verified').length} / {proj.documents?.length} Verified
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(proj.documents || []).map((doc, idx) => (
                  <div key={idx} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={18} color={doc.status === 'Verified' ? '#059669' : '#f59e0b'} />
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#0b1727' }}>{doc.name}</div>
                        <small style={{ color: '#64748b' }}>{doc.required ? 'Mandatory Statutory Document' : 'Optional Supplemental'}</small>
                      </div>
                    </div>
                    <span className={`badge ${doc.status === 'Verified' ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.72rem' }}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: STATUS, PROCESS & LOCATION */}
          {activeTab === 'process' && (
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#0b1727' }}>
                Elements 4, 5 & 6: Current Status, Active Sub-Process & Jurisdiction Desk
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Element 4: Current Status */}
                <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div className="flex justify-between items-center mb-3">
                    <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>
                      Element 4: Current Status
                    </small>
                    <span className="badge badge-emerald" style={{ fontSize: '0.8rem' }}>{proj.currentStatus}</span>
                  </div>
                  
                  <div className="flex gap-3 items-center">
                    <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>Advance Project Stage:</span>
                    <select
                      value={proj.currentStatus}
                      onChange={e => updateProjectStatus(proj.id, e.target.value)}
                      className="form-control"
                      style={{ maxWidth: '300px', fontWeight: '700', color: '#0b1727' }}
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Element 5: Current Process */}
                <div style={{ background: '#eff6ff', padding: '18px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                  <small style={{ color: '#1e40af', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>
                    Element 5: Current Process (Granular Workflow Step)
                  </small>
                  <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1e3a8a', marginTop: '4px', lineHeight: '1.5' }}>
                    ⚙️ {proj.currentProcess}
                  </div>
                </div>

                {/* Element 6: Current Location */}
                <div style={{ background: '#ecfdf5', padding: '18px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                  <small style={{ color: '#065f46', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>
                    Element 6: Current Physical / Government Jurisdiction Location
                  </small>
                  <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#047857', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={20} color="#059669" />
                    <span>{proj.currentLocation}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TASKS */}
          {activeTab === 'tasks' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 style={{ fontSize: '1.1rem', color: '#0b1727' }}>
                  Element 8: Execution Tasks & Sub-Deliverables Checklist
                </h4>
                <small style={{ color: '#64748b' }}>Click checkbox to mark task completed</small>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(proj.tasks || []).map(task => (
                  <div 
                    key={task.id} 
                    onClick={() => toggleProjectTask(proj.id, task.id)}
                    style={{ 
                      background: task.done ? '#f0fdf4' : '#fff', 
                      border: task.done ? '1px solid #86efac' : '1px solid #e2e8f0', 
                      borderRadius: '10px', 
                      padding: '14px 18px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={task.done} 
                        onChange={() => {}} 
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#059669' }} 
                      />
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.92rem', color: task.done ? '#065f46' : '#0b1727', textDecoration: task.done ? 'line-through' : 'none' }}>
                          {task.task}
                        </div>
                        <small style={{ color: '#64748b' }}>Assignee: <strong>{task.assignee}</strong></small>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>Due: {task.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: DEPARTMENT & CONSULTANT */}
          {activeTab === 'consultant' && (
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#0b1727' }}>
                Elements 9 & 10: Executing Department & Senior Consultant Signoff
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Department */}
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>
                    Element 9: Department
                  </small>
                  <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0b1727', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building size={20} color="#2563eb" />
                    <span>{proj.department}</span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '10px' }}>
                    Assigned specialized wing responsible for end-to-end statutory drafting, government portal filing, and RoC/KVIC liaisoning.
                  </p>
                </div>

                {/* Consultant */}
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '700' }}>
                    Element 10: Senior Consultant Signoff
                  </small>
                  <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0b1727', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={20} color="#ff6f00" />
                    <span>{proj.consultant?.name}</span>
                  </div>
                  <small style={{ color: '#059669', display: 'block', marginTop: '4px' }}>
                    Signoff Date: {proj.consultant?.signoffDate}
                  </small>
                  <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px', marginTop: '10px', fontSize: '0.82rem', color: '#475569', fontStyle: 'italic' }}>
                    "{proj.consultant?.reviewRemarks}"
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: TIMELINE */}
          {activeTab === 'timeline' && (
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#0b1727' }}>
                Element 11: Milestone SLA Timeline & Progress Stepper
              </h4>

              <div style={{ position: 'relative', borderLeft: '3px solid #2563eb', marginLeft: '16px', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {(proj.timeline || []).map((step, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <div style={{ 
                      position: 'absolute', 
                      left: '-32px', 
                      top: '0px', 
                      width: '16px', 
                      height: '16px', 
                      borderRadius: '50%', 
                      background: step.done ? '#059669' : '#cbd5e1', 
                      border: '3px solid #fff',
                      boxShadow: '0 0 0 2px #2563eb' 
                    }}></div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.98rem', color: step.done ? '#065f46' : '#0b1727' }}>
                          {step.stage}
                        </div>
                        <small style={{ color: '#64748b' }}>Target SLA: <strong>{step.targetDate}</strong></small>
                      </div>
                      <span className={`badge ${step.done ? 'badge-emerald' : 'badge-amber'}`}>
                        {step.actualDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: COMPLETION */}
          {activeTab === 'completion' && (
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#0b1727' }}>
                Element 12: Case Completion Deliverables & Dispatch Tracking
              </h4>

              <div style={{ background: proj.completion?.isCompleted ? '#ecfdf5' : '#f8fafc', padding: '22px', borderRadius: '12px', border: proj.completion?.isCompleted ? '1px solid #a7f3d0' : '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className={`badge ${proj.completion?.isCompleted ? 'badge-emerald' : 'badge-blue'}`}>
                      {proj.completion?.isCompleted ? 'Final Deliverables Ready' : 'Execution In Progress'}
                    </span>
                    <h3 style={{ fontSize: '1.3rem', marginTop: '6px', color: '#0b1727' }}>
                      {proj.completion?.isCompleted ? 'Case Fully Concluded' : 'Milestone In Final Stages'}
                    </h3>
                  </div>

                  {proj.completion?.isCompleted && (
                    <div style={{ textAlign: 'right' }}>
                      <small style={{ color: '#64748b' }}>Completed on</small>
                      <div style={{ fontWeight: '700', color: '#059669' }}>{proj.completion.completionDate}</div>
                    </div>
                  )}
                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '10px', marginTop: '14px' }}>
                  <div className="flex items-center gap-2" style={{ color: '#2563eb', fontWeight: '700', fontSize: '0.92rem', marginBottom: '8px' }}>
                    <Truck size={18} />
                    <span>Dispatch / Courier Tracking ID:</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: '800', color: '#0b1727' }}>
                    {proj.completion?.dispatchTrackingNo || 'DUS-COURIER-PENDING'}
                  </div>
                </div>
              </div>

              <h5 style={{ fontSize: '0.95rem', marginBottom: '10px', color: '#0b1727' }}>Final Client Deliverables Kit:</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(proj.completion?.deliverables || []).map((d, i) => (
                  <div key={i} className="flex justify-between items-center" style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: '8px' }}>
                    <div className="flex items-center gap-2" style={{ fontWeight: '600', color: '#334155' }}>
                      <CheckCircle2 size={16} color="#059669" />
                      <span>{d}</span>
                    </div>
                    <button onClick={() => showToast(`Downloading: ${d}`)} className="btn btn-sm btn-outline" style={{ padding: '3px 8px', fontSize: '0.78rem' }}>
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
