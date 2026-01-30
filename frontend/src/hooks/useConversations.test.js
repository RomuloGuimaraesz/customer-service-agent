import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useConversations } from './useConversations'
import { WhatsAppConversationsProvider } from '../contexts/WhatsAppConversationsContext'
import { AuthProvider } from '../contexts/AuthContext'
import { RepositoryFactory } from '../infrastructure/repositoryFactory.js'
import { TestWhatsAppConversationRepository } from '../infrastructure/test/TestRepository.js'
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
        <WhatsAppConversationsProvider>{children}</WhatsAppConversationsProvider>
      </AuthProvider>
    ),
  })
}

// Test repository
let testWhatsAppRepository

describe('useConversations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()

    // Create fresh test repository for each test
    testWhatsAppRepository = new TestWhatsAppConversationRepository()

    // Set up repository override for testing
    RepositoryFactory.setTestOverrides({
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

  describe('hook interface', () => {
    it('should return the expected interface', () => {
      const { result } = renderWithProviders(() => useConversations())

      expect(result.current).toHaveProperty('conversations')
      expect(result.current).toHaveProperty('selectedConversation')
      expect(result.current).toHaveProperty('loading')
      expect(result.current).toHaveProperty('error')
      expect(result.current).toHaveProperty('lastUpdated')
      expect(result.current).toHaveProperty('fetchConversations')
      expect(result.current).toHaveProperty('refreshConversations')
      expect(result.current).toHaveProperty('selectConversation')
      expect(result.current).toHaveProperty('fetchMessages')
      expect(result.current).toHaveProperty('sendMessage')
      expect(typeof result.current.fetchConversations).toBe('function')
      expect(typeof result.current.refreshConversations).toBe('function')
      expect(typeof result.current.selectConversation).toBe('function')
      expect(typeof result.current.fetchMessages).toBe('function')
      expect(typeof result.current.sendMessage).toBe('function')
    })

    it('should start with initial state', () => {
      const { result } = renderWithProviders(() => useConversations())

      expect(result.current.conversations).toEqual([])
      expect(result.current.selectedConversation).toBeNull()
      expect(result.current.loading).toEqual({
        conversations: false,
        messages: false,
        sendMessage: false,
      })
      expect(result.current.error).toEqual({
        conversations: null,
        messages: null,
        sendMessage: null,
      })
    })
  })

  describe('data fetching', () => {
    it('should fetch conversations successfully', async () => {
      const mockConversations = [
        { id: 'conv-1', phone: '1234567890', name: 'Test User' }
      ]
      testWhatsAppRepository.setMockData('fetchConversations', mockConversations)

      const { result } = renderWithProviders(() => useConversations())

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

      // Fetch conversations
      await act(async () => {
        await result.current.fetchConversations()
      })

      await waitFor(() => {
        expect(result.current.loading.conversations).toBe(false)
      }, { timeout: 2000 })

      expect(result.current.conversations).toEqual(mockConversations)
      expect(result.current.error.conversations).toBeNull()
      expect(result.current.lastUpdated.conversations).toBeInstanceOf(Date)
    })

    it('should handle errors and use mock data', async () => {
      testWhatsAppRepository.setMockError('fetchConversations', new Error('Network error'))

      const { result } = renderWithProviders(() => useConversations())

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

      // Fetch conversations
      await act(async () => {
        await result.current.fetchConversations()
      })

      await waitFor(() => {
        expect(result.current.loading.conversations).toBe(false)
      }, { timeout: 2000 })

      expect(result.current.conversations).toEqual(MOCK_DATA.conversations)
      expect(result.current.error.conversations).toBeTruthy()
    })
  })

  describe('selectConversation', () => {
    it('should select a conversation', () => {
      const { result } = renderWithProviders(() => useConversations())

      const conversation = { id: 'conv-1', phone: '1234567890', name: 'Test User' }

      act(() => {
        result.current.selectConversation(conversation)
      })

      expect(result.current.selectedConversation).toEqual(conversation)
    })
  })

  describe('refreshConversations', () => {
    it('should be an alias for fetchConversations', async () => {
      const mockConversations = [
        { id: 'conv-1', phone: '1234567890', name: 'Test User' }
      ]
      testWhatsAppRepository.setMockData('fetchConversations', mockConversations)

      const { result } = renderWithProviders(() => useConversations())

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

      // Use refreshConversations
      await act(async () => {
        await result.current.refreshConversations()
      })

      await waitFor(() => {
        expect(result.current.loading.conversations).toBe(false)
      }, { timeout: 2000 })

      expect(result.current.conversations).toEqual(mockConversations)
    })
  })
})


















