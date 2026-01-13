import React from 'react';
import styled from 'styled-components';

/**
 * Chat List Container - BEM: whatsapp-chat-list
 */
const StyledChatListContainer = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: ${props => props.theme.colors.background.secondary};
  border-right: 1px solid ${props => props.theme.colors.border.primary};
  display: flex;
  flex-direction: column;
  height: 100%;
`;

/**
 * Chat List Header - BEM: whatsapp-chat-list__header
 */
const StyledChatListHeader = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border.primary};
`;

/**
 * Chat List Title - BEM: whatsapp-chat-list__title
 */
const StyledChatListTitle = styled.h2`
  font-size: ${props => props.theme.fontSize['3xl']};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

/**
 * Conversations List - BEM: whatsapp-chat-list__conversations
 */
const StyledConversationsList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

/**
 * Empty State - BEM: whatsapp-chat-list__empty
 */
const StyledEmptyState = styled.div`
  padding: ${props => props.theme.spacing['4xl']} ${props => props.theme.spacing.xl};
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fontSize.base};
`;

/**
 * Conversation Item - BEM: whatsapp-chat-list__item
 */
const StyledConversationItem = styled.div`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.background.tertiary};
  cursor: pointer;
  background-color: ${props => props.selected 
    ? props.theme.colors.status.infoBg 
    : props.theme.colors.background.secondary};
  transition: background-color ${props => props.theme.transitions.normal};

  &:hover {
    background-color: ${props => props.selected 
      ? props.theme.colors.status.infoBg 
      : props.theme.colors.background.tertiary};
  }
`;

/**
 * Conversation Content - BEM: whatsapp-chat-list__item-content
 */
const StyledConversationContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

/**
 * Avatar - BEM: whatsapp-chat-list__avatar
 */
const StyledAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: #1e40af;
  flex-shrink: 0;
`;

/**
 * Conversation Info - BEM: whatsapp-chat-list__item-info
 */
const StyledConversationInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

/**
 * Conversation Name - BEM: whatsapp-chat-list__item-name
 */
const StyledConversationName = styled.div`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/**
 * Conversation Last Message - BEM: whatsapp-chat-list__item-last-message
 */
const StyledConversationLastMessage = styled.div`
  font-size: ${props => props.theme.fontSize.md};
  color: ${props => props.theme.colors.text.secondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/**
 * Conversation Meta - BEM: whatsapp-chat-list__item-meta
 */
const StyledConversationMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${props => props.theme.spacing.xs};
`;

/**
 * Conversation Time - BEM: whatsapp-chat-list__item-time
 */
const StyledConversationTime = styled.div`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text.tertiary};
`;

/**
 * Unread Badge - BEM: whatsapp-chat-list__unread-badge
 */
const StyledUnreadBadge = styled.div`
  background-color: ${props => props.theme.colors.status.info};
  color: ${props => props.theme.colors.text.light};
  border-radius: 10px;
  padding: 2px ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.fontSize.xs};
  font-weight: ${props => props.theme.fontWeight.semibold};
  min-width: 20px;
  text-align: center;
`;

/**
 * WhatsApp Chat List Component - Lista de conversas do WhatsApp
 * Receives filtered conversations as prop (filtering handled by parent)
 */
export const WhatsAppChatList = ({ conversations, onSelectConversation, selectedId }) => {
  return (
    <StyledChatListContainer className="whatsapp-chat-list">
      {/* Header */}
      <StyledChatListHeader className="whatsapp-chat-list__header">
        <StyledChatListTitle className="whatsapp-chat-list__title">
          Conversas
        </StyledChatListTitle>
      </StyledChatListHeader>

      {/* Conversations List */}
      <StyledConversationsList className="whatsapp-chat-list__conversations">
        {conversations.length === 0 ? (
          <StyledEmptyState className="whatsapp-chat-list__empty">
            Nenhuma conversa encontrada
          </StyledEmptyState>
        ) : (
          conversations.map((conversation) => {
            const isSelected = selectedId === (conversation.id || conversation.phone);
            return (
              <StyledConversationItem
                key={conversation.id || conversation.phone}
                onClick={() => onSelectConversation(conversation)}
                selected={isSelected}
                className="whatsapp-chat-list__item"
              >
                <StyledConversationContent className="whatsapp-chat-list__item-content">
                  {/* Avatar */}
                  <StyledAvatar className="whatsapp-chat-list__avatar">
                    {conversation.name?.charAt(0).toUpperCase() || conversation.phone?.charAt(0) || '?'}
                  </StyledAvatar>

                  {/* Info */}
                  <StyledConversationInfo className="whatsapp-chat-list__item-info">
                    <StyledConversationName className="whatsapp-chat-list__item-name">
                      {conversation.name || conversation.phone || 'Sem nome'}
                    </StyledConversationName>
                    <StyledConversationLastMessage className="whatsapp-chat-list__item-last-message">
                      {conversation.lastMessage || 'Nenhuma mensagem'}
                    </StyledConversationLastMessage>
                  </StyledConversationInfo>

                  {/* Time/Badge */}
                  <StyledConversationMeta className="whatsapp-chat-list__item-meta">
                    {conversation.lastMessageTime && (
                      <StyledConversationTime className="whatsapp-chat-list__item-time">
                        {new Date(conversation.lastMessageTime).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </StyledConversationTime>
                    )}
                    {conversation.unreadCount > 0 && (
                      <StyledUnreadBadge className="whatsapp-chat-list__unread-badge">
                        {conversation.unreadCount}
                      </StyledUnreadBadge>
                    )}
                  </StyledConversationMeta>
                </StyledConversationContent>
              </StyledConversationItem>
            );
          })
        )}
      </StyledConversationsList>
    </StyledChatListContainer>
  );
};
