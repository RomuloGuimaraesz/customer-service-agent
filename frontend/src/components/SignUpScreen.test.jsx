import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import { SignUpScreen } from './SignUpScreen';
import { ROUTES } from '../config/routes';

const { mockNavigate, mockSignup, mockUseAuth } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockSignup: vi.fn(),
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

const renderSignUp = () =>
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <SignUpScreen />
      </ThemeProvider>
    </MemoryRouter>
  );

const fillRequiredFields = ({
  fullName = 'Alice Silva',
  email = 'alice@example.com',
  password = 'secret1',
  confirmPassword = 'secret1',
} = {}) => {
  fireEvent.change(screen.getByLabelText('Nome Completo'), {
    target: { value: fullName },
  });
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: email },
  });
  fireEvent.change(screen.getByLabelText('Senha'), {
    target: { value: password },
  });
  fireEvent.change(screen.getByLabelText('Confirmar Senha'), {
    target: { value: confirmPassword },
  });
};

describe('SignUpScreen', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockSignup.mockReset();
    mockSignup.mockResolvedValue({ success: true });
    mockUseAuth.mockReturnValue({
      signup: mockSignup,
      isAuthenticated: false,
    });
  });

  it('renders default copy from CONFIG', () => {
    renderSignUp();

    expect(
      screen.getByRole('heading', { name: 'Cadastro de Usuário' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Informe seus dados para Cadastrar o seu Usuário')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Nome Completo')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Senha')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Informe seu nome completo')
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Informe seu email')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Crie uma senha (mínimo 6 caracteres)')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Confirme sua senha')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Criar Conta' })
    ).toBeInTheDocument();
    expect(screen.getByText(/Já tem uma conta\?/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Fazer login' })).toHaveAttribute(
      'href',
      ROUTES.AUTH.LOGIN
    );
  }, 15000);

  it('calls signup with the submitted credentials', async () => {
    renderSignUp();
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: 'Criar Conta' }));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        email: 'alice@example.com',
        password: 'secret1',
        fullName: 'Alice Silva',
      });
    });
  });

  it('shows loading copy and disables submit while signup is in flight', async () => {
    mockSignup.mockReturnValue(new Promise(() => {}));
    renderSignUp();
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: 'Criar Conta' }));

    expect(
      await screen.findByRole('button', { name: 'Criando conta...' })
    ).toBeDisabled();
  });

  it('shows the password mismatch error from CONFIG', async () => {
    renderSignUp();
    fillRequiredFields({ confirmPassword: 'other12' });
    fireEvent.click(screen.getByRole('button', { name: 'Criar Conta' }));

    expect(await screen.findByText('As senhas não coincidem')).toBeInTheDocument();
    expect(mockSignup).not.toHaveBeenCalled();
  });

  it('shows the error from signup when it fails', async () => {
    mockSignup.mockResolvedValue({
      success: false,
      error: 'Email já cadastrado',
    });
    renderSignUp();
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: 'Criar Conta' }));

    expect(await screen.findByText('Email já cadastrado')).toBeInTheDocument();
  });
});
