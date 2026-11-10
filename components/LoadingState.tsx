type LoadingVariant = "list" | "detail" | "form" | "dashboard";

const rowCounts: Record<LoadingVariant, number> = {
  list: 3,
  detail: 2,
  form: 4,
  dashboard: 3,
};

export default function LoadingState({
  label = "Memuat...",
  variant = "list",
}: Readonly<{ label?: string; variant?: LoadingVariant }>) {
  return (
    <div className={`content-skeleton content-skeleton--${variant}`} role="status" aria-label={label} aria-live="polite">
      <span className="sr-only">{label}</span>
      {variant === "detail" ? (
        <article className="skeleton-card skeleton-card--detail" aria-hidden="true">
          <span className="skeleton-block skeleton-block--short" />
          <span className="skeleton-block skeleton-block--title" />
          <span className="skeleton-block skeleton-block--text" />
          <span className="skeleton-block skeleton-block--text" />
          <span className="skeleton-block skeleton-block--wide" />
        </article>
      ) : variant === "form" ? (
        <article className="skeleton-card skeleton-card--form" aria-hidden="true">
          {Array.from({ length: rowCounts.form }, (_, index) => (
            <span className="skeleton-field" key={index}>
              <span className="skeleton-block skeleton-block--short" />
              <span className="skeleton-block skeleton-block--input" />
            </span>
          ))}
          <span className="skeleton-block skeleton-block--button" />
        </article>
      ) : (
        <div className="skeleton-list" aria-hidden="true">
          {Array.from({ length: rowCounts[variant] }, (_, index) => (
            <article className="skeleton-card" key={index}>
              <span className="skeleton-block skeleton-block--short" />
              <span className="skeleton-block skeleton-block--title" />
              <span className="skeleton-block skeleton-block--text" />
              <span className="skeleton-block skeleton-block--text skeleton-block--text-last" />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
