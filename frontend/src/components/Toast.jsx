import React from 'react';
import styled from 'styled-components';

const VARIANT_COLORS = {
  success: { accent: 'success', text: 'successText', hoverBg: 'successBg' },
  error: { accent: 'error', text: 'errorText', hoverBg: 'errorBg' },
  warning: { accent: 'warning', text: 'warningText', hoverBg: 'warningBg' },
  info: { accent: 'info', text: 'infoText', hoverBg: 'infoBg' },
};

const getVariant = variant => VARIANT_COLORS[variant] ?? VARIANT_COLORS.error;

const variantColor = key => props =>
  props.theme.colors.status[getVariant(props.$variant)[key]];

/**
 * Toast Notification Container - BEM: toast
 */
const StyledToast = styled.div`
  position: fixed;
  top: ${props => props.$isMobile ? props.theme.spacing.lg : props.theme.spacing.xl};
  left: ${props => props.$isMobile ? props.theme.spacing.lg : 'auto'};
  right: ${props => props.$isMobile ? props.theme.spacing.lg : props.theme.spacing.xl};
  max-width: ${props => props.$isMobile ? 'calc(100% - 32px)' : '400px'};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.background.white};
  border: 1px solid ${props => props.theme.colors.border.primary};
  border-left: 4px solid ${variantColor('accent')};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${variantColor('text')};
  font-size: ${props => props.theme.fontSize.md};
  z-index: ${props => props.theme.zIndex.toast};
  box-shadow: ${props => props.theme.shadows.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  animation: slideIn ${props => props.theme.transitions.slow} ease-out;
`;

/**
 * Toast Icon - BEM: toast__icon
 */
const StyledToastIcon = styled.span`
  font-size: ${props => props.theme.fontSize.xl};
  color: ${variantColor('accent')};
  flex-shrink: 0;
`;

/**
 * Toast Message - BEM: toast__message
 */
const StyledToastMessage = styled.span`
  flex: 1;
`;

/**
 * Toast Close Button - BEM: toast__close
 */
const StyledToastClose = styled.button`
  background: transparent;
  border: none;
  color: ${variantColor('text')};
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.fontSize['2xl']};
  line-height: 1;
  flex-shrink: 0;
  transition: background-color ${props => props.theme.transitions.normal};

  &:hover {
    background-color: ${variantColor('hoverBg')};
  }
`;

/**
 * Toast Component
 * Displays system messages/notifications to the user
 * 
 * @param {Object} props
 * @param {string} props.message - The message to display
 * @param {boolean} props.visible - Whether the toast is visible
 * @param {Function} props.onClose - Callback when toast is closed
 * @param {boolean} props.isMobile - Whether the device is mobile (for responsive styling)
 * @param {string} [props.icon] - Optional icon/emoji to display (default: '⚠️')
 * @param {string} [props.variant] - Toast variant: 'error', 'success', 'warning', 'info' (default: error palette)
 */
export const Toast = ({ 
  message, 
  visible, 
  onClose, 
  isMobile = false,
  icon = '⚠️',
  variant = 'default'
}) => {
  if (!visible) return null;

  return (
    <StyledToast $isMobile={isMobile} $variant={variant} className="toast">
      <StyledToastIcon $variant={variant} className="toast__icon">{icon}</StyledToastIcon>
      <StyledToastMessage className="toast__message">
        {message}
      </StyledToastMessage>
      <StyledToastClose
        $variant={variant}
        onClick={onClose}
        className="toast__close"
        aria-label="Fechar"
      >
        ×
      </StyledToastClose>
    </StyledToast>
  );
};

