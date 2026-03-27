import styled from 'styled-components';

export const FieldInput = styled.input`
  width: 100%;
  min-width: 0;
  height: 100%;
  padding: 0;
  font-size: ${props => props.theme.fontSize.base};
  border: none;
  border-radius: 0;
  background-color: transparent;
  color: ${props => props.theme.colors.text.primary};
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
  }
`;
