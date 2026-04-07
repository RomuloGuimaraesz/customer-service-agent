/**
 * Agendamento Domain Entity
 * Represents a scheduled appointment/agendamento
 */
export class Agendamento {
  constructor({
    ID,
    Status,
    'Dia da Semana': DiaDaSemana,
    Data,
    Hora,
    Nome,
    WhatsApp,
    Assunto,
    'Descrição Completa': DescricaoCompleta
  }) {
    this.ID = ID;
    this.Status = Status;
    this['Dia da Semana'] = DiaDaSemana;
    this.Data = Data;
    this.Hora = Hora;
    this.Nome = Nome;
    this.WhatsApp = WhatsApp;
    this.Assunto = Assunto;
    this['Descrição Completa'] = DescricaoCompleta;

    this.validate();
  }

  /**
   * Validates the agendamento entity
   */
  validate() {
    if (!this.ID) {
      throw new Error('Agendamento: ID is required');
    }
    if (!this.Nome) {
      throw new Error('Agendamento: Nome is required');
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
    return this.Nome;
  }

  /**
   * Gets the subject/topic
   * @returns {string} Assunto
   */
  getAssunto() {
    return this.Assunto;
  }

  /**
   * Gets the full description
   * @returns {string} Descrição Completa
   */
  getDescricaoCompleta() {
    return this['Descrição Completa'];
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
    return this.Hora ? `${this.Data} ${this.Hora}` : this.Data;
  }

  /**
   * Gets the appointment date as Date object
   * @returns {Date|null} Date object or null if invalid
   */
  getAppointmentDate() {
    try {
      const [day, month, year] = this.Data.split('/');
      const timePart = this.Hora ? this.Hora.substring(0, 5) : '00:00';
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
      Status: this.Status,
      'Dia da Semana': this['Dia da Semana'],
      Data: this.Data,
      Hora: this.Hora,
      Nome: this.Nome,
      WhatsApp: this.WhatsApp,
      Assunto: this.Assunto,
      'Descrição Completa': this['Descrição Completa']
    });
  }
}
