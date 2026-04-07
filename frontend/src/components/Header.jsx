import React from 'react';
import styled from 'styled-components';
import { Dropdown } from './Dropdown';
import { PillButton } from './PillButton';
import { RoundIconFrame } from './RoundIconButton';
import logoPb from '../../assets/img/avecta-logo-pb.png';
import chevronDownSvg from '../../assets/img/chevron-down.svg?raw';

const PROFILE_DROPDOWN_CHEVRON_SVG = chevronDownSvg.replace(
  /stroke="#443D4F"/g,
  'stroke="currentColor"',
);

// ============================================================================
// CONFIGURATION - Easy to find and change
// ============================================================================
const CONFIG = {
  logoText: 'Avecta AI',
  profileEditLabel: 'Editar Perfil',
  logoutLabel: 'Sair',
};

// ============================================================================
// STYLED COMPONENTS - Grouped by section
// ============================================================================

// Header Layout
const StyledHeader = styled.header`
  box-sizing: border-box;
  height: 64px;
  padding: 0 ${props => props.theme.spacing['5xl']};
  align-items: center;

  ${props =>
    props.$centerLogo
      ? `
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: ${props.theme.spacing.md};
  `
      : `
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    column-gap: ${props.theme.spacing.md};
  `}
`;

const StyledHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  justify-self: start;
`;

const StyledHeaderCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  justify-self: center;
`;

const StyledHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  flex-wrap: wrap;
  justify-self: end;
`;

// User Info
const StyledUserInfo = styled.div`
  background-color: ${props => props.theme.colors.background.white};
  box-sizing: border-box;
  height: 32px;
  width: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: ${props => props.theme.spacing.md};
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius['5xl']};
  transition: background-color ${props => props.theme.transitions.fast} ease;

  &:hover {
    background-color: ${props => props.theme.colors.background.tertiary};
  }
`;

/** Inline profile glyph (no round frame); sits on header__user-info-trigger pill. */
const StyledProfileSvgHost = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${p => p.theme.colors.icon.stroke};

  svg {
    display: block;
    height: 12px;
    width: auto;
    max-width: 100%;
    overflow: visible;
  }

  svg path {
    stroke: currentColor;
    stroke-width: ${p => p.theme.colors.icon.strokeWidth};
  }
`;

/** Round white chip matching profile icon; chevron uses asset-native stroke width. */
const StyledProfileDropdown = styled(RoundIconFrame)`
  flex-shrink: 0;

  svg {
    width: 8px;
    height: 5px;
    max-width: none;
  }

  svg path {
    stroke-width: 1.25px;
  }
`;

const StyledUserEmail = styled.span`
  display: none;
`;

// Dropdown
const StyledDropdownHeaderEmail = styled.span`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text.primary};
  font-weight: ${props => props.theme.fontWeight.normal};
`;

const StyledDropdownContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

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

// Logo
const StyledLogo = styled.div`
  display: inline-flex;
  align-items: center;
`;

const StyledLogoImg = styled.img`
  height: 24px;
  width: auto;
  display: block;
  object-fit: contain;
`;

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Header Component
 * Reusable header component with left, optional center, and right sections
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.left] - Content on the left (e.g. logo)
 * @param {React.ReactNode} [props.center] - Centered content when authenticated (e.g. MainNavigation)
 * @param {React.ReactNode} [props.right] - Content on the right when authenticated
 * @param {boolean} [props.isAuthenticated] - Whether user is authenticated
 * @param {boolean} [props.centerLogo] - When true, centers left only (e.g. auth screens)
 */
export const Header = ({
  left,
  center,
  right,
  isAuthenticated = false,
  centerLogo = false,
}) => {
  return (
    <StyledHeader
      className={`header${centerLogo ? ' header--center-logo' : ''}`}
      $centerLogo={centerLogo}
    >
      {centerLogo ? (
        left && (
          <StyledHeaderLeft className="header__left">
            {left}
          </StyledHeaderLeft>
        )
      ) : (
        <>
          {left && (
            <StyledHeaderLeft className="header__left">
              {left}
            </StyledHeaderLeft>
          )}
          {center && isAuthenticated && (
            <StyledHeaderCenter className="header__center">
              {center}
            </StyledHeaderCenter>
          )}
          {right && isAuthenticated && (
            <StyledHeaderRight className="header__right">
              {right}
            </StyledHeaderRight>
          )}
        </>
      )}
    </StyledHeader>
  );
};

/**
 * HeaderButton Component
 * Statistics action in the dashboard header (BEM: header__user-statistics).
 * Built on PillButton; extra native button props are forwarded.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} [props.onClick] - Click handler
 * @param {boolean} [props.disabled] - Whether the button is disabled
 * @param {string} [props.title] - Button title/tooltip
 */
export const HeaderButton = ({ children, onClick, disabled, title, ...rest }) => {
  return (
    <PillButton
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="header__user-statistics"
      {...rest}
    >
      {children}
    </PillButton>
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
  const dropdownHeader = (email || iconSvg) ? (
    <>
      {iconSvg && (
        <RoundIconFrame
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
      toggleSelector=".header__profile-dropdown"
    >
      <StyledUserInfo className="header__user-info-trigger">
        {children}
        <StyledProfileDropdown
          className="header__profile-dropdown"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: PROFILE_DROPDOWN_CHEVRON_SVG }}
        />
      </StyledUserInfo>
    </Dropdown>
  );
};

/**
 * ProfileIcon Component
 * Renders the profile SVG inline (no wrapper chip; trigger pill provides the surface).
 *
 * @param {Object} props
 * @param {string} props.iconSvg - SVG string to display
 */
export const ProfileIcon = ({ iconSvg }) => {
  if (!iconSvg) return null;
  return (
    <StyledProfileSvgHost dangerouslySetInnerHTML={{ __html: iconSvg }} />
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
export const ProfileEditButton = ({ onClick, label = CONFIG.profileEditLabel }) => {
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
export const LogoutButton = ({ onClick, label = CONFIG.logoutLabel }) => {
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
 * Displays the application logo image (accessible name via alt)
 *
 * @param {Object} props
 * @param {string} [props.alt] - Image alt text / accessible name (default: from CONFIG.logoText)
 */
export const Logo = ({ alt = CONFIG.logoText }) => {
  return (
    <StyledLogo className="header__logo">
      <StyledLogoImg
        src={logoPb}
        alt={alt}
        className="header__logo-img"
        decoding="async"
      />
    </StyledLogo>
  );
};
