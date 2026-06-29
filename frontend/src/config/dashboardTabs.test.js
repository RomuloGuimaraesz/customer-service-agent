import { describe, expect, it, vi, afterEach } from 'vitest';

describe('dashboardTabs with WhatsApp integration flag', () => {
  afterEach(() => {
    vi.resetModules();
  });

  it('omits whatsapp from DASHBOARD_TABS when integration is disabled', async () => {
    vi.doMock('./featureFlags.js', () => ({
      WHATSAPP_INTEGRATION_ENABLED: false,
      isWhatsAppIntegrationEnabled: () => false,
    }));

    const { DASHBOARD_TABS, VALID_TAB_IDS } = await import('./dashboardTabs.js');

    expect(DASHBOARD_TABS.map(tab => tab.id)).toEqual([
      'agendamentos',
      'pedidos',
      'atendimentos',
    ]);
    expect(VALID_TAB_IDS).not.toContain('whatsapp');
  });

  it('includes whatsapp when integration is enabled', async () => {
    vi.doMock('./featureFlags.js', () => ({
      WHATSAPP_INTEGRATION_ENABLED: true,
      isWhatsAppIntegrationEnabled: () => true,
    }));

    const { DASHBOARD_TABS, VALID_TAB_IDS } = await import('./dashboardTabs.js');

    expect(DASHBOARD_TABS.map(tab => tab.id)).toContain('whatsapp');
    expect(VALID_TAB_IDS).toContain('whatsapp');
  });
});

describe('contatosSurfaceTabs with WhatsApp integration flag', () => {
  afterEach(() => {
    vi.resetModules();
  });

  it('omits contatos-whatsapp when integration is disabled', async () => {
    vi.doMock('./featureFlags.js', () => ({
      WHATSAPP_INTEGRATION_ENABLED: false,
      isWhatsAppIntegrationEnabled: () => false,
    }));

    const { CONTATOS_SURFACE_TABS } = await import('./contatosSurfaceTabs.js');

    expect(CONTATOS_SURFACE_TABS.map(tab => tab.id)).toEqual([
      'contatos-dados-contato',
      'contatos-atendimentos',
    ]);
  });
});
