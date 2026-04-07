import React, { useState, useRef, useLayoutEffect, useCallback } from 'react';
import { StatusBadge } from './StatusBadge';
import styled from 'styled-components';
import { PedidoDetailModal } from './PedidoDetailModal';
import { AtendimentoDetailModal } from './AtendimentoDetailModal';

/**
 * Table Container - BEM: data-display__table
 */
const StyledTableContainer = styled.div`
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 1px solid ${props => props.theme.colors.border.primary};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.sm};
`;

/**
 * Table Wrapper - BEM: data-display__table-wrapper
 */
const StyledTableWrapper = styled.div`
  overflow-x: auto;
`;

/**
 * Table - BEM: data-display__table-element
 */
const StyledTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: ${props => props.theme.fontSize.base};
`;

/**
 * Table Header Row - BEM: data-display__table-header-row
 */
const StyledTableHeaderRow = styled.tr`
  background-color: ${props => props.theme.colors.background.secondary};
  border-bottom: 2px solid ${props => props.theme.colors.border.primary};
`;

/**
 * Table Header Cell - BEM: data-display__table-header-cell
 */
const StyledTableHeaderCell = styled.th`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  text-align: left;
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fontSize.md};
  width: ${props => props.width === 'auto' ? 'auto' : props.width};
  min-width: ${props => props.width === 'auto' ? '200px' : props.width};
`;

/**
 * Table Body Row - BEM: data-display__table-row
 * Fixed height for standardized row appearance
 * Grows when Assunto cell is expanded
 * $clickable: when false, no pointer cursor or hover (modal disabled on desktop)
 */
const StyledTableRow = styled.tr`
  height: ${props => props.$expanded ? 'auto' : '3.5rem'};
  min-height: 3.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border.primary};
  transition: background-color ${props => props.theme.transitions.normal};
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  background-color: ${props => props.theme.colors.background.white};

  &:nth-child(even) {
    background-color: ${props => props.theme.colors.background.primary};
  }

  &:hover {
    ${props =>
      props.$clickable &&
      `background-color: ${props.theme.colors.background.tertiary};`}
  }
`;

/**
 * Table Body Cell - BEM: data-display__table-cell
 * Max 2 lines with ellipsis for overflow
 */
const StyledTableCell = styled.td`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  color: ${props => {
    if (props.isStatus) return 'inherit';
    if (props.isId) return props.theme.colors.text.tertiary;
    return props.theme.colors.text.primary;
  }};
  font-size: ${props => props.isId ? props.theme.fontSize.sm : props.theme.fontSize.base};
  vertical-align: ${props => props.$expandableExpanded ? 'top' : 'middle'};
  overflow: ${props => props.$expandableExpanded ? 'visible' : 'hidden'};
`;

/**
 * Cell content wrapper - ensures consistent 2-line truncation
 * $expanded: shows full text when Assunto cell is clicked
 */
const StyledCellContent = styled.span`
  display: ${props => props.$expanded ? 'block' : '-webkit-box'};
  -webkit-line-clamp: ${props => props.$expanded ? 'unset' : '2'};
  -webkit-box-orient: vertical;
  overflow: ${props => props.$expanded ? 'visible' : 'hidden'};
  text-overflow: ${props => props.$expanded ? 'clip' : 'ellipsis'};
  line-height: 1.4;
  word-break: break-word;
  width: 100%;
