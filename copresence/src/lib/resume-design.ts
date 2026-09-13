// Condensed from https://vercel.com/design.md — kept local to avoid a network
// round-trip and a multi-KB prompt on every generation.

const GARDEN_DESIGN = `
## Tarat's Garden (tarat.space)

Native page feel — not a separate template.

Colors:
- paper: #fdf5e2
- card: #ffffff
- ink: #1c1917
- ink-soft: #57534e
- muted: #78716c
- line: #e7decb
- star: #eab308

Typography:
- Everything: Domine, Georgia, "Times New Roman", serif (headings weight 700, tight letter-spacing)
- Body: 15px / 1.65, headings generous margins

Layout: max-width ~42rem, generous vertical rhythm, hairline borders in #e7decb, cards = #fff with 10px radius and a 1px #e7decb border. Clean, serif, paper-like.
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