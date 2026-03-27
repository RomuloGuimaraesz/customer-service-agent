import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Header, Logo } from './Header';
import { Toast } from './Toast';
import { FieldContainer, FieldInput, FieldLabel } from './form';
import styled from 'styled-components';

/**
 * SignUp Screen Container - BEM: signup-screen
 */
const StyledSignUpScreen = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  font-family: ${props => props.theme.fontFamily.primary};
  padding: ${props => props.theme.spacing.xl};
`;

/**
 * SignUp Card Wrapper - BEM: signup-screen__card-wrapper
 */
const StyledSignUpCardWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * SignUp Card - BEM: signup-screen__card
 */
const StyledSignUpCard = styled.div`
  width: 100%;
  max-width: 420px;
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  border: none;
  padding: ${props => props.theme.spacing['4xl']};
  box-shadow: ${props => props.theme.shadows.sm};
`;

/**
 * SignUp Header - BEM: signup-screen__header
 */
const StyledSignUpHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['3xl']};
`;

/**
 * SignUp Title - BEM: signup-screen__title
 */
const StyledSignUpTitle = styled.h1`
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  font-size: ${props => props.theme.fontSize['4xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
`;

/**
 * SignUp Subtitle - BEM: signup-screen__subtitle
 */
const StyledSignUpSubtitle = styled.p`
  margin: 0;
  font-size: ${props => props.theme.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
`;

/**
 * Form Group - BEM: signup-screen__form-group
 */
const StyledFormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

/**
 * Error Message - BEM: signup-screen__error
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
 * Success Message - BEM: signup-screen__success
 */
const StyledSuccessMessage = styled.div`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  background-color: ${props => props.theme.colors.status.successBg || '#d1fae5'};
  border: 1px solid ${props => props.theme.colors.status.success || '#10b981'};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.status.successText || '#065f46'};
  font-size: ${props => props.theme.fontSize.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${props => props.theme.spacing.sm};
`;

/**
 * Close Button for Messages - BEM: signup-screen__close-button
 */
const StyledCloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: ${props => props.theme.fontSize.lg};
  padding: 0;
  margin-left: ${props => props.theme.spacing.sm};
  opacity: 0.7;
  transition: opacity ${props => props.theme.transitions.fast};

  &:hover {
    opacity: 1;
  }
