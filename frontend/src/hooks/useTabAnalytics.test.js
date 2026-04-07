import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTabAnalytics } from './useTabAnalytics'
import * as analyticsService from '../services/analytics'

// Mock the analytics service (async functions)
vi.mock('../services/analytics', () => ({
  trackTabClick: vi.fn().mockResolvedValue(null),
  startTabSession: vi.fn().mockResolvedValue(null),
  endTabSession: vi.fn().mockResolvedValue(null),
}))

describe('useTabAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const userId = 'user-123'
  const role = 'admin'

  describe('initialization', () => {
    it('should track tab click and start session when activeTab is provided', async () => {
      const mockEventId = 'event-uuid-123'
      analyticsService.startTabSession.mockResolvedValue(mockEventId)

      renderHook(() => useTabAnalytics('pedidos', userId, role))

      await vi.waitFor(() => {
        expect(analyticsService.trackTabClick).toHaveBeenCalledWith('pedidos', 'Pedidos', userId, role, 'dashboard')
        expect(analyticsService.startTabSession).toHaveBeenCalledWith('pedidos', 'Pedidos', userId, role, 'dashboard')
        expect(analyticsService.startTabSession).toHaveBeenCalledTimes(1)
      })
    })

    it('should not track when role is architect', () => {
      renderHook(() => useTabAnalytics('pedidos', userId, 'architect'))

      expect(analyticsService.trackTabClick).not.toHaveBeenCalled()
      expect(analyticsService.startTabSession).not.toHaveBeenCalled()
    })

    it('should not track when userId is null', () => {
      renderHook(() => useTabAnalytics('pedidos', null, role))

      expect(analyticsService.trackTabClick).not.toHaveBeenCalled()
      expect(analyticsService.startTabSession).not.toHaveBeenCalled()
    })

    it('should handle unknown tab names gracefully', async () => {
      const mockEventId = 'event-uuid-unknown'
      analyticsService.startTabSession.mockResolvedValue(mockEventId)

      renderHook(() => useTabAnalytics('unknown-tab', userId, role))

      await vi.waitFor(() => {
        expect(analyticsService.trackTabClick).toHaveBeenCalledWith('unknown-tab', 'unknown-tab', userId, role, 'dashboard')
        expect(analyticsService.startTabSession).toHaveBeenCalledWith('unknown-tab', 'unknown-tab', userId, role, 'dashboard')
      })
    })
  })

  describe('tab switching', () => {
    it('should end previous session and start new session when tab changes', async () => {
      const firstEventId = 'event-pedidos-123'
      const secondEventId = 'event-agendamentos-456'

      analyticsService.startTabSession
        .mockResolvedValueOnce(firstEventId)
        .mockResolvedValueOnce(secondEventId)

      const { rerender } = renderHook(
        ({ activeTab }) => useTabAnalytics(activeTab, userId, role),
        { initialProps: { activeTab: 'pedidos' } }
      )

      await vi.waitFor(() => {
        expect(analyticsService.trackTabClick).toHaveBeenCalledWith('pedidos', 'Pedidos', userId, role, 'dashboard')
        expect(analyticsService.startTabSession).toHaveBeenCalledWith('pedidos', 'Pedidos', userId, role, 'dashboard')
      })
      expect(analyticsService.endTabSession).not.toHaveBeenCalled()

      // Change tab
      rerender({ activeTab: 'agendamentos' })

      await vi.waitFor(() => {
        expect(analyticsService.endTabSession).toHaveBeenCalledWith(firstEventId, expect.any(Date))
        expect(analyticsService.trackTabClick).toHaveBeenCalledWith('agendamentos', 'Agendamentos', userId, role, 'dashboard')
        expect(analyticsService.startTabSession).toHaveBeenCalledWith('agendamentos', 'Agendamentos', userId, role, 'dashboard')
        expect(analyticsService.startTabSession).toHaveBeenCalledTimes(2)
      })
    })

    it('should handle multiple tab switches correctly', async () => {
      const eventIds = ['event-1', 'event-2', 'event-3']
      let callCount = 0
      analyticsService.startTabSession.mockImplementation(() => Promise.resolve(eventIds[callCount++]))

      const { rerender } = renderHook(
        ({ activeTab }) => useTabAnalytics(activeTab, userId, role),
        { initialProps: { activeTab: 'pedidos' } }
      )

      await vi.waitFor(() => expect(analyticsService.startTabSession).toHaveBeenCalled())

      rerender({ activeTab: 'agendamentos' })
      await vi.waitFor(() => expect(analyticsService.endTabSession).toHaveBeenCalledWith(eventIds[0], expect.any(Date)))

      rerender({ activeTab: 'whatsapp' })
      await vi.waitFor(() => {
        expect(analyticsService.endTabSession).toHaveBeenCalledWith(eventIds[1], expect.any(Date))
        expect(analyticsService.endTabSession).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('cleanup', () => {
    it('should end session on unmount', async () => {
      const mockEventId = 'event-pedidos-123'
      analyticsService.startTabSession.mockResolvedValue(mockEventId)

      const { unmount } = renderHook(() => useTabAnalytics('pedidos', userId, role))

      await vi.waitFor(() => expect(analyticsService.startTabSession).toHaveBeenCalled())
      expect(analyticsService.endTabSession).not.toHaveBeenCalled()

      unmount()

      expect(analyticsService.endTabSession).toHaveBeenCalledWith(mockEventId, expect.any(Date))
      expect(analyticsService.endTabSession).toHaveBeenCalledTimes(1)
    })

    it('should end session when tab changes to null/undefined', async () => {
      const mockEventId = 'event-pedidos-123'
      analyticsService.startTabSession.mockResolvedValue(mockEventId)

      const { rerender } = renderHook(
        ({ activeTab }) => useTabAnalytics(activeTab, userId, role),
        { initialProps: { activeTab: 'pedidos' } }
      )

      await vi.waitFor(() => expect(analyticsService.startTabSession).toHaveBeenCalled())

      rerender({ activeTab: null })

      await vi.waitFor(() => {
        expect(analyticsService.endTabSession).toHaveBeenCalledWith(mockEventId, expect.any(Date))
      })
    })
  })

  describe('beforeunload event', () => {
    it('should end session on beforeunload event', async () => {
      const mockEventId = 'event-pedidos-123'
      analyticsService.startTabSession.mockResolvedValue(mockEventId)

      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const { unmount } = renderHook(() => useTabAnalytics('pedidos', userId, role))

      await vi.waitFor(() => expect(analyticsService.startTabSession).toHaveBeenCalled())

      // Verify beforeunload listener was added
      expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))

      // Get the handler function
      const beforeUnloadHandler = addEventListenerSpy.mock.calls.find(
        call => call[0] === 'beforeunload'
      )[1]

      // Simulate beforeunload
      act(() => {
        beforeUnloadHandler()
      })

      expect(analyticsService.endTabSession).toHaveBeenCalledWith(mockEventId, expect.any(Date))

      unmount()

      // Verify cleanup removes listener
      expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', beforeUnloadHandler)

      addEventListenerSpy.mockRestore()
      removeEventListenerSpy.mockRestore()
    })

    it('should clean up beforeunload listener on unmount', async () => {
      const mockEventId = 'event-pedidos-123'
      analyticsService.startTabSession.mockResolvedValue(mockEventId)

      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const { unmount } = renderHook(() => useTabAnalytics('pedidos', userId, role))

      await vi.waitFor(() => expect(analyticsService.startTabSession).toHaveBeenCalled())

      const beforeUnloadHandler = addEventListenerSpy.mock.calls.find(
        call => call[0] === 'beforeunload'
      )[1]

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', beforeUnloadHandler)
      expect(analyticsService.endTabSession).toHaveBeenCalledWith(mockEventId, expect.any(Date))

      addEventListenerSpy.mockRestore()
      removeEventListenerSpy.mockRestore()
    })
  })

  describe('tab name mapping', () => {
    it('should map pedidos tab correctly', async () => {
      analyticsService.startTabSession.mockResolvedValue('event-uuid')

      renderHook(() => useTabAnalytics('pedidos', userId, role))

      await vi.waitFor(() => {
        expect(analyticsService.trackTabClick).toHaveBeenCalledWith('pedidos', 'Pedidos', userId, role, 'dashboard')
        expect(analyticsService.startTabSession).toHaveBeenCalledWith('pedidos', 'Pedidos', userId, role, 'dashboard')
      })
    })

    it('should map agendamentos tab correctly', async () => {
      analyticsService.startTabSession.mockResolvedValue('event-uuid')

      renderHook(() => useTabAnalytics('agendamentos', userId, role))

      await vi.waitFor(() => {
        expect(analyticsService.trackTabClick).toHaveBeenCalledWith('agendamentos', 'Agendamentos', userId, role, 'dashboard')
        expect(analyticsService.startTabSession).toHaveBeenCalledWith('agendamentos', 'Agendamentos', userId, role, 'dashboard')
      })
    })

    it('should map whatsapp tab correctly', async () => {
      analyticsService.startTabSession.mockResolvedValue('event-uuid')

      renderHook(() => useTabAnalytics('whatsapp', userId, role))

      await vi.waitFor(() => {
        expect(analyticsService.trackTabClick).toHaveBeenCalledWith('whatsapp', 'WhatsApp', userId, role, 'dashboard')
        expect(analyticsService.startTabSession).toHaveBeenCalledWith('whatsapp', 'WhatsApp', userId, role, 'dashboard')
      })
    })
  })

  describe('return value', () => {
    it('should return an empty object', () => {
      const { result } = renderHook(() => useTabAnalytics('pedidos', userId, role))

      expect(result.current).toEqual({})
    })
  })

  describe('surface contatos', () => {
    it('should pass surface and custom tabNames to analytics', async () => {
      analyticsService.startTabSession.mockResolvedValue('evt-contatos-1')
      const tabNames = { 'contatos-dados-contato': 'Dados do Contato' }

      renderHook(() =>
        useTabAnalytics('contatos-dados-contato', userId, role, {
          surface: 'contatos',
          tabNames,
        }),
      )

      await vi.waitFor(() => {
        expect(analyticsService.trackTabClick).toHaveBeenCalledWith(
          'contatos-dados-contato',
          'Dados do Contato',
          userId,
          role,
          'contatos',
        )
        expect(analyticsService.startTabSession).toHaveBeenCalledWith(
          'contatos-dados-contato',
          'Dados do Contato',
          userId,
          role,
          'contatos',
        )
      })
    })
  })
})

















