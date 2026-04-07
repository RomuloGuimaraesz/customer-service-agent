import styled from 'styled-components';

/** Same typography as FieldInput; use inside FieldContainer (e.g. $multiline). */
export const FieldTextarea = styled.textarea`
  width: 100%;
  min-width: 0;
  min-height: 0;
  flex: 1;
  padding: 0;
  font-size: ${props => props.theme.fontSize.base};
  line-height: 1.35;
  border: none;
  border-radius: 0;
  background-color: transparent;
  color: ${props => props.theme.colors.text.primary};
  outline: none;
  box-sizing: border-box;
  resize: none;
  font-family: inherit;

  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
  }
`;
