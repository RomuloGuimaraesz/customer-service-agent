import { describe, it, expect, beforeEach, vi } from 'vitest';
import { buildHeaders, isDemoMode, fetchApi, fetchApiWithParams } from './apiService';

// Mock fetch globally
global.fetch = vi.fn();

describe('apiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('buildHeaders', () => {
    it('should build headers with Content-Type', () => {
      const headers = buildHeaders(null);
      expect(headers).toEqual({
        'Content-Type': 'application/json',
      });
    });

    it('should include Authorization header when authHeader is provided', () => {
      const authHeader = 'Basic dXNlcjpwYXNz';
      const headers = buildHeaders(authHeader);
      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      });
    });
  });

  describe('isDemoMode', () => {
    it('should return true when authHeader is null', () => {
      expect(isDemoMode(null)).toBe(true);
    });

    it('should return true when authHeader is undefined', () => {
      expect(isDemoMode(undefined)).toBe(true);
    });

    it('should return false when authHeader is provided', () => {
      expect(isDemoMode('Basic dXNlcjpwYXNz')).toBe(false);
    });
  });

  describe('fetchApi', () => {
    it('should fetch data successfully with GET method', async () => {
      const mockData = { id: 1, name: 'Test' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await fetchApi('https://api.example.com/data', {
        authHeader: 'Basic dXNlcjpwYXNz',
      });

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/data',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic dXNlcjpwYXNz',
          },
        })
      );
    });

    it('should fetch data with POST method and body', async () => {
      const mockData = { success: true };
      const requestBody = { name: 'Test', value: 123 };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await fetchApi('https://api.example.com/data', {
        authHeader: 'Basic dXNlcjpwYXNz',
        method: 'POST',
        body: requestBody,
      });

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/data',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic dXNlcjpwYXNz',
          },
          body: JSON.stringify(requestBody),
        })
      );
    });

    it('should throw error on 401 unauthorized', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      await expect(
        fetchApi('https://api.example.com/data', {
          authHeader: 'Basic dXNlcjpwYXNz',
        })
      ).rejects.toThrow('Não autorizado - verifique suas credenciais');
    });

    it('should throw error on other HTTP errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(
        fetchApi('https://api.example.com/data', {
          authHeader: 'Basic dXNlcjpwYXNz',
        })
      ).rejects.toThrow('HTTP 500');
    });

    it('should throw error on invalid JSON response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(
        fetchApi('https://api.example.com/data', {
          authHeader: 'Basic dXNlcjpwYXNz',
        })
      ).rejects.toThrow('Invalid JSON response');
    });

    it('should work without authHeader', async () => {
      const mockData = { id: 1 };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await fetchApi('https://api.example.com/data');

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/data',
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });
  });

  describe('fetchApiWithParams', () => {
    it('should build URL with query parameters', async () => {
      const mockData = { results: [] };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await fetchApiWithParams(
        'https://api.example.com/messages',
        { conversationId: '123', limit: 50 },
        { authHeader: 'Basic dXNlcjpwYXNz' }
      );

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/messages?conversationId=123&limit=50',
        expect.any(Object)
      );
    });

    it('should handle empty params object', async () => {
      const mockData = { results: [] };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await fetchApiWithParams(
        'https://api.example.com/data',
        {},
        { authHeader: 'Basic dXNlcjpwYXNz' }
      );

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/data?',
        expect.any(Object)
      );
    });
  });
});