`;

/**
 * Empty State - BEM: data-display__table-empty
 */
const StyledEmptyState = styled.div`
  padding: ${props => props.theme.spacing['4xl']};
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 1px solid ${props => props.theme.colors.border.primary};
`;

/**
 * Table List Component - Desktop view
 * @param {boolean} [enableModalOnRowClick=true] - When false, row clicks do not open detail modal (modal only on mobile)
 */
export const TableList = ({ data, type, enableModalOnRowClick = true }) => {
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [selectedAtendimento, setSelectedAtendimento] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedRowIds, setExpandedRowIds] = useState(new Set());
  const [truncatedRowIds, setTruncatedRowIds] = useState(new Set());
  const assuntoRefs = useRef({});

  const adaptedData = data;

  const toggleAssuntoExpand = (e, rowId) => {
    e.stopPropagation();
    setExpandedRowIds(prev => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };

  const checkTruncation = useCallback(() => {
    if (type !== 'agendamentos' && type !== 'pedidos' && type !== 'atendimentos') return;
    setTruncatedRowIds(prev => {
      const next = new Set();
      Object.entries(assuntoRefs.current).forEach(([rowId, el]) => {
        if (el && !expandedRowIds.has(rowId) && el.scrollHeight > el.clientHeight) {
          next.add(rowId);
        }
      });
      if (prev.size !== next.size || [...prev].some(id => !next.has(id))) {
        return next;
      }
      return prev;
    });
  }, [type, expandedRowIds]);

  useLayoutEffect(() => {
    if (type !== 'agendamentos' && type !== 'pedidos' && type !== 'atendimentos') return;
    checkTruncation();
  }, [type, data, expandedRowIds, checkTruncation]);

  useLayoutEffect(() => {
    if (type !== 'agendamentos' && type !== 'pedidos' && type !== 'atendimentos') return;
    const wrapper = document.querySelector('.data-display__table-wrapper');
    if (!wrapper) return;
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(checkTruncation);
    });
    resizeObserver.observe(wrapper);
    return () => resizeObserver.disconnect();
  }, [type, checkTruncation]);

  if (data.length === 0) {
    return (
      <StyledEmptyState className="data-display__table-empty">
        Nenhum registro encontrado
      </StyledEmptyState>
    );
  }

  const handleRowClick = (row) => {
    if (!enableModalOnRowClick) return;
    if (type === 'pedidos') {
      setSelectedPedido(row);
      setIsModalOpen(true);
    } else if (type === 'atendimentos') {
      setSelectedAtendimento(row);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPedido(null);
    setSelectedAtendimento(null);
  };

  // Determine columns based on data type
  const getColumns = () => {
    if (type === 'pedidos' || type === 'atendimentos') {
      // columns from Avecta AI - Pedidos.csv / Atendimentos.csv (Descricao Completa hidden in table UI)
      return [
        { key: 'ID', label: 'ID', width: '150px' },
        { key: 'Status', label: 'Status', width: '110px' },
        { key: 'Data', label: 'Data', width: '110px' },
        { key: 'Hora', label: 'Hora', width: '95px' },
        { key: 'Nome', label: 'Nome', width: '160px' },
        { key: 'WhatsApp', label: 'WhatsApp', width: '110px' },
        { key: 'Prioridade', label: 'Prioridade', width: '110px' },
        { key: 'Assunto', label: 'Assunto', width: '200px' },
      ];
    } else {
      // agendamentos - columns from Avecta AI - Agendamentos.csv (Descrição Completa hidden in table UI)
      return [
        { key: 'ID', label: 'ID', width: '140px' },
        { key: 'Status', label: 'Status', width: '110px' },
        { key: 'Dia da Semana', label: 'Dia da Semana', width: '120px' },
        { key: 'Data', label: 'Data', width: '110px' },
        { key: 'Hora', label: 'Hora', width: '95px' },
        { key: 'Nome', label: 'Nome', width: '160px' },
        { key: 'WhatsApp', label: 'WhatsApp', width: '110px' },
        { key: 'Assunto', label: 'Assunto', width: '200px' },
      ];
    }
  };

  const columns = getColumns();

  return (
    <StyledTableContainer className="data-display__table">
      <StyledTableWrapper className="data-display__table-wrapper">
        <StyledTable className="data-display__table-element">
          <thead>
            <StyledTableHeaderRow className="data-display__table-header-row">
              {columns.map((col) => (
                <StyledTableHeaderCell
                  key={col.key}
                  width={col.width}
                  className="data-display__table-header-cell"
                >
                  {col.label}
                </StyledTableHeaderCell>
              ))}
            </StyledTableHeaderRow>
          </thead>
          <tbody>
            {adaptedData.map((row, idx) => {
              const rowId = row.ID || idx;
              const isAssuntoExpanded = expandedRowIds.has(rowId);

              return (
                <StyledTableRow 
                  key={rowId} 
                  className="data-display__table-row"
                  $expanded={isAssuntoExpanded}
                  $clickable={enableModalOnRowClick}
                  onClick={() => handleRowClick(row)}
                >
                  {columns.map((col) => {
                    const isAssunto = col.key === 'Assunto';
                    const isAssuntoExpandedForRow = expandedRowIds.has(rowId);
                    const isTruncated = truncatedRowIds.has(rowId);

                    return (
                      <StyledTableCell
                        key={col.key}
                        isStatus={col.key === 'Status'}
                        isId={col.key === 'ID'}
                        $expandableExpanded={isAssunto && isAssuntoExpandedForRow}
                        className="data-display__table-cell"
                      >
                        {isAssunto ? (
                          <StyledCellContent
                            ref={(el) => {
                              if (el) assuntoRefs.current[rowId] = el;
                              else delete assuntoRefs.current[rowId];
                            }}
                            $expanded={isAssuntoExpandedForRow}
                            onClick={(isTruncated || isAssuntoExpandedForRow) ? (e) => toggleAssuntoExpand(e, rowId) : undefined}
                            title={(isTruncated || isAssuntoExpandedForRow) ? (isAssuntoExpandedForRow ? 'Clique para recolher' : 'Clique para expandir') : undefined}
                            style={{ cursor: (isTruncated || isAssuntoExpandedForRow) ? 'pointer' : 'default' }}
                          >
                            {row[col.key] || '-'}
                          </StyledCellContent>
                        ) : (
                          <StyledCellContent>
                            {col.key === 'Status' ? (
                              <StatusBadge status={row.Status || '-'} />
                            ) : (
                              row[col.key] || '-'
                            )}
                          </StyledCellContent>
                        )}
                      </StyledTableCell>
                    );
                  })}
                </StyledTableRow>
              );
            })}
          </tbody>
        </StyledTable>
      </StyledTableWrapper>
      
      {enableModalOnRowClick && type === 'pedidos' && (
        <PedidoDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          pedido={selectedPedido}
        />
      )}
      {enableModalOnRowClick && type === 'atendimentos' && (
        <AtendimentoDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          atendimento={selectedAtendimento}
        />
      )}
    </StyledTableContainer>
  );
};
