/**
 * @fileoverview Use Case Factory - Creates use case instances with dependency injection
 */

import { FetchPedidos } from './useCases/FetchPedidos.js';
import { FetchAgendamentos } from './useCases/FetchAgendamentos.js';
import { FetchWhatsAppConversations } from './useCases/FetchWhatsAppConversations.js';
import { FetchWhatsAppMessages } from './useCases/FetchWhatsAppMessages.js';
import { SendWhatsAppMessage } from './useCases/SendWhatsAppMessage.js';
import { RepositoryFactory } from '../infrastructure/repositoryFactory.js';

/**
 * Use Case Factory
 * Creates use case instances with proper dependency injection
 */
export class UseCaseFactory {
  /**
   * Creates a FetchPedidos use case
   * @param {string} [authHeader] - Authorization header
   * @returns {FetchPedidos} Use case instance
   */
  static createFetchPedidos(authHeader = null) {
    const pedidoRepository = RepositoryFactory.getPedidoRepository(authHeader);
    return new FetchPedidos({ pedidoRepository });
  }

  /**
   * Creates a FetchAgendamentos use case
   * @param {string} [authHeader] - Authorization header
   * @returns {FetchAgendamentos} Use case instance
   */
  static createFetchAgendamentos(authHeader = null) {
    const agendamentoRepository = RepositoryFactory.getAgendamentoRepository(authHeader);
    return new FetchAgendamentos({ agendamentoRepository });
  }

  /**
   * Creates a FetchWhatsAppConversations use case
   * @param {string} [authHeader] - Authorization header
   * @returns {FetchWhatsAppConversations} Use case instance
   */
  static createFetchWhatsAppConversations(authHeader = null) {
    const whatsAppConversationRepository = RepositoryFactory.getWhatsAppConversationRepository(authHeader);
    return new FetchWhatsAppConversations({ whatsAppConversationRepository });
  }

  /**
   * Creates a FetchWhatsAppMessages use case
   * @param {string} [authHeader] - Authorization header
   * @returns {FetchWhatsAppMessages} Use case instance
   */
  static createFetchWhatsAppMessages(authHeader = null) {
    const whatsAppConversationRepository = RepositoryFactory.getWhatsAppConversationRepository(authHeader);
    return new FetchWhatsAppMessages({ whatsAppConversationRepository });
  }

  /**
   * Creates a SendWhatsAppMessage use case
   * @param {string} [authHeader] - Authorization header
   * @returns {SendWhatsAppMessage} Use case instance
   */
  static createSendWhatsAppMessage(authHeader = null) {
    const whatsAppConversationRepository = RepositoryFactory.getWhatsAppConversationRepository(authHeader);
    return new SendWhatsAppMessage({ whatsAppConversationRepository });
  }
}


















