export default function EasterEggs() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-5xl tracking-tight">Easter Eggs 🥚</h1>
        <p className="font-sans text-muted text-lg">Things I built to make this garden feel alive.</p>
      </header>

      <section className="space-y-8">
        <div className="border-l-2 border-muted/30 pl-4 py-2">
          <h2 className="font-display text-2xl mb-2">Crazy Fast Website</h2>
          <p className="font-sans text-lg leading-relaxed">
            We&apos;re prefetching all the links on this site. If you&apos;re on desktop, you&apos;ll notice that clicking through feels instant—like pages are already loaded. This is because it&apos;s quietly loading every link in the background as you browse. It&apos;s a small trick that makes the whole experience feel snappier.
          </p>
        </div>

        <div className="border-l-2 border-muted/30 pl-4 py-2">
          <h2 className="font-display text-2xl mb-2">Digital Copresence</h2>
          <p className="font-sans text-lg leading-relaxed">
            This garden is never truly empty. If you open this site in multiple tabs (or someone else is browsing at the same time), you'll see soft, warm glows appear on the page—areas where other people's cursors are. It's a subtle way to feel the presence of others sharing this digital space with you. Open two tabs and move your mouse around to see it in action.
          </p>
          <p className="font-sans text-lg leading-relaxed text-muted mt-3">
            The warmth you see isn't intrusive or distracting—it's just a gentle reminder that this space is alive and shared. Multiple people create zones of accumulated heat, like collective attention painting the page.
          </p>
        </div>
      </section>

      <section className="pt-8 border-t border-muted/20">
        <p className="font-sans text-muted text-center">
          Found something cool? These little touches make the garden feel more human. ✨
        </p>
      </section>
    </main>
  );
}
