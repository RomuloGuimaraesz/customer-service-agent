import React from 'react';

/**
 * Stats Card Component
 */
export const StatsCard = ({ iconSvg, label, value }) => (
  <div style={{
    padding: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }} dangerouslySetInnerHTML={{ __html: iconSvg }} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
        {value}
      </div>
    </div>
  </div>
);



