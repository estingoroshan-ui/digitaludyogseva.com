import React, { useState } from 'react';
import { useRouter } from '../../router/Router';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  UserCheck, 
  Briefcase, 
  CreditCard, 
  Receipt, 
  UserCog, 
  Upload, 
  X, 
  ArrowRight,
  PlusCircle,
  FileCheck,
  Calculator
} from 'lucide-react';

export const EnterpriseQuickCreateModal = ({ isOpen, onClose }) => {
  const { navigate } = useRouter();
  const { showToast } = useApp();

  if (!isOpen) return null;

  const quickActions = [
    {
      title: 'New Lead',
      desc: 'Capture incoming business or scheme enquiry',
      icon: Users,
      color: '#00BAF2',
      action: () => {
        onClose();
        navigate('/admin/leads/create');
      }
    },
    {
      title: 'New Customer',
      desc: 'Register verified business entity & promoter',
      icon: UserCheck,
      color: '#16A34A',
      action: () => {
        onClose();
        navigate('/admin/customers/create');
      }
    },
    {
      title: 'Create Project Case',
      desc: 'Initiate PMEGP, MUDRA or Subsidy project report',
      icon: Briefcase,
      color: '#002970',
      action: () => {
        onClose();
        navigate('/admin/projects/create');
      }
    },
    {
      title: 'Record Payment',
      desc: 'Log UPI, NEFT or Bank collection with instant receipt',
      icon: CreditCard,
      color: '#0284C7',
      action: () => {
        onClose();
        navigate('/admin/payments');
      }
    },
    {
      title: 'Create Tax Invoice',
      desc: 'Generate GST compliant invoice for consultancy fees',
      icon: Receipt,
      color: '#7C3AED',
      action: () => {
        onClose();
        navigate('/admin/invoices');
      }
    },
    {
      title: 'Onboard Employee',
      desc: 'Launch 5-step staff onboarding wizard',
      icon: UserCog,
      color: '#EA580C',
      action: () => {
        onClose();
        navigate('/admin/employees/create');
      }
    },
    {
      title: 'Upload Document',
      desc: 'Store KYC, DPR or Quotation in digital vault',
      icon: FileCheck,
      color: '#0D9488',
      action: () => {
        onClose();
        navigate('/admin/documents');
      }
    },
    {
      title: 'Scheme Eligibility Check',
      desc: 'Evaluate 100-point risk & subsidy scorecard',
      icon: Calculator,
      color: '#2563EB',
      action: () => {
        onClose();
        navigate('/admin/eligibility');
      }
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '20px',
      backdropFilter: 'blur(3px)'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        maxWidth: '720px',
        width: '100%',
        boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        border: '1px solid #E2E8F0',
        animation: 'fadeInScale 0.2s ease'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#F8FAFC'
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#002970', margin: '0 0 2px 0' }}>
              Quick Create
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', margin: 0 }}>
              Instantly create a new record across CRM, Projects, Finance, or Staff
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 2-Column Grid of Quick Action Cards */}
        <div style={{
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '14px',
          maxHeight: '70vh',
          overflowY: 'auto'
        }}>
          {quickActions.map((qa, idx) => {
            const Icon = qa.icon;
            return (
              <div
                key={idx}
                onClick={qa.action}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#00BAF2';
                  e.currentTarget.style.background = '#F0F9FF';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: `${qa.color}15`,
                  color: qa.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '700', color: '#002970', fontSize: '0.94rem' }}>
                    {qa.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {qa.desc}
                  </div>
                </div>
                <ArrowRight size={16} color="#94A3B8" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
