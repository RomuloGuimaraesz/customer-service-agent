import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPostAuthRouteForRole } from '../config/roleAccess';
import { Toast } from './Toast';
import { FieldContainer, FieldInput, FieldLabel, FormSubmitButton } from './form';
import {
  AuthScreenRoot,
  AuthBrandPanel,
  AuthFormColumn,
} from './AuthScreenLayout';
import styled from 'styled-components';

// ============================================================================
// CONFIGURATION - Easy to find and change
// ============================================================================
const CONFIG = {
  title: 'Login de Usuário',
  subtitle: 'Informe os dados para Logar o seu Usuário',
  usernameLabel: 'Usuário',
  usernamePlaceholder: 'Informe seu Usuário de acesso',
  passwordLabel: 'Senha',
  passwordPlaceholder: 'Informe a sua Senha de acesso',
  submitLabel: 'Entrar',
  submitLoadingLabel: 'Entrando...',
  footerPrompt: 'Não tem uma conta?',
  signUpLinkLabel: 'Criar conta',
};

// ============================================================================
// STYLED COMPONENTS - Grouped by section
// ============================================================================

// Layout
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

const StyledLoginHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const StyledLoginTitle = styled.h1`
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
  font-size: ${props => props.theme.fontSize['3xl']};
  font-weight: ${props => props.theme.fontWeight.semibold};
  line-height: 1.25;
  color: ${props => props.theme.colors.text.primary};
`;

const StyledLoginSubtitle = styled.p`
  margin: 0;
  font-size: ${props => props.theme.fontSize.base};
  font-weight: ${props => props.theme.fontWeight.normal};
  line-height: 1.45;
  color: ${props => props.theme.colors.text.secondary};
`;

// Form
const StyledFormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

// Messages
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

// Footer
const StyledLoginFooter = styled.p`
  margin-top: ${props => props.theme.spacing['2xl']};
  margin-bottom: 0;
  text-align: center;
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.45;
`;

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

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * LoginScreen Component
 * Sign-in form for existing users. Visible copy defaults live in CONFIG.
 *
 * Has no props; uses AuthContext.login and redirects after authentication.
 */
export const LoginScreen = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, role, isLoading: isAuthLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const isSubmittingRef = useRef(false);

  // Navigate after authentication once role is available (or legacy null after loading)
  useEffect(() => {
    if (!isAuthenticated || isAuthLoading) return;
    navigate(getPostAuthRouteForRole(role), { replace: true });
  }, [isAuthenticated, role, isAuthLoading, navigate]);

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
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

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
      isSubmittingRef.current = false;
    } else {
      if (result.warning) {
        setWarning(result.warning);
      }
      // Navigation will happen via useEffect when isAuthenticated becomes true.
      // Keep locked/disabled so a second submit cannot fire before redirect.
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
              {CONFIG.title}
            </StyledLoginTitle>
            <StyledLoginSubtitle className="login-screen__subtitle">
              {CONFIG.subtitle}
            </StyledLoginSubtitle>
          </StyledLoginHeader>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <StyledFormGroup className="login-screen__form-group">
            <FieldContainer $borderless className="login-screen__field-container">
              <FieldLabel htmlFor="username" className="login-screen__label">
                {CONFIG.usernameLabel}
              </FieldLabel>
              <FieldInput
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={CONFIG.usernamePlaceholder}
                required
                className="login-screen__input"
              />
            </FieldContainer>
          </StyledFormGroup>

          <StyledFormGroup className="login-screen__form-group">
            <FieldContainer $borderless className="login-screen__field-container">
              <FieldLabel htmlFor="password" className="login-screen__label">
                {CONFIG.passwordLabel}
              </FieldLabel>
              <FieldInput
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={CONFIG.passwordPlaceholder}
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
            {isLoading ? CONFIG.submitLoadingLabel : CONFIG.submitLabel}
          </FormSubmitButton>
        </form>

        {/* Footer */}
        <StyledLoginFooter className="login-screen__footer">
          {CONFIG.footerPrompt}{' '}
          <StyledLink to="/auth/signup" className="login-screen__link">
            {CONFIG.signUpLinkLabel}
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
