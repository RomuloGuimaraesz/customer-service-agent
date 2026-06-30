import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { MainNavigation } from './MainNavigation';
import { theme } from '../styles/theme';
import { MemoryRouter } from 'react-router-dom';
import { ROUTES } from '../config/routes';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../contexts/AuthContext';

const renderWithTheme = (ui) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('MainNavigation', () => {
  it('renders pill with Dashboard and Contatos controls for admin', () => {
    useAuth.mockReturnValue({ role: 'admin' });

    renderWithTheme(
      <MemoryRouter initialEntries={[ROUTES.DASHBOARD.BASE]}>
        <MainNavigation />
      </MemoryRouter>
    );
    expect(screen.getByRole('navigation', { name: 'Navegação principal' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Contatos' })).toBeInTheDocument();
  });

  it('renders pill for architect', () => {
    useAuth.mockReturnValue({ role: 'architect' });

    renderWithTheme(
      <MemoryRouter initialEntries={[ROUTES.DASHBOARD.BASE]}>
        <MainNavigation />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Contatos' })).toBeInTheDocument();
  });

  it('does not render navigation for user role', () => {
    useAuth.mockReturnValue({ role: 'user' });

    renderWithTheme(
      <MemoryRouter initialEntries={[ROUTES.CONTATOS.BASE]}>
        <MainNavigation />
      </MemoryRouter>
    );

    expect(screen.queryByRole('navigation', { name: 'Navegação principal' })).not.toBeInTheDocument();
  });

  it('sets aria-current on the active surface', () => {
    useAuth.mockReturnValue({ role: 'admin' });

    renderWithTheme(
      <MemoryRouter initialEntries={[ROUTES.CONTATOS.BASE]}>
        <MainNavigation />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: 'Contatos' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Dashboard' })).not.toHaveAttribute('aria-current');
  });
});
