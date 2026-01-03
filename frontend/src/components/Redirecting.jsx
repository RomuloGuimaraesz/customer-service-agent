import React from 'react';
import styled from 'styled-components';

/**
 * Redirecting Container - BEM: redirecting
 */
const StyledRedirectingContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background.dark};
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * Redirecting Text - BEM: redirecting__text
 */
const StyledRedirectingText = styled.div`
  font-size: ${props => props.theme.fontSize.xl};
  color: ${props => props.theme.colors.text.light};
  font-family: ${props => props.theme.fontFamily.primary};
`;

/**
 * Redirecting Component - Shows redirecting message during route resolution
 */
export const Redirecting = () => {
  return (
    <StyledRedirectingContainer className="redirecting">
      <StyledRedirectingText className="redirecting__text">
        Redirecionando...
      </StyledRedirectingText>
    </StyledRedirectingContainer>
  );
};

