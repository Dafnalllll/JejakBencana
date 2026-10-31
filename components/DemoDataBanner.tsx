interface DemoDataBannerProps {
  admin?: boolean;
}

export default function DemoDataBanner({ admin = false }: DemoDataBannerProps) {
  return (
    <div className="demo-banner" role="note">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 11v5m0-8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span>
        {admin
          ? "DATA CONTOH SISTEM ADMIN — JANGAN DITERBITKAN"
          : "DATA CONTOH — JANGAN DITERBITKAN"}
      </span>
    </div>
  );
}
