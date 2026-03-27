import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../styles/theme';
import { FormSubmitButton } from './FormSubmitButton';

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('FormSubmitButton', () => {
  it('renders children and submit type', () => {
    const { container } = renderWithTheme(
      <FormSubmitButton type="submit">Entrar</FormSubmitButton>
    );

    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Entrar');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('respects disabled state', () => {
    renderWithTheme(
      <FormSubmitButton disabled>Entrando...</FormSubmitButton>
    );

    expect(
      screen.getByRole('button', { name: 'Entrando...' })
    ).toBeDisabled();
  });
});
