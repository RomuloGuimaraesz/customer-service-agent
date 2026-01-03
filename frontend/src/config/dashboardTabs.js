/**
 * Dashboard tabs configuration
 * Static tab definitions (id and label)
 * Dynamic counts are added in the component
 */
export const DASHBOARD_TABS = [
  { id: 'agendamentos', label: 'Agendamentos' },
  { id: 'pedidos', label: 'Pedidos' },
  { id: 'whatsapp', label: 'WhatsApp' },
];

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

