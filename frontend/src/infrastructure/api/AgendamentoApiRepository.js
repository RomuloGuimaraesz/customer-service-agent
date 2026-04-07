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
  normalizeAgendamentoItem(item, idx) {
    if (!item || typeof item !== 'object') return null;
    const safe = key => item[key] ?? item[String(key).toLowerCase()];
    const data = safe('Data') ?? safe('data');
    const hora = safe('Hora') ?? safe('hora');
    const nome = safe('Nome') ?? safe('nome');
    const whatsapp = safe('WhatsApp') ?? safe('whatsapp');
    const id =
      safe('ID') ??
      safe('id') ??
      safe('row_number') ??
      safe('rowNumber') ??
      (whatsapp && data ? `${whatsapp}-${data}-${hora ?? '00:00:00'}` : null) ??
      `agendamento-${idx}`;

    return {
      ID: String(id),
      Status: safe('Status') ?? safe('status') ?? 'Agendado',
      'Dia da Semana':
        safe('Dia da Semana') ??
        safe('dia da semana') ??
        safe('DiaDaSemana') ??
        '',
      Data: data ?? '',
      Hora: hora ?? '',
      Nome: nome ?? '',
      WhatsApp: whatsapp ?? '',
      Assunto: safe('Assunto') ?? safe('assunto') ?? '',
      'Descrição Completa':
        safe('Descrição Completa') ??
        safe('Descricao Completa') ??
        safe('descrição completa') ??
        safe('descricao completa') ??
        '',
    };
  }

  /**
   * Fetches all agendamentos from API
   * @param {string} [authHeader] - Authorization header
   * @returns {Promise<Agendamento[]>} Array of agendamento entities
   */
  async fetchAgendamentos(authHeader = null) {
    try {
      const response = await fetchApi(CONFIG.API_ENDPOINTS.agendamentos, {
        authHeader,
      });
      const list = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.items)
            ? response.items
            : Array.isArray(response?.results)
              ? response.results
              : [];

      return list
        .map((item, idx) => this.normalizeAgendamentoItem(item, idx))
        .filter(Boolean)
        .map(item => new Agendamento(item));
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
          Status: agendamento.Status,
          'Dia da Semana': agendamento['Dia da Semana'],
          Data: agendamento.Data,
          Hora: agendamento.Hora,
          Nome: agendamento.Nome,
          WhatsApp: agendamento.WhatsApp,
          Assunto: agendamento.Assunto,
          'Descrição Completa': agendamento['Descrição Completa']
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
          Status: agendamento.Status,
          'Dia da Semana': agendamento['Dia da Semana'],
          Data: agendamento.Data,
          Hora: agendamento.Hora,
          Nome: agendamento.Nome,
          WhatsApp: agendamento.WhatsApp,
          Assunto: agendamento.Assunto,
          'Descrição Completa': agendamento['Descrição Completa']
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


















