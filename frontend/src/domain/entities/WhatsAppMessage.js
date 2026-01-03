/**
 * WhatsApp Message Domain Entity
 * Represents a WhatsApp message
 */
export class WhatsAppMessage {
  constructor({
    id,
    body,
    direction,
    fromMe,
    timestamp
  }) {
    this.id = id;
    this.body = body;
    this.direction = direction;
    this.fromMe = fromMe;
    this.timestamp = timestamp;

    this.validate();
  }

  /**
   * Validates the message entity
   */
  validate() {
    if (!this.id) {
      throw new Error('WhatsAppMessage: id is required');
    }
    if (!this.body && this.body !== '') {
      throw new Error('WhatsAppMessage: body is required');
    }
    if (!['incoming', 'outgoing'].includes(this.direction)) {
      throw new Error('WhatsAppMessage: direction must be either "incoming" or "outgoing"');
    }
    if (typeof this.fromMe !== 'boolean') {
      throw new Error('WhatsAppMessage: fromMe must be a boolean');
    }
    if (!this.timestamp) {
      throw new Error('WhatsAppMessage: timestamp is required');
    }
  }

  /**
   * Checks if this is an incoming message
   * @returns {boolean} True if message is incoming
   */
  isIncoming() {
    return this.direction === 'incoming';
  }

  /**
   * Checks if this is an outgoing message
   * @returns {boolean} True if message is outgoing
   */
  isOutgoing() {
    return this.direction === 'outgoing';
  }

  /**
   * Gets the message timestamp as a Date object
   * @returns {Date} The timestamp as Date
   */
  getTimestamp() {
    return new Date(this.timestamp);
  }

  /**
   * Creates a new outgoing message
   * @param {string} body - Message content
   * @returns {WhatsAppMessage} New outgoing message
   */
  static createOutgoing(body) {
    return new WhatsAppMessage({
      id: Date.now().toString(),
      body,
      direction: 'outgoing',
      fromMe: true,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Creates a copy of the message
   * @returns {WhatsAppMessage} New message instance
   */
  clone() {
    return new WhatsAppMessage({
      id: this.id,
      body: this.body,
      direction: this.direction,
      fromMe: this.fromMe,
      timestamp: this.timestamp
    });
  }
}
