import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { usePedidos } from './usePedidos'
import { PedidosProvider } from '../contexts/PedidosContext'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { RepositoryFactory } from '../infrastructure/repositoryFactory.js'
import { TestPedidoRepository } from '../infrastructure/test/TestRepository.js'
import { MOCK_DATA } from '../data/mockData'

// Mock Supabase
vi.mock('../infrastructure/supabase/config', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
  },
}))

import { supabase } from '../infrastructure/supabase/config'

// Helper to render with providers
const renderWithProviders = (hook) => {
  return renderHook(hook, {
    wrapper: ({ children }) => (
      <AuthProvider>
        <PedidosProvider>{children}</PedidosProvider>
      </AuthProvider>
    ),
  })
}

// Test repository
let testPedidoRepository

describe('usePedidos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()

    // Create fresh test repository for each test
    testPedidoRepository = new TestPedidoRepository()

    // Set up repository override for testing
    RepositoryFactory.setTestOverrides({
      pedidoRepository: testPedidoRepository,
    })

    // Reset Supabase mocks
    supabase.auth.signInWithPassword.mockReset()
    supabase.auth.signOut.mockReset()
    // Setup default Supabase login mock for authenticated tests
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: {
        user: { email: 'user@example.com' },
        session: { access_token: 'mock-token' }
      },
      error: null,
    })
  })

  afterEach(() => {
    RepositoryFactory.clearTestOverrides()
  })

  describe('hook interface', () => {
    it('should return the expected interface', () => {
      const { result } = renderWithProviders(() => usePedidos())

      expect(result.current).toHaveProperty('pedidos')
      expect(result.current).toHaveProperty('loading')
      expect(result.current).toHaveProperty('error')
      expect(result.current).toHaveProperty('lastUpdated')
      expect(result.current).toHaveProperty('fetchPedidos')
      expect(result.current).toHaveProperty('refreshPedidos')
      expect(typeof result.current.fetchPedidos).toBe('function')
      expect(typeof result.current.refreshPedidos).toBe('function')
    })

    it('should start with initial state', () => {
      const { result } = renderWithProviders(() => usePedidos())

      expect(result.current.pedidos).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.lastUpdated).toBeNull()
    })
  })

  describe('data fetching', () => {
    it('should fetch pedidos successfully', async () => {
      const mockPedidos = [{ ID: 'TEST-001', Cliente: 'Test Client' }]
      testPedidoRepository.setMockData('fetchPedidos', mockPedidos)

      const { result } = renderWithProviders(() => {
        const pedidos = usePedidos()
        const auth = useAuth()
        return { pedidos, auth }
      })

      await waitFor(() => {
        expect(result.current.auth.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.auth.login('user@example.com', 'pass')
      })

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200))
      })

      await act(async () => {
        await result.current.pedidos.fetchPedidos()
      })

      await waitFor(() => {
        expect(result.current.pedidos.loading).toBe(false)
      }, { timeout: 2000 })

      expect(result.current.pedidos.pedidos).toEqual(mockPedidos)
      expect(result.current.pedidos.error).toBeNull()
      expect(result.current.pedidos.lastUpdated).toBeInstanceOf(Date)
    })

    it('should handle errors and use mock data', async () => {
      testPedidoRepository.setMockError('fetchPedidos', new Error('Network error'))

      const { result } = renderWithProviders(() => {
        const pedidos = usePedidos()
        const auth = useAuth()
        return { pedidos, auth }
      })

      await waitFor(() => {
        expect(result.current.auth.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.auth.login('user@example.com', 'pass')
      })

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200))
      })

      await act(async () => {
        await result.current.pedidos.fetchPedidos()
      })

      await waitFor(() => {
        expect(result.current.pedidos.loading).toBe(false)
      }, { timeout: 2000 })

      expect(result.current.pedidos.pedidos).toEqual(MOCK_DATA.pedidos)
      expect(result.current.pedidos.error).toBeTruthy()
    })
  })
})
