import React from 'react';
import styled from 'styled-components';

const StyledPillButton = styled.button`
  box-sizing: border-box;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  border: none;
  border-radius: 9999px;
  background-color: ${props => props.theme.colors.background.white};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  opacity: ${props => (props.disabled ? 0.7 : 1)};
  transition: background-color ${props => props.theme.transitions.fast} ease;

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.focus.ring};
    outline-offset: 2px;
  }
`;

/**
 * Pill-shaped control: white surface, no border, full corner radius.
 * For use on gray / neutral backgrounds (header, toolbars, etc.).
 */
export const PillButton = React.forwardRef(
  ({ children, type = 'button', ...rest }, ref) => (
    <StyledPillButton ref={ref} type={type} {...rest}>
      {children}
    </StyledPillButton>
  ),
);

PillButton.displayName = 'PillButton';
