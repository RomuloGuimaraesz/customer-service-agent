import { useWhatsAppConversations as useWhatsAppConversationsContext } from '../contexts/WhatsAppConversationsContext';

/**
 * Custom hook for WhatsApp conversations data fetching
 * 
 * This hook wraps the WhatsAppConversationsContext hook and provides a clean interface
 * for accessing conversations data, messages, loading states, error states, and fetching functions.
 * 
 * @returns {Object} Object containing:
 *   - conversations: Array of conversations
 *   - selectedConversation: Currently selected conversation object
 *   - loading: Object with loading states for conversations, messages, and sendMessage
 *   - error: Object with error states for conversations, messages, and sendMessage
 *   - lastUpdated: Object with lastUpdated dates for conversations
 *   - fetchConversations: Function to manually fetch conversations
 *   - refreshConversations: Function to refresh conversations data (alias for fetchConversations)
 *   - selectConversation: Function to select a conversation
 *   - fetchMessages: Function to fetch messages for a conversation
 *   - sendMessage: Function to send a message in a conversation
 * 
 * @example
 * const { conversations, selectedConversation, loading, fetchMessages, sendMessage } = useConversations();
 */
export const useConversations = () => {
  return useWhatsAppConversationsContext();
};






