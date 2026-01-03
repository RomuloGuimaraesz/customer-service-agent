import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { CONFIG } from '../config/constants';
import { MOCK_DATA } from '../data/mockData';
import { trackTabClick, startTabSession, endTabSession } from '../services/analytics';
import { fetchApi, fetchApiWithParams } from '../services/apiService';
import { isDemoMode, findConversationById, normalizeConversationId } from '../utils/conversationHelpers';

/**
 * Admin Data Context
 */
const AdminContext = createContext(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const { getAuthHeader, isAuthenticated } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState({ pedidos: false, agendamentos: false });
  const [error, setError] = useState({ pedidos: null, agendamentos: null });
  const [lastUpdated, setLastUpdated] = useState({ pedidos: null, agendamentos: null });
  const [activeTab, setActiveTab] = useState('pedidos');
  const currentSessionRef = useRef(null);
  const tabNames = {
    agendamentos: 'Agendamentos',
    pedidos: 'Pedidos',
    whatsapp: 'WhatsApp',
  };

  // Fetch data with Basic Auth
  const fetchData = useCallback(async (type) => {
    const authHeader = getAuthHeader();
    if (!authHeader) return;

    setLoading(prev => ({ ...prev, [type]: true }));
    setError(prev => ({ ...prev, [type]: null }));

    try {
      const data = await fetchApi(CONFIG.API_ENDPOINTS[type], { authHeader });

      if (type === 'pedidos') {
        setPedidos(Array.isArray(data) ? data : []);
      } else {
        setAgendamentos(Array.isArray(data) ? data : []);
      }

      setLastUpdated(prev => ({ ...prev, [type]: new Date() }));
    } catch (err) {
      setError(prev => ({ ...prev, [type]: err.message }));

      // Load mock data for demo
      if (type === 'pedidos') {
        setPedidos(MOCK_DATA.pedidos);
      } else {
        setAgendamentos(MOCK_DATA.agendamentos);
      }
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  }, [getAuthHeader]);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    const authHeader = getAuthHeader();
    const demoMode = isDemoMode(authHeader);

    setLoading(prev => ({ ...prev, conversations: true }));
    setError(prev => ({ ...prev, conversations: null }));

    // Se estiver em modo demo, carrega conversas mock imediatamente
    if (demoMode) {
      setConversations(MOCK_DATA.conversations);
      setLastUpdated(prev => ({ ...prev, conversations: new Date() }));
      setLoading(prev => ({ ...prev, conversations: false }));
      return;
    }

    // Tentar buscar da API se autenticado
    try {
      const data = await fetchApi(CONFIG.API_ENDPOINTS.conversations, { authHeader });
      setConversations(Array.isArray(data) ? data : []);
      setLastUpdated(prev => ({ ...prev, conversations: new Date() }));
    } catch (err) {
      setError(prev => ({ ...prev, conversations: err.message }));
      // Mock data para demonstração em caso de erro
      setConversations(MOCK_DATA.conversations);
    } finally {
      setLoading(prev => ({ ...prev, conversations: false }));
    }
  }, [getAuthHeader]);

  // Fetch messages for a conversation
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

    // Tentar buscar da API se autenticado
    try {
      const data = await fetchApiWithParams(
        CONFIG.API_ENDPOINTS.messages,
        { conversationId },
        { authHeader }
      );
      
      // Atualizar a conversa selecionada com as mensagens
      // Preservar mensagens locais que não estão na API (mensagens enviadas recentemente)
      setSelectedConversation(prev => {
        const apiMessages = Array.isArray(data) ? data : [];
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

  // Send message
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

    // Tentar enviar para API se autenticado
    try {
      await fetchApi(CONFIG.API_ENDPOINTS.sendMessage, {
        authHeader,
        method: 'POST',
        body: {
          conversationId,
          message: messageText,
        },
      });

      // Se sucesso, a mensagem já foi adicionada acima
    } catch (err) {
      // Em caso de erro na API, a mensagem já foi adicionada localmente
      // Apenas registra o erro silenciosamente para não interromper a experiência
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

  const refreshAll = useCallback(() => {
    if (isAuthenticated) {
      fetchData('pedidos');
      fetchData('agendamentos');
    }
  }, [fetchData, isAuthenticated]);

  // Rastreamento de analytics para mudanças de tab
  useEffect(() => {
    if (activeTab) {
      // Finalizar sessão anterior, se houver
      if (currentSessionRef.current) {
        endTabSession(currentSessionRef.current);
      }
      
      // Registrar clique na tab
      trackTabClick(activeTab, tabNames[activeTab] || activeTab);
      
      // Iniciar nova sessão
      currentSessionRef.current = startTabSession(activeTab, tabNames[activeTab] || activeTab);
    }
    
    // Cleanup: finalizar sessão quando o componente for desmontado ou tab mudar
    return () => {
      if (currentSessionRef.current) {
        endTabSession(currentSessionRef.current);
        currentSessionRef.current = null;
      }
    };
  }, [activeTab]);

  // Finalizar sessão quando o usuário sair ou fechar a página
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentSessionRef.current) {
        endTabSession(currentSessionRef.current);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (currentSessionRef.current) {
        endTabSession(currentSessionRef.current);
      }
    };
  }, []);

  // Initial data fetch when authenticated (no automatic polling)
  useEffect(() => {
    if (isAuthenticated) {
      refreshAll();
    }
  }, [isAuthenticated, refreshAll]);

  const value = {
    pedidos,
    agendamentos,
    conversations,
    selectedConversation,
    loading,
    error,
    lastUpdated,
    activeTab,
    setActiveTab,
    fetchData,
    refreshAll,
    fetchConversations,
    selectConversation,
    fetchMessages,
    sendMessage,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};


