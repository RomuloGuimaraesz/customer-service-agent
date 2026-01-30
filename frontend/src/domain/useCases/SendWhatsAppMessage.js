/**
 * @fileoverview SendWhatsAppMessage use case - handles sending WhatsApp messages business logic
 */

/**
 * SendWhatsAppMessage Use Case
 *
 * @class
 * @classdesc Handles the business logic for sending WhatsApp messages
 */
export class SendWhatsAppMessage {
  /**
   * Creates a new SendWhatsAppMessage use case instance
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
   * Executes the send WhatsApp message use case
   *
   * @param {Object} params - Parameters for sending message
   * @param {string} params.conversationId - Conversation ID to send message to
   * @param {string} params.messageText - Message content to send
   * @param {string} [params.authHeader] - Optional authorization header
   * @returns {Promise<UseCaseResult>} Result object with success status and sent message data or error
   */
  async execute({ conversationId, messageText, authHeader = null }) {
    try {
      // Validate required parameters
      if (!conversationId) {
        return {
          success: false,
          data: null,
          error: 'ID da conversa é obrigatório',
        };
      }

      if (!messageText || messageText.trim() === '') {
        return {
          success: false,
          data: null,
          error: 'Texto da mensagem é obrigatório',
        };
      }

      const sentMessage = await this._whatsAppConversationRepository.sendMessage(
        conversationId,
        messageText.trim(),
        authHeader
      );

      return {
        success: true,
        data: sentMessage,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Falha ao enviar mensagem do WhatsApp',
      };
    }
  }
}


















