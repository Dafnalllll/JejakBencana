"use client";

import { startTransition, useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";
import AdminConfirmDialog from "@/components/AdminConfirmDialog";
import AdminPageHeader from "@/components/AdminPageHeader";
import AdminSidebar from "@/components/AdminSidebar";
import DemoDataBanner from "@/components/DemoDataBanner";
import { getStoredSources, saveStoredSources, type SourceItem } from "@/lib/mockService";

type SourceFilter = "ALL" | "HTTPS" | "GOVERNMENT" | "MISSING" | "REVIEW";

const pageSize = 5;

function getSourceDomain(value: string) {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
    return parsed.hostname.toLocaleLowerCase("id");
  } catch {
    return "";
  }
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isGovernmentDomain(value: string) {
  const domain = getSourceDomain(value);
  return domain === "go.id" || domain.endsWith(".go.id");
}

function formatSourceDate(value?: string) {
  if (!value) return "Belum dicatat";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tanggal tidak valid";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function AdminSourcesPage() {
  const router = useRouter();
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("ALL");
  const [page, setPage] = useState(1);
  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sourceToDelete, setSourceToDelete] = useState<SourceItem | null>(null);
  const [formError, setFormError] = useState("");

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [checkedAt, setCheckedAt] = useState("");
  const [note, setNote] = useState("");
  const normalizedSearch = searchQuery.trim().toLocaleLowerCase("id");
  const filteredSources = useMemo(() => sources.filter((source) => {
    const domain = getSourceDomain(source.url);
    const matchesSearch = [source.title, source.publisher, source.url, source.note]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("id")
      .includes(normalizedSearch);
    const matchesFilter = sourceFilter === "ALL"
      || (sourceFilter === "HTTPS" && isHttpsUrl(source.url))
      || (sourceFilter === "GOVERNMENT" && isGovernmentDomain(source.url))
      || (sourceFilter === "MISSING" && !source.url.trim())
      || (sourceFilter === "REVIEW" && (!domain || !source.checkedAt));
    return matchesSearch && matchesFilter;
  }), [normalizedSearch, sourceFilter, sources]);
  const pageCount = Math.max(1, Math.ceil(filteredSources.length / pageSize));
  const visibleSources = filteredSources.slice((page - 1) * pageSize, page * pageSize);
  const selectedSource = visibleSources.find((source) => source.id === selectedSourceId)
    ?? visibleSources[0]
    ?? null;
  const httpsCount = sources.filter((source) =>
    isHttpsUrl(source.url),
  ).length;
  const governmentCount = sources.filter((source) => isGovernmentDomain(source.url)).length;
  const needsReviewCount = sources.filter((source) =>
    !getSourceDomain(source.url) || !source.checkedAt,
  ).length;

  useEffect(() => {
    if (!localStorage.getItem("jejak_bencana_auth")) {
      router.push("/login");
      return;
    }

    startTransition(() => {
      const storedSources = getStoredSources();
      setSources(storedSources);
      setSelectedSourceId(storedSources[0]?.id ?? "");
      setIsLoading(false);
    });
  }, [router]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle("");
    setUrl("");
    setPublisher("");
    setPublishedAt("");
    setCheckedAt("");
    setNote("");
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: SourceItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setUrl(item.url);
    setPublisher(item.publisher);
    setPublishedAt(item.publishedAt || "");
    setCheckedAt(item.checkedAt || "");
    setNote(item.note || "");
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedTitle = title.trim();
    const normalizedPublisher = publisher.trim();

    if (!normalizedTitle || !normalizedPublisher) {
      setFormError("Judul dokumen dan penerbit wajib diisi.");
      return;
    }

    let updated: SourceItem[];
    let savedId: string;
    if (editingId) {
      savedId = editingId;
      updated = sources.map((source) =>
        source.id === editingId
          ? {
              ...source,
              title: normalizedTitle,
              url: url.trim(),
              publisher: normalizedPublisher,
              publishedAt,
              checkedAt,
              note: note.trim(),
            }
          : source,
      );
    } else {
      const newItem: SourceItem = {
        id: `src-${Date.now()}`,
        title: normalizedTitle,
        url: url.trim(),
        publisher: normalizedPublisher,
        publishedAt,
        checkedAt,
        note: note.trim(),
      };
      savedId = newItem.id;
      updated = [newItem, ...sources];
    }

    setSources(updated);
    setSelectedSourceId(savedId);
    saveStoredSources(updated);
    setFormError("");
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!sourceToDelete) return;

    const updated = sources.filter((source) => source.id !== sourceToDelete.id);
    setSources(updated);
    if (selectedSourceId === sourceToDelete.id) {
      setSelectedSourceId(updated[0]?.id ?? "");
    }
    setPage(1);
    saveStoredSources(updated);
    setSourceToDelete(null);
  };

  const exportSources = () => {
    const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const rows = [
      ["Judul dokumen", "Penerbit", "URL", "Domain", "Tanggal publikasi", "Terakhir diperiksa", "Catatan"],
      ...sources.map((source) => [
        source.title,
        source.publisher,
        source.url,
        getSourceDomain(source.url),
        source.publishedAt ?? "",
        source.checkedAt ?? "",
        source.note ?? "",
      ]),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map(quote).join(",")).join("\r\n")}`;
    const file = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const objectUrl = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = "rujukan-jejak-bencana.csv";
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSourceFilter("ALL");
    setPage(1);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // The local demo session is cleared even when the endpoint is unavailable.
    }
    localStorage.removeItem("jejak_bencana_auth");
    router.push("/login");
  };

  return (
    <div className="admin-shell">
      <DemoDataBanner admin />
      <div className="admin-layout">
        <AdminSidebar
          currentStep={0}
          onCreateCase={() => router.push("/admin")}
          onLogout={handleLogout}
          onNavigateToStep={() => router.push("/admin")}
        />
        <div className="min-w-0 flex-1 bg-[#F7F8FC] text-[#202B40]">
          <AdminPageHeader
            onPrimaryAction={handleOpenCreate}
            primaryLabel="Tambah Dokumen Rujukan"
            onExport={exportSources}
            title="Verifikasi Sumber & Dokumen Resmi"
          />
          <main className="px-4 py-5 sm:px-6 lg:px-7 lg:py-6">
            <div className="mx-auto grid max-w-[1500px] gap-4">
              <aside className="grid gap-2 rounded-lg border border-amber-300 bg-[#FFFBEB] p-3 text-amber-900 sm:grid-cols-[20px_minmax(0,1fr)_auto] sm:items-center sm:px-4">
                <span className="grid size-5 place-items-center rounded-full border border-amber-600 text-[11px] font-bold" aria-hidden="true">!</span>
                <div>
                  <h2 className="text-[11px] font-bold">Standar integritas dokumen</h2>
                  <p className="mt-0.5 text-[10px] leading-4 text-amber-800">
                    Ringkasan ini memeriksa metadata yang tersimpan saja. Domain, tanggal pemeriksaan, dan URL tidak membuktikan isi atau keaslian dokumen.
                  </p>
                </div>
                <span className="text-[9px] font-semibold tracking-wide text-amber-800 sm:text-right">DATA DEMO · LOKAL</span>
              </aside>

              <section className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4" aria-label="Ringkasan sumber dokumen">
                {[
                  {
                    label: "Total Dokumen Terdaftar",
                    value: sources.length,
                    detail: "Rujukan tersimpan di perangkat ini",
                    tone: "border-blue-200 bg-blue-50 text-blue-700",
                    icon: "▤",
                  },
                  {
                    label: "URL HTTPS Tercatat",
                    value: `${httpsCount} / ${sources.length}`,
                    detail: "Skema URL tersimpan menggunakan HTTPS",
                    tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
                    icon: "↗",
                  },
                  {
                    label: "Domain .go.id Tercatat",
                    value: governmentCount,
                    detail: "Domain URL cocok dengan akhiran .go.id",
                    tone: "border-amber-200 bg-amber-50 text-amber-700",
                    icon: "◎",
                  },
                  {
                    label: "Metadata Perlu Ditinjau",
                    value: needsReviewCount,
                    detail: "URL tidak valid atau tanggal pemeriksaan kosong",
                    tone: "border-violet-200 bg-violet-50 text-violet-700",
                    icon: "◷",
                  },
                ].map((stat) => (
                  <article className="min-w-0 rounded-lg border border-[#E0E6ED] bg-white p-3.5 shadow-[0_2px_8px_rgb(19_27_46_/_4%)] sm:p-4" key={stat.label}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-semibold text-[#58677B]">{stat.label}</p>
                        <p className="mt-1 text-[25px] leading-8 font-bold tracking-[-0.04em] text-[#202B40]">{stat.value}</p>
                      </div>
                      <span className={`grid size-8 shrink-0 place-items-center rounded-md border text-sm font-bold ${stat.tone}`} aria-hidden="true">{stat.icon}</span>
                    </div>
                    <p className="mt-1 text-[9px] leading-4 text-[#718096]">{stat.detail}</p>
                  </article>
                ))}
              </section>

              <section className="rounded-lg border border-[#DDE3EA] bg-white p-3 shadow-[0_2px_8px_rgb(19_27_46_/_4%)]" aria-label="Filter dokumen sumber">
                <div className="grid gap-2.5 sm:grid-cols-[minmax(200px,1fr)_minmax(150px,auto)_auto] sm:items-center">
                  <label className="flex min-h-9 items-center gap-2 rounded-md border border-[#D4DDE5] px-2.5 text-[#75839A] focus-within:border-[#087C67] focus-within:ring-2 focus-within:ring-[#087C67]/10">
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" strokeWidth="1.7" />
                      <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                    <span className="sr-only">Cari dokumen sumber</span>
                    <input
                      className="w-full min-w-0 bg-transparent text-[10px] text-[#29364C] outline-none placeholder:text-[#8995A7]"
                      onChange={(event) => { setSearchQuery(event.target.value); setPage(1); }}
                      placeholder="Cari nomor SK, perihal, atau hash berkas..."
                      type="search"
                      value={searchQuery}
                    />
                  </label>
                  <label className="flex items-center gap-2 text-[10px] text-[#536176]">
                    <span>Status:</span>
                    <select
                      className="min-h-9 min-w-0 rounded-md border border-[#D4DDE5] bg-white px-2.5 text-[10px] text-[#46556A] outline-none focus:border-[#087C67]"
                      onChange={(event) => { setSourceFilter(event.target.value as SourceFilter); setPage(1); }}
                      value={sourceFilter}
                    >
                      <option value="ALL">Semua metadata</option>
                      <option value="HTTPS">URL HTTPS</option>
                      <option value="GOVERNMENT">Domain .go.id</option>
                      <option value="MISSING">URL belum ada</option>
                      <option value="REVIEW">Perlu ditinjau</option>
                    </select>
                  </label>
                  <button
                    className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border border-[#D4DDE5] px-2.5 text-[10px] font-semibold text-[#58677B] transition hover:bg-[#F7F9FB]"
                    onClick={resetFilters}
                    type="button"
                  >
                    Reset filter
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#EDF0F3] pt-2 text-[9px]">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 text-[#718096]">Filter cepat:</span>
                    {([
                      ["ALL", `Semua (${sources.length})`],
                      ["GOVERNMENT", `Domain .go.id (${governmentCount})`],
                      ["REVIEW", `Perlu ditinjau (${needsReviewCount})`],
                    ] as const).map(([value, label]) => (
                      <button
                        className={`rounded border px-2 py-1 font-semibold ${
                          sourceFilter === value
                            ? "border-teal-200 bg-teal-50 text-teal-800"
                            : "border-[#E0E6ED] text-[#637187] hover:bg-slate-50"
                        }`}
                        key={value}
                        onClick={() => { setSourceFilter(value); setPage(1); }}
                        type="button"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <span className="text-[#718096]" aria-live="polite">
                    Menampilkan {visibleSources.length} dari {filteredSources.length} dokumen
                  </span>
                </div>
              </section>

              {isLoading ? (
                <div className="rounded-lg border border-[#E0E6ED] bg-white p-5 text-xs text-[#718096]" role="status">
                  Memuat sumber dokumen...
                </div>
              ) : sources.length === 0 ? (
                <section className="grid min-h-64 place-items-center rounded-lg border border-[#E0E6ED] bg-white p-6 text-center">
                  <div>
                    <h2 className="text-sm font-bold text-[#344258]">Belum ada dokumen rujukan</h2>
                    <p className="mt-1 text-xs text-[#718096]">Tambahkan dokumen untuk mulai mencatat referensi.</p>
                    <button className="mt-4 rounded-md bg-[#087C67] px-3 py-2 text-xs font-bold text-white" onClick={handleOpenCreate} type="button">
                      Tambah Dokumen
                    </button>
                  </div>
                </section>
              ) : filteredSources.length === 0 ? (
                <section className="grid min-h-56 place-items-center rounded-lg border border-[#E0E6ED] bg-white p-6 text-center">
                  <div>
                    <h2 className="text-sm font-bold text-[#344258]">Tidak ada dokumen yang sesuai</h2>
                    <p className="mt-1 text-xs text-[#718096]">Coba kata kunci atau filter yang berbeda.</p>
                    <button className="mt-3 text-xs font-bold text-[#087C67] hover:underline" onClick={resetFilters} type="button">Hapus filter</button>
                  </div>
                </section>
              ) : (
                <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(290px,.85fr)]">
                  <section className="overflow-hidden rounded-lg border border-[#DDE3EA] bg-white shadow-[0_2px_8px_rgb(19_27_46_/_4%)]" aria-label="Daftar validasi dokumen">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[690px] border-collapse text-left">
                        <thead className="bg-[#F7F8FC] text-[9px] font-bold uppercase tracking-[0.04em] text-[#536176]">
                          <tr>
                            <th className="w-[36%] px-3 py-3">Nomor &amp; Judul Dokumen</th>
                            <th className="w-[20%] px-3 py-3">Penerbit &amp; Domain</th>
                            <th className="w-[20%] px-3 py-3">Status Metadata</th>
                            <th className="w-[16%] px-3 py-3">Terakhir Diperiksa</th>
                            <th className="w-[8%] px-2 py-3"><span className="sr-only">Aksi</span></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E9EDF1] text-[10px]">
                          {visibleSources.map((source) => {
                            const domain = getSourceDomain(source.url);
                            const hasHttps = isHttpsUrl(source.url);
                            const needsReview = !domain || !source.checkedAt;
                            const isSelected = selectedSource?.id === source.id;
                            return (
                              <tr className={`${isSelected ? "bg-[#F0F7F6]" : "bg-white"} align-top transition-colors hover:bg-[#F8FAFC]`} key={source.id}>
                                <th className="px-3 py-3 text-left font-normal">
                                  <button
                                    className="text-left"
                                    onClick={() => setSelectedSourceId(source.id)}
                                    type="button"
                                  >
                                    <span className="block leading-[15px] font-bold text-[#29364C]">{source.title}</span>
                                    <span className="mt-1 block text-[8px] leading-3 text-[#7C899A]">{source.id}</span>
                                  </button>
                                </th>
                                <td className="px-3 py-3">
                                  <span className="block leading-[14px] font-semibold text-[#46556A]">{source.publisher}</span>
                                  <span className={`mt-1 block break-all text-[8px] ${domain.endsWith(".go.id") || domain === "go.id" ? "text-emerald-700" : "text-[#7C899A]"}`}>
                                    {domain || "Domain belum tersedia"}
                                  </span>
                                </td>
                                <td className="px-3 py-3">
                                  <span className={`inline-flex rounded-full border px-2 py-1 text-[8px] font-bold ${
                                    needsReview
                                      ? "border-amber-200 bg-amber-50 text-amber-800"
                                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  }`}>
                                    {needsReview ? "PERLU DITINJAU" : "METADATA TERCATAT"}
                                  </span>
                                  <span className="mt-1 block text-[8px] text-[#718096]">
                                    {hasHttps ? "HTTPS" : source.url ? "HTTP" : "URL kosong"}
                                  </span>
                                </td>
                                <td className="px-3 py-3 leading-[14px] text-[#536176]">{formatSourceDate(source.checkedAt)}</td>
                                <td className="px-2 py-3">
                                  <button
                                    aria-label={`Edit ${source.title}`}
                                    className="grid size-8 place-items-center rounded-md text-[#5D6A7E] transition hover:bg-teal-50 hover:text-[#087C67]"
                                    onClick={() => handleOpenEdit(source)}
                                    type="button"
                                  >
                                    <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                      <path d="m14 5 5 5M4 20l4.2-.8L19 8.4a2.1 2.1 0 0 0-3-3L5.2 16.2 4 20Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E6EBF0] px-3 py-3 text-[9px] text-[#68768A]">
                      <span>
                        Menampilkan {filteredSources.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filteredSources.length)} dari <strong className="text-[#344258]">{filteredSources.length} dokumen</strong>
                      </span>
                      <nav className="flex items-center gap-1" aria-label="Navigasi halaman dokumen">
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

                  <aside className="overflow-hidden rounded-lg border border-[#DDE3EA] bg-white shadow-[0_2px_8px_rgb(19_27_46_/_4%)]" aria-label="Detail metadata dokumen terpilih">
                    {selectedSource ? (
                      <>
                        <div className="flex items-center justify-between gap-3 border-b border-[#E6EBF0] bg-[#F8FAFC] px-4 py-3">
                          <div>
                            <h2 className="text-xs font-bold text-[#29364C]">Pemeriksa Metadata</h2>
                            <p className="mt-0.5 text-[9px] text-[#718096]">Detail dari penyimpanan lokal</p>
                          </div>
                          <span className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-[8px] font-bold text-amber-800">
                            {getSourceDomain(selectedSource.url) ? "URL TERCATAT" : "URL KOSONG"}
                          </span>
                        </div>
                        <div className="grid gap-3 p-4">
                          <div>
                            <span className="text-[8px] font-bold uppercase tracking-wide text-[#718096]">Dokumen dipilih</span>
                            <h3 className="mt-1 text-sm leading-5 font-bold text-[#29364C]">{selectedSource.title}</h3>
                            <p className="mt-1 text-[10px] text-[#68768A]">{selectedSource.publisher}</p>
                          </div>
                          <div className="rounded-md border border-[#DDE3EA] bg-[#F8FAFC] p-3">
                            <span className="text-[8px] font-bold uppercase tracking-wide text-[#718096]">URL dan domain tercatat</span>
                            {getSourceDomain(selectedSource.url) ? (
                              <>
                                <a className="mt-1 block break-all text-[10px] font-semibold text-[#087C67] underline decoration-[#A7D6CC] underline-offset-2" href={selectedSource.url} rel="noreferrer" target="_blank">
                                  {selectedSource.url}
                                </a>
                                <p className="mt-2 text-[9px] text-[#64748B]">Domain: {getSourceDomain(selectedSource.url)}</p>
                              </>
                            ) : (
                              <p className="mt-1 text-[10px] leading-4 text-amber-800">Belum ada URL HTTP/HTTPS yang tercatat untuk dokumen ini.</p>
                            )}
                          </div>
                          <dl className="grid grid-cols-2 gap-2 rounded-md border border-[#E4E9EF] p-3 text-[9px]">
                            <div>
                              <dt className="text-[#718096]">Tanggal publikasi</dt>
                              <dd className="mt-1 font-semibold text-[#344258]">{formatSourceDate(selectedSource.publishedAt)}</dd>
                            </div>
                            <div>
                              <dt className="text-[#718096]">Terakhir diperiksa</dt>
                              <dd className="mt-1 font-semibold text-[#344258]">{formatSourceDate(selectedSource.checkedAt)}</dd>
                            </div>
                          </dl>
                          {selectedSource.note && (
                            <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                              <p className="text-[9px] leading-4 text-amber-900">{selectedSource.note}</p>
                            </div>
                          )}
                          <p className="rounded-md border border-[#DDE3EA] bg-[#F8FAFC] p-3 text-[9px] leading-4 text-[#5D6A7E]">
                            Tanggal pemeriksaan dan domain hanya metadata yang dicatat. Dokumen belum diverifikasi otomatis oleh sistem.
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <button className="min-h-9 rounded-md bg-[#006C62] px-3 text-[10px] font-bold text-white transition hover:bg-[#00564F]" onClick={() => handleOpenEdit(selectedSource)} type="button">
                              Edit Metadata
                            </button>
                            <button className="min-h-9 rounded-md border border-rose-300 bg-white px-3 text-[10px] font-semibold text-rose-700 transition hover:bg-rose-50" onClick={() => setSourceToDelete(selectedSource)} type="button">
                              Hapus Dokumen
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="p-6 text-center text-xs text-[#718096]">Pilih dokumen untuk melihat metadata.</div>
                    )}
                  </aside>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="admin-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsModalOpen(false);
          }}
        >
          <section
            aria-labelledby="source-modal-title"
            aria-modal="true"
            className="admin-modal admin-source-modal"
            role="dialog"
          >
            <h2 id="source-modal-title">
              {editingId ? "Edit Sumber Dokumen" : "Tambah Sumber Dokumen"}
            </h2>
            <p>Lengkapi detail referensi dan informasi pemeriksaannya.</p>
            <form className="admin-source-form" onSubmit={handleSave}>
              {formError && (
                <p className="admin-alert admin-alert--error" role="alert">
                  {formError}
                </p>
              )}
              <label className="admin-field">
                <span>Judul dokumen *</span>
                <input
                  autoFocus
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Contoh: SK Kepala BNPB No..."
                  required
                  value={title}
                />
              </label>
              <label className="admin-field">
                <span>URL / tautan dokumen</span>
                <input
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://..."
                  type="url"
                  value={url}
                />
              </label>
              <label className="admin-field">
                <span>Penerbit *</span>
                <input
                  onChange={(event) => setPublisher(event.target.value)}
                  placeholder="Contoh: BNPB"
                  required
                  value={publisher}
                />
              </label>
              <div className="admin-source-date-fields">
                <label className="admin-field">
                  <span>Tanggal publikasi</span>
                  <input
                    onChange={(event) => setPublishedAt(event.target.value)}
                    type="date"
                    value={publishedAt}
                  />
                </label>
                <label className="admin-field">
                  <span>Terakhir diperiksa</span>
                  <input
                    onChange={(event) => setCheckedAt(event.target.value)}
                    type="date"
                    value={checkedAt}
                  />
                </label>
              </div>
              <label className="admin-field">
                <span>Catatan / verifikasi</span>
                <textarea
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Catatan pemeriksaan dokumen..."
                  rows={3}
                  value={note}
                />
              </label>
              <div className="admin-modal__actions">
                <button
                  className="button-secondary"
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                >
                  Batal
                </button>
                <button className="button-primary" type="submit">
                  Simpan Sumber
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
      <AnimatePresence>
        {sourceToDelete && (
          <AdminConfirmDialog
            confirmLabel="Hapus sumber"
            description={`Sumber "${sourceToDelete.title}" akan dihapus dari daftar. Tindakan ini tidak dapat dibatalkan.`}
            onCancel={() => setSourceToDelete(null)}
            onConfirm={handleDelete}
            title="Hapus sumber dokumen?"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
