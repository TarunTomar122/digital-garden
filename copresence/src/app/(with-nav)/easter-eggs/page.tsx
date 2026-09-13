import Link from "next/link";

const eggs = [
  {
    emoji: "⚡",
    title: "Obsession with Speed",
    body: (
      <p className="note">
        Navigation links are prefetched instantly, while content pages are
        smartly loaded when you hover or scroll to them. Combined with
        server-side caching, clicking through feels snappy — pages load almost
        instantly after the first visit.
      </p>
    ),
  },
  {
    emoji: "👥",
    title: "Digital Copresence",
    body: (
      <>
        <p className="note">
          This garden is never truly empty. If you open this site in multiple
          tabs (or someone else is browsing at the same time), you&apos;ll see
          soft glows appear on the page — areas where other people&apos;s
          cursors are. Open two tabs and move your mouse around to see it in
          action.
        </p>
        <p className="note">
          The glow isn&apos;t intrusive or distracting — it&apos;s just a
          gentle reminder that this space is alive and shared. Each visitor
          gets their own color, and multiple people create overlapping zones
          of light, like collective attention painting the page.
        </p>
      </>
    ),
  },
  {
    emoji: "🌌",
    title: "Garden Galaxy",
    body: (
      <>
        <p className="note">
          A force-directed map of everything I&apos;ve written and built —
          projects, writings, and experience — connected by semantic
          similarity instead of folders or dates. Closer nodes mean more
          related ideas.
        </p>
        <p className="note">
          Explore it here: <Link href="/network">Garden Galaxy</Link>
        </p>
      </>
    ),
  },
  {
    emoji: "🤖",
    title: "Tarat&apos;s AI",
    body: (
      <>
        <p className="note">
          I use a custom embedding model + RAG to answer questions about all
          the content on this site. You can ask it about my projects, books,
          writings, etc.
        </p>
        <p className="note">
          Go chat with it here: <Link href="/tarat-ai">Tarat&apos;s AI</Link>
        </p>
      </>
    ),
  },
];

export default function EasterEggs() {
  return (
    <main className="raw-doc">
      <div className="raw-doc-inner">
        <header className="page-head">
          <p className="page-kicker">Extras</p>
          <h1>Easter Eggs 🥚</h1>
          <p className="note">
            Things I built to make this garden feel alive. Small touches,
            hidden in plain sight.
          </p>
        </header>

        <div className="egg-list">
          {eggs.map((egg) => (
            <section key={egg.title} className="panel egg-panel">
              <h2 className="egg-title">
                <span className="egg-emoji" aria-hidden="true">
                  {egg.emoji}
                </span>
                {egg.title}
              </h2>
              {egg.body}
            </section>
          ))}
        </div>

        <footer>
          <p className="note">
            Found something cool? These little touches make the garden feel
            more human. ✨
          </p>
        </footer>
      </div>
    </main>
  );
}
