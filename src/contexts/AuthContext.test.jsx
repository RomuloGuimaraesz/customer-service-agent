import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'
import { CONFIG } from '../config/constants'

// Mock fetch globally
global.fetch = vi.fn()

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
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

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.credentials).toEqual(savedCreds)
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
    it('should login successfully with valid credentials', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      let loginResult
      await act(async () => {
        loginResult = await result.current.login('testuser', 'testpass')
      })

      expect(loginResult.success).toBe(true)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.credentials).toEqual({
        username: 'testuser',
        password: 'testpass',
      })
      expect(global.fetch).toHaveBeenCalledWith(
        CONFIG.API_ENDPOINTS.pedidos,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Basic'),
          }),
        })
      )
    })

    it('should reject login with invalid credentials', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      let loginResult
      await act(async () => {
        loginResult = await result.current.login('wrong', 'credentials')
      })

      expect(loginResult.success).toBe(false)
      expect(loginResult.error).toBe('Usuário ou senha inválidos')
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should handle server errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      let loginResult
      await act(async () => {
        loginResult = await result.current.login('user', 'pass')
      })

      expect(loginResult.success).toBe(false)
      expect(loginResult.error).toBe('Erro do servidor: 500')
    })

    it('should allow login in demo mode on network error', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      let loginResult
      await act(async () => {
        loginResult = await result.current.login('user', 'pass')
      })

      expect(loginResult.success).toBe(true)
      expect(loginResult.warning).toBe('API indisponível - modo demonstração')
      expect(result.current.isAuthenticated).toBe(true)
    })
  })

  describe('logout', () => {
    it('should clear authentication state and sessionStorage', async () => {
      const savedCreds = { username: 'testuser', password: 'testpass' }
      sessionStorage.setItem(CONFIG.AUTH_STORAGE_KEY, JSON.stringify(savedCreds))

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isAuthenticated).toBe(true)

      act(() => {
        result.current.logout()
      })

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.credentials).toEqual({ username: '', password: '' })
      expect(sessionStorage.getItem(CONFIG.AUTH_STORAGE_KEY)).toBeNull()
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
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.login('user', 'pass')
      })

      const header = result.current.getAuthHeader()
      expect(header).toMatch(/^Basic /)
      expect(header).toBeTruthy()
    })

    it('should generate correct Basic auth header', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.login('testuser', 'testpass')
      })

      const header = result.current.getAuthHeader()
      const base64 = header.replace('Basic ', '')
      const decoded = atob(base64)
      expect(decoded).toBe('testuser:testpass')
    })
  })
})

