import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { MainNavigation } from './MainNavigation';
import { theme } from '../styles/theme';
import { MemoryRouter } from 'react-router-dom';
import { ROUTES } from '../config/routes';

const renderWithTheme = (ui) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('MainNavigation', () => {
  it('renders pill with Dashboard and Contatos controls', () => {
    renderWithTheme(
      <MemoryRouter initialEntries={[ROUTES.DASHBOARD.BASE]}>
        <MainNavigation />
      </MemoryRouter>
    );
    expect(screen.getByRole('navigation', { name: 'Navegação principal' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Contatos' })).toBeInTheDocument();
  });

  it('sets aria-current on the active surface', () => {
    renderWithTheme(
      <MemoryRouter initialEntries={[ROUTES.CONTATOS.BASE]}>
        <MainNavigation />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: 'Contatos' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Dashboard' })).not.toHaveAttribute('aria-current');
  });
});
