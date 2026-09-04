import React, { useState } from 'react';
import { Sparkles, Bot, ShieldCheck, AlertCircle, ArrowRight, MessageSquare, Send, CheckCircle2, UserCheck, Flame } from 'lucide-react';

export const Lead360AiAssistant = ({ lead, onTriggerHandover, onSendAiResponse }) => {
  const [testUserQuery, setTestUserQuery] = useState('');
  const [aiChatLogs, setAiChatLogs] = useState([
    {
      sender: 'client',
      text: `मुझे ${lead.service || 'PMEGP Loan'} के लिए जानकारी चाहिए। क्या क्या डॉक्यूमेंट लगेंगे?`,
      time: '10:15 AM'
    },
    {
      sender: 'ai',
      text: `Namaste ${lead.name}! Digital Udyog Seva में आपका स्वागत है। ${lead.service} के लिए आपके आवश्यक दस्तावेज: 1. पैन कार्ड, 2. आधार कार्ड (मोबाइल लिंक), 3. बिजली बिल / पता प्रमाण, 4. बैंक स्टेटमेंट। हमारी टीम आपकी सहायता के लिए तैयार है।`,
      time: '10:16 AM'
    }
  ]);

  const [simulatedAiReply, setSimulatedAiReply] = useState('');

  const handleSimulateAiChat = (e) => {
    e.preventDefault();
    if (!testUserQuery.trim()) return;

    const query = testUserQuery;
    const userMsg = { sender: 'client', text: query, time: 'Just now' };
    setAiChatLogs(prev => [...prev, userMsg]);
    setTestUserQuery('');

    // AI Knowledge matching
    setTimeout(() => {
      let botResponse = '';
      if (query.toLowerCase().includes('human') || query.toLowerCase().includes('बात करनी है') || query.toLowerCase().includes('manager')) {
        botResponse = `जी बिल्कुल, मैं आपके केस को तुरंत हमारे सीनियर रिलेशनशिप मैनेजर (Senior RM Desk) को हैंडओवर कर रहा हूँ। वो आपको अगले 10 मिनट में कॉल करेंगे।`;
        if (onTriggerHandover) {
          onTriggerHandover(`Customer chat requested human handover: "${query}"`);
        }
      } else if (query.toLowerCase().includes('price') || query.toLowerCase().includes('फीस') || query.toLowerCase().includes('खर्चा')) {
        botResponse = `हमारे ${lead.service} का अधिकृत पैकेज ₹${Number(lead.value || 4999).toLocaleString('en-IN')} (प्लस 18% GST) है, जिसमें सरकारी फाइलिंग व अप्रूवल शामिल है। किसी भी अतिरिक्त छूट के लिए हमारे अधिकृत अधिकारी आपसे बात करेंगे।`;
      } else {
        botResponse = `धन्यवाद! आपकी आवश्यकता दर्ज कर ली गई है। ${lead.service} के संबंध में हमारी अधिकृत चेकलिस्ट और प्रोसेस गाइड आपके व्हाट्सएप नंबर ${lead.phone} पर भेज दी गई है।`;
      }

      const botMsg = { sender: 'ai', text: botResponse, time: 'Just now' };
      setAiChatLogs(prev => [...prev, botMsg]);
    }, 600);
  };

  const aiSummary = lead.aiSummary || {
    clientIntent: `Client is exploring ${lead.service || 'business services'} with priority compliance.`,
    interestedService: lead.service || 'Private Limited Company Registration',
    interestScore: lead.leadScore || 85,
    interestTemperature: lead.temperature || 'Hot',
    potentialObjection: 'May inquire about statutory turnaround timeline and bank eligibility.',
    budgetTimeline: `Budget approx ₹${Number(lead.value || 7500).toLocaleString('en-IN')}`,
    lastInteractionRecap: 'Inbound lead received via autopilot channels.',
    recommendedNextAction: 'Send formal quotation and schedule discovery confirmation call.'
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
      {/* 1. AI 360° Lead Summary & Insights */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div className="flex justify-between items-center mb-4">
          <h4 style={{ fontSize: '1.1rem', color: '#0b1727', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff6f00, #ea580c)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={16} />
            </span>
            <span>AI Lead Assistant & Dossier Summary</span>
          </h4>
          <span className="badge badge-rose" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Flame size={12} /> {aiSummary.interestScore}% AI Intent Score
          </span>
        </div>

        {/* AI Key Insights Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
            <small style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
              🎯 Customer Intent & Core Requirement
            </small>
            <div style={{ fontSize: '0.92rem', color: '#0b1727', fontWeight: '600', marginTop: '3px' }}>
              {aiSummary.clientIntent}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
              <small style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase' }}>
                💼 Interested Service
              </small>
              <div style={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: '700', marginTop: '2px' }}>
                {aiSummary.interestedService}
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
              <small style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase' }}>
                💰 Budget & Target Close
              </small>
              <div style={{ fontSize: '0.9rem', color: '#059669', fontWeight: '700', marginTop: '2px' }}>
                {aiSummary.budgetTimeline}
              </div>
            </div>
          </div>

          <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', padding: '14px' }}>
            <small style={{ color: '#9a3412', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={13} /> Anticipated Objections & Clarity Points
            </small>
            <div style={{ fontSize: '0.88rem', color: '#7c2d12', marginTop: '3px' }}>
              {aiSummary.potentialObjection}
            </div>
          </div>

          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '14px' }}>
            <small style={{ color: '#065f46', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} color="#059669" /> Recommended Next Best Action
            </small>
            <div style={{ fontSize: '0.92rem', color: '#064e3b', fontWeight: '700', marginTop: '3px' }}>
              {aiSummary.recommendedNextAction}
            </div>
          </div>
        </div>

        {/* Safety & Human Handover */}
        <div style={{ marginTop: '18px', borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#64748b' }}>
            <ShieldCheck size={16} color="#059669" />
            <span>AI Guardrails Active (No unauthorized pricing / false promises)</span>
          </div>

          <button
            type="button"
            onClick={() => onTriggerHandover && onTriggerHandover('Admin manually triggered Human Handover desk.')}
            className="btn btn-outline"
            style={{ fontSize: '0.78rem', color: '#dc2626', borderColor: '#fca5a5', background: '#fef2f2' }}
          >
            <UserCheck size={14} />
            <span>Escalate to Human RM Desk</span>
          </button>
        </div>
      </div>

      {/* 2. Live AI Auto-Response Simulator */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column' }}>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Bot size={18} color="#2563eb" />
            <h5 style={{ fontSize: '0.95rem', color: '#0b1727', margin: 0 }}>AI Auto-Response Bot (WhatsApp)</h5>
          </div>
          <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>Live Simulation</span>
        </div>

        {/* Chat History Box */}
        <div style={{ flex: 1, minHeight: '260px', maxHeight: '320px', overflowY: 'auto', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
          {aiChatLogs.map((msg, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: msg.sender === 'client' ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
                background: msg.sender === 'client' ? '#f1f5f9' : '#dcfce7',
                color: msg.sender === 'client' ? '#1e293b' : '#065f46',
                padding: '8px 12px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                lineHeight: '1.4'
              }}
            >
              <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: '2px', fontWeight: '700' }}>
                {msg.sender === 'client' ? lead.name : '🤖 DUS AI Bot'} • {msg.time}
              </div>
              <div>{msg.text}</div>
            </div>
          ))}
        </div>

        {/* Quick Query Input */}
        <form onSubmit={handleSimulateAiChat} className="flex gap-2">
          <input
            type="text"
            placeholder="Type customer message e.g. 'मुझे इंसान से बात करनी है'..."
            className="form-control"
            style={{ fontSize: '0.82rem' }}
            value={testUserQuery}
            onChange={e => setTestUserQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0 14px' }}>
            <Send size={14} />
          </button>
        </form>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
          <button
            type="button"
            onClick={() => setTestUserQuery('मुझे इंसान से बात करनी है')}
            style={{ background: '#e2e8f0', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '0.72rem', cursor: 'pointer' }}
          >
            "बात करनी है"
          </button>
          <button
            type="button"
            onClick={() => setTestUserQuery('फीस कितनी लगेगी?')}
            style={{ background: '#e2e8f0', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '0.72rem', cursor: 'pointer' }}
          >
            "फीस कितनी लगेगी?"
          </button>
          <button
            type="button"
            onClick={() => setTestUserQuery('डॉक्यूमेंट्स क्या लगेंगे?')}
            style={{ background: '#e2e8f0', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '0.72rem', cursor: 'pointer' }}
          >
            "डॉक्यूमेंट्स क्या लगेंगे?"
          </button>
        </div>
      </div>
    </div>
  );
};
