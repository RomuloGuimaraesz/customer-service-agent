import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

/**
 * Global styles for the application
 * Following BEM naming convention
 */
export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html {
    background-color: ${theme.colors.background.primary};
  }

  body {
    margin: 0 auto;
    padding: 0;
    max-width: 1200px;
    background-color: inherit;
    font-family: ${theme.fontFamily.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Scrollbar styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.background.primary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.border.primary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.text.tertiary};
  }

  /* Animations */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
