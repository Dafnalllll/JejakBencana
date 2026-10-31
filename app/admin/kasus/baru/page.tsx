"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { upsertCase } from "@/lib/mockService";
import DemoDataBanner from "@/components/DemoDataBanner";

export default function AdminNewCasePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [affectedArea, setAffectedArea] = useState("");
  const [summary, setSummary] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [contextNote, setContextNote] = useState("");
  const [scopeLimitations, setScopeLimitations] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title || !affectedArea || !summary) {
      setError("Judul, wilayah terdampak, dan ringkasan wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      await upsertCase({
        title,
        affectedArea,
        summary,
        incidentDate: incidentDate || undefined,
        contextNote: contextNote || undefined,
        scopeLimitations: scopeLimitations || undefined,
        status,
        fundRecords: [],
        sourceDocuments: []
      });
      router.push("/admin");
    } catch {
      setError("Gagal menyimpan kasus. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <DemoDataBanner />

      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/admin" className="text-xs font-semibold text-emerald-600 hover:underline">
            &larr; Kembali ke Dashboard
          </Link>
          <span className="text-xs text-zinc-500 font-medium">Buat Kasus Bencana Baru</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Form Pembuatan Kasus</h1>
            <p className="text-xs text-zinc-500">Masukkan informasi dasar kejadian bencana dan status publikasi.</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-xs text-rose-700 border border-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Judul Kasus *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Penanganan Darurat Erupsi Gunung..."
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Wilayah Terdampak *</label>
                <input
                  type="text"
                  value={affectedArea}
                  onChange={(e) => setAffectedArea(e.target.value)}
                  placeholder="Contoh: Kabupaten Cianjur, Jawa Barat"
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Tanggal Kejadian</label>
                <input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Ringkasan Situasi *</label>
              <textarea
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Deskripsi singkat situasi darurat dan alokasi dana..."
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Catatan Konteks</label>
                <input
                  type="text"
                  value={contextNote}
                  onChange={(e) => setContextNote(e.target.value)}
                  placeholder="Sumber data utama..."
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Batasan Informasi</label>
                <input
                  type="text"
                  value={scopeLimitations}
                  onChange={(e) => setScopeLimitations(e.target.value)}
                  placeholder="Batasan pelaporan..."
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Status Publikasi</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="DRAFT">DRAFT (Simpan sebagai draf, belum tampil di publik)</option>
                <option value="PUBLISHED">PUBLISHED (Terbitkan ke portal publik)</option>
              </select>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <Link
                href="/admin"
                className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan Kasus"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
