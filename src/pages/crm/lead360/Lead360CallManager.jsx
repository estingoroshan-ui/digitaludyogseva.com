import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneCall, PhoneOff, Clock, UserCheck, AlertTriangle, CheckCircle2, Play, Volume2, ArrowRight } from 'lucide-react';

export const Lead360CallManager = ({ lead, onCallLogged }) => {
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callResult, setCallResult] = useState('Connected');
  const [callNotes, setCallNotes] = useState('');
  const [nextAction, setNextAction] = useState('Send Formal Proposal on WhatsApp');
  const [nextFollowupDate, setNextFollowupDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [nextFollowupTime, setNextFollowupTime] = useState('11:00 AM');
  
  const timerRef = useRef(null);

  const callOutcomes = [
    { code: 'Connected', label: 'Connected (Spoke with Client)', color: '#10b981', badge: 'badge-emerald' },
    { code: 'Interested', label: 'Interested & Ready for Quote', color: '#059669', badge: 'badge-emerald' },
    { code: 'Call Back', label: 'Client Busy / Call Back Requested', color: '#f59e0b', badge: 'badge-amber' },
    { code: 'Not Connected', label: 'Ringing / No Answer', color: '#f97316', badge: 'badge-saffron' },
    { code: 'Busy', label: 'Line Busy / Disconnected', color: '#ea580c', badge: 'badge-amber' },
    { code: 'Not Interested', label: 'Not Interested / Price Issue', color: '#64748b', badge: 'badge-slate' },
    { code: 'Wrong Number', label: 'Wrong Number / Invalid Prospect', color: '#dc2626', badge: 'badge-rose' },
    { code: 'Human Required', label: '🚨 Senior Human RM Escalation Needed', color: '#e11d48', badge: 'badge-rose' }
  ];

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleStartCall = () => {
    setIsCalling(true);
    setCallDuration(0);
    setCallNotes('');

    timerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const handleEndCall = () => {
    setIsCalling(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (!callNotes) {
      setCallNotes(`Connected with ${lead.name} regarding ${lead.service}. Discussed requirements, documentation checklist, and agreed on next steps.`);
    }
  };

  const handleSubmitCallLog = (e) => {
    e.preventDefault();
    if (!callNotes.trim()) return;

    const payload = {
      callType: 'Outbound',
      callResult,
      durationSeconds: Math.max(callDuration, 35),
      notes: callNotes,
      aiSummary: `Call Outcome: ${callResult}. Next Step: ${nextAction}`,
      nextAction,
      nextDate: nextFollowupDate,
      nextTime: nextFollowupTime
    };

    if (onCallLogged) {
      onCallLogged(payload);
    }
  };

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
      {/* Dialer Header */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 style={{ fontSize: '1.1rem', color: '#0b1727', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PhoneCall size={16} />
            </span>
            <span>In-CRM Calling Desk & Outcome Manager</span>
          </h4>
          <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '4px 0 0' }}>
            Click dialer to initiate call to <strong>{lead.phone}</strong>. Record duration, outcomes, transcripts, and auto-next actions.
          </p>
        </div>

        {/* Live Call Badge */}
        {isCalling ? (
          <div className="badge badge-emerald" style={{ fontSize: '0.85rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px', animation: 'pulse 1.5s infinite' }}>
            <PhoneCall size={14} />
            <span>Call Live: {formatSeconds(callDuration)}</span>
          </div>
        ) : (
          <div className="badge badge-blue" style={{ fontSize: '0.8rem' }}>
            Ready to Connect
          </div>
        )}
      </div>

      {/* Dialer Control Banner */}
      <div style={{ background: isCalling ? '#ecfdf5' : '#f8fafc', border: isCalling ? '2px solid #10b981' : '1px solid #cbd5e1', borderRadius: '12px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0b1727' }}>
            {lead.name}
          </div>
          <div className="flex items-center gap-3" style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
            <span style={{ color: '#059669', fontWeight: '700' }}>📞 {lead.phone}</span>
            <span>📍 {lead.district || lead.city || 'India'}</span>
            <span style={{ color: '#2563eb' }}>💼 {lead.service}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {isCalling ? (
            <button
              type="button"
              onClick={handleEndCall}
              className="btn btn-danger"
              style={{ padding: '8px 20px', borderRadius: '9999px', fontSize: '0.88rem' }}
            >
              <PhoneOff size={16} />
              <span>End Call ({formatSeconds(callDuration)})</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStartCall}
              className="btn btn-primary"
              style={{ padding: '8px 20px', borderRadius: '9999px', background: '#059669', fontSize: '0.88rem' }}
            >
              <PhoneCall size={16} />
              <span>Dial Call Now</span>
            </button>
          )}

          <a
            href={`tel:${lead.phone}`}
            className="btn btn-outline"
            style={{ padding: '8px 14px', borderRadius: '9999px', fontSize: '0.82rem' }}
            title="Open native device dialer"
          >
            Native Phone App
          </a>
        </div>
      </div>

      {/* Log Call Form */}
      <form onSubmit={handleSubmitCallLog}>
        <div className="form-group mb-3">
          <label className="form-label" style={{ fontWeight: '700' }}>
            Select Call Outcome / Result *
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
            {callOutcomes.map(out => (
              <label
                key={out.code}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: callResult === out.code ? `2px solid ${out.color}` : '1px solid #e2e8f0',
                  background: callResult === out.code ? `${out.color}15` : '#fff',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: callResult === out.code ? '700' : '500',
                  color: '#1e293b'
                }}
              >
                <input
                  type="radio"
                  name="call_outcome"
                  value={out.code}
                  checked={callResult === out.code}
                  onChange={() => setCallResult(out.code)}
                  style={{ accentColor: out.color }}
                />
                <span>{out.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group mb-3">
          <label className="form-label">Call Discussion Remarks / Transcript Summary *</label>
          <textarea
            rows={3}
            required
            placeholder="e.g. Client confirmed 2 directors, registered office bill ready in father name, agreed on quotation fee."
            className="form-control"
            value={callNotes}
            onChange={e => setCallNotes(e.target.value)}
            style={{ fontSize: '0.88rem' }}
          ></textarea>
        </div>

        {/* Next Action Scheduling */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
          <h5 style={{ fontSize: '0.88rem', color: '#0b1727', margin: '0 0 10px 0' }}>
            📅 Autopilot Next Action Scheduler
          </h5>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Next Action Task</label>
              <input
                type="text"
                className="form-control"
                value={nextAction}
                onChange={e => setNextAction(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Follow-up Date</label>
              <input
                type="date"
                className="form-control"
                value={nextFollowupDate}
                onChange={e => setNextFollowupDate(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Time</label>
              <input
                type="text"
                className="form-control"
                value={nextFollowupTime}
                onChange={e => setNextFollowupTime(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full" style={{ padding: '10px' }}>
          <CheckCircle2 size={16} />
          <span>Save Call Record & Schedule Autopilot Follow-up</span>
        </button>
      </form>

      {/* Historical Call Logs */}
      {(lead.calls || []).length > 0 && (
        <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
          <h5 style={{ fontSize: '0.92rem', color: '#0b1727', marginBottom: '12px' }}>
            Call History on this Lead ({lead.calls.length})
          </h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {lead.calls.map((c, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>{c.callResult}</span>
                    <strong style={{ fontSize: '0.88rem' }}>{c.datetime}</strong>
                    <span style={{ color: '#64748b', fontSize: '0.75rem' }}>({c.durationSeconds}s duration)</span>
                  </div>
                  <span style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: '600' }}>By: {c.caller}</span>
                </div>
                <p style={{ color: '#334155', fontSize: '0.85rem', margin: '4px 0' }}>"{c.transcript}"</p>
                {c.nextAction && (
                  <div style={{ color: '#059669', fontSize: '0.78rem', fontWeight: '600', marginTop: '4px' }}>
                    Next Action: {c.nextAction}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
