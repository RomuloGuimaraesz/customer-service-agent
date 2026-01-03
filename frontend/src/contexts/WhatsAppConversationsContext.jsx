import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { MOCK_DATA } from '../data/mockData';
import { isDemoMode, findConversationById, normalizeConversationId } from '../utils/conversationHelpers';
import { UseCaseFactory } from '../domain/useCaseFactory.js';
import { WhatsAppConversationsReducer, initialWhatsAppConversationsState, WHATSAPP_CONVERSATIONS_ACTIONS } from '../reducers/WhatsAppConversationsReducer';

/**
 * WhatsApp Conversations Context - Focused context for WhatsApp conversations and messages
 */
const WhatsAppConversationsContext = createContext(null);

export const useWhatsAppConversations = () => {
  const context = useContext(WhatsAppConversationsContext);
  if (!context) {
    throw new Error('useWhatsAppConversations must be used within WhatsAppConversationsProvider');
  }
  return context;
};

export const WhatsAppConversationsProvider = ({ children }) => {
  const { getAuthHeader } = useAuth();
  const [state, dispatch] = useReducer(WhatsAppConversationsReducer, initialWhatsAppConversationsState);

  // Fetch conversations using Clean Architecture
  const fetchConversations = useCallback(async () => {
    const authHeader = getAuthHeader();

    dispatch({ type: WHATSAPP_CONVERSATIONS_ACTIONS.FETCH_CONVERSATIONS_START });

    try {
      const fetchConversationsUseCase = UseCaseFactory.createFetchWhatsAppConversations(authHeader);
      const result = await fetchConversationsUseCase.execute(authHeader);

      if (result.success) {
        dispatch({ type: WHATSAPP_CONVERSATIONS_ACTIONS.FETCH_CONVERSATIONS_SUCCESS, payload: result.data });
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      dispatch({ type: WHATSAPP_CONVERSATIONS_ACTIONS.FETCH_CONVERSATIONS_ERROR, payload: err.message });
      // Mock data para demonstração em caso de erro (fallback maintained)
      dispatch({ type: WHATSAPP_CONVERSATIONS_ACTIONS.FETCH_CONVERSATIONS_SUCCESS, payload: MOCK_DATA.conversations });
    }
  }, [getAuthHeader]);

  // Fetch messages for a conversation using Clean Architecture
  const fetchMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;

    const authHeader = getAuthHeader();
    const demoMode = isDemoMode(authHeader);

    dispatch({ type: WHATSAPP_CONVERSATIONS_ACTIONS.FETCH_MESSAGES_START });

    // Se estiver em modo demo, carrega mensagens mock imediatamente
    if (demoMode) {
      // Buscar conversa para ter contexto e mensagens salvas
      const conversation = findConversationById(conversationId, state.conversations);

      // Se já tem mensagens salvas na lista, usar elas
      if (conversation?.messages && conversation.messages.length > 0) {
        dispatch({
          type: WHATSAPP_CONVERSATIONS_ACTIONS.FETCH_MESSAGES_SUCCESS,
          payload: { conversationId, messages: conversation.messages }
        });
        return;
      }

      // Se não tem mensagens salvas, criar mensagens mock
      const mockMessages = MOCK_DATA.getMockMessages(conversation);

      dispatch({
        type: WHATSAPP_CONVERSATIONS_ACTIONS.FETCH_MESSAGES_SUCCESS,
        payload: { conversationId, messages: mockMessages }
      });
      return;
    }

    // Usar Clean Architecture para buscar mensagens da API
    try {
      const fetchMessagesUseCase = UseCaseFactory.createFetchWhatsAppMessages(authHeader);
      const result = await fetchMessagesUseCase.execute({ conversationId, authHeader });

      if (result.success) {
        // Atualizar a conversa selecionada com as mensagens
        // Preservar mensagens locais que não estão na API (mensagens enviadas recentemente)
        const apiMessages = result.data;
        const localMessages = state.selectedConversation?.messages || [];

        // Se houver mensagens locais, fazer merge (API primeiro, depois locais que não estão na API)
        let finalMessages = apiMessages;
        if (localMessages.length > 0) {
          const localMessageIds = new Set(localMessages.map(m => m.id));
          const apiMessageIds = new Set(apiMessages.map(m => m.id));

          // Adicionar mensagens locais que não estão na API
          const newLocalMessages = localMessages.filter(m => !apiMessageIds.has(m.id));

          finalMessages = [...apiMessages, ...newLocalMessages];
        }

        dispatch({
          type: WHATSAPP_CONVERSATIONS_ACTIONS.FETCH_MESSAGES_SUCCESS,
          payload: { conversationId, messages: finalMessages }
        });
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      dispatch({ type: WHATSAPP_CONVERSATIONS_ACTIONS.FETCH_MESSAGES_ERROR, payload: err.message });
      // Mock messages para demonstração em caso de erro
      const conversation = findConversationById(conversationId, state.conversations);
      const mockMessages = MOCK_DATA.getMockMessages(conversation);

      // Preservar mensagens existentes se houver
      const currentMessages = state.selectedConversation?.messages || [];
      const messagesToUse = currentMessages.length > 0 ? currentMessages : mockMessages;

      dispatch({
        type: WHATSAPP_CONVERSATIONS_ACTIONS.FETCH_MESSAGES_SUCCESS,
        payload: { conversationId, messages: messagesToUse }
      });
    }
  }, [getAuthHeader, state.conversations, state.selectedConversation?.messages]);

  // Send message using Clean Architecture
  const sendMessage = useCallback(async (conversationId, messageText) => {
    if (!conversationId || !messageText) return;

    const authHeader = getAuthHeader();
    const demoMode = isDemoMode(authHeader);

    dispatch({ type: WHATSAPP_CONVERSATIONS_ACTIONS.SEND_MESSAGE_START });

    // Criar mensagem imediatamente para feedback visual
    const newMessage = {
      id: Date.now().toString(),
      body: messageText,
      direction: 'outgoing',
      fromMe: true,
      timestamp: new Date().toISOString(),
    };

    // Adicionar mensagem à conversa imediatamente (modo demo ou enquanto envia)
    dispatch({
      type: WHATSAPP_CONVERSATIONS_ACTIONS.SEND_MESSAGE_SUCCESS,
      payload: { conversationId, message: newMessage }
    });

    // Se estiver em modo demo, não tenta enviar para API
    if (demoMode) {
      return;
    }

    // Usar Clean Architecture para enviar mensagem via API
    try {
      const sendMessageUseCase = UseCaseFactory.createSendWhatsAppMessage(authHeader);
      const result = await sendMessageUseCase.execute({
        conversationId,
        messageText,
        authHeader
      });

      if (!result.success) {
        // Log error but don't interrupt user experience
        console.warn('Send message failed:', result.error);
        dispatch({ type: WHATSAPP_CONVERSATIONS_ACTIONS.SEND_MESSAGE_ERROR, payload: result.error });
      }
      // Se sucesso, a mensagem já foi adicionada acima
    } catch (err) {
      // Em caso de erro na API, a mensagem já foi adicionada localmente
      // Apenas registra o erro silenciosamente para não interromper a experiência
      console.warn('Send message error:', err.message);
      dispatch({ type: WHATSAPP_CONVERSATIONS_ACTIONS.SEND_MESSAGE_ERROR, payload: err.message });
    }
  }, [getAuthHeader]);

  // Select conversation
  const selectConversation = useCallback((conversation) => {
    dispatch({
      type: WHATSAPP_CONVERSATIONS_ACTIONS.SELECT_CONVERSATION,
      payload: { conversation }
    });
  }, []);

  // Refresh conversations data
  const refreshConversations = useCallback(() => {
    return fetchConversations();
  }, [fetchConversations]);

  const value = {
    conversations: state.conversations,
    selectedConversation: state.selectedConversation,
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    fetchConversations,
    refreshConversations,
    selectConversation,
    fetchMessages,
    sendMessage,
  };

  return (
    <WhatsAppConversationsContext.Provider value={value}>
      {children}
    </WhatsAppConversationsContext.Provider>
  );
};
