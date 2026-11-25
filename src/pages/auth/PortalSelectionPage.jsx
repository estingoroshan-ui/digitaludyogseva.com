import React from 'react';
import { useRouter } from '../../router/Router';
import { 
  Users, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  Clock, 
  FolderLock, 
  CreditCard, 
  CheckCircle2, 
  PhoneCall, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const PortalSelectionPage = () => {
  const { navigate } = useRouter();

  const portals = [
    {
      id: 'customer',
      title: 'Customer Portal',
      subtitle: 'For MSME owners, subsidy applicants & entrepreneurs',
      badge: 'Client Self-Service',
      badgeColor: '#00BAF2',
      icon: Users,
      path: '/customer/login',
      ctaText: 'Access Customer Portal',
      secondaryLink: { label: 'New Customer? Register Now', path: '/customer/register' },
      features: [
        'Real-time PMEGP, Mudra & Subsidy tracking',
        'Digital Document Vault & KYC compliance',
        'Invoices, payment receipts & service ledger',
        'Direct chat & query resolution with RM'
      ]
    },
    {
      id: 'employee',
      title: 'Employee / Staff Portal',
      subtitle: 'For Scheme Advisors, DPR Executives & Case Managers',
      badge: 'Staff & Consultants',
      badgeColor: '#002970',
      icon: Briefcase,
      path: '/employee/login',
      ctaText: 'Employee Login',
      features: [
        'Assigned lead conversion & client dossiers',
        'Project milestone tracking & DPR submission',
        'Daily GPS/IP attendance punch & leave desk',
        'Salary structure, incentives & PDF payslips'
      ]
    },
    {
      id: 'admin',
      title: 'Enterprise Admin ERP',
      subtitle: 'For Directors, Branch Managers & System Auditors',
      badge: 'Restricted Access',
      badgeColor: '#DC2626',
      icon: ShieldCheck,
      path: '/admin/login',
      ctaText: 'Secure Admin Login',
      features: [
        'Full Enterprise ERP, CRM & 100-pt Scorecard',
        'Master Government Scheme & Subsidy catalog',
        'Accounting ledger, payouts & financial audits',
        '18 Configurable role templates & permissions'
      ]
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F4F8FC', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '16px 0', boxShadow: '0 2px 8px rgba(0, 41, 112, 0.04)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div 
            onClick={() => navigate('/')} 
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <img 
              src="/assets/logo.webp" 
              alt="Digital Udyog Seva" 
              style={{ width: '42px', height: '42px', objectFit: 'contain' }}
              onError={(e) => { e.target.src = '/assets/logo.png'; }}
            />
            <div>
              <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#002970', display: 'block', lineHeight: 1.1 }}>
                Digital Udyog <span style={{ color: '#00BAF2' }}>Seva</span>
              </span>
              <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Government Scheme &amp; Advisory Hub
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              border: '1px solid #CBD5E1',
              color: '#002970',
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Back to Website
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '48px 16px' }}>
        <div className="container" style={{ maxWidth: '1160px', margin: '0 auto' }}>
          {/* Headline */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: 'rgba(0, 186, 242, 0.1)', 
              color: '#007AA6', 
              padding: '6px 14px', 
              borderRadius: '20px', 
              fontSize: '0.78rem', 
              fontWeight: '700', 
              marginBottom: '12px' 
            }}>
              <Sparkles size={14} color="#00BAF2" /> Unified Enterprise Authentication Gateway
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#002970', marginBottom: '10px' }}>
              Select Your Secure Portal
            </h1>
            <p style={{ color: '#475569', fontSize: '1.02rem', maxWidth: '640px', margin: '0 auto' }}>
              Choose your dedicated workspace to access consultancy cases, track loan files, submit documents, or manage enterprise business operations.
            </p>
          </div>

          {/* 3 Portal Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '24px',
            marginBottom: '40px'
          }}>
            {portals.map((portal) => {
              const Icon = portal.icon;
              return (
                <div 
                  key={portal.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 20px rgba(0, 41, 112, 0.06)',
                    padding: '32px 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 41, 112, 0.12)';
                    e.currentTarget.style.borderColor = '#00BAF2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 41, 112, 0.06)';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: portal.badgeColor }} />

                  <div>
                    {/* Card Top */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                      <div style={{ 
                        width: '52px', 
                        height: '52px', 
                        borderRadius: '14px', 
                        background: `${portal.badgeColor}12`, 
                        color: portal.badgeColor,
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        <Icon size={26} strokeWidth={2.2} />
                      </div>
                      <span style={{ 
                        fontSize: '0.72rem', 
                        fontWeight: '800', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.04em',
                        color: portal.badgeColor,
                        background: `${portal.badgeColor}10`,
                        padding: '4px 10px',
                        borderRadius: '6px'
                      }}>
                        {portal.badge}
                      </span>
                    </div>

                    <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#002970', marginBottom: '6px' }}>
                      {portal.title}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: '1.5', marginBottom: '20px' }}>
                      {portal.subtitle}
                    </p>

                    <div style={{ height: '1px', background: '#F1F5F9', margin: '16px 0' }} />

                    {/* Features List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                      {portal.features.map((feat, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: '#334155' }}>
                          <CheckCircle2 size={16} color="#16A34A" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => navigate(portal.path)}
                      style={{
                        width: '100%',
                        background: portal.id === 'customer' 
                          ? 'linear-gradient(135deg, #002970 0%, #001B48 100%)' 
                          : portal.id === 'employee' 
                            ? '#002970' 
                            : '#001B48',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '12px 20px',
                        fontSize: '0.92rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(0, 41, 112, 0.15)',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#00BAF2'}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = portal.id === 'customer' 
                          ? 'linear-gradient(135deg, #002970 0%, #001B48 100%)' 
                          : portal.id === 'employee' 
                            ? '#002970' 
                            : '#001B48';
                      }}
                    >
                      <span>{portal.ctaText}</span>
                      <ArrowRight size={16} />
                    </button>

                    {portal.secondaryLink && (
                      <div style={{ textAlign: 'center', marginTop: '14px' }}>
                        <button
                          onClick={() => navigate(portal.secondaryLink.path)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#007AA6',
                            fontSize: '0.82rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          {portal.secondaryLink.label}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Security & Help Desk Info */}
          <div style={{ 
            background: '#FFFFFF', 
            borderRadius: '12px', 
            padding: '20px 24px', 
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldCheck size={24} color="#16A34A" />
              <div>
                <span style={{ fontSize: '0.86rem', fontWeight: '700', color: '#002970', display: 'block' }}>
                  256-Bit SSL Encrypted &amp; ISO 9001:2015 Quality Certified
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  All client financial profiles and DPR calculations are secured with bank-grade encryption protocols.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748B' }}>Need Login Help?</span>
              <a 
                href="tel:18008901234"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#F0F9FF',
                  color: '#007AA6',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  border: '1px solid #BAE6FD'
                }}
              >
                <PhoneCall size={14} /> 1800-890-1234
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
