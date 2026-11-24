import React from 'react';
import { Inbox, Plus } from 'lucide-react';

export const EnterpriseEmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no records to display matching your current selection.',
  actionLabel,
  onAction
}) => {
  return (
    <div style={{
      padding: '48px 24px',
      textAlign: 'center',
      background: '#FFFFFF',
      borderRadius: '12px',
      border: '1px dashed #CBD5E1',
      margin: '16px 0'
    }}>
      <div style={{
        width: '54px',
        height: '54px',
        borderRadius: '50%',
        background: '#F1F5F9',
        color: '#64748B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px'
      }}>
        <Icon size={26} color="#00BAF2" />
      </div>

      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#002970', margin: '0 0 6px 0' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.86rem', color: '#64748B', maxWidth: '420px', margin: '0 auto 20px', lineHeight: '1.5' }}>
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          style={{
            padding: '9px 20px',
            background: '#00BAF2',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '700',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(0,186,242,0.25)'
          }}
        >
          <Plus size={16} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
