/**
 * Pedido Domain Entity
 * Represents an order/pedido
 */
export class Pedido {
  constructor({
    ID,
    Cliente,
    Serviço,
    Produto,
    Descrição,
    Valor,
    Retira,
    Status,
    Data,
    Observações
  }) {
    this.ID = ID;
    this.Cliente = Cliente;
    this.Serviço = Serviço;
    this.Produto = Produto;
    this.Descrição = Descrição;
    this.Valor = Valor;
    this.Retira = Retira;
    this.Status = Status;
    this.Data = Data;
    this.Observações = Observações;

    this.validate();
  }

  /**
   * Validates the pedido entity
   */
  validate() {
    if (!this.ID) {
      throw new Error('Pedido: ID is required');
    }
    if (!this.Cliente) {
      throw new Error('Pedido: Cliente is required');
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
   * Gets the client name
   * @returns {string} Client name
   */
  getClientName() {
    return this.Cliente;
  }

  /**
   * Gets the service type
   * @returns {string} Service type
   */
  getServiceType() {
    return this.Serviço || this.Produto || 'N/A';
  }

  /**
   * Gets the order value
   * @returns {string} Order value
   */
  getValue() {
    return this.Valor;
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
    return this.Status === 'Pronto' || this.Status === 'Enviado';
  }

  /**
   * Checks if the order is pending
   * @returns {boolean} True if pending
   */
  isPending() {
    return this.Status === 'Confirmado' || this.Status === 'Em produção' || this.Status === 'Aguardando';
  }

  /**
   * Creates a copy of the pedido
   * @returns {Pedido} New pedido instance
   */
  clone() {
    return new Pedido({
      ID: this.ID,
      Cliente: this.Cliente,
      Serviço: this.Serviço,
      Produto: this.Produto,
      Descrição: this.Descrição,
      Valor: this.Valor,
      Retira: this.Retira,
      Status: this.Status,
      Data: this.Data,
      Observações: this.Observações
    });
  }
}
