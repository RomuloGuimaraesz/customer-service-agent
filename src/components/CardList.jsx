import React, { useState, useMemo, useEffect } from 'react';
import { StatusBadge } from './StatusBadge';
import { TableList } from './TableList';

/**
 * Card List Component - Responsive (cards on mobile, table on desktop)
 */
export const CardList = ({ data, type }) => {
  const [filter, setFilter] = useState('');
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [data, filter]);

  const arrowIcon = `<svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.75 6.25H14.75M14.75 6.25L9.5 11.75M14.75 6.25L9.5 0.75" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  const searchIcon = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.875 12.875L8.87507 8.875M10.2083 5.54167C10.2083 8.119 8.119 10.2083 5.54167 10.2083C2.96434 10.2083 0.875 8.119 0.875 5.54167C0.875 2.96434 2.96434 0.875 5.54167 0.875C8.119 0.875 10.2083 2.96434 10.2083 5.54167Z" stroke="#9ca3af" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '100%',
        }}>
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }} dangerouslySetInnerHTML={{ __html: searchIcon }} />
          <input
            type="text"
            placeholder="Pesquisar"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 40px',
              fontSize: '14px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              color: '#111827',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#9ca3af'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>
      </div>

      {/* Desktop: Table View */}
      {isDesktop ? (
        <TableList data={filteredData} type={type} />
      ) : (
        /* Mobile: Card View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredData.length === 0 ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: '#6b7280',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
            }}>
              Nenhum registro encontrado
            </div>
          ) : (
            filteredData.map((row, idx) => (
              <div
                key={row.ID || idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <StatusBadge status={row.Status || '-'} />
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {row.Data || '-'}
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                    {row.Cliente || '-'}
                  </div>
                  {row.Valor && (
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                      {row.Valor}
                    </div>
                  )}
                </div>

                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                  {row.Descrição || '-'}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {row.ID || '-'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }} dangerouslySetInnerHTML={{ __html: arrowIcon }} />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

