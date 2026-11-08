import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import { DemandaForm } from './DemandaForm';
import { DEMANDAS_RASCUNHO_KEY } from '../utils/demandasStorage';

const renderForm = (props = {}) =>
  render(
    <ThemeProvider theme={theme}>
      <DemandaForm {...props} />
    </ThemeProvider>,
  );

const readDraft = () => JSON.parse(window.localStorage.getItem(DEMANDAS_RASCUNHO_KEY));

describe('DemandaForm', { timeout: 15000 }, () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('saves the draft after a 400 ms debounce', () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/Nome do munícipe/), {
      target: { value: 'Ana' },
    });

    act(() => vi.advanceTimersByTime(399));
    expect(window.localStorage.getItem(DEMANDAS_RASCUNHO_KEY)).toBeNull();

    act(() => vi.advanceTimersByTime(1));
    expect(readDraft().nome).toBe('Ana');
  });

  it('flushes the draft on beforeunload before the debounce fires', () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/Nome do munícipe/), {
      target: { value: 'Bruno' },
    });
    window.dispatchEvent(new Event('beforeunload'));
    expect(readDraft().nome).toBe('Bruno');
  });

  it('restores a half-filled draft after closing and reopening', () => {
    const { unmount } = renderForm();
    fireEvent.change(screen.getByLabelText(/Nome do munícipe/), {
      target: { value: 'Carla' },
    });
    fireEvent.change(screen.getByLabelText('WhatsApp'), {
      target: { value: '11911111111' },
    });
    fireEvent.click(screen.getByText('Saúde'));
    unmount();

    renderForm();
    expect(screen.getByText('Retomamos de onde você parou')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome do munícipe/)).toHaveValue('Carla');
    expect(screen.getByLabelText('WhatsApp')).toHaveValue('(11) 91111-1111');
    expect(screen.getByText('Saúde')).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    fireEvent.click(screen.getByText('Descartar'));
    expect(screen.queryByText('Retomamos de onde você parou')).toBeNull();
    expect(screen.getByLabelText(/Nome do munícipe/)).toHaveValue('');
    expect(window.localStorage.getItem(DEMANDAS_RASCUNHO_KEY)).toBeNull();
  });

  it('blocks submit without nome and bairro, then registers and clears the draft', () => {
    const onRegistrar = vi.fn();
    renderForm({ onRegistrar });

    fireEvent.click(screen.getByText('Registrar demanda'));
    expect(onRegistrar).not.toHaveBeenCalled();
    expect(screen.getByText('Informe o nome do munícipe.')).toBeInTheDocument();
    expect(screen.getByText('Selecione o bairro.')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Nome do munícipe/), {
      target: { value: '  Daniel  ' },
    });
    fireEvent.change(screen.getByLabelText(/Bairro/), {
      target: { value: 'Serraria' },
    });
    act(() => vi.advanceTimersByTime(400));
    expect(readDraft().bairro).toBe('Serraria');

    fireEvent.click(screen.getByText('Registrar demanda'));
    expect(onRegistrar).toHaveBeenCalledWith({
      nome: 'Daniel',
      whatsapp: '',
      bairro: 'Serraria',
      categoria: null,
      descricao: '',
    });
    expect(window.localStorage.getItem(DEMANDAS_RASCUNHO_KEY)).toBeNull();
    expect(screen.getByLabelText(/Nome do munícipe/)).toHaveValue('');
  });
});
