import React from 'react';
import styled from 'styled-components';
import { Logo } from './Header';

/**
 * Root grid for auth screens — BEM: auth-screen (modifier via parent className)
 */
export const AuthScreenRoot = styled.div`
  min-height: 100vh;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: stretch;
  font-family: ${props => props.theme.fontFamily.primary};
  color: ${props => props.theme.colors.text.primary};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`;

/**
 * Left brand column
 */
export const AuthBrandColumn = styled.aside`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing['4xl']};
  background-color: ${props => props.theme.colors.background.secondary};

  &.login-screen__brand,
  &.signup-screen__brand {
    background-color: ${props => props.theme.colors.background.white};
  }
  box-sizing: border-box;

  .header__logo-img {
    height: 40px;
    width: auto;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing['2xl']};
  }
`;

export const AuthBrandTagline = styled.p`
  margin: 0;
  font-size: ${props => props.theme.fontSize.base};
  font-weight: ${props => props.theme.fontWeight.normal};
  line-height: 1.45;
  color: ${props => props.theme.colors.text.secondary};
  text-align: center;
  max-width: 280px;
`;

/**
 * Right column — form area
 */
export const AuthFormColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing['2xl']};
  background-color: ${props => props.theme.colors.background.primary};
  box-sizing: border-box;
  min-height: 0;
  overflow: auto;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    justify-content: flex-start;
    padding: ${props => props.theme.spacing.lg};
  }
`;

/**
 * Default left panel: logo and optional tagline
 */
export const AuthBrandPanel = ({ tagline, className }) => {
  return (
    <AuthBrandColumn className={className}>
      <Logo />
      {tagline ? <AuthBrandTagline>{tagline}</AuthBrandTagline> : null}
    </AuthBrandColumn>
  );
};
