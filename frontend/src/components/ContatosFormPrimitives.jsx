import styled, { css } from 'styled-components';
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
 * Mobile layout for contatos-form cells inside searchable-layout__column--primary.
 * Row 1: nome | Row 2: whatsapp + data nascimento | Row 3: cep + idade | … | mais informações full row
 */
export const contatosFormMobileGridStyles = css`
  @media (max-width: 767px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: none;
    grid-auto-rows: minmax(70px, auto);

    .contatos-form__cell--nome-completo {
      grid-row: 1;
      grid-column: 1 / -1;
    }

    .contatos-form__cell--whatsapp {
      grid-row: 2;
      grid-column: 1;
    }

    .contatos-form__cell--data-nascimento {
      grid-row: 2;
      grid-column: 2;
    }

    .contatos-form__cell--cep {
      grid-row: 3;
      grid-column: 1;
    }

    .contatos-form__cell--idade {
      grid-row: 3;
      grid-column: 2;
    }

    .contatos-form__cell--endereco {
      grid-row: 4;
      grid-column: 1 / -1;
    }

    .contatos-form__cell--numero {
      grid-row: 5;
      grid-column: 1;
    }

    .contatos-form__cell--endereco-complemento {
      grid-row: 6;
      grid-column: 1 / -1;
    }

    .contatos-form__cell--bairro {
      grid-row: 7;
      grid-column: 1;
    }

    .contatos-form__cell--bairro-complemento {
      grid-row: 8;
      grid-column: 1 / -1;
    }

    .contatos-form__cell--cidade {
      grid-row: 9;
      grid-column: 1;
    }

    .contatos-form__cell--estado {
      grid-row: 9;
      grid-column: 2;
    }

    .contatos-form__cell--mais-informacoes {
      grid-row: 10;
      grid-column: 1 / -1;
    }

    .contatos-form__cell--submit {
      grid-row: 11;
      grid-column: 1 / -1;
    }
  }
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
