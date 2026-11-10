import Link from "next/link";

const navigationLinks = [
  { label: "Beranda", href: "/" },
  { label: "Daftar Kasus", href: "/kasus" },
  { label: "Glosarium Terminologi", href: "/glosarium" },
  { label: "Portal Admin", href: "/admin" },
];

const referenceLinks = [
  { label: "Portal Resmi BNPB", href: "https://bnpb.go.id", external: true },
  {
    label: "Kementerian Keuangan RI",
    href: "https://www.kemenkeu.go.id",
    external: true,
  },
  { label: "Perka BNPB Penggunaan DSP", href: "https://bnpb.go.id", external: true },
  { label: "Metodologi Verifikasi Angka", href: "/metodologi" },
];

function FooterLink({
  href,
  label,
  external = false,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const className =
    "inline-flex w-fit items-center gap-1 text-[13px] leading-5 text-[#52617B] no-underline transition-colors hover:text-[#00796F] hover:underline";

  if (external) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer">
        {label}
        <svg
          className="size-3 shrink-0"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 3h7v7M13 3 6.5 9.5M11 9v4H3V5h4"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.3"
          />
        </svg>
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {label}
    </Link>
  );
}

export default function PublicFooter({
  home = false,
  glossary = false,
}: {
  home?: boolean;
  glossary?: boolean;
}) {
  return (
    <footer
      className={`border-t border-[#D5DBEC] bg-[#F0F2FC] ${home ? "mt-2" : glossary ? "mt-0" : "mt-[54px]"}`}
    >
      <div className="mx-auto w-[84%] max-w-[1100px] pt-[42px] pb-[30px] max-md:w-[calc(100%-32px)] max-md:pt-8 max-md:pb-6">
        <div className="grid grid-cols-[1.45fr_0.62fr_1.02fr_1fr] gap-8 max-lg:grid-cols-2 max-lg:gap-x-10 max-lg:gap-y-8 max-sm:grid-cols-1 max-sm:gap-7">
          <section aria-label="Tentang Jejak Bencana">
            <Link
              className="inline-flex items-center gap-2 text-[18px] leading-6 font-bold tracking-[-0.025em] text-[#00655D] no-underline"
              href="/"
            >
              <svg
                className="size-[19px] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 3.5 19 6v5.5c0 4.3-2.9 7.3-7 9-4.1-1.7-7-4.7-7-9V6l7-2.5Z"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
              Jejak Bencana
            </Link>
            <p className="mt-2.5 max-w-[325px] text-[13px] leading-[22px] text-[#52617B]">
              Portal independen pemantau data rujukan resmi publikasi Dana
              Siap Pakai (DSP) di Indonesia berdasarkan dokumen resmi negara
              dan rilis berkala instansi terkait.
            </p>
            <span className="mt-3 inline-flex items-center gap-2 text-[11px] leading-4 text-[#008477]">
              <svg
                className="size-[14px] shrink-0"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8 1.5 9.5 3l2.1-.2.5 2 1.8 1.1-.8 2 .8 2-1.8 1.1-.5 2-2.1-.2L8 13.5l-1.5 1.3-2.1-.7-1.8-1.1.3-2.1L1.5 9l.8-2-.8-2 1.8-1.1.5-2 2.1.2L8 1.5Z"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="1.2"
                />
                <path
                  d="m5.5 8 1.7 1.7 3.4-3.4"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.2"
                />
              </svg>
              Platform Non-Donasi &amp; Non-Komersial
            </span>
          </section>

          <nav className="grid content-start justify-items-start gap-[7px]" aria-label="Navigasi footer">
            <h2 className="mb-1 text-[11px] leading-4 font-extrabold tracking-[0.04em] text-[#172238] uppercase">
              Navigasi
            </h2>
            {navigationLinks.map((link) => (
              <FooterLink key={link.href} {...link} />
            ))}
          </nav>

          <nav
            className="grid content-start justify-items-start gap-[7px]"
            aria-label="Rujukan dan regulasi"
          >
            <h2 className="mb-1 text-[11px] leading-4 font-extrabold tracking-[0.04em] text-[#172238] uppercase">
              Rujukan &amp; Regulasi
            </h2>
            {referenceLinks.map((link) => (
              <FooterLink key={link.label} {...link} />
            ))}
          </nav>

          <section aria-labelledby="footer-transparency-title">
            <h2
              className="mb-2 text-[11px] leading-4 font-extrabold tracking-[0.04em] text-[#172238] uppercase"
              id="footer-transparency-title"
            >
              Batasan Transparansi
            </h2>
            <p className="text-[11px] leading-[19px] text-[#71809A]">
              Informasi dikumpulkan dari data resmi, dokumen penetapan tanggap
              darurat, dan audit berkala. Kami tidak menghimpun atau mengelola
              sumbangan dalam bentuk apa pun.
            </p>
            <Link
              className="mt-3 inline-flex items-center gap-1 text-[11px] leading-4 font-medium text-[#008477] no-underline hover:underline"
              href="/metodologi"
            >
              Pernyataan Netralitas Publik
              <span aria-hidden="true">→</span>
            </Link>
          </section>
        </div>

        <div className="mt-[30px] flex items-center justify-between gap-5 border-t border-[#D5DBEC] pt-5 text-[11px] leading-4 text-[#71809A] max-md:flex-col max-md:items-start max-md:gap-3">
          <p>
            © 2026 Jejak Bencana. Portal Pemantau DSP Non-Donasi Berdasarkan
            Dokumen Resmi Negara.
          </p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Informasi footer">
            <Link className="text-inherit no-underline hover:text-[#00796F] hover:underline" href="/metodologi">
              Ketentuan Metodologi
            </Link>
            <a
              className="text-inherit no-underline hover:text-[#00796F] hover:underline"
              href="https://bnpb.go.id"
              target="_blank"
              rel="noreferrer"
            >
              Bantuan &amp; Kontak Resmi
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
