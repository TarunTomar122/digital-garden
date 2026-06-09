
import Link from "next/link";
import { getTopTrack } from "@/actions/spotifyembed";

async function NowPlaying() {
  const top = await getTopTrack().catch(() => null);

  if (!top) return null;

  return (
    <p className="text-muted leading-relaxed">
      I&apos;ve been listening to{" "}
      <span className="underline decoration-dotted underline-offset-4 decoration-muted/40">
        {top.name} by {top.artist}
      </span>{" "}
      lately.
    </p>
  );
}

export default async function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 space-y-8">

      {/* Hero */}
      <header className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl tracking-tight">Tarats Garden 🌱</h1>
      </header>

      {/* Intro */}
      <section className="space-y-4 mb-10">
        <p className="text-lg leading-relaxed">
          A place for notes, projects, and loose thoughts from my work as a design engineer at Adobe and things I build on my own. Mostly about <span className="font-medium">AI, design, and productivity</span>. Occasionally about <span className="font-medium">running, cooking, and longevity</span>.
        </p>
        <NowPlaying />
      </section>

      {/* Navigation */}
      <nav className="space-y-6 mb-12">
        <Link prefetch href="/startups" className="block space-y-1 group">
          <span className="text-lg font-medium underline underline-offset-4 group-hover:opacity-80">/startups</span>
          <p className="text-muted">building stuff, one stupid idea at a time</p>
        </Link>
        <Link prefetch href="/writings" className="block space-y-1 group">
          <span className="text-lg font-medium underline underline-offset-4 group-hover:opacity-80">/writings</span>
          <p className="text-muted">blogs, shower thoughts, rants</p>
        </Link>
        <Link prefetch href="/projects" className="block space-y-1 group">
          <span className="text-lg font-medium underline underline-offset-4 group-hover:opacity-80">/projects</span>
          <p className="text-muted">experiments and builds</p>
        </Link>
        <Link prefetch href="/library" className="block space-y-1 group">
          <span className="text-lg font-medium underline underline-offset-4 group-hover:opacity-80">/library</span>
          <p className="text-muted">books and reads</p>
        </Link>
        <Link prefetch href="/timeline" className="block space-y-1 group">
          <span className="text-lg font-medium underline underline-offset-4 group-hover:opacity-80">/timeline</span>
          <p className="text-muted">progress and milestones</p>
        </Link>
        <Link prefetch href="/list100" className="block space-y-1 group">
          <span className="text-lg font-medium underline underline-offset-4 group-hover:opacity-80">/list100</span>
          <p className="text-muted">goals and wishes</p>
        </Link>
      </nav>

      {/* Footer */}
      <footer className="pt-8 border-t border-foreground/5 space-y-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted">elsewhere</span>
          <div className="flex items-center gap-3">
            <a href="https://x.com/tarat_211" target="_blank" rel="noreferrer" aria-label="X" className="text-muted hover:text-foreground transition-colors">
              <svg width="18" height="18" viewBox="0 0 50 50" fill="currentColor"><path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"></path></svg>
            </a>
            <a href="https://www.linkedin.com/in/tarun-tomar-4ab0b5193/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted hover:text-foreground transition-colors">
              <svg width="18" height="18" viewBox="0 0 50 50" fill="currentColor"><path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"></path></svg>
            </a>
            <a href="https://www.instagram.com/tarat.hobbies/" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-muted hover:text-foreground transition-colors">
              <svg width="18" height="18" viewBox="0 0 50 50" fill="currentColor"><path d="M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z"></path></svg>
            </a>
            <a href="https://github.com/TarunTomar122" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-muted hover:text-foreground transition-colors">
              <svg width="18" height="18" viewBox="0 0 30 30" fill="currentColor"><path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path></svg>
            </a>
          </div>
        </div>
        <p className="text-sm text-muted leading-relaxed">
          got an ai agent? give it{" "}
          <a
            href="/llms.txt"
            className="underline underline-offset-4 decoration-muted hover:text-foreground transition-colors"
          >
            this
          </a>{" "}
          and ask about me :)
        </p>
      </footer>

      </main>
  );
}
