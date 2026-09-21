import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import { ContatosContactForm } from './ContatosContactForm';

vi.mock('../utils/viacepService', () => ({
  fetchAddressByCep: vi.fn(),
}));

import { fetchAddressByCep } from '../utils/viacepService';

const renderForm = (props = {}) =>
  render(
    <ThemeProvider theme={theme}>
      <ContatosContactForm {...props} />
    </ThemeProvider>,
  );

describe('ContatosContactForm', () => {
  beforeEach(() => {
    fetchAddressByCep.mockReset();
  });

  it('renders default copy from CONFIG in todos mode', () => {
    renderForm();

    expect(
      screen.getByRole('form', { name: 'Formulário de contato existente' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Nome Completo')).toBeInTheDocument();
    expect(screen.getByLabelText('WhatsApp')).toBeInTheDocument();
    expect(screen.getByLabelText('Data de Nascimento')).toBeInTheDocument();
    expect(screen.getByLabelText('Idade')).toBeInTheDocument();
    expect(screen.getByLabelText('Nome da Mãe')).toBeInTheDocument();
    expect(screen.getByLabelText('CEP')).toBeInTheDocument();
    expect(screen.getByLabelText('Bairro')).toBeInTheDocument();
    expect(screen.getByLabelText('Endereço')).toBeInTheDocument();
    expect(screen.getByLabelText('Número')).toBeInTheDocument();
    expect(screen.getByLabelText('Endereço/Complemento')).toBeInTheDocument();
    expect(screen.getByLabelText('Bairro/Complemento')).toBeInTheDocument();
    expect(screen.getByLabelText('Cidade')).toBeInTheDocument();
    expect(screen.getByLabelText('Estado')).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText('Digite o Nome Completo'),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('(11) 99999-9999')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('dd/mm/aaaa')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite a Idade')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Digite o Nome completo da Mãe'),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('00000-000')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite o Bairro')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite o Endereço')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite o Número')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Digite informações extras sobre o Endereço'),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Digite informações extras sobre o Bairro'),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite a cidade')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite o Estado')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Mais informações' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Salvar alterações' }),
    ).toBeInTheDocument();
  }, 15000);

  it('uses novo-mode form aria-label and submit copy', () => {
    renderForm({ mode: 'novo' });

    expect(
      screen.getByRole('form', { name: 'Formulário de novo contato' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Cadastrar contato' }),
    ).toBeInTheDocument();
  });

  it('shows loading copy and disables submit while isSubmitting', () => {
    const { rerender } = renderForm({ isSubmitting: true });

    const saveButton = screen.getByRole('button', { name: 'Salvando...' });
    expect(saveButton).toBeDisabled();

    rerender(
      <ThemeProvider theme={theme}>
        <ContatosContactForm mode="novo" isSubmitting />
      </ThemeProvider>,
    );

    const createButton = screen.getByRole('button', { name: 'Cadastrando...' });
    expect(createButton).toBeDisabled();
  });

  it('calls onMainFormSave with current values on submit', async () => {
    const onMainFormSave = vi.fn();
    renderForm({ onMainFormSave });

    fireEvent.change(screen.getByLabelText('Nome Completo'), {
      target: { value: 'Maria Silva' },
    });
    fireEvent.submit(
      screen.getByRole('form', { name: 'Formulário de contato existente' }),
    );

    await waitFor(() => {
      expect(onMainFormSave).toHaveBeenCalledWith(
        expect.objectContaining({ nome: 'Maria Silva' }),
      );
    });
  });

  it('calls onMaisInformacoesClick when the extra-info button is clicked', () => {
    const onMaisInformacoesClick = vi.fn();
    renderForm({ onMaisInformacoesClick });

    fireEvent.click(screen.getByRole('button', { name: 'Mais informações' }));
    expect(onMaisInformacoesClick).toHaveBeenCalledTimes(1);
  });

  it('exposes maisInfoAttentionHint when showMaisInfoAttention is true', () => {
    renderForm({
      showMaisInfoAttention: true,
      maisInfoAttentionHint: 'Há dados adicionais não salvos',
    });

    const extraInfoButton = screen.getByRole('button', {
      name: 'Mais informações',
    });
    expect(extraInfoButton).toHaveAttribute(
      'title',
      'Há dados adicionais não salvos',
    );
    expect(
      screen.getByText('Há dados adicionais não salvos'),
    ).toBeInTheDocument();
  });

  it('prefills fields from prefillDadosPrincipais when prefillKey is set', () => {
    renderForm({
      prefillKey: 'row-1',
      prefillDadosPrincipais: {
        nome: 'João Prefill',
        whatsapp: '11988887777',
        cidade: 'São Paulo',
      },
    });

    expect(screen.getByLabelText('Nome Completo')).toHaveValue('João Prefill');
    expect(screen.getByLabelText('WhatsApp')).toHaveValue('(11) 98888-7777');
    expect(screen.getByLabelText('Cidade')).toHaveValue('São Paulo');
  });
});
