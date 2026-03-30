import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { MainNavigation } from './MainNavigation';
import { theme } from '../styles/theme';

const renderWithTheme = (ui) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('MainNavigation', () => {
  it('renders pill with Dashboard and Contatos controls', () => {
    renderWithTheme(<MainNavigation />);
    expect(screen.getByRole('navigation', { name: 'Navegação principal' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Contatos' })).toBeInTheDocument();
  });
});
