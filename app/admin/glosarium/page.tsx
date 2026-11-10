"use client";

import { startTransition, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import AdminConfirmDialog from "@/components/AdminConfirmDialog";
import AdminSidebar from "@/components/AdminSidebar";
import DemoDataBanner from "@/components/DemoDataBanner";
import { getStoredGlossary, saveStoredGlossary, type GlossaryItem } from "@/lib/mockService";

export default function AdminGlossaryPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [glossary, setGlossary] = useState<GlossaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [termToDelete, setTermToDelete] = useState<GlossaryItem | null>(null);
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [formError, setFormError] = useState("");
  const normalizedSearch = searchQuery.trim().toLocaleLowerCase("id");
  const filteredGlossary = glossary.filter((item) =>
    `${item.term} ${item.definition}`.toLocaleLowerCase("id").includes(normalizedSearch),
  );

  useEffect(() => {
    if (!localStorage.getItem("jejak_bencana_auth")) {
      router.push("/admin/login");
      return;
    }

    startTransition(() => {
      setGlossary(getStoredGlossary());
      setIsLoading(false);
    });
  }, [router]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setTerm("");
    setDefinition("");
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GlossaryItem) => {
    setEditingId(item.id);
    setTerm(item.term);
    setDefinition(item.definition);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedTerm = term.trim();
    const normalizedDefinition = definition.trim();

    if (!normalizedTerm || !normalizedDefinition) {
      setFormError("Istilah dan definisi wajib diisi.");
      return;
    }

    const updated = editingId
      ? glossary.map((item) =>
          item.id === editingId
            ? { ...item, term: normalizedTerm, definition: normalizedDefinition }
            : item,
        )
      : [
          {
            id: `gls-${Date.now()}`,
            term: normalizedTerm,
            definition: normalizedDefinition,
          },
          ...glossary,
        ];

    setGlossary(updated);
    saveStoredGlossary(updated);
    setFormError("");
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!termToDelete) return;

    const updated = glossary.filter((item) => item.id !== termToDelete.id);
    setGlossary(updated);
    saveStoredGlossary(updated);
    setTermToDelete(null);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // The local demo session is cleared even when the endpoint is unavailable.
    }
    localStorage.removeItem("jejak_bencana_auth");
    router.push("/admin/login");
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
        <main className="admin-main">
          <header className="mb-5 flex items-start justify-between gap-4 max-md:flex-col max-md:items-stretch">
            <div>
              <span className="mb-1.5 inline-flex text-[9px] font-extrabold leading-[14px] tracking-[0.1em] text-[#087C67]">KONTEN PUBLIK</span>
              <h1 className="m-0 text-2xl font-bold leading-8 tracking-[-0.03em] text-[#131B2E]">Manajemen Glosarium</h1>
              <p className="mt-1.5 text-xs leading-[18px] text-[#64716F]">Kelola istilah dan definisi yang membantu publik memahami data kebencanaan.</p>
            </div>
            <button className="button-primary max-md:w-full" onClick={handleOpenCreate} type="button">
              <span aria-hidden="true" className="text-xl font-normal leading-none">+</span>
              Tambah Istilah
            </button>
          </header>

          <section className="overflow-hidden rounded-lg border border-[#E4E8EB] bg-white shadow-[0_1px_5px_rgb(19_27_46_/_4%)]" aria-label="Daftar istilah glosarium">
            <div className="flex items-center justify-between gap-[18px] px-5 pb-3.5 pt-[18px] max-md:flex-col max-md:items-stretch max-md:gap-3 max-md:p-[15px]">
              <div>
                <h2 className="m-0 text-sm font-bold leading-5 text-[#131B2E]">Istilah glosarium</h2>
                <p className="mt-[3px] text-[11px] leading-4 text-[#64716F]">Kelola definisi yang ditampilkan pada portal publik.</p>
              </div>
              <label className="flex min-h-9 w-[min(260px,42%)] items-center gap-2 rounded-[7px] border border-[#D9E1E3] bg-white px-2.5 text-[#78868A] focus-within:border-[#178477] focus-within:outline focus-within:outline-[3px] focus-within:outline-[#178477]/10 max-md:w-full">
                <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="10.8" cy="10.8" r="6.8" />
                  <path d="m16 16 4.5 4.5" />
                </svg>
                <span className="sr-only">Cari istilah atau definisi</span>
                <input
                  className="w-full min-w-0 border-0 bg-transparent text-[11px] text-[#131B2E] outline-none placeholder:text-[#8A9699]"
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Cari istilah..."
                  type="search"
                  value={searchQuery}
                />
              </label>
            </div>
            <div className="flex min-h-10 items-center gap-[7px] border-y border-[#E8EDEE] px-5 text-[10px] text-[#71807F] max-md:px-[15px]" aria-live="polite">
              <span className="inline-grid h-[22px] min-w-[22px] place-items-center rounded-md bg-[#EAF3F2] px-1.5 text-[10px] font-bold text-[#006C62]">{filteredGlossary.length}</span>
              <span>
                {searchQuery
                  ? `dari ${glossary.length} istilah`
                  : "istilah tersimpan"}
              </span>
            </div>
            {isLoading ? (
              <div className="admin-data-loading">
                <div className="content-skeleton content-skeleton--list" role="status" aria-label="Memuat istilah glosarium" aria-live="polite">
                  <span className="sr-only">Memuat istilah glosarium...</span>
                  <div className="skeleton-list" aria-hidden="true">
                    {[0, 1, 2].map((item) => <article className="skeleton-card" key={item}><span className="skeleton-block skeleton-block--short" /><span className="skeleton-block skeleton-block--title" /><span className="skeleton-block skeleton-block--text" /></article>)}
                  </div>
                </div>
              </div>
            ) : glossary.length === 0 ? (
              <div className="grid min-h-[270px] content-center justify-items-center px-5 py-9 text-center max-md:min-h-[235px]">
                <span className="grid size-12 place-items-center rounded-[13px] bg-[#EAF3F2] text-[#005C55]" aria-hidden="true">
                  <svg className="size-6" viewBox="0 0 24 24" fill="none">
                    <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17H7.5A2.5 2.5 0 0 0 5 21.5v-17Z" />
                    <path d="M5 17a2.5 2.5 0 0 1 2.5-2.5H20M9 7h7m-7 4h5" />
                  </svg>
                </span>
                <strong className="mt-3 text-[13px] font-bold text-[#131B2E]">Belum ada istilah glosarium</strong>
                <p className="mb-[13px] mt-[5px] max-w-[340px] text-[11px] leading-[17px] text-[#64716F]">Tambahkan istilah agar definisinya dapat dikelola dari sini.</p>
                <button className="button-secondary min-h-9 text-[11px]" onClick={handleOpenCreate} type="button">
                  Tambah istilah pertama
                </button>
              </div>
            ) : filteredGlossary.length === 0 ? (
              <div className="grid min-h-[190px] content-center justify-items-center px-5 py-9 text-center">
                <strong className="text-[13px] font-bold text-[#131B2E]">Tidak ada istilah yang cocok</strong>
                <p className="mb-[13px] mt-[5px] max-w-[340px] text-[11px] leading-[17px] text-[#64716F]">Coba kata kunci lain atau hapus pencarian.</p>
                <button className="button-secondary min-h-9 text-[11px]" onClick={() => setSearchQuery("")} type="button">
                  Hapus pencarian
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto md:overflow-visible">
                <table className="w-full border-collapse text-left text-[11px] leading-[17px] text-[#3E4947]">
                  <thead className="hidden bg-[#F7F9F9] text-[9px] font-bold tracking-[0.035em] text-[#667472] md:table-header-group">
                    <tr>
                      <th className="w-[27%] border-b border-[#E4E8EB] px-5 py-2.5 uppercase" scope="col">Istilah</th>
                      <th className="border-b border-[#E4E8EB] px-5 py-2.5 uppercase" scope="col">Definisi</th>
                      <th className="w-[142px] border-b border-[#E4E8EB] px-5 py-2.5 text-right uppercase" scope="col">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="grid md:table-row-group">
                    {filteredGlossary.map((item) => (
                      <tr className="grid gap-2 border-b border-[#E8EDEE] px-[15px] py-3.5 last:border-b-0 hover:bg-[#FBFCFC] md:table-row md:border-b-0 md:px-0 md:py-0 [&+tr]:md:border-t [&+tr]:md:border-[#E8EDEE]" key={item.id}>
                        <th className="block min-w-0 text-left text-xs font-bold leading-[19px] text-[#263634] md:table-cell md:px-5 md:py-[15px] md:align-top" scope="row">{item.term}</th>
                        <td className="block min-w-0 text-[11px] leading-[19px] text-[#53615F] before:mb-[3px] before:block before:text-[9px] before:font-bold before:tracking-[0.04em] before:text-[#788582] before:content-[attr(data-label)] before:uppercase md:table-cell md:px-5 md:py-[15px] md:align-top md:before:hidden" data-label="Definisi">{item.definition}</td>
                        <td className="block min-w-0 pt-0.5 text-left before:mb-[3px] before:block before:text-[9px] before:font-bold before:tracking-[0.04em] before:text-[#788582] before:content-[attr(data-label)] before:uppercase md:table-cell md:w-[142px] md:px-5 md:py-[15px] md:text-right md:align-top md:before:hidden" data-label="Aksi">
                          <div className="inline-flex gap-1.5">
                            <button
                              className="inline-grid size-8 place-items-center rounded-md border border-[#D6DEE5] bg-white p-0 text-[#40506A] transition-colors hover:bg-[#F3F6F8] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#178477]/25"
                              aria-label={`Edit istilah ${item.term}`}
                              onClick={() => handleOpenEdit(item)}
                              title="Edit istilah"
                              type="button"
                            >
                              <svg className="block size-[15px]"
                                aria-hidden="true"
                                fill="none"
                                height="18"
                                viewBox="0 0 24 24"
                                width="18"
                              >
                                <path
                                  d="m14 5 5 5M4 20l4.2-.9L19 8.3a2.1 2.1 0 0 0-3-3L5.2 16.1 4 20Z"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.8"
                                />
                              </svg>
                            </button>
                            <button
                              className="inline-grid size-8 place-items-center rounded-md border border-[#F3D0D0] bg-[#FFF6F6] p-0 text-[#B42323] transition-colors hover:bg-[#FEECEC] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#B42323]/25"
                              aria-label={`Hapus istilah ${item.term}`}
                              onClick={() => setTermToDelete(item)}
                              title="Hapus istilah"
                              type="button"
                            >
                              <svg className="block size-[15px]"
                                aria-hidden="true"
                                fill="none"
                                height="18"
                                viewBox="0 0 24 24"
                                width="18"
                              >
                                <path
                                  d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.8"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-[60] grid place-items-center bg-[rgb(19_27_46_/_45%)] p-5"
            initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: shouldReduceMotion ? 1 : 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setIsModalOpen(false);
            }}
          >
            <motion.section
              aria-labelledby="glossary-modal-title"
              aria-modal="true"
              className="w-[min(100%,500px)] rounded-[10px] border border-[#E4E8EB] bg-white p-[22px] shadow-[0_16px_48px_rgb(19_27_46_/_18%)] max-sm:p-[18px]"
              role="dialog"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.985 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
            >
              <h2 className="m-0 text-lg font-bold leading-[26px] text-[#131B2E]" id="glossary-modal-title">
                {editingId ? "Edit Istilah" : "Tambah Istilah Baru"}
              </h2>
              <p className="mt-2 text-xs leading-5 text-[#64716F]">Isi istilah dan definisi yang akan ditampilkan di portal publik.</p>
              <form className="mt-4 grid gap-[13px]" onSubmit={handleSave}>
                {formError && (
                  <p className="m-0 rounded-md border border-[#F2CACA] bg-[#FFF6F6] p-2 text-[10px] leading-4 text-[#A12B23]" role="alert">
                    {formError}
                  </p>
                )}
                <label className="grid min-w-0 gap-1.5">
                  <span className="text-[10px] font-semibold text-[#46556A]">Istilah *</span>
                  <input
                    className="min-h-[38px] w-full rounded-[7px] border border-[#D4DDE5] bg-white px-2.5 py-[9px] text-[11px] leading-[17px] text-[#131B2E] outline-none focus:border-[#178477] focus:ring-[3px] focus:ring-[#178477]/10"
                    autoFocus
                    onChange={(event) => setTerm(event.target.value)}
                    placeholder="Contoh: Dana Siap Pakai (DSP)"
                    required
                    value={term}
                  />
                </label>
                <label className="grid min-w-0 gap-1.5">
                  <span className="text-[10px] font-semibold text-[#46556A]">Definisi *</span>
                  <textarea
                    className="min-h-[120px] w-full resize-y rounded-[7px] border border-[#D4DDE5] bg-white px-2.5 py-[9px] text-[11px] leading-[17px] text-[#131B2E] outline-none focus:border-[#178477] focus:ring-[3px] focus:ring-[#178477]/10"
                    onChange={(event) => setDefinition(event.target.value)}
                    placeholder="Tulis definisi istilah..."
                    required
                    rows={5}
                    value={definition}
                  />
                </label>
                <div className="mt-1 flex justify-end gap-[9px]">
                  <button
                    className="button-secondary"
                    onClick={() => setIsModalOpen(false)}
                    type="button"
                  >
                    Batal
                  </button>
                  <button className="button-primary" type="submit">
                    Simpan Istilah
                  </button>
                </div>
              </form>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {termToDelete && (
          <AdminConfirmDialog
            confirmLabel="Hapus istilah"
            description={`Istilah "${termToDelete.term}" akan dihapus dari glosarium. Tindakan ini tidak dapat dibatalkan.`}
            onCancel={() => setTermToDelete(null)}
            onConfirm={handleDelete}
            title="Hapus istilah glosarium?"
            shouldReduceMotion={shouldReduceMotion}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
