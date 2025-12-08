import data from "@/app/list100.json";

type Item = { text: string; status: "done" | "todo" };

export default function List100Page() {
  const items = (data.list100 as Item[]) || [];
  const done = items.filter((i) => i.status === "done").length;
  const total = items.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 space-y-6">
      <h1 className="font-display text-4xl">List 100</h1>
      <p className="text-muted">Created on: April 30, 2024</p>
      <p className="text-muted">Note: I have intentionally decided to never add/remove any items from this list. It is here to capture a moment in time when I was 22 years old and thought I wanted all of the following things to happen before I turn 100. </p>
      <div className="flex items-center gap-3 text-sm">
        <span className="font-medium">Completed {done} of {total} ({pct}%)</span>
        <div className="h-2 w-40 rounded bg-foreground/10">
          <div className="h-2 rounded bg-foreground" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <li key={idx} className={`rounded-lg ring-1 ring-muted/50 bg-foreground/5 p-3 ${item.status === "done" ? "bg-foreground/20" : "bg-foreground/5"}`}>
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 inline-grid place-items-center h-5 w-5 shrink-0 rounded-full border ${item.status === "done" ? "bg-foreground text-background" : "border-foreground/40 text-foreground/60"}`}>
                {item.status === "done" ? (
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                    <path d="M6.5 11.2 3.8 8.5l-1 1 3.7 3.7 7-7-1-1z" fill="currentColor" />
                  </svg>
                ) : null}
              </span>
              <span className={item.status === "done" ? "text-foreground/60" : ""}>{item.text}</span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}


