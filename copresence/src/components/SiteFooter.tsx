import Link from "next/link";

const links = [
  { label: "Writings", href: "/writings" },
  { label: "Projects", href: "/projects" },
  { label: "Library", href: "/library" },
  { label: "Timeline", href: "/timeline" },
  { label: "List 100", href: "/list100" },
  { label: "Startups", href: "/startups" },
  { label: "Resume", href: "/resume" },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-top">
          <p className="site-footer-brand">Tarat&apos;s Garden</p>
          <nav className="site-footer-links" aria-label="Site">
            {links.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="site-footer-note">
          got an ai agent? give it <a href="/llms.txt">this</a> and ask about
          me.
        </p>
      </div>
    </footer>
  );
}
