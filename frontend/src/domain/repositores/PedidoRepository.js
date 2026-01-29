/**
 * @fileoverview Pedido Repository interface for data persistence operations
 */

import { Pedido } from '../entities/Pedido.js';

/**
 * Pedido Repository interface
 *
 * @interface
 * @classdesc Defines the contract for pedido data persistence operations
 */
export class PedidoRepository {
  /**
   * Fetches all pedidos
   *
   * @param {string} [authHeader] - Optional authorization header for API requests
   * @returns {Promise<Pedido[]>} Array of pedido entities
   * @throws {Error} If fetching fails
   */
  async fetchPedidos(authHeader = null) {
    throw new Error('fetchPedidos() must be implemented by concrete repository');
  }

  /**
   * Finds a pedido by ID
   *
   * @param {string} id - Pedido ID
   * @param {string} [authHeader] - Optional authorization header
   * @returns {Promise<Pedido|null>} Pedido entity or null if not found
   */
  async findById(id, authHeader = null) {
    throw new Error('findById() must be implemented by concrete repository');
  }

  /**
   * Creates a new pedido
   *
   * @param {Pedido} pedido - Pedido entity to create
   * @param {string} [authHeader] - Optional authorization header
   * @returns {Promise<Pedido>} The created pedido entity
   * @throws {Error} If creation fails
   */
  async createPedido(pedido, authHeader = null) {
    throw new Error('createPedido() must be implemented by concrete repository');
  }

  /**
   * Updates an existing pedido
   *
   * @param {Pedido} pedido - Pedido entity with updated data
   * @param {string} [authHeader] - Optional authorization header
   * @returns {Promise<Pedido>} Updated pedido entity
   * @throws {Error} If update fails
   */
  async updatePedido(pedido, authHeader = null) {
    throw new Error('updatePedido() must be implemented by concrete repository');
  }

  /**
   * Deletes a pedido by ID
   *
   * @param {string} id - Pedido ID to delete
   * @param {string} [authHeader] - Optional authorization header
   * @returns {Promise<boolean>} True if deletion was successful
   * @throws {Error} If deletion fails
   */
  async deletePedido(id, authHeader = null) {
    throw new Error('deletePedido() must be implemented by concrete repository');
  }
}

















