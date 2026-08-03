import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import {
  ContatosMaisInformacoesModal,
  createInitialMaisInfoValues,
} from './ContatosMaisInformacoesModal';

vi.mock('../services/categoriasApi', () => ({
  getCategorias: vi.fn(),
  resolveCategoriaOptionValue: (raw) => String(raw ?? '').trim(),
}));

import { getCategorias } from '../services/categoriasApi';

const renderModal = (props = {}) => {
  const defaults = {
    isOpen: true,
    onClose: vi.fn(),
    values: createInitialMaisInfoValues(),
    onMaisInfoChange: vi.fn(),
    onSaveInformacoesAdicionais: vi.fn(),
    getAuthHeader: () => 'Bearer test-token',
    canEditCategoria: false,
  };
  return render(
    <ThemeProvider theme={theme}>
      <ContatosMaisInformacoesModal {...defaults} {...props} />
    </ThemeProvider>,
  );
};

describe('ContatosMaisInformacoesModal', () => {
  beforeEach(() => {
    getCategorias.mockReset();
    getCategorias.mockResolvedValue([{ value: 'Cliente', label: 'Cliente' }]);
  });

  it(
    'hides Categoria and does not fetch categories when canEditCategoria is false',
    () => {
      renderModal({ canEditCategoria: false });

      expect(screen.queryByLabelText('Categoria')).not.toBeInTheDocument();
      expect(getCategorias).not.toHaveBeenCalled();
    },
    15000,
  );

  it('defaults canEditCategoria to false (safe for non-privileged roles)', () => {
    render(
      <ThemeProvider theme={theme}>
        <ContatosMaisInformacoesModal
          isOpen
          onClose={vi.fn()}
          values={createInitialMaisInfoValues()}
          onMaisInfoChange={vi.fn()}
          onSaveInformacoesAdicionais={vi.fn()}
          getAuthHeader={() => 'Bearer test-token'}
        />
      </ThemeProvider>,
    );

    expect(screen.queryByLabelText('Categoria')).not.toBeInTheDocument();
    expect(getCategorias).not.toHaveBeenCalled();
  });

  it(
    'shows Categoria and loads options when canEditCategoria is true',
    async () => {
      renderModal({ canEditCategoria: true });

      expect(screen.getByLabelText('Categoria')).toBeInTheDocument();

      await waitFor(() => {
        expect(getCategorias).toHaveBeenCalledTimes(1);
      });

      await waitFor(() => {
        expect(
          screen.getByRole('option', { name: 'Cliente' }),
        ).toBeInTheDocument();
      });
    },
    15000,
  );

  it('still shows other complementary fields without Categoria', () => {
    renderModal({ canEditCategoria: false });

    expect(screen.getByLabelText('Indicação')).toBeInTheDocument();
    expect(screen.getByLabelText('CPF')).toBeInTheDocument();
    expect(screen.getByLabelText('Título de Eleitor')).toBeInTheDocument();
    expect(screen.getByLabelText('Zona Eleitoral')).toBeInTheDocument();
    expect(screen.getByLabelText('Seção Eleitoral')).toBeInTheDocument();
  });
});
