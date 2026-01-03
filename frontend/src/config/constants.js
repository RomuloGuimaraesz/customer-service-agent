/**
 * Application configuration constants
 */
export const CONFIG = {
  // Your n8n webhook URLs (update after importing workflow)
  API_ENDPOINTS: {
    pedidos: 'https://archtechsystems.app.n8n.cloud/webhook/admin-pedidos',
    agendamentos: 'https://archtechsystems.app.n8n.cloud/webhook/admin-agendamentos',
    conversations: 'https://archtechsystems.app.n8n.cloud/webhook/admin-conversations',
    messages: 'https://archtechsystems.app.n8n.cloud/webhook/admin-messages',
    sendMessage: 'https://archtechsystems.app.n8n.cloud/webhook/admin-send-message',
  },
  // Session storage key
  AUTH_STORAGE_KEY: 'rapidy_admin_auth',
};


