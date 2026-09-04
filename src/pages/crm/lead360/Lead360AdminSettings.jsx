import React, { useState } from 'react';
import { Settings, Sliders, ShieldCheck, ToggleLeft, ToggleRight, Plus, CheckCircle2, AlertTriangle, Users, Bot, FileText, Database } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const Lead360AdminSettings = () => {
  const {
    leadSources,
    setLeadSources,
    leadStages,
    assignmentRules,
    setAssignmentRules,
    aiTemplates,
    setAiTemplates,
    showToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('assignment'); // 'assignment' | 'sources' | 'ai' | 'automation' | 'audit'

  // Master Automation Toggles
  const [automationToggles, setAutomationToggles] = useState({
    autoAssignmentActive: true,
    aiAutoResponseActive: true,
    overdueEscalationsActive: true,
    voiceProcessingActive: true,
    strictDiscountAuditActive: true
  });

  const toggleSwitch = (key) => {
    setAutomationToggles(prev => {
      const next = { ...prev, [key]: !prev[key] };
      showToast(`Automation Setting "${key}" updated.`);
      return next;
    });
  };

  return (
    <div style={{ padding: '4px' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h2 style={{ fontSize: '1.5rem', color: '#0b1727', margin: 0 }}>Lead 360° Admin Command & Rules Engine</h2>
            <span className="badge badge-saffron" style={{ fontSize: '0.75rem' }}>Admin Superuser</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Configure auto-assignment rules, AI auto-response knowledge, escalation thresholds, and automation masters without writing code.
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #cbd5e1', paddingBottom: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { id: 'assignment', label: '1. Auto-Assignment Rules', icon: Users },
          { id: 'sources', label: `2. Lead Sources (${leadSources.length})`, icon: Database },
          { id: 'ai', label: '3. AI Knowledge & Auto-Response', icon: Bot },
          { id: 'automation', label: '4. Automation Master Switches', icon: Sliders },
          { id: 'audit', label: '5. System Audit Security Log', icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: activeSubTab === tab.id ? '700' : '600',
                background: activeSubTab === tab.id ? '#0b1727' : '#f1f5f9',
                color: activeSubTab === tab.id ? '#fff' : '#475569'
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: ASSIGNMENT RULES */}
      {activeSubTab === 'assignment' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 style={{ fontSize: '1.1rem', color: '#0b1727', margin: 0 }}>Active Auto-Assignment Priority Matrix</h4>
              <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '4px 0 0' }}>
                When an inbound lead arrives, the engine evaluates rules in priority order (1 to 6) and routes to the matching staff or round-robin queue.
              </p>
            </div>
            <button
              type="button"
              onClick={() => showToast('Add new assignment rule modal opened.')}
              className="btn btn-primary btn-sm"
            >
              <Plus size={14} /> Add Assignment Rule
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th>Priority</th>
                <th>Rule Name</th>
                <th>Criteria Type</th>
                <th>Matching Pattern</th>
                <th>Assigned Officer</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {assignmentRules.map(r => (
                <tr key={r.id}>
                  <td>
                    <span className="badge badge-saffron" style={{ fontFamily: 'var(--font-mono)' }}>
                      #{r.priority}
                    </span>
                  </td>
                  <td style={{ fontWeight: '700', color: '#0b1727' }}>{r.name}</td>
                  <td>
                    <span className="badge badge-blue">{r.criteriaType}</span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: '#2563eb', fontWeight: '600' }}>
                    "{r.criteriaValue}"
                  </td>
                  <td style={{ fontWeight: '600', color: '#334155' }}>{r.assignedStaff}</td>
                  <td>
                    <span className="badge badge-emerald">● Active & Routed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SUBTAB 2: LEAD SOURCES */}
      {activeSubTab === 'sources' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 style={{ fontSize: '1.1rem', color: '#0b1727', margin: 0 }}>Inbound Lead Sources & Channel Attribution</h4>
              <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '4px 0 0' }}>
                Manage all 18 inbound, digital, partner, and field channels. Enable or disable automated ingestion per source.
              </p>
            </div>
            <button
              type="button"
              onClick={() => showToast('New lead source channel created.')}
              className="btn btn-primary btn-sm"
            >
              <Plus size={14} /> Add Source
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {leadSources.map(s => (
              <div key={s.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '700', color: '#0b1727', fontSize: '0.92rem' }}>{s.name}</div>
                  <div className="flex items-center gap-2" style={{ marginTop: '4px' }}>
                    <span className="badge badge-saffron" style={{ fontSize: '0.68rem' }}>{s.category}</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>{s.code}</span>
                  </div>
                </div>
                <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>Active</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: AI KNOWLEDGE & AUTO-RESPONSE */}
      {activeSubTab === 'ai' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 style={{ fontSize: '1.1rem', color: '#0b1727', margin: 0 }}>AI Auto-Response Knowledge Base</h4>
              <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '4px 0 0' }}>
                Pre-approved templates used by WhatsApp bot. AI extracts parameters safely without making false promises or giving unauthorized pricing.
              </p>
            </div>
            <button
              type="button"
              onClick={() => showToast('AI template added.')}
              className="btn btn-primary btn-sm"
            >
              <Plus size={14} /> New AI Knowledge
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {aiTemplates.map(tmpl => (
              <div key={tmpl.id} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="badge badge-blue">{tmpl.service}</span>
                  <span className="badge badge-emerald">Channel: {tmpl.channel}</span>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', fontSize: '0.88rem', color: '#1e293b', fontStyle: 'italic', lineHeight: '1.5' }}>
                  "{tmpl.templateText}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: MASTER AUTOMATION SWITCHES */}
      {activeSubTab === 'automation' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <h4 style={{ fontSize: '1.1rem', color: '#0b1727', marginBottom: '16px' }}>
            Autopilot Master Feature Toggles (ON / OFF)
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { key: 'autoAssignmentActive', title: 'Automatic Rule-Based Lead Assignment', desc: 'Automatically assign incoming leads from all 18 sources based on active matrix.' },
              { key: 'aiAutoResponseActive', title: 'AI Instant Auto-Response (WhatsApp / SMS)', desc: 'Automatically reply to customer with verified service checklist & greeting.' },
              { key: 'overdueEscalationsActive', title: 'Autopilot Overdue Follow-up & Senior Escalations', desc: 'Alert seniors & Admin if a lead remains untouched past 120 minutes.' },
              { key: 'voiceProcessingActive', title: 'Voice-to-CRM Auto Note & Task Generation', desc: 'Allow staff voice memos to directly update lead requirements & schedules.' },
              { key: 'strictDiscountAuditActive', title: 'Mandatory Price Change & Discount Audit Logging', desc: 'Require reason and log Who/What/When for any deviation from master pricing.' }
            ].map(item => (
              <div
                key={item.key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: '#0b1727', fontSize: '0.95rem' }}>{item.title}</div>
                  <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '3px' }}>{item.desc}</div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleSwitch(item.key)}
                  style={{
                    background: automationToggles[item.key] ? '#15803d' : '#94a3b8',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '6px 16px',
                    fontWeight: '700',
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  {automationToggles[item.key] ? 'ENABLED (ON)' : 'DISABLED (OFF)'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: SYSTEM AUDIT LOG */}
      {activeSubTab === 'audit' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 style={{ fontSize: '1.1rem', color: '#0b1727', margin: 0 }}>System-Wide Security & Audit Ledger</h4>
              <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '4px 0 0' }}>
                Immutable log of all price changes, discounts, assignments, status transitions, and external delegations across all leads.
              </p>
            </div>
            <span className="badge badge-emerald">Encrypted & Audited</span>
          </div>

          <table className="data-table">
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th>Timestamp</th>
                <th>Lead</th>
                <th>Action Type</th>
                <th>Changed Field</th>
                <th>Old Value → New Value</th>
                <th>Performed By</th>
                <th>Audit Reason</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>02 Sep 04:18 PM</td>
                <td><strong style={{ color: '#ff6f00' }}>LD-101</strong></td>
                <td><span className="badge badge-amber">Price_Change</span></td>
                <td>discount_amount</td>
                <td>₹0.00 → ₹500.00</td>
                <td>Neha Sharma (RM)</td>
                <td>First-time founder promotion concession</td>
              </tr>
              <tr>
                <td>02 Sep 10:15 AM</td>
                <td><strong style={{ color: '#ff6f00' }}>LD-101</strong></td>
                <td><span className="badge badge-blue">Assignment</span></td>
                <td>assigned_employee</td>
                <td>Unassigned → Neha Sharma</td>
                <td>Auto-Assign Engine</td>
                <td>Rule #1: MCA Company Registration matched</td>
              </tr>
              <tr>
                <td>01 Sep 09:30 AM</td>
                <td><strong style={{ color: '#ff6f00' }}>LD-102</strong></td>
                <td><span className="badge badge-blue">Assignment</span></td>
                <td>assigned_employee</td>
                <td>Unassigned → Anil Tyagi</td>
                <td>Auto-Assign Engine</td>
                <td>Rule #2: PMEGP Loan Service matched</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
