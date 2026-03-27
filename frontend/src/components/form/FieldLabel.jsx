import styled from 'styled-components';

export const FieldLabel = styled.label`
  display: block;
  font-size: ${props => props.theme.fontSize.base};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  white-space: nowrap;
  flex-shrink: 0;
`;
