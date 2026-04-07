/**
 * Pedido Domain Entity
 * Represents an order/pedido
 * Structure from Avecta AI - Pedidos.csv
 */
export class Pedido {
  constructor({
    ID,
    Status,
    Data,
    Hora,
    Nome,
    WhatsApp,
    Prioridade,
    Assunto,
    'Descricao Completa': DescricaoCompleta
  }) {
    this.ID = ID;
    this.Status = Status;
    this.Data = Data;
    this.Hora = Hora;
    this.Nome = Nome;
    this.WhatsApp = WhatsApp;
    this.Prioridade = Prioridade;
    this.Assunto = Assunto;
    this['Descricao Completa'] = DescricaoCompleta;

    this.validate();
  }

  /**
   * Validates the pedido entity
   */
  validate() {
    if (!this.ID) {
      throw new Error('Pedido: ID is required');
    }
    if (!this.Nome) {
      throw new Error('Pedido: Nome is required');
    }
    if (!this.Status) {
      throw new Error('Pedido: Status is required');
    }
  }

  /**
   * Gets the formatted ID for display
   * @returns {string} Formatted ID
   */
  getFormattedId() {
    return this.ID;
  }

  /**
   * Gets the client/contact name
   * @returns {string} Name
   */
  getClientName() {
    return this.Nome;
  }

  /**
   * Gets the order status
   * @returns {string} Order status
   */
  getStatus() {
    return this.Status;
  }

  /**
   * Checks if the order is completed
   * @returns {boolean} True if completed
   */
  isCompleted() {
    return this.Status === 'Concluído';
  }

  /**
   * Checks if the order is pending
   * @returns {boolean} True if pending
   */
  isPending() {
    return this.Status === 'Em andamento';
  }

  /**
   * Creates a copy of the pedido
   * @returns {Pedido} New pedido instance
   */
  clone() {
    return new Pedido({
      ID: this.ID,
      Status: this.Status,
      Data: this.Data,
      Hora: this.Hora,
      Nome: this.Nome,
      WhatsApp: this.WhatsApp,
      Prioridade: this.Prioridade,
      Assunto: this.Assunto,
      'Descricao Completa': this['Descricao Completa']
    });
  }
}
