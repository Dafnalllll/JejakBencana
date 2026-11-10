"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import DemoDataBanner from "@/components/DemoDataBanner";
import PublicFooter from "@/components/PublicFooter";
import LoadingState from "@/components/LoadingState";
import { formatRupiah, getCaseBySlug } from "@/lib/mockService";
import type { DisasterCase, FundCategory } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

const categoryConfig: Record<
  FundCategory,
  { label: string; badgeClass: string }
> = {
  ALLOCATION: {
    label: "Alokasi / Penetapan",
    badgeClass: "border-sky-200 bg-sky-50 text-sky-800",
  },
  DISTRIBUTION: {
    label: "Penyaluran",
    badgeClass: "border-indigo-200 bg-indigo-50 text-indigo-800",
  },
  REALIZATION: {
    label: "Realisasi dilaporkan",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  PLAN: {
    label: "Rencana / Pengajuan",
    badgeClass: "border-slate-200 bg-slate-50 text-slate-700",
  },
};

function CaseDetailContent({ slug }: { slug: string }) {
  const [caseItem, setCaseItem] = useState<DisasterCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [showCorrectionNote, setShowCorrectionNote] = useState(false);

  useEffect(() => {
    let active = true;

    getCaseBySlug(slug)
      .then((data) => {
        if (active) setCaseItem(data);
      })
      .catch(() => {
        if (active) setLoadError("Data kasus tidak dapat dimuat. Coba muat ulang halaman.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const totals = useMemo(() => {
    const records = caseItem?.fundRecords ?? [];
    const sum = (category: FundCategory) =>
      records
        .filter((record) => record.category === category)
        .reduce((total, record) => total + record.amount, 0);

    return {
      allocation: sum("ALLOCATION"),
      distribution: sum("DISTRIBUTION"),
      realization: sum("REALIZATION"),
    };
  }, [caseItem]);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: caseItem?.title ?? "Jejak Bencana",
          url,
        });
        setShareMessage("Tautan kasus berhasil dibagikan.");
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setShareMessage("Tautan tidak dapat dibagikan dari perangkat ini.");
        }
      }
      return;
    }

    try {
      if (!navigator.clipboard) {
        window.prompt("Salin tautan kasus ini:", url);
        setShareMessage("Tautan kasus siap disalin.");
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareMessage("Tautan kasus disalin.");
    } catch {
      setShareMessage("Tautan tidak dapat disalin. Salin alamat halaman dari browser.");
    }
  };

  if (loading) {
    return (
      <main className="mx-auto w-[calc(100%-32px)] max-w-[1180px] flex-1 py-6 md:w-[calc(100%-64px)]" aria-live="polite">
        <LoadingState label="Memuat rincian kasus..." variant="detail" />
      </main>
    );
  }

  if (loadError || !caseItem) {
    return (
      <main className="mx-auto w-[calc(100%-32px)] max-w-[1180px] flex-1 py-6 md:w-[calc(100%-64px)]">
        <div className="rounded-2xl border border-[#DCE3EA] bg-white p-6 shadow-[0_8px_24px_rgb(19_27_46_/_5%)] sm:p-8" role="alert">
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
            <span className="size-2 rounded-full bg-rose-500" aria-hidden="true" />
            Informasi belum tersedia
          </span>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-[#172238] sm:text-2xl">
            {loadError ? "Kasus tidak dapat dimuat" : "Kasus tidak ditemukan"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64716F]">
            {loadError ||
              "Kasus yang dicari tidak tersedia atau belum dipublikasikan dalam data contoh."}
          </p>
          <Link
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg border border-[#0C8277] px-4 text-sm font-semibold text-[#0C7068] no-underline transition-colors hover:bg-[#EFFBF7]"
            href="/kasus"
          >
            Kembali ke daftar kasus
          </Link>
        </div>
      </main>
    );
  }

  const absorption =
    totals.allocation > 0
      ? Math.min(100, Math.round((totals.realization / totals.allocation) * 100))
      : null;
  const dateRange =
    caseItem.periodStart && caseItem.periodEnd
      ? `${caseItem.periodStart} – ${caseItem.periodEnd}`
      : "Tidak dicantumkan pada data contoh";

  return (
    <main className="mx-auto w-[calc(100%-32px)] max-w-[1180px] flex-1 py-5 pb-10 sm:w-[calc(100%-48px)] sm:py-7 md:w-[calc(100%-64px)]">
      <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs text-[#64716F]" aria-label="Breadcrumb">
        <Link className="font-medium text-[#087C67] no-underline hover:underline" href="/">Beranda</Link>
        <span className="text-[#A0AAB8]" aria-hidden="true">/</span>
        <Link className="font-medium text-[#087C67] no-underline hover:underline" href="/kasus">Kasus</Link>
        <span className="text-[#A0AAB8]" aria-hidden="true">/</span>
        <span aria-current="page">Detail Kasus</span>
      </nav>

      <header className="relative overflow-hidden rounded-2xl border border-[#D7E3E4] bg-[linear-gradient(135deg,#FFFFFF_0%,#F2FBF8_58%,#EEF4FF_100%)] p-5 shadow-[0_10px_30px_rgb(19_27_46_/_5%)] sm:p-7 lg:p-9">
        <div className="absolute -top-20 -right-14 size-64 rounded-full bg-[#BCEADF]/25 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A7E6D3] bg-[#EFFBF7] px-3 py-1 text-[10px] font-bold tracking-[0.04em] text-[#087C67] uppercase">
              <span className="size-1.5 rounded-full bg-[#0C8277]" aria-hidden="true" />
              Data contoh
            </span>
            <span className="rounded-full border border-[#D9E1EA] bg-white/80 px-3 py-1 text-[11px] font-medium text-[#53637B]">
              {caseItem.affectedArea}
            </span>
            <span className="text-[11px] text-[#64716F]">Instansi rujukan: BNPB</span>
          </div>
          <h1 className="mt-4 max-w-[900px] text-[clamp(25px,4vw,38px)] leading-[1.14] font-bold tracking-[-0.04em] text-[#172238]">
            {caseItem.title}
          </h1>
          <p className="mt-3 max-w-[850px] text-sm leading-6 text-[#53637B] sm:text-[15px] sm:leading-7">
            {caseItem.summary}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#64716F]">
            {caseItem.incidentDate && (
              <span className="inline-flex items-center gap-2">
                <svg className="size-4 text-[#0C8277]" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <rect x="3" y="4.5" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M6.5 2.5v4M13.5 2.5v4M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Tanggal kejadian: <strong className="font-semibold text-[#35445A]">{caseItem.incidentDate}</strong>
              </span>
            )}
            <span className="inline-flex items-center gap-2">
              <svg className="size-4 text-[#0C8277]" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 17s5-4.1 5-9a5 5 0 1 0-10 0c0 4.9 5 9 5 9Z" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="10" cy="8" r="1.7" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              {caseItem.sourceDocuments.length} dokumen sumber
            </span>
          </div>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <button
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#087C67] px-4 text-xs font-bold text-white shadow-sm transition hover:-translate-y-px hover:bg-[#006257] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087C67]"
              onClick={handleShare}
              type="button"
            >
              Bagikan Kasus
              <span aria-hidden="true">↗</span>
            </button>
            <button
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#C9D7D8] bg-white/80 px-4 text-xs font-semibold text-[#36515A] transition hover:border-[#0C8277] hover:bg-white"
              onClick={() => setShowCorrectionNote((visible) => !visible)}
              type="button"
            >
              Koreksi Data
            </button>
          </div>
        </div>
      </header>

      <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(290px,0.8fr)] lg:gap-5">
        <div className="grid content-start gap-4 lg:gap-5">
          <section className="rounded-2xl border border-[#DCE3EA] bg-white p-4 shadow-[0_5px_18px_rgb(19_27_46_/_4%)] sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#E8F7F2] text-[#087C67]">
                <svg className="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M3 15.5h14M5 13V8m5 5V4m5 9V6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <h2 className="text-base leading-6 font-bold tracking-[-0.02em] text-[#1B263C] sm:text-lg">
                  Ringkasan Dana Siap Pakai (DSP)
                </h2>
                <p className="mt-1 text-xs leading-5 text-[#64716F]">
              Setiap jenis informasi ditampilkan terpisah sesuai catatan pada
              dokumen rujukan.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
              <div className="min-w-0 rounded-xl border border-sky-100 bg-sky-50/70 p-3.5">
                <span className="block text-[10px] leading-4 font-bold tracking-[0.04em] text-sky-800 uppercase">Alokasi / Penetapan</span>
                <strong className="mt-2 block break-words text-[15px] leading-6 font-bold tabular-nums text-[#1E2A40] sm:text-base">{formatRupiah(totals.allocation)}</strong>
                <small className="mt-1 block text-[10px] leading-4 text-[#64716F]">Nilai penetapan tercatat</small>
              </div>
              <div className="min-w-0 rounded-xl border border-indigo-100 bg-indigo-50/70 p-3.5">
                <span className="block text-[10px] leading-4 font-bold tracking-[0.04em] text-indigo-800 uppercase">Penyaluran</span>
                <strong className="mt-2 block break-words text-[15px] leading-6 font-bold tabular-nums text-[#1E2A40] sm:text-base">{formatRupiah(totals.distribution)}</strong>
                <small className="mt-1 block text-[10px] leading-4 text-[#64716F]">Nilai penyaluran tercatat</small>
              </div>
              <div className="min-w-0 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3.5">
                <span className="block text-[10px] leading-4 font-bold tracking-[0.04em] text-emerald-800 uppercase">Realisasi dilaporkan</span>
                <strong className="mt-2 block break-words text-[15px] leading-6 font-bold tabular-nums text-emerald-800 sm:text-base">{formatRupiah(totals.realization)}</strong>
                <small className="mt-1 block text-[10px] leading-4 text-[#64716F]">Nilai realisasi tercatat</small>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {caseItem.fundRecords
                .filter((record) => record.category !== "PLAN")
                .map((record) => {
                  const category = categoryConfig[record.category];
                  return (
                    <article className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-t border-[#E8EDF1] pt-3 max-sm:grid-cols-1 max-sm:gap-1" key={record.id}>
                      <div className="min-w-0">
                        <span className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-[10px] leading-4 font-semibold ${category.badgeClass}`}>
                          {category.label}
                        </span>
                        <p className="mt-2 text-xs leading-[19px] text-[#64716F]">
                          {record.purpose ?? "Tujuan penggunaan tidak dicantumkan."}
                          {record.periodLabel ? ` • ${record.periodLabel}` : ""}
                        </p>
                      </div>
                      <strong className="pt-1 text-right text-xs leading-5 font-bold tabular-nums text-[#24334A] sm:text-sm max-sm:pt-0 max-sm:text-left">
                        {formatRupiah(record.amount)}
                      </strong>
                    </article>
                  );
                })}
            </div>
            {caseItem.fundRecords.some((record) => record.category === "PLAN") && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs leading-5 text-amber-950">
                Nominal rencana/pengajuan tidak digabungkan ke total alokasi
                aktif maupun realisasi.
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-[#DCE3EA] bg-white p-4 shadow-[0_5px_18px_rgb(19_27_46_/_4%)] sm:p-6">
            <h2 className="text-base leading-6 font-bold tracking-[-0.02em] text-[#1B263C] sm:text-lg">Status Serapan Terhadap Alokasi SK Penetapan</h2>
            <p className="mt-1 text-xs leading-5 text-[#64716F]">
              Perbandingan ini hanya ditampilkan jika nilai alokasi dan
              realisasi tersedia pada data contoh.
            </p>
            {absorption === null ? (
              <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs leading-5 text-slate-600">
                Rasio belum dapat dihitung karena nilai alokasi belum tersedia.
              </p>
            ) : (
              <div
                className="mt-5"
                role="img"
                aria-label={`${absorption}% realisasi dibanding alokasi yang tercatat`}
              >
                <div className="flex items-center justify-between gap-3 text-xs leading-5 text-[#53637B]">
                  <span>{formatRupiah(totals.realization)} realisasi</span>
                  <strong className="text-lg font-bold text-[#087C67]">{absorption}%</strong>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#E6EBF0]">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#0C8277] to-[#32B78B] transition-[width] duration-300" style={{ width: `${absorption}%` }} />
                </div>
                <p className="mt-2 text-[11px] leading-[18px] text-[#64716F]">
                  Dibandingkan dengan alokasi {formatRupiah(totals.allocation)}.
                  Ini bukan total gabungan kategori dana.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-[#DCE3EA] bg-white p-4 shadow-[0_5px_18px_rgb(19_27_46_/_4%)] sm:p-6">
            <h2 className="text-base leading-6 font-bold tracking-[-0.02em] text-[#1B263C] sm:text-lg">Tujuan Penggunaan Dana</h2>
            <p className="mt-1 text-xs leading-5 text-[#64716F]">
              Ringkasan mengikuti peruntukan yang tertulis pada catatan sumber.
            </p>
            <blockquote className="mt-4 rounded-r-lg border-l-[3px] border-[#0C8277] bg-[#F2F7F6] px-4 py-3 text-sm leading-[22px] text-[#3E4947]">
              {caseItem.fundRecords.find((record) => record.category !== "PLAN")?.purpose ??
                "Tujuan penggunaan belum dicantumkan pada catatan dana."}
            </blockquote>
          </section>

          <section className="rounded-2xl border border-[#DCE3EA] bg-white p-4 shadow-[0_5px_18px_rgb(19_27_46_/_4%)] sm:p-6">
            <h2 className="text-base leading-6 font-bold tracking-[-0.02em] text-[#1B263C] sm:text-lg">Bagikan atau koreksi informasi</h2>
            <div className="mt-4 flex flex-wrap gap-2.5 max-sm:grid">
              <button className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#087C67] px-4 text-xs font-bold text-white transition-colors hover:bg-[#006257]" onClick={handleShare} type="button">
                Bagikan Kasus
              </button>
              <button
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#C9D7D8] bg-white px-4 text-xs font-semibold text-[#36515A] transition-colors hover:border-[#0C8277] hover:bg-[#F4FBF9]"
                onClick={() => setShowCorrectionNote((visible) => !visible)}
                type="button"
              >
                Koreksi Data
              </button>
            </div>
            {shareMessage && <p className="mt-3 text-xs leading-5 text-[#64716F]" role="status">{shareMessage}</p>}
            {showCorrectionNote && (
              <p className="mt-3 rounded-lg bg-[#F2F7F6] px-3.5 py-3 text-xs leading-5 text-[#3E4947]" role="status">
                Saluran koreksi belum tersedia pada demo ini. Silakan rujuk
                dokumen sumber resmi sebelum menggunakan informasi.
              </p>
            )}
          </section>
        </div>

        <aside className="grid content-start gap-4 lg:gap-5">
          <section className="rounded-2xl border border-[#DCE3EA] bg-white p-4 shadow-[0_5px_18px_rgb(19_27_46_/_4%)] sm:p-5">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-lg bg-[#EDF4FF] text-[#4569A8]" aria-hidden="true">⌖</span>
              <h2 className="text-sm leading-5 font-bold text-[#1B263C]">Wilayah &amp; Periode SK</h2>
            </div>
            <dl className="mt-4 grid gap-3">
              <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-3 border-b border-[#EDF0F3] pb-3 text-xs leading-[18px]">
                <dt className="text-[#748094]">Wilayah</dt>
                <dd className="m-0 font-semibold text-[#35445A]">{caseItem.affectedArea}</dd>
              </div>
              <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-3 border-b border-[#EDF0F3] pb-3 text-xs leading-[18px]">
                <dt className="text-[#748094]">Tanggal kejadian</dt>
                <dd className="m-0 font-semibold text-[#35445A]">{caseItem.incidentDate ?? "Tidak dicantumkan"}</dd>
              </div>
              <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-3 border-b border-[#EDF0F3] pb-3 text-xs leading-[18px]">
                <dt className="text-[#748094]">Periode</dt>
                <dd className="m-0 font-semibold text-[#35445A]">{dateRange}</dd>
              </div>
              <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-3 text-xs leading-[18px]">
                <dt className="text-[#748094]">Instansi</dt>
                <dd className="m-0 font-semibold text-[#35445A]">BNPB</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-[#DCE3EA] bg-white p-4 shadow-[0_5px_18px_rgb(19_27_46_/_4%)] sm:p-5">
            <h2 className="text-sm leading-5 font-bold text-[#1B263C]">Sumber Informasi Resmi</h2>
            <p className="mt-1 text-[11px] leading-[18px] text-[#64716F]">
              Buka dokumen sumber untuk membaca informasi selengkapnya.
            </p>
            <div className="mt-4 grid gap-2.5">
              {caseItem.sourceDocuments.length > 0 ? (
                caseItem.sourceDocuments.map((source) => (
                  <article className="rounded-xl border border-[#E1E7EC] bg-[#FCFDFE] p-3" key={source.id}>
                    <strong className="block text-xs leading-[18px] font-semibold text-[#29364C]">{source.title}</strong>
                    <span className="mt-1 block text-[10px] leading-4 text-[#64716F]">{source.publisher}</span>
                    {source.publicationDate && (
                      <span className="mt-1 block text-[10px] leading-4 text-[#64716F]">Tanggal dokumen: {source.publicationDate}</span>
                    )}
                    {source.url ? (
                      <a className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#087C67] no-underline hover:underline" href={source.url} target="_blank" rel="noopener noreferrer">
                        Buka sumber <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      <span className="mt-2 block text-[10px] leading-4 text-[#8A6A32]">Tautan sumber belum tersedia pada data contoh.</span>
                    )}
                  </article>
                ))
              ) : (
                <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs leading-5 text-slate-600">
                  Dokumen sumber belum tersedia pada data contoh.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 shadow-[0_5px_18px_rgb(19_27_46_/_3%)] sm:p-5">
            <div className="flex items-start gap-2.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800" aria-hidden="true">i</span>
              <div>
                <h2 className="text-sm leading-5 font-bold text-[#49391D]">Batasan Informasi &amp; Ruang Lingkup Data Terbuka</h2>
                <p className="mt-2 text-[11px] leading-[18px] text-[#685832]">
              {caseItem.scopeLimitations ??
                "Informasi yang tersedia terbatas pada catatan dan dokumen contoh yang ditampilkan."}
                </p>
              </div>
            </div>
            {caseItem.contextNote && (
              <div className="mt-3 rounded-lg border border-amber-200 bg-white/70 px-3 py-2.5 text-[11px] leading-[18px] text-[#59451F]">
                <strong>Catatan konteks:</strong> {caseItem.contextNote}
              </div>
            )}
            <p className="mt-3 border-t border-amber-200 pt-3 text-[10px] leading-[17px] font-medium text-[#835717]">
              Data ini merupakan contoh demo dan tidak boleh dianggap sebagai
              informasi faktual atau diterbitkan.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}

export default function CaseDetailPage({ params }: Props) {
  const { slug } = use(params);

  return (
    <>
      <DemoDataBanner />
      <CaseDetailContent slug={slug} />
      <PublicFooter />
    </>
  );
}
