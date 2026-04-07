import styled from 'styled-components';
import { FieldContainer } from './form';

export const ContatosFieldContainer = styled(FieldContainer)`
  background-color: ${p => p.theme.colors.background.white};
`;

/** Grid cell — matches searchable-layout__column--primary placement (form uses display:contents on <form>). */
export const ContatosFormCell = styled.div`
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: stretch;
`;

export const ContatosFormCellSpan2 = styled(ContatosFormCell)`
  grid-column: span 2;
`;

export const ContatosFormCellSpan3 = styled(ContatosFormCell)`
  grid-column: 1 / -1;
`;

/**
 * Same grid as SearchableLayout `searchable-layout__column--primary` (3 cols, 70px rows, gaps).
 * Use inside modal or any standalone column that should match the contatos left panel.
 */
export const ContatosFormColumnGrid = styled.div`
  box-sizing: border-box;
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(6, 70px);
  grid-auto-rows: 70px;
  column-gap: ${p => p.theme.spacing.lg};
  row-gap: ${p => p.theme.spacing.sm};
  align-content: start;
`;
