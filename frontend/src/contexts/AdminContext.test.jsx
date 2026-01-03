import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { AdminProvider, useAdmin } from './AdminContext'
import { AuthProvider, useAuth } from './AuthContext'
import { CONFIG } from '../config/constants'
import { MOCK_DATA } from '../data/mockData'
import { RepositoryFactory } from '../infrastructure/repositoryFactory.js'
import { TestPedidoRepository, TestAgendamentoRepository, TestWhatsAppConversationRepository } from '../infrastructure/test/TestRepository.js'

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

// Test repositories
let testPedidoRepository
let testAgendamentoRepository
let testWhatsAppRepository

describe('AdminContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()

    // Create fresh test repositories for each test
    testPedidoRepository = new TestPedidoRepository()
    testAgendamentoRepository = new TestAgendamentoRepository()
    testWhatsAppRepository = new TestWhatsAppConversationRepository()

    // Set up repository overrides for testing
    RepositoryFactory.setTestOverrides({
      pedidoRepository: testPedidoRepository,
      agendamentoRepository: testAgendamentoRepository,
      whatsAppConversationRepository: testWhatsAppRepository,
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
        conversations: false,
        messages: false,
        sendMessage: false,
      })
      expect(result.current.error).toEqual({
        pedidos: null,
        agendamentos: null,
        conversations: null,
        messages: null,
        sendMessage: null,
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

      // Should not attempt to fetch when not authenticated
      expect(result.current.pedidos).toEqual([])
    })

    it('should fetch pedidos successfully when authenticated', async () => {
      const mockPedidos = [{ ID: 'TEST-001', Cliente: 'Test Client' }]

      // Set up test repository mock
      testPedidoRepository.setMockData('fetchPedidos', mockPedidos)

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
        await result.current.auth.login('user@example.com', 'pass')
      })

      // Wait for any auto-refresh to settle
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200))
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
      // Set up test repository to throw unauthorized error
      testPedidoRepository.setMockError('fetchPedidos', new Error('Não autorizado - verifique suas credenciais'))

      const { result } = renderWithProviders(() => {
        const admin = useAdmin()
        const auth = useAuth()
        return { admin, auth }
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
        await result.current.admin.fetchData('pedidos')
      })

      await waitFor(() => {
        expect(result.current.admin.loading.pedidos).toBe(false)
        expect(result.current.admin.error.pedidos).toBeTruthy()
      }, { timeout: 2000 })

      expect(result.current.admin.error.pedidos).toBe('Failed to fetch pedidos: Não autorizado - verifique suas credenciais')
      expect(result.current.admin.pedidos).toEqual(MOCK_DATA.pedidos)
    })

    it('should handle network errors and use mock data', async () => {
      // Set up test repository to throw network error
      testPedidoRepository.setMockError('fetchPedidos', new Error('Network error'))

      const { result } = renderWithProviders(() => {
        const admin = useAdmin()
        const auth = useAuth()
        return { admin, auth }
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
        await result.current.admin.fetchData('pedidos')
      })

      await waitFor(() => {
        expect(result.current.admin.loading.pedidos).toBe(false)
        expect(result.current.admin.error.pedidos).toBeTruthy()
      }, { timeout: 2000 })

      expect(result.current.admin.error.pedidos).toBe('Failed to fetch pedidos: Network error')
      expect(result.current.admin.pedidos).toEqual(MOCK_DATA.pedidos)
    })

    it('should handle non-array response data', async () => {
      // Set up test repository to return non-array data (should cause validation error)
      testPedidoRepository.setMockData('fetchPedidos', { notAnArray: true })

      const { result } = renderWithProviders(() => {
        const admin = useAdmin()
        const auth = useAuth()
        return { admin, auth }
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
        await result.current.admin.fetchData('pedidos')
      })

      await waitFor(() => {
        expect(result.current.admin.loading.pedidos).toBe(false)
      }, { timeout: 2000 })

      // Should fall back to mock data when validation fails
      expect(result.current.admin.pedidos).toEqual(MOCK_DATA.pedidos)
      expect(result.current.admin.error.pedidos).toBeTruthy()
    })
  })

  describe('refreshAll', () => {
    it('should refresh both pedidos and agendamentos', async () => {
      const mockPedidos = [{ ID: 'P-001' }]
      const mockAgendamentos = [{ ID: 'A-001' }]

      // Set up test repository mocks
      testPedidoRepository.setMockData('fetchPedidos', mockPedidos)
      testAgendamentoRepository.setMockData('fetchAgendamentos', mockAgendamentos)

      const { result } = renderWithProviders(() => {
        const admin = useAdmin()
        const auth = useAuth()
        return { admin, auth }
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
