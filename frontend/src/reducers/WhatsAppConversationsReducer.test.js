import { describe, it, expect } from 'vitest';
import { WhatsAppConversationsReducer, initialWhatsAppConversationsState, WHATSAPP_CONVERSATIONS_ACTIONS } from './WhatsAppConversationsReducer';

describe('WhatsAppConversationsReducer', () => {
  it('should return initial state', () => {
    expect(WhatsAppConversationsReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialWhatsAppConversationsState);
  });

  describe('FETCH_CONVERSATIONS_* actions', () => {
    it('should handle FETCH_CONVERSATIONS_START', () => {
      const result = WhatsAppConversationsReducer(initialWhatsAppConversationsState, {
        type: WHATSAPP_CONVERSATIONS_ACTIONS.FETCH_CONVERSATIONS_START
      });

      expect(result.loading.conversations).toBe(true);
      expect(result.error.conversations).toBe(null);
    });

    it('should handle FETCH_CONVERSATIONS_SUCCESS', () => {
      const mockConversations = [{ id: '1', phone: '123456789' }];
      const result = WhatsAppConversationsReducer(
        { ...initialWhatsAppConversationsState, loading: { ...initialWhatsAppConversationsState.loading, conversations: true } },
        { type: WHATSAPP_CONVERSATIONS_ACTIONS.FETCH_CONVERSATIONS_SUCCESS, payload: mockConversations }
      );

      expect(result.loading.conversations).toBe(false);
      expect(result.conversations).toEqual(mockConversations);
      expect(result.lastUpdated.conversations).toBeInstanceOf(Date);
      expect(result.error.conversations).toBe(null);
    });

    it('should handle FETCH_CONVERSATIONS_ERROR', () => {
      const errorMessage = 'Failed to fetch conversations';
      const result = WhatsAppConversationsReducer(
        { ...initialWhatsAppConversationsState, loading: { ...initialWhatsAppConversationsState.loading, conversations: true } },
        { type: WHATSAPP_CONVERSATIONS_ACTIONS.FETCH_CONVERSATIONS_ERROR, payload: errorMessage }
      );

      expect(result.loading.conversations).toBe(false);
      expect(result.error.conversations).toBe(errorMessage);
    });
  });

  describe('FETCH_MESSAGES_* actions', () => {
    it('should handle FETCH_MESSAGES_START', () => {
      const result = WhatsAppConversationsReducer(initialWhatsAppConversationsState, {
        type: WHATSAPP_CONVERSATIONS_ACTIONS.FETCH_MESSAGES_START
      });

      expect(result.loading.messages).toBe(true);
      expect(result.error.messages).toBe(null);
    });

    it('should handle FETCH_MESSAGES_SUCCESS', () => {
      const conversationId = '123';
      const mockMessages = [{ id: '1', body: 'Hello' }];
      const initialState = {
        ...initialWhatsAppConversationsState,
        conversations: [{ id: conversationId, messages: [] }],
        selectedConversation: { id: conversationId, messages: [] }
      };

      const result = WhatsAppConversationsReducer(initialState, {
        type: WHATSAPP_CONVERSATIONS_ACTIONS.FETCH_MESSAGES_SUCCESS,
        payload: { conversationId, messages: mockMessages }
      });

      expect(result.loading.messages).toBe(false);
      expect(result.conversations[0].messages).toEqual(mockMessages);
      expect(result.selectedConversation.messages).toEqual(mockMessages);
      expect(result.error.messages).toBe(null);
    });

    it('should handle FETCH_MESSAGES_ERROR', () => {
      const errorMessage = 'Failed to fetch messages';
      const result = WhatsAppConversationsReducer(
        { ...initialWhatsAppConversationsState, loading: { ...initialWhatsAppConversationsState.loading, messages: true } },
        { type: WHATSAPP_CONVERSATIONS_ACTIONS.FETCH_MESSAGES_ERROR, payload: errorMessage }
      );

      expect(result.loading.messages).toBe(false);
      expect(result.error.messages).toBe(errorMessage);
    });
  });

  describe('SEND_MESSAGE_* actions', () => {
    it('should handle SEND_MESSAGE_START', () => {
      const result = WhatsAppConversationsReducer(initialWhatsAppConversationsState, {
        type: WHATSAPP_CONVERSATIONS_ACTIONS.SEND_MESSAGE_START
      });

      expect(result.loading.sendMessage).toBe(true);
      expect(result.error.sendMessage).toBe(null);
    });

    it('should handle SEND_MESSAGE_SUCCESS', () => {
      const conversationId = '123';
      const newMessage = { id: '1', body: 'Hello', direction: 'outgoing' };
      const initialState = {
        ...initialWhatsAppConversationsState,
        conversations: [{ id: conversationId, messages: [] }],
        selectedConversation: { id: conversationId, messages: [] }
      };

      const result = WhatsAppConversationsReducer(initialState, {
        type: WHATSAPP_CONVERSATIONS_ACTIONS.SEND_MESSAGE_SUCCESS,
        payload: { conversationId, message: newMessage }
      });

      expect(result.loading.sendMessage).toBe(false);
      expect(result.conversations[0].messages).toContain(newMessage);
      expect(result.selectedConversation.messages).toContain(newMessage);
      expect(result.conversations[0].lastMessage).toBe('Hello');
      expect(result.error.sendMessage).toBe(null);
    });

    it('should handle SEND_MESSAGE_ERROR', () => {
      const errorMessage = 'Failed to send message';
      const result = WhatsAppConversationsReducer(
        { ...initialWhatsAppConversationsState, loading: { ...initialWhatsAppConversationsState.loading, sendMessage: true } },
        { type: WHATSAPP_CONVERSATIONS_ACTIONS.SEND_MESSAGE_ERROR, payload: errorMessage }
      );

      expect(result.loading.sendMessage).toBe(false);
      expect(result.error.sendMessage).toBe(errorMessage);
    });
  });

  describe('SELECT_CONVERSATION actions', () => {
    it('should handle SELECT_CONVERSATION with null (clear selection)', () => {
      const stateWithSelection = {
        ...initialWhatsAppConversationsState,
        selectedConversation: { id: '123', messages: [] }
      };

      const result = WhatsAppConversationsReducer(stateWithSelection, {
        type: WHATSAPP_CONVERSATIONS_ACTIONS.SELECT_CONVERSATION,
        payload: { conversation: null }
      });

      expect(result.selectedConversation).toBe(null);
    });

    it('should handle SELECT_CONVERSATION with conversation', () => {
      const conversation = { id: '123', phone: '456', messages: [{ id: '1' }] };
      const initialState = {
        ...initialWhatsAppConversationsState,
        conversations: [conversation]
      };

      const result = WhatsAppConversationsReducer(initialState, {
        type: WHATSAPP_CONVERSATIONS_ACTIONS.SELECT_CONVERSATION,
        payload: { conversation }
      });

      expect(result.selectedConversation).toEqual(conversation);
    });
  });

  it('should handle CLEAR_SELECTED_CONVERSATION', () => {
    const stateWithSelection = {
      ...initialWhatsAppConversationsState,
      selectedConversation: { id: '123', messages: [] }
    };

    const result = WhatsAppConversationsReducer(stateWithSelection, {
      type: WHATSAPP_CONVERSATIONS_ACTIONS.CLEAR_SELECTED_CONVERSATION
    });

    expect(result.selectedConversation).toBe(null);
  });

  it('should handle CLEAR_ERROR', () => {
    const stateWithErrors = {
      ...initialWhatsAppConversationsState,
      error: {
        conversations: 'error1',
        messages: 'error2',
        sendMessage: 'error3'
      }
    };

    const result = WhatsAppConversationsReducer(stateWithErrors, {
      type: WHATSAPP_CONVERSATIONS_ACTIONS.CLEAR_ERROR
    });

    expect(result.error.conversations).toBe(null);
    expect(result.error.messages).toBe(null);
    expect(result.error.sendMessage).toBe(null);
  });

  it('should handle RESET_STATE', () => {
    const modifiedState = {
      conversations: [{ id: '1' }],
      selectedConversation: { id: '1' },
      loading: { conversations: true, messages: true, sendMessage: true },
      error: { conversations: 'error', messages: 'error', sendMessage: 'error' },
      lastUpdated: { conversations: new Date() }
    };

    const result = WhatsAppConversationsReducer(modifiedState, {
      type: WHATSAPP_CONVERSATIONS_ACTIONS.RESET_STATE
    });

    expect(result).toEqual(initialWhatsAppConversationsState);
  });
});
