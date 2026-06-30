import { describe, it, expect } from 'vitest';
import {
  canAccessDashboard,
  canAccessContatos,
  canAccessStatistics,
  canDeleteContato,
  getHomeRouteForRole,
  getPostAuthRouteForRole,
} from './roleAccess';
import { ROUTES } from './routes';

describe('roleAccess', () => {
  describe('canAccessDashboard', () => {
    it('allows architect and admin', () => {
      expect(canAccessDashboard('architect')).toBe(true);
      expect(canAccessDashboard('admin')).toBe(true);
    });

    it('denies user role', () => {
      expect(canAccessDashboard('user')).toBe(false);
    });

    it('allows unknown/null roles (legacy users)', () => {
      expect(canAccessDashboard(null)).toBe(true);
      expect(canAccessDashboard(undefined)).toBe(true);
    });
  });

  describe('canAccessContatos', () => {
    it('allows all authenticated roles', () => {
      expect(canAccessContatos('architect')).toBe(true);
      expect(canAccessContatos('admin')).toBe(true);
      expect(canAccessContatos('user')).toBe(true);
      expect(canAccessContatos(null)).toBe(true);
    });
  });

  describe('canAccessStatistics', () => {
    it('allows only architect', () => {
      expect(canAccessStatistics('architect')).toBe(true);
      expect(canAccessStatistics('admin')).toBe(false);
      expect(canAccessStatistics('user')).toBe(false);
      expect(canAccessStatistics(null)).toBe(false);
    });
  });

  describe('canDeleteContato', () => {
    it('denies user role', () => {
      expect(canDeleteContato('user')).toBe(false);
    });

    it('allows admin, architect, and legacy roles', () => {
      expect(canDeleteContato('admin')).toBe(true);
      expect(canDeleteContato('architect')).toBe(true);
      expect(canDeleteContato(null)).toBe(true);
    });
  });

  describe('getHomeRouteForRole', () => {
    it('sends user to contatos', () => {
      expect(getHomeRouteForRole('user')).toBe(ROUTES.CONTATOS.BASE);
    });

    it('preserves agendamentos landing for admin/architect/legacy', () => {
      expect(getHomeRouteForRole('admin')).toBe('/dashboard/agendamentos');
      expect(getHomeRouteForRole('architect')).toBe('/dashboard/agendamentos');
      expect(getHomeRouteForRole(null)).toBe('/dashboard/agendamentos');
    });
  });

  describe('getPostAuthRouteForRole', () => {
    it('sends user to contatos after auth', () => {
      expect(getPostAuthRouteForRole('user')).toBe(ROUTES.CONTATOS.BASE);
    });

    it('preserves pedidos landing for admin/architect/legacy', () => {
      expect(getPostAuthRouteForRole('admin')).toBe('/dashboard/pedidos');
      expect(getPostAuthRouteForRole('architect')).toBe('/dashboard/pedidos');
      expect(getPostAuthRouteForRole(null)).toBe('/dashboard/pedidos');
    });
  });
});
