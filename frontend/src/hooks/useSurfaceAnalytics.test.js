import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSurfaceAnalytics } from './useSurfaceAnalytics'
import * as analyticsService from '../services/analytics'

vi.mock('../services/analytics', () => ({
  trackSurfaceView: vi.fn().mockResolvedValue(null),
  startSurfaceSession: vi.fn().mockResolvedValue(null),
  endSurfaceSession: vi.fn().mockResolvedValue(null),
}))

describe('useSurfaceAnalytics', () => {
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
    it('should track surface view and start session when surface is provided', async () => {
      const mockEventId = 'event-uuid-123'
      analyticsService.startSurfaceSession.mockResolvedValue(mockEventId)

      renderHook(() => useSurfaceAnalytics('dashboard', userId, role))

      await vi.waitFor(() => {
        expect(analyticsService.trackSurfaceView).toHaveBeenCalledWith('dashboard', userId, role)
        expect(analyticsService.startSurfaceSession).toHaveBeenCalledWith('dashboard', userId, role)
        expect(analyticsService.startSurfaceSession).toHaveBeenCalledTimes(1)
      })
    })

    it('should not track when role is architect', () => {
      renderHook(() => useSurfaceAnalytics('dashboard', userId, 'architect'))

      expect(analyticsService.trackSurfaceView).not.toHaveBeenCalled()
      expect(analyticsService.startSurfaceSession).not.toHaveBeenCalled()
    })

    it('should not track when userId is null', () => {
      renderHook(() => useSurfaceAnalytics('dashboard', null, role))

      expect(analyticsService.trackSurfaceView).not.toHaveBeenCalled()
      expect(analyticsService.startSurfaceSession).not.toHaveBeenCalled()
    })

    it('should not track when surface is null', () => {
      renderHook(() => useSurfaceAnalytics(null, userId, role))

      expect(analyticsService.trackSurfaceView).not.toHaveBeenCalled()
      expect(analyticsService.startSurfaceSession).not.toHaveBeenCalled()
    })
  })

  describe('surface switching', () => {
    it('should end previous session and start new session when surface changes', async () => {
      const firstEventId = 'event-dashboard-123'
      const secondEventId = 'event-contatos-456'

      analyticsService.startSurfaceSession
        .mockResolvedValueOnce(firstEventId)
        .mockResolvedValueOnce(secondEventId)

      const { rerender } = renderHook(
        ({ surface }) => useSurfaceAnalytics(surface, userId, role),
        { initialProps: { surface: 'dashboard' } }
      )

      await vi.waitFor(() => {
        expect(analyticsService.trackSurfaceView).toHaveBeenCalledWith('dashboard', userId, role)
        expect(analyticsService.startSurfaceSession).toHaveBeenCalledWith('dashboard', userId, role)
      })
      expect(analyticsService.endSurfaceSession).not.toHaveBeenCalled()

      rerender({ surface: 'contatos' })

      await vi.waitFor(() => {
        expect(analyticsService.endSurfaceSession).toHaveBeenCalledWith(firstEventId, expect.any(Date))
        expect(analyticsService.trackSurfaceView).toHaveBeenCalledWith('contatos', userId, role)
        expect(analyticsService.startSurfaceSession).toHaveBeenCalledWith('contatos', userId, role)
        expect(analyticsService.startSurfaceSession).toHaveBeenCalledTimes(2)
      })
    })

    it('should handle multiple surface switches correctly', async () => {
      const eventIds = ['event-1', 'event-2', 'event-3']
      let callCount = 0
      analyticsService.startSurfaceSession.mockImplementation(() => Promise.resolve(eventIds[callCount++]))

      const { rerender } = renderHook(
        ({ surface }) => useSurfaceAnalytics(surface, userId, role),
        { initialProps: { surface: 'dashboard' } }
      )

      await vi.waitFor(() => expect(analyticsService.startSurfaceSession).toHaveBeenCalled())

      rerender({ surface: 'contatos' })
      await vi.waitFor(() => expect(analyticsService.endSurfaceSession).toHaveBeenCalledWith(eventIds[0], expect.any(Date)))

      rerender({ surface: 'dashboard' })
      await vi.waitFor(() => {
        expect(analyticsService.endSurfaceSession).toHaveBeenCalledWith(eventIds[1], expect.any(Date))
        expect(analyticsService.endSurfaceSession).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('cleanup', () => {
    it('should end session on unmount', async () => {
      const mockEventId = 'event-dashboard-123'
      analyticsService.startSurfaceSession.mockResolvedValue(mockEventId)

      const { unmount } = renderHook(() => useSurfaceAnalytics('dashboard', userId, role))

      await vi.waitFor(() => expect(analyticsService.startSurfaceSession).toHaveBeenCalled())
      expect(analyticsService.endSurfaceSession).not.toHaveBeenCalled()

      unmount()

      expect(analyticsService.endSurfaceSession).toHaveBeenCalledWith(mockEventId, expect.any(Date))
      expect(analyticsService.endSurfaceSession).toHaveBeenCalledTimes(1)
    })

    it('should end session when surface changes to null', async () => {
      const mockEventId = 'event-dashboard-123'
      analyticsService.startSurfaceSession.mockResolvedValue(mockEventId)

      const { rerender } = renderHook(
        ({ surface }) => useSurfaceAnalytics(surface, userId, role),
        { initialProps: { surface: 'dashboard' } }
      )

      await vi.waitFor(() => expect(analyticsService.startSurfaceSession).toHaveBeenCalled())

      rerender({ surface: null })

      await vi.waitFor(() => {
        expect(analyticsService.endSurfaceSession).toHaveBeenCalledWith(mockEventId, expect.any(Date))
      })
    })
  })

  describe('beforeunload event', () => {
    it('should end session on beforeunload event', async () => {
      const mockEventId = 'event-dashboard-123'
      analyticsService.startSurfaceSession.mockResolvedValue(mockEventId)

      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const { unmount } = renderHook(() => useSurfaceAnalytics('dashboard', userId, role))

      await vi.waitFor(() => expect(analyticsService.startSurfaceSession).toHaveBeenCalled())

      expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))

      const beforeUnloadHandler = addEventListenerSpy.mock.calls.find(
        call => call[0] === 'beforeunload'
      )[1]

      act(() => {
        beforeUnloadHandler()
      })

      expect(analyticsService.endSurfaceSession).toHaveBeenCalledWith(mockEventId, expect.any(Date))

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', beforeUnloadHandler)

      addEventListenerSpy.mockRestore()
      removeEventListenerSpy.mockRestore()
    })

    it('should clean up beforeunload listener on unmount', async () => {
      const mockEventId = 'event-dashboard-123'
      analyticsService.startSurfaceSession.mockResolvedValue(mockEventId)

      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const { unmount } = renderHook(() => useSurfaceAnalytics('dashboard', userId, role))

      await vi.waitFor(() => expect(analyticsService.startSurfaceSession).toHaveBeenCalled())

      const beforeUnloadHandler = addEventListenerSpy.mock.calls.find(
        call => call[0] === 'beforeunload'
      )[1]

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', beforeUnloadHandler)
      expect(analyticsService.endSurfaceSession).toHaveBeenCalledWith(mockEventId, expect.any(Date))

      addEventListenerSpy.mockRestore()
      removeEventListenerSpy.mockRestore()
    })
  })

  describe('return value', () => {
    it('should return an empty object', () => {
      const { result } = renderHook(() => useSurfaceAnalytics('dashboard', userId, role))

      expect(result.current).toEqual({})
    })
  })
})
