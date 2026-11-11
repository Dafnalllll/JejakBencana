"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { DisasterCase, FundCategory, FundRecord } from "@/types";
import { formatRupiah } from "@/lib/mockService";
import AdminPageHeader from "@/components/AdminPageHeader";

interface AdminFundsManagementProps {
  cases: DisasterCase[];
  onCreateFund: () => void;
  onEditFund: (item: DisasterCase) => void;
  onExport: () => void;
}

const pageSize = 5;

const categoryLabels: Record<FundCategory, string> = {
  ALLOCATION: "Penetapan / Alokasi",
  DISTRIBUTION: "Penyaluran",
  REALIZATION: "Realisasi",
  PLAN: "Rencana / Usulan",
};

function sumFor(records: FundRecord[], category: FundCategory) {
  return records
    .filter((record) => record.category === category)
    .reduce((total, record) => total + record.amount, 0);
}

function formatDate(value?: string) {
  if (!value) return "Tanggal belum dicatat";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tanggal tidak valid";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getCategoryClass(category: FundCategory) {
  if (category === "ALLOCATION") return "border-blue-200 bg-blue-50 text-blue-800";
  if (category === "DISTRIBUTION") return "border-teal-200 bg-teal-50 text-teal-800";
  if (category === "REALIZATION") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  return "border-amber-200 bg-amber-50 text-amber-800";
}

