import styled from 'styled-components';

export const FieldContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  width: 100%;
  min-height: 48px;
  max-height: 48px;
  padding: 0 ${props => props.theme.spacing.lg};
  border: 1px solid ${props => props.theme.colors.border.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  background-color: ${props => props.theme.colors.background.tertiary};
  box-sizing: border-box;
  transition: border-color ${props => props.theme.transitions.normal},
              box-shadow ${props => props.theme.transitions.normal};

  &:focus-within {
    border-color: ${props => props.theme.colors.text.tertiary};
    box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.1);
  }
`;
