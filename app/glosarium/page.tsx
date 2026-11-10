"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import PublicFooter from "@/components/PublicFooter";

const terms = [
  {
    id: "dsp",
    term: "Dana Siap Pakai (DSP)",
    category: "Fiskal Negara",
    categoryTone: "blue",
    definition:
      "Dana yang dicadangkan dan dapat digunakan segera untuk penanganan darurat pada saat terjadi bencana, sesuai ketentuan dan dokumen yang berlaku.",
    source: "Pedoman dan dokumen resmi BNPB",
  },
  {
    id: "realization",
    term: "Realisasi yang Dilaporkan",
    category: "Pelaporan",
    categoryTone: "green",
    definition:
      "Jumlah penggunaan dana yang tercantum dalam laporan dan dokumen pertanggungjawaban. Angka ini perlu dibaca bersama periode dan sumbernya.",
    source: "Laporan situasi dan dokumen pelaporan",
  },
  {
    id: "allocation",
    term: "Pagu Penetapan / Alokasi",
    category: "Anggaran",
    categoryTone: "blue",
    definition:
      "Batas atau nilai anggaran yang ditetapkan untuk suatu keperluan. Penetapan tidak selalu berarti seluruh dana telah terserap.",
    source: "Dokumen penetapan terkait",
  },
  {
    id: "plan",
    term: "Rencana / Usulan Tambahan",
    category: "Pengajuan",
    categoryTone: "slate",
    definition:
      "Usulan kebutuhan atau anggaran yang masih dalam proses. Rencana bukan bukti bahwa dana telah ditetapkan atau dicairkan.",
    source: "Dokumen usulan terkait",
  },
  {
    id: "bsr",
    term: "Bantuan Stimulan Rumah (BSR)",
    category: "Rehabilitasi",
    categoryTone: "purple",
    definition:
      "Istilah bantuan pemulihan rumah yang muncul pada konteks penanganan pascabencana. Kriteria dan nilai bantuan mengikuti ketentuan serta dokumen program terkait.",
    source: "Pedoman program terkait",
  },
  {
    id: "emergency",
    term: "Status Tanggap Darurat",
    category: "Legalitas",
    categoryTone: "amber",
    definition:
      "Status yang ditetapkan oleh pejabat berwenang untuk mengaktifkan langkah penanganan darurat sesuai peraturan dan keputusan yang berlaku.",
    source: "Keputusan penetapan status",
  },
  {
    id: "accountability",
    term: "Pertanggungjawaban (SPJ)",
    category: "Akuntabilitas",
    categoryTone: "green",
    definition:
      "Dokumen dan proses pelaporan penggunaan anggaran yang menjadi bagian dari akuntabilitas serta dapat diperiksa sesuai ketentuan.",
    source: "Dokumen pertanggungjawaban",
  },
  {
    id: "sistala",
    term: "SISTALA-DSP",
    category: "Sistem Resmi",
    categoryTone: "blue",
    definition:
      "Sistem informasi yang dirujuk dalam konteks pemantauan dan pengelolaan data terkait Dana Siap Pakai. Periksa kanal resmi untuk informasi terkini.",
    source: "Kanal informasi resmi BNPB",
  },
];

const categories = [
  "Semua istilah",
  "Fiskal & DSP",
  "Status Keadaan Darurat",
  "Akuntabilitas & Pelaporan",
];

const categoryToneClasses: Record<string, string> = {
  blue: "bg-[#E8F5FF] text-[#0873A8]",
  green: "bg-[#E7FAF3] text-[#087C67]",
  slate: "bg-[#E9EDF2] text-[#53637B]",
  purple: "bg-[#F0EDFF] text-[#5B49B5]",
  amber: "bg-[#FFF1CE] text-[#9B5600]",
};

function matchesCategory(category: string, selected: string) {
  if (selected === "Semua istilah") return true;
  if (selected === "Fiskal & DSP") {
    return ["Fiskal Negara", "Anggaran", "Pengajuan"].includes(category);
  }
  if (selected === "Status Keadaan Darurat") {
    return ["Legalitas", "Rehabilitasi"].includes(category);
  }
  return ["Pelaporan", "Akuntabilitas", "Sistem Resmi"].includes(category);
}

