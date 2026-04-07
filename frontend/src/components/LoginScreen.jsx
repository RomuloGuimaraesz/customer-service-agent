import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Toast } from './Toast';
import { FieldContainer, FieldInput, FieldLabel, FormSubmitButton } from './form';
import {
  AuthScreenRoot,
  AuthBrandPanel,
  AuthFormColumn,
} from './AuthScreenLayout';
import styled from 'styled-components';

/**
 * Login Card - BEM: login-screen__card
 */
const StyledLoginCard = styled.div`
  width: 100%;
  max-width: 420px;
  box-sizing: border-box;
  background-color: ${props => props.theme.colors.background.secondary};
  border: none;
  border-radius: ${props => props.theme.borderRadius['3xl']};
  padding: ${props => props.theme.spacing['2xl']};
  box-shadow: ${props => props.theme.shadows.sm};
`;

/**
 * Login Header - BEM: login-screen__header
 */
const StyledLoginHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

/**
 * Login Title - BEM: login-screen__title
 */
const StyledLoginTitle = styled.h1`
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
  font-size: ${props => props.theme.fontSize['3xl']};
  font-weight: ${props => props.theme.fontWeight.semibold};
  line-height: 1.25;
  color: ${props => props.theme.colors.text.primary};
`;

/**
 * Login Subtitle - BEM: login-screen__subtitle
 */
const StyledLoginSubtitle = styled.p`
  margin: 0;
  font-size: ${props => props.theme.fontSize.base};
  font-weight: ${props => props.theme.fontWeight.normal};
  line-height: 1.45;
  color: ${props => props.theme.colors.text.secondary};
`;

/**
 * Form Group - BEM: login-screen__form-group
 */
const StyledFormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

/**
 * Error Message - BEM: login-screen__error
 */
const StyledErrorMessage = styled.div`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  background-color: ${props => props.theme.colors.status.errorBg};
  border: 1px solid ${props => props.theme.colors.status.error};
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.status.errorText};
  font-size: ${props => props.theme.fontSize.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

/**
 * Warning Message - BEM: login-screen__warning
 */
const StyledWarningMessage = styled.div`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  background-color: ${props => props.theme.colors.status.warningBg};
  border: 1px solid ${props => props.theme.colors.status.warning};
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.status.warningText};
  font-size: ${props => props.theme.fontSize.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

/**
 * Login Footer - BEM: login-screen__footer
 */
const StyledLoginFooter = styled.p`
  margin-top: ${props => props.theme.spacing['2xl']};
  margin-bottom: 0;
  text-align: center;
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.45;
`;

/**
 * Link to SignUp - BEM: login-screen__link
 */
const StyledLink = styled(Link)`
  color: ${props => props.theme.colors.status.infoText};
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeight.medium};
  transition: color ${props => props.theme.transitions.fast} ease;

  &:hover {
    color: ${props => props.theme.colors.status.info};
    text-decoration: underline;
  }
`;

/**
 * Login Screen Component
 */
export const LoginScreen = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Navigate to dashboard after successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard/pedidos', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Handle mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show toast when error appears
  useEffect(() => {
    if (error) {
      setToastVisible(true);
    }
  }, [error]);

  const handleCloseToast = () => {
    setToastVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setWarning('');
    setToastVisible(false);
    setIsLoading(true);

    const result = await login(username, password);

    if (!result.success) {
      setError(result.error);
      setUsername('');
      setPassword('');
      setIsLoading(false);
    } else {
      if (result.warning) {
        setWarning(result.warning);
      }
      // Navigation will happen via useEffect when isAuthenticated becomes true
      setIsLoading(false);
    }
  };

  return (
    <>
    <AuthScreenRoot className="login-screen">
      <AuthBrandPanel className="login-screen__brand" />

      <AuthFormColumn className="login-screen__form-column">
        <StyledLoginCard className="login-screen__card">
          {/* Header */}
          <StyledLoginHeader className="login-screen__header">
            <StyledLoginTitle className="login-screen__title">
              Login de Usuário
            </StyledLoginTitle>
            <StyledLoginSubtitle className="login-screen__subtitle">
              Informe os dados para Logar o seu Usuário
            </StyledLoginSubtitle>
          </StyledLoginHeader>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <StyledFormGroup className="login-screen__form-group">
            <FieldContainer $borderless className="login-screen__field-container">
              <FieldLabel htmlFor="username" className="login-screen__label">
                Usuário
              </FieldLabel>
              <FieldInput
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Informe seu Usuário de acesso"
                required
                className="login-screen__input"
              />
            </FieldContainer>
          </StyledFormGroup>

          <StyledFormGroup className="login-screen__form-group">
            <FieldContainer $borderless className="login-screen__field-container">
              <FieldLabel htmlFor="password" className="login-screen__label">
                Senha
              </FieldLabel>
              <FieldInput
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Informe a sua Senha de acesso"
                required
                className="login-screen__input"
              />
            </FieldContainer>
          </StyledFormGroup>

          {/* Warning Message */}
          {warning && (
            <StyledWarningMessage className="login-screen__warning">
              <span>ℹ️</span> {warning}
            </StyledWarningMessage>
          )}

          {/* Submit Button */}
          <FormSubmitButton
            type="submit"
            disabled={isLoading}
            className="login-screen__submit-button"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </FormSubmitButton>
        </form>

        {/* Footer */}
        <StyledLoginFooter className="login-screen__footer">
          Não tem uma conta?{' '}
          <StyledLink to="/auth/signup" className="login-screen__link">
            Criar conta
          </StyledLink>
        </StyledLoginFooter>
      </StyledLoginCard>
      </AuthFormColumn>
    </AuthScreenRoot>

    <Toast
      message={error}
      visible={error && toastVisible}
      onClose={handleCloseToast}
      isMobile={isMobile}
      icon="⚠️"
      variant="error"
    />
    </>
  );
};
