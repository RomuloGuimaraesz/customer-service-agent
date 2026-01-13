import React from 'react';
import styled from 'styled-components';

/**
 * Header Container - BEM: header
 */
const StyledHeader = styled.header`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.colors.background.secondary};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};
`;

/**
 * Header Left Section - BEM: header__left
 */
const StyledHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

/**
 * Header Right Section - BEM: header__right
 */
const StyledHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
`;

/**
 * Last Updated Text - BEM: header__last-updated
 */
const StyledLastUpdated = styled.span`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

/**
 * Header Button - BEM: header__button
 */
const StyledHeaderButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  border: 1px solid ${props => props.theme.colors.border.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.background.secondary};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  opacity: ${props => props.disabled ? 0.7 : 1};

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.background.tertiary};
  }
`;

/**
 * User Info Container - BEM: header__user-info
 */
const StyledUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
`;

/**
 * Profile Icon Container - BEM: header__profile-icon
 */
const StyledProfileIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.background.tertiary};
  border-radius: ${props => props.theme.borderRadius['2xl']};
`;

/**
 * Logout Button - BEM: header__logout-button
 */
const StyledLogoutButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  border: 1px solid ${props => props.theme.colors.status.infoText};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: transparent;
  color: ${props => props.theme.colors.status.infoText};
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.colors.status.infoBg};
  }
`;

/**
 * Logo Text - BEM: header__logo
 */
const StyledLogo = styled.div`
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
`;

/**
 * Header Component
 * Reusable header component with left and right content sections
 * 
 * @param {Object} props
 * @param {React.ReactNode} [props.left] - Content to display on the left side
 * @param {React.ReactNode} [props.right] - Content to display on the right side
 * @param {boolean} [props.isAuthenticated] - Whether user is authenticated
 */
export const Header = ({ left, right, isAuthenticated = false }) => {
  return (
    <StyledHeader className="header">
      {left && (
        <StyledHeaderLeft className="header__left">
          {left}
        </StyledHeaderLeft>
      )}

      {right && isAuthenticated && (
        <StyledHeaderRight className="header__right">
          {right}
        </StyledHeaderRight>
      )}
    </StyledHeader>
  );
};

/**
 * LastUpdated Component
 * Displays a last updated timestamp
 * 
 * @param {Object} props
 * @param {Date} props.timestamp - The timestamp to display
 */
export const LastUpdated = ({ timestamp }) => {
  if (!timestamp) return null;

  return (
    <StyledLastUpdated className="header__last-updated">
      Atualizado: {timestamp.toLocaleTimeString('pt-BR')}
    </StyledLastUpdated>
  );
};

/**
 * HeaderButton Component
 * A button styled for use in headers
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} [props.onClick] - Click handler
 * @param {boolean} [props.disabled] - Whether the button is disabled
 * @param {string} [props.title] - Button title/tooltip
 */
export const HeaderButton = ({ children, onClick, disabled, title }) => {
  return (
    <StyledHeaderButton
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="header__button"
    >
      {children}
    </StyledHeaderButton>
  );
};

/**
 * UserInfo Component
 * Container for user information and actions
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - User info content
 */
export const UserInfo = ({ children }) => {
  return (
    <StyledUserInfo className="header__user-info">
      {children}
    </StyledUserInfo>
  );
};

/**
 * ProfileIcon Component
 * Displays a profile icon (SVG)
 * 
 * @param {Object} props
 * @param {string} props.iconSvg - SVG string to display
 */
export const ProfileIcon = ({ iconSvg }) => {
  return (
    <StyledProfileIcon 
      className="header__profile-icon"
      dangerouslySetInnerHTML={{ __html: iconSvg }} 
    />
  );
};

/**
 * LogoutButton Component
 * A button for logging out
 * 
 * @param {Object} props
 * @param {Function} props.onClick - Click handler for logout
 * @param {string} [props.label] - Button label (default: 'Sair')
 */
export const LogoutButton = ({ onClick, label = 'Sair' }) => {
  return (
    <StyledLogoutButton
      onClick={onClick}
      className="header__logout-button"
    >
      {label}
    </StyledLogoutButton>
  );
};

/**
 * Logo Component
 * Displays the application logo text
 * 
 * @param {Object} props
 * @param {string} [props.text] - Logo text (default: 'Rapidy Informática')
 */
export const Logo = ({ text = 'Rapidy Informática' }) => {
  return (
    <StyledLogo className="header__logo">
      {text}
    </StyledLogo>
  );
};

