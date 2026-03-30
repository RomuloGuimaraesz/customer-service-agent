import React from 'react';
import styled from 'styled-components';

const Pill = styled.div`
  box-sizing: border-box;
  width: 76px;
  height: 40px;
  padding: ${props => props.theme.spacing.xs};
  background-color: ${props => props.theme.colors.background.white};
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const NavRoundButton = styled.button`
  box-sizing: border-box;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border: none;
  padding: 0;
  border-radius: 50%;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.focus.ring};
    outline-offset: 2px;
  }
`;

const DashboardNavButton = styled(NavRoundButton)`
  background-color: #000000;
`;

const ContatosNavButton = styled(NavRoundButton)`
  background-color: ${props => props.theme.colors.button.primary};
`;

/**
 * Centered header pill: two mode buttons (icons later). See docs/HEADER_PILL_SWITCHER.md.
 */
export const MainNavigation = () => {
  return (
    <nav className="main-navigation" aria-label="Navegação principal">
      <Pill className="main-navigation__pill">
        <DashboardNavButton
          type="button"
          className="main-navigation__btn main-navigation__btn--dashboard"
          aria-label="Dashboard"
        />
        <ContatosNavButton
          type="button"
          className="main-navigation__btn main-navigation__btn--contatos"
          aria-label="Contatos"
        />
      </Pill>
    </nav>
  );
};
