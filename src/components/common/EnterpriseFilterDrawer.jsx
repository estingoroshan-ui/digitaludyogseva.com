import React from 'react';
import { X, Filter, RotateCcw } from 'lucide-react';

export const EnterpriseFilterDrawer = ({
  isOpen,
  onClose,
  title = 'Advanced Filters',
  filterFields = [],
  values = {},
  onChange,
  onReset,
  onApply
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.45)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
      backdropFilter: 'blur(2px)'
    }}>
      <div style={{
        width: '380px',
        maxWidth: '100%',
        height: '100%',
        background: '#FFFFFF',
        boxShadow: '-8px 0 25px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.25s ease'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#F8FAFC'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} color="#002970" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#002970', margin: 0 }}>
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body - Filter Fields */}
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {filterFields.map((field) => (
            <div key={field.key}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                {field.label}
              </label>

              {field.type === 'select' ? (
                <select
                  value={values[field.key] || 'all'}
                  onChange={(e) => onChange && onChange(field.key, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    color: '#1E293B',
                    outline: 'none',
                    background: '#FFFFFF'
                  }}
                >
                  <option value="all">All {field.label}</option>
                  {field.options?.map((opt, i) => {
                    const val = typeof opt === 'object' ? opt.value : opt;
                    const lbl = typeof opt === 'object' ? opt.label : opt;
                    return (
                      <option key={i} value={val}>{lbl}</option>
                    );
                  })}
                </select>
              ) : field.type === 'date' ? (
                <input
                  type="date"
                  value={values[field.key] || ''}
                  onChange={(e) => onChange && onChange(field.key, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    color: '#1E293B',
                    outline: 'none'
                  }}
                />
              ) : (
                <input
                  type="text"
                  placeholder={field.placeholder || `Filter by ${field.label}...`}
                  value={values[field.key] || ''}
                  onChange={(e) => onChange && onChange(field.key, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    color: '#1E293B',
                    outline: 'none'
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Drawer Footer Actions */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          gap: '10px',
          background: '#F8FAFC'
        }}>
          <button
            type="button"
            onClick={onReset}
            style={{
              flex: 1,
              padding: '10px',
              background: '#FFFFFF',
              color: '#475569',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={14} />
            <span>Reset All</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onApply && onApply();
              onClose();
            }}
            style={{
              flex: 1.5,
              padding: '10px',
              background: '#00BAF2',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '0.86rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,186,242,0.25)'
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
