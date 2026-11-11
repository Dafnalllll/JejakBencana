"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import type { DisasterCase, FundCategory } from "@/types";
import { formatRupiah } from "@/lib/mockService";
import AdminPageHeader from "@/components/AdminPageHeader";

interface AdminDashboardOverviewProps {
  cases: DisasterCase[];
  onCreateCase: () => void;
  onEditCase: (item: DisasterCase) => void;
  onEditStep: (step: 0 | 1 | 2) => void;
  onExport: () => void;
  onRefresh: () => void;
  onViewSources: () => void;
  error?: string;
  feedback?: string;
}

function sumFunds(cases: DisasterCase[], category: FundCategory) {
  return cases.reduce(
    (total, item) =>
      total +
      item.fundRecords
        .filter((record) => record.category === category)
        .reduce((sum, record) => sum + record.amount, 0),
    0,
  );
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function needsDomainReview(value: string) {
  if (!isHttpUrl(value)) return true;
  const hostname = new URL(value).hostname.toLocaleLowerCase("id");
  return hostname !== "go.id" && !hostname.endsWith(".go.id");
}

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tanggal tidak tersedia";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function ModuleIcon({ kind }: { kind: "cases" | "funds" | "sources" | "quality" }) {
  const shared = {
    className: "size-[19px]",
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true as const,
  };

  if (kind === "cases") {
    return (
      <svg {...shared}>
        <path d="M12 3 21 19H3L12 3Z" />
        <path d="M12 9v4m0 3h.01" />
      </svg>
    );
  }
  if (kind === "funds") {
    return (
      <svg {...shared}>
        <path d="M3 9h18M5 6l7-3 7 3M5 21h14M7 9v9m5-9v9m5-9v9" />
      </svg>
    );
  }
  if (kind === "sources") {
    return (
      <svg {...shared}>
        <path d="M5 3.75h9l5 5v11.5H5V3.75Z" />
        <path d="M14 4v5h5m-10 5 2 2 4-4" />
      </svg>
    );
  }
  return (
    <svg {...shared}>
      <path d="M12 3 14 5l3-.2.8 2.8 2.5 1.7-1 2.7 1 2.7-2.5 1.7-.8 2.8-3-.2-2 2-2-2-3 .2-.8-2.8-2.5-1.7 1-2.7-1-2.7 2.5-1.7.8-2.8 3 .2L12 3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function AdminDashboardOverview({
  cases,
  onCreateCase,
  onEditCase,
  onEditStep,
  onExport,
  onRefresh,
  onViewSources,
  error,
  feedback,
}: AdminDashboardOverviewProps) {
  const shouldReduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");

  const summary = useMemo(() => {
    const sources = cases.flatMap((item) =>
      item.sourceDocuments.map((source) => ({ ...source, caseTitle: item.title })),
    );
    const needsReview = sources.filter((source) => needsDomainReview(source.url));
    const published = cases.filter((item) => item.status === "PUBLISHED").length;
    const drafts = cases.length - published;
    const linkedSources = sources.length - sources.filter((source) => !isHttpUrl(source.url)).length;
    const latestCases = [...cases].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    const normalizedQuery = query.trim().toLocaleLowerCase("id-ID");
    const filteredCases = latestCases.filter((item) =>
      `${item.title} ${item.affectedArea} ${item.status}`
        .toLocaleLowerCase("id-ID")
        .includes(normalizedQuery),
    );

    return {
      sources,
      needsReview,
      published,
      drafts,
      linkedSources,
      filteredCases,
      allocation: sumFunds(cases, "ALLOCATION"),
      distribution: sumFunds(cases, "DISTRIBUTION"),
      realization: sumFunds(cases, "REALIZATION"),
      pendingPlans: cases.reduce(
        (total, item) =>
          total + item.fundRecords.filter((record) => record.category === "PLAN").length,
        0,
      ),
    };
  }, [cases, query]);

  const sourceCoverage = summary.sources.length
    ? Math.round((summary.linkedSources / summary.sources.length) * 100)
    : 0;
  const cards = [
    {
      label: "Entri Bencana & Kasus",
      module: "MODUL 1",
      value: `${cases.length} Kasus`,
      detail: "Kasus yang tersimpan di perangkat ini",
      icon: "cases" as const,
      tone: "teal",
      stats: [
        { label: "Dipublikasikan", value: summary.published, tone: "green" },
        { label: "Draft", value: summary.drafts, tone: "slate" },
      ],
      action: "Buka Modul Kasus",
      onClick: () => onEditStep(0),
    },
    {
      label: "Alokasi & DSP Terdata",
      module: "MODUL 2",
      value: formatRupiah(summary.allocation),
      detail: "Total alokasi tercatat",
      icon: "funds" as const,
      tone: "amber",
      stats: [
        { label: "Realisasi", value: formatRupiah(summary.realization), tone: "green" },
        { label: "Rencana", value: summary.pendingPlans, tone: "amber" },
      ],
      action: "Buka Modul DSP",
      onClick: () => onEditStep(1),
    },
    {
      label: "Verifikasi Sumber Data",
      module: "MODUL 3",
      value: `${summary.sources.length} Dokumen`,
      detail: "Dokumen yang terhubung ke kasus",
      icon: "sources" as const,
      tone: "blue",
      stats: [
        { label: "URL tersedia", value: summary.linkedSources, tone: "blue" },
        { label: "Perlu ditinjau", value: summary.needsReview.length, tone: "amber" },
      ],
      action: "Buka Modul Verifikasi",
      onClick: onViewSources,
    },
    {
      label: "Kelengkapan Rujukan",
      module: "AUDIT DATA",
      value: `${sourceCoverage}%`,
      detail: "Dokumen memiliki URL HTTP/HTTPS",
      icon: "quality" as const,
      tone: "green",
      stats: [
        { label: "Total dokumen", value: summary.sources.length, tone: "slate" },
        { label: "Tanpa URL", value: summary.sources.length - summary.linkedSources, tone: "amber" },
      ],
      action: "Tinjau Kualitas Data",
      onClick: onViewSources,
    },
  ] as const;

  const toneClasses = {
    teal: {
      icon: "border-teal-200 bg-teal-50 text-teal-700",
      badge: "border-teal-200 bg-teal-50 text-teal-700",
    },
    amber: {
      icon: "border-amber-200 bg-amber-50 text-amber-700",
      badge: "border-amber-200 bg-amber-50 text-amber-700",
    },
    blue: {
      icon: "border-blue-200 bg-blue-50 text-blue-700",
      badge: "border-blue-200 bg-blue-50 text-blue-700",
    },
    green: {
      icon: "border-emerald-200 bg-emerald-50 text-emerald-700",
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
  };

  const statTones = {
    green: "bg-emerald-50 text-emerald-700",
    slate: "bg-slate-100 text-slate-600",
    amber: "bg-amber-50 text-amber-800",
    blue: "bg-blue-50 text-blue-700",
  };

  const reviewQueue = summary.needsReview.slice(0, 4);

  return (
    <div className="min-w-0 flex-1 bg-[#F6F8FB]">
      <AdminPageHeader
        onPrimaryAction={onCreateCase}
        primaryLabel="Buat Entri Baru"
        onExport={onExport}
        title="Dashboard Ringkasan Admin"
      />

      <main className="mx-auto grid max-w-[1500px] gap-5 px-5 py-6 sm:px-7 lg:gap-6 lg:px-8 lg:py-8" id="dashboard">
        {(error || feedback) && (
          <div
            className={`rounded-lg border px-4 py-3 text-xs leading-5 ${
              error
                ? "border-rose-200 bg-rose-50 text-rose-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
            role={error ? "alert" : "status"}
          >
            {error || feedback}
          </div>
        )}

        <section aria-labelledby="operational-summary-title">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2
                className="text-base font-bold tracking-[-0.02em] text-[#273449] sm:text-lg"
                id="operational-summary-title"
              >
                Ringkasan Sistem &amp; Modul Operasional
              </h2>
              <p className="mt-1 text-xs leading-5 text-[#68768A]">
                Ikhtisar kasus, pencatatan dana, serta kelengkapan dokumen rujukan.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-md border border-[#DDE3F3] bg-[#F0F2FC] px-3 py-2 text-[10px] leading-4 text-[#61718C]">
              <span className="size-1.5 rounded-full bg-[#0C8277]" aria-hidden="true" />
              Ringkasan dari penyimpanan lokal
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {cards.map((card, index) => (
              <motion.article
                className="flex min-w-0 flex-col rounded-xl border border-[#E0E6ED] bg-white p-4 shadow-[0_2px_8px_rgb(19_27_46_/_4%)] transition-shadow hover:shadow-[0_8px_24px_rgb(19_27_46_/_8%)] sm:p-[18px]"
                key={card.label}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2, delay: shouldReduceMotion ? 0 : index * 0.04 }}
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`grid size-[38px] shrink-0 place-items-center rounded-lg border ${toneClasses[card.tone].icon}`}>
                    <ModuleIcon kind={card.icon} />
                  </span>
                  <span className={`rounded border px-2 py-1 text-[9px] font-bold tracking-wide ${toneClasses[card.tone].badge}`}>
                    {card.module}
                  </span>
                </div>
                <h3 className="mt-3 text-xs font-semibold text-[#68768A]">{card.label}</h3>
                <p className="mt-1 min-h-8 break-words text-[clamp(20px,2vw,25px)] leading-7 font-bold tracking-[-0.035em] text-[#202B40]">
                  {card.value}
                </p>
                <p className="mt-0.5 min-h-9 text-xs leading-[18px] text-[#68716F]">{card.detail}</p>
                <div className="mt-3 flex min-h-8 flex-wrap items-center gap-2 border-t border-[#EDF0F3] pt-3">
                  {card.stats.map((stat) => (
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[9px] font-semibold ${statTones[stat.tone]}`}
                      key={stat.label}
                    >
                      <span className="size-1.5 rounded-full bg-current opacity-60" aria-hidden="true" />
                      {stat.label}: {stat.value}
                    </span>
                  ))}
                </div>
                {card.icon === "funds" && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[9px] text-[#718096]">
                      <span>Realisasi terhadap alokasi</span>
                      <strong className="text-[#40506A]">
                        {summary.allocation > 0
                          ? `${Math.min(100, Math.round((summary.realization / summary.allocation) * 100))}%`
                          : "—"}
                      </strong>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#E8EDF2]">
                      <span
                        className="block h-full rounded-full bg-[#0C8277]"
                        style={{
                          width: `${summary.allocation > 0 ? Math.min(100, (summary.realization / summary.allocation) * 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                <button
                  className="mt-auto flex w-full items-center justify-between gap-2 border-t border-[#EDF0F3] pt-3 text-left text-[11px] font-bold text-[#087C67] transition-colors hover:text-[#005C55]"
                  onClick={card.onClick}
                  type="button"
                >
                  {card.action}
                  <span className="text-base" aria-hidden="true">→</span>
                </button>
              </motion.article>
            ))}
          </div>
        </section>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(300px,0.9fr)]">
          <section className="overflow-hidden rounded-xl border border-[#E0E6ED] bg-white shadow-[0_2px_8px_rgb(19_27_46_/_4%)]" aria-labelledby="recent-activity-title">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E8EDF2] p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-teal-50 text-[#087C67]" aria-hidden="true">▤</span>
                <div>
                  <h2 className="text-sm leading-5 font-bold text-[#253248] sm:text-base" id="recent-activity-title">
                    Aktivitas Terkini &amp; Kasus Tanggap Darurat
                  </h2>
                  <p className="mt-1 text-[11px] leading-[17px] text-[#718096]">
                    Daftar kasus terakhir diperbarui pada penyimpanan lokal.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex h-9 min-w-[170px] items-center gap-2 rounded-lg border border-[#D7E0E8] px-2.5 text-[#75839A] focus-within:border-[#0C8277]">
                  <span aria-hidden="true">⌕</span>
                  <span className="sr-only">Filter aktivitas kasus</span>
                  <input
                    className="w-full min-w-0 bg-transparent text-[11px] text-[#29364C] outline-none placeholder:text-[#8995A7]"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Filter entri..."
                    type="search"
                    value={query}
                  />
                </label>
                <button
                  aria-label="Muat ulang daftar kasus"
                  className="grid size-9 place-items-center rounded-lg border border-[#D7E0E8] text-[#53637B] transition hover:bg-[#F4F7F9]"
                  onClick={onRefresh}
                  type="button"
                >
                  ↻
                </button>
              </div>
            </div>
            <div className="divide-y divide-[#EDF0F3]">
              {summary.filteredCases.length ? (
                summary.filteredCases.slice(0, 5).map((item) => (
                  <button
                    className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-[#F8FAFB] sm:px-5"
                    key={item.id}
                    onClick={() => onEditCase(item)}
                    type="button"
                  >
                    <span className="min-w-0">
                      <strong className="block truncate text-xs font-semibold text-[#344258]">{item.title}</strong>
                      <span className="mt-1 block truncate text-[10px] text-[#8290A2]">{item.affectedArea}</span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        item.status === "PUBLISHED"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {item.status === "PUBLISHED" ? "Published" : "Draft"}
                      </span>
                      <span className="text-[9px] text-[#8290A2]">{formatUpdatedAt(item.updatedAt)}</span>
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-5 py-10 text-center text-xs text-[#718096]">
                  {query ? "Tidak ada kasus yang cocok dengan pencarian." : "Belum ada data kasus."}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[#E8EDF2] px-4 py-3 sm:px-5">
              <span className="text-[10px] text-[#8290A2]">
                Menampilkan {Math.min(summary.filteredCases.length, 5)} dari {summary.filteredCases.length} entri
              </span>
              <button
                className="text-[10px] font-bold text-[#087C67] hover:underline"
                onClick={() => onEditStep(0)}
                type="button"
              >
                Lihat semua kasus →
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-[#E0E6ED] bg-white shadow-[0_2px_8px_rgb(19_27_46_/_4%)]" aria-labelledby="verification-queue-title">
            <div className="flex items-center justify-between gap-3 border-b border-[#E8EDF2] p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-blue-50 text-blue-700" aria-hidden="true">▣</span>
                <h2 className="text-sm leading-5 font-bold text-[#253248]" id="verification-queue-title">
                  Antrean Verifikasi Dokumen
                </h2>
              </div>
              <span className="rounded border border-blue-200 bg-blue-50 px-2 py-1 text-[9px] font-bold text-blue-700">
                MODUL 3
              </span>
            </div>
            <p className="px-4 pt-4 text-[11px] leading-[17px] text-[#718096] sm:px-5">
              Dokumen yang belum memiliki tautan resmi atau perlu pemeriksaan domain.
            </p>
            <div className="grid gap-2 p-4 sm:p-5">
              {reviewQueue.length ? (
                reviewQueue.map((source) => (
                  <article className="rounded-lg border border-[#E5EAF0] bg-[#FBFCFD] p-3" key={source.id}>
                    <strong className="block text-[11px] leading-4 font-semibold text-[#344258]">{source.title}</strong>
                    <span className="mt-1 block text-[10px] text-[#8290A2]">{source.caseTitle}</span>
                    <span className={`mt-2 inline-flex items-center gap-1.5 text-[9px] font-semibold ${
                      isHttpUrl(source.url) ? "text-amber-700" : "text-rose-700"
                    }`}>
                      <span className={`size-1.5 rounded-full ${isHttpUrl(source.url) ? "bg-amber-500" : "bg-rose-500"}`} aria-hidden="true" />
                      {isHttpUrl(source.url) ? "Domain perlu ditinjau" : "Tautan sumber belum tersedia"}
                    </span>
                  </article>
                ))
              ) : (
                <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-4 text-center text-[11px] leading-5 text-emerald-800">
                  Belum ada dokumen yang masuk antrean pemeriksaan tautan.
                </p>
              )}
              {summary.needsReview.length > reviewQueue.length && (
                <span className="text-center text-[10px] text-[#8290A2]">
                  +{summary.needsReview.length - reviewQueue.length} dokumen lainnya
                </span>
              )}
            </div>
            <div className="border-t border-[#E8EDF2] px-4 py-3 sm:px-5">
              <button className="text-[10px] font-bold text-[#087C67] hover:underline" onClick={onViewSources} type="button">
                Buka modul verifikasi →
              </button>
            </div>
          </section>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[#D8E0E7] pt-5 text-[10px] leading-4 text-[#718096]">
          <div>
            <strong className="block text-sm font-bold text-[#087C67]">Jejak Bencana</strong>
            <span>© 2026 Portal Pemantau DSP Non-Donasi berdasarkan dokumen resmi negara.</span>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Tautan informasi">
            <Link className="text-inherit no-underline hover:text-[#087C67] hover:underline" href="/metodologi">Metodologi Pengawasan</Link>
            <a className="text-inherit no-underline hover:text-[#087C67] hover:underline" href="https://bnpb.go.id" target="_blank" rel="noreferrer">Portal Data BNPB ↗</a>
            <Link className="text-inherit no-underline hover:text-[#087C67] hover:underline" href="/glosarium">Glosarium Terminologi</Link>
          </nav>
        </footer>
      </main>
    </div>
  );
}
