import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import { LoginScreen } from './LoginScreen';
import { ROUTES } from '../config/routes';

const { mockNavigate, mockLogin, mockUseAuth } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockLogin: vi.fn(),
  mockUseAuth: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../contexts/AuthContext', () => ({
  useAuth: mockUseAuth,
}));

vi.mock('./Header', () => ({
  Header: () => null,
  Logo: () => null,
}));

const renderLogin = () =>
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <LoginScreen />
      </ThemeProvider>
    </MemoryRouter>
  );

describe('LoginScreen', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockLogin.mockReset();
    mockLogin.mockResolvedValue({ success: true });
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
      role: null,
      isLoading: false,
    });
  });

  it('renders default copy from CONFIG', () => {
    renderLogin();

    expect(
      screen.getByRole('heading', { name: 'Login de Usuário' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Informe os dados para Logar o seu Usuário')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Usuário')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Informe seu Usuário de acesso')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Informe a sua Senha de acesso')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
    expect(screen.getByText(/Não tem uma conta\?/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Criar conta' })).toHaveAttribute(
      'href',
      ROUTES.AUTH.SIGNUP
    );
  }, 15000);

  it('calls login with the submitted credentials', async () => {
    renderLogin();

    fireEvent.change(screen.getByLabelText('Usuário'), {
      target: { value: 'alice' },
    });
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'secret' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('alice', 'secret');
    });
  });

  it('shows loading copy and disables submit while login is in flight', async () => {
    mockLogin.mockReturnValue(new Promise(() => {}));
    renderLogin();

    fireEvent.change(screen.getByLabelText('Usuário'), {
      target: { value: 'alice' },
    });
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'secret' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(
      await screen.findByRole('button', { name: 'Entrando...' })
    ).toBeDisabled();
  });

  it('shows the error toast when login fails', async () => {
    mockLogin.mockResolvedValue({
      success: false,
      error: 'Credenciais inválidas',
    });
    renderLogin();

    fireEvent.change(screen.getByLabelText('Usuário'), {
      target: { value: 'alice' },
    });
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('Credenciais inválidas')).toBeInTheDocument();
  });

  it('redirects authenticated users to the post-auth route', () => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isAuthenticated: true,
      role: 'user',
      isLoading: false,
    });

    renderLogin();

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.CONTATOS.BASE, {
      replace: true,
    });
  });
});
