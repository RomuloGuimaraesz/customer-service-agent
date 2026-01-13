import { describe, it, expect } from 'vitest';
import { isDemoMode, normalizeConversationId, findConversationById } from './conversationHelpers';

describe('conversationHelpers', () => {
  describe('isDemoMode', () => {
    it('should return true when authHeader is null', () => {
      expect(isDemoMode(null)).toBe(true);
    });

    it('should return true when authHeader is undefined', () => {
      expect(isDemoMode(undefined)).toBe(true);
    });

    it('should return true when authHeader is empty string', () => {
      expect(isDemoMode('')).toBe(true);
    });

    it('should return false when authHeader is provided', () => {
      expect(isDemoMode('Basic dXNlcjpwYXNz')).toBe(false);
    });
  });

  describe('normalizeConversationId', () => {
    it('should return id when present', () => {
      const conversation = { id: '123', phone: '456' };
      expect(normalizeConversationId(conversation)).toBe('123');
    });

    it('should return phone when id is not present', () => {
      const conversation = { phone: '456' };
      expect(normalizeConversationId(conversation)).toBe('456');
    });

    it('should return null when neither id nor phone is present', () => {
      const conversation = { name: 'Test' };
      expect(normalizeConversationId(conversation)).toBe(null);
    });

    it('should return null when conversation is null', () => {
      expect(normalizeConversationId(null)).toBe(null);
    });

    it('should return null when conversation is undefined', () => {
      expect(normalizeConversationId(undefined)).toBe(null);
    });
  });

  describe('findConversationById', () => {
    const conversations = [
      { id: '123', phone: '123', name: 'Conversation 1' },
      { id: '456', phone: '456', name: 'Conversation 2' },
      { phone: '789', name: 'Conversation 3' },
    ];

    it('should find conversation by id', () => {
      const result = findConversationById('123', conversations);
      expect(result).toEqual({ id: '123', phone: '123', name: 'Conversation 1' });
    });

    it('should find conversation by phone when id matches', () => {
      const result = findConversationById('456', conversations);
      expect(result).toEqual({ id: '456', phone: '456', name: 'Conversation 2' });
    });

    it('should find conversation by phone when no id', () => {
      const result = findConversationById('789', conversations);
      expect(result).toEqual({ phone: '789', name: 'Conversation 3' });
    });

    it('should return undefined when conversation not found', () => {
      const result = findConversationById('999', conversations);
      expect(result).toBeUndefined();
    });

    it('should return undefined when conversationId is null', () => {
      const result = findConversationById(null, conversations);
      expect(result).toBeUndefined();
    });

    it('should return undefined when conversations is not an array', () => {
      const result = findConversationById('123', null);
      expect(result).toBeUndefined();
    });

    it('should return undefined when conversations is empty array', () => {
      const result = findConversationById('123', []);
      expect(result).toBeUndefined();
    });
  });
});







