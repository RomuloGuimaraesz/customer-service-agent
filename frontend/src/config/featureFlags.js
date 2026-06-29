/**
 * Feature flags — toggle incomplete or external integrations without removing code.
 */

/**
 * When false, hides dashboard/contatos WhatsApp tabs and redirects
 * `/dashboard/whatsapp` until Meta WhatsApp Business API is integrated.
 */
export const WHATSAPP_INTEGRATION_ENABLED = false;

export const isWhatsAppIntegrationEnabled = () => WHATSAPP_INTEGRATION_ENABLED;
