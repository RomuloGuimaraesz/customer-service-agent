import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FieldInput, FieldLabel, FormSubmitButton } from './form';
import attentionIconUrl from '../../assets/img/attention-icon.svg?url';
import {
  ContatosFieldContainer,
  ContatosFormCell as Cell,
  ContatosFormCellSpan2 as CellSpan2,
  ContatosFormCellSpan3 as CellSpan3,
} from './ContatosFormPrimitives';

const FormRoot = styled.form`
  display: contents;
`;

/** Centered row: optional attention icon + Mais informações (BEM: contatos-form__cell--mais-informacoes). */
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
  cep: '',
  cidade: '',
  estado: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  bairroComplemento: '',
});

/**
 * Formulário de contato na coluna esquerda. Busca fica no searchable-layout__search-input.
 * Todos vs Novo: mesmos campos; texto do envio e reset ao trocar modo diferem.
 * BEM: contatos-form
 * @param {() => void} [props.onMaisInformacoesClick] — abre o modal de campos complementares
 * @param {(dadosPrincipais: Record<string, string>) => void | Promise<void>} [props.onMainFormSave] — envio principal; recebe os valores do formulário
 * @param {boolean} [props.showMaisInfoAttention] — exibe ícone de atenção (dados adicionais não salvos)
 * @param {string} [props.maisInfoAttentionHint] — texto para title e aria-describedby
 * @param {string|null} [props.prefillKey] — muda ao selecionar uma linha na lista; com prefillDadosPrincipais preenche o formulário
 * @param {Record<string, string>|null} [props.prefillDadosPrincipais] — valores vindos da API (modo Todos)
 */
export const ContatosContactForm = ({
  mode = 'todos',
  onMaisInformacoesClick,
  onMainFormSave,
  showMaisInfoAttention = false,
  maisInfoAttentionHint = '',
  prefillKey = null,
  prefillDadosPrincipais = null,
}) => {
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    if (mode === 'novo') {
      setValues(initialValues());
      return;
    }
    if (prefillKey != null && prefillDadosPrincipais) {
      setValues({ ...initialValues(), ...prefillDadosPrincipais });
      return;
    }
    setValues(initialValues());
  }, [mode, prefillKey, prefillDadosPrincipais]);

  const set =
    field =>
    e => {
      const v = e.target.value;
      setValues(s => ({ ...s, [field]: v }));
    };

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
      aria-label={isTodos ? 'Formulário de contato existente' : 'Formulário de novo contato'}
    >
      <CellSpan2 className="contatos-form__cell contatos-form__cell--nome-completo">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-nome" className="contatos-form__label">
            Nome Completo
          </FieldLabel>
          <FieldInput
            id="contato-nome"
            name="nome"
            autoComplete="name"
            placeholder="Digite o Nome Completo"
            value={values.nome}
            onChange={set('nome')}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </CellSpan2>
      <Cell className="contatos-form__cell contatos-form__cell--whatsapp">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-whatsapp" className="contatos-form__label">
            WhatsApp
          </FieldLabel>
          <FieldInput
            id="contato-whatsapp"
            name="whatsapp"
            type="tel"
            autoComplete="tel"
            placeholder="Digite o WhatsApp"
            value={values.whatsapp}
            onChange={set('whatsapp')}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </Cell>
      <Cell className="contatos-form__cell contatos-form__cell--data-nascimento">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-data-nascimento" className="contatos-form__label">
            Data de Nascimento
          </FieldLabel>
          <FieldInput
            id="contato-data-nascimento"
            name="dataNascimento"
            autoComplete="bday"
            placeholder="dd/mm/aaaa"
            value={values.dataNascimento}
            onChange={set('dataNascimento')}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </Cell>
      <Cell className="contatos-form__cell contatos-form__cell--idade">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-idade" className="contatos-form__label">
            Idade
          </FieldLabel>
          <FieldInput
            id="contato-idade"
            name="idade"
            autoComplete="off"
            inputMode="numeric"
            placeholder="Digite a Idade"
            value={values.idade}
            onChange={set('idade')}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </Cell>
      <Cell className="contatos-form__cell contatos-form__cell--cep">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-cep" className="contatos-form__label">
            CEP
          </FieldLabel>
          <FieldInput
            id="contato-cep"
            name="cep"
            autoComplete="postal-code"
            inputMode="numeric"
            placeholder="Digite o CEP"
            value={values.cep}
            onChange={set('cep')}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </Cell>
      <CellSpan2 className="contatos-form__cell contatos-form__cell--endereco">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-endereco" className="contatos-form__label">
            Endereço
          </FieldLabel>
          <FieldInput
            id="contato-endereco"
            name="endereco"
            autoComplete="address-line1"
            placeholder="Digite o Endereço"
            value={values.endereco}
            onChange={set('endereco')}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </CellSpan2>
      <Cell className="contatos-form__cell contatos-form__cell--numero">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-numero" className="contatos-form__label">
            Número
          </FieldLabel>
          <FieldInput
            id="contato-numero"
            name="numero"
            autoComplete="off"
            placeholder="Digite o Número"
            value={values.numero}
            onChange={set('numero')}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </Cell>
      <CellSpan3 className="contatos-form__cell contatos-form__cell--endereco-complemento">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-endereco-complemento" className="contatos-form__label">
            Endereço/Complemento
          </FieldLabel>
          <FieldInput
            id="contato-endereco-complemento"
            name="complemento"
            autoComplete="address-line2"
            placeholder="Digite informações extras sobre o Endereço"
            value={values.complemento}
            onChange={set('complemento')}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </CellSpan3>
      <Cell className="contatos-form__cell contatos-form__cell--bairro">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-bairro" className="contatos-form__label">
            Bairro
          </FieldLabel>
          <FieldInput
            id="contato-bairro"
            name="bairro"
            autoComplete="address-level3"
            placeholder="Digite o Bairro"
            value={values.bairro}
            onChange={set('bairro')}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </Cell>
      <CellSpan2 className="contatos-form__cell contatos-form__cell--bairro-complemento">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-bairro-complemento" className="contatos-form__label">
            Bairro/Complemento
          </FieldLabel>
          <FieldInput
            id="contato-bairro-complemento"
            name="bairroComplemento"
            autoComplete="off"
            placeholder="Digite informações extras sobre o Bairro"
            value={values.bairroComplemento}
            onChange={set('bairroComplemento')}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </CellSpan2>
      <Cell className="contatos-form__cell contatos-form__cell--cidade">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-cidade" className="contatos-form__label">
            Cidade
          </FieldLabel>
          <FieldInput
            id="contato-cidade"
            name="cidade"
            autoComplete="address-level2"
            placeholder="Digite a cidade"
            value={values.cidade}
            onChange={set('cidade')}
            className="contatos-form__input"
          />
        </ContatosFieldContainer>
      </Cell>
      <Cell className="contatos-form__cell contatos-form__cell--estado">
        <ContatosFieldContainer $borderless className="contatos-form__field-container">
          <FieldLabel htmlFor="contato-estado" className="contatos-form__label">
            Estado
          </FieldLabel>
          <FieldInput
            id="contato-estado"
            name="estado"
            autoComplete="address-level1"
            placeholder="Digite o Estado"
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
          Mais informações
        </MaisInformacoesButton>
      </MaisInformacoesCell>

      <CellSpan3 className="contatos-form__cell contatos-form__cell--submit">
        <FormSubmitButton type="submit" className="contatos-form__submit-button">
          {isTodos ? 'Salvar alterações' : 'Cadastrar contato'}
        </FormSubmitButton>
      </CellSpan3>
    </FormRoot>
  );
};
