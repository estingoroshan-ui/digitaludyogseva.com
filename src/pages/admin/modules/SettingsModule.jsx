import React, { useState } from 'react';
import { useRouter } from '../../../router/Router';
import { useApp } from '../../../context/AppContext';
import { 
  Settings, 
  Building2, 
  ShieldCheck, 
  Users, 
  Key, 
  Bell, 
  Database, 
  CheckCircle2, 
  Save, 
  ArrowLeft 
} from 'lucide-react';

export const SettingsModule = () => {
  const { navigate } = useRouter();
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState('company');

  const [companySettings, setCompanySettings] = useState({
    companyName: 'Digital Udyog Seva Consultancy Services',
    brandName: 'ConsultancyERP',
    supportPhone: '+91 800-889-4422',
    supportEmail: 'contact@digitaludyogseva.com',
    headOffice: 'Plot 42, Malviya Nagar Industrial Area, Jaipur, Rajasthan 302017',
    gstin: '08AABCA1234A1Z5',
    pan: 'AABCA1234A',
    isoCertified: 'ISO 9001:2015 Certified'
  });

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Enterprise settings updated successfully', 'success');
  };

  return (
    <div>
      <div className="paytm-page-header">
        <div>
          <h1 className="paytm-page-title">Enterprise System Settings</h1>
          <p className="paytm-page-subtitle">
            Company profile, office branches, roles &amp; permissions, automated notifications and backup rules
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px' }}>
        {/* Navigation */}
        <div className="paytm-card" style={{ padding: '12px' }}>
          {[
            { id: 'company', label: 'Company Profile', icon: Building2 },
            { id: 'roles', label: 'Roles & Permissions', icon: ShieldCheck },
            { id: 'branches', label: 'Office Branches', icon: Users },
            { id: 'backup', label: 'Backup & Security', icon: Database }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: active ? '700' : '500',
                  color: active ? '#008BCB' : '#475569',
                  background: active ? '#E0F6FD' : 'transparent',
                  marginBottom: '4px'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </div>
            );
          })}
        </div>

        {/* Content Form */}
        <div className="paytm-card">
          <form onSubmit={handleSave}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#002970', marginBottom: '18px' }}>
              Company Legal Entity &amp; Advisory Branding
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
                  Registered Entity Name
                </label>
                <input 
                  type="text"
                  value={companySettings.companyName}
                  onChange={e => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
                  Platform Tagline / Brand
                </label>
                <input 
                  type="text"
                  value={companySettings.brandName}
                  onChange={e => setCompanySettings({ ...companySettings, brandName: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
                  Toll-Free Support Line
                </label>
                <input 
                  type="text"
                  value={companySettings.supportPhone}
                  onChange={e => setCompanySettings({ ...companySettings, supportPhone: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
                  Consultancy GSTIN
                </label>
                <input 
                  type="text"
                  value={companySettings.gstin}
                  onChange={e => setCompanySettings({ ...companySettings, gstin: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
              <button 
                type="submit" 
                className="paytm-btn paytm-btn-primary"
                style={{ fontWeight: '700', padding: '10px 22px' }}
              >
                <Save size={16} />
                <span>Save System Settings</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
