import React from 'react';
import { StatusBadge } from './StatusBadge';
import styled from 'styled-components';

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
  border-collapse: collapse;
  font-size: ${props => props.theme.fontSize.base};
`;

/**
 * Table Header Row - BEM: data-display__table-header-row
 */
const StyledTableHeaderRow = styled.tr`
  background-color: ${props => props.theme.colors.background.tertiary};
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
 */
const StyledTableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border.primary};
  transition: background-color ${props => props.theme.transitions.normal};
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.colors.background.tertiary};
  }
`;

/**
 * Table Body Cell - BEM: data-display__table-cell
 */
const StyledTableCell = styled.td`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  color: ${props => {
    if (props.isStatus) return 'inherit';
    if (props.isId) return props.theme.colors.text.tertiary;
    return props.theme.colors.text.primary;
  }};
  font-size: ${props => props.isId ? props.theme.fontSize.sm : props.theme.fontSize.base};
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
 */
export const TableList = ({ data, type }) => {
  if (data.length === 0) {
    return (
      <StyledEmptyState className="data-display__table-empty">
        Nenhum registro encontrado
      </StyledEmptyState>
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
            {data.map((row, idx) => (
              <StyledTableRow key={row.ID || idx} className="data-display__table-row">
                {columns.map((col) => (
                  <StyledTableCell
                    key={col.key}
                    isStatus={col.key === 'Status'}
                    isId={col.key === 'ID'}
                    className="data-display__table-cell"
                  >
                    {col.key === 'Status' ? (
                      <StatusBadge status={row.Status || '-'} />
                    ) : (
                      <span>{row[col.key] || '-'}</span>
                    )}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </tbody>
        </StyledTable>
      </StyledTableWrapper>
    </StyledTableContainer>
  );
};
