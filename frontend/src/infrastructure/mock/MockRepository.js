/**
 * @fileoverview Mock Repository implementation for demo mode
 */

import { PedidoRepository } from '../../domain/repositores/PedidoRepository.js';
import { AgendamentoRepository } from '../../domain/repositores/AgendamentoRepository.js';
import { WhatsAppConversationRepository } from '../../domain/repositores/WhatsAppConversationRepository.js';
import { Pedido } from '../../domain/entities/Pedido.js';
import { Agendamento } from '../../domain/entities/Agendamento.js';
import { WhatsAppConversation } from '../../domain/entities/WhatsAppConversation.js';
import { WhatsAppMessage } from '../../domain/entities/WhatsAppMessage.js';
import { MOCK_DATA } from '../../data/mockData.js';

/**
 * Mock Repository
 * Provides mock data for all entities when in demo mode
 * Implements all repository interfaces
 */
export class MockRepository extends PedidoRepository {
  constructor() {
    super();
    // Inherit from PedidoRepository but also implement other interfaces
    Object.setPrototypeOf(this, AgendamentoRepository.prototype);
    Object.setPrototypeOf(this, WhatsAppConversationRepository.prototype);
  }

  // PedidoRepository methods
  async fetchPedidos(authHeader = null) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return MOCK_DATA.pedidos.map(item => new Pedido(item));
  }

  async findById(id, authHeader = null) {
    const pedidos = await this.fetchPedidos(authHeader);
    return pedidos.find(pedido => pedido.ID === id) || null;
  }

  async createPedido(pedido, authHeader = null) {
    // In demo mode, just return the pedido as if it was created
    return new Pedido({ ...pedido, ID: pedido.ID || `DEMO-${Date.now()}` });
  }

  async updatePedido(pedido, authHeader = null) {
    return new Pedido(pedido);
  }

  async deletePedido(id, authHeader = null) {
    return true;
  }

  // AgendamentoRepository methods
  async fetchAgendamentos(authHeader = null) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return MOCK_DATA.agendamentos.map(item => new Agendamento(item));
  }

  // WhatsAppConversationRepository methods
  async fetchConversations(authHeader = null) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return MOCK_DATA.conversations.map(item => new WhatsAppConversation(item));
  }

  async findConversationById(conversationId, authHeader = null) {
    const conversations = await this.fetchConversations(authHeader);
    return conversations.find(conv =>
      conv.getConversationId() === conversationId ||
      conv.id === conversationId ||
      conv.phone === conversationId
    ) || null;
  }

  async fetchMessages(conversationId, authHeader = null) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 150));

    // Generate mock messages for the conversation
    const conversation = await this.findConversationById(conversationId, authHeader);
    return MOCK_DATA.getMockMessages(conversation);
  }

  async sendMessage(conversationId, messageText, authHeader = null) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Create and return a new outgoing message
    return WhatsAppMessage.createOutgoing(messageText);
  }

  async createConversation(conversation, authHeader = null) {
    return new WhatsAppConversation(conversation);
  }

  async updateConversation(conversation, authHeader = null) {
    return new WhatsAppConversation(conversation);
  }

  async markConversationAsRead(conversationId, authHeader = null) {
    return true;
  }
}

// Create a singleton instance
export const mockRepository = new MockRepository();


















