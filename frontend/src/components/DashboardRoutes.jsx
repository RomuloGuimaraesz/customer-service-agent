import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { DataDisplay } from './DataDisplay';
import { WhatsAppView } from './whatsapp/WhatsAppView';

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
  const { pedidos } = useAdmin();
  return <DataDisplay data={pedidos} type="pedidos" />;
};

/**
 * Agendamentos Route Component - Accesses context and renders DataDisplay
 */
export const AgendamentosRoute = () => {
  const { agendamentos } = useAdmin();
  return <DataDisplay data={agendamentos} type="agendamentos" />;
};

/**
 * WhatsApp Route Component
 */
export const WhatsAppRoute = () => {
  return <WhatsAppView />;
};

/**
 * Dashboard Default Route - Redirects to pedidos
 */
export const DashboardDefaultRoute = () => {
  const { pedidos } = useAdmin();
  return <DataDisplay data={pedidos} type="pedidos" />;
};

