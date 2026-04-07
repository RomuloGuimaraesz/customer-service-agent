/**
 * @fileoverview Pedido API Repository implementation
 */

import { PedidoRepository } from '../../domain/repositores/PedidoRepository.js';
import { Pedido } from '../../domain/entities/Pedido.js';
import { CONFIG } from '../../config/constants.js';
import { fetchApi } from '../../services/apiService.js';

/**
 * Pedido API Repository
 * Implements PedidoRepository interface using API calls
 */
export class PedidoApiRepository extends PedidoRepository {
  normalizePedidoItem(item, idx) {
    if (!item || typeof item !== 'object') return null;
    const safe = key => item[key] ?? item[String(key).toLowerCase()];
    const id =
      safe('ID') ??
      safe('id') ??
      safe('row_number') ??
      safe('rowNumber') ??
      `pedido-${idx}`;
    const nome = (safe('Nome') ?? safe('nome') ?? '').trim() || '—';
    const statusRaw = safe('Status') ?? safe('status');
    const status =
      statusRaw != null && String(statusRaw).trim() !== ''
        ? String(statusRaw).trim()
        : 'Sem status';

    return {
      ID: String(id),
      Status: status,
      Data: safe('Data') ?? safe('data') ?? '',
      Hora: safe('Hora') ?? safe('hora') ?? '',
      Nome: nome,
      WhatsApp: safe('WhatsApp') ?? safe('whatsapp') ?? '',
      Prioridade: safe('Prioridade') ?? safe('prioridade') ?? '',
      Assunto: safe('Assunto') ?? safe('assunto') ?? '',
      'Descricao Completa':
        safe('Descricao Completa') ??
        safe('Descrição Completa') ??
        safe('descricao completa') ??
        safe('descrição completa') ??
        '',
    };
  }

  /**
   * Fetches all pedidos from API
   * @param {string} [authHeader] - Authorization header
   * @returns {Promise<Pedido[]>} Array of pedido entities
   */
  async fetchPedidos(authHeader = null) {
    try {
      const response = await fetchApi(CONFIG.API_ENDPOINTS.pedidos, {
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
        .map((item, idx) => this.normalizePedidoItem(item, idx))
        .filter(Boolean)
        .map(item => new Pedido(item));
    } catch (error) {
      throw new Error(`Failed to fetch pedidos: ${error.message}`);
    }
  }

  /**
   * Finds a pedido by ID
   * @param {string} id - Pedido ID
   * @param {string} [authHeader] - Authorization header
   * @returns {Promise<Pedido|null>} Pedido entity or null if not found
   */
  async findById(id, authHeader = null) {
    if (!id) {
      throw new Error('Pedido ID is required');
    }

    try {
      const pedidos = await this.fetchPedidos(authHeader);
      return pedidos.find(pedido => pedido.ID === id) || null;
    } catch (error) {
      throw new Error(`Failed to find pedido by ID: ${error.message}`);
    }
  }

  /**
   * Creates a new pedido
   * @param {Pedido} pedido - Pedido entity to create
   * @param {string} [authHeader] - Authorization header
   * @returns {Promise<Pedido>} Created pedido entity
   */
  async createPedido(pedido, authHeader = null) {
    if (!pedido) {
      throw new Error('Pedido entity is required');
    }

    try {
      const data = await fetchApi(CONFIG.API_ENDPOINTS.pedidos, {
        authHeader,
        method: 'POST',
        body: {
          ID: pedido.ID,
          Cliente: pedido.Cliente,
          Serviço: pedido.Serviço,
          Produto: pedido.Produto,
          Descrição: pedido.Descrição,
          Valor: pedido.Valor,
          Retira: pedido.Retira,
          Status: pedido.Status,
          Data: pedido.Data,
          Observações: pedido.Observações
        }
      });

      return new Pedido(data);
    } catch (error) {
      throw new Error(`Failed to create pedido: ${error.message}`);
    }
  }

  /**
   * Updates an existing pedido
   * @param {Pedido} pedido - Pedido entity with updated data
   * @param {string} [authHeader] - Authorization header
   * @returns {Promise<Pedido>} Updated pedido entity
   */
  async updatePedido(pedido, authHeader = null) {
    if (!pedido || !pedido.ID) {
      throw new Error('Pedido entity with ID is required');
    }

    try {
      const data = await fetchApi(`${CONFIG.API_ENDPOINTS.pedidos}/${pedido.ID}`, {
        authHeader,
        method: 'PUT',
        body: {
          Cliente: pedido.Cliente,
          Serviço: pedido.Serviço,
          Produto: pedido.Produto,
          Descrição: pedido.Descrição,
          Valor: pedido.Valor,
          Retira: pedido.Retira,
          Status: pedido.Status,
          Data: pedido.Data,
          Observações: pedido.Observações
        }
      });

      return new Pedido(data);
    } catch (error) {
      throw new Error(`Failed to update pedido: ${error.message}`);
    }
  }

  /**
   * Deletes a pedido by ID
   * @param {string} id - Pedido ID to delete
   * @param {string} [authHeader] - Authorization header
   * @returns {Promise<boolean>} True if deletion was successful
   */
  async deletePedido(id, authHeader = null) {
    if (!id) {
      throw new Error('Pedido ID is required');
    }

    try {
      await fetchApi(`${CONFIG.API_ENDPOINTS.pedidos}/${id}`, {
        authHeader,
        method: 'DELETE'
      });

      return true;
    } catch (error) {
      throw new Error(`Failed to delete pedido: ${error.message}`);
    }
  }
}


















