/**
 * @fileoverview Agendamento Repository interface for data persistence operations
 */

import { Agendamento } from '../entities/Agendamento.js';

/**
 * Agendamento Repository interface
 *
 * @interface
 * @classdesc Defines the contract for agendamento data persistence operations
 */
export class AgendamentoRepository {
  /**
   * Fetches all agendamentos
   *
   * @param {string} [authHeader] - Optional authorization header for API requests
   * @returns {Promise<Agendamento[]>} Array of agendamento entities
   * @throws {Error} If fetching fails
   */
  async fetchAgendamentos(authHeader = null) {
    throw new Error('fetchAgendamentos() must be implemented by concrete repository');
  }

  /**
   * Finds an agendamento by ID
   *
   * @param {string} id - Agendamento ID
   * @param {string} [authHeader] - Optional authorization header
   * @returns {Promise<Agendamento|null>} Agendamento entity or null if not found
   */
  async findById(id, authHeader = null) {
    throw new Error('findById() must be implemented by concrete repository');
  }

  /**
   * Creates a new agendamento
   *
   * @param {Agendamento} agendamento - Agendamento entity to create
   * @param {string} [authHeader] - Optional authorization header
   * @returns {Promise<Agendamento>} The created agendamento entity
   * @throws {Error} If creation fails
   */
  async createAgendamento(agendamento, authHeader = null) {
    throw new Error('createAgendamento() must be implemented by concrete repository');
  }

  /**
   * Updates an existing agendamento
   *
   * @param {Agendamento} agendamento - Agendamento entity with updated data
   * @param {string} [authHeader] - Optional authorization header
   * @returns {Promise<Agendamento>} Updated agendamento entity
   * @throws {Error} If update fails
   */
  async updateAgendamento(agendamento, authHeader = null) {
    throw new Error('updateAgendamento() must be implemented by concrete repository');
  }

  /**
   * Deletes an agendamento by ID
   *
   * @param {string} id - Agendamento ID to delete
   * @param {string} [authHeader] - Optional authorization header
   * @returns {Promise<boolean>} True if deletion was successful
   * @throws {Error} If deletion fails
   */
  async deleteAgendamento(id, authHeader = null) {
    throw new Error('deleteAgendamento() must be implemented by concrete repository');
  }
}

















