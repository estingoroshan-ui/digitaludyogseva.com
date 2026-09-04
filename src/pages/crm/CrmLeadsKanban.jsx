import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lead360ListKanban } from './lead360/Lead360ListKanban';
import { Lead360Dashboard } from './lead360/Lead360Dashboard';
import { Sparkles, LayoutDashboard, Kanban, Sliders, ShieldCheck } from 'lucide-react';

export const CrmLeadsKanban = () => {
  const [activeSubView, setActiveSubView] = useState('list'); // 'list' | 'attention_dashboard'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Switcher: Lead 360 Pipeline List/Kanban vs Attention Queue Dashboard */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveSubView('list')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeSubView === 'list' ? '700' : '600',
              background: activeSubView === 'list' ? '#ff6f00' : '#f1f5f9',
              color: activeSubView === 'list' ? '#fff' : '#475569',
              fontSize: '0.85rem'
            }}
          >
            <Kanban size={15} />
            <span>360° Lead Management & Pipeline</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubView('attention_dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeSubView === 'attention_dashboard' ? '700' : '600',
              background: activeSubView === 'attention_dashboard' ? '#0b1727' : '#f1f5f9',
              color: activeSubView === 'attention_dashboard' ? '#fff' : '#475569',
              fontSize: '0.85rem'
            }}
          >
            <LayoutDashboard size={15} />
            <span>Today's Attention Queue & Analytics</span>
          </button>
        </div>
      </div>

      {activeSubView === 'list' && <Lead360ListKanban />}
      {activeSubView === 'attention_dashboard' && <Lead360Dashboard />}
    </div>
  );
};
