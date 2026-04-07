import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Modal } from './Modal';
import {
  getCategorias,
  resolveCategoriaOptionValue,
} from '../services/categoriasApi';
import {
  ContatosFieldContainer,
  ContatosFormCell,
  ContatosFormCellSpan2,
  ContatosFormCellSpan3,
  ContatosFormColumnGrid,
} from './ContatosFormPrimitives';
import { FieldInput, FieldLabel, FormSubmitButton } from './form';

/** Native select, aligned with FieldInput (contatos-form__select). */
const FieldSelect = styled.select`
  width: 100%;
  min-width: 0;
  height: 100%;
  padding: 0;
  font-size: ${p => p.theme.fontSize.base};
  border: none;
  border-radius: 0;
  background-color: transparent;
  color: ${p => p.theme.colors.text.primary};
  outline: none;
  box-sizing: border-box;
  cursor: pointer;
  appearance: none;

  &.contatos-form__select--placeholder {
    color: ${p => p.theme.colors.text.secondary};
  }
`;

/**
 * Card shell + width: desktop ≈ left column of contatos (same math as SearchableLayout 50% track);
 * mobile ≈ usable width like detail modals (viewport minus overlay padding).
 */
const ModalInner = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: calc(100vw - 2 * ${p => p.theme.spacing.xl});
  max-height: 90vh;
  margin: 0 auto;
  overflow: auto;
  display: flex;
  flex-direction: column;
  background-color: ${p => p.theme.colors.background.secondary};
  border-radius: ${p => p.theme.borderRadius.md};
  box-shadow: ${p => p.theme.shadows.lg};

  @media (min-width: 768px) {
    max-width: calc(
      (100vw - 2 * ${p => p.theme.spacing['3xl']} - ${p => p.theme.spacing.lg}) / 2
    );
  }
