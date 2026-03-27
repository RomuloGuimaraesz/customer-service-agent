import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Header, Logo } from './Header';
import { Toast } from './Toast';
import { FieldContainer, FieldInput, FieldLabel } from './form';
import styled from 'styled-components';

/**
 * Login Screen Container - BEM: login-screen
 */
const StyledLoginScreen = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  font-family: ${props => props.theme.fontFamily.primary};
  padding: ${props => props.theme.spacing.xl};
`;

/**
 * Login Card Wrapper - BEM: login-screen__card-wrapper
 */
const StyledLoginCardWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * Login Card - BEM: login-screen__card
 */
const StyledLoginCard = styled.div`
  width: 100%;
  max-width: 420px;
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  border: none;
  padding: ${props => props.theme.spacing['4xl']};
  box-shadow: ${props => props.theme.shadows.sm};
`;

/**
 * Login Header - BEM: login-screen__header
 */
const StyledLoginHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['3xl']};
`;

/**
 * Login Title - BEM: login-screen__title
 */
const StyledLoginTitle = styled.h1`
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  font-size: ${props => props.theme.fontSize['4xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
`;

/**
 * Login Subtitle - BEM: login-screen__subtitle
 */
const StyledLoginSubtitle = styled.p`
  margin: 0;
  font-size: ${props => props.theme.fontSize.base};
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
  border-radius: ${props => props.theme.borderRadius.md};
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
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.status.warningText};
  font-size: ${props => props.theme.fontSize.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

/**
 * Submit Button - BEM: login-screen__submit-button
 */
const StyledSubmitButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.base} ${props => props.theme.spacing['2xl']};
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.bold};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.disabled ? props.theme.colors.button.disabled : props.theme.colors.button.primary};
  color: ${props => props.theme.colors.text.light};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: opacity ${props => props.theme.transitions.fast}, 
              transform ${props => props.theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

/**
 * Login Footer - BEM: login-screen__footer
 */
const StyledLoginFooter = styled.p`
  margin-top: ${props => props.theme.spacing['2xl']};
  text-align: center;
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text.tertiary};
`;

/**
 * Link to SignUp - BEM: login-screen__link
 */
const StyledLink = styled(Link)`
  color: ${props => props.theme.colors.text.tertiary};
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeight.bold};

  &:hover {
    text-decoration: underline;
    color: ${props => props.theme.colors.text.primary};
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
    <StyledLoginScreen className="login-screen">
      {/* Header */}
      <Header
        left={<Logo />}
        isAuthenticated={isAuthenticated}
      />
      
      <StyledLoginCardWrapper>
        <StyledLoginCard className="login-screen__card">
          {/* Header */}
          <StyledLoginHeader className="login-screen__header">
            <StyledLoginTitle className="login-screen__title">
              Avecta AI
            </StyledLoginTitle>
            <StyledLoginSubtitle className="login-screen__subtitle">
              Boas-vindas a Avecta AI
            </StyledLoginSubtitle>
          </StyledLoginHeader>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <StyledFormGroup className="login-screen__form-group">
            <FieldContainer className="login-screen__field-container">
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
            <FieldContainer className="login-screen__field-container">
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
          <StyledSubmitButton
            type="submit"
            disabled={isLoading}
            className="login-screen__submit-button"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </StyledSubmitButton>
        </form>

        {/* Footer */}
        <StyledLoginFooter className="login-screen__footer">
          Não tem uma conta?{' '}
          <StyledLink to="/auth/signup" className="login-screen__link">
            Criar conta
          </StyledLink>
        </StyledLoginFooter>
      </StyledLoginCard>
      </StyledLoginCardWrapper>

      {/* Toast Notification */}
      <Toast
        message={error}
        visible={error && toastVisible}
        onClose={handleCloseToast}
        isMobile={isMobile}
        icon="⚠️"
        variant="error"
      />
    </StyledLoginScreen>
  );
};
