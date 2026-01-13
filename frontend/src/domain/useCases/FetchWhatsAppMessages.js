/**
 * @fileoverview FetchWhatsAppMessages use case - handles fetching WhatsApp messages business logic
 */

/**
 * FetchWhatsAppMessages Use Case
 *
 * @class
 * @classdesc Handles the business logic for fetching WhatsApp messages for a conversation
 */
export class FetchWhatsAppMessages {
  /**
   * Creates a new FetchWhatsAppMessages use case instance
   *
   * @param {Object} dependencies - Use case dependencies
   * @param {WhatsAppConversationRepository} dependencies.whatsAppConversationRepository - Repository for WhatsApp conversation data operations
   */
  constructor({ whatsAppConversationRepository }) {
    /**
     * @type {WhatsAppConversationRepository}
     * @private
     */
    this._whatsAppConversationRepository = whatsAppConversationRepository;

    if (!this._whatsAppConversationRepository) {
      throw new Error('WhatsAppConversationRepository is required');
    }
  }

  /**
   * Executes the fetch WhatsApp messages use case
   *
   * @param {Object} params - Parameters for fetching messages
   * @param {string} params.conversationId - Conversation ID to fetch messages for
   * @param {string} [params.authHeader] - Optional authorization header
   * @returns {Promise<UseCaseResult>} Result object with success status and messages data or error
   */
  async execute({ conversationId, authHeader = null }) {
    try {
      // Validate conversation ID
      if (!conversationId) {
        return {
          success: false,
          data: null,
          error: 'ID da conversa é obrigatório',
        };
      }

      const messages = await this._whatsAppConversationRepository.fetchMessages(conversationId, authHeader);

      return {
        success: true,
        data: messages,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Falha ao buscar mensagens do WhatsApp',
      };
    }
  }
}






