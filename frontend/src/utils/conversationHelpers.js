/**
 * Helper utilities for conversation-related operations
 */

/**
 * Checks if the application is in demo mode (no authentication header)
 * @param {string|null} authHeader - Authentication header string
 * @returns {boolean} True if in demo mode, false otherwise
 */
export const isDemoMode = (authHeader) => {
  return !authHeader;
};

/**
 * Normalizes a conversation ID by using id or phone field
 * @param {Object} conversation - Conversation object
 * @returns {string|null} Normalized conversation ID
 */
export const normalizeConversationId = (conversation) => {
  if (!conversation) return null;
  return conversation.id || conversation.phone || null;
};

/**
 * Finds a conversation by ID in a list of conversations
 * @param {string} conversationId - The conversation ID to find
 * @param {Array} conversations - Array of conversation objects
 * @returns {Object|undefined} Found conversation or undefined
 */
export const findConversationById = (conversationId, conversations) => {
  if (!conversationId || !Array.isArray(conversations)) {
    return undefined;
  }
  
  return conversations.find(conv => 
    (conv.id || conv.phone) === conversationId
  );
};

