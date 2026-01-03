import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

/**
 * Chat Container - BEM: whatsapp-chat
 */
const StyledChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
  height: 100%;
  width: 100%;
`;

/**
 * Empty State Container - BEM: whatsapp-chat__empty
 */
const StyledEmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.secondary};
`;

/**
 * Empty State Content - BEM: whatsapp-chat__empty-content
 */
const StyledEmptyStateContent = styled.div`
  text-align: center;
`;

/**
 * Empty State Icon - BEM: whatsapp-chat__empty-icon
 */
const StyledEmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

/**
 * Empty State Text - BEM: whatsapp-chat__empty-text
 */
const StyledEmptyStateText = styled.div`
  font-size: ${props => props.theme.fontSize.xl};
`;

/**
 * Chat Header - BEM: whatsapp-chat__header
 */
const StyledChatHeader = styled.div`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.background.secondary};
  border-bottom: 1px solid ${props => props.theme.colors.border.primary};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

/**
 * Back Button - BEM: whatsapp-chat__back-button
 */
const StyledBackButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  flex-shrink: 0;

  &:hover {
    background-color: ${props => props.theme.colors.background.tertiary};
  }
`;

/**
 * Chat Avatar - BEM: whatsapp-chat__avatar
 */
const StyledChatAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: #1e40af;
  flex-shrink: 0;
`;

/**
 * Chat Contact Info - BEM: whatsapp-chat__contact-info
 */
const StyledChatContactInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

/**
 * Chat Contact Name - BEM: whatsapp-chat__contact-name
 */
const StyledChatContactName = styled.div`
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/**
 * Chat Contact Phone - BEM: whatsapp-chat__contact-phone
 */
const StyledChatContactPhone = styled.div`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/**
 * Messages Area - BEM: whatsapp-chat__messages
 */
const StyledMessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

/**
 * Message Container - BEM: whatsapp-chat__message
 */
const StyledMessageContainer = styled.div`
  display: flex;
  justify-content: ${props => props.isSent ? 'flex-end' : 'flex-start'};
`;

/**
 * Message Bubble - BEM: whatsapp-chat__message-bubble
 */
const StyledMessageBubble = styled.div`
  max-width: 70%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.isSent ? '#dcfce7' : props.theme.colors.background.secondary};
  border: ${props => props.isSent ? 'none' : `1px solid ${props.theme.colors.border.primary}`};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

/**
 * Message Text - BEM: whatsapp-chat__message-text
 */
const StyledMessageText = styled.div`
  font-size: ${props => props.theme.fontSize.base};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
  white-space: pre-wrap;
  word-break: break-word;
`;

/**
 * Message Time - BEM: whatsapp-chat__message-time
 */
const StyledMessageTime = styled.div`
  font-size: ${props => props.theme.fontSize.xs};
  color: ${props => props.theme.colors.text.tertiary};
  text-align: right;
  margin-top: ${props => props.theme.spacing.xs};
`;

/**
 * Empty Messages State - BEM: whatsapp-chat__empty-messages
 */
const StyledEmptyMessages = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.text.tertiary};
  padding: ${props => props.theme.spacing['4xl']} ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.fontSize.base};
`;

/**
 * Input Area - BEM: whatsapp-chat__input-area
 */
const StyledInputArea = styled.div`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.background.secondary};
  border-top: 1px solid ${props => props.theme.colors.border.primary};
`;

/**
 * Input Container - BEM: whatsapp-chat__input-container
 */
const StyledInputContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  align-items: flex-end;
`;

/**
 * Message Textarea - BEM: whatsapp-chat__textarea
 */
const StyledMessageTextarea = styled.textarea`
  flex: 1;
  padding: ${props => props.theme.spacing.base} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.base};
  border: 1px solid ${props => props.theme.colors.border.primary};
  border-radius: 20px;
  background-color: ${props => props.theme.colors.background.tertiary};
  resize: none;
  outline: none;
  min-height: 40px;
  max-height: 120px;
  font-family: inherit;
  color: ${props => props.theme.colors.text.primary};
`;

/**
 * Send Button - BEM: whatsapp-chat__send-button
 */
const StyledSendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: ${props => props.disabled ? '#d1d5db' : props.theme.colors.status.info};
  color: ${props => props.theme.colors.text.light};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color ${props => props.theme.transitions.normal};
