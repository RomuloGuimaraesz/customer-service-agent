import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { AdminProvider, useAdmin } from './AdminContext'
import { AuthProvider, useAuth } from './AuthContext'
import { CONFIG } from '../config/constants'
import { MOCK_DATA } from '../data/mockData'

// Mock fetch globally
global.fetch = vi.fn()

// Helper to render with both providers
const renderWithProviders = (hook) => {
  return renderHook(hook, {
    wrapper: ({ children }) => (
      <AuthProvider>
        <AdminProvider>{children}</AdminProvider>
      </AuthProvider>
    ),
  })
}

describe('AdminContext', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    sessionStorage.clear()
  })

  describe('useAdmin hook', () => {
    it('should throw error when used outside AdminProvider', () => {
      expect(() => {
        renderHook(() => useAdmin())
      }).toThrow('useAdmin must be used within AdminProvider')
    })
  })

  describe('initialization', () => {
    it('should start with empty state', () => {
      const { result } = renderWithProviders(() => useAdmin())

      expect(result.current.pedidos).toEqual([])
      expect(result.current.agendamentos).toEqual([])
      expect(result.current.loading).toEqual({
        pedidos: false,
        agendamentos: false,
      })
      expect(result.current.error).toEqual({
        pedidos: null,
        agendamentos: null,
      })
      expect(result.current.activeTab).toBe('pedidos')
    })
  })

  describe('fetchData', () => {
    it('should not fetch when not authenticated', async () => {
      const { result } = renderWithProviders(() => useAdmin())

      await act(async () => {
        await result.current.fetchData('pedidos')
      })

      expect(global.fetch).not.toHaveBeenCalled()
      expect(result.current.pedidos).toEqual([])
    })

    it('should fetch pedidos successfully when authenticated', async () => {
      const mockPedidos = [{ ID: 'TEST-001', Cliente: 'Test Client' }]
      
      // Set up default mock implementation
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockPedidos,
      })

      const { result } = renderWithProviders(() => {
        const admin = useAdmin()
        const auth = useAuth()
        return { admin, auth }
      })

      await waitFor(() => {
        expect(result.current.auth.isLoading).toBe(false)
      })

      // Login
      await act(async () => {
        await result.current.auth.login('user', 'pass')
      })

      // Wait for any auto-refresh to settle
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200))
      })

      // Override mock for manual fetch
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockPedidos,
      })

      await act(async () => {
        await result.current.admin.fetchData('pedidos')
      })

      await waitFor(() => {
        expect(result.current.admin.loading.pedidos).toBe(false)
      }, { timeout: 2000 })

      expect(result.current.admin.pedidos).toEqual(mockPedidos)
      expect(result.current.admin.error.pedidos).toBeNull()
      expect(result.current.admin.lastUpdated.pedidos).toBeInstanceOf(Date)
    })

    it('should handle 401 unauthorized error', async () => {
      const { result } = renderWithProviders(() => {
        const admin = useAdmin()
        const auth = useAuth()
        return { admin, auth }
      })

      await waitFor(() => {
        expect(result.current.auth.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.auth.login('user', 'pass')
      })

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200))
      })

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      })

      await act(async () => {
        await result.current.admin.fetchData('pedidos')
      })

      await waitFor(() => {
        expect(result.current.admin.loading.pedidos).toBe(false)
        expect(result.current.admin.error.pedidos).toBeTruthy()
      }, { timeout: 2000 })

      expect(result.current.admin.error.pedidos).toBe('Não autorizado - verifique suas credenciais')
      expect(result.current.admin.pedidos).toEqual(MOCK_DATA.pedidos)
    })

    it('should handle network errors and use mock data', async () => {
      const { result } = renderWithProviders(() => {
        const admin = useAdmin()
        const auth = useAuth()
        return { admin, auth }
      })

      await waitFor(() => {
        expect(result.current.auth.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.auth.login('user', 'pass')
      })

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200))
      })

      global.fetch.mockRejectedValueOnce(new Error('Network error'))

      await act(async () => {
        await result.current.admin.fetchData('pedidos')
      })

      await waitFor(() => {
        expect(result.current.admin.loading.pedidos).toBe(false)
        expect(result.current.admin.error.pedidos).toBeTruthy()
      }, { timeout: 2000 })

      expect(result.current.admin.error.pedidos).toBe('Network error')
      expect(result.current.admin.pedidos).toEqual(MOCK_DATA.pedidos)
    })

    it('should handle non-array response data', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ notAnArray: true }),
      })

      const { result } = renderWithProviders(() => {
        const admin = useAdmin()
        const auth = useAuth()
        return { admin, auth }
      })

      await waitFor(() => {
        expect(result.current.auth.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.auth.login('user', 'pass')
      })

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200))
      })

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ notAnArray: true }),
      })

      await act(async () => {
        await result.current.admin.fetchData('pedidos')
      })

      await waitFor(() => {
        expect(result.current.admin.loading.pedidos).toBe(false)
      }, { timeout: 2000 })

      expect(result.current.admin.pedidos).toEqual([])
    })
  })

  describe('refreshAll', () => {
    it('should refresh both pedidos and agendamentos', async () => {
      const mockPedidos = [{ ID: 'P-001' }]
      const mockAgendamentos = [{ ID: 'A-001' }]

      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockPedidos,
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockAgendamentos,
        })

      const { result } = renderWithProviders(() => {
        const admin = useAdmin()
        const auth = useAuth()
        return { admin, auth }
      })

      await waitFor(() => {
        expect(result.current.auth.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.auth.login('user', 'pass')
      })

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200))
      })

      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockPedidos,
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockAgendamentos,
        })

      await act(async () => {
        result.current.admin.refreshAll()
      })

      await waitFor(() => {
        expect(result.current.admin.loading.pedidos).toBe(false)
        expect(result.current.admin.loading.agendamentos).toBe(false)
      }, { timeout: 2000 })

      expect(result.current.admin.pedidos).toEqual(mockPedidos)
      expect(result.current.admin.agendamentos).toEqual(mockAgendamentos)
    })
  })

  describe('activeTab', () => {
    it('should update active tab', () => {
      const { result } = renderWithProviders(() => useAdmin())

      expect(result.current.activeTab).toBe('pedidos')

      act(() => {
        result.current.setActiveTab('agendamentos')
      })

      expect(result.current.activeTab).toBe('agendamentos')
    })
  })
})
