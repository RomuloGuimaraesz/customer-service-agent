import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { CONFIG } from '../config/constants';
import { ROUTES } from '../config/routes';
import { supabase } from '../infrastructure/supabase/config';
import { Header, Logo, ProfileIcon, UserEmail, UserInfo } from './Header';
import { MainNavigation } from './MainNavigation';
import { PROFILE_ICON } from '../config/icons';

const StyledContatos = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  font-family: ${props => props.theme.fontFamily.primary};
`;

const StyledContent = styled.main`
  padding: ${props => props.theme.spacing.xl};
`;

export const Contatos = () => {
  const { credentials, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    sessionStorage.removeItem(CONFIG.AUTH_STORAGE_KEY);
    supabase.auth.signOut().catch(() => {});
    window.location.replace(ROUTES.AUTH.LOGIN);
  };

  return (
    <StyledContatos className="contatos">
      <Header
        left={<Logo />}
        center={<MainNavigation />}
        right={
          <UserInfo
            onLogout={handleLogout}
            email={credentials?.username}
            iconSvg={PROFILE_ICON}
          >
            <ProfileIcon iconSvg={PROFILE_ICON} />
            <UserEmail email={credentials?.username} />
          </UserInfo>
        }
        isAuthenticated={isAuthenticated}
      />

      <StyledContent className="contatos__content">
        Contatos
      </StyledContent>
    </StyledContatos>
  );
};

