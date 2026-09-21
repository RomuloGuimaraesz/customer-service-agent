import React, { useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { FieldInput, FieldLabel, FormSubmitButton } from './form';
import attentionIconUrl from '../../assets/img/attention-icon.svg?url';
import {
  ContatosFieldContainer,
  ContatosFormCell as Cell,
  ContatosFormCellSpan2 as CellSpan2,
  ContatosFormCellSpan3 as CellSpan3,
} from './ContatosFormPrimitives';
import {
  extractBrazilianMobileDigits,
  formatBrazilianMobilePhone,
} from '../utils/brazilianPhoneMask';
import {
  extractBrazilianDateDigits,
  formatBrazilianDate,
} from '../utils/brazilianDateMask';
import {
  extractBrazilianCepDigits,
  formatBrazilianCep,
  normalizeBrazilianCepDigits,
} from '../utils/brazilianCepMask';
import { fetchAddressByCep } from '../utils/viacepService';

// ============================================================================
// CONFIGURATION - Easy to find and change
// ============================================================================
const CONFIG = {
  formAriaLabelTodos: 'Formulário de contato existente',
  formAriaLabelNovo: 'Formulário de novo contato',
  nomeLabel: 'Nome Completo',
  nomePlaceholder: 'Digite o Nome Completo',
  whatsappLabel: 'WhatsApp',
  whatsappPlaceholder: '(11) 99999-9999',
  dataNascimentoLabel: 'Data de Nascimento',
  dataNascimentoPlaceholder: 'dd/mm/aaaa',
  idadeLabel: 'Idade',
  idadePlaceholder: 'Digite a Idade',
  nomeMaeLabel: 'Nome da Mãe',
  nomeMaePlaceholder: 'Digite o Nome completo da Mãe',
  cepLabel: 'CEP',
  cepPlaceholder: '00000-000',
  bairroLabel: 'Bairro',
  bairroPlaceholder: 'Digite o Bairro',
  enderecoLabel: 'Endereço',
  enderecoPlaceholder: 'Digite o Endereço',
  numeroLabel: 'Número',
  numeroPlaceholder: 'Digite o Número',
  complementoLabel: 'Endereço/Complemento',
  complementoPlaceholder: 'Digite informações extras sobre o Endereço',
  bairroComplementoLabel: 'Bairro/Complemento',
  bairroComplementoPlaceholder: 'Digite informações extras sobre o Bairro',
  cidadeLabel: 'Cidade',
  cidadePlaceholder: 'Digite a cidade',
  estadoLabel: 'Estado',
  estadoPlaceholder: 'Digite o Estado',
  maisInformacoesLabel: 'Mais informações',
  submitSaveLabel: 'Salvar alterações',
  submitSaveLoadingLabel: 'Salvando...',
  submitCreateLabel: 'Cadastrar contato',
  submitCreateLoadingLabel: 'Cadastrando...',
};

// ============================================================================
// STYLED COMPONENTS - Grouped by section
// ============================================================================

// Layout
const FormRoot = styled.form`
  display: contents;
`;

// Mais informações
const MaisInformacoesCell = styled(Cell)`
  justify-content: center;
  position: relative;
  gap: ${p => p.theme.spacing.xs};
`;

const MaisInformacoesAttentionIcon = styled.img`
  width: 18px;
  height: 16px;
  flex-shrink: 0;
  display: block;
`;

const MaisInformacoesSrOnly = styled.span`
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  white-space: nowrap;
`;

const MaisInformacoesButton = styled.button`
  font-family: inherit;
  font-size: ${p => p.theme.fontSize.sm};
  color: ${p => p.theme.colors.status.infoText};
  text-decoration: none;
  font-weight: ${p => p.theme.fontWeight.medium};
  transition: color ${p => p.theme.transitions.fast} ease;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  &:hover {
    color: ${p => p.theme.colors.status.info};
    text-decoration: underline;
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    color: ${p => p.theme.colors.status.info};
    text-decoration: underline;
  }
`;

const initialValues = () => ({
  nome: '',
  whatsapp: '',
  dataNascimento: '',
  idade: '',
  nomeMae: '',
  cep: '',
  cidade: '',
  estado: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  bairroComplemento: '',
});

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * ContatosContactForm Component
 * Left-column contact form. Search lives in searchable-layout__search-input.
 * Todos vs Novo: same fields; submit copy and reset-on-mode-change differ.
 * Visible copy defaults live in CONFIG. BEM: contatos-form
 *
 * @param {Object} props
 * @param {'todos'|'novo'} [props.mode='todos'] - List-edit vs new-contact mode
 * @param {() => void} [props.onMaisInformacoesClick] - Opens complementary-fields modal
 * @param {(dadosPrincipais: Record<string, string>) => void | Promise<void>} [props.onMainFormSave] - Main submit; receives current form values
 * @param {boolean} [props.showMaisInfoAttention=false] - Attention icon when extra data is unsaved
 * @param {string} [props.maisInfoAttentionHint=''] - Text for title and aria-describedby
 * @param {string|null} [props.prefillKey=null] - Changes when a list row is selected; with prefillDadosPrincipais fills the form
 * @param {Record<string, string>|null} [props.prefillDadosPrincipais=null] - API values (Todos mode)
 * @param {(values: Record<string, string>) => void} [props.onValuesChange] - Current values (e.g. new-contact POST + modal)
 * @param {boolean} [props.isSubmitting=false] - Disables submit while parent persists
 * @param {number} [props.resetKey=0] - Incremented by parent after Novo save; clears fields
 */
export const ContatosContactForm = ({
  mode = 'todos',
  onMaisInformacoesClick,
  onMainFormSave,
  showMaisInfoAttention = false,
  maisInfoAttentionHint = '',
  prefillKey = null,
  prefillDadosPrincipais = null,
  onValuesChange,
  isSubmitting = false,
  resetKey = 0,
}) => {
  const [values, setValues] = useState(initialValues);
  const cepLookupAbortRef = useRef(null);

  const emitValues = useCallback(
    next => {
      onValuesChange?.(next);
    },
    [onValuesChange],
  );

  useEffect(() => {
    emitValues(values);
  }, [values, emitValues]);

  useEffect(() => {
    if (mode === 'novo') {
      setValues(initialValues());
      return;
    }
    if (prefillKey != null && prefillDadosPrincipais) {
      setValues({
        ...initialValues(),
        ...prefillDadosPrincipais,
        whatsapp: extractBrazilianMobileDigits(prefillDadosPrincipais.whatsapp),
        dataNascimento: extractBrazilianDateDigits(
          prefillDadosPrincipais.dataNascimento,
        ),
        cep: normalizeBrazilianCepDigits(prefillDadosPrincipais.cep),
      });
      return;
    }
    setValues(initialValues());
  }, [mode, prefillKey, prefillDadosPrincipais, resetKey]);

  const set =
    field =>
    e => {
      const v = e.target.value;
      setValues(s => ({ ...s, [field]: v }));
    };

  const handleWhatsappChange = e => {
    const digits = extractBrazilianMobileDigits(e.target.value);
    setValues(s => ({ ...s, whatsapp: digits }));
  };

  const handleDataNascimentoChange = e => {
    const digits = extractBrazilianDateDigits(e.target.value);
    setValues(s => ({ ...s, dataNascimento: digits }));
  };

  const lookupAddressByCep = useCallback(async digits => {
    cepLookupAbortRef.current?.abort();
    const controller = new AbortController();
    cepLookupAbortRef.current = controller;

    try {
      const address = await fetchAddressByCep(digits, {
        signal: controller.signal,
      });
      if (!address || controller.signal.aborted) return;

      setValues(s =>
        s.cep === digits
          ? {
              ...s,
              ...address,
            }
          : s,
      );
    } catch (err) {
      if (err?.name === 'AbortError') return;
      console.error('Erro ao consultar CEP no ViaCEP:', err);
    }
  }, []);

  const handleCepChange = e => {
    const digits = extractBrazilianCepDigits(e.target.value);
    setValues(s => ({ ...s, cep: digits }));
    if (digits.length === 8) {
      lookupAddressByCep(digits);
    }
  };

  useEffect(
    () => () => {
      cepLookupAbortRef.current?.abort();
    },
    [],
  );

  const handleSubmit = async e => {
    e.preventDefault();
    await onMainFormSave?.(values);
  };

  const isTodos = mode === 'todos';

  return (
    <FormRoot
      className="contatos-form"
      onSubmit={handleSubmit}
      noValidate
      aria-label={isTodos ? CONFIG.formAriaLabelTodos : CONFIG.formAriaLabelNovo}
    >
      <CellSpan2 className="contatos-form__cell contatos-form__cell--nome-completo">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-nome" className="contatos-form__label">
            {CONFIG.nomeLabel}
          </FieldLabel>
          <FieldInput
            id="contato-nome"
            name="nome"
            autoComplete="name"
            placeholder={CONFIG.nomePlaceholder}
            value={values.nome}
            onChange={set('nome')}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </CellSpan2>
      <Cell className="contatos-form__cell contatos-form__cell--whatsapp">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-whatsapp" className="contatos-form__label">
            {CONFIG.whatsappLabel}
          </FieldLabel>
          <FieldInput
            id="contato-whatsapp"
            name="whatsapp"
            type="tel"
            autoComplete="tel"
            inputMode="numeric"
            placeholder={CONFIG.whatsappPlaceholder}
            value={formatBrazilianMobilePhone(values.whatsapp)}
            onChange={handleWhatsappChange}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </Cell>
      <Cell className="contatos-form__cell contatos-form__cell--data-nascimento">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-data-nascimento" className="contatos-form__label">
            {CONFIG.dataNascimentoLabel}
          </FieldLabel>
          <FieldInput
            id="contato-data-nascimento"
            name="dataNascimento"
            autoComplete="bday"
            inputMode="numeric"
            placeholder={CONFIG.dataNascimentoPlaceholder}
            value={formatBrazilianDate(values.dataNascimento)}
            onChange={handleDataNascimentoChange}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </Cell>
      <Cell className="contatos-form__cell contatos-form__cell--idade">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-idade" className="contatos-form__label">
            {CONFIG.idadeLabel}
          </FieldLabel>
          <FieldInput
            id="contato-idade"
            name="idade"
            autoComplete="off"
            inputMode="numeric"
            placeholder={CONFIG.idadePlaceholder}
            value={values.idade}
            onChange={set('idade')}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </Cell>
      <Cell className="contatos-form__cell contatos-form__cell--nome-mae">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-nome-mae" className="contatos-form__label">
            {CONFIG.nomeMaeLabel}
          </FieldLabel>
          <FieldInput
            id="contato-nome-mae"
            name="nomeMae"
            autoComplete="off"
            placeholder={CONFIG.nomeMaePlaceholder}
            value={values.nomeMae}
            onChange={set('nomeMae')}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </Cell>
      <Cell className="contatos-form__cell contatos-form__cell--cep">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-cep" className="contatos-form__label">
            {CONFIG.cepLabel}
          </FieldLabel>
          <FieldInput
            id="contato-cep"
            name="cep"
            autoComplete="postal-code"
            inputMode="numeric"
            placeholder={CONFIG.cepPlaceholder}
            value={formatBrazilianCep(values.cep)}
            onChange={handleCepChange}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </Cell>
      <CellSpan2 className="contatos-form__cell contatos-form__cell--bairro">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-bairro" className="contatos-form__label">
            {CONFIG.bairroLabel}
          </FieldLabel>
          <FieldInput
            id="contato-bairro"
            name="bairro"
            autoComplete="address-level3"
            placeholder={CONFIG.bairroPlaceholder}
            value={values.bairro}
            onChange={set('bairro')}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </CellSpan2>
      <CellSpan2 className="contatos-form__cell contatos-form__cell--endereco">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-endereco" className="contatos-form__label">
            {CONFIG.enderecoLabel}
          </FieldLabel>
          <FieldInput
            id="contato-endereco"
            name="endereco"
            autoComplete="address-line1"
            placeholder={CONFIG.enderecoPlaceholder}
            value={values.endereco}
            onChange={set('endereco')}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </CellSpan2>
      <Cell className="contatos-form__cell contatos-form__cell--numero">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-numero" className="contatos-form__label">
            {CONFIG.numeroLabel}
          </FieldLabel>
          <FieldInput
            id="contato-numero"
            name="numero"
            autoComplete="off"
            placeholder={CONFIG.numeroPlaceholder}
            value={values.numero}
            onChange={set('numero')}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </Cell>
      <CellSpan3 className="contatos-form__cell contatos-form__cell--endereco-complemento">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-endereco-complemento" className="contatos-form__label">
            {CONFIG.complementoLabel}
          </FieldLabel>
          <FieldInput
            id="contato-endereco-complemento"
            name="complemento"
            autoComplete="address-line2"
            placeholder={CONFIG.complementoPlaceholder}
            value={values.complemento}
            onChange={set('complemento')}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </CellSpan3>
      <CellSpan3 className="contatos-form__cell contatos-form__cell--bairro-complemento">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-bairro-complemento" className="contatos-form__label">
            {CONFIG.bairroComplementoLabel}
          </FieldLabel>
          <FieldInput
            id="contato-bairro-complemento"
            name="bairroComplemento"
            autoComplete="off"
            placeholder={CONFIG.bairroComplementoPlaceholder}
            value={values.bairroComplemento}
            onChange={set('bairroComplemento')}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </CellSpan3>
      <Cell className="contatos-form__cell contatos-form__cell--cidade">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-cidade" className="contatos-form__label">
            {CONFIG.cidadeLabel}
          </FieldLabel>
          <FieldInput
            id="contato-cidade"
            name="cidade"
            autoComplete="address-level2"
            placeholder={CONFIG.cidadePlaceholder}
            value={values.cidade}
            onChange={set('cidade')}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </Cell>
      <Cell className="contatos-form__cell contatos-form__cell--estado">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-estado" className="contatos-form__label">
            {CONFIG.estadoLabel}
          </FieldLabel>
          <FieldInput
            id="contato-estado"
            name="estado"
            autoComplete="address-level1"
            placeholder={CONFIG.estadoPlaceholder}
            value={values.estado}
            onChange={set('estado')}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </Cell>
      <MaisInformacoesCell className="contatos-form__cell contatos-form__cell--mais-informacoes">
        {showMaisInfoAttention ? (
          <>
            <MaisInformacoesAttentionIcon
              src={attentionIconUrl}
              alt=""
              aria-hidden
              className="contatos-form__mais-info-attention-icon"
            />
            <MaisInformacoesSrOnly id="contatos-mais-info-hint">
              {maisInfoAttentionHint}
            </MaisInformacoesSrOnly>
          </>
        ) : null}
        <MaisInformacoesButton
          type="button"
          className="login-screen__link contatos-form__link--mais-informacoes"
          onClick={() => onMaisInformacoesClick?.()}
          aria-describedby={
            showMaisInfoAttention ? 'contatos-mais-info-hint' : undefined
          }
          title={showMaisInfoAttention ? maisInfoAttentionHint : undefined}
        >
          {CONFIG.maisInformacoesLabel}
        </MaisInformacoesButton>
      </MaisInformacoesCell>

      <CellSpan3 className="contatos-form__cell contatos-form__cell--submit">
        <FormSubmitButton
          type="submit"
          className="contatos-form__submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isTodos
              ? CONFIG.submitSaveLoadingLabel
              : CONFIG.submitCreateLoadingLabel
            : isTodos
              ? CONFIG.submitSaveLabel
              : CONFIG.submitCreateLabel}
        </FormSubmitButton>
      </CellSpan3>
    </FormRoot>
  );
};
