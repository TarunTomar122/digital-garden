export default function WritingLoading() {
  return (
    <main aria-busy="true" className="raw-doc">
      <div className="raw-doc-inner">
        <p role="status" className="note" style={{ marginBottom: "20px" }}>
          Loading writing…
        </p>
        <div className="skeleton-stack">
          <div className="skeleton skeleton-title" />
          <div className="skeleton" />
          <div className="skeleton" style={{ width: "86%" }} />
          <div className="skeleton" style={{ width: "68%" }} />
        </div>
      </div>
    </main>
  );
}
