const LAYOUTS = [
  {
    name: "Editorial single-column",
    direction:
      "Single flowing column. Name as a hero line. Sections separated by thin rules or generous whitespace. Magazine-like rhythm.",
  },
  {
    name: "Split header + timeline",
    direction:
      "Name and contact in a top band. Experience as a vertical timeline with dots and dates on the left. Projects as a compact list on the right on desktop.",
  },
  {
    name: "Card grid",
    direction:
      "Group projects and skills into soft cards with subtle borders. Experience stays linear. Visual hierarchy through card size, not color noise.",
  },
  {
    name: "Sidebar accent",
    direction:
      "Narrow left rail for contact, skills, and links. Main column for experience and projects. Rail uses muted background tint only.",
  },
  {
    name: "Dense Swiss",
    direction:
      "Tight typographic grid. Strong type scale contrast. Minimal decoration. Everything aligned to a clear baseline grid.",
  },
  {
    name: "Stacked bands",
    direction:
      "Full-width horizontal bands per section, alternating barely-there background tints (#fdf5e2 vs #f5edd8). Bold section labels.",
  },
  {
    name: "Project-forward",
    direction:
      "Open with featured projects as the visual centerpiece. Experience and education compressed below. Good for a builder portfolio feel.",
  },
  {
    name: "Minimal monospace labels",
    direction:
      "Section labels in small caps or monospace. Body in Inter. Lots of air. Links as underlined text only.",
  },
];

const ACCENTS = [
  "Use only black + muted gray — no accent color.",
  "Single accent: soft underline on links, nothing else.",
  "Tiny geometric markers (squares, dashes) before section titles.",
  "Section numbers (01, 02, 03) in muted monospace.",
  "Hairline borders between sections, no fills.",
  "Contact row as inline chips with subtle borders.",
];

const SECTION_ORDERS = [
  "Summary → Experience → Projects → Skills → Education → Contact",
  "Contact → Experience → Projects → Skills → Education",
  "Experience → Projects → Skills → Education → Contact",
  "Projects → Experience → Skills → Education → Contact",
  "Experience → Skills → Projects → Education → Contact",
];

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function pickCreativeDirection(): string {
  const layout = pick(LAYOUTS);
  const accent = pick(ACCENTS);
  const order = pick(SECTION_ORDERS);
  const seed = Math.random().toString(36).slice(2, 10);

  return `
CREATIVE DIRECTION (follow closely — make this generation visually distinct from a generic resume):
- Layout archetype: ${layout.name} — ${layout.direction}
- Visual accent: ${accent}
- Section order: ${order}
- Variation seed: ${seed}

Push the layout archetype. Do NOT default to the same centered single-column stack every time. Surprise within the tarat.space design language.
`.trim();
}