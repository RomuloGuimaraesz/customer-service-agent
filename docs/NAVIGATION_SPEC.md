# Navigation spec — app-level vs view-level

This specification defines the navigation model where **`MainNavigation` (header pill)** controls **app-level routing**, while **Tabs** control **intra-view navigation**.

## Component identity

| Item | Detail |
|------|--------|
| **App-level nav component** | `MainNavigation` |
| **Scope** | Global (Header), visible on authenticated screens |
| **Responsibility** | Route between **top-level views** (e.g. Dashboard, Contatos) |
| **View-level nav component** | Tabs |
| **Scope** | Inside a specific view (e.g. Dashboard) |
| **Responsibility** | Switch **subsections** within the active view |

## Navigation layers

- **Layer 1 — App navigation (global)**
  - Controlled by `MainNavigation`
  - Switching here changes the **active route / surface**

- **Layer 2 — View navigation (local)**
  - Controlled by Tabs within the surface
  - Switching here does **not** change the surface, only its content

## `MainNavigation` behavior

### Visual state

- The **selected** button is the **black** one.
- The other button uses the **tertiary** style (currently `#f2f2f2`).

### Semantics / accessibility

- Container: `<nav aria-label="Navegação principal">`
- Buttons:
  - Dashboard: `aria-label="Dashboard"`
  - Contatos: `aria-label="Contatos"`
- Selected state must also be conveyed with **either**:
  - `aria-current="page"` on the active button (recommended for route-based nav), **or**
  - `aria-pressed` if treating the two buttons as a toggle group

Pick one approach and apply consistently.

### Routing responsibility

`MainNavigation` is responsible for:

- Reading the current location (route) to determine which button is selected.
- Navigating to the target route when a button is clicked.

`MainNavigation` must not depend on Tabs state.

### Route mapping (conceptual)

- **Dashboard button**
  - Routes to: Dashboard surface route
  - Selected when: current route is within the Dashboard surface (including its subroutes)

- **Contatos button**
  - Routes to: Contatos surface route
  - Selected when: current route is within the Contatos surface (including its subroutes)

Exact route constants must come from the app’s routing config (e.g. `ROUTES`) to avoid string duplication.

## Tabs behavior (inside surfaces)

- Tabs are scoped to a surface (e.g. Dashboard).
- Tabs change subsections within that surface.
- Tabs must not switch to other app-level surfaces (no Contatos/Dashboard switching).

## Interaction rules

- Clicking **Dashboard** in `MainNavigation` routes to the Dashboard surface (and its default subsection if applicable).
- Clicking **Contatos** routes to the Contatos surface.
- Clicking the already-selected surface should be a **no-op** (recommended) to avoid unnecessary remounts.

## Out of scope (later)

- Persistence rules when switching surfaces (e.g. remember last selected tab per surface).
- Analytics tracking for navigation events.
- Enhanced keyboard navigation beyond default button semantics.

