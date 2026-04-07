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
    },
  },
}))

import { supabase } from '../infrastructure/supabase/config'

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
    // Reset Supabase mocks
    supabase.auth.signInWithPassword.mockReset()
    supabase.auth.signOut.mockReset()
    supabase.auth.getUser?.mockReset?.()
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

      // Initially loading should be true, then false after effect runs
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.credentials).toEqual({ username: '', password: '' })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should restore session from sessionStorage', async () => {
      const savedCreds = { username: 'testuser', password: 'testpass' }
      sessionStorage.setItem(CONFIG.AUTH_STORAGE_KEY, JSON.stringify(savedCreds))

      supabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123', user_metadata: { role: 'admin' } } },
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.credentials).toEqual(savedCreds)
      expect(result.current.userId).toBe('user-123')
      expect(result.current.role).toBe('admin')
    })

    it('should handle corrupted sessionStorage data', async () => {
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
    it('should login successfully with valid email credentials', async () => {
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

      supabase.auth.getUser.mockResolvedValueOnce({
        data: {
          user: {
            id: 'user-123',
            user_metadata: { role: 'admin' },
          },
        },
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      let loginResult
      await act(async () => {
        loginResult = await result.current.login('test@example.com', 'testpass')
      })

      expect(loginResult.success).toBe(true)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.credentials).toEqual({
        username: 'test@example.com',
        password: 'testpass',
      })
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

      // Login first
      await act(async () => {
        await result.current.login('test@example.com', 'testpass')
      })

      expect(result.current.isAuthenticated).toBe(true)

      // Mock signOut
      supabase.auth.signOut.mockResolvedValueOnce({ error: null })

      await act(async () => {
        await result.current.logout()
      })

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.credentials).toEqual({ username: '', password: '' })
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

    it('should return Basic auth header when authenticated', async () => {
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

      await act(async () => {
        await result.current.login('user@example.com', 'pass')
      })

      const header = result.current.getAuthHeader()
      expect(header).toMatch(/^Basic /)
      expect(header).toBeTruthy()
    })

    it('should generate correct Basic auth header', async () => {
      supabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: { email: 'testuser@example.com' },
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

      await act(async () => {
        await result.current.login('testuser@example.com', 'testpass')
      })

      const header = result.current.getAuthHeader()
      const base64 = header.replace('Basic ', '')
      const decoded = atob(base64)
      expect(decoded).toBe('testuser@example.com:testpass')
    })
  })
})

