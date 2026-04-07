import styled from 'styled-components';

export const FormSubmitButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing['2xl']};
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.bold};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.disabled ? props.theme.colors.button.disabled : props.theme.colors.button.primary};
  color: ${props => props.theme.colors.text.light};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: opacity ${props => props.theme.transitions.fast},
              transform ${props => props.theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;
