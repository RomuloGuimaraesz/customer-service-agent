# WhatsApp integration temporarily disabled

**Status:** disabled (pending Meta WhatsApp Business API)  
**Flag:** `frontend/src/config/featureFlags.js` → `WHATSAPP_INTEGRATION_ENABLED = false`

---

## Why

The dashboard **WhatsApp** tab and the `/dashboard/whatsapp` route depend on a real **Meta WhatsApp Business API** integration (webhooks, send/receive, credentials). That work is not finished yet. Until it is, exposing the tab/route would show incomplete UI and mock or broken flows.

Contact records still store a **WhatsApp phone field** on the Contatos surface — that is unrelated to this flag and remains available.

---

## What was changed

| Area | Behavior while disabled |
|------|-------------------------|
| **Dashboard tab** | “WhatsApp” is hidden from the tab bar (`DASHBOARD_TABS`) |
| **Route** | Visiting `/dashboard/whatsapp` redirects to `/dashboard/pedidos` (default tab) |
| **Tab validation** | `whatsapp` is not in `VALID_TAB_IDS`; analytics/navigation treat unknown paths as default tab |
| **Contatos tab** | “WhatsApp” sub-tab on Contatos is hidden (`CONTATOS_SURFACE_TABS`) |

**Not removed:** WhatsApp-related code (`WhatsAppView`, contexts, repositories, n8n assets) stays in the repo so re-enabling is a one-line flag change.

---

## Files involved

| File | Role |
|------|------|
| `frontend/src/config/featureFlags.js` | Master switch |
| `frontend/src/config/dashboardTabs.js` | Filters WhatsApp out of visible dashboard tabs |
| `frontend/src/config/contatosSurfaceTabs.js` | Filters WhatsApp out of Contatos sub-tabs |
| `frontend/src/router/index.jsx` | Redirects `/dashboard/whatsapp` when disabled |

---

## How to re-enable (after Meta integration)

1. Complete Meta setup: app, phone number, webhook URL, tokens, and n8n/backend wiring.
2. Verify send/receive in `WhatsAppView` against production (not demo/mock).
3. Set in `featureFlags.js`:

   ```js
   export const WHATSAPP_INTEGRATION_ENABLED = true;
   ```

4. Smoke-test:
   - Dashboard shows the WhatsApp tab
   - `/dashboard/whatsapp` loads the chat UI
   - Contatos shows the WhatsApp sub-tab (if that surface is implemented by then)
   - Tab analytics still record `whatsapp` / `contatos-whatsapp` events

5. Delete or archive this document if the integration is permanent.

---

## Related docs / code

- Dashboard WhatsApp UI: `frontend/src/components/whatsapp/WhatsAppView.jsx`
- Conversations context: `frontend/src/contexts/WhatsAppConversationsContext.jsx`
- n8n workflow assets: `frontend/assets/n8n/`
- Route constant (still defined): `ROUTES.DASHBOARD.WHATSAPP` in `frontend/src/config/routes.js`

---

*Created when WhatsApp was hidden until Meta integration is ready.*
