/**
 * Smoke test: Analytics tracking with session restore
 *
 * Verifies that when a user's session is restored from sessionStorage,
 * userId and role are available before the dashboard mounts, so
 * useTabAnalytics receives valid values and tracking works.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { AdminProvider, useAdmin } from '../contexts/AdminContext'
import { CONFIG } from '../config/constants'
import { RepositoryFactory } from '../infrastructure/repositoryFactory.js'
import {
  TestPedidoRepository,
  TestAgendamentoRepository,
  TestWhatsAppConversationRepository,
} from '../infrastructure/test/TestRepository.js'
import { ROUTES } from '../config/routes'
import * as analyticsService from '../services/analytics'

// Mock analytics to spy on calls
vi.mock('../services/analytics', () => ({
  trackTabClick: vi.fn().mockResolvedValue(null),
  startTabSession: vi.fn().mockResolvedValue('mock-event-id'),
  endTabSession: vi.fn().mockResolvedValue(null),
  trackSurfaceView: vi.fn().mockResolvedValue(null),
  startSurfaceSession: vi.fn().mockResolvedValue('mock-surface-event-id'),
  endSurfaceSession: vi.fn().mockResolvedValue(null),
}))

// Mock Supabase - must include getUser for session restore
vi.mock('../infrastructure/supabase/config', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
    },
  },
}))

import { supabase } from '../infrastructure/supabase/config'

describe('Analytics smoke test - session restore flow', () => {
  afterEach(() => {
    RepositoryFactory.clearTestOverrides()
  })

  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()

    RepositoryFactory.setTestOverrides({
      pedidoRepository: new TestPedidoRepository(),
      agendamentoRepository: new TestAgendamentoRepository(),
      whatsAppConversationRepository: new TestWhatsAppConversationRepository(),
    })

    supabase.auth.getUser.mockReset()
    supabase.auth.signInWithPassword.mockReset()
  })

  it('should have userId and role available when session is restored, and analytics should track', async () => {
    const expectedUserId = 'user-analytics-456'
    const expectedRole = 'admin'

    sessionStorage.setItem(
      CONFIG.AUTH_STORAGE_KEY,
      JSON.stringify({ username: 'test@example.com', password: 'testpass' })
    )

    supabase.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: expectedUserId,
          user_metadata: { role: expectedRole },
        },
      },
    })

    const { result } = renderHook(
      () => ({ auth: useAuth(), admin: useAdmin() }),
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={[ROUTES.DASHBOARD.PEDIDOS]}>
            <AuthProvider>
              <AdminProvider>{children}</AdminProvider>
            </AuthProvider>
          </MemoryRouter>
        ),
      }
    )

    // 1. Verify AuthContext waits for getUser: userId and role are set before loading completes
    await waitFor(
      () => {
        expect(result.current.auth.isLoading).toBe(false)
        expect(result.current.auth.userId).toBe(expectedUserId)
        expect(result.current.auth.role).toBe(expectedRole)
      },
      { timeout: 3000 }
    )

    // 2. Verify analytics was called with correct userId (useTabAnalytics in AdminContext)
    await waitFor(
      () => {
        expect(analyticsService.trackTabClick).toHaveBeenCalledWith(
          'pedidos',
          'Pedidos',
          expectedUserId,
          expectedRole,
          'dashboard'
        )
        expect(analyticsService.startTabSession).toHaveBeenCalledWith(
          'pedidos',
          'Pedidos',
          expectedUserId,
          expectedRole,
          'dashboard'
        )
        expect(analyticsService.trackSurfaceView).toHaveBeenCalledWith(
          'dashboard',
          expectedUserId,
          expectedRole
        )
        expect(analyticsService.startSurfaceSession).toHaveBeenCalledWith(
          'dashboard',
          expectedUserId,
          expectedRole
        )
      },
      { timeout: 2000 }
    )
  })
})
