import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import dashboardIconSvg from '../../assets/img/dashboard-icon.svg?raw';
import newContactIconSvg from '../../assets/img/new-contact-icon.svg?raw';
import { ROUTES } from '../config/routes';
import { RoundIconButton } from './RoundIconButton';

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

const Icon = styled.span`
  display: inline-flex;
  width: 14px;
  height: 14px;
  align-items: center;
  justify-content: center;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  svg path {
    stroke: currentColor;
  }
`;

const toCurrentColorStroke = (svgString) => {
  if (!svgString) return '';
  return svgString.replaceAll('stroke="black"', 'stroke="currentColor"');
};

/**
 * Centered header pill: two mode buttons (icons later). See docs/HEADER_PILL_SWITCHER.md.
 */
export const MainNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboardActive = location.pathname.startsWith(ROUTES.DASHBOARD.BASE);
  const isContatosActive = location.pathname.startsWith(ROUTES.CONTATOS.BASE);

  return (
    <nav className="main-navigation" aria-label="Navegação principal">
      <Pill className="main-navigation__pill">
        <RoundIconButton
          type="button"
          className="main-navigation__btn main-navigation__btn--dashboard"
          aria-label="Dashboard"
          aria-current={isDashboardActive ? 'page' : undefined}
          $active={isDashboardActive}
          onClick={() => {
            if (!isDashboardActive) navigate(ROUTES.DASHBOARD.BASE);
          }}
        >
          <Icon
            className="main-navigation__icon main-navigation__icon--dashboard"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: toCurrentColorStroke(dashboardIconSvg) }}
          />
        </RoundIconButton>
        <RoundIconButton
          type="button"
          className="main-navigation__btn main-navigation__btn--contatos"
          aria-label="Contatos"
          aria-current={isContatosActive ? 'page' : undefined}
          $active={isContatosActive}
          onClick={() => {
            if (!isContatosActive) navigate(ROUTES.CONTATOS.BASE);
          }}
        >
          <Icon
            className="main-navigation__icon main-navigation__icon--contatos"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: toCurrentColorStroke(newContactIconSvg) }}
          />
        </RoundIconButton>
      </Pill>
    </nav>
  );
};
