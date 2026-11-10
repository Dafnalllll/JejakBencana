"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { DisasterCase, FundCategory } from "@/types";
import { formatRupiah, getPublishedCases } from "@/lib/mockService";
import PublicFooter from "@/components/PublicFooter";
import LoadingState from "@/components/LoadingState";

const MotionLink = motion.create(Link);

function getLocationParts(location: string) {
  const [district = "", ...provinceParts] = location.split(",");
  const provinceText = provinceParts.join(",").trim();
  const province = provinceText.replace(/^(Provinsi|Prov\.)\s*/i, "");

  return { district: district.trim(), province };
}

function getLatestPeriod(item: DisasterCase) {
  if (item.periodStart && item.periodEnd) {
    return `${formatDate(item.periodStart)} – ${formatDate(item.periodEnd)}`;
  }
  if (item.periodStart) return `Mulai ${formatDate(item.periodStart)}`;
  return "Periode tidak dicantumkan";
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function totalForCategory(item: DisasterCase, category: FundCategory) {
  return item.fundRecords
    .filter((record) => record.category === category)
    .reduce((total, record) => total + record.amount, 0);
}

export default function CasesPage() {
  const shouldReduceMotion = useReducedMotion();
  const [cases, setCases] = useState<DisasterCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [provinceDraft, setProvinceDraft] = useState("");
  const [districtDraft, setDistrictDraft] = useState("");
  const [statusDraft, setStatusDraft] = useState("");
  const [appliedProvince, setAppliedProvince] = useState("");
  const [appliedDistrict, setAppliedDistrict] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("");

  useEffect(() => {
    let active = true;

    getPublishedCases()
      .then((data) => {
        if (active) setCases(data);
      })
      .catch(() => {
        if (active) setLoadError("Daftar kasus tidak dapat dimuat. Silakan coba lagi.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const provinces = useMemo(
    () =>
      Array.from(
        new Set(cases.map((item) => getLocationParts(item.affectedArea).province).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b, "id")),
    [cases],
  );
  const districts = useMemo(
    () =>
      Array.from(
        new Set(cases.map((item) => getLocationParts(item.affectedArea).district).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b, "id")),
    [cases],
  );
  const filteredCases = cases.filter((item) => {
    const location = getLocationParts(item.affectedArea);
    const matchesSearch = `${item.title} ${item.affectedArea} ${item.slug}`
      .toLocaleLowerCase("id-ID")
      .includes(searchQuery.trim().toLocaleLowerCase("id-ID"));

    return (
      matchesSearch &&
      (!appliedProvince || location.province === appliedProvince) &&
      (!appliedDistrict || location.district === appliedDistrict) &&
      (!appliedStatus || item.status === appliedStatus)
    );
  });

  function applyFilters() {
    setAppliedProvince(provinceDraft);
    setAppliedDistrict(districtDraft);
    setAppliedStatus(statusDraft);
  }

  function resetFilters() {
    setSearchQuery("");
    setProvinceDraft("");
    setDistrictDraft("");
    setStatusDraft("");
    setAppliedProvince("");
    setAppliedDistrict("");
    setAppliedStatus("");
  }

  return (
    <>
      <main className="mx-auto w-[92%] max-w-[1240px] flex-1 py-8 pb-12 max-md:w-[calc(100%-32px)] max-md:py-5 max-md:pb-9">
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs leading-5 text-[#64716F]" aria-label="Breadcrumb">
          <Link className="text-[#005C55] no-underline" href="/">Beranda</Link>
          <span aria-hidden="true">›</span>
          <span>Kasus Bencana</span>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Daftar Kasus Tanggap Darurat</span>
        </nav>

        <header className="mb-6 max-w-[900px]">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#64758C]">
            <span className="rounded-full border border-[#A7E6D3] bg-[#EFFBF7] px-3 py-1 text-[11px] font-bold tracking-[0.04em] text-[#087C67] uppercase">
              Portal informasi publik
            </span>
            <span aria-hidden="true">·</span>
            <span>Terbuka &amp; berbasis data tersedia</span>
          </div>
          <h1 className="mt-3 text-[clamp(32px,4vw,42px)] leading-[1.15] font-bold tracking-[-0.03em] text-[#131B2E]">
            Daftar Kasus Tanggap Darurat &amp; Alokasi DSP
          </h1>
          <p className="mt-3 max-w-[800px] text-base leading-7 text-[#64716F] max-md:text-sm max-md:leading-6">
            Direktori kasus bencana dan ringkasan informasi Dana Siap Pakai
            (DSP) non-donasi dari dokumen rujukan yang tersedia.
          </p>
        </header>

        <section
          className="mt-6 mb-7 grid gap-4 rounded-xl border border-[#D7E0EA] bg-white p-5 shadow-sm max-md:p-4"
          aria-label="Pencarian dan filter kasus"
        >
          <label className="flex min-h-12 w-full items-center gap-3 rounded-lg border border-[#D2DCE7] bg-[#FAFBFD] px-3 text-[#64716F] focus-within:border-[#0C8277] focus-within:outline-2 focus-within:outline-[#0C8277]/15">
            <span className="flex size-5 shrink-0" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="10.8" cy="10.8" r="6.8" strokeWidth="1.8" />
                <path d="m16 16 4.2 4.2" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <span className="sr-only">Cari nama kasus atau wilayah</span>
            <input
              className="w-full min-w-0 border-0 bg-transparent text-sm text-[#29364C] outline-none placeholder:text-sm placeholder:text-[#64716F]"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari nama bencana, kabupaten/kota, atau nomor dokumen..."
            />
            {searchQuery && (
              <button
                className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-[#EAEDFF] text-lg leading-none text-[#3E4947] hover:bg-[#DDE3EA]"
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Hapus pencarian"
              >
                ×
              </button>
            )}
          </label>

          <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
            <label className="grid gap-2 text-xs font-bold tracking-[0.04em] text-[#52627A] uppercase">
              <span>Provinsi</span>
              <select className="min-h-12 w-full rounded-lg border border-[#CFD9E5] bg-[#FAFBFD] px-3 text-sm font-normal tracking-normal text-[#29364C] normal-case" value={provinceDraft} onChange={(event) => setProvinceDraft(event.target.value)}>
                <option value="">Semua provinsi</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-xs font-bold tracking-[0.04em] text-[#52627A] uppercase">
              <span>Kabupaten / Kota</span>
              <select className="min-h-12 w-full rounded-lg border border-[#CFD9E5] bg-[#FAFBFD] px-3 text-sm font-normal tracking-normal text-[#29364C] normal-case" value={districtDraft} onChange={(event) => setDistrictDraft(event.target.value)}>
                <option value="">Semua kabupaten/kota</option>
                {districts.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-xs font-bold tracking-[0.04em] text-[#52627A] uppercase">
              <span>Status publikasi</span>
              <select className="min-h-12 w-full rounded-lg border border-[#CFD9E5] bg-[#FAFBFD] px-3 text-sm font-normal tracking-normal text-[#29364C] normal-case" value={statusDraft} onChange={(event) => setStatusDraft(event.target.value)}>
                <option value="">Semua status</option>
                <option value="PUBLISHED">Dipublikasikan</option>
              </select>
            </label>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-[#E5EAF0] pt-4 max-sm:flex-col max-sm:items-stretch">
            <span className="inline-flex items-center gap-2 text-xs text-[#64716F]" aria-live="polite">
              <i className="size-3.5 shrink-0 rounded-full border-2 border-[#0C8277]" aria-hidden="true" />
              {loading
                ? "Memuat daftar kasus..."
                : loadError
                  ? loadError
                  : `Menampilkan ${filteredCases.length} dari ${cases.length} kasus terpublikasi`}
            </span>
            <div className="flex shrink-0 gap-2 max-sm:self-end">
              <button type="button" className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#CCD7E3] bg-white px-4 text-xs font-bold text-[#40506A] hover:bg-[#F4F7FA]" onClick={resetFilters}>
                Reset filter
              </button>
              <button type="button" className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#0C8277] bg-[#0C8277] px-4 text-xs font-bold text-white hover:bg-[#07695F]" onClick={applyFilters}>
                <span aria-hidden="true">☷</span>
                Terapkan filter
              </button>
            </div>
          </div>
        </section>

        {loading ? (
          <LoadingState label="Memuat daftar kasus..." variant="list" />
        ) : loadError ? (
          <div className="grid justify-items-center rounded-xl border border-[#E4E8EB] bg-white px-6 py-14 text-center shadow-sm" role="alert">
            <h2 className="mt-4 text-xl leading-7 font-bold">Kasus tidak dapat dimuat</h2>
            <p className="mt-2 text-sm leading-6 text-[#64716F]">{loadError}</p>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="grid justify-items-center rounded-xl border border-[#E4E8EB] bg-white px-6 py-14 text-center shadow-sm" role="status">
            <span className="grid size-[38px] place-items-center rounded-full bg-[#EAEDFF] text-2xl text-[#005C55]" aria-hidden="true">⌕</span>
            <h2 className="mt-4 text-xl leading-7 font-bold">{searchQuery ? "Kasus tidak ditemukan" : "Belum ada kasus tersedia"}</h2>
            <p className="mt-2 text-sm leading-6 text-[#64716F]">
              {searchQuery
                ? "Coba kata kunci atau filter wilayah yang berbeda."
                : "Kasus yang dipublikasikan akan tampil di sini."}
            </p>
            <button className="mt-4 cursor-pointer border-0 bg-transparent text-sm font-bold text-[#005C55] hover:underline" type="button" onClick={resetFilters}>
              Reset pencarian dan filter
            </button>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-5" aria-label="Daftar kasus bencana">
            {filteredCases.map((item) => {
              const allocation = totalForCategory(item, "ALLOCATION");
              const realization = totalForCategory(item, "REALIZATION");
              const realizationPercent = allocation
                ? Math.min(100, Math.round((realization / allocation) * 100))
                : 0;
              const hasFinancialData = item.fundRecords.length > 0;

              return (
                <motion.article
                  key={item.id}
                  className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(260px,32%)] overflow-hidden rounded-[30px_0_38px_0] border border-[#D6E0E9] bg-white shadow-sm max-md:grid-cols-1"
                  whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                >
                  <div className="flex min-w-0 flex-col p-6 max-md:p-4">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-[#61728A]">
                      <span className="rounded-full border border-[#A7E6D3] bg-[#EFFBF7] px-3 py-1 text-[11px] font-bold tracking-[0.03em] text-[#087C67] uppercase">
                        {item.sourceDocuments.length
                          ? "Dokumen sumber tercatat"
                          : "Data contoh"}
                      </span>
                      <span className="text-[#65768B]">
                        {item.sourceDocuments.length} dokumen sumber
                      </span>
                      <span className="ml-auto inline-flex items-center gap-2 text-xs text-[#5D6D82] max-sm:ml-0">
                        <span aria-hidden="true">◷</span>
                        {getLatestPeriod(item)}
                      </span>
                    </div>
                    <h2 className="mt-3 text-2xl leading-8 font-bold tracking-[-0.02em] text-[#1B263C] max-md:text-xl max-md:leading-7">
                      {item.title}
                    </h2>
                    <p className="mt-2 mb-4 flex items-start gap-2 text-sm leading-6 text-[#64758C]">
                      <span className="text-[#0C8277]" aria-hidden="true">⌖</span>
                      {item.affectedArea}
                    </p>
                    <div className="rounded-lg border border-[#CDD9E5] bg-[#F4F6FF] px-4 pt-4 pb-3">
                      <div className="flex items-end justify-between gap-4 max-sm:flex-col max-sm:items-start">
                        <div className="grid gap-1">
                          <span className="text-[11px] font-bold tracking-[0.035em] text-[#63728A] uppercase">Alokasi / penetapan tercatat</span>
                          <strong className="text-base leading-6 font-bold text-[#1E2A40]">{allocation ? formatRupiah(allocation) : "Belum tersedia"}</strong>
                        </div>
                        <div className="grid gap-1 text-right max-sm:text-left">
                          <span className="text-[11px] font-bold tracking-[0.035em] text-[#63728A] uppercase">Realisasi dilaporkan</span>
                          <strong className="text-base leading-6 font-bold text-[#087C67]">{realization ? formatRupiah(realization) : "Belum tersedia"}</strong>
                        </div>
                      </div>
                      {hasFinancialData && allocation > 0 && (
                        <>
                          <div
                            className="mt-3 h-2 overflow-hidden rounded-full bg-[#DCE3EB]"
                            role="progressbar"
                            aria-label="Perbandingan realisasi terhadap alokasi tercatat"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={realizationPercent}
                          >
                            <span className="block h-full rounded-full bg-[#07936F] transition-[width] duration-[180ms]" style={{ width: `${realizationPercent}%` }} />
                          </div>
                          <div className="mt-2 flex justify-between gap-3 text-[11px] leading-4 text-[#718198] max-sm:flex-col">
                            <span>
                              {realization
                                ? `${realizationPercent}% dari alokasi tercatat`
                                : "Belum ada realisasi yang tercatat"}
                            </span>
                            <span>
                              {realization
                                ? `Sisa terhadap alokasi: ${formatRupiah(Math.max(0, allocation - realization))}`
                                : "Informasi mengikuti data yang tersedia"}
                            </span>
                          </div>
                        </>
                      )}
                      {!hasFinancialData && (
                        <p className="mt-3 text-xs leading-5 text-[#718198]">
                          Rincian alokasi dan realisasi belum tersedia pada daftar ini.
                        </p>
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4 border-t border-[#E5EAF0] pt-4 max-sm:flex-col max-sm:items-stretch">
                      <span className="inline-flex min-w-0 items-center gap-2 text-xs leading-5 text-[#5E6F84]">
                        <i className="grid size-3 shrink-0 place-items-center rounded-full border border-[#0C8277] text-[8px] leading-none text-[#0C8277] not-italic" aria-hidden="true">✓</i>
                        Sumber: {item.sourceDocuments[0]?.publisher ?? "Dokumen belum dicantumkan"}
                      </span>
                      <MotionLink
                        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#006C62] px-4 text-xs font-bold text-white no-underline hover:bg-[#00564F] max-sm:self-start"
                        href={`/kasus/${item.slug}`}
                        whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 24 }}
                      >
                        Buka detail kasus <span aria-hidden="true">→</span>
                      </MotionLink>
                    </div>
                  </div>
                  <div
                    className="relative min-h-[250px] overflow-hidden border-l border-[#D6E0E9] bg-[radial-gradient(ellipse_at_70%_22%,rgb(255_255_255_/_90%)_0_9%,transparent_10%),linear-gradient(165deg,#E8EEF1_0%,#DDE6E5_47%,#CAD7D5_48%,#EFF2F3_100%)] max-md:min-h-[210px] max-md:border-t max-md:border-l-0"
                    role="img"
                    aria-label="Dokumentasi lapangan belum tersedia"
                  >
                    <span className="absolute right-3 bottom-3 left-3 w-fit max-w-[calc(100%-24px)] rounded-md border border-[#CDD8E1]/85 bg-white/90 px-3 py-2 text-xs leading-5 text-[#48596F]">
                      Dokumentasi lapangan belum tersedia
                    </span>
                  </div>
                </motion.article>
              );
            })}
          </section>
        )}

        <aside className="mt-6 grid grid-cols-[20px_minmax(0,1fr)] gap-3 rounded-lg border border-[#F3D779] bg-[#FFF7D6] px-4 py-4 text-[#98500B]" role="note">
          <span className="text-sm text-[#A64E08]" aria-hidden="true">ⓘ</span>
          <div>
            <strong className="block text-sm leading-5">Batasan Informasi &amp; Ruang Lingkup Data Terbuka</strong>
            <p className="mt-2 text-xs leading-5 text-[#9A540E]">
              Informasi di halaman ini mengikuti dokumen rujukan yang
              dicantumkan. Data dapat belum lengkap dan bukan laporan transaksi
              individual. Portal Jejak Bencana bukan platform donasi atau
              pembayaran.
            </p>
          </div>
        </aside>
      </main>
      <PublicFooter />
    </>
  );
}
