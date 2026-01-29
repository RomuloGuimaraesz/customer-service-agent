/**
 * WhatsApp Conversation Domain Entity
 * Represents a WhatsApp conversation/contact
 */
export class WhatsAppConversation {
  constructor({
    id,
    phone,
    name,
    lastMessage,
    lastMessageTime,
    unreadCount = 0,
    messages = []
  }) {
    this.id = id;
    this.phone = phone || id;
    this.name = name;
    this.lastMessage = lastMessage;
    this.lastMessageTime = lastMessageTime;
    this.unreadCount = unreadCount;
    this.messages = messages;

    this.validate();
  }

  /**
   * Validates the conversation entity
   */
  validate() {
    if (!this.id) {
      throw new Error('WhatsAppConversation: id is required');
    }
    if (!this.phone && !this.id) {
      throw new Error('WhatsAppConversation: phone or id is required');
    }
    if (!this.name) {
      throw new Error('WhatsAppConversation: name is required');
    }
  }

  /**
   * Updates the conversation with new message information
   * @param {string} messageText - The message text
   * @param {string} timestamp - ISO timestamp
   */
  updateLastMessage(messageText, timestamp) {
    this.lastMessage = messageText;
    this.lastMessageTime = timestamp;
  }

  /**
   * Adds a message to the conversation
   * @param {WhatsAppMessage} message - The message to add
   */
  addMessage(message) {
    if (!this.messages) {
      this.messages = [];
    }
    this.messages.push(message);
  }

  /**
   * Gets the conversation ID for identification
   * @returns {string} The conversation identifier
   */
  getConversationId() {
    return this.id || this.phone;
  }

  /**
   * Checks if this conversation has unread messages
   * @returns {boolean} True if has unread messages
   */
  hasUnreadMessages() {
    return this.unreadCount > 0;
  }

  /**
   * Marks messages as read
   */
  markAsRead() {
    this.unreadCount = 0;
  }

  /**
   * Creates a copy of the conversation for state updates
   * @returns {WhatsAppConversation} New conversation instance
   */
  clone() {
    return new WhatsAppConversation({
      id: this.id,
      phone: this.phone,
      name: this.name,
      lastMessage: this.lastMessage,
      lastMessageTime: this.lastMessageTime,
      unreadCount: this.unreadCount,
      messages: [...(this.messages || [])]
    });
  }
}

















