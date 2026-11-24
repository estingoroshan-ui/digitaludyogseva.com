import React, { useState } from 'react';
import { useRouter } from '../../../router/Router';
import { useApp } from '../../../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Download, 
  Calendar, 
  Filter, 
  Award, 
  IndianRupee, 
  Users, 
  Building2 
} from 'lucide-react';

export const ReportsModule = () => {
  const { navigate } = useRouter();
  const { showToast } = useApp();

  const [dateRange, setDateRange] = useState('Current FY 2026-27');

  return (
    <div>
      <div className="paytm-page-header">
        <div>
          <h1 className="paytm-page-title">Executive Reports &amp; Analytics</h1>
          <p className="paytm-page-subtitle">
            Lead source attribution, scheme conversion rates, branch revenue and employee performance
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button"
            onClick={() => showToast('Exporting comprehensive MIS Audit Pack (Excel)...', 'success')}
            className="paytm-btn paytm-btn-primary"
          >
            <Download size={16} />
            <span>Export MIS Pack</span>
          </button>
        </div>
      </div>

      {/* Grid of Report Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* State-wise Lead Inflow */}
        <div className="paytm-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#002970', marginBottom: '16px' }}>
            State-wise Entrepreneur Lead Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { state: 'Rajasthan', count: 342, pct: '44%', color: '#00BAF2' },
              { state: 'Maharashtra', count: 189, pct: '24%', color: '#008BCB' },
              { state: 'Gujarat', count: 145, pct: '18%', color: '#16A34A' },
              { state: 'Madhya Pradesh', count: 98, pct: '12%', color: '#F59E0B' },
              { state: 'Delhi NCR', count: 86, pct: '11%', color: '#002970' }
            ].map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '600', color: '#1E293B' }}>{item.state}</span>
                  <span style={{ fontWeight: '700', color: '#002970' }}>{item.count} Leads ({item.pct})</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: item.pct, height: '100%', background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheme-wise Application Distribution */}
        <div className="paytm-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#002970', marginBottom: '16px' }}>
            Government Scheme Application Share
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { scheme: 'PMEGP Subsidy Scheme', count: 42, pct: '48%', color: '#002970' },
              { scheme: 'MUDRA Tarun / Kishore', count: 24, pct: '28%', color: '#00BAF2' },
              { scheme: 'CGTMSE Credit Guarantee', count: 12, pct: '14%', color: '#16A34A' },
              { scheme: 'State Industrial Subsidies', count: 8, pct: '10%', color: '#F59E0B' }
            ].map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '600', color: '#1E293B' }}>{item.scheme}</span>
                  <span style={{ fontWeight: '700', color: '#002970' }}>{item.count} Cases ({item.pct})</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: item.pct, height: '100%', background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
