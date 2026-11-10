export default function GlobalLoadingView() {
  return (
    <div className="global-skeleton" role="status" aria-live="polite" aria-label="Memuat halaman">
      <span className="sr-only">Memuat halaman...</span>
      <div className="global-skeleton__heading" aria-hidden="true">
        <span className="skeleton-block skeleton-block--short" />
        <span className="skeleton-block skeleton-block--title" />
        <span className="skeleton-block skeleton-block--text" />
      </div>
      <div className="global-skeleton__filters" aria-hidden="true">
        <span className="skeleton-block skeleton-block--input" />
        <span className="skeleton-block skeleton-block--input" />
        <span className="skeleton-block skeleton-block--input" />
      </div>
      <div className="global-skeleton__cards" aria-hidden="true">
        {[0, 1, 2].map((item) => (
          <article className="skeleton-card" key={item}>
            <span className="skeleton-block skeleton-block--short" />
            <span className="skeleton-block skeleton-block--title" />
            <span className="skeleton-block skeleton-block--text" />
            <span className="skeleton-block skeleton-block--text skeleton-block--text-last" />
          </article>
        ))}
      </div>
    </div>
  );
}
