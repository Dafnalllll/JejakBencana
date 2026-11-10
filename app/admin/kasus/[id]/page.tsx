"use client";

import { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import { DisasterCase, FundRecord, FundCategory } from "@/types";
import { getCaseById, upsertCase, formatRupiah } from "@/lib/mockService";
import DemoDataBanner from "@/components/DemoDataBanner";
import FundCategoryBadge from "@/components/FundCategoryBadge";
import LoadingState from "@/components/LoadingState";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

function AdminEditCaseContent({ id }: { id: string }) {
  const [caseItem, setCaseItem] = useState<DisasterCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // New fund record form state
  const [newCategory, setNewCategory] = useState<FundCategory>("ALLOCATION");
  const [newAmount, setNewAmount] = useState("");
  const [newPurpose, setNewPurpose] = useState("");
  const [newPeriod, setNewPeriod] = useState("");
  const [newNotes, setNewNotes] = useState("");

  useEffect(() => {
    getCaseById(id).then((data) => {
      if (data) setCaseItem(data);
      setLoading(false);
    });
  }, [id]);

  const handleUpdateBase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseItem) return;

    setSaving(true);
    setError("");
    try {
      await upsertCase(caseItem);
      alert("Kasus berhasil diperbarui.");
      setSaving(false);
    } catch {
      setError("Gagal memperbarui kasus.");
      setSaving(false);
    }
  };

  const handleAddFundRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseItem) return;
    const amountNum = parseFloat(newAmount);
    if (isNaN(amountNum) || amountNum < 0) {
      alert("Nominal Rupiah tidak valid.");
      return;
    }

    const newRecord: FundRecord = {
      id: `fr-${Date.now()}`,
      caseId: caseItem.id,
      category: newCategory,
      amount: amountNum,
      currency: "IDR",
      purpose: newPurpose || undefined,
      periodLabel: newPeriod || undefined,
      notes: newNotes || undefined,
      sources: []
    };

    const updatedRecords = [...(caseItem.fundRecords || []), newRecord];
    const updatedCase = { ...caseItem, fundRecords: updatedRecords };
    setCaseItem(updatedCase);
    upsertCase(updatedCase);

    // Reset fund form
    setNewAmount("");
    setNewPurpose("");
    setNewPeriod("");
    setNewNotes("");
  };

  const handleDeleteFundRecord = (recordId: string) => {
    if (!caseItem) return;
    const updatedRecords = caseItem.fundRecords.filter((r) => r.id !== recordId);
    const updatedCase = { ...caseItem, fundRecords: updatedRecords };
    setCaseItem(updatedCase);
    upsertCase(updatedCase);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto w-full px-4 py-20 flex-1">
        <LoadingState label="Memuat formulir kasus..." variant="form" />
      </div>
    );
  }

  if (!caseItem) {
    return (
      <div className="max-w-4xl mx-auto w-full px-4 py-20 text-center space-y-4 flex-1">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Kasus Tidak Ditemukan</h1>
        <Link href="/admin" className="text-xs text-emerald-600 hover:underline">Kembali ke Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
      {/* Edit Base Info Form */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Edit Informasi Kasus</h1>
          <p className="text-xs text-zinc-500">Ubah judul, ringkasan, wilayah, dan status publikasi.</p>
        </div>

        {error && <div className="p-3 bg-rose-50 text-xs text-rose-700 rounded-xl">{error}</div>}

        <form onSubmit={handleUpdateBase} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Judul Kasus</label>
            <input
              type="text"
              value={caseItem.title}
              onChange={(e) => setCaseItem({ ...caseItem, title: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Wilayah Terdampak</label>
              <input
                type="text"
                value={caseItem.affectedArea}
                onChange={(e) => setCaseItem({ ...caseItem, affectedArea: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Status Publikasi</label>
              <select
                value={caseItem.status}
                onChange={(e) => setCaseItem({ ...caseItem, status: e.target.value as "DRAFT" | "PUBLISHED" })}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Ringkasan Situasi</label>
            <textarea
              rows={3}
              value={caseItem.summary}
              onChange={(e) => setCaseItem({ ...caseItem, summary: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan Kasus"}
            </button>
          </div>
        </form>
      </div>

      {/* Fund Records Management */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Kelola Catatan Dana Siap Pakai (DSP)</h2>
          <p className="text-xs text-zinc-500">Tambah atau hapus rincian alokasi, penyaluran, realisasi, dan rencana anggaran.</p>
        </div>

        {/* Existing records */}
        <div className="space-y-3">
          {caseItem.fundRecords.length === 0 ? (
            <p className="text-xs text-zinc-500 italic">Belum ada catatan dana.</p>
          ) : (
            caseItem.fundRecords.map((r) => (
              <div key={r.id} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <FundCategoryBadge category={r.category} />
                  <div className="text-sm font-bold text-zinc-900 dark:text-white">{formatRupiah(r.amount)}</div>
                  {r.purpose && <div className="text-xs text-zinc-600 dark:text-zinc-400">{r.purpose}</div>}
                </div>
                <button
                  onClick={() => handleDeleteFundRecord(r.id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100"
                >
                  Hapus
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add new record form */}
        <form onSubmit={handleAddFundRecord} className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
          <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Tambah Catatan Dana Baru</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Kategori Dana</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as FundCategory)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white"
              >
                <option value="ALLOCATION">Alokasi / Penetapan</option>
                <option value="DISTRIBUTION">Penyaluran</option>
                <option value="REALIZATION">Realisasi</option>
                <option value="PLAN">Rencana / Pengajuan</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Nominal Rupiah (IDR) *</label>
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="Contoh: 5000000000"
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Tujuan Penggunaan</label>
            <input
              type="text"
              value={newPurpose}
              onChange={(e) => setNewPurpose(e.target.value)}
              placeholder="Contoh: Pengadaan tenda pengungsian & logistik makanan"
              className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Label Periode</label>
              <input
                type="text"
                value={newPeriod}
                onChange={(e) => setNewPeriod(e.target.value)}
                placeholder="Contoh: Tahap 1 Tanggap Darurat"
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Catatan Tambahan</label>
              <input
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Catatan verifikasi..."
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md"
            >
              Tambah Catatan Dana
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminEditCasePage({ params }: Props) {
  const resolvedParams = use(params);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <DemoDataBanner />
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/admin" className="text-xs font-semibold text-emerald-600 hover:underline">
            &larr; Kembali ke Dashboard
          </Link>
          <span className="text-xs text-zinc-500 font-medium">Edit Kasus Bencana</span>
        </div>
      </header>
      <Suspense fallback={<div className="flex-1 py-20 text-center text-xs text-zinc-500">Memuat form edit kasus...</div>}>
        <AdminEditCaseContent id={resolvedParams.id} />
      </Suspense>
    </div>
  );
}
