import React from 'react';

export const EnterpriseSkeleton = ({ count = 4, height = 36, style }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', ...style }}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          style={{
            height: `${height}px`,
            background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)',
            backgroundSize: '200% 100%',
            borderRadius: '6px',
            animation: 'skeletonShimmer 1.5s infinite'
          }}
        />
      ))}
    </div>
  );
};

export const EnterpriseCardSkeleton = ({ count = 4 }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${count}, 1fr)`, gap: '16px' }}>
      {[...Array(count)].map((_, i) => (
        <div key={i} style={{ background: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0' }}>
          <div style={{ width: '40%', height: '14px', background: '#F1F5F9', borderRadius: '4px', marginBottom: '10px' }} />
          <div style={{ width: '70%', height: '28px', background: '#E2E8F0', borderRadius: '6px', marginBottom: '8px' }} />
          <div style={{ width: '50%', height: '12px', background: '#F1F5F9', borderRadius: '4px' }} />
        </div>
      ))}
    </div>
  );
};
