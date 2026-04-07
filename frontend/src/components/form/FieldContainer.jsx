import styled from 'styled-components';

export const FieldContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.xs};
  width: 100%;
  box-sizing: border-box;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.lg};

  ${props =>
    props.$multiline
      ? `
    flex-direction: column;
    align-items: stretch;
    flex-wrap: nowrap;
    min-height: 48px;
    max-height: 70px;
  `
      : `
    align-items: center;
    min-height: 48px;
    max-height: 48px;
  `}
  border: ${props =>
    props.$borderless ? 'none' : `1px solid ${props.theme.colors.border.primary}`};
  border-radius: ${props => props.theme.borderRadius.lg};
  background-color: ${props => props.theme.colors.background.tertiary};
  transition: border-color ${props => props.theme.transitions.normal},
              box-shadow ${props => props.theme.transitions.normal};

  ${props =>
    props.$borderless
      ? `
    position: relative;
    isolation: isolate;

    & > * {
      position: relative;
      z-index: 1;
    }

    &:focus-within::after {
      content: '';
      position: absolute;
      inset: -3px;
      z-index: 0;
      border-radius: calc(${props.theme.borderRadius.lg} + 3px);
      padding: 3px;
      box-sizing: border-box;
      pointer-events: none;
      background: linear-gradient(
        145deg,
        color-mix(in srgb, ${props.theme.colors.focus.ringGradientStart} ${props.theme.colors.focus.ringStrengthPercent}%, transparent),
        color-mix(in srgb, ${props.theme.colors.focus.ring} ${props.theme.colors.focus.ringStrengthPercent}%, transparent)
      );
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      mask-composite: exclude;
    }
  `
      : ''}

  ${props =>
    props.$borderless
      ? ''
      : `
    &:focus-within {
      border-color: ${props.theme.colors.text.tertiary};
      box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.1);
    }
  `}
`;
