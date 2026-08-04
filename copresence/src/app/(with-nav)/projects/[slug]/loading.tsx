export default function ProjectLoading() {
  return (
    <main aria-busy="true" className="mx-auto max-w-3xl px-4 py-16">
      <p role="status" className="mb-6 animate-pulse text-sm text-[#777]">Loading project…</p>
      <div className="animate-pulse space-y-4" aria-hidden="true">
        <div className="h-10 w-3/4 rounded bg-foreground/10" />
        <div className="h-5 w-full rounded bg-foreground/10" />
        <div className="h-5 w-5/6 rounded bg-foreground/10" />
        <div className="h-5 w-2/3 rounded bg-foreground/10" />
      </div>
    </main>
  );
}
