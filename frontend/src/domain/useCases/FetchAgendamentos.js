/**
 * @fileoverview FetchAgendamentos use case - handles fetching agendamentos business logic
 */

/**
 * FetchAgendamentos Use Case
 *
 * @class
 * @classdesc Handles the business logic for fetching agendamentos
 */
export class FetchAgendamentos {
  /**
   * Creates a new FetchAgendamentos use case instance
   *
   * @param {Object} dependencies - Use case dependencies
   * @param {AgendamentoRepository} dependencies.agendamentoRepository - Repository for agendamento data operations
   */
  constructor({ agendamentoRepository }) {
    /**
     * @type {AgendamentoRepository}
     * @private
     */
    this._agendamentoRepository = agendamentoRepository;

    if (!this._agendamentoRepository) {
      throw new Error('AgendamentoRepository is required');
    }
  }

  /**
   * Executes the fetch agendamentos use case
   *
   * @param {string} [authHeader] - Optional authorization header
   * @returns {Promise<UseCaseResult>} Result object with success status and agendamentos data or error
   */
  async execute(authHeader = null) {
    try {
      const agendamentos = await this._agendamentoRepository.fetchAgendamentos(authHeader);

      return {
        success: true,
        data: agendamentos,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Falha ao buscar agendamentos',
      };
    }
  }
}

















