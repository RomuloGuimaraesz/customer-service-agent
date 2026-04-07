/**
 * Analytics Service Tests
 * Verifies INSERT, UPDATE, SELECT, DELETE operations (RLS policies)
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  trackTabClick,
  startTabSession,
  endTabSession,
  trackSurfaceView,
  startSurfaceSession,
  endSurfaceSession,
  getUsageStatistics,
  clearAnalyticsData,
  exportAnalyticsData,
} from './analytics'

vi.mock('../infrastructure/supabase/config', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

import { supabase } from '../infrastructure/supabase/config'

describe('analytics service', () => {
  let mockChain

  beforeEach(() => {
    vi.clearAllMocks()
    mockChain = {
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn(),
      order: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
    }
    supabase.from.mockReturnValue(mockChain)
  })

  describe('trackTabClick (INSERT)', () => {
    it('should insert tab_click event and return data', async () => {
      const mockData = { id: 'evt-1', user_id: 'u1', event_type: 'tab_click' }
      mockChain.single.mockResolvedValue({ data: mockData, error: null })

      const result = await trackTabClick('pedidos', 'Pedidos', 'u1', 'admin')

      expect(supabase.from).toHaveBeenCalledWith('analytics_events')
      expect(mockChain.insert).toHaveBeenCalledWith({
        user_id: 'u1',
        event_type: 'tab_click',
        tab_id: 'pedidos',
        tab_name: 'Pedidos',
        surface: 'dashboard',
      })
      expect(result).toEqual(mockData)
    })

    it('should not insert when role is architect', async () => {
      const result = await trackTabClick('pedidos', 'Pedidos', 'u1', 'architect')
      expect(mockChain.insert).not.toHaveBeenCalled()
      expect(result).toBeNull()
    })

    it('should not insert when userId is null', async () => {
      const result = await trackTabClick('pedidos', 'Pedidos', null, 'admin')
      expect(mockChain.insert).not.toHaveBeenCalled()
      expect(result).toBeNull()
    })

    it('should set surface when provided (Contatos tabs)', async () => {
      const mockData = { id: 'evt-c1', event_type: 'tab_click' }
      mockChain.single.mockResolvedValue({ data: mockData, error: null })

      await trackTabClick(
        'contatos-dados-contato',
        'Dados do Contato',
        'u1',
        'admin',
        'contatos',
      )

      expect(mockChain.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          tab_id: 'contatos-dados-contato',
          tab_name: 'Dados do Contato',
          surface: 'contatos',
        }),
      )
    })
  })

  describe('startTabSession (INSERT)', () => {
    it('should insert tab_session event and return event id', async () => {
      const mockData = { id: 'evt-session-1' }
      mockChain.single.mockResolvedValue({ data: mockData, error: null })

      const result = await startTabSession('agendamentos', 'Agendamentos', 'u1', 'admin')

      expect(mockChain.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'u1',
          event_type: 'tab_session',
          tab_id: 'agendamentos',
          tab_name: 'Agendamentos',
          session_id: expect.stringMatching(/^agendamentos_\d+$/),
          surface: 'dashboard',
          duration: null,
        })
      )
      expect(result).toBe('evt-session-1')
    })

    it('should set surface for tab_session when provided', async () => {
      const mockData = { id: 'evt-s2' }
      mockChain.single.mockResolvedValue({ data: mockData, error: null })

      await startTabSession(
        'contatos-whatsapp',
        'WhatsApp',
        'u1',
        'admin',
        'contatos',
      )

      expect(mockChain.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          event_type: 'tab_session',
          tab_id: 'contatos-whatsapp',
          surface: 'contatos',
        }),
      )
    })
  })

  describe('endTabSession (UPDATE)', () => {
    it('should update duration on session event', async () => {
      const mockData = { id: 'evt-1', duration: 45 }
      mockChain.single.mockResolvedValue({ data: mockData, error: null })

      const startTime = new Date(Date.now() - 45000)
      const result = await endTabSession('evt-1', startTime)

      expect(mockChain.update).toHaveBeenCalledWith(expect.objectContaining({ duration: expect.any(Number) }))
      expect(mockChain.eq).toHaveBeenCalledWith('id', 'evt-1')
      expect(result).toEqual(mockData)
    })

    it('should return null when eventId is null', async () => {
      const result = await endTabSession(null, new Date())
      expect(mockChain.update).not.toHaveBeenCalled()
      expect(result).toBeNull()
    })
  })

  describe('trackSurfaceView (INSERT)', () => {
    it('should insert surface_view event and return data', async () => {
      const mockData = { id: 'evt-sv-1', user_id: 'u1', event_type: 'surface_view', surface: 'contatos' }
      mockChain.single.mockResolvedValue({ data: mockData, error: null })

      const result = await trackSurfaceView('contatos', 'u1', 'admin')

      expect(mockChain.insert).toHaveBeenCalledWith({
        user_id: 'u1',
        event_type: 'surface_view',
        surface: 'contatos',
      })
      expect(result).toEqual(mockData)
    })

    it('should not insert when surface is missing', async () => {
      const result = await trackSurfaceView(null, 'u1', 'admin')
      expect(mockChain.insert).not.toHaveBeenCalled()
      expect(result).toBeNull()
    })
  })

  describe('startSurfaceSession (INSERT)', () => {
    it('should insert surface_session event and return event id', async () => {
      const mockData = { id: 'evt-ss-1' }
      mockChain.single.mockResolvedValue({ data: mockData, error: null })

      const result = await startSurfaceSession('dashboard', 'u1', 'admin')

      expect(mockChain.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'u1',
          event_type: 'surface_session',
          surface: 'dashboard',
          session_id: expect.stringMatching(/^dashboard_\d+$/),
          duration: null,
        })
      )
      expect(result).toBe('evt-ss-1')
    })
  })

  describe('endSurfaceSession (UPDATE)', () => {
    it('should update duration same as endTabSession', async () => {
      const mockData = { id: 'evt-1', duration: 12 }
      mockChain.single.mockResolvedValue({ data: mockData, error: null })

      const startTime = new Date(Date.now() - 12000)
      const result = await endSurfaceSession('evt-1', startTime)

      expect(mockChain.update).toHaveBeenCalledWith(expect.objectContaining({ duration: expect.any(Number) }))
      expect(mockChain.eq).toHaveBeenCalledWith('id', 'evt-1')
      expect(result).toEqual(mockData)
    })
  })

  describe('getUsageStatistics (SELECT)', () => {
    it('should return stats structure from events', async () => {
      const mockEvents = [
        { user_id: 'u1', event_type: 'tab_click', tab_id: 'pedidos', timestamp: '2024-01-01T10:00:00Z' },
        { user_id: 'u1', event_type: 'tab_session', tab_id: 'pedidos', duration: 30, timestamp: '2024-01-01T10:00:00Z' },
      ]
      const resultPromise = Promise.resolve({ data: mockEvents, error: null })
      const chain = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnValue(resultPromise),
      }
      chain.order.mockReturnValue(chain)
      supabase.from.mockReturnValue(chain)

      const result = await getUsageStatistics(7)

      expect(result.users).toBeDefined()
      expect(result.surfaces).toBeDefined()
      expect(result.totalClicks).toBeGreaterThanOrEqual(0)
      expect(result.totalTime).toBeGreaterThanOrEqual(0)
      expect(result.totalSurfaceViews).toBeGreaterThanOrEqual(0)
      expect(result.totalSurfaceTime).toBeGreaterThanOrEqual(0)
    })

    it('should aggregate surface_view and surface_session', async () => {
      const mockEvents = [
        { user_id: 'u1', event_type: 'surface_view', surface: 'dashboard', timestamp: '2024-01-01T10:00:00Z' },
        { user_id: 'u1', event_type: 'surface_session', surface: 'dashboard', duration: 60, timestamp: '2024-01-01T10:01:00Z' },
        { user_id: 'u1', event_type: 'surface_view', surface: 'contatos', timestamp: '2024-01-01T10:02:00Z' },
        { user_id: 'u1', event_type: 'surface_session', surface: 'contatos', duration: 30, timestamp: '2024-01-01T10:03:00Z' },
      ]
      const resultPromise = Promise.resolve({ data: mockEvents, error: null })
      const chain = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnValue(resultPromise),
      }
      chain.order.mockReturnValue(chain)
      supabase.from.mockReturnValue(chain)

      const result = await getUsageStatistics(7)

      expect(result.totalSurfaceViews).toBe(2)
      expect(result.totalSurfaceTime).toBe(90)
      expect(result.surfaces.dashboard.views).toBe(1)
      expect(result.surfaces.dashboard.totalTime).toBe(60)
      expect(result.surfaces.contatos.views).toBe(1)
      expect(result.surfaces.contatos.totalTime).toBe(30)
      expect(result.users.u1.totalSurfaceViews).toBe(2)
      expect(result.users.u1.totalSurfaceTime).toBe(90)
    })
  })

  describe('clearAnalyticsData (DELETE)', () => {
    it('should delete all events and return true', async () => {
      mockChain.neq.mockResolvedValue({ error: null })

      const result = await clearAnalyticsData()

      expect(mockChain.delete).toHaveBeenCalled()
      expect(mockChain.neq).toHaveBeenCalledWith('id', '00000000-0000-0000-0000-000000000000')
      expect(result).toBe(true)
    })

    it('should return false on error', async () => {
      mockChain.neq.mockResolvedValue({ error: { message: 'RLS policy violation' } })

      const result = await clearAnalyticsData()

      expect(result).toBe(false)
    })
  })

  describe('exportAnalyticsData (SELECT)', () => {
    it('should return rawData, statistics and exportedAt', async () => {
      const mockEvents = [{ id: 'e1', user_id: 'u1', event_type: 'tab_click' }]
      const resultPromise = Promise.resolve({ data: mockEvents, error: null })
      const chain = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnValue(resultPromise),
      }
      chain.order.mockReturnValue(chain)
      supabase.from.mockReturnValue(chain)

      const result = await exportAnalyticsData(30)

      expect(result).toHaveProperty('rawData')
      expect(result).toHaveProperty('statistics')
      expect(result).toHaveProperty('exportedAt')
      expect(result.rawData.events).toEqual(mockEvents)
    })
  })
})
