/**
 * @fileoverview WhatsApp Conversation API Repository implementation
 */

import { WhatsAppConversationRepository } from '../../domain/repositores/WhatsAppConversationRepository.js';
import { WhatsAppConversation } from '../../domain/entities/WhatsAppConversation.js';
import { WhatsAppMessage } from '../../domain/entities/WhatsAppMessage.js';
import { CONFIG } from '../../config/constants.js';
import { fetchApi, fetchApiWithParams } from '../../services/apiService.js';

/**
 * WhatsApp Conversation API Repository
 * Implements WhatsAppConversationRepository interface using API calls
 */
export class WhatsAppConversationApiRepository extends WhatsAppConversationRepository {
  /**
   * Fetches all conversations from API
   * @param {string} [authHeader] - Authorization header
   * @returns {Promise<WhatsAppConversation[]>} Array of conversation entities
   */
  async fetchConversations(authHeader = null) {
    try {
      const data = await fetchApi(CONFIG.API_ENDPOINTS.conversations, { authHeader });

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format: expected array of conversations');
      }

      return data.map(item => new WhatsAppConversation(item));
    } catch (error) {
      throw new Error(`Failed to fetch conversations: ${error.message}`);
    }
  }

  /**
   * Finds a conversation by ID
   * @param {string} conversationId - Conversation ID
   * @param {string} [authHeader] - Authorization header
   * @returns {Promise<WhatsAppConversation|null>} Conversation entity or null if not found
   */
  async findConversationById(conversationId, authHeader = null) {
    if (!conversationId) {
      throw new Error('Conversation ID is required');
    }

    try {
      const conversations = await this.fetchConversations(authHeader);
      return conversations.find(conv =>
        conv.getConversationId() === conversationId ||
        conv.id === conversationId ||
        conv.phone === conversationId
      ) || null;
    } catch (error) {
      throw new Error(`Failed to find conversation by ID: ${error.message}`);
    }
  }

  /**
   * Fetches messages for a specific conversation
   * @param {string} conversationId - Conversation ID
   * @param {string} [authHeader] - Authorization header
   * @returns {Promise<WhatsAppMessage[]>} Array of message entities
   */
  async fetchMessages(conversationId, authHeader = null) {
    if (!conversationId) {
      throw new Error('Conversation ID is required');
    }

    try {
      const data = await fetchApiWithParams(CONFIG.API_ENDPOINTS.messages,
        { conversationId },
        { authHeader }
      );

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format: expected array of messages');
      }

      return data.map(item => new WhatsAppMessage(item));
    } catch (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }
  }

  /**
   * Sends a message to a conversation
   * @param {string} conversationId - Conversation ID
   * @param {string} messageText - Message content
   * @param {string} [authHeader] - Authorization header
   * @returns {Promise<WhatsAppMessage>} The sent message entity
   */
  async sendMessage(conversationId, messageText, authHeader = null) {
    if (!conversationId) {
      throw new Error('Conversation ID is required');
    }
    if (!messageText || messageText.trim() === '') {
      throw new Error('Message text is required');
    }

    try {
      const data = await fetchApi(CONFIG.API_ENDPOINTS.sendMessage, {
        authHeader,
        method: 'POST',
        body: {
          conversationId,
          message: messageText.trim()
        }
      });

      return new WhatsAppMessage(data);
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  /**
   * Creates a new conversation
   * @param {WhatsAppConversation} conversation - Conversation entity to create
   * @param {string} [authHeader] - Authorization header
   * @returns {Promise<WhatsAppConversation>} Created conversation entity
   */
  async createConversation(conversation, authHeader = null) {
    if (!conversation) {
      throw new Error('Conversation entity is required');
    }

    try {
      const data = await fetchApi(CONFIG.API_ENDPOINTS.conversations, {
        authHeader,
        method: 'POST',
        body: {
          id: conversation.id,
          phone: conversation.phone,
          name: conversation.name,
          lastMessage: conversation.lastMessage,
          lastMessageTime: conversation.lastMessageTime,
          unreadCount: conversation.unreadCount
        }
      });

      return new WhatsAppConversation(data);
    } catch (error) {
      throw new Error(`Failed to create conversation: ${error.message}`);
    }
  }

  /**
   * Updates an existing conversation
   * @param {WhatsAppConversation} conversation - Conversation entity with updated data
   * @param {string} [authHeader] - Authorization header
   * @returns {Promise<WhatsAppConversation>} Updated conversation entity
   */
  async updateConversation(conversation, authHeader = null) {
    if (!conversation || !conversation.id) {
      throw new Error('Conversation entity with ID is required');
    }

    try {
      const data = await fetchApi(`${CONFIG.API_ENDPOINTS.conversations}/${conversation.id}`, {
        authHeader,
        method: 'PUT',
        body: {
          phone: conversation.phone,
          name: conversation.name,
          lastMessage: conversation.lastMessage,
          lastMessageTime: conversation.lastMessageTime,
          unreadCount: conversation.unreadCount
        }
      });

      return new WhatsAppConversation(data);
    } catch (error) {
      throw new Error(`Failed to update conversation: ${error.message}`);
    }
  }

  /**
   * Marks messages in a conversation as read
   * @param {string} conversationId - Conversation ID
   * @param {string} [authHeader] - Authorization header
   * @returns {Promise<boolean>} True if operation was successful
   */
  async markConversationAsRead(conversationId, authHeader = null) {
    if (!conversationId) {
      throw new Error('Conversation ID is required');
    }

    try {
      await fetchApi(`${CONFIG.API_ENDPOINTS.conversations}/${conversationId}/read`, {
        authHeader,
        method: 'POST'
      });

      return true;
    } catch (error) {
      throw new Error(`Failed to mark conversation as read: ${error.message}`);
    }
  }
}

















