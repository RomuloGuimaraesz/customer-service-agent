import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { PROFILE_ICON } from '../config/icons';
import { ROUTES } from '../config/routes';
import { DASHBOARD_MESSAGES } from '../config/dashboardConfig';
import { CONFIG } from '../config/constants';
import { supabase } from '../infrastructure/supabase/config';
import { StatsGrid, SurfaceSectionHeading } from './StatsGrid';
import { Toast } from './Toast';
import { 
  Header, 
  Logo,
} from './Header';
import { MainNavigation } from './MainNavigation';
import { AuthenticatedHeaderRight } from './AuthenticatedHeaderRight';
import { ProfileEditModal } from './ProfileEditModal';
import styled from 'styled-components';

/**
 * Dashboard Container - BEM: dashboard
 */
const StyledDashboard = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  font-family: ${props => props.theme.fontFamily.primary};
`;

/**
 * Main Content - BEM: dashboard__main
 */
const StyledMainContent = styled.main`
  padding: 0;
  max-width: 100%;
  margin: 0 auto;
  overflow-x: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

/**
 * Dashboard Component
 */
export const Dashboard = () => {
  const { credentials, isAuthenticated, role } = useAuth();
  const adminContext = useAdmin();

  const [toastVisible, setToastVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  // Handle logout with navigation
  const handleLogout = async () => {
    // Clear session storage immediately to prevent any state from persisting
    sessionStorage.removeItem(CONFIG.AUTH_STORAGE_KEY);

    // Sign out from Supabase (fire and forget - don't wait)
    supabase.auth.signOut().catch(() => {
      // Ignore errors during logout
    });

    // Use hard navigation to immediately redirect, bypassing React's render cycle
    // This prevents any intermediate renders showing empty dashboard state
    window.location.replace(ROUTES.AUTH.LOGIN);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show toast when error appears
  useEffect(() => {
    if (adminContext.error.pedidos || adminContext.error.agendamentos || adminContext.error.atendimentos) {
      setToastVisible(true);
    }
  }, [adminContext.error.pedidos, adminContext.error.agendamentos, adminContext.error.atendimentos]);

  const handleCloseToast = () => {
    setToastVisible(false);
  };

  // Calculate stats using custom hook
  const { stats } = useDashboardStats(adminContext.pedidos, adminContext.agendamentos, adminContext.atendimentos);

  return (
    <StyledDashboard className="dashboard">
      {/* Header */}
      <Header
        left={<Logo />}
        center={<MainNavigation />}
        right={
          <AuthenticatedHeaderRight
            role={role}
            onEditProfile={() => setShowProfileEdit(true)}
            onLogout={handleLogout}
            email={credentials.username}
            iconSvg={PROFILE_ICON}
          />
        }
        isAuthenticated={isAuthenticated}
      />

      <StatsGrid stats={stats} sectionTitle="Informações Gerais" />

      {/* Main Content */}
      <StyledMainContent className="dashboard__main">
        <SurfaceSectionHeading className="dashboard__main-heading">
          Dashboard
        </SurfaceSectionHeading>

        {/* Profile Edit Modal */}
        <ProfileEditModal
          isOpen={showProfileEdit}
          onClose={() => setShowProfileEdit(false)}
          onSave={(profileData) => {
            // Handle profile save if needed
            console.log('Profile saved:', profileData);
          }}
        />

        {/* Toast Notification */}
        <Toast
          message={`${DASHBOARD_MESSAGES.TOAST.DEMO_MODE} ${adminContext.error.pedidos || adminContext.error.agendamentos || adminContext.error.atendimentos}`}
          visible={(adminContext.error.pedidos || adminContext.error.agendamentos || adminContext.error.atendimentos) && toastVisible}
          onClose={handleCloseToast}
          isMobile={isMobile}
        />

        {/* Data Display - Route-based */}
        <Outlet />
      </StyledMainContent>
    </StyledDashboard>
  );
};
