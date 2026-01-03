/**
 * @fileoverview FetchPedidos use case - handles fetching pedidos business logic
 */

/**
 * FetchPedidos Use Case
 *
 * @class
 * @classdesc Handles the business logic for fetching pedidos
 */
export class FetchPedidos {
  /**
   * Creates a new FetchPedidos use case instance
   *
   * @param {Object} dependencies - Use case dependencies
   * @param {PedidoRepository} dependencies.pedidoRepository - Repository for pedido data operations
   */
  constructor({ pedidoRepository }) {
    /**
     * @type {PedidoRepository}
     * @private
     */
    this._pedidoRepository = pedidoRepository;

    if (!this._pedidoRepository) {
      throw new Error('PedidoRepository is required');
    }
  }

  /**
   * Executes the fetch pedidos use case
   *
   * @param {string} [authHeader] - Optional authorization header
   * @returns {Promise<UseCaseResult>} Result object with success status and pedidos data or error
   */
  async execute(authHeader = null) {
    try {
      const pedidos = await this._pedidoRepository.fetchPedidos(authHeader);

      return {
        success: true,
        data: pedidos,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Falha ao buscar pedidos',
      };
    }
  }
}