`;

const StyledModalHeader = styled.div`
  padding: ${p => p.theme.spacing.xl};
  border-bottom: 1px solid ${p => p.theme.colors.border.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

const StyledModalTitle = styled.h2`
  font-size: ${p => p.theme.fontSize['2xl']};
  font-weight: ${p => p.theme.fontWeight.bold};
  color: ${p => p.theme.colors.text.primary};
  margin: 0;
`;

const StyledCloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${p => p.theme.fontSize['2xl']};
  color: ${p => p.theme.colors.text.secondary};
  cursor: pointer;
  padding: ${p => p.theme.spacing.xs};
  line-height: 1;
  transition: color ${p => p.theme.transitions.fast} ease;

  &:hover {
    color: ${p => p.theme.colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${p => p.theme.colors.focus.ring};
    outline-offset: 2px;
  }
`;

const StyledModalBody = styled.div`
  padding: ${p => p.theme.spacing.xl};
  flex: 1;
  min-height: 0;
  overflow: auto;
`;

const CategoriaError = styled.p`
  margin: ${p => p.theme.spacing.xs} 0 0;
  font-size: ${p => p.theme.fontSize.sm};
  color: ${p => p.theme.colors.status.errorText};
`;

export const createInitialMaisInfoValues = () => ({
  indicacao: '',
  categoria: '',
  cpf: '',
  tituloEleitor: '',
  zonaEleitoral: '',
  secaoEleitoral: '',
});

/**
 * Campos complementares — controlado pelo pai. BEM: contatos-mais-info-modal
 *
 * @param {ReturnType<createInitialMaisInfoValues>} props.values
 * @param {(field: string, value: string) => void} props.onMaisInfoChange
 * @param {() => void} props.onSaveInformacoesAdicionais - ação local (fecha/conclui); persistência ocorre no submit principal
 * @param {() => string | null} props.getAuthHeader — Authorization para GET em CONFIG.API_ENDPOINTS.categorias
 */
export const ContatosMaisInformacoesModal = ({
  isOpen,
  onClose,
  values,
  onMaisInfoChange,
  onSaveInformacoesAdicionais,
  getAuthHeader,
}) => {
  const [categoriaOptions, setCategoriaOptions] = useState([]);
  const [categoriasLoading, setCategoriasLoading] = useState(false);
  const [categoriasError, setCategoriasError] = useState('');

  useEffect(() => {
    if (!isOpen || !getAuthHeader) return undefined;
    let cancelled = false;
    setCategoriasLoading(true);
    setCategoriasError('');
    getCategorias(getAuthHeader())
      .then(rows => {
        if (!cancelled) setCategoriaOptions(rows);
      })
      .catch(err => {
        if (!cancelled) {
          setCategoriaOptions([]);
          setCategoriasError(
            err?.message || 'Não foi possível carregar as categorias.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setCategoriasLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, getAuthHeader]);

  const selectCategoriaValue = useMemo(
    () => resolveCategoriaOptionValue(values.categoria, categoriaOptions),
    [values.categoria, categoriaOptions],
  );

  const optionsForSelect = useMemo(() => {
    const base = [...categoriaOptions];
    if (
      selectCategoriaValue &&
      !base.some(o => o.value === selectCategoriaValue)
    ) {
      base.push({
        value: selectCategoriaValue,
        label: selectCategoriaValue,
      });
    }
    return base;
  }, [categoriaOptions, selectCategoriaValue]);

  useEffect(() => {
    if (!isOpen || !categoriaOptions.length || !values.categoria) return;
    const resolved = resolveCategoriaOptionValue(
      values.categoria,
      categoriaOptions,
    );
    if (
      resolved &&
      resolved !== values.categoria &&
      categoriaOptions.some(o => o.value === resolved)
    ) {
      onMaisInfoChange('categoria', resolved);
    }
  }, [
    isOpen,
    categoriaOptions,
    values.categoria,
    onMaisInfoChange,
  ]);

  const handleSaveClick = () => {
    onSaveInformacoesAdicionais?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} bareContent>
      <ModalInner className="contatos-mais-info-modal__inner">
        <StyledModalHeader className="contatos-mais-info-modal__header">
          <StyledModalTitle
            id="contatos-mais-info-modal-title"
            className="contatos-mais-info-modal__title"
          >
            Mais informações
          </StyledModalTitle>
          <StyledCloseButton
            type="button"
            className="contatos-mais-info-modal__close-button"
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </StyledCloseButton>
        </StyledModalHeader>
        <StyledModalBody className="contatos-mais-info-modal__body">
          <ContatosFormColumnGrid
            as="form"
            className="contatos-mais-info-modal__grid contatos-form"
            onSubmit={e => e.preventDefault()}
            noValidate
            aria-labelledby="contatos-mais-info-modal-title"
          >
            <ContatosFormCellSpan2 className="contatos-form__cell contatos-form__cell--indicacao">
              <ContatosFieldContainer $borderless className="contatos-form__field-container">
                <FieldLabel htmlFor="mais-info-indicacao" className="contatos-form__label">
                  Indicação
                </FieldLabel>
                <FieldInput
                  id="mais-info-indicacao"
                  name="indicacao"
                  autoComplete="off"
                  placeholder="Digite quem Indicou"
                  value={values.indicacao}
                  onChange={e => onMaisInfoChange('indicacao', e.target.value)}
                  className="contatos-form__input"
                />
              </ContatosFieldContainer>
            </ContatosFormCellSpan2>
            <ContatosFormCell className="contatos-form__cell contatos-form__cell--categoria">
              <ContatosFieldContainer $borderless className="contatos-form__field-container">
                <FieldLabel htmlFor="mais-info-categoria" className="contatos-form__label">
                  Categoria
                </FieldLabel>
                <FieldSelect
                  id="mais-info-categoria"
                  name="categoria"
                  value={selectCategoriaValue}
                  disabled={categoriasLoading}
                  onChange={e => onMaisInfoChange('categoria', e.target.value)}
                  className={`contatos-form__select${selectCategoriaValue ? '' : ' contatos-form__select--placeholder'}`}
                  aria-label="Categoria"
                  aria-busy={categoriasLoading}
                >
                  <option value="">
                    {categoriasLoading ? 'Carregando...' : 'Selecione a categoria'}
                  </option>
                  {optionsForSelect.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </FieldSelect>
                {categoriasError ? (
                  <CategoriaError role="alert">{categoriasError}</CategoriaError>
                ) : null}
              </ContatosFieldContainer>
            </ContatosFormCell>
            <ContatosFormCell className="contatos-form__cell contatos-form__cell--cpf">
              <ContatosFieldContainer $borderless className="contatos-form__field-container">
                <FieldLabel htmlFor="mais-info-cpf" className="contatos-form__label">
                  CPF
                </FieldLabel>
                <FieldInput
                  id="mais-info-cpf"
                  name="cpf"
                  autoComplete="off"
                  inputMode="numeric"
                  placeholder="Digite o CPF"
                  value={values.cpf}
                  onChange={e => onMaisInfoChange('cpf', e.target.value)}
                  className="contatos-form__input"
                />
              </ContatosFieldContainer>
            </ContatosFormCell>
            <ContatosFormCellSpan2 className="contatos-form__cell contatos-form__cell--titulo-eleitor">
              <ContatosFieldContainer $borderless className="contatos-form__field-container">
                <FieldLabel htmlFor="mais-info-titulo-eleitor" className="contatos-form__label">
                  Título de Eleitor
                </FieldLabel>
                <FieldInput
                  id="mais-info-titulo-eleitor"
                  name="tituloEleitor"
                  autoComplete="off"
                  placeholder="Digite o Título de Eleitor"
                  value={values.tituloEleitor}
                  onChange={e => onMaisInfoChange('tituloEleitor', e.target.value)}
                  className="contatos-form__input"
                />
              </ContatosFieldContainer>
            </ContatosFormCellSpan2>
            <ContatosFormCell className="contatos-form__cell contatos-form__cell--zona-eleitoral">
              <ContatosFieldContainer $borderless className="contatos-form__field-container">
                <FieldLabel htmlFor="mais-info-zona-eleitoral" className="contatos-form__label">
                  Zona Eleitoral
                </FieldLabel>
                <FieldInput
                  id="mais-info-zona-eleitoral"
                  name="zonaEleitoral"
                  autoComplete="off"
                  inputMode="numeric"
                  placeholder="Digite a Zona Eleitoral"
                  value={values.zonaEleitoral}
                  onChange={e => onMaisInfoChange('zonaEleitoral', e.target.value)}
                  className="contatos-form__input"
                />
              </ContatosFieldContainer>
            </ContatosFormCell>
            <ContatosFormCell className="contatos-form__cell contatos-form__cell--secao-eleitoral">
              <ContatosFieldContainer $borderless className="contatos-form__field-container">
                <FieldLabel htmlFor="mais-info-secao-eleitoral" className="contatos-form__label">
                  Seção Eleitoral
                </FieldLabel>
                <FieldInput
                  id="mais-info-secao-eleitoral"
                  name="secaoEleitoral"
                  autoComplete="off"
                  inputMode="numeric"
                  placeholder="Digite a Seção Eleitoral"
                  value={values.secaoEleitoral}
                  onChange={e => onMaisInfoChange('secaoEleitoral', e.target.value)}
                  className="contatos-form__input"
                />
              </ContatosFieldContainer>
            </ContatosFormCell>
            <ContatosFormCellSpan3 className="contatos-form__cell contatos-form__cell--mais-info-submit">
              <FormSubmitButton
                type="button"
                className="contatos-mais-info-modal__submit-button"
                onClick={handleSaveClick}
              >
                Concluir
              </FormSubmitButton>
            </ContatosFormCellSpan3>
          </ContatosFormColumnGrid>
        </StyledModalBody>
      </ModalInner>
    </Modal>
  );
};
