/**
 * Abas da superfície Contatos — ids únicos (prefixo contatos-) para analytics não colidir com o dashboard.
 */
import { isWhatsAppIntegrationEnabled } from './featureFlags.js';

export const ALL_CONTATOS_SURFACE_TABS = [
  { id: 'contatos-dados-contato', name: 'Dados do Contato' },
  { id: 'contatos-atendimentos', name: 'Atendimentos' },
  { id: 'contatos-whatsapp', name: 'WhatsApp' },
];

/** Tabs visible on the Contatos surface (WhatsApp omitted when integration is off). */
export const CONTATOS_SURFACE_TABS = ALL_CONTATOS_SURFACE_TABS.filter(
  tab => tab.id !== 'contatos-whatsapp' || isWhatsAppIntegrationEnabled(),
);