export default function GlossaryPage() {
  const shouldReduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [popoverOpen, setPopoverOpen] = useState(true);

  const filteredTerms = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("id-ID");
    return terms.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        `${item.term} ${item.definition} ${item.category}`
          .toLocaleLowerCase("id-ID")
          .includes(normalizedQuery);
      return matchesQuery && matchesCategory(item.category, selectedCategory);
    });
  }, [query, selectedCategory]);

  return (
    <>
      <main className="flex-1 bg-[#FAF8FF] py-8 pb-12 max-md:py-5 max-md:pb-9">
        <div className="mx-auto w-[92%] max-w-[1240px] max-md:w-[calc(100%-32px)]">
          <header className="mb-6 max-w-[900px]">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#EAF0FF] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.035em] text-[#087C67]">
              <span aria-hidden="true">▣</span>
              Pedoman terminologi resmi
            </span>
            <h1 className="mt-3 text-[clamp(30px,4vw,42px)] font-bold leading-[1.15] tracking-[-0.03em] text-[#131B2E]">
              Glosarium Terminologi Kebencanaan &amp; Anggaran
            </h1>
            <p className="mt-3 text-base leading-7 text-[#64716F] max-md:text-sm max-md:leading-6">
              Panduan istilah teknis keuangan dan tanggap darurat pemerintah
              yang disederhanakan dalam bahasa masyarakat awam, agar publik
              dapat memantau data resmi secara berimbang dan objektif.
            </p>
          </header>

          <section className="grid gap-4 rounded-xl border border-[#D7E0EA] bg-white p-5 shadow-sm max-md:p-4" aria-label="Cari dan filter istilah">
            <label className="flex min-h-12 items-center gap-3 rounded-lg border border-[#CDD9E5] bg-[#FCFCFE] px-3 text-[#61728A] focus-within:border-[#087C67] focus-within:outline focus-within:outline-2 focus-within:outline-[#087C67]/15">
              <span className="text-base leading-none" aria-hidden="true">⌕</span>
              <span className="sr-only">Cari istilah glosarium</span>
              <input
                className="w-full min-w-0 border-0 bg-transparent font-sans text-sm text-[#131B2E] outline-none placeholder:text-sm placeholder:text-[#7B8798]"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari istilah (contoh: Dana Siap Pakai, Realisasi, Stimulan, SPJ)..."
              />
              {query && (
                <button className="grid size-8 shrink-0 place-items-center rounded-full border-0 bg-[#E9EDF3] text-lg leading-none text-[#40506A] hover:bg-[#DDE3EA]" type="button" onClick={() => setQuery("")} aria-label="Hapus pencarian">
                  ×
                </button>
              )}
            </label>
            <div className="flex flex-wrap items-center gap-2" aria-label="Filter kategori">
              <span className="mr-1 text-xs font-semibold text-[#4F5E72]">Kategori:</span>
              {categories.map((category) => (
                <button
                  aria-pressed={selectedCategory === category}
                  className={`min-h-9 rounded-full border-0 px-4 font-sans text-xs leading-5 transition-colors ${
                    selectedCategory === category
                      ? "bg-[#0C8277] text-white"
                      : "bg-[#EDF0FF] text-[#27344B] hover:bg-[#E1E7FF]"
                  }`}
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  type="button"
                >
                  {category}
                  {category === "Semua istilah" ? ` (${terms.length})` : ""}
                </button>
              ))}
            </div>
          </section>

          <section className="relative mt-7 grid min-h-[190px] grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] items-center gap-6 rounded-xl border border-[#CBD5E1] bg-[#F2F3FF] p-6 max-md:mt-5 max-md:grid-cols-1 max-md:gap-4 max-md:p-5" aria-labelledby="interactive-title">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase text-[#087C67]">
                <span aria-hidden="true">▧</span>
                Fitur audit publik terintegrasi
              </span>
              <h2 className="mt-2 text-lg font-bold leading-7 text-[#202B40]" id="interactive-title">Cara Glosarium Bekerja di Seluruh Platform</h2>
              <p className="mt-2 text-sm leading-6 text-[#56667D]">
                Istilah penting dapat dibuka langsung dari konteks laporan untuk
                melihat arti ringkasnya.
              </p>
            </div>
            <div className="relative min-h-[120px] rounded-lg border border-[#CAD4DF] bg-white px-5 pb-4 pt-5">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.045em] text-[#68778D]">Simulasi teks laporan tanggap darurat</span>
              <p className="m-0 text-[13px] leading-6 text-[#263248]">
                &quot;...Berdasarkan keputusan yang berlaku, dukungan{" "}
                <button
                  aria-expanded={popoverOpen}
                  aria-haspopup="dialog"
                  className="border-0 border-b border-dashed border-[#087C67] bg-transparent p-0 font-[inherit] font-bold text-[#087C67] underline-offset-2 hover:underline"
                  onClick={() => setPopoverOpen((open) => !open)}
                  type="button"
                >
                  Dana Siap Pakai (DSP)
                </button>{" "}
                dapat digunakan untuk penanganan darurat sesuai ketentuan dan
                dokumen penetapan.&quot;
              </p>
              <span className="absolute right-3 top-3 text-[11px] font-bold uppercase text-[#087C67]">
                <span aria-hidden="true">↗</span>
                Interaktif terbuka
              </span>
              <AnimatePresence>
                {popoverOpen && (
                  <motion.aside
                    aria-label="Definisi Dana Siap Pakai"
                    className="absolute bottom-[calc(100%-2px)] right-[20%] z-[4] w-[min(340px,86%)] rounded-lg border border-[#C8D3DE] bg-white p-4 shadow-[0_10px_24px_rgb(19_27_46_/_14%)] max-md:right-[5%] max-md:w-[90%]"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 7 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: 7 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.16 }}
                  >
                    <div className="flex items-center gap-2 text-sm font-bold text-[#233149]">
                      <span className="text-[#0C8277]" aria-hidden="true">ⓘ</span>
                      Dana Siap Pakai (DSP)
                    </div>
                    <p className="my-2 text-xs leading-5 text-[#53637B]">{terms[0].definition}</p>
                    <div className="rounded bg-[#E9ECFF] p-2 text-[11px] font-semibold leading-4 text-[#36445D]">
                      Catatan penting: bukan donasi masyarakat atau crowdfunding.
                    </div>
                    <div className="mt-2 flex justify-between gap-2 text-[11px] text-[#65748A]">
                      <span>Rujukan: dokumen resmi terkait</span>
                      <Link className="whitespace-nowrap font-bold text-[#087C67] no-underline hover:underline" href="/metodologi">Pelajari metodologi ↗</Link>
                    </div>
                  </motion.aside>
                )}
              </AnimatePresence>
            </div>
          </section>

          <section className="mt-8 max-md:mt-6" aria-labelledby="glossary-list-title">
            <div className="mb-4 flex items-center justify-between gap-3 max-md:items-start">
              <h2 className="m-0 text-xl font-bold text-[#1D293F]" id="glossary-list-title">Daftar Terminologi</h2>
              <span className="text-xs text-[#63728A] max-md:text-right" aria-live="polite">
                Menampilkan {filteredTerms.length} dari {terms.length} istilah
              </span>
            </div>
            {filteredTerms.length ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredTerms.map((item, index) => (
                  <motion.article
                    className="flex min-h-[190px] flex-col rounded-xl border border-[#E4E8EB] bg-white p-5 shadow-sm transition-shadow hover:shadow-md max-md:min-h-0 max-md:p-4"
                    key={item.id}
                    whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="m-0 text-base font-bold leading-6 text-[#202B40]">{item.term}</h3>
                      <span className={`shrink-0 rounded px-2 py-1 text-[11px] font-bold uppercase tracking-[0.025em] ${categoryToneClasses[item.categoryTone]}`}>
                        {item.category}
                      </span>
                    </div>
                    <p className="my-3 mb-4 flex-1 text-sm leading-6 text-[#596980]">{item.definition}</p>
                    <div className="flex items-center gap-2 border-t border-[#E1E7ED] pt-3 text-[11px] text-[#6C7A8E]">
                      <span aria-hidden="true">▤</span>
                      <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{item.source}</span>
                      <strong className="text-[11px] text-[#087C67]">DSP-{String(index + 1).padStart(2, "0")}</strong>
                    </div>
                  </motion.article>
                ))}
                <article className="flex min-h-[190px] flex-col rounded-xl border border-dashed border-[#9EACC0] bg-[#F2F3FF] p-5 max-md:min-h-0 max-md:p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="m-0 text-base font-bold text-[#202B40]">Kamus Audit Mandiri</h3>
                    <span className="text-xs text-[#75839A]" aria-hidden="true">ⓘ</span>
                  </div>
                  <p className="my-3 flex-1 text-sm leading-6 text-[#596980]">
                    Ajukan istilah untuk ditinjau dan ditambahkan ke glosarium
                    oleh pengelola.
                  </p>
                  <Link className="flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#CAD4DF] bg-white px-3 text-xs font-bold text-[#087C67] no-underline hover:bg-[#EAFBF5]" href="/admin/glosarium">
                    <span aria-hidden="true">⊕</span>
                    Kelola Usulan Istilah
                  </Link>
                </article>
              </div>
            ) : (
              <div className="rounded-xl border border-[#E4E8EB] bg-white p-8 text-center" role="status">
                <h3 className="m-0 text-lg font-bold text-[#131B2E]">Istilah tidak ditemukan</h3>
                <p className="text-sm text-[#596980]">Coba kata kunci atau kategori yang berbeda.</p>
                <button
                  className="border-0 bg-transparent text-xs font-bold text-[#087C67] hover:underline"
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSelectedCategory(categories[0]);
                  }}
                >
                  Hapus filter
                </button>
              </div>
            )}
          </section>

          <aside className="mt-6 grid grid-cols-[20px_minmax(0,1fr)] items-start gap-3 rounded-lg border border-[#F3D779] bg-[#FFF7D6] px-4 py-4" aria-label="Batasan informasi glosarium">
            <span className="text-[13px] text-[#A64E08]" aria-hidden="true">ⓘ</span>
            <div>
              <strong className="block text-sm leading-5 text-[#98500B]">Batasan Informasi Glosarium</strong>
              <p className="mt-1 text-xs leading-5 text-[#9A540E]">
                Glosarium membantu memahami istilah umum dan tidak menggantikan
                tafsir resmi ketentuan atau dokumen pemerintah. Periksa sumber
                dan konteks sebelum menggunakan informasi.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <PublicFooter glossary />
    </>
  );
}
