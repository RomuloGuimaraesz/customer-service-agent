import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../styles/theme';
import { FieldContainer, FieldInput, FieldLabel } from './index';

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('Form field reusable components', () => {
  it('uses a non-label wrapper to avoid nested labels', () => {
    const { container } = renderWithTheme(
      <FieldContainer>
        <FieldLabel htmlFor="username">Usuario</FieldLabel>
        <FieldInput id="username" />
      </FieldContainer>
    );

    const wrapper = container.firstChild;
    expect(wrapper.tagName.toLowerCase()).toBe('div');
    expect(wrapper.querySelectorAll('label')).toHaveLength(1);
  });

  it('links FieldLabel htmlFor with FieldInput id', () => {
    renderWithTheme(
      <FieldContainer>
        <FieldLabel htmlFor="password">Senha</FieldLabel>
        <FieldInput id="password" />
      </FieldContainer>
    );

    const label = screen.getByText('Senha');
    const input = screen.getByRole('textbox');

    expect(label).toHaveAttribute('for', 'password');
    expect(input).toHaveAttribute('id', 'password');
  });

  it('exposes input through label text for accessible queries', () => {
    renderWithTheme(
      <FieldContainer>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <FieldInput id="email" type="text" />
      </FieldContainer>
    );

    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('id', 'email');
  });
});
