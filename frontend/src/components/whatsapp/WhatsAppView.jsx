import React, { useEffect, useState, useMemo } from 'react';
import { useWhatsAppConversations } from '../../contexts/WhatsAppConversationsContext';
import { WhatsAppChatList } from './WhatsAppChatList';
import { WhatsAppChat } from './WhatsAppChat';
import { SearchableLayout } from '../SearchableLayout';
import styled from 'styled-components';

/**
 * WhatsApp View Container - BEM: whatsapp-view
 */
const StyledWhatsAppView = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 200px);
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 1px solid ${props => props.theme.colors.border.primary};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.sm};
  position: relative;
`;

/**
 * WhatsApp Content Container - BEM: whatsapp-view__content
 */
const StyledWhatsAppContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

/**
 * Conversation List Container - BEM: whatsapp-view__list-container
 */
const StyledListContainer = styled.div`
  display: ${props => props.$show ? 'flex' : 'none'};
  width: ${props => props.$isMobile ? '100%' : 'auto'};
  position: ${props => props.$isMobile && props.$hasSelection ? 'absolute' : 'relative'};
  z-index: ${props => props.$isMobile && props.$hasSelection ? -1 : 1};
`;

/**
 * Chat Area Container - BEM: whatsapp-view__chat-container
 */
const StyledChatContainer = styled.div`
  display: ${props => props.$show ? 'flex' : 'none'};
  width: ${props => props.$isMobile ? '100%' : 'auto'};
  flex: 1;
`;

/**
 * Toast Notification - BEM: whatsapp-view__toast
 */
const StyledToast = styled.div`
  position: fixed;
  top: ${props => props.$isMobile ? props.theme.spacing.lg : props.theme.spacing.xl};
  left: ${props => props.$isMobile ? props.theme.spacing.lg : 'auto'};
  right: ${props => props.$isMobile ? props.theme.spacing.lg : props.theme.spacing.xl};
  max-width: ${props => props.$isMobile ? 'calc(100% - 32px)' : '400px'};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.status.errorBg};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.status.errorText};
  font-size: ${props => props.theme.fontSize.md};
  z-index: ${props => props.theme.zIndex.toast};
  box-shadow: ${props => props.theme.shadows.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  animation: slideIn ${props => props.theme.transitions.slow} ease-out;
`;

/**
 * Toast Icon - BEM: whatsapp-view__toast-icon
 */
const StyledToastIcon = styled.span`
  font-size: ${props => props.theme.fontSize.xl};
  flex-shrink: 0;
`;

/**
 * Toast Message - BEM: whatsapp-view__toast-message
 */
const StyledToastMessage = styled.span`
  flex: 1;
`;

/**
 * Toast Close Button - BEM: whatsapp-view__toast-close
 */
const StyledToastClose = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.status.errorText};
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.fontSize['2xl']};
  line-height: 1;
  flex-shrink: 0;
  transition: background-color ${props => props.theme.transitions.normal};

  &:hover {
    background-color: ${props => props.theme.colors.status.errorBg};
  }
`;

/**
 * WhatsApp View Component - View principal de conversas
 */
export const WhatsAppView = () => {
  const {
    conversations,
    selectedConversation,
    loading,
    error,
    fetchConversations,
    selectConversation,
    fetchMessages,
    sendMessage,
  } = useWhatsAppConversations();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [toastVisible, setToastVisible] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedConversation && selectedConversation.messages === undefined) {
      // Só carrega mensagens se ainda não tiver mensagens carregadas
      // Usa === undefined para distinguir de array vazio []
      fetchMessages(selectedConversation.id || selectedConversation.phone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation]);

  // Show toast when error appears
  useEffect(() => {
    if (error.conversations) {
      setToastVisible(true);
    }
  }, [error.conversations]);

  const handleCloseToast = () => {
    setToastVisible(false);
  };

  // No mobile: mostra lista OU conversa, nunca os dois juntos
  // Sempre renderiza ambos para evitar problemas de timing com setTimeout
  const showList = isMobile ? !selectedConversation : true;
  const showChat = !isMobile || !!selectedConversation;

  const handleBackToList = () => {
    selectConversation(null);
  };

  // Filter conversations based on search
  const filteredConversations = useMemo(() => {
    return conversations.filter(conv =>
      (conv.name || conv.phone || '').toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [conversations, searchFilter]);

  return (
    <StyledWhatsAppView className="whatsapp-view">
      {/* Toast Notification */}
      {error.conversations && toastVisible && (
        <StyledToast $isMobile={isMobile} className="whatsapp-view__toast">
          <StyledToastIcon className="whatsapp-view__toast-icon">⚠️</StyledToastIcon>
          <StyledToastMessage className="whatsapp-view__toast-message">
            {error.conversations}
          </StyledToastMessage>
          <StyledToastClose
            onClick={handleCloseToast}
            className="whatsapp-view__toast-close"
            aria-label="Fechar"
          >
            ×
          </StyledToastClose>
        </StyledToast>
      )}

      <SearchableLayout
        placeholder="Pesquisar conversas..."
        onSearchChange={setSearchFilter}
        initialSearchValue={searchFilter}
      >
        <StyledWhatsAppContent className="whatsapp-view__content">
          {/* Conversation List */}
          <StyledListContainer
            $show={showList}
            $isMobile={isMobile}
            $hasSelection={!!selectedConversation}
            className="whatsapp-view__list-container"
          >
            <WhatsAppChatList
              conversations={filteredConversations}
              onSelectConversation={selectConversation}
              selectedId={selectedConversation?.id || selectedConversation?.phone}
            />
          </StyledListContainer>

          {/* Chat Area */}
          <StyledChatContainer
            $show={showChat}
            $isMobile={isMobile}
            className="whatsapp-view__chat-container"
          >
            <WhatsAppChat
              conversation={selectedConversation}
              onSendMessage={sendMessage}
              loading={loading.sendMessage}
              onBack={isMobile ? handleBackToList : null}
            />
          </StyledChatContainer>
        </StyledWhatsAppContent>
      </SearchableLayout>
    </StyledWhatsAppView>
  );
};
