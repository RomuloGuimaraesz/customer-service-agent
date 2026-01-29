import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import {
  Header,
  HeaderButton,
  Logo,
  UserInfo,
  ProfileIcon,
  UserEmail,
  ProfileEditButton,
  LogoutButton,
  LastUpdated,
} from './Header';
import { theme } from '../styles/theme';

// Mock Dropdown component
vi.mock('./Dropdown', () => ({
  Dropdown: ({ children, content, header, className }) => (
    <div data-testid="dropdown" className={className}>
      <div data-testid="dropdown-trigger">{children}</div>
      {content && <div data-testid="dropdown-content">{content}</div>}
      {header && <div data-testid="dropdown-header">{header}</div>}
    </div>
  ),
}));

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('Header Component', () => {
  describe('Header', () => {
    it('should render with left content', () => {
      renderWithTheme(
        <Header left={<div>Left Content</div>} />
      );
      expect(screen.getByText('Left Content')).toBeInTheDocument();
    });

    it('should render with right content when authenticated', () => {
      renderWithTheme(
        <Header 
          right={<div>Right Content</div>} 
          isAuthenticated={true} 
        />
      );
      expect(screen.getByText('Right Content')).toBeInTheDocument();
    });

    it('should not render right content when not authenticated', () => {
      renderWithTheme(
        <Header 
          right={<div>Right Content</div>} 
          isAuthenticated={false} 
        />
      );
      expect(screen.queryByText('Right Content')).not.toBeInTheDocument();
    });

    it('should render both left and right content when authenticated', () => {
      renderWithTheme(
        <Header 
          left={<div>Left Content</div>}
          right={<div>Right Content</div>} 
          isAuthenticated={true} 
        />
      );
      expect(screen.getByText('Left Content')).toBeInTheDocument();
      expect(screen.getByText('Right Content')).toBeInTheDocument();
    });

    it('should have correct className', () => {
      const { container } = renderWithTheme(
        <Header left={<div>Test</div>} />
      );
      expect(container.querySelector('.header')).toBeInTheDocument();
    });
  });

  describe('HeaderButton', () => {
    it('should render button with children', () => {
      renderWithTheme(
        <HeaderButton>Click Me</HeaderButton>
      );
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      renderWithTheme(
        <HeaderButton onClick={handleClick}>Click Me</HeaderButton>
      );
      fireEvent.click(screen.getByText('Click Me'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', () => {
      renderWithTheme(
        <HeaderButton disabled>Disabled Button</HeaderButton>
      );
      const button = screen.getByText('Disabled Button');
      expect(button).toBeDisabled();
    });

    it('should have title attribute when provided', () => {
      renderWithTheme(
        <HeaderButton title="Tooltip">Button</HeaderButton>
      );
      expect(screen.getByTitle('Tooltip')).toBeInTheDocument();
    });
  });

  describe('Logo', () => {
    it('should render with default text from CONFIG', () => {
      renderWithTheme(<Logo />);
      expect(screen.getByText('Acme Co')).toBeInTheDocument();
    });

    it('should render with custom text when provided', () => {
      renderWithTheme(<Logo text="Custom Logo" />);
      expect(screen.getByText('Custom Logo')).toBeInTheDocument();
    });

    it('should have correct className', () => {
      const { container } = renderWithTheme(<Logo />);
      expect(container.querySelector('.header__logo')).toBeInTheDocument();
    });
  });

  describe('ProfileIcon', () => {
    it('should render SVG icon', () => {
      const svgIcon = '<svg><circle r="10"/></svg>';
      const { container } = renderWithTheme(
        <ProfileIcon iconSvg={svgIcon} />
      );
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should have correct className', () => {
      const svgIcon = '<svg><circle r="10"/></svg>';
      const { container } = renderWithTheme(
        <ProfileIcon iconSvg={svgIcon} />
      );
      expect(container.querySelector('.header__profile-icon')).toBeInTheDocument();
    });
  });

  describe('UserEmail', () => {
    it('should render email when provided', () => {
      renderWithTheme(<UserEmail email="test@example.com" />);
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('should not render when email is not provided', () => {
      const { container } = renderWithTheme(<UserEmail />);
      expect(container.querySelector('.header__user-email')).not.toBeInTheDocument();
    });

    it('should not render when email is null', () => {
      const { container } = renderWithTheme(<UserEmail email={null} />);
      expect(container.querySelector('.header__user-email')).not.toBeInTheDocument();
    });
  });

  describe('ProfileEditButton', () => {
    it('should render with default label from CONFIG', () => {
      const handleClick = vi.fn();
      renderWithTheme(<ProfileEditButton onClick={handleClick} />);
      expect(screen.getByText('Editar Perfil')).toBeInTheDocument();
    });

    it('should render with custom label', () => {
      const handleClick = vi.fn();
      renderWithTheme(
        <ProfileEditButton onClick={handleClick} label="Edit Profile" />
      );
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      renderWithTheme(<ProfileEditButton onClick={handleClick} />);
      fireEvent.click(screen.getByText('Editar Perfil'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should render edit emoji', () => {
      const handleClick = vi.fn();
      renderWithTheme(<ProfileEditButton onClick={handleClick} />);
      expect(screen.getByText('✏️')).toBeInTheDocument();
    });
  });

  describe('LogoutButton', () => {
    it('should render with default label from CONFIG', () => {
      const handleClick = vi.fn();
      renderWithTheme(<LogoutButton onClick={handleClick} />);
      expect(screen.getByText('Sair')).toBeInTheDocument();
    });

    it('should render with custom label', () => {
      const handleClick = vi.fn();
      renderWithTheme(
        <LogoutButton onClick={handleClick} label="Logout" />
      );
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      renderWithTheme(<LogoutButton onClick={handleClick} />);
      fireEvent.click(screen.getByText('Sair'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('UserInfo', () => {
    it('should render children as trigger', () => {
      renderWithTheme(
        <UserInfo>
          <div>User Info Trigger</div>
        </UserInfo>
      );
      expect(screen.getByText('User Info Trigger')).toBeInTheDocument();
    });

    it('should render dropdown with header when email is provided', () => {
      renderWithTheme(
        <UserInfo email="test@example.com">
          <div>Trigger</div>
        </UserInfo>
      );
      expect(screen.getByTestId('dropdown-header')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('should render dropdown with header when iconSvg is provided', () => {
      const svgIcon = '<svg><circle r="10"/></svg>';
      renderWithTheme(
        <UserInfo iconSvg={svgIcon}>
          <div>Trigger</div>
        </UserInfo>
      );
      expect(screen.getByTestId('dropdown-header')).toBeInTheDocument();
    });

    it('should render dropdown content with ProfileEditButton when onEditProfile is provided', () => {
      const handleEdit = vi.fn();
      renderWithTheme(
        <UserInfo onEditProfile={handleEdit}>
          <div>Trigger</div>
        </UserInfo>
      );
      expect(screen.getByTestId('dropdown-content')).toBeInTheDocument();
      expect(screen.getByText('Editar Perfil')).toBeInTheDocument();
    });

    it('should render dropdown content with LogoutButton when onLogout is provided', () => {
      const handleLogout = vi.fn();
      renderWithTheme(
        <UserInfo onLogout={handleLogout}>
          <div>Trigger</div>
        </UserInfo>
      );
      expect(screen.getByTestId('dropdown-content')).toBeInTheDocument();
      expect(screen.getByText('Sair')).toBeInTheDocument();
    });

    it('should render both buttons when both handlers are provided', () => {
      const handleEdit = vi.fn();
      const handleLogout = vi.fn();
      renderWithTheme(
        <UserInfo onEditProfile={handleEdit} onLogout={handleLogout}>
          <div>Trigger</div>
        </UserInfo>
      );
      expect(screen.getByText('Editar Perfil')).toBeInTheDocument();
      expect(screen.getByText('Sair')).toBeInTheDocument();
    });

    it('should not render dropdown content when no handlers are provided', () => {
      renderWithTheme(
        <UserInfo>
          <div>Trigger</div>
        </UserInfo>
      );
      expect(screen.queryByTestId('dropdown-content')).not.toBeInTheDocument();
    });

    it('should not render dropdown header when no email or iconSvg is provided', () => {
      renderWithTheme(
        <UserInfo>
          <div>Trigger</div>
        </UserInfo>
      );
      expect(screen.queryByTestId('dropdown-header')).not.toBeInTheDocument();
    });
  });

  describe('LastUpdated', () => {
    it('should render timestamp when provided', () => {
      const timestamp = new Date('2024-01-01T12:00:00');
      renderWithTheme(<LastUpdated timestamp={timestamp} />);
      expect(screen.getByText(/Última atualização:/)).toBeInTheDocument();
    });

    it('should not render when timestamp is not provided', () => {
      const { container } = renderWithTheme(<LastUpdated />);
      expect(container.querySelector('.header__last-updated')).not.toBeInTheDocument();
    });

    it('should not render when timestamp is null', () => {
      const { container } = renderWithTheme(<LastUpdated timestamp={null} />);
      expect(container.querySelector('.header__last-updated')).not.toBeInTheDocument();
    });

    it('should format timestamp in pt-BR locale', () => {
      const timestamp = new Date('2024-01-01T12:00:00');
      renderWithTheme(<LastUpdated timestamp={timestamp} />);
      const text = screen.getByText(/Última atualização:/).textContent;
      expect(text).toContain('Última atualização:');
    });
  });
});