`;

/**
 * Submit Button - BEM: signup-screen__submit-button
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
 * SignUp Footer - BEM: signup-screen__footer
 */
const StyledSignUpFooter = styled.p`
  margin-top: ${props => props.theme.spacing['2xl']};
  text-align: center;
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text.tertiary};
`;

/**
 * Link to Login - BEM: signup-screen__link
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
 * SignUp Screen Component
 */
export const SignUpScreen = () => {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [redirectingMessage, setRedirectingMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Note: After signup, user should NOT be authenticated until email is confirmed
  // So we don't redirect to dashboard here - user will be redirected to login instead

  // Handle mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show toast when success message appears
  useEffect(() => {
    if (successMessage) {
      setToastVisible(true);
    }
  }, [successMessage]);

  // Handle success message timing and redirect
  useEffect(() => {
    if (successMessage && toastVisible) {
      // Show success message for 4 seconds (longer so user can read email confirmation message), then redirect
      const successTimer = setTimeout(() => {
        setToastVisible(false);
        setSuccessMessage('');
        setRedirectingMessage('Redirecionando...');
      }, 4000);

      return () => clearTimeout(successTimer);
    }
  }, [successMessage, toastVisible]);

  // Handle redirecting message and navigation
  useEffect(() => {
    if (redirectingMessage) {
      // Show redirecting message briefly, then navigate to login
      const redirectTimer = setTimeout(() => {
        navigate('/auth/login', { replace: true });
      }, 1000);

      return () => clearTimeout(redirectTimer);
    }
  }, [redirectingMessage, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setRedirectingMessage('');
    setToastVisible(false);
    setIsLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    const result = await signup({
      email,
      password,
      fullName: fullName || null,
    });

    if (!result.success) {
      setError(result.error);
      setIsLoading(false);
    } else {
      // Show success message with email confirmation instructions
      const message = result.warning || 'Conta criada com sucesso! Por favor, verifique seu email para confirmar sua conta.';
      setSuccessMessage(message);
      setIsLoading(false);
    }
  };

  const handleCloseToast = () => {
    setToastVisible(false);
    setSuccessMessage('');
    if (!redirectingMessage) {
      setRedirectingMessage('Redirecionando...');
    }
  };

  const handleCloseRedirecting = () => {
    setRedirectingMessage('');
    navigate('/auth/login', { replace: true });
  };

  return (
    <StyledSignUpScreen className="signup-screen">
      {/* Header */}
      <Header
        left={<Logo />}
        isAuthenticated={isAuthenticated}
      />
      
      <StyledSignUpCardWrapper>
        <StyledSignUpCard className="signup-screen__card">
          {/* Header */}
          <StyledSignUpHeader className="signup-screen__header">
            <StyledSignUpTitle className="signup-screen__title">
              Criar Conta
            </StyledSignUpTitle>
            <StyledSignUpSubtitle className="signup-screen__subtitle">
              Preencha os dados para criar sua conta
            </StyledSignUpSubtitle>
          </StyledSignUpHeader>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <StyledFormGroup className="signup-screen__form-group">
            <FieldContainer className="signup-screen__field-container">
              <FieldLabel htmlFor="fullName" className="signup-screen__label">
                Nome Completo
              </FieldLabel>
              <FieldInput
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Informe seu nome completo"
                className="signup-screen__input"
              />
            </FieldContainer>
          </StyledFormGroup>

          <StyledFormGroup className="signup-screen__form-group">
            <FieldContainer className="signup-screen__field-container">
              <FieldLabel htmlFor="email" className="signup-screen__label">
                Email
              </FieldLabel>
              <FieldInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Informe seu email"
                required
                className="signup-screen__input"
              />
            </FieldContainer>
          </StyledFormGroup>

          <StyledFormGroup className="signup-screen__form-group">
            <FieldContainer className="signup-screen__field-container">
              <FieldLabel htmlFor="password" className="signup-screen__label">
                Senha
              </FieldLabel>
              <FieldInput
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crie uma senha (mínimo 6 caracteres)"
                required
                minLength={6}
                className="signup-screen__input"
              />
            </FieldContainer>
          </StyledFormGroup>

          <StyledFormGroup className="signup-screen__form-group">
            <FieldContainer className="signup-screen__field-container">
              <FieldLabel htmlFor="confirmPassword" className="signup-screen__label">
                Confirmar Senha
              </FieldLabel>
              <FieldInput
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
                required
                minLength={6}
                className="signup-screen__input"
              />
            </FieldContainer>
          </StyledFormGroup>

          {/* Error Message */}
          {error && (
            <StyledErrorMessage className="signup-screen__error">
              <span>⚠️</span> {error}
            </StyledErrorMessage>
          )}

          {/* Redirecting Message */}
          {redirectingMessage && (
            <StyledSuccessMessage className="signup-screen__success">
              <span>
                <span>ℹ️</span> {redirectingMessage}
              </span>
              <StyledCloseButton
                onClick={handleCloseRedirecting}
                className="signup-screen__close-button"
                aria-label="Fechar mensagem"
              >
                ×
              </StyledCloseButton>
            </StyledSuccessMessage>
          )}

          {/* Submit Button */}
          <StyledSubmitButton
            type="submit"
            disabled={isLoading}
            className="signup-screen__submit-button"
          >
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
          </StyledSubmitButton>
        </form>

        {/* Footer */}
        <StyledSignUpFooter className="signup-screen__footer">
          Já tem uma conta?{' '}
          <StyledLink to="/auth/login" className="signup-screen__link">
            Fazer login
          </StyledLink>
        </StyledSignUpFooter>
      </StyledSignUpCard>
      </StyledSignUpCardWrapper>

      {/* Toast Notification */}
      <Toast
        message={successMessage}
        visible={successMessage && toastVisible}
        onClose={handleCloseToast}
        isMobile={isMobile}
        icon="✅"
        variant="success"
      />
    </StyledSignUpScreen>
  );
};

