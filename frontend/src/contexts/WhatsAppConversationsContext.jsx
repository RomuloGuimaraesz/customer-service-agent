import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { MOCK_DATA } from '../data/mockData';
import { isDemoMode, findConversationById, normalizeConversationId } from '../utils/conversationHelpers';
import { UseCaseFactory } from '../domain/useCaseFactory.js';

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
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState({ conversations: false, messages: false, sendMessage: false });
  const [error, setError] = useState({ conversations: null, messages: null, sendMessage: null });
  const [lastUpdated, setLastUpdated] = useState({ conversations: null });

  // Fetch conversations using Clean Architecture
  const fetchConversations = useCallback(async () => {
    const authHeader = getAuthHeader();

    setLoading(prev => ({ ...prev, conversations: true }));
    setError(prev => ({ ...prev, conversations: null }));

    try {
      const fetchConversationsUseCase = UseCaseFactory.createFetchWhatsAppConversations(authHeader);
      const result = await fetchConversationsUseCase.execute(authHeader);

      if (result.success) {
        setConversations(result.data);
        setLastUpdated(prev => ({ ...prev, conversations: new Date() }));
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(prev => ({ ...prev, conversations: err.message }));
      // Mock data para demonstração em caso de erro (fallback maintained)
      setConversations(MOCK_DATA.conversations);
    } finally {
      setLoading(prev => ({ ...prev, conversations: false }));
    }
  }, [getAuthHeader]);

  // Fetch messages for a conversation using Clean Architecture
  const fetchMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;

    const authHeader = getAuthHeader();
    const demoMode = isDemoMode(authHeader);

    setLoading(prev => ({ ...prev, messages: true }));
    setError(prev => ({ ...prev, messages: null }));

    // Se estiver em modo demo, carrega mensagens mock imediatamente
    if (demoMode) {
      // Buscar conversa para ter contexto e mensagens salvas
      const conversation = findConversationById(conversationId, conversations);

      // Se já tem mensagens salvas na lista, usar elas
      if (conversation?.messages && conversation.messages.length > 0) {
        setSelectedConversation(prev => ({
          ...prev,
          messages: conversation.messages,
        }));
        setLoading(prev => ({ ...prev, messages: false }));
        return;
      }

      // Se não tem mensagens salvas, criar mensagens mock
      const mockMessages = MOCK_DATA.getMockMessages(conversation);

      // Salvar mensagens mock na lista de conversas também
      setConversations(prev => prev.map(conv => {
        if (normalizeConversationId(conv) === conversationId) {
          return {
            ...conv,
            messages: mockMessages,
          };
        }
        return conv;
      }));

      setSelectedConversation(prev => ({
        ...prev,
        messages: mockMessages,
      }));
      setLoading(prev => ({ ...prev, messages: false }));
      return;
    }

    // Usar Clean Architecture para buscar mensagens da API
    try {
      const fetchMessagesUseCase = UseCaseFactory.createFetchWhatsAppMessages(authHeader);
      const result = await fetchMessagesUseCase.execute({ conversationId, authHeader });

      if (result.success) {
        // Atualizar a conversa selecionada com as mensagens
        // Preservar mensagens locais que não estão na API (mensagens enviadas recentemente)
        setSelectedConversation(prev => {
          const apiMessages = result.data;
          const localMessages = prev?.messages || [];

          // Se houver mensagens locais, fazer merge (API primeiro, depois locais que não estão na API)
          if (localMessages.length > 0) {
            const localMessageIds = new Set(localMessages.map(m => m.id));
            const apiMessageIds = new Set(apiMessages.map(m => m.id));

            // Adicionar mensagens locais que não estão na API
            const newLocalMessages = localMessages.filter(m => !apiMessageIds.has(m.id));

            return {
              ...prev,
              messages: [...apiMessages, ...newLocalMessages],
            };
          }

          return {
            ...prev,
            messages: apiMessages,
          };
        });
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(prev => ({ ...prev, messages: err.message }));
      // Mock messages para demonstração em caso de erro
      const conversation = findConversationById(conversationId, conversations);
      const mockMessages = MOCK_DATA.getMockMessages(conversation);

      // Preservar mensagens existentes se houver
      setSelectedConversation(prev => {
        if (prev?.messages && prev.messages.length > 0) {
          // Se já tem mensagens, não sobrescrever
          return prev;
        }
        return {
          ...prev,
          messages: mockMessages,
        };
      });
    } finally {
      setLoading(prev => ({ ...prev, messages: false }));
    }
  }, [getAuthHeader, conversations]);

  // Send message using Clean Architecture
  const sendMessage = useCallback(async (conversationId, messageText) => {
    if (!conversationId || !messageText) return;

    const authHeader = getAuthHeader();
    const demoMode = isDemoMode(authHeader);

    setLoading(prev => ({ ...prev, sendMessage: true }));
    setError(prev => ({ ...prev, sendMessage: null }));

    // Criar mensagem imediatamente para feedback visual
    const newMessage = {
      id: Date.now().toString(),
      body: messageText,
      direction: 'outgoing',
      fromMe: true,
      timestamp: new Date().toISOString(),
    };

    // Adicionar mensagem à conversa imediatamente (modo demo ou enquanto envia)
    setSelectedConversation(prev => ({
      ...prev,
      messages: [...(prev?.messages || []), newMessage],
    }));

    // Atualizar última mensagem na lista E salvar as mensagens na conversa
    setConversations(prev => prev.map(conv => {
      if (normalizeConversationId(conv) === conversationId) {
        return {
          ...conv,
          lastMessage: messageText,
          lastMessageTime: new Date().toISOString(),
          messages: [...(conv.messages || []), newMessage], // Salvar mensagens na lista
        };
      }
      return conv;
    }));

    // Se estiver em modo demo, não tenta enviar para API
    if (demoMode) {
      setLoading(prev => ({ ...prev, sendMessage: false }));
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
        setError(prev => ({ ...prev, sendMessage: result.error }));
      }
      // Se sucesso, a mensagem já foi adicionada acima
    } catch (err) {
      // Em caso de erro na API, a mensagem já foi adicionada localmente
      // Apenas registra o erro silenciosamente para não interromper a experiência
      console.warn('Send message error:', err.message);
      setError(prev => ({ ...prev, sendMessage: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, sendMessage: false }));
    }
  }, [getAuthHeader]);

  // Select conversation
  const selectConversation = useCallback((conversation) => {
    // Se conversation é null, apenas limpar a seleção
    if (!conversation) {
      setSelectedConversation(prev => {
        if (prev && prev.messages && prev.messages.length > 0) {
          // Salvar mensagens na lista de conversas antes de limpar
          const prevId = normalizeConversationId(prev);
          setConversations(convs => convs.map(conv => {
            if (normalizeConversationId(conv) === prevId) {
              return {
                ...conv,
                messages: prev.messages, // Salvar mensagens na lista
              };
            }
            return conv;
          }));
        }
        return null;
      });
      return;
    }

    // Salvar mensagens da conversa atual antes de trocar
    setSelectedConversation(prev => {
      if (prev && prev.messages && prev.messages.length > 0) {
        // Salvar mensagens na lista de conversas antes de trocar
        const prevId = normalizeConversationId(prev);
        setConversations(convs => convs.map(conv => {
          if (normalizeConversationId(conv) === prevId) {
            return {
              ...conv,
              messages: prev.messages, // Salvar mensagens na lista
            };
          }
          return conv;
        }));
      }
      return null; // Limpar seleção temporariamente
    });

    // Buscar conversa salva com mensagens e selecionar
    setConversations(convs => {
      const conversationId = normalizeConversationId(conversation);
      const savedConversation = findConversationById(conversationId, convs);

      // Selecionar nova conversa e restaurar mensagens salvas
      // Se já tiver mensagens salvas, usa elas; senão, deixa undefined para triggerar fetchMessages
      const conversationToSelect = {
        ...conversation,
        messages: savedConversation?.messages || conversation.messages,
      };

      // Usar setTimeout para garantir que o estado anterior foi atualizado
      setTimeout(() => {
        setSelectedConversation(conversationToSelect);
      }, 0);

      return convs; // Retornar lista inalterada
    });
  }, []);

  // Refresh conversations data
  const refreshConversations = useCallback(() => {
    return fetchConversations();
  }, [fetchConversations]);

  const value = {
    conversations,
    selectedConversation,
    loading,
    error,
    lastUpdated,
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
