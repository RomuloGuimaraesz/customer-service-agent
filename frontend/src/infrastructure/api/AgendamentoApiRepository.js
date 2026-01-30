/**
 * @fileoverview Agendamento API Repository implementation
 */

import { AgendamentoRepository } from '../../domain/repositores/AgendamentoRepository.js';
import { Agendamento } from '../../domain/entities/Agendamento.js';
import { CONFIG } from '../../config/constants.js';
import { fetchApi } from '../../services/apiService.js';

/**
 * Agendamento API Repository
 * Implements AgendamentoRepository interface using API calls
 */
export class AgendamentoApiRepository extends AgendamentoRepository {
  /**
   * Fetches all agendamentos from API
   * @param {string} [authHeader] - Authorization header
   * @returns {Promise<Agendamento[]>} Array of agendamento entities
   */
  async fetchAgendamentos(authHeader = null) {
    try {
      const data = await fetchApi(CONFIG.API_ENDPOINTS.agendamentos, { authHeader });

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format: expected array of agendamentos');
      }

      return data.map(item => new Agendamento(item));
    } catch (error) {
      throw new Error(`Failed to fetch agendamentos: ${error.message}`);
    }
  }

  /**
   * Finds an agendamento by ID
   * @param {string} id - Agendamento ID
   * @param {string} [authHeader] - Authorization header
   * @returns {Promise<Agendamento|null>} Agendamento entity or null if not found
   */
  async findById(id, authHeader = null) {
    if (!id) {
      throw new Error('Agendamento ID is required');
    }

    try {
      const agendamentos = await this.fetchAgendamentos(authHeader);
      return agendamentos.find(agendamento => agendamento.ID === id) || null;
    } catch (error) {
      throw new Error(`Failed to find agendamento by ID: ${error.message}`);
    }
  }

  /**
   * Creates a new agendamento
   * @param {Agendamento} agendamento - Agendamento entity to create
   * @param {string} [authHeader] - Authorization header
   * @returns {Promise<Agendamento>} Created agendamento entity
   */
  async createAgendamento(agendamento, authHeader = null) {
    if (!agendamento) {
      throw new Error('Agendamento entity is required');
    }

    try {
      const data = await fetchApi(CONFIG.API_ENDPOINTS.agendamentos, {
        authHeader,
        method: 'POST',
        body: {
          ID: agendamento.ID,
          Cliente: agendamento.Cliente,
          Serviço: agendamento.Serviço,
          Produto: agendamento.Produto,
          Descrição: agendamento.Descrição,
          Status: agendamento.Status,
          Data: agendamento.Data,
          Observações: agendamento.Observações
        }
      });

      return new Agendamento(data);
    } catch (error) {
      throw new Error(`Failed to create agendamento: ${error.message}`);
    }
  }

  /**
   * Updates an existing agendamento
   * @param {Agendamento} agendamento - Agendamento entity with updated data
   * @param {string} [authHeader] - Authorization header
   * @returns {Promise<Agendamento>} Updated agendamento entity
   */
  async updateAgendamento(agendamento, authHeader = null) {
    if (!agendamento || !agendamento.ID) {
      throw new Error('Agendamento entity with ID is required');
    }

    try {
      const data = await fetchApi(`${CONFIG.API_ENDPOINTS.agendamentos}/${agendamento.ID}`, {
        authHeader,
        method: 'PUT',
        body: {
          Cliente: agendamento.Cliente,
          Serviço: agendamento.Serviço,
          Produto: agendamento.Produto,
          Descrição: agendamento.Descrição,
          Status: agendamento.Status,
          Data: agendamento.Data,
          Observações: agendamento.Observações
        }
      });

      return new Agendamento(data);
    } catch (error) {
      throw new Error(`Failed to update agendamento: ${error.message}`);
    }
  }

  /**
   * Deletes an agendamento by ID
   * @param {string} id - Agendamento ID to delete
   * @param {string} [authHeader] - Authorization header
   * @returns {Promise<boolean>} True if deletion was successful
   */
  async deleteAgendamento(id, authHeader = null) {
    if (!id) {
      throw new Error('Agendamento ID is required');
    }

    try {
      await fetchApi(`${CONFIG.API_ENDPOINTS.agendamentos}/${id}`, {
        authHeader,
        method: 'DELETE'
      });

      return true;
    } catch (error) {
      throw new Error(`Failed to delete agendamento: ${error.message}`);
    }
  }
}


















