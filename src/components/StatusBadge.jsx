import React from 'react';

/**
 * Status Badge Component
 */
export const StatusBadge = ({ status }) => {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      fontSize: '11px',
      fontWeight: '500',
      borderRadius: '12px',
      backgroundColor: '#f3f4f6',
      color: '#6b7280',
    }}>
      {status}
    </span>
  );
};



