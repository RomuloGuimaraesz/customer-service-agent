import React from 'react';
import styled from 'styled-components';

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
  background-color: ${props => {
    if (props.$variant === 'error') {
      // Use errorText color (#991b1b) with 20% opacity
      return 'rgba(153, 27, 27, 0.2)';
    }
    if (props.$variant === 'success') {
      // Use successText color (#065f46) with 20% opacity
      return 'rgba(6, 95, 70, 0.2)';
    }
    return props.theme.colors.background.secondary;
  }};
  border: 1px solid ${props => {
    if (props.$variant === 'error') {
      // Use errorText color (#991b1b) with 80% opacity
      return 'rgba(153, 27, 27, 0.8)';
    }
    if (props.$variant === 'success') {
      // Use success color (#10b981) with 80% opacity
      return 'rgba(16, 185, 129, 0.8)';
    }
    return props.theme.colors.status.errorBg;
  }};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => {
    if (props.$variant === 'success') {
      return props.theme.colors.status.successText;
    }
    return props.theme.colors.status.errorText;
  }};
  font-size: ${props => props.theme.fontSize.md};
  z-index: ${props => props.theme.zIndex.toast};
  box-shadow: ${props => props.theme.shadows.md};
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
  color: ${props => {
    if (props.$variant === 'success') {
      return props.theme.colors.status.successText;
    }
    return props.theme.colors.status.errorText;
  }};
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
    background-color: ${props => {
      if (props.$variant === 'success') {
        return props.theme.colors.status.successBg;
      }
      return props.theme.colors.status.errorBg;
    }};
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
 * @param {string} [props.variant] - Toast variant: 'error', 'success', or default
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
      <StyledToastIcon className="toast__icon">{icon}</StyledToastIcon>
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

