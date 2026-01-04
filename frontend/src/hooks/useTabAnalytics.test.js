import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTabAnalytics } from './useTabAnalytics'
import * as analyticsService from '../services/analytics'

// Mock the analytics service
vi.mock('../services/analytics', () => ({
  trackTabClick: vi.fn(),
  startTabSession: vi.fn(),
  endTabSession: vi.fn(),
}))

describe('useTabAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('should track tab click and start session when activeTab is provided', () => {
      const mockSessionId = 'pedidos_1234567890'
      analyticsService.startTabSession.mockReturnValue(mockSessionId)

      renderHook(() => useTabAnalytics('pedidos'))

      expect(analyticsService.trackTabClick).toHaveBeenCalledWith('pedidos', 'Pedidos')
      expect(analyticsService.startTabSession).toHaveBeenCalledWith('pedidos', 'Pedidos')
      expect(analyticsService.startTabSession).toHaveBeenCalledTimes(1)
    })

    it('should handle unknown tab names gracefully', () => {
      const mockSessionId = 'unknown_1234567890'
      analyticsService.startTabSession.mockReturnValue(mockSessionId)

      renderHook(() => useTabAnalytics('unknown-tab'))

      expect(analyticsService.trackTabClick).toHaveBeenCalledWith('unknown-tab', 'unknown-tab')
      expect(analyticsService.startTabSession).toHaveBeenCalledWith('unknown-tab', 'unknown-tab')
    })
  })

  describe('tab switching', () => {
    it('should end previous session and start new session when tab changes', () => {
      const firstSessionId = 'pedidos_1234567890'
      const secondSessionId = 'agendamentos_1234567891'
      
      analyticsService.startTabSession
        .mockReturnValueOnce(firstSessionId)
        .mockReturnValueOnce(secondSessionId)

      const { rerender } = renderHook(
        ({ activeTab }) => useTabAnalytics(activeTab),
        { initialProps: { activeTab: 'pedidos' } }
      )

      expect(analyticsService.trackTabClick).toHaveBeenCalledWith('pedidos', 'Pedidos')
      expect(analyticsService.startTabSession).toHaveBeenCalledWith('pedidos', 'Pedidos')
      expect(analyticsService.endTabSession).not.toHaveBeenCalled()

      // Change tab
      rerender({ activeTab: 'agendamentos' })

      expect(analyticsService.endTabSession).toHaveBeenCalledWith(firstSessionId)
      expect(analyticsService.trackTabClick).toHaveBeenCalledWith('agendamentos', 'Agendamentos')
      expect(analyticsService.startTabSession).toHaveBeenCalledWith('agendamentos', 'Agendamentos')
      expect(analyticsService.startTabSession).toHaveBeenCalledTimes(2)
    })

    it('should handle multiple tab switches correctly', () => {
      const sessionIds = ['pedidos_1', 'agendamentos_2', 'whatsapp_3']
      let callCount = 0
      analyticsService.startTabSession.mockImplementation(() => sessionIds[callCount++])

      const { rerender } = renderHook(
        ({ activeTab }) => useTabAnalytics(activeTab),
        { initialProps: { activeTab: 'pedidos' } }
      )

      rerender({ activeTab: 'agendamentos' })
      expect(analyticsService.endTabSession).toHaveBeenCalledWith(sessionIds[0])

      rerender({ activeTab: 'whatsapp' })
      expect(analyticsService.endTabSession).toHaveBeenCalledWith(sessionIds[1])
      expect(analyticsService.endTabSession).toHaveBeenCalledTimes(2)
    })
  })

  describe('cleanup', () => {
    it('should end session on unmount', () => {
      const mockSessionId = 'pedidos_1234567890'
      analyticsService.startTabSession.mockReturnValue(mockSessionId)

      const { unmount } = renderHook(() => useTabAnalytics('pedidos'))

      expect(analyticsService.endTabSession).not.toHaveBeenCalled()

      unmount()

      expect(analyticsService.endTabSession).toHaveBeenCalledWith(mockSessionId)
      expect(analyticsService.endTabSession).toHaveBeenCalledTimes(1)
    })

    it('should end session when tab changes to null/undefined', () => {
      const mockSessionId = 'pedidos_1234567890'
      analyticsService.startTabSession.mockReturnValue(mockSessionId)

      const { rerender } = renderHook(
        ({ activeTab }) => useTabAnalytics(activeTab),
        { initialProps: { activeTab: 'pedidos' } }
      )

      rerender({ activeTab: null })

      // Should end the previous session
      expect(analyticsService.endTabSession).toHaveBeenCalledWith(mockSessionId)
    })
  })

  describe('beforeunload event', () => {
    it('should end session on beforeunload event', () => {
      const mockSessionId = 'pedidos_1234567890'
      analyticsService.startTabSession.mockReturnValue(mockSessionId)

      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const { unmount } = renderHook(() => useTabAnalytics('pedidos'))

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

      expect(analyticsService.endTabSession).toHaveBeenCalledWith(mockSessionId)

      unmount()

      // Verify cleanup removes listener
      expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', beforeUnloadHandler)

      addEventListenerSpy.mockRestore()
      removeEventListenerSpy.mockRestore()
    })

    it('should clean up beforeunload listener on unmount', () => {
      const mockSessionId = 'pedidos_1234567890'
      analyticsService.startTabSession.mockReturnValue(mockSessionId)

      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const { unmount } = renderHook(() => useTabAnalytics('pedidos'))

      const beforeUnloadHandler = addEventListenerSpy.mock.calls.find(
        call => call[0] === 'beforeunload'
      )[1]

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', beforeUnloadHandler)
      expect(analyticsService.endTabSession).toHaveBeenCalledWith(mockSessionId)

      addEventListenerSpy.mockRestore()
      removeEventListenerSpy.mockRestore()
    })
  })

  describe('tab name mapping', () => {
    it('should map pedidos tab correctly', () => {
      const mockSessionId = 'pedidos_1234567890'
      analyticsService.startTabSession.mockReturnValue(mockSessionId)

      renderHook(() => useTabAnalytics('pedidos'))

      expect(analyticsService.trackTabClick).toHaveBeenCalledWith('pedidos', 'Pedidos')
      expect(analyticsService.startTabSession).toHaveBeenCalledWith('pedidos', 'Pedidos')
    })

    it('should map agendamentos tab correctly', () => {
      const mockSessionId = 'agendamentos_1234567890'
      analyticsService.startTabSession.mockReturnValue(mockSessionId)

      renderHook(() => useTabAnalytics('agendamentos'))

      expect(analyticsService.trackTabClick).toHaveBeenCalledWith('agendamentos', 'Agendamentos')
      expect(analyticsService.startTabSession).toHaveBeenCalledWith('agendamentos', 'Agendamentos')
    })

    it('should map whatsapp tab correctly', () => {
      const mockSessionId = 'whatsapp_1234567890'
      analyticsService.startTabSession.mockReturnValue(mockSessionId)

      renderHook(() => useTabAnalytics('whatsapp'))

      expect(analyticsService.trackTabClick).toHaveBeenCalledWith('whatsapp', 'WhatsApp')
      expect(analyticsService.startTabSession).toHaveBeenCalledWith('whatsapp', 'WhatsApp')
    })
  })

  describe('return value', () => {
    it('should return an empty object', () => {
      const { result } = renderHook(() => useTabAnalytics('pedidos'))

      expect(result.current).toEqual({})
    })
  })
})
