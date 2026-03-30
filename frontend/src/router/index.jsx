import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../components/RootLayout";
import { AuthLayout } from "../components/AuthLayout";
import { LoginScreen } from "../components/LoginScreen";
import { SignUpScreen } from "../components/SignUpScreen";
import { Dashboard } from "../components/Dashboard";
import { Contatos } from "../components/Contatos";
import { RootRedirect } from "./RootRedirect";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { AdminProvider } from "../contexts/AdminContext";
import {
  DashboardRoutes,
  PedidosRoute,
  AgendamentosRoute,
  AtendimentosRoute,
  WhatsAppRoute,
  DashboardDefaultRoute,
} from "../components/DashboardRoutes";

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
            <AdminProvider>
              <Dashboard />
            </AdminProvider>
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
              {
                path: "whatsapp",
                element: <WhatsAppRoute />,
              },
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
            <Contatos />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
