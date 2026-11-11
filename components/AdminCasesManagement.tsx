"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { CaseStatus, DisasterCase, FundCategory } from "@/types";
import { formatRupiah } from "@/lib/mockService";
import AdminPageHeader from "@/components/AdminPageHeader";

interface AdminCasesManagementProps {
  cases: DisasterCase[];
  onCreateCase: () => void;
  onEditCase: (item: DisasterCase) => void;
  onExport: () => void;
  onRefresh: () => void;
  error?: string;
  feedback?: string;
}

const pageSize = 5;

function totalFor(item: DisasterCase, category: FundCategory) {
  return item.fundRecords
    .filter((record) => record.category === category)
    .reduce((total, record) => total + record.amount, 0);
}

function formatDate(value?: string) {
  if (!value) return "Belum ditentukan";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tanggal tidak valid";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function ActionIcon({ kind }: { kind: "search" | "refresh" | "edit" | "case" | "fund" | "document" }) {
  const shared = {
    className: "size-4",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  if (kind === "search") {
    return <svg {...shared}><circle cx="10.8" cy="10.8" r="6.3" /><path d="m16 16 4.2 4.2" /></svg>;
  }
  if (kind === "refresh") {
    return <svg {...shared}><path d="M20 7v5h-5M4.6 9a7.5 7.5 0 0 1 12.6-2L20 12M4 17v-5h5m10.4 3a7.5 7.5 0 0 1-12.6 2L4 12" /></svg>;
  }
  if (kind === "edit") {
    return <svg {...shared}><path d="m14 5 5 5M4 20l4.2-.8L19 8.4a2.1 2.1 0 0 0-3-3L5.2 16.2 4 20Z" /></svg>;
  }
  if (kind === "case") {
    return <svg {...shared}><path d="M12 3 21 19H3L12 3Z" /><path d="M12 9v4m0 3h.01" /></svg>;
  }
  if (kind === "fund") {
    return <svg {...shared}><path d="M3 9h18M5 6l7-3 7 3M5 21h14M7 9v9m5-9v9m5-9v9" /></svg>;
  }
  return <svg {...shared}><path d="M5 3.75h9l5 5v11.5H5V3.75Z" /><path d="M14 4v5h5m-10 5 2 2 4-4" /></svg>;
}

export default function AdminCasesManagement({
  cases,
  onCreateCase,
  onEditCase,
  onExport,
  onRefresh,
  error,
  feedback,
}: AdminCasesManagementProps) {
  const shouldReduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | CaseStatus>("ALL");
  const [areaFilter, setAreaFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const areas = useMemo(
    () => [...new Set(cases.map((item) => item.affectedArea).filter(Boolean))].sort((a, b) => a.localeCompare(b, "id")),
    [cases],
  );
  const filteredCases = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("id-ID");
    return [...cases]
      .filter((item) => statusFilter === "ALL" || item.status === statusFilter)
      .filter((item) => areaFilter === "ALL" || item.affectedArea === areaFilter)
      .filter((item) =>
        !normalizedQuery ||
        `${item.title} ${item.slug} ${item.affectedArea}`.toLocaleLowerCase("id-ID").includes(normalizedQuery),
      )
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [areaFilter, cases, query, statusFilter]);
  const pageCount = Math.max(1, Math.ceil(filteredCases.length / pageSize));
  const visibleCases = filteredCases.slice((page - 1) * pageSize, page * pageSize);
  const publishedCount = cases.filter((item) => item.status === "PUBLISHED").length;
  const draftCount = cases.length - publishedCount;
  const missingLinks = cases.reduce(
    (total, item) => total + item.sourceDocuments.filter((document) => !/^https?:\/\//i.test(document.url)).length,
    0,
  );
  const stats = [
    {
      label: "Total Kasus Tersimpan",
      value: cases.length,
      detail: "Data demo lokal pada perangkat ini",
      icon: "case" as const,
      tone: "teal",
    },
    {
      label: "Dipublikasikan",
      value: publishedCount,
      detail: "Tersedia di portal publik",
      icon: "document" as const,
      tone: "green",
    },
    {
      label: "Konsep / Draft",
      value: draftCount,
      detail: "Belum dipublikasikan",
      icon: "fund" as const,
      tone: "blue",
    },
    {
      label: "Tautan Dokumen Perlu Dilengkapi",
      value: missingLinks,
      detail: "Dokumen belum memiliki URL HTTP/HTTPS",
      icon: "document" as const,
      tone: "amber",
    },
  ] as const;
  const tones = {
    teal: "border-teal-200 bg-teal-50 text-teal-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
  };

  const resetFilters = () => {
    setQuery("");
    setStatusFilter("ALL");
    setAreaFilter("ALL");
    setPage(1);
  };

  return (
    <div className="min-w-0 flex-1 bg-[#F7F8FC] text-[#202B40]">
      <AdminPageHeader
        onPrimaryAction={onCreateCase}
        primaryLabel="Tambah Entri Kasus Baru"
        onExport={onExport}
        title="Entri Bencana & Kasus"
      />
      <main className="px-4 py-5 sm:px-6 lg:px-7 lg:py-6">
        <div className="mx-auto grid max-w-[1500px] gap-4">

        {(error || feedback) && (
          <div
            className={`rounded-md border px-3 py-2.5 text-xs leading-5 ${
              error ? "border-rose-200 bg-rose-50 text-rose-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
            role={error ? "alert" : "status"}
          >
            {error || feedback}
          </div>
        )}

        <aside className="grid gap-2 rounded-lg border border-amber-300 bg-[#FFFBEB] p-3 text-amber-900 sm:grid-cols-[20px_minmax(0,1fr)_auto] sm:items-center sm:px-4">
          <span className="grid size-5 place-items-center rounded-full border border-amber-600 text-[11px] font-bold" aria-hidden="true">!</span>
          <div>
            <h2 className="text-[11px] font-bold">Batasan data &amp; integritas catatan kasus</h2>
            <p className="mt-0.5 text-[10px] leading-4 text-amber-800">
              Informasi di halaman ini berasal dari penyimpanan demo lokal. Pastikan dokumen resmi dan rincian dana diverifikasi sebelum diterbitkan.
            </p>
          </div>
          <span className="text-[9px] font-semibold tracking-wide text-amber-800 sm:text-right">MODE DEMO · OFFLINE</span>
        </aside>

        <section className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4" aria-label="Ringkasan entri kasus">
          {stats.map((stat, index) => (
            <motion.article
              className="min-w-0 rounded-lg border border-[#E0E6ED] bg-white p-3.5 shadow-[0_2px_8px_rgb(19_27_46_/_4%)] sm:p-4"
              key={stat.label}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.18, delay: shouldReduceMotion ? 0 : index * 0.04 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold text-[#58677B]">{stat.label}</p>
                  <p className="mt-1 text-[25px] leading-8 font-bold tracking-[-0.04em] text-[#202B40]">{stat.value}</p>
                </div>
                <span className={`grid size-8 shrink-0 place-items-center rounded-md border ${tones[stat.tone]}`}>
                  <ActionIcon kind={stat.icon} />
                </span>
              </div>
              <p className="mt-1 text-[9px] leading-4 text-[#718096]">{stat.detail}</p>
            </motion.article>
          ))}
        </section>

        <section className="overflow-hidden rounded-lg border border-[#DDE3EA] bg-white shadow-[0_2px_8px_rgb(19_27_46_/_4%)]" aria-label="Daftar entri kasus">
          <div className="grid gap-2.5 border-b border-[#E6EBF0] p-3 sm:grid-cols-[minmax(190px,1.3fr)_minmax(130px,.8fr)_minmax(150px,1fr)_auto] sm:items-center">
            <label className="flex min-h-9 items-center gap-2 rounded-md border border-[#D4DDE5] px-2.5 text-[#75839A] focus-within:border-[#087C67] focus-within:ring-2 focus-within:ring-[#087C67]/10">
              <ActionIcon kind="search" />
              <span className="sr-only">Cari ID kasus atau nama wilayah</span>
              <input
                className="w-full min-w-0 bg-transparent text-[10px] text-[#29364C] outline-none placeholder:text-[#8995A7]"
                onChange={(event) => { setQuery(event.target.value); setPage(1); }}
                placeholder="Cari ID kasus, nama, wilayah..."
                type="search"
                value={query}
              />
            </label>
            <label className="sr-only" htmlFor="cases-status-filter">Filter status kasus</label>
            <select
              className="min-h-9 rounded-md border border-[#D4DDE5] bg-white px-2.5 text-[10px] text-[#46556A] outline-none focus:border-[#087C67]"
              id="cases-status-filter"
              onChange={(event) => { setStatusFilter(event.target.value as "ALL" | CaseStatus); setPage(1); }}
              value={statusFilter}
            >
              <option value="ALL">Status Kasus: Semua</option>
              <option value="PUBLISHED">Dipublikasikan</option>
              <option value="DRAFT">Draft</option>
            </select>
            <label className="sr-only" htmlFor="cases-area-filter">Filter wilayah</label>
            <select
              className="min-h-9 min-w-0 rounded-md border border-[#D4DDE5] bg-white px-2.5 text-[10px] text-[#46556A] outline-none focus:border-[#087C67]"
              id="cases-area-filter"
              onChange={(event) => { setAreaFilter(event.target.value); setPage(1); }}
              value={areaFilter}
            >
              <option value="ALL">Wilayah: Seluruh Indonesia</option>
              {areas.map((area) => <option key={area} value={area}>{area}</option>)}
            </select>
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <span className="hidden text-[9px] text-[#718096] lg:inline">
                Menampilkan {visibleCases.length} dari {filteredCases.length} kasus
              </span>
              <button
                className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-[#D4DDE5] px-2.5 text-[10px] font-semibold text-[#58677B] transition hover:bg-[#F7F9FB]"
                onClick={() => { resetFilters(); onRefresh(); }}
                type="button"
              >
                <ActionIcon kind="refresh" /> Reset
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E6EBF0] px-3 py-2">
            <div className="flex flex-wrap items-center gap-1.5 text-[9px]">
              <span className="mr-1 text-[#718096]">Filter cepat:</span>
              <button
                className={`rounded border px-2 py-1 font-semibold ${statusFilter === "ALL" ? "border-teal-200 bg-teal-50 text-teal-800" : "border-[#E0E6ED] text-[#637187] hover:bg-slate-50"}`}
                onClick={() => { setStatusFilter("ALL"); setPage(1); }}
                type="button"
              >
                Semua ({cases.length})
              </button>
              <button
                className={`rounded border px-2 py-1 font-semibold ${statusFilter === "PUBLISHED" ? "border-teal-200 bg-teal-50 text-teal-800" : "border-[#E0E6ED] text-[#637187] hover:bg-slate-50"}`}
                onClick={() => { setStatusFilter("PUBLISHED"); setPage(1); }}
                type="button"
              >
                Dipublikasikan ({publishedCount})
              </button>
              <button
                className={`rounded border px-2 py-1 font-semibold ${statusFilter === "DRAFT" ? "border-blue-200 bg-blue-50 text-blue-800" : "border-[#E0E6ED] text-[#637187] hover:bg-slate-50"}`}
                onClick={() => { setStatusFilter("DRAFT"); setPage(1); }}
                type="button"
              >
                Draft ({draftCount})
              </button>
            </div>
            <span className="text-[9px] text-[#718096] sm:hidden">
              {visibleCases.length} dari {filteredCases.length} kasus
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[970px] table-fixed border-collapse text-left">
              <thead className="bg-[#F7F8FC] text-[9px] font-bold uppercase tracking-[0.04em] text-[#536176]">
                <tr>
                  <th className="w-[19%] px-3 py-3">ID &amp; Nama Kasus</th>
                  <th className="w-[13%] px-3 py-3">Wilayah Terdampak</th>
                  <th className="w-[12%] px-3 py-3">Tanggal Kejadian</th>
                  <th className="w-[19%] px-3 py-3">Dokumen Rujukan</th>
                  <th className="w-[14%] px-3 py-3">Pagu DSP Tercatat</th>
                  <th className="w-[10%] px-3 py-3">Terakhir Diperbarui</th>
                  <th className="w-[9%] px-3 py-3">Status Publik</th>
                  <th className="w-[4%] px-2 py-3"><span className="sr-only">Aksi</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9EDF1] text-[10px]">
                {visibleCases.length ? visibleCases.map((item) => {
                  const allocation = totalFor(item, "ALLOCATION");
                  const realization = totalFor(item, "REALIZATION");
                  const source = item.sourceDocuments[0];
                  return (
                    <tr className="align-top transition-colors hover:bg-[#FBFCFD]" key={item.id}>
                      <td className="px-3 py-3.5">
                        <div className="flex items-start gap-2">
                          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded border border-teal-200 bg-teal-50 text-teal-700">
                            <ActionIcon kind="case" />
                          </span>
                          <div className="min-w-0">
                            <strong className="block leading-[15px] font-bold text-[#29364C]">{item.title}</strong>
                            <span className="mt-1 block break-all text-[8px] leading-3 text-[#7C899A]">{item.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 leading-[15px] text-[#46556A]">{item.affectedArea || "Wilayah belum diisi"}</td>
                      <td className="px-3 py-3.5">
                        <span className="inline-flex rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[9px] font-semibold text-slate-700">
                          {formatDate(item.incidentDate)}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        {source ? (
                          <>
                            <span className="block line-clamp-2 leading-[14px] font-semibold text-[#40506A]">{source.title}</span>
                            <span className={`mt-1 inline-flex rounded border px-1.5 py-0.5 text-[8px] font-semibold ${
                              /^https?:\/\//i.test(source.url)
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-amber-200 bg-amber-50 text-amber-800"
                            }`}>
                              {/^https?:\/\//i.test(source.url) ? "URL tersedia" : "URL belum dicantumkan"}
                            </span>
                          </>
                        ) : (
                          <span className="text-[9px] font-semibold text-amber-700">Dokumen belum ditambahkan</span>
                        )}
                      </td>
                      <td className="px-3 py-3.5">
                        <strong className="block whitespace-nowrap font-bold text-[#29364C]">{formatRupiah(allocation)}</strong>
                        {realization > 0 && (
                          <span className="mt-1 block whitespace-nowrap text-[8px] text-[#087C67]">
                            Realisasi: {formatRupiah(realization)}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3.5 leading-[15px] text-[#536176]">{formatDate(item.updatedAt)}</td>
                      <td className="px-3 py-3.5">
                        <span className={`inline-flex rounded-full border px-2 py-1 text-[8px] font-bold ${
                          item.status === "PUBLISHED"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-100 text-slate-600"
                        }`}>
                          {item.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT"}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <button
                          aria-label={`Edit ${item.title}`}
                          className="grid size-8 place-items-center rounded-md text-[#5D6A7E] transition hover:bg-teal-50 hover:text-[#087C67] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087C67]"
                          onClick={() => onEditCase(item)}
                          type="button"
                        >
                          <ActionIcon kind="edit" />
                        </button>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td className="px-4 py-12 text-center text-xs text-[#718096]" colSpan={8}>
                      {cases.length ? "Tidak ada kasus yang sesuai dengan filter." : "Belum ada data kasus."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E6EBF0] px-3 py-3 text-[9px] text-[#68768A]">
            <span>
              Menampilkan {filteredCases.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filteredCases.length)} dari <strong className="text-[#344258]">{filteredCases.length} kasus</strong>
            </span>
            <nav className="flex items-center gap-1" aria-label="Navigasi halaman daftar kasus">
              <button
                className="min-h-7 rounded border border-[#D9E1E8] px-2 text-[9px] font-semibold disabled:cursor-not-allowed disabled:opacity-45"
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                type="button"
              >
                Sebelumnya
              </button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  aria-current={pageNumber === page ? "page" : undefined}
                  className={`size-7 rounded border text-[9px] font-bold ${
                    pageNumber === page ? "border-[#087C67] bg-[#087C67] text-white" : "border-[#D9E1E8] text-[#536176] hover:bg-slate-50"
                  }`}
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  type="button"
                >
                  {pageNumber}
                </button>
              ))}
              <button
                className="min-h-7 rounded border border-[#D9E1E8] px-2 text-[9px] font-semibold disabled:cursor-not-allowed disabled:opacity-45"
                disabled={page >= pageCount}
                onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                type="button"
              >
                Selanjutnya
              </button>
            </nav>
          </footer>
        </section>
        </div>
      </main>
    </div>
  );
}
