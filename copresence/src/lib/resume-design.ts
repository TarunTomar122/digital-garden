// Condensed from https://vercel.com/design.md — kept local to avoid a network
// round-trip and a multi-KB prompt on every generation.

const GARDEN_DESIGN = `
## Tarats Garden (tarat.space)

Native page feel — not a separate template.

Colors:
- background: #fdf5e2
- foreground: #000000
- muted: #6b7280

Typography:
- Headings: Canela, Georgia, serif
- Body: Inter, ui-sans-serif, system-ui, sans-serif

Layout: max-width ~48rem, generous vertical rhythm, subtle borders at ~10% foreground opacity.
`;

const GEIST_SUMMARY = `
## Geist (Vercel design system, light theme)

Minimal, high-contrast, whitespace-first. Restrained color; hierarchy via typography and spacing.

Spacing: 4px scale — 16px between groups, 32–40px between sections.
Radii: 6px controls/cards, 12px menus.
Shadow (cards): 0 2px 2px rgba(0,0,0,0.04)
Text: gray-1000 (#171717) primary, gray-900 (#4d4d4d) secondary.
Links/accent: blue-700 (#006bff).
Headings: tight negative letter-spacing. Body: 14–16px.
`;

export function loadDesignContext(): string {
  return `${GARDEN_DESIGN}\n${GEIST_SUMMARY}`;
}