/**
 * @fileoverview FetchWhatsAppConversations use case - handles fetching WhatsApp conversations business logic
 */

/**
 * FetchWhatsAppConversations Use Case
 *
 * @class
 * @classdesc Handles the business logic for fetching WhatsApp conversations
 */
export class FetchWhatsAppConversations {
  /**
   * Creates a new FetchWhatsAppConversations use case instance
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
   * Executes the fetch WhatsApp conversations use case
   *
   * @param {string} [authHeader] - Optional authorization header
   * @returns {Promise<UseCaseResult>} Result object with success status and conversations data or error
   */
  async execute(authHeader = null) {
    try {
      const conversations = await this._whatsAppConversationRepository.fetchConversations(authHeader);

      return {
        success: true,
        data: conversations,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Falha ao buscar conversas do WhatsApp',
      };
    }
  }
}


















