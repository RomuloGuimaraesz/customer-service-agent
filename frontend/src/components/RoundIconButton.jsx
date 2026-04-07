import React from 'react';
import styled, { css } from 'styled-components';

/** SVG sizing for inline icons (matches header profile / stroke icons). */
const iconSvgRules = css`
  svg {
    display: block;
    height: ${p => p.theme.colors.icon.profileSvgHeight};
    width: auto;
    max-width: 100%;
    overflow: visible;
  }

  svg path {
    stroke: currentColor;
    stroke-width: ${p => p.theme.colors.icon.strokeWidth};
  }
`;

const roundShell = css`
  box-sizing: border-box;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${p => p.theme.colors.background.white};
  ${iconSvgRules}
`;

/**
 * Non-interactive 32×32 round white surface for an icon (e.g. header profile chip on gray bars).
 */
export const RoundIconFrame = styled.div`
  ${roundShell}
  color: ${p => p.theme.colors.icon.stroke};
`;

const StyledRoundIconButton = styled.button`
  ${roundShell}
  border: none;
  cursor: pointer;
  transition: background-color ${p => p.theme.transitions.fast} ease,
    color ${p => p.theme.transitions.fast} ease;
  color: ${p =>
    p.$active ? p.theme.colors.text.light : p.theme.colors.text.primary};
  background-color: ${p =>
    p.$active ? p.theme.colors.button.primary : p.theme.colors.background.white};

  &:hover:not(:disabled) {
    background-color: ${p =>
      p.$active
        ? p.theme.colors.button.primaryHover
        : p.theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${p => p.theme.colors.focus.ring};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

/**
 * Circular radial icon control: white fill on neutral backgrounds; optional filled (dark) active state.
 * Used in main navigation pill and anywhere a compact round icon button is needed.
 */
export const RoundIconButton = React.forwardRef(
  ({ children, type = 'button', $active = false, ...rest }, ref) => (
    <StyledRoundIconButton
      ref={ref}
      type={type}
      $active={$active}
      {...rest}
    >
      {children}
    </StyledRoundIconButton>
  ),
);

RoundIconButton.displayName = 'RoundIconButton';
