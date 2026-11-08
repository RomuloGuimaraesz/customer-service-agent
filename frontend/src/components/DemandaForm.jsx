import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FieldInput, FieldLabel, FieldTextarea, FormSubmitButton } from './form';
import { ContatosFieldContainer } from './ContatosFormPrimitives';
import {
  extractBrazilianMobileDigits,
  formatBrazilianMobilePhone,
} from '../utils/brazilianPhoneMask';
import {
  DEMANDAS_RASCUNHO_KEY,
  isDraftEmpty,
  readJSON,
  removeKey,
  writeJSON,
} from '../utils/demandasStorage';
import { DEMANDA_CATEGORIAS, DIADEMA_BAIRROS } from '../data/demandasSeed';

// ============================================================================
// CONFIGURATION - Easy to find and change
// ============================================================================
const CONFIG = {
  formAriaLabel: 'Formulário de nova demanda',
  nomeLabel: 'Nome do munícipe',
  nomePlaceholder: 'Digite o nome',
  nomeError: 'Informe o nome do munícipe.',
  whatsappLabel: 'WhatsApp',
  whatsappPlaceholder: '(11) 99999-9999',
  bairroLabel: 'Bairro',
  bairroPlaceholder: 'Selecione o bairro',
  bairroError: 'Selecione o bairro.',
  categoriaLabel: 'Categoria',
  descricaoLabel: 'Descrição',
  descricaoPlaceholder: 'O que a pessoa está pedindo?',
  draftRestoredMessage: 'Retomamos de onde você parou',
  draftDiscardLabel: 'Descartar',
  submitLabel: 'Registrar demanda',
};

const DRAFT_DEBOUNCE_MS = 400;

const SELECT_CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23443D4F' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")";

// ============================================================================
// STYLED COMPONENTS - Grouped by section
// ============================================================================

// Layout
const FormRoot = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${p => p.theme.spacing.md};
  width: 100%;
  min-width: 0;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${p => p.theme.spacing.xs};
`;

// Fields
const DemandaFieldContainer = styled(ContatosFieldContainer)`
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 2px;
  min-height: 60px;
  max-height: none;
  padding: ${p => p.theme.spacing.sm} ${p => p.theme.spacing.lg};
  box-shadow: ${p =>
    p.$invalid ? `inset 0 0 0 1px ${p.theme.colors.status.error}` : 'none'};
`;

const DemandaInput = styled(FieldInput)`
  height: 28px;
  font-size: ${p => p.theme.fontSize.xl};
`;

const DemandaSelect = styled.select`
  width: 100%;
  min-width: 0;
  height: 28px;
  padding: 0 ${p => p.theme.spacing['2xl']} 0 0;
  border: none;
  background: transparent ${SELECT_CHEVRON} no-repeat right center;
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  font-family: inherit;
  font-size: ${p => p.theme.fontSize.xl};
  color: ${p =>
    p.$placeholder ? p.theme.colors.text.secondary : p.theme.colors.text.primary};
  cursor: pointer;
`;

const DemandaTextarea = styled(FieldTextarea)`
  min-height: 88px;
  font-size: ${p => p.theme.fontSize.xl};
`;

const RequiredMark = styled.span`
  color: ${p => p.theme.colors.status.error};
  margin-left: 2px;
`;

const FieldError = styled.p`
  margin: 0 0 0 ${p => p.theme.spacing.lg};
  font-size: ${p => p.theme.fontSize.sm};
  color: ${p => p.theme.colors.status.errorText};
`;

// Categoria chips
const ChipsFieldset = styled.fieldset`
  margin: 0;
  padding: 0;
  border: none;
  min-width: 0;
`;

const ChipsLegend = styled(FieldLabel)`
  padding: 0;
  margin-bottom: ${p => p.theme.spacing.sm};
`;

const ChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${p => p.theme.spacing.sm};
`;

const CategoriaChip = styled.button`
  box-sizing: border-box;
  min-height: 44px;
  padding: 0 ${p => p.theme.spacing.lg};
  border: 1px solid
    ${p => (p.$active ? p.theme.colors.button.primary : p.theme.colors.border.primary)};
  border-radius: 9999px;
  cursor: pointer;
  font-family: inherit;
  font-size: ${p => p.theme.fontSize.base};
  font-weight: ${p => p.theme.fontWeight.medium};
  transition: background-color ${p => p.theme.transitions.fast} ease,
    color ${p => p.theme.transitions.fast} ease;
  color: ${p => (p.$active ? p.theme.colors.text.light : p.theme.colors.text.primary)};
  background-color: ${p =>
    p.$active ? p.theme.colors.button.primary : p.theme.colors.background.white};

  &:hover {
    background-color: ${p =>
      p.$active ? p.theme.colors.button.primaryHover : p.theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${p => p.theme.colors.focus.ring};
    outline-offset: 2px;
  }
`;

