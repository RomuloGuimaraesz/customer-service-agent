# Header pill switcher — layout spec

Specification for the **pill-shaped main navigation** in the app header. Icons and routing are out of scope unless noted below; geometry and tokens are authoritative for the first implementation slice.

## Component identity

| Item | Detail |
|------|--------|
| **React name** | `MainNavigation` |
| **Module** | Standalone component (e.g. `frontend/src/components/MainNavigation.jsx`), **reusable** — not defined inside `Header.jsx`. Import where needed (e.g. dashboard shell). |

## Placement in `Header`

- **`MainNavigation` is horizontally centered** in the header bar (visual center of the header), not grouped only with the right-side actions.
- **Implementation note:** The header layout will need a three-region pattern (e.g. left cluster, centered `MainNavigation`, right cluster) so the pill stays centered regardless of unequal left/right width. Exact flex/grid structure is left to implementation as long as the pill remains centered.

## Outer container (pill)

| Property | Value |
|----------|--------|
| Width | **76px** |
| Height | **40px** |
| Padding | **4px** on all sides |
| Gap (between the two controls) | **4px** |
| **Background (pill fill)** | **White**, using design tokens: **`theme.colors.background.white`** (`#ffffff` in `theme.js`), consistent with global layout tokens in `GlobalStyles.js` / `theme.js` (`box-sizing: border-box` aligns with global `* { box-sizing: border-box; }`). |

Treat the pill as a single flex row: horizontal main axis, centered cross-axis, `box-sizing: border-box`.

## Inner content box (after padding)

With **4px** padding on each side:

- **Width:** 76 − 8 = **68px**
- **Height:** 40 − 8 = **32px**

## Round buttons (placeholders, no icons yet)

Two equal circular **`button`** elements (`type="button"`) side by side inside the inner box:

- **Gap** between them: **4px**
- **Each circle diameter:** (68 − 4) ÷ 2 = **32px**

| Control | Background | `aria-label` |
|---------|------------|----------------|
| **Left** (far left) | **`#000000`** (fixed; matches existing spec) | **`Dashboard`** |
| **Right** | **`theme.colors.button.tertiary`** (`#f2f2f2` in `theme.js`) | **`Contatos`** |

So each round button is **32×32px**, matching the inner height so the layout is consistent with the 4px padding.

```
┌──────────────────────────────────────────── 76px ────────────────────────────────────────────┐
│ 4px padding                                                                                │
│   ┌──────── 32px ────────┐ 4px ┌──────── 32px ────────┐                                    │
│   │                      │ gap │                      │                                    │
│   │    round button      │     │    round button      │   inner height 32px               │
│   │   (#000000)          │     │  (#f2f2f2 tertiary)  │                                    │
│   └──────────────────────┘     └──────────────────────┘                                    │
│                         white pill (theme.colors.background.white)                           │
└────────────────────────────────────────────────────────────────────────────────────────────┘
                                    total height 40px
```

## CSS-oriented summary

- Pill: `width: 76px`, `height: 40px`, `padding: 4px`, `background-color: ${theme.colors.background.white}`, `box-sizing: border-box`
- Flex row: `display: flex`, `align-items: center`, `gap: 4px`
- Left child: `width: 32px`, `height: 32px`, `border-radius: 50%`, `flex-shrink: 0`, background `#000000`
- Right child: same dimensions, `border-radius: 50%`, `flex-shrink: 0`, background `theme.colors.button.tertiary`

## Out of scope (later)

- Icon glyphs inside the circles, active/selected state visuals, and wiring to routes or view mode (unless added in a future revision of this doc).
