import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import { SignUpScreen } from './SignUpScreen';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    signup: vi.fn(async () => ({ success: false, error: 'mock' })),
  }),
}));

vi.mock('./Header', () => ({
  Header: () => null,
  Logo: () => null,
}));

vi.mock('./Toast', () => ({
  Toast: () => null,
}));

const renderWithTheme = (component) =>
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </MemoryRouter>
  );

describe('SignUpScreen form fields', () => {
  it('renders inputs accessible by their labels', () => {
    renderWithTheme(<SignUpScreen />);

    expect(screen.getByLabelText('Nome Completo')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Senha')).toBeInTheDocument();
  });
});

