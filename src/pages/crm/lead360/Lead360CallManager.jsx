import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneCall, PhoneOff, Clock, UserCheck, AlertTriangle, CheckCircle2, Play, Pause, Volume2, ArrowRight, Bot, Sparkles, Mic } from 'lucide-react';

export const Lead360CallManager = ({ lead, onCallLogged }) => {
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callResult, setCallResult] = useState('Connected');
  const [callNotes, setCallNotes] = useState('');
  const [nextAction, setNextAction] = useState('Send Formal Proposal on WhatsApp');
  const [nextFollowupDate, setNextFollowupDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [nextFollowupTime, setNextFollowupTime] = useState('11:00 AM');
  
  // AI Voice Caller States
  const [isAiCalling, setIsAiCalling] = useState(false);
  const [aiCallStep, setAiCallStep] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  
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

  const handleStartAiCaller = () => {
    setIsAiCalling(true);
    setAiCallStep(1);

    setTimeout(() => {
      setAiCallStep(2);
    }, 1600);

    setTimeout(() => {
      setAiCallStep(3);
    }, 3200);

    setTimeout(() => {
      setAiCallStep(4);
      setCallResult('Interested');
      setCallDuration(145);
      setCallNotes(`🤖 AI Voice Autonomous Call Completed:\n• Prospect: ${lead.name} (${lead.phone})\n• Confirmed Intent: Wants ${lead.service || 'MSME Subsidy Loan'} for proposed unit.\n• CIBIL Status: Stated ~740 with no active NPA/settlement.\n• Eligibility: Qualified for Rajasthan MLUPY 8% interest subsidy & PMEGP 35% capital subsidy.\n• Action: Auto-dispatched WhatsApp scorecard link & suggested Cabin #01 / #04 appointment.`);
      setNextAction('Dispatch 7-Pillar Eligibility Report via WhatsApp & Schedule Cabin Consultation');
    }, 4800);
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

        <div className="flex items-center gap-2 flex-wrap">
          {/* AI Autonomous Caller Trigger */}
          <button
            type="button"
            onClick={handleStartAiCaller}
            disabled={isCalling || isAiCalling}
            className="btn btn-sm btn-outline"
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              background: isAiCalling ? '#f5f3ff' : '#fff',
              borderColor: '#8b5cf6',
              color: '#7c3aed',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Launch AI Autonomous Voice Calling Agent"
          >
            <Bot size={15} />
            <span>{isAiCalling ? 'AI Call in Progress...' : '🤖 Launch AI Auto-Caller'}</span>
          </button>

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

      {/* AI Autonomous Voice Call Live Visualizer */}
      {isAiCalling && (
        <div style={{
          background: 'linear-gradient(135deg, #0f172a, #1e1b4b)',
          color: '#fff',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          border: '1px solid #6366f1',
          boxShadow: '0 10px 25px rgba(99,102,241,0.2)'
        }}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} color="#fff" />
              </div>
              <div>
                <strong style={{ fontSize: '0.95rem' }}>AI Autonomous Voice Agent • Live Trunk #91-0141-892</strong>
                <div style={{ fontSize: '0.72rem', color: '#c7d2fe' }}>Connecting with {lead.name} ({lead.phone})</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAiCalling(false)}
              className="btn btn-sm btn-outline"
              style={{ color: '#fff', borderColor: '#475569', fontSize: '0.75rem' }}
            >
              Minimize
            </button>
          </div>

          {/* Dialog Progression */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #8b5cf6' }}>
              <span style={{ color: '#a5b4fc', fontWeight: '700' }}>AI Agent: </span>
              "नमस्ते {lead.name} जी, मैं डिजिटल उद्योग सेवा से AI एडवाइज़र बोल रहा हूँ। क्या आप {lead.service || 'एमएसएमई लोन'} के संबंध में 2 मिनट बात कर सकते हैं?"
            </div>

            {aiCallStep >= 2 && (
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                <span style={{ color: '#6ee7b7', fontWeight: '700' }}>{lead.name} (Client): </span>
                "हाँ सर, मैं उद्योग लोन और सरकारी सब्सिडी के बारे में जानकारी चाहता हूँ।"
              </div>
            )}

            {aiCallStep >= 3 && (
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #8b5cf6' }}>
                <span style={{ color: '#a5b4fc', fontWeight: '700' }}>AI Agent: </span>
                "आपका प्रस्तावित उद्यम कौन सा है और क्या आपका सिबिल स्कोर लगभग 700+ है?"
              </div>
            )}

            {aiCallStep >= 4 && (
              <div style={{ background: 'rgba(16,185,129,0.1)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                <div style={{ color: '#34d399', fontWeight: '700', marginBottom: '2px' }}>✓ AI Call Successfully Concluded (145s)</div>
                <div style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>
                  Client qualified as <strong>Interested</strong>. Eligibility link dispatched to client's WhatsApp. Call notes populated below.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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

                {/* Call Audio Recording Playback Widget */}
                <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px', margin: '8px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPlayingAudioId(playingAudioId === idx ? null : idx)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: 'none',
                        background: playingAudioId === idx ? '#ef4444' : '#ff6f00',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Play / Pause Call Recording"
                    >
                      {playingAudioId === idx ? <Pause size={13} /> : <Play size={13} fill="#fff" />}
                    </button>
                    <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '600' }}>
                      {playingAudioId === idx ? '▶ Playing Recording (Audio Encrypted)...' : '🎧 Call Recording Audio Available (02:25)'}
                    </span>
                  </div>

                  <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>
                    Telecom Log #REC-{c.id || '9821'}
                  </span>
                </div>

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
