import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useAgendamentos } from './useAgendamentos'
import { AgendamentosProvider } from '../contexts/AgendamentosContext'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { RepositoryFactory } from '../infrastructure/repositoryFactory.js'
import { TestAgendamentoRepository } from '../infrastructure/test/TestRepository.js'
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
        <AgendamentosProvider>{children}</AgendamentosProvider>
      </AuthProvider>
    ),
  })
}

// Test repository
let testAgendamentoRepository

describe('useAgendamentos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()

    // Create fresh test repository for each test
    testAgendamentoRepository = new TestAgendamentoRepository()

    // Set up repository override for testing
    RepositoryFactory.setTestOverrides({
      agendamentoRepository: testAgendamentoRepository,
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
      const { result } = renderWithProviders(() => useAgendamentos())

      expect(result.current).toHaveProperty('agendamentos')
      expect(result.current).toHaveProperty('loading')
      expect(result.current).toHaveProperty('error')
      expect(result.current).toHaveProperty('lastUpdated')
      expect(result.current).toHaveProperty('fetchAgendamentos')
      expect(result.current).toHaveProperty('refreshAgendamentos')
      expect(typeof result.current.fetchAgendamentos).toBe('function')
      expect(typeof result.current.refreshAgendamentos).toBe('function')
    })

    it('should start with initial state', () => {
      const { result } = renderWithProviders(() => useAgendamentos())

      expect(result.current.agendamentos).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.lastUpdated).toBeNull()
    })
  })

  describe('data fetching', () => {
    it('should fetch agendamentos successfully', async () => {
      const mockAgendamentos = [{ ID: 'A-001', Nome: 'Test Client', Status: 'Agendado', Data: '07/02/2026' }]
      testAgendamentoRepository.setMockData('fetchAgendamentos', mockAgendamentos)

      const { result } = renderWithProviders(() => {
        const agendamentos = useAgendamentos()
        const auth = useAuth()
        return { agendamentos, auth }
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
        await result.current.agendamentos.fetchAgendamentos()
      })

      await waitFor(() => {
        expect(result.current.agendamentos.loading).toBe(false)
      }, { timeout: 2000 })

      expect(result.current.agendamentos.agendamentos).toEqual(mockAgendamentos)
      expect(result.current.agendamentos.error).toBeNull()
      expect(result.current.agendamentos.lastUpdated).toBeInstanceOf(Date)
    })

    it('should handle errors and use mock data', async () => {
      testAgendamentoRepository.setMockError('fetchAgendamentos', new Error('Network error'))

      const { result } = renderWithProviders(() => {
        const agendamentos = useAgendamentos()
        const auth = useAuth()
        return { agendamentos, auth }
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
        await result.current.agendamentos.fetchAgendamentos()
      })

      await waitFor(() => {
        expect(result.current.agendamentos.loading).toBe(false)
      }, { timeout: 2000 })

      expect(result.current.agendamentos.agendamentos).toEqual(MOCK_DATA.agendamentos)
      // AgendamentosContext clears error after loading mock data (unlike PedidosContext which preserves it)
      expect(result.current.agendamentos.error).toBeNull()
    })
  })
})
