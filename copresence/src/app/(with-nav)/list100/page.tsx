import data from "@/app/list100.json";

type Item = { text: string; status: "done" | "todo" };

export default function List100Page() {
  const items = (data.list100 as Item[]) || [];
  const done = items.filter((i) => i.status === "done").length;
  const total = items.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <main className="raw-doc">
      <div className="raw-doc-inner">
        <header className="page-head">
          <h1>
            List 100 <span className="page-count">({done}/{total})</span>
          </h1>
          <p className="note">
            Created on April 30, 2024. I have intentionally decided to not
            add or remove any items from this list. It captures a moment in
            time when I was 22 years old and thought I wanted all of the
            following things to happen before I turn 100.
          </p>
        </header>

        <div className="panel progress-card">
          <div className="progress-row">
            <span className="progress-label">
              {done} of {total} done
            </span>
            <span className="progress-pct">{pct}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <ul className="goal-list">
          {items.map((item, idx) => (
            <li
              key={idx}
              className={`goal ${item.status === "done" ? "done" : ""}`}
              style={{ animationDelay: `${Math.min(idx * 18, 420)}ms` }}
            >
              <span className="goal-mark" aria-hidden="true">
                {item.status === "done" ? "✓" : "○"}
              </span>
              <span className="goal-text">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
