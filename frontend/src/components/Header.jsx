import React from 'react';
import styled from 'styled-components';
import { Dropdown } from './Dropdown';

/**
 * Header Container - BEM: header
 */
const StyledHeader = styled.header`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
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
  gap: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
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
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: background-color ${props => props.theme.transitions.fast} ease;

  &:hover {
    background-color: ${props => props.theme.colors.background.tertiary};
  }
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
 * User Email Text - BEM: header__user-email
 * Hidden in trigger, shown in dropdown header
 */
const StyledUserEmail = styled.span`
  display: none;
`;

/**
 * Dropdown Header Email - BEM: header__user-info-dropdown-header-email
 */
const StyledDropdownHeaderEmail = styled.span`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text.primary};
  font-weight: ${props => props.theme.fontWeight.normal};
`;

/**
 * Dropdown Header Icon - BEM: header__user-info-dropdown-header-icon
 */
const StyledDropdownHeaderIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.background.tertiary};
  border-radius: ${props => props.theme.borderRadius['2xl']};
`;

/**
 * Dropdown Content Container - BEM: header__dropdown-content
 */
const StyledDropdownContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

/**
 * Profile Edit Button - BEM: header__profile-edit-button
 */
const StyledProfileEditButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  background-color: transparent;
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};

  &:hover {
    background-color: ${props => props.theme.colors.background.tertiary};
  }
`;

/**
 * Logout Button - BEM: header__logout-button
 * Now used inside dropdown, so styling is adjusted
 */
const StyledLogoutButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  background-color: transparent;
  color: ${props => props.theme.colors.status.infoText};
  cursor: pointer;
  text-align: left;

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
 * Last Updated Text - BEM: header__last-updated
 */
const StyledLastUpdated = styled.span`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
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
 * Container for user information with dropdown menu
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - User info content (ProfileIcon, username, etc.)
 * @param {Function} [props.onEditProfile] - Handler for profile edit button
 * @param {Function} [props.onLogout] - Handler for logout button
 * @param {string} [props.email] - User's email address (for dropdown header)
 * @param {string} [props.iconSvg] - Profile icon SVG (for dropdown header)
 */
export const UserInfo = ({ children, onEditProfile, onLogout, email, iconSvg }) => {
  // Build dropdown header
  const dropdownHeader = (email || iconSvg) ? (
    <>
      {iconSvg && (
        <StyledDropdownHeaderIcon 
          className="header__user-info-dropdown-header-icon"
          dangerouslySetInnerHTML={{ __html: iconSvg }} 
        />
      )}
      {email && (
        <StyledDropdownHeaderEmail className="header__user-info-dropdown-header-email">
          {email}
        </StyledDropdownHeaderEmail>
      )}
    </>
  ) : null;

  // Build dropdown content with both buttons
  const dropdownContent = (onEditProfile || onLogout) ? (
    <StyledDropdownContent className="header__dropdown-content">
      {onEditProfile && (
        <ProfileEditButton onClick={onEditProfile} />
      )}
      {onLogout && (
        <LogoutButton onClick={onLogout} />
      )}
    </StyledDropdownContent>
  ) : null;

  return (
    <Dropdown
      className="header__user-info"
      content={dropdownContent}
      header={dropdownHeader}
      align="right"
      minWidth="180px"
    >
      <StyledUserInfo className="header__user-info-trigger">
        {children}
      </StyledUserInfo>
    </Dropdown>
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
 * UserEmail Component
 * Displays the user's email address
 * 
 * @param {Object} props
 * @param {string} props.email - User's email address
 */
export const UserEmail = ({ email }) => {
  if (!email) return null;
  
  return (
    <StyledUserEmail className="header__user-email">
      {email}
    </StyledUserEmail>
  );
};

/**
 * ProfileEditButton Component
 * A button for editing user profile
 * 
 * @param {Object} props
 * @param {Function} props.onClick - Click handler for profile edit
 * @param {string} [props.label] - Button label (default: 'Editar Perfil')
 */
export const ProfileEditButton = ({ onClick, label = 'Editar Perfil' }) => {
  return (
    <StyledProfileEditButton
      onClick={onClick}
      className="header__profile-edit-button"
    >
      <span>✏️</span>
      <span>{label}</span>
    </StyledProfileEditButton>
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
export const Logo = ({ text = 'All Good Informatics' }) => {
  return (
    <StyledLogo className="header__logo">
      {text}
    </StyledLogo>
  );
};


/**
 * TODO: Move this component to the stats-grid component, change its naming accordingly to the block component naming.
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
      Última atualização: {timestamp.toLocaleTimeString('pt-BR')}
    </StyledLastUpdated>
  );
};
