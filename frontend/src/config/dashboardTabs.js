/**
 * Dashboard tabs configuration
 * Static tab definitions (id and label)
 * Dynamic counts are added in the component
 */
import { isWhatsAppIntegrationEnabled } from './featureFlags.js';

export const ALL_DASHBOARD_TABS = [
  { id: 'agendamentos', label: 'Agendamentos' },
  { id: 'pedidos', label: 'Pedidos' },
  { id: 'atendimentos', label: 'Atendimentos' },
  { id: 'whatsapp', label: 'WhatsApp' },
];

/** Tabs visible in the dashboard UI (WhatsApp omitted when integration is off). */
export const DASHBOARD_TABS = ALL_DASHBOARD_TABS.filter(
  tab => tab.id !== 'whatsapp' || isWhatsAppIntegrationEnabled(),
);

/**
 * Valid tab IDs array (derived from DASHBOARD_TABS)
 * Used for validation and route checking
 */
export const VALID_TAB_IDS = DASHBOARD_TABS.map(tab => tab.id);

/**
 * Default tab ID
 * Used as fallback when route doesn't match any valid tab
 */
export const DEFAULT_TAB_ID = 'pedidos';
