/**
 * Application configuration constants
 */
export const CONFIG = {
  // Your n8n webhook URLs (update after importing workflow)
  API_ENDPOINTS: {
    contatos: 'https://archtechsystems.app.n8n.cloud/webhook/admin-contatos',
    contatosPost: 'https://archtechsystems.app.n8n.cloud/webhook/admin-contatos-post',
    contatosPut: 'https://archtechsystems.app.n8n.cloud/webhook/admin-contatos-put',
    contatosDelete: 'https://archtechsystems.app.n8n.cloud/webhook/admin-contatos-delete',
    categorias: 'https://archtechsystems.app.n8n.cloud/webhook/admin-categorias',
    agendamentos: 'https://archtechsystems.app.n8n.cloud/webhook/admin-agendamentos',
    atendimentos: 'https://archtechsystems.app.n8n.cloud/webhook/admin-atendimentos',
    pedidos: 'https://archtechsystems.app.n8n.cloud/webhook/admin-pedidos'

  },
  // Session storage key
  AUTH_STORAGE_KEY: 'avecta_admin_auth',
};
