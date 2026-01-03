/**
 * WhatsApp Conversations Reducer - Manages WhatsApp conversations and messages state with useReducer
 * Provides predictable state updates for WhatsApp-related operations
 * Ensures single source of truth with messages stored only in conversations[].messages
 */

// Action Types
export const WHATSAPP_CONVERSATIONS_ACTIONS = {
  FETCH_CONVERSATIONS_START: 'FETCH_CONVERSATIONS_START',
  FETCH_CONVERSATIONS_SUCCESS: 'FETCH_CONVERSATIONS_SUCCESS',
  FETCH_CONVERSATIONS_ERROR: 'FETCH_CONVERSATIONS_ERROR',

  FETCH_MESSAGES_START: 'FETCH_MESSAGES_START',
  FETCH_MESSAGES_SUCCESS: 'FETCH_MESSAGES_SUCCESS',
  FETCH_MESSAGES_ERROR: 'FETCH_MESSAGES_ERROR',

  SEND_MESSAGE_START: 'SEND_MESSAGE_START',
  SEND_MESSAGE_SUCCESS: 'SEND_MESSAGE_SUCCESS',
  SEND_MESSAGE_ERROR: 'SEND_MESSAGE_ERROR',

  SELECT_CONVERSATION: 'SELECT_CONVERSATION',
  CLEAR_SELECTED_CONVERSATION: 'CLEAR_SELECTED_CONVERSATION',

  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE',
};

// Initial State
export const initialWhatsAppConversationsState = {
  conversations: [],
  selectedConversation: null,
  loading: {
    conversations: false,
    messages: false,
    sendMessage: false,
  },
  error: {
    conversations: null,
    messages: null,
    sendMessage: null,
  },
  lastUpdated: {
    conversations: null,
  },
};

/**
 * WhatsApp Conversations Reducer
 * @param {Object} state - Current state
 * @param {Object} action - Action to dispatch
 * @returns {Object} New state
 */
export const WhatsAppConversationsReducer = (state, action) => {
  switch (action.type) {
    case WHATSAPP_CONVERSATIONS_ACTIONS.FETCH_CONVERSATIONS_START:
      return {
        ...state,
        loading: { ...state.loading, conversations: true },
        error: { ...state.error, conversations: null },
      };

    case WHATSAPP_CONVERSATIONS_ACTIONS.FETCH_CONVERSATIONS_SUCCESS:
      return {
        ...state,
        loading: { ...state.loading, conversations: false },
        conversations: action.payload,
        lastUpdated: { ...state.lastUpdated, conversations: new Date() },
        error: { ...state.error, conversations: null },
      };

    case WHATSAPP_CONVERSATIONS_ACTIONS.FETCH_CONVERSATIONS_ERROR:
      return {
        ...state,
        loading: { ...state.loading, conversations: false },
        error: { ...state.error, conversations: action.payload },
      };

    case WHATSAPP_CONVERSATIONS_ACTIONS.FETCH_MESSAGES_START:
      return {
        ...state,
        loading: { ...state.loading, messages: true },
        error: { ...state.error, messages: null },
      };

    case WHATSAPP_CONVERSATIONS_ACTIONS.FETCH_MESSAGES_SUCCESS:
      const { conversationId, messages } = action.payload;
      return {
        ...state,
        loading: { ...state.loading, messages: false },
        conversations: state.conversations.map(conv => {
          if ((conv.id || conv.phone) === conversationId) {
            return { ...conv, messages };
          }
          return conv;
        }),
        selectedConversation: state.selectedConversation?.id === conversationId || state.selectedConversation?.phone === conversationId
          ? { ...state.selectedConversation, messages }
          : state.selectedConversation,
        error: { ...state.error, messages: null },
      };

    case WHATSAPP_CONVERSATIONS_ACTIONS.FETCH_MESSAGES_ERROR:
      return {
        ...state,
        loading: { ...state.loading, messages: false },
        error: { ...state.error, messages: action.payload },
      };

    case WHATSAPP_CONVERSATIONS_ACTIONS.SEND_MESSAGE_START:
      return {
        ...state,
        loading: { ...state.loading, sendMessage: true },
        error: { ...state.error, sendMessage: null },
      };

    case WHATSAPP_CONVERSATIONS_ACTIONS.SEND_MESSAGE_SUCCESS:
      const { conversationId: sendConvId, message } = action.payload;
      return {
        ...state,
        loading: { ...state.loading, sendMessage: false },
        conversations: state.conversations.map(conv => {
          if ((conv.id || conv.phone) === sendConvId) {
            const updatedConv = {
              ...conv,
              messages: [...(conv.messages || []), message],
              lastMessage: message.body,
              lastMessageTime: message.timestamp,
            };
            return updatedConv;
          }
          return conv;
        }),
        selectedConversation: state.selectedConversation?.id === sendConvId || state.selectedConversation?.phone === sendConvId
          ? {
              ...state.selectedConversation,
              messages: [...(state.selectedConversation?.messages || []), message],
            }
          : state.selectedConversation,
        error: { ...state.error, sendMessage: null },
      };

    case WHATSAPP_CONVERSATIONS_ACTIONS.SEND_MESSAGE_ERROR:
      return {
        ...state,
        loading: { ...state.loading, sendMessage: false },
        error: { ...state.error, sendMessage: action.payload },
      };

    case WHATSAPP_CONVERSATIONS_ACTIONS.SELECT_CONVERSATION:
      const { conversation } = action.payload;
      if (!conversation) {
        return {
          ...state,
          selectedConversation: null,
        };
      }

      // Find the conversation in the list to ensure we have the latest messages
      const conversationFromList = state.conversations.find(conv =>
        (conv.id || conv.phone) === (conversation.id || conversation.phone)
      );

      return {
        ...state,
        selectedConversation: conversationFromList || conversation,
      };

    case WHATSAPP_CONVERSATIONS_ACTIONS.CLEAR_SELECTED_CONVERSATION:
      return {
        ...state,
        selectedConversation: null,
      };

    case WHATSAPP_CONVERSATIONS_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: {
          conversations: null,
          messages: null,
          sendMessage: null,
        },
      };

    case WHATSAPP_CONVERSATIONS_ACTIONS.RESET_STATE:
      return initialWhatsAppConversationsState;

    default:
      return state || initialWhatsAppConversationsState;
  }
};
