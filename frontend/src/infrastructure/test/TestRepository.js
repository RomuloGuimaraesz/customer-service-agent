/**
 * @fileoverview Test Repository for testing use cases and contexts
 */

/**
 * Test Repository
 * A controllable repository for testing that can be configured to return specific data or throw errors
 */
export class TestRepository {
  constructor() {
    this.mockData = {};
    this.mockErrors = {};
  }

  /**
   * Set mock data for a method
   * @param {string} method - Method name
   * @param {*} data - Data to return
   */
  setMockData(method, data) {
    this.mockData[method] = data;
  }

  /**
   * Set mock error for a method
   * @param {string} method - Method name
   * @param {Error|string} error - Error to throw
   */
  setMockError(method, error) {
    this.mockErrors[method] = error;
  }

  /**
   * Clear all mocks
   */
  clearMocks() {
    this.mockData = {};
    this.mockErrors = {};
  }

  /**
   * Execute a method with mock handling
   * @param {string} method - Method name
   * @param {Function} defaultImplementation - Default implementation
   * @param  {...any} args - Arguments
   * @returns {*} Result
   */
  async executeMethod(method, defaultImplementation, ...args) {
    if (this.mockErrors[method]) {
      throw this.mockErrors[method];
    }

    if (this.mockData[method] !== undefined) {
      return this.mockData[method];
    }

    return defaultImplementation(...args);
  }
}

/**
 * Test Pedido Repository
 */
export class TestPedidoRepository {
  constructor() {
    this.testRepo = new TestRepository();
  }

  async fetchPedidos(authHeader = null) {
    return this.testRepo.executeMethod(
      'fetchPedidos',
      () => [],
      authHeader
    ).then(data => {
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format: expected array of pedidos');
      }
      return data;
    });
  }

  async findById(id, authHeader = null) {
    return this.testRepo.executeMethod(
      'findById',
      () => null,
      id, authHeader
    );
  }

  async createPedido(pedido, authHeader = null) {
    return this.testRepo.executeMethod(
      'createPedido',
      () => pedido,
      pedido, authHeader
    );
  }

  async updatePedido(pedido, authHeader = null) {
    return this.testRepo.executeMethod(
      'updatePedido',
      () => pedido,
      pedido, authHeader
    );
  }

  async deletePedido(id, authHeader = null) {
    return this.testRepo.executeMethod(
      'deletePedido',
      () => true,
      id, authHeader
    );
  }

  setMockData(method, data) {
    this.testRepo.setMockData(method, data);
  }

  setMockError(method, error) {
    this.testRepo.setMockError(method, error);
  }

  clearMocks() {
    this.testRepo.clearMocks();
  }
}

/**
 * Test Agendamento Repository
 */
export class TestAgendamentoRepository {
  constructor() {
    this.testRepo = new TestRepository();
  }

  async fetchAgendamentos(authHeader = null) {
    return this.testRepo.executeMethod(
      'fetchAgendamentos',
      () => [],
      authHeader
    );
  }

  async findById(id, authHeader = null) {
    return this.testRepo.executeMethod(
      'findById',
      () => null,
      id, authHeader
    );
  }

  async createAgendamento(agendamento, authHeader = null) {
    return this.testRepo.executeMethod(
      'createAgendamento',
      () => agendamento,
      agendamento, authHeader
    );
  }

  async updateAgendamento(agendamento, authHeader = null) {
    return this.testRepo.executeMethod(
      'updateAgendamento',
      () => agendamento,
      agendamento, authHeader
    );
  }

  async deleteAgendamento(id, authHeader = null) {
    return this.testRepo.executeMethod(
      'deleteAgendamento',
      () => true,
      id, authHeader
    );
  }

  setMockData(method, data) {
    this.testRepo.setMockData(method, data);
  }

  setMockError(method, error) {
    this.testRepo.setMockError(method, error);
  }

  clearMocks() {
    this.testRepo.clearMocks();
  }
}

/**
 * Test WhatsApp Conversation Repository
 */
export class TestWhatsAppConversationRepository {
  constructor() {
    this.testRepo = new TestRepository();
  }

  async fetchConversations(authHeader = null) {
    return this.testRepo.executeMethod(
      'fetchConversations',
      () => [],
      authHeader
    );
  }

  async findConversationById(conversationId, authHeader = null) {
    return this.testRepo.executeMethod(
      'findConversationById',
      () => null,
      conversationId, authHeader
    );
  }

  async fetchMessages(conversationId, authHeader = null) {
    return this.testRepo.executeMethod(
      'fetchMessages',
      () => [],
      conversationId, authHeader
    );
  }

  async sendMessage(conversationId, messageText, authHeader = null) {
    return this.testRepo.executeMethod(
      'sendMessage',
      () => ({ id: 'test-id', body: messageText, direction: 'outgoing', fromMe: true, timestamp: new Date().toISOString() }),
      conversationId, messageText, authHeader
    );
  }

  async createConversation(conversation, authHeader = null) {
    return this.testRepo.executeMethod(
      'createConversation',
      () => conversation,
      conversation, authHeader
    );
  }

  async updateConversation(conversation, authHeader = null) {
    return this.testRepo.executeMethod(
      'updateConversation',
      () => conversation,
      conversation, authHeader
    );
  }

  async markConversationAsRead(conversationId, authHeader = null) {
    return this.testRepo.executeMethod(
      'markConversationAsRead',
      () => true,
      conversationId, authHeader
    );
  }

  setMockData(method, data) {
    this.testRepo.setMockData(method, data);
  }

  setMockError(method, error) {
    this.testRepo.setMockError(method, error);
  }

  clearMocks() {
    this.testRepo.clearMocks();
  }
}
