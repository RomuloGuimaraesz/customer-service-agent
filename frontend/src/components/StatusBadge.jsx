import React from 'react';
import styled from 'styled-components';

/**
 * Status Badge - BEM: status-badge
 */
const StyledStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.xs};
  font-weight: ${props => props.theme.fontWeight.medium};
  border-radius: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.background.tertiary};
  color: ${props => props.theme.colors.text.secondary};
`;

/**
 * Status Badge Component
 */
export const StatusBadge = ({ status }) => {
  return (
    <StyledStatusBadge className="status-badge">
      {status}
    </StyledStatusBadge>
  );
};