// Draft notice
const DraftNotice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${p => p.theme.spacing.md};
  padding: ${p => p.theme.spacing.xs} ${p => p.theme.spacing.xs} ${p => p.theme.spacing.xs}
    ${p => p.theme.spacing.lg};
  border-radius: ${p => p.theme.borderRadius.lg};
  background-color: ${p => p.theme.colors.status.infoBg};
  color: ${p => p.theme.colors.status.infoText};
  font-size: ${p => p.theme.fontSize.base};
`;

const DraftDiscardButton = styled.button`
  min-height: 44px;
  padding: 0 ${p => p.theme.spacing.lg};
  border: none;
  border-radius: ${p => p.theme.borderRadius.md};
  background: transparent;
  color: ${p => p.theme.colors.status.infoText};
  font-family: inherit;
  font-size: ${p => p.theme.fontSize.base};
  font-weight: ${p => p.theme.fontWeight.semibold};
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${p => p.theme.colors.focus.ring};
    outline-offset: 2px;
  }
`;

const SubmitButton = styled(FormSubmitButton)`
  min-height: 52px;
  margin-top: ${p => p.theme.spacing.sm};
`;

const initialValues = () => ({
  nome: '',
  whatsapp: '',
  bairro: '',
  categoria: null,
  descricao: '',
});

function readInitialDraft() {
  const draft = readJSON(DEMANDAS_RASCUNHO_KEY);
  if (isDraftEmpty(draft)) return null;
  const base = initialValues();
  return {
    nome: typeof draft.nome === 'string' ? draft.nome : base.nome,
    whatsapp: extractBrazilianMobileDigits(draft.whatsapp),
    bairro: DIADEMA_BAIRROS.includes(draft.bairro) ? draft.bairro : base.bairro,
    categoria: DEMANDA_CATEGORIAS.includes(draft.categoria) ? draft.categoria : base.categoria,
    descricao: typeof draft.descricao === 'string' ? draft.descricao : base.descricao,
  };
}

function persistDraft(values) {
  if (isDraftEmpty(values)) {
    removeKey(DEMANDAS_RASCUNHO_KEY);
  } else {
    writeJSON(DEMANDAS_RASCUNHO_KEY, values);
  }
}

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * DemandaForm Component
 * Formulário do protótipo /demanda. Só nome e bairro são obrigatórios.
 * O rascunho é gravado em localStorage (debounce + beforeunload/pagehide)
 * e restaurado na montagem. BEM: demanda-form
 *
 * @param {Object} props
 * @param {(values: {nome: string, whatsapp: string, bairro: string, categoria: string|null, descricao: string}) => void} props.onRegistrar
 */
export const DemandaForm = ({ onRegistrar }) => {
  const [restoredDraft] = useState(readInitialDraft);
  const [values, setValues] = useState(() => restoredDraft ?? initialValues());
  const [showDraftNotice, setShowDraftNotice] = useState(Boolean(restoredDraft));
  const [errors, setErrors] = useState({});
  const valuesRef = useRef(values);
  const nomeRef = useRef(null);
  const bairroRef = useRef(null);

  valuesRef.current = values;

  useEffect(() => {
    const t = setTimeout(() => persistDraft(values), DRAFT_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [values]);

  useEffect(() => {
    const flush = () => persistDraft(valuesRef.current);
    window.addEventListener('beforeunload', flush);
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('beforeunload', flush);
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, []);

  const updateField = useCallback((field, value) => {
    setValues(s => ({ ...s, [field]: value }));
    setErrors(e => (e[field] ? { ...e, [field]: undefined } : e));
  }, []);

  const set = field => e => updateField(field, e.target.value);

  const handleWhatsappChange = e => {
    updateField('whatsapp', extractBrazilianMobileDigits(e.target.value));
  };

  const handleCategoriaClick = categoria => {
    updateField('categoria', values.categoria === categoria ? null : categoria);
  };

  const resetForm = () => {
    removeKey(DEMANDAS_RASCUNHO_KEY);
    setValues(initialValues());
    setErrors({});
    setShowDraftNotice(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const nome = values.nome.trim();
    const nextErrors = {
      nome: nome ? undefined : CONFIG.nomeError,
      bairro: values.bairro ? undefined : CONFIG.bairroError,
    };
    if (nextErrors.nome || nextErrors.bairro) {
      setErrors(nextErrors);
      (nextErrors.nome ? nomeRef : bairroRef).current?.focus();
      return;
    }
    onRegistrar?.({
      ...values,
      nome,
      descricao: values.descricao.trim(),
    });
    resetForm();
  };

  return (
    <FormRoot
      className="demanda-form"
      onSubmit={handleSubmit}
      noValidate
      aria-label={CONFIG.formAriaLabel}
    >
      {showDraftNotice ? (
        <DraftNotice className="demanda-form__draft-notice" role="status">
          <span>{CONFIG.draftRestoredMessage}</span>
          <DraftDiscardButton
            type="button"
            className="demanda-form__draft-discard"
            onClick={resetForm}
          >
            {CONFIG.draftDiscardLabel}
          </DraftDiscardButton>
        </DraftNotice>
      ) : null}

      <FieldGroup className="demanda-form__group demanda-form__group--nome">
        <DemandaFieldContainer $borderless $invalid={Boolean(errors.nome)}>
          <FieldLabel htmlFor="demanda-nome" className="demanda-form__label">
            {CONFIG.nomeLabel}
            <RequiredMark aria-hidden>*</RequiredMark>
          </FieldLabel>
          <DemandaInput
            ref={nomeRef}
            id="demanda-nome"
            name="nome"
            autoComplete="name"
            placeholder={CONFIG.nomePlaceholder}
            value={values.nome}
            onChange={set('nome')}
            required
            aria-invalid={Boolean(errors.nome)}
            aria-describedby={errors.nome ? 'demanda-nome-error' : undefined}
            className="demanda-form__input"
          />
        </DemandaFieldContainer>
        {errors.nome ? (
          <FieldError id="demanda-nome-error" role="alert">
            {errors.nome}
          </FieldError>
        ) : null}
      </FieldGroup>

      <FieldGroup className="demanda-form__group demanda-form__group--whatsapp">
        <DemandaFieldContainer $borderless>
          <FieldLabel htmlFor="demanda-whatsapp" className="demanda-form__label">
            {CONFIG.whatsappLabel}
          </FieldLabel>
          <DemandaInput
            id="demanda-whatsapp"
            name="whatsapp"
            type="tel"
            autoComplete="tel"
            inputMode="numeric"
            placeholder={CONFIG.whatsappPlaceholder}
            value={formatBrazilianMobilePhone(values.whatsapp)}
            onChange={handleWhatsappChange}
            className="demanda-form__input"
          />
        </DemandaFieldContainer>
      </FieldGroup>

      <FieldGroup className="demanda-form__group demanda-form__group--bairro">
        <DemandaFieldContainer $borderless $invalid={Boolean(errors.bairro)}>
          <FieldLabel htmlFor="demanda-bairro" className="demanda-form__label">
            {CONFIG.bairroLabel}
            <RequiredMark aria-hidden>*</RequiredMark>
          </FieldLabel>
          <DemandaSelect
            ref={bairroRef}
            id="demanda-bairro"
            name="bairro"
            value={values.bairro}
            onChange={set('bairro')}
            required
            $placeholder={!values.bairro}
            aria-invalid={Boolean(errors.bairro)}
            aria-describedby={errors.bairro ? 'demanda-bairro-error' : undefined}
            className="demanda-form__select"
          >
            <option value="" disabled>
              {CONFIG.bairroPlaceholder}
            </option>
            {DIADEMA_BAIRROS.map(bairro => (
              <option key={bairro} value={bairro}>
                {bairro}
              </option>
            ))}
          </DemandaSelect>
        </DemandaFieldContainer>
        {errors.bairro ? (
          <FieldError id="demanda-bairro-error" role="alert">
            {errors.bairro}
          </FieldError>
        ) : null}
      </FieldGroup>

      <ChipsFieldset className="demanda-form__group demanda-form__group--categoria">
        <ChipsLegend as="legend" className="demanda-form__label">{CONFIG.categoriaLabel}</ChipsLegend>
        <ChipsRow>
          {DEMANDA_CATEGORIAS.map(categoria => {
            const active = values.categoria === categoria;
            return (
              <CategoriaChip
                key={categoria}
                type="button"
                className="demanda-form__chip"
                $active={active}
                aria-pressed={active}
                onClick={() => handleCategoriaClick(categoria)}
              >
                {categoria}
              </CategoriaChip>
            );
          })}
        </ChipsRow>
      </ChipsFieldset>

      <FieldGroup className="demanda-form__group demanda-form__group--descricao">
        <DemandaFieldContainer $borderless $multiline>
          <FieldLabel htmlFor="demanda-descricao" className="demanda-form__label">
            {CONFIG.descricaoLabel}
          </FieldLabel>
          <DemandaTextarea
            id="demanda-descricao"
            name="descricao"
            rows={3}
            placeholder={CONFIG.descricaoPlaceholder}
            value={values.descricao}
            onChange={set('descricao')}
            className="demanda-form__textarea"
          />
        </DemandaFieldContainer>
      </FieldGroup>

      <SubmitButton type="submit" className="demanda-form__submit-button">
        {CONFIG.submitLabel}
      </SubmitButton>
    </FormRoot>
  );
};
