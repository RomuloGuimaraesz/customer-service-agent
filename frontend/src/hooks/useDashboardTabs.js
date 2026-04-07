import { useAdmin } from '../contexts/AdminContext';
import { DASHBOARD_TABS } from '../config/dashboardTabs';

/**
 * Tab list and navigation for dashboard data routes (same data as former Dashboard tabs block).
 */
export function useDashboardTabs() {
  const adminContext = useAdmin();
  const currentTab = adminContext.activeTab;

  const handleTabClick = tabId => {
    adminContext.navigateTab(tabId);
  };

  const tabs = DASHBOARD_TABS.map(tab => {
    if (tab.id === 'agendamentos') {
      return { ...tab, count: adminContext.agendamentos.length };
    }
    if (tab.id === 'atendimentos') {
      return { ...tab, count: adminContext.atendimentos.length };
    }
    if (tab.id === 'pedidos') {
      return { ...tab, count: adminContext.pedidos.length };
    }
    return { ...tab, count: null };
  });

  return { tabs, currentTab, handleTabClick };
}
