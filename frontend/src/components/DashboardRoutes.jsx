import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { usePedidos } from '../contexts/PedidosContext';
import { useAgendamentos } from '../contexts/AgendamentosContext';
import { DataDisplay } from './DataDisplay';
import { WhatsAppView } from './whatsapp/WhatsAppView';
import { DEFAULT_TAB_ID } from '../config/dashboardTabs';

/**
 * Dashboard Routes Component - Renders child routes with context data
 * This component acts as a bridge between router configuration and context data
 */
export const DashboardRoutes = () => {
  return <Outlet />;
};

/**
 * Pedidos Route Component - Accesses context and renders DataDisplay
 */
export const PedidosRoute = () => {
  const { pedidos } = usePedidos();
  return <DataDisplay data={pedidos} type="pedidos" />;
};

/**
 * Agendamentos Route Component - Accesses context and renders DataDisplay
 */
export const AgendamentosRoute = () => {
  const { agendamentos } = useAgendamentos();
  return <DataDisplay data={agendamentos} type="agendamentos" />;
};

/**
 * WhatsApp Route Component
 */
export const WhatsAppRoute = () => {
  return <WhatsAppView />;
};

/**
 * Dashboard Default Route - Redirects to default tab
 */
export const DashboardDefaultRoute = () => {
  return <Navigate to={DEFAULT_TAB_ID} replace />;
};

