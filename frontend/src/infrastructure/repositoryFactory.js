/**
 * @fileoverview Repository Factory - Creates appropriate repository instances based on demo mode
 */

import { PedidoApiRepository } from './api/PedidoApiRepository.js';
import { AgendamentoApiRepository } from './api/AgendamentoApiRepository.js';
import { WhatsAppConversationApiRepository } from './api/WhatsAppConversationApiRepository.js';
import { mockRepository } from './mock/MockRepository.js';
import { isDemoMode } from '../services/apiService.js';

// Allow overriding repositories for testing
let testOverrides = {};

/**
 * Repository Factory
 * Provides the appropriate repository instances based on demo mode
 */
export class RepositoryFactory {
  /**
   * Override repositories for testing
   * @param {Object} overrides - Repository overrides
   */
  static setTestOverrides(overrides) {
    testOverrides = overrides;
  }

  /**
   * Clear test overrides
   */
  static clearTestOverrides() {
    testOverrides = {};
  }

  /**
   * Gets the pedido repository based on demo mode
   * @param {string} [authHeader] - Authorization header
   * @returns {PedidoRepository} Repository instance
   */
  static getPedidoRepository(authHeader = null) {
    if (testOverrides.pedidoRepository) {
      return testOverrides.pedidoRepository;
    }

    // In test environment, always use API repository to respect fetch mocks
    if (process.env.NODE_ENV === 'test') {
      return new PedidoApiRepository();
    }

    return isDemoMode(authHeader)
      ? mockRepository
      : new PedidoApiRepository();
  }

  /**
   * Gets the agendamento repository based on demo mode
   * @param {string} [authHeader] - Authorization header
   * @returns {AgendamentoRepository} Repository instance
   */
  static getAgendamentoRepository(authHeader = null) {
    if (testOverrides.agendamentoRepository) {
      return testOverrides.agendamentoRepository;
    }

    // In test environment, always use API repository to respect fetch mocks
    if (process.env.NODE_ENV === 'test') {
      return new AgendamentoApiRepository();
    }

    return isDemoMode(authHeader)
      ? mockRepository
      : new AgendamentoApiRepository();
  }

  /**
   * Gets the WhatsApp conversation repository based on demo mode
   * @param {string} [authHeader] - Authorization header
   * @returns {WhatsAppConversationRepository} Repository instance
   */
  static getWhatsAppConversationRepository(authHeader = null) {
    if (testOverrides.whatsAppConversationRepository) {
      return testOverrides.whatsAppConversationRepository;
    }

    // In test environment, always use API repository to respect fetch mocks
    if (process.env.NODE_ENV === 'test') {
      return new WhatsAppConversationApiRepository();
    }

    return isDemoMode(authHeader)
      ? mockRepository
      : new WhatsAppConversationApiRepository();
  }
}
