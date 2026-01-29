/**
 * @fileoverview WhatsApp Conversation Repository interface for data persistence operations
 */

import { WhatsAppConversation } from '../entities/WhatsAppConversation.js';
import { WhatsAppMessage } from '../entities/WhatsAppMessage.js';

/**
 * WhatsApp Conversation Repository interface
 *
 * @interface
 * @classdesc Defines the contract for WhatsApp conversation and message data persistence operations
 */
export class WhatsAppConversationRepository {
  /**
   * Fetches all WhatsApp conversations
   *
   * @param {string} [authHeader] - Optional authorization header for API requests
   * @returns {Promise<WhatsAppConversation[]>} Array of conversation entities
   * @throws {Error} If fetching fails
   */
  async fetchConversations(authHeader = null) {
    throw new Error('fetchConversations() must be implemented by concrete repository');
  }

  /**
   * Finds a conversation by ID
   *
   * @param {string} conversationId - Conversation ID (phone number)
   * @param {string} [authHeader] - Optional authorization header
   * @returns {Promise<WhatsAppConversation|null>} Conversation entity or null if not found
   */
  async findConversationById(conversationId, authHeader = null) {
    throw new Error('findConversationById() must be implemented by concrete repository');
  }

  /**
   * Fetches messages for a specific conversation
   *
   * @param {string} conversationId - Conversation ID
   * @param {string} [authHeader] - Optional authorization header
   * @returns {Promise<WhatsAppMessage[]>} Array of message entities
   * @throws {Error} If fetching fails
   */
  async fetchMessages(conversationId, authHeader = null) {
    throw new Error('fetchMessages() must be implemented by concrete repository');
  }

  /**
   * Sends a message to a conversation
   *
   * @param {string} conversationId - Conversation ID
   * @param {string} messageText - Message content
   * @param {string} [authHeader] - Optional authorization header
   * @returns {Promise<WhatsAppMessage>} The sent message entity
   * @throws {Error} If sending fails
   */
  async sendMessage(conversationId, messageText, authHeader = null) {
    throw new Error('sendMessage() must be implemented by concrete repository');
  }

  /**
   * Creates a new conversation
   *
   * @param {WhatsAppConversation} conversation - Conversation entity to create
   * @param {string} [authHeader] - Optional authorization header
   * @returns {Promise<WhatsAppConversation>} The created conversation entity
   * @throws {Error} If creation fails
   */
  async createConversation(conversation, authHeader = null) {
    throw new Error('createConversation() must be implemented by concrete repository');
  }

  /**
   * Updates an existing conversation
   *
   * @param {WhatsAppConversation} conversation - Conversation entity with updated data
   * @param {string} [authHeader] - Optional authorization header
   * @returns {Promise<WhatsAppConversation>} Updated conversation entity
   * @throws {Error} If update fails
   */
  async updateConversation(conversation, authHeader = null) {
    throw new Error('updateConversation() must be implemented by concrete repository');
  }

  /**
   * Marks messages in a conversation as read
   *
   * @param {string} conversationId - Conversation ID
   * @param {string} [authHeader] - Optional authorization header
   * @returns {Promise<boolean>} True if operation was successful
   * @throws {Error} If operation fails
   */
  async markConversationAsRead(conversationId, authHeader = null) {
    throw new Error('markConversationAsRead() must be implemented by concrete repository');
  }
}

















