import Link from "next/link";

export default function EasterEggs() {
  return (
    <main className="raw-doc">
      <div className="raw-doc-inner">
        <header>
          <h1>Easter Eggs 🥚</h1>
          <p className="note">Things I built to make this garden feel alive.</p>
        </header>

        <section>
          <h2>Obsession with Speed</h2>
          <p className="note">
            Navigation links are prefetched instantly, while content pages are smartly loaded when
            you hover or scroll to them. Combined with server-side caching, clicking through feels
            snappy — pages load almost instantly after the first visit. It&apos;s a balance between
            speed and not overwhelming the server.
          </p>
        </section>

        <section>
          <h2>Digital Copresence</h2>
          <p className="note">
            This garden is never truly empty. If you open this site in multiple tabs (or someone
            else is browsing at the same time), you&apos;ll see soft glows appear on the page — areas
            where other people&apos;s cursors are. It&apos;s a subtle way to feel the presence of others
            sharing this digital space with you. Open two tabs and move your mouse around to see it
            in action.
          </p>
          <p className="note">
            The glow isn&apos;t intrusive or distracting — it&apos;s just a gentle reminder that this
            space is alive and shared. Each visitor gets their own color, and multiple people create
            overlapping zones of light, like collective attention painting the page.
          </p>
        </section>

        <section>
          <h2>Garden Galaxy</h2>
          <p className="note">
            A force-directed map of everything I&apos;ve written and built — projects, writings, and
            experience — connected by semantic similarity instead of folders or dates. Closer nodes
            mean more related ideas.
          </p>
          <p className="note">
            Explore it here: <Link href="/network">Garden Galaxy</Link>
          </p>
        </section>

        <section>
          <h2>Tarat&apos;s AI</h2>
          <p className="note">
            I use a custom embedding model + RAG to answer questions about all the content on this
            site. You can ask it about my projects, books, writings, etc.
          </p>
          <p className="note">
            Go chat with it here: <Link href="/tarat-ai">Tarat&apos;s AI</Link>
          </p>
        </section>

        <footer>
          <p className="note">Found something cool? These little touches make the garden feel more human. ✨</p>
        </footer>
      </div>
    </main>
  );
}
