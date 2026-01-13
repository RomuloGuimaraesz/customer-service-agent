/**
 * Agendamento Domain Entity
 * Represents a scheduled appointment/agendamento
 */
export class Agendamento {
  constructor({
    ID,
    Cliente,
    Serviço,
    Produto,
    Descrição,
    Status,
    Data,
    Observações
  }) {
    this.ID = ID;
    this.Cliente = Cliente;
    this.Serviço = Serviço;
    this.Produto = Produto;
    this.Descrição = Descrição;
    this.Status = Status;
    this.Data = Data;
    this.Observações = Observações;

    this.validate();
  }

  /**
   * Validates the agendamento entity
   */
  validate() {
    if (!this.ID) {
      throw new Error('Agendamento: ID is required');
    }
    if (!this.Cliente) {
      throw new Error('Agendamento: Cliente is required');
    }
    if (!this.Status) {
      throw new Error('Agendamento: Status is required');
    }
    if (!this.Data) {
      throw new Error('Agendamento: Data is required');
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
    return this.Serviço;
  }

  /**
   * Gets the product name
   * @returns {string} Product name
   */
  getProductName() {
    return this.Produto;
  }

  /**
   * Gets the appointment status
   * @returns {string} Appointment status
   */
  getStatus() {
    return this.Status;
  }

  /**
   * Gets the appointment date and time
   * @returns {string} Date and time
   */
  getDateTime() {
    return this.Data;
  }

  /**
   * Gets the appointment date as Date object
   * @returns {Date|null} Date object or null if invalid
   */
  getAppointmentDate() {
    try {
      // Parse the date format "DD/MM/YYYY HH:mm"
      const [datePart, timePart] = this.Data.split(' ');
      const [day, month, year] = datePart.split('/');
      return new Date(`${year}-${month}-${day}T${timePart}:00`);
    } catch {
      return null;
    }
  }

  /**
   * Checks if the appointment is scheduled
   * @returns {boolean} True if scheduled
   */
  isScheduled() {
    return this.Status === 'Agendado';
  }

  /**
   * Checks if the appointment is in progress
   * @returns {boolean} True if in progress
   */
  isInProgress() {
    return this.Status === 'Em andamento';
  }

  /**
   * Checks if the appointment is completed
   * @returns {boolean} True if completed
   */
  isCompleted() {
    return this.Status === 'Concluído';
  }

  /**
   * Checks if the appointment is waiting for parts
   * @returns {boolean} True if waiting for parts
   */
  isWaitingForParts() {
    return this.Status === 'Aguardando peça';
  }

  /**
   * Creates a copy of the agendamento
   * @returns {Agendamento} New agendamento instance
   */
  clone() {
    return new Agendamento({
      ID: this.ID,
      Cliente: this.Cliente,
      Serviço: this.Serviço,
      Produto: this.Produto,
      Descrição: this.Descrição,
      Status: this.Status,
      Data: this.Data,
      Observações: this.Observações
    });
  }
}






