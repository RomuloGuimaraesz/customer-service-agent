import { ROUTES } from './routes';

export const canAccessDashboard = (role) => role !== 'user';

export const canAccessContatos = () => true;

export const canAccessStatistics = (role) => role === 'architect';

export const canDeleteContato = (role) => role !== 'user';

/** Categoria em Contatos / Mais informações — só Admin e Architect. */
export const canEditContatoCategoria = (role) =>
  role === 'admin' || role === 'architect';

export const getHomeRouteForRole = (role) =>
  role === 'user' ? ROUTES.CONTATOS.BASE : '/dashboard/agendamentos';

export const getPostAuthRouteForRole = (role) =>
  role === 'user' ? ROUTES.CONTATOS.BASE : '/dashboard/pedidos';