`;

/**
 * WhatsApp Chat Component - Interface de chat individual
 */
export const WhatsAppChat = ({ conversation, onSendMessage, loading, onBack }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSend = () => {
    if (message.trim() && !loading) {
      onSendMessage(conversation.id || conversation.phone, message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!conversation) {
    return (
      <StyledChatContainer className="whatsapp-chat">
        <StyledEmptyState className="whatsapp-chat__empty">
          <StyledEmptyStateContent className="whatsapp-chat__empty-content">
            <StyledEmptyStateIcon className="whatsapp-chat__empty-icon">💬</StyledEmptyStateIcon>
            <StyledEmptyStateText className="whatsapp-chat__empty-text">
              Selecione uma conversa para começar
            </StyledEmptyStateText>
          </StyledEmptyStateContent>
        </StyledEmptyState>
      </StyledChatContainer>
    );
  }

  const sendIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.5 2.5L8.75 11.25M17.5 2.5L12.5 17.5L8.75 11.25M17.5 2.5L2.5 7.5L8.75 11.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  const backIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  return (
    <StyledChatContainer className="whatsapp-chat">
      {/* Chat Header */}
      <StyledChatHeader className="whatsapp-chat__header">
        {/* Botão voltar (mobile) */}
        {onBack && (
          <StyledBackButton
            onClick={onBack}
            className="whatsapp-chat__back-button"
            aria-label="Voltar para lista de conversas"
          >
            <div 
              style={{ width: '24px', height: '24px' }} 
              dangerouslySetInnerHTML={{ __html: backIcon }} 
            />
          </StyledBackButton>
        )}
        
        {/* Avatar */}
        <StyledChatAvatar className="whatsapp-chat__avatar">
          {conversation.name?.charAt(0).toUpperCase() || conversation.phone?.charAt(0) || '?'}
        </StyledChatAvatar>
        
        {/* Info do contato */}
        <StyledChatContactInfo className="whatsapp-chat__contact-info">
          <StyledChatContactName className="whatsapp-chat__contact-name">
            {conversation.name || conversation.phone || 'Sem nome'}
          </StyledChatContactName>
          <StyledChatContactPhone className="whatsapp-chat__contact-phone">
            {conversation.phone || 'Número não disponível'}
          </StyledChatContactPhone>
        </StyledChatContactInfo>
      </StyledChatHeader>

      {/* Messages Area */}
      <StyledMessagesArea className="whatsapp-chat__messages">
        {conversation.messages && conversation.messages.length > 0 ? (
          conversation.messages.map((msg, idx) => {
            const isSent = msg.direction === 'outgoing' || msg.fromMe;
            return (
              <StyledMessageContainer
                key={msg.id || idx}
                isSent={isSent}
                className="whatsapp-chat__message"
              >
                <StyledMessageBubble
                  isSent={isSent}
                  className="whatsapp-chat__message-bubble"
                >
                  <StyledMessageText className="whatsapp-chat__message-text">
                    {msg.body || msg.text || msg.message}
                  </StyledMessageText>
                  <StyledMessageTime className="whatsapp-chat__message-time">
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    }) : 'Agora'}
                  </StyledMessageTime>
                </StyledMessageBubble>
              </StyledMessageContainer>
            );
          })
        ) : (
          <StyledEmptyMessages className="whatsapp-chat__empty-messages">
            Nenhuma mensagem ainda
          </StyledEmptyMessages>
        )}
        <div ref={messagesEndRef} />
      </StyledMessagesArea>

      {/* Input Area */}
      <StyledInputArea className="whatsapp-chat__input-area">
        <StyledInputContainer className="whatsapp-chat__input-container">
          <StyledMessageTextarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite uma mensagem..."
            disabled={loading}
            className="whatsapp-chat__textarea"
            rows={1}
          />
          <StyledSendButton
            onClick={handleSend}
            disabled={!message.trim() || loading}
            className="whatsapp-chat__send-button"
          >
            <div style={{
              width: '20px',
              height: '20px',
            }} dangerouslySetInnerHTML={{ __html: sendIcon }} />
          </StyledSendButton>
        </StyledInputContainer>
      </StyledInputArea>
    </StyledChatContainer>
  );
};
