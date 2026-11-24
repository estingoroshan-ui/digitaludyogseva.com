import React, { useState } from 'react';
import { useRouter } from '../../router/Router';
import { useApp } from '../../context/AppContext';
import { 
  Briefcase, 
  FileText, 
  CreditCard, 
  IndianRupee, 
  HelpCircle, 
  Phone, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Building2,
  FolderOpen
} from 'lucide-react';

export const CustomerPortal = () => {
  const { navigate } = useRouter();
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'projects' | 'documents' | 'payments'

  return (
    <div style={{ minHeight: '100vh', background: '#F4F7FA', paddingBottom: '80px' }}>
      {/* Top Mobile/App Header */}
      <div style={{ background: '#002970', color: '#FFFFFF', padding: '24px 20px 32px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <button 
              type="button" 
              onClick={() => navigate('/admin/dashboard')}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <ArrowLeft size={14} />
              <span>Admin ERP</span>
            </button>
            <span style={{ fontSize: '0.8rem', color: '#00BAF2', fontWeight: '700' }}>
              DUS Customer App
            </span>
          </div>

          <h1 style={{ fontSize: '1.45rem', fontWeight: '800', margin: '0 0 4px 0' }}>
            Customer Portal
          </h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#CBD5E1' }}>
            Welcome, Customer • Your business at a glance
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '480px', margin: '-18px auto 0', padding: '0 16px' }}>
        {/* Active Loan Card */}
        <div className="paytm-card" style={{ padding: '20px', borderRadius: '16px', marginBottom: '20px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '600' }}>
            Active Loan Application
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '900', color: '#002970', margin: '6px 0 2px' }}>
            ₹15,00,000
          </div>
          <div style={{ fontSize: '0.82rem', color: '#00BAF2', fontWeight: '700' }}>
            Application in progress • PMEGP Business Loan
          </div>

          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748B', marginBottom: '6px' }}>
              <span>Lifecycle Progress</span>
              <span style={{ fontWeight: '700', color: '#002970' }}>60% Completed</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '60%', height: '100%', background: '#00BAF2', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        {/* 6 Quick Action Tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'My Projects', icon: Briefcase, action: () => navigate('/admin/projects') },
            { label: 'My Documents', icon: FolderOpen, action: () => navigate('/admin/documents') },
            { label: 'Invoices', icon: FileText, action: () => navigate('/admin/invoices') },
            { label: 'Pay Fees', icon: CreditCard, action: () => showToast('Opening Razorpay Secure Checkout...', 'success') },
            { label: 'Transactions', icon: IndianRupee, action: () => navigate('/admin/payments') },
            { label: 'Help & Support', icon: HelpCircle, action: () => showToast('Connecting to your Relationship Manager...', 'success') }
          ].map((tile, idx) => {
            const Icon = tile.icon;
            return (
              <div
                key={idx}
                onClick={tile.action}
                className="paytm-card paytm-card-clickable"
                style={{
                  padding: '20px 14px',
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#E0F6FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color="#00BAF2" />
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#002970' }}>
                  {tile.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA: Contact Relationship Manager */}
        <button 
          type="button"
          onClick={() => showToast('Connecting call to CA Rajesh Verma: +91 800-889-4422', 'success')}
          className="paytm-btn paytm-btn-primary"
          style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '0.95rem', fontWeight: '800' }}
        >
          <Phone size={18} />
          <span>Contact Relationship Manager</span>
        </button>
      </div>
    </div>
  );
};
