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
        <header>
          <h1>List 100</h1>
          <p className="note">Created on April 30, 2024.</p>
          <p className="note">
            Note: I have intentionally decided to never add/remove any items from this list. It is
            here to capture a moment in time when I was 22 years old and thought I wanted all of
            the following things to happen before I turn 100.
          </p>
        </header>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <span style={{ fontWeight: 600, fontSize: "14px" }}>{done} of {total} done ({pct}%)</span>
          <div style={{ height: "6px", width: "140px", borderRadius: "3px", background: "#eee" }}>
            <div style={{ height: "6px", borderRadius: "3px", background: "#222", width: `${pct}%` }} />
          </div>
        </div>

        <ul className="list-plain">
          {items.map((item, idx) => (
            <li key={idx} style={{ color: item.status === "done" ? "#5f5f5f" : "#222", textDecoration: item.status === "done" ? "line-through" : "none" }}>
              {item.status === "done" ? "✓ " : "— "}{item.text}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}


