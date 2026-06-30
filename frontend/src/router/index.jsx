import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "../components/RootLayout";
import { AuthLayout } from "../components/AuthLayout";
import { LoginScreen } from "../components/LoginScreen";
import { SignUpScreen } from "../components/SignUpScreen";
import { Dashboard } from "../components/Dashboard";
import { Contatos } from "../components/Contatos";
import { RootRedirect } from "./RootRedirect";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRoute } from "./RoleRoute";
import { PublicRoute } from "./PublicRoute";
import { canAccessDashboard } from "../config/roleAccess";
import { ROUTES } from "../config/routes";
import { AdminProvider } from "../contexts/AdminContext";
import { isWhatsAppIntegrationEnabled } from "../config/featureFlags";
import { getDashboardRoute } from "../config/routes";
import { DEFAULT_TAB_ID } from "../config/dashboardTabs";
import {
  DashboardRoutes,
  PedidosRoute,
  AgendamentosRoute,
  AtendimentosRoute,
  WhatsAppRoute,
  DashboardDefaultRoute,
} from "../components/DashboardRoutes";

const whatsAppDashboardRoute = isWhatsAppIntegrationEnabled()
  ? { path: "whatsapp", element: <WhatsAppRoute /> }
  : {
      path: "whatsapp",
      element: (
        <Navigate to={getDashboardRoute(DEFAULT_TAB_ID)} replace />
      ),
    };

/**
 * Router Configuration - Centralized router setup using createBrowserRouter
 * 
 * This module exports the router configuration following React Router v6.4+ best practices
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <RootRedirect />,
      },
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: (
              <PublicRoute>
                <LoginScreen />
              </PublicRoute>
            ),
          },
          {
            path: "signup",
            element: (
              <PublicRoute>
                <SignUpScreen />
              </PublicRoute>
            ),
          },
        ],
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <RoleRoute
              allowedWhen={canAccessDashboard}
              redirectTo={() => ROUTES.CONTATOS.BASE}
            >
              <AdminProvider>
                <Dashboard />
              </AdminProvider>
            </RoleRoute>
          </ProtectedRoute>
        ),
        children: [
          {
            element: <DashboardRoutes />,
            children: [
              {
                path: "pedidos",
                element: <PedidosRoute />,
              },
              {
                path: "agendamentos",
                element: <AgendamentosRoute />,
              },
              {
                path: "atendimentos",
                element: <AtendimentosRoute />,
              },
              whatsAppDashboardRoute,
              {
                path: "",
                element: <DashboardDefaultRoute />,
              },
              {
                path: "*",
                element: <DashboardDefaultRoute />,
              },
            ],
          },
        ],
      },
      {
        path: "contatos",
        element: (
          <ProtectedRoute>
            <AdminProvider>
              <Contatos />
            </AdminProvider>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
