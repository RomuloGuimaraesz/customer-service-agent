import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { PROFILE_ICON } from '../config/icons';
import { DASHBOARD_TABS, VALID_TAB_IDS, DEFAULT_TAB_ID } from '../config/dashboardTabs';
import { getDashboardRoute, ROUTES } from '../config/routes';
import { DASHBOARD_LABELS, DASHBOARD_MESSAGES, DASHBOARD_TOOLTIPS } from '../config/dashboardConfig';
import { CONFIG } from '../config/constants';
import { supabase } from '../infrastructure/supabase/config';
import { StatsGrid } from './StatsGrid';
import { AnalyticsView } from './AnalyticsView';
import { Toast } from './Toast';
import { Tabs } from './Tabs';
import { Modal } from './Modal';
import { 
  Header, 
  LastUpdated, 
  HeaderButton, 
  UserInfo, 
  ProfileIcon, 
  Logo,
  UserEmail
} from './Header';
import { ProfileEditModal } from './ProfileEditModal';
import styled from 'styled-components';

/**
 * Dashboard Container - BEM: dashboard
 */
const StyledDashboard = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  font-family: ${props => props.theme.fontFamily.primary};
`;

/**
 * Main Content - BEM: dashboard__main
 */
const StyledMainContent = styled.main`
  padding: ${props => props.theme.spacing.xl};
  max-width: 100%;
  margin: 0 auto;
  overflow-x: hidden;
  width: 100%;
`;

/**
 * Dashboard Title - BEM: dashboard__title
 */
const StyledDashboardTitle = styled.h1`
  font-size: ${props => props.theme.fontSize['5xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing['2xl']} 0;
`;

/**
 * Dashboard Component
 */
export const Dashboard = () => {
  const { credentials, isAuthenticated } = useAuth();
  const adminContext = useAdmin();

  const [toastVisible, setToastVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  // Use activeTab from AdminContext instead of deriving from URL
  const currentTab = adminContext.activeTab;

  // Handle tab navigation
  const handleTabClick = (tabId) => {
    adminContext.navigateTab(tabId);
  };

  // Prepare tabs data with dynamic counts
  const tabs = DASHBOARD_TABS.map(tab => {
    if (tab.id === 'agendamentos') {
      return { ...tab, count: adminContext.agendamentos.length };
    }
    if (tab.id === 'pedidos') {
      return { ...tab, count: adminContext.pedidos.length };
    }
    return { ...tab, count: null };
  });

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

  // Refresh all data
  const refreshAll = () => {
    if (isAuthenticated) {
      adminContext.refreshAll();
    }
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
    if (adminContext.error.pedidos || adminContext.error.agendamentos) {
      setToastVisible(true);
    }
  }, [adminContext.error.pedidos, adminContext.error.agendamentos]);

  const handleCloseToast = () => {
    setToastVisible(false);
  };

  // Calculate stats using custom hook
  const { stats } = useDashboardStats(adminContext.pedidos, adminContext.agendamentos);

  return (
    <StyledDashboard className="dashboard">
      {/* Header */}
      <Header
        left={<Logo />}
        right={
          <>
            <LastUpdated timestamp={adminContext.lastUpdated.pedidos} />
            <HeaderButton
              onClick={() => setShowAnalytics(true)}
              title={DASHBOARD_TOOLTIPS.STATISTICS}
            >
              {/*<span>📊</span>*/}
              <span>{DASHBOARD_LABELS.HEADER_BUTTONS.STATISTICS}</span>
            </HeaderButton>
            <HeaderButton
              onClick={refreshAll}
              disabled={adminContext.loading.pedidos || adminContext.loading.agendamentos}
            >
              {DASHBOARD_LABELS.HEADER_BUTTONS.REFRESH}
            </HeaderButton>
            <UserInfo 
              onEditProfile={() => setShowProfileEdit(true)}
              onLogout={handleLogout}
              email={credentials.username}
              iconSvg={PROFILE_ICON}
            >
              <ProfileIcon iconSvg={PROFILE_ICON} />
              <UserEmail email={credentials.username} />
            </UserInfo>
          </>
        }
        isAuthenticated={isAuthenticated}
      />

      {/* Main Content */}
      <StyledMainContent className="dashboard__main">
        {/* Profile Edit Modal */}
        <ProfileEditModal
          isOpen={showProfileEdit}
          onClose={() => setShowProfileEdit(false)}
          onSave={(profileData) => {
            // Handle profile save if needed
            console.log('Profile saved:', profileData);
          }}
        />

        {/* Analytics Modal/View */}
        <Modal
          isOpen={showAnalytics}
          onClose={() => setShowAnalytics(false)}
        >
          <AnalyticsView onClose={() => setShowAnalytics(false)} />
        </Modal>

        {/* Title */}
        <StyledDashboardTitle className="dashboard__title">
          {DASHBOARD_LABELS.PAGE_TITLE}
        </StyledDashboardTitle>

        {/* Stats Grid */}
        <StatsGrid stats={stats} />

        {/* Tabs */}
        <Tabs
          tabs={tabs}
          activeTab={currentTab}
          onTabClick={handleTabClick}
        />

        {/* Toast Notification */}
        <Toast
          message={`${DASHBOARD_MESSAGES.TOAST.DEMO_MODE} ${adminContext.error.pedidos || adminContext.error.agendamentos}`}
          visible={(adminContext.error.pedidos || adminContext.error.agendamentos) && toastVisible}
          onClose={handleCloseToast}
          isMobile={isMobile}
        />

        {/* Data Display - Route-based */}
        <Outlet />
      </StyledMainContent>
    </StyledDashboard>
  );
};
