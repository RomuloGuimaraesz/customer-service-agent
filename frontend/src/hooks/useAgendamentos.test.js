import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useAgendamentos } from './useAgendamentos'
import { AgendamentosProvider } from '../contexts/AgendamentosContext'
import { AuthProvider } from '../contexts/AuthContext'
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
      const mockAgendamentos = [{ ID: 'A-001', Cliente: 'Test Client' }]
      testAgendamentoRepository.setMockData('fetchAgendamentos', mockAgendamentos)

      const { result } = renderWithProviders(() => useAgendamentos())

      // Login first to authenticate
      const { useAuth } = await import('../contexts/AuthContext')
      const authHook = renderHook(() => useAuth(), {
        wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
      })

      await waitFor(() => {
        expect(authHook.result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await authHook.result.current.login('user@example.com', 'pass')
      })

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200))
      })

      // Fetch agendamentos
      await act(async () => {
        await result.current.fetchAgendamentos()
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      }, { timeout: 2000 })

      expect(result.current.agendamentos).toEqual(mockAgendamentos)
      expect(result.current.error).toBeNull()
      expect(result.current.lastUpdated).toBeInstanceOf(Date)
    })

    it('should handle errors and use mock data', async () => {
      testAgendamentoRepository.setMockError('fetchAgendamentos', new Error('Network error'))

      const { result } = renderWithProviders(() => useAgendamentos())

      // Login first to authenticate
      const { useAuth } = await import('../contexts/AuthContext')
      const authHook = renderHook(() => useAuth(), {
        wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
      })

      await waitFor(() => {
        expect(authHook.result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await authHook.result.current.login('user@example.com', 'pass')
      })

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200))
      })

      // Fetch agendamentos
      await act(async () => {
        await result.current.fetchAgendamentos()
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      }, { timeout: 2000 })

      expect(result.current.agendamentos).toEqual(MOCK_DATA.agendamentos)
      expect(result.current.error).toBeTruthy()
    })
  })

  describe('refreshAgendamentos', () => {
    it('should be an alias for fetchAgendamentos', async () => {
      const mockAgendamentos = [{ ID: 'A-001' }]
      testAgendamentoRepository.setMockData('fetchAgendamentos', mockAgendamentos)

      const { result } = renderWithProviders(() => useAgendamentos())

      // Login first to authenticate
      const { useAuth } = await import('../contexts/AuthContext')
      const authHook = renderHook(() => useAuth(), {
        wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
      })

      await waitFor(() => {
        expect(authHook.result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await authHook.result.current.login('user@example.com', 'pass')
      })

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200))
      })

      // Use refreshAgendamentos
      await act(async () => {
        await result.current.refreshAgendamentos()
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      }, { timeout: 2000 })

      expect(result.current.agendamentos).toEqual(mockAgendamentos)
    })
  })
})






