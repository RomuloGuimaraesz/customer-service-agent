import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'
import { CONFIG } from '../config/constants'

// Mock Supabase
vi.mock('../infrastructure/supabase/config', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
  clearStoredAuthSession: vi.fn(),
}))

import { supabase } from '../infrastructure/supabase/config'

const signedInSession = (overrides = {}) => ({
  access_token: 'mock-token',
  user: {
    id: 'user-123',
    email: 'test@example.com',
    user_metadata: { username: 'test@example.com', role: 'admin' },
    ...overrides,
  },
})

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
    supabase.auth.signInWithPassword.mockReset()
    supabase.auth.signOut.mockReset()
    supabase.auth.getUser.mockReset()
    supabase.auth.getSession.mockReset()
    supabase.auth.onAuthStateChange.mockReset()
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } })
    supabase.auth.onAuthStateChange.mockImplementation(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    }))
  })

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      expect(() => {
        renderHook(() => useAuth())
      }).toThrow('useAuth must be used within AuthProvider')
    })
  })

  describe('initialization', () => {
    it('should start with unauthenticated state', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      })

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.credentials).toEqual({ username: '' })
      expect(result.current.credentials.password).toBeUndefined()

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should restore session from the Supabase auth listener and drop a stored password', async () => {
      sessionStorage.setItem(
        CONFIG.AUTH_STORAGE_KEY,
        JSON.stringify({ username: 'testuser', password: 'testpass' })
      )

      const session = signedInSession({
        id: 'user-123',
        email: 'testuser@example.com',
      })

      supabase.auth.getSession.mockResolvedValue({ data: { session } })
      supabase.auth.onAuthStateChange.mockImplementation((callback) => {
        callback('INITIAL_SESSION', session)
        return { data: { subscription: { unsubscribe: vi.fn() } } }
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.credentials).toEqual({ username: 'testuser@example.com' })
      expect(result.current.credentials.password).toBeUndefined()
      expect(result.current.userId).toBe('user-123')
      expect(result.current.role).toBe('admin')
      expect(result.current.getAuthHeader()).toBe('Bearer mock-token')
      expect(sessionStorage.getItem(CONFIG.AUTH_STORAGE_KEY)).toBeNull()
    })

    it('should wipe legacy sessionStorage without authenticating when there is no Supabase session', async () => {
      sessionStorage.setItem(CONFIG.AUTH_STORAGE_KEY, 'invalid-json')

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isAuthenticated).toBe(false)
      expect(sessionStorage.getItem(CONFIG.AUTH_STORAGE_KEY)).toBeNull()
    })
  })

  describe('login', () => {
    it('should login successfully with valid email credentials without storing the password', async () => {
      supabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: {
            id: 'user-123',
            email: 'test@example.com',
            user_metadata: { username: 'test@example.com', role: 'admin' },
          },
          session: { access_token: 'mock-token' }
        },
        error: null,
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      supabase.auth.getSession.mockResolvedValueOnce({
        data: { session: signedInSession() },
      })

      let loginResult
      await act(async () => {
        loginResult = await result.current.login('test@example.com', 'testpass')
      })

      expect(loginResult.success).toBe(true)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.credentials).toEqual({ username: 'test@example.com' })
      expect(result.current.credentials.password).toBeUndefined()
      expect(sessionStorage.getItem(CONFIG.AUTH_STORAGE_KEY)).toBeNull()
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'testpass',
      })
    })

    it('should reject login with invalid email format', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      let loginResult
      await act(async () => {
        loginResult = await result.current.login('not-an-email', 'password')
      })

      expect(loginResult.success).toBe(false)
      expect(loginResult.error).toBe('Por favor, use seu email para fazer login')
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should reject login with invalid Supabase credentials', async () => {
      supabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' },
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      let loginResult
      await act(async () => {
        loginResult = await result.current.login('test@example.com', 'wrongpass')
      })

      expect(loginResult.success).toBe(false)
      expect(loginResult.error).toBe('Email ou senha inválidos')
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should handle Supabase server errors', async () => {
      supabase.auth.signInWithPassword.mockRejectedValueOnce(
        new Error('Network error')
      )

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      let loginResult
      await act(async () => {
        loginResult = await result.current.login('test@example.com', 'password')
      })

      expect(loginResult.success).toBe(false)
      expect(loginResult.error).toBe('Network error')
    })

  })

  describe('logout', () => {
    it('should clear authentication state and sessionStorage', async () => {
      supabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: { email: 'test@example.com' },
          session: { access_token: 'mock-token' }
        },
        error: null,
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      supabase.auth.getSession.mockResolvedValueOnce({
        data: { session: signedInSession() },
      })

      await act(async () => {
        await result.current.login('test@example.com', 'testpass')
      })

      expect(result.current.isAuthenticated).toBe(true)

      supabase.auth.signOut.mockResolvedValueOnce({ error: null })

      await act(async () => {
        await result.current.logout()
      })

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.credentials).toEqual({ username: '' })
      expect(result.current.getAuthHeader()).toBeNull()
      expect(sessionStorage.getItem(CONFIG.AUTH_STORAGE_KEY)).toBeNull()
      expect(supabase.auth.signOut).toHaveBeenCalled()
    })
  })

  describe('getAuthHeader', () => {
    it('should return null when not authenticated', () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      })

      expect(result.current.getAuthHeader()).toBeNull()
    })

    it('should return a Bearer token when authenticated', async () => {
      supabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: { email: 'user@example.com' },
          session: { access_token: 'mock-token' }
        },
        error: null,
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      supabase.auth.getSession.mockResolvedValueOnce({
        data: {
          session: signedInSession({ email: 'user@example.com' }),
        },
      })

      await act(async () => {
        await result.current.login('user@example.com', 'pass')
      })

      expect(result.current.getAuthHeader()).toBe('Bearer mock-token')
      expect(sessionStorage.getItem(CONFIG.AUTH_STORAGE_KEY)).toBeNull()
    })
  })
})
