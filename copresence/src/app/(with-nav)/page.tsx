import Link from "next/link";
import { getTopTrack } from "@/actions/spotifyembed";
import RobotArm from "@/components/RobotArm";
import { getAllWritings } from "@/lib/writings";
import { getAllProjects } from "@/lib/projects";
import { getRecentTimeline, formatYearMonth } from "@/lib/timeline";
import books from "./library/books.json";

async function NowPlaying() {
  const top = await getTopTrack().catch(() => null);

  if (!top) return null;

  return (
    <p className="hero-now">
      <span className="hero-now-dot" aria-hidden="true" />
      listening to <strong>{top.name}</strong> by {top.artist}
    </p>
  );
}

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const elsewhere = [
  {
    href: "https://x.com/tarat_211",
    label: "X (Twitter)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 50 50" fill="currentColor"><path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"></path></svg>
    ),
  },
  {
    href: "https://www.youtube.com/@tarat.youtube",
    label: "YouTube",
    icon: (
      <svg width="22" height="22" viewBox="0 0 50 50" fill="currentColor"><path d="M 44.898438 14.5 C 44.5 12.300781 42.601563 10.699219 40.398438 10.199219 C 37.101563 9.5 31 9 24.898438 9 C 18.800781 9 12.601563 9.5 9.300781 10.199219 C 7.101563 10.699219 5.199219 12.199219 4.800781 14.5 C 4.398438 17 4 20.5 4 25 C 4 29.5 4.398438 33 4.898438 35.5 C 5.300781 37.699219 7.199219 39.300781 9.398438 39.800781 C 12.898438 40.5 18.898438 41 25 41 C 31.101563 41 37.101563 40.5 40.601563 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.101563 35.5 C 45.5 33 46 29.398438 46.101563 25 C 45.898438 20.5 45.398438 17 44.898438 14.5 Z M 20 32 L 20 18 L 32.199219 25 Z"></path></svg>
    ),
  },
  {
    href: "https://www.linkedin.com/in/tarun-tomar-4ab0b5193/",
    label: "LinkedIn",
    icon: (
      <svg width="20" height="20" viewBox="0 0 50 50" fill="currentColor"><path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"></path></svg>
    ),
  },
  {
    href: "https://www.instagram.com/tarat.hobbies/",
    label: "Instagram",
    icon: (
      <svg width="20" height="20" viewBox="0 0 50 50" fill="currentColor"><path d="M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z"></path></svg>
    ),
  },
  {
    href: "https://github.com/TarunTomar122",
    label: "GitHub",
    icon: (
      <svg width="22" height="22" viewBox="0 0 30 30" fill="currentColor"><path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path></svg>
    ),
  },
];

export default async function Home() {
  const writings = getAllWritings();
  const projects = getAllProjects();
  const recentWritings = writings.slice(0, 3);
  const recentProjects = projects.slice(0, 3);
  const timeline = getRecentTimeline(4);
  const reading = books.books.filter((b) => b.status === "reading").slice(0, 4);

  return (
    <main className="raw-doc">
      <div className="raw-doc-inner">
        <header className="hero">
          <div className="hero-robot">
            <RobotArm />
          </div>
          <div className="hero-text">
            <h1>Tarat</h1>
            <p className="hero-tagline">
              I like robots and AI.
              <br />
              Currently a student at{" "}
              <a href="https://www.ed.ac.uk" target="_blank" rel="noreferrer">
                University of Edinburgh
              </a>
              <br />
              Previously a design engineer at{" "}
              <a href="https://www.adobe.com" target="_blank" rel="noreferrer">
                Adobe
              </a>
              .
            </p>
          </div>
        </header>

        <div className="hero-below">
          <ul className="icon-links hero-icons">
            {elsewhere.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  title={item.label}
                >
                  {item.icon}
                </a>
              </li>
            ))}
          </ul>

          <NowPlaying />
        </div>

        <section>
          <div className="section-head">
            <h2>
              Selected writing <span className="count">({writings.length})</span>
            </h2>
            <p>Essays, notes, and things I learn the hard way — written by me.</p>
          </div>
          <ul className="cards">
            {recentWritings.map((w) => (
              <li key={w.slug}>
                <Link href={`/writings/${w.slug}`} className="card">
                  <div className="card-row">
                    <div className="card-body">
                      <h3 className="card-title">{w.title}</h3>
                      <p className="card-meta">{formatDate(w.date)}</p>
                      {w.description ? (
                        <p className="card-desc">{w.description}</p>
                      ) : null}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <p className="section-more">
            <Link href="/writings">All writings →</Link>
          </p>
        </section>

        <section>
          <div className="section-head">
            <h2>
              Projects <span className="count">({projects.length})</span>
            </h2>
            <p>Experiments and builds. Written with AI, so it might smell like slop.</p>
          </div>
          <ul className="cards">
            {recentProjects.map((p) => (
              <li key={p.slug}>
                <Link href={`/projects/${p.slug}`} className="card">
                  <div className="card-row">
                    <div className="card-body">
                      <h3 className="card-title">{p.title}</h3>
                      {p.tags && p.tags.length > 0 ? (
                        <p className="card-meta">{p.tags.join(" · ")}</p>
                      ) : null}
                      {p.description ? (
                        <p className="card-desc">{p.description}</p>
                      ) : null}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <p className="section-more">
            <Link href="/projects">All projects →</Link>
          </p>
        </section>

        <section>
          <div className="section-head">
            <h2>Recently on the timeline</h2>
            <p>Little proofs of progress.</p>
          </div>
          <ul className="cards">
            {timeline.map((item) => (
              <li key={`${item.date}-${item.title}`}>
                <div className="panel">
                  <div className="card-row">
                    <div className="card-body">
                      <h3 className="card-title card-title-sm">
                        {item.link ? (
                          <a href={item.link} target="_blank" rel="noreferrer">
                            {item.title}
                          </a>
                        ) : (
                          item.title
                        )}
                      </h3>
                      <p className="card-meta">
                        {formatYearMonth(item.date)}
                        {item.detail ? (
                          <>
                            <span className="sep">·</span>
                            {item.detail}
                          </>
                        ) : null}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="section-more">
            <Link href="/timeline">Full timeline →</Link>
          </p>
        </section>

        {reading.length > 0 ? (
          <section>
            <div className="section-head">
              <h2>On the nightstand</h2>
              <p>What I&apos;m reading right now.</p>
            </div>
            <ul className="card-grid">
              {reading.map((b, idx) => (
                <li key={`${b.title}-${idx}`}>
                  <a
                    href={b.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card book-card"
                  >
                    <div className="book-row">
                      <img
                        className="book-cover"
                        src={b.img}
                        alt={b.title}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="book-info">
                        <p className="book-title">{b.title}</p>
                        <p className="book-author">{b.author}</p>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
            <p className="section-more">
              <Link href="/library">The whole library →</Link>
            </p>
          </section>
        ) : null}
      </div>

      <Link href="/easter-eggs" aria-label="Psst, an easter egg" className="egg-link">
        🥚
      </Link>
    </main>
  );
}