export default function AdminFundsManagement({
  cases,
  onCreateFund,
  onEditFund,
  onExport,
}: AdminFundsManagementProps) {
  const shouldReduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [caseFilter, setCaseFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | FundCategory>("ALL");
  const [purposeFilter, setPurposeFilter] = useState("ALL");
  const [yearFilter, setYearFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const allRecords = useMemo(
    () => cases.flatMap((item) => item.fundRecords.map((record) => ({ record, item }))),
    [cases],
  );
  const purposes = useMemo(
    () => [...new Set(allRecords.map(({ record }) => record.purpose?.trim()).filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b, "id")),
    [allRecords],
  );
  const years = useMemo(
    () => [...new Set(allRecords.map(({ record }) => record.documentDate?.slice(0, 4)).filter((value): value is string => Boolean(value)))].sort((a, b) => b.localeCompare(a)),
    [allRecords],
  );

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("id-ID");
    return allRecords.filter(({ record, item }) => {
      const matchesCase = caseFilter === "ALL" || item.id === caseFilter;
      const matchesCategory = categoryFilter === "ALL" || record.category === categoryFilter;
      const matchesPurpose = purposeFilter === "ALL" || record.purpose === purposeFilter;
      const matchesYear = yearFilter === "ALL" || record.documentDate?.startsWith(yearFilter);
      const searchable = [
        item.title,
        item.affectedArea,
        record.id,
        record.purpose,
        record.periodLabel,
        record.sources.map((source) => source.title).join(" "),
      ].filter(Boolean).join(" ").toLocaleLowerCase("id-ID");
      return matchesCase && matchesCategory && matchesPurpose && matchesYear && searchable.includes(normalizedQuery);
    }).sort((a, b) =>
      (b.record.documentDate ?? b.item.updatedAt).localeCompare(a.record.documentDate ?? a.item.updatedAt),
    );
  }, [allRecords, caseFilter, categoryFilter, purposeFilter, query, yearFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const visibleRecords = filteredRecords.slice((page - 1) * pageSize, page * pageSize);
  const allFundRecords = allRecords.map(({ record }) => record);
  const allocation = sumFor(allFundRecords, "ALLOCATION");
  const realization = sumFor(allFundRecords, "REALIZATION");
  const remaining = allocation - realization;
  const plans = allFundRecords.filter((record) => record.category === "PLAN");
  const planTotal = sumFor(allFundRecords, "PLAN");
  const distributions = useMemo(() => {
    const groups = new Map<string, number>();
    for (const { record } of allRecords) {
      if (record.category !== "DISTRIBUTION") continue;
      const label = record.purpose?.trim() || "Pos belum ditentukan";
      groups.set(label, (groups.get(label) ?? 0) + record.amount);
    }
    return [...groups.entries()]
      .map(([label, amount]) => ({ label, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [allRecords]);
  const totalDistribution = distributions.reduce((total, item) => total + item.amount, 0);
  const distributionTones = [
    { bar: "bg-[#087C67]", dot: "bg-[#087C67]" },
    { bar: "bg-sky-600", dot: "bg-sky-600" },
    { bar: "bg-amber-700", dot: "bg-amber-700" },
    { bar: "bg-slate-600", dot: "bg-slate-600" },
    { bar: "bg-violet-600", dot: "bg-violet-600" },
  ];
  const displayedDistribution = distributions.slice(0, 5);
  const progress = allocation > 0 ? Math.min(100, Math.max(0, (realization / allocation) * 100)) : 0;
  const resetFilters = () => {
    setQuery("");
    setCaseFilter("ALL");
    setCategoryFilter("ALL");
    setPurposeFilter("ALL");
    setYearFilter("ALL");
    setPage(1);
  };

  const stats = [
    {
      label: "Total Penetapan / Alokasi",
      value: formatRupiah(allocation),
      badge: "ALOKASI",
      detail: `${allFundRecords.filter((record) => record.category === "ALLOCATION").length} catatan penetapan`,
      tone: "border-blue-200 bg-blue-50 text-blue-800",
    },
    {
      label: "Realisasi Tercatat",
      value: formatRupiah(realization),
      badge: "REALISASI",
      detail: "Jumlah dari catatan realisasi",
      tone: "border-emerald-200 bg-emerald-50 text-emerald-800",
    },
    {
      label: "Selisih Alokasi - Realisasi",
      value: formatRupiah(remaining),
      badge: remaining >= 0 ? "SELISIH" : "LEBIH ALOKASI",
      detail: "Perhitungan aritmetis; bukan saldo bank",
      tone: remaining >= 0 ? "border-indigo-200 bg-indigo-50 text-indigo-800" : "border-rose-200 bg-rose-50 text-rose-800",
    },
    {
      label: "Rencana / Usulan",
      value: `${plans.length} catatan`,
      badge: "BELUM DEFINITIF",
      detail: `Nilai usulan tercatat: ${formatRupiah(planTotal)}`,
      tone: "border-amber-200 bg-amber-50 text-amber-800",
    },
  ];

  return (
    <div className="min-w-0 flex-1 bg-[#F8F7FC] text-[#202B40]">
      <AdminPageHeader
        onPrimaryAction={onCreateFund}
        primaryLabel="Catat Alokasi / SP2D Baru"
        onExport={onExport}
        exportLabel="Ekspor Laporan Fiskal"
        title="Catatan Alokasi & Pagu DSP"
      />
      <main className="px-4 py-5 sm:px-6 lg:px-7 lg:py-6">
        <div className="mx-auto grid max-w-[1500px] gap-4">
          <aside className="grid gap-2 rounded-lg border border-amber-300 bg-[#FFFBEB] p-3 text-amber-900 sm:grid-cols-[20px_minmax(0,1fr)] sm:items-start sm:px-4">
            <span className="grid size-5 place-items-center rounded-full border border-amber-600 text-[11px] font-bold" aria-hidden="true">!</span>
            <div>
              <h2 className="text-[11px] font-bold">Batasan ruang lingkup verifikasi Dana Siap Pakai</h2>
              <p className="mt-0.5 text-[10px] leading-4 text-amber-800">
                Data berasal dari catatan lokal dan belum diverifikasi melalui sistem keuangan. Rencana/usulan dipisahkan dari alokasi dan realisasi; selisih bukan saldo rekening maupun bukti penyaluran.
              </p>
            </div>
          </aside>

          <section className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4" aria-label="Ringkasan catatan DSP">
            {stats.map((stat, index) => (
              <motion.article
                className="min-w-0 rounded-lg border border-[#E0E6ED] bg-white p-3.5 shadow-[0_2px_8px_rgb(19_27_46_/_4%)] sm:p-4"
                key={stat.label}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.18, delay: shouldReduceMotion ? 0 : index * 0.04 }}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[10px] font-semibold text-[#58677B]">{stat.label}</p>
                  <span className={`shrink-0 rounded border px-1.5 py-1 text-[7px] font-bold ${stat.tone}`}>{stat.badge}</span>
                </div>
                <p className="mt-2 break-words text-[clamp(17px,2vw,22px)] leading-7 font-bold tracking-[-0.04em] text-[#202B40]">{stat.value}</p>
                <p className="mt-1 text-[9px] leading-4 text-[#718096]">{stat.detail}</p>
                {stat.label === "Realisasi Tercatat" && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[8px] text-[#68768A]">
                      <span>Proporsi dari alokasi</span>
                      <strong>{allocation > 0 ? `${progress.toFixed(1)}%` : "—"}</strong>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#E8EDF2]">
                      <span className="block h-full rounded-full bg-[#087C67]" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}
              </motion.article>
            ))}
          </section>

          <section className="overflow-hidden rounded-lg border border-[#DDE3EA] bg-white p-4 shadow-[0_2px_8px_rgb(19_27_46_/_4%)] sm:p-5" aria-labelledby="fund-distribution-title">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#29364C]" id="fund-distribution-title">Distribusi Catatan Penyaluran per Pos</h2>
                <p className="mt-1 text-[10px] text-[#718096]">Dikelompokkan dari tujuan pada catatan berjenis penyaluran.</p>
              </div>
              <span className="text-[9px] font-semibold text-[#68768A]">Total penyaluran tercatat: {formatRupiah(totalDistribution)}</span>
            </div>
            <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-[#EEF1F4]" aria-label="Proporsi catatan penyaluran">
              {displayedDistribution.map((group, index) => (
                <span
                  className={`${distributionTones[index % distributionTones.length].bar} h-full`}
                  key={group.label}
                  style={{ width: `${totalDistribution > 0 ? (group.amount / totalDistribution) * 100 : 0}%` }}
                  title={`${group.label}: ${formatRupiah(group.amount)}`}
                />
              ))}
            </div>
            {displayedDistribution.length ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {displayedDistribution.map((group, index) => (
                  <article className="min-w-0" key={group.label}>
                    <p className="flex items-start gap-1.5 text-[9px] leading-4 text-[#5D6A7E]">
                      <span className={`mt-1 size-2 shrink-0 rounded-sm ${distributionTones[index % distributionTones.length].dot}`} aria-hidden="true" />
                      <span>{group.label}</span>
                    </p>
                    <strong className="mt-1 block break-words text-[11px] text-[#29364C]">{formatRupiah(group.amount)}</strong>
                    <span className="text-[8px] text-[#718096]">
                      {totalDistribution > 0 ? `${((group.amount / totalDistribution) * 100).toFixed(1)}% dari penyaluran` : "Belum ada nilai"}
                    </span>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-md border border-dashed border-[#D9E1E8] px-3 py-5 text-center text-[10px] text-[#718096]">
                Belum ada catatan penyaluran. Tambahkan catatan melalui editor kasus untuk melihat distribusi per pos.
              </p>
            )}
          </section>

          <section className="rounded-lg border border-[#DDE3EA] bg-white p-3 shadow-[0_2px_8px_rgb(19_27_46_/_4%)]" aria-label="Filter catatan DSP">
            <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-[minmax(150px,1.3fr)_minmax(130px,1fr)_minmax(130px,1fr)_minmax(110px,.7fr)_minmax(180px,1fr)]">
              <label className="grid gap-1 text-[9px] font-semibold text-[#536176]">
                Kasus bencana
                <select className="min-h-9 min-w-0 rounded-md border border-[#D4DDE5] bg-white px-2.5 text-[10px] font-normal text-[#46556A] outline-none focus:border-[#087C67]" onChange={(event) => { setCaseFilter(event.target.value); setPage(1); }} value={caseFilter}>
                  <option value="ALL">Semua kasus terdaftar</option>
                  {cases.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                </select>
              </label>
              <label className="grid gap-1 text-[9px] font-semibold text-[#536176]">
                Jenis catatan
                <select className="min-h-9 rounded-md border border-[#D4DDE5] bg-white px-2.5 text-[10px] font-normal text-[#46556A] outline-none focus:border-[#087C67]" onChange={(event) => { setCategoryFilter(event.target.value as "ALL" | FundCategory); setPage(1); }} value={categoryFilter}>
                  <option value="ALL">Semua jenis</option>
                  {Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label className="grid gap-1 text-[9px] font-semibold text-[#536176]">
                Pos penggunaan
                <select className="min-h-9 rounded-md border border-[#D4DDE5] bg-white px-2.5 text-[10px] font-normal text-[#46556A] outline-none focus:border-[#087C67]" onChange={(event) => { setPurposeFilter(event.target.value); setPage(1); }} value={purposeFilter}>
                  <option value="ALL">Semua pos anggaran</option>
                  {purposes.map((purpose) => <option key={purpose} value={purpose}>{purpose}</option>)}
                </select>
              </label>
              <label className="grid gap-1 text-[9px] font-semibold text-[#536176]">
                Tahun dokumen
                <select className="min-h-9 rounded-md border border-[#D4DDE5] bg-white px-2.5 text-[10px] font-normal text-[#46556A] outline-none focus:border-[#087C67]" onChange={(event) => { setYearFilter(event.target.value); setPage(1); }} value={yearFilter}>
                  <option value="ALL">Semua tahun</option>
                  {years.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </label>
              <div className="grid gap-1 text-[9px] font-semibold text-[#536176]">
                Cari catatan
                <div className="flex gap-2">
                  <input className="min-h-9 min-w-0 flex-1 rounded-md border border-[#D4DDE5] px-2.5 text-[10px] font-normal outline-none focus:border-[#087C67]" onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Kasus, SP2D, pos..." value={query} />
                  <button className="min-h-9 rounded-md border border-[#D4DDE5] px-2.5 text-[10px] font-semibold text-[#58677B] hover:bg-slate-50" onClick={resetFilters} type="button">Reset</button>
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-[#DDE3EA] bg-white shadow-[0_2px_8px_rgb(19_27_46_/_4%)]" aria-label="Buku kas dan registrasi DSP">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6EBF0] px-4 py-3.5 sm:px-5">
              <div>
                <h2 className="text-sm font-bold text-[#29364C]">Buku Kas &amp; Registrasi DSP</h2>
                <p className="mt-1 text-[10px] text-[#718096]">Rincian catatan alokasi, penyaluran, realisasi, dan rencana.</p>
              </div>
              <span className="text-[9px] text-[#68768A]">Menampilkan {visibleRecords.length} dari {filteredRecords.length} catatan</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[970px] table-fixed border-collapse text-left">
                <thead className="bg-[#F1F2FC] text-[9px] font-bold uppercase tracking-[0.04em] text-[#536176]">
                  <tr>
                    <th className="w-[15%] px-3 py-3">No. Catatan / Rujukan</th>
                    <th className="w-[19%] px-3 py-3">Kasus Terkait</th>
                    <th className="w-[18%] px-3 py-3">Pos &amp; Jenis Catatan</th>
                    <th className="w-[14%] px-3 py-3 text-right">Nilai Tercatat</th>
                    <th className="w-[14%] px-3 py-3">Periode / Tanggal</th>
                    <th className="w-[13%] px-3 py-3">Dokumen Rujukan</th>
                    <th className="w-[7%] px-2 py-3"><span className="sr-only">Aksi</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6EBF0] text-[10px]">
                  {visibleRecords.length ? visibleRecords.map(({ record, item }) => (
                    <tr className="align-top transition-colors hover:bg-[#FBFCFD]" key={record.id}>
                      <td className="px-3 py-3.5">
                        <strong className="block break-all text-[9px] leading-4 font-bold text-[#087C67]">{record.id}</strong>
                        <span className="mt-1 block text-[8px] text-[#718096]">{record.caseId}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <strong className="block leading-[14px] font-bold text-[#344258]">{item.title}</strong>
                        <span className="mt-1 block text-[8px] leading-3 text-[#718096]">{item.affectedArea}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="block leading-[14px] text-[#40506A]">{record.purpose || "Pos penggunaan belum dicatat"}</span>
                        <span className={`mt-1 inline-flex rounded border px-1.5 py-0.5 text-[8px] font-bold ${getCategoryClass(record.category)}`}>
                          {categoryLabels[record.category]}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-right">
                        <strong className="block whitespace-nowrap font-bold text-[#29364C]">{formatRupiah(record.amount)}</strong>
                        <span className="mt-1 block text-[8px] text-[#718096]">{record.currency}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="block text-[#46556A]">{record.periodLabel || "Periode tidak dicatat"}</span>
                        <span className="mt-1 block text-[8px] text-[#718096]">{formatDate(record.documentDate)}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        {record.sources.length ? record.sources.map((source) => (
                          source.url ? (
                            <a className="mb-1 inline-flex max-w-full items-center gap-1 break-all rounded border border-sky-200 bg-sky-50 px-1.5 py-1 text-[8px] font-semibold text-sky-800 hover:underline" href={source.url} key={source.id} rel="noreferrer" target="_blank">
                              {source.publisher || source.title}
                            </a>
                          ) : (
                            <span className="mb-1 block text-[8px] leading-3 text-[#718096]" key={source.id}>{source.title}</span>
                          )
                        )) : <span className="text-[8px] text-amber-700">Belum tertaut</span>}
                      </td>
                      <td className="px-2 py-3">
                        <button
                          aria-label={`Edit catatan DSP untuk ${item.title}`}
                          className="grid size-8 place-items-center rounded-md text-[#5D6A7E] transition hover:bg-teal-50 hover:text-[#087C67] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087C67]"
                          onClick={() => onEditFund(item)}
                          type="button"
                        >
                          <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="m14 5 5 5M4 20l4.2-.8L19 8.4a2.1 2.1 0 0 0-3-3L5.2 16.2 4 20Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td className="px-4 py-12 text-center text-xs text-[#718096]" colSpan={7}>
                        {allRecords.length ? "Tidak ada catatan yang sesuai dengan filter." : "Belum ada catatan dana. Tambahkan rincian melalui tombol di atas."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E6EBF0] px-3 py-3 text-[9px] text-[#68768A]">
              <span>
                Menampilkan {filteredRecords.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filteredRecords.length)} dari <strong className="text-[#344258]">{filteredRecords.length} catatan DSP</strong>
              </span>
              <nav className="flex items-center gap-1" aria-label="Navigasi halaman catatan DSP">
                <button className="min-h-7 rounded border border-[#D9E1E8] px-2 text-[9px] font-semibold disabled:cursor-not-allowed disabled:opacity-45" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button">Sebelumnya</button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    aria-current={pageNumber === page ? "page" : undefined}
                    className={`size-7 rounded border text-[9px] font-bold ${pageNumber === page ? "border-[#087C67] bg-[#087C67] text-white" : "border-[#D9E1E8] text-[#536176] hover:bg-slate-50"}`}
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    type="button"
                  >
                    {pageNumber}
                  </button>
                ))}
                <button className="min-h-7 rounded border border-[#D9E1E8] px-2 text-[9px] font-semibold disabled:cursor-not-allowed disabled:opacity-45" disabled={page >= pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} type="button">Selanjutnya</button>
              </nav>
            </footer>
          </section>

          <aside className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#DDE3EA] bg-[#F1F2FC] px-4 py-3 text-[9px] leading-4 text-[#59677C]">
            <span>Data tersimpan lokal; angka merupakan penjumlahan catatan sesuai kategori.</span>
            <span className="font-semibold text-[#087C67]">Rencana tidak dihitung sebagai alokasi atau realisasi.</span>
          </aside>
        </div>
      </main>
    </div>
  );
}
