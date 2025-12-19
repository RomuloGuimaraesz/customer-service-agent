import React from 'react';
import { StatusBadge } from './StatusBadge';

/**
 * Table List Component - Desktop view
 */
export const TableList = ({ data, type }) => {
  if (data.length === 0) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: '#6b7280',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
      }}>
        Nenhum registro encontrado
      </div>
    );
  }

  // Determine columns based on data type
  const getColumns = () => {
    if (type === 'pedidos') {
      return [
        { key: 'Status', label: 'Status', width: '120px' },
        { key: 'Data', label: 'Data', width: '120px' },
        { key: 'Cliente', label: 'Cliente', width: '180px' },
        { key: 'Valor', label: 'Valor', width: '120px' },
        { key: 'Descrição', label: 'Descrição', width: 'auto' },
        { key: 'ID', label: 'ID', width: '150px' },
      ];
    } else {
      // agendamentos
      return [
        { key: 'Status', label: 'Status', width: '120px' },
        { key: 'Data', label: 'Data', width: '180px' },
        { key: 'Cliente', label: 'Cliente', width: '180px' },
        { key: 'Produto', label: 'Produto', width: '180px' },
        { key: 'Descrição', label: 'Descrição', width: 'auto' },
        { key: 'ID', label: 'ID', width: '150px' },
      ];
    }
  };

  const columns = getColumns();

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#f9fafb',
              borderBottom: '2px solid #e5e7eb',
            }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#111827',
                    fontSize: '13px',
                    width: col.width === 'auto' ? 'auto' : col.width,
                    minWidth: col.width === 'auto' ? '200px' : col.width,
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row.ID || idx}
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: '12px 16px',
                      color: col.key === 'Status' ? 'inherit' : col.key === 'ID' ? '#9ca3af' : '#111827',
                      fontSize: col.key === 'ID' ? '12px' : '14px',
                    }}
                  >
                    {col.key === 'Status' ? (
                      <StatusBadge status={row.Status || '-'} />
                    ) : (
                      <span>{row[col.key] || '-'}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};



