"use client";

import { startTransition, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";
import AdminConfirmDialog from "@/components/AdminConfirmDialog";
import AdminSidebar from "@/components/AdminSidebar";
import DemoDataBanner from "@/components/DemoDataBanner";
import { getStoredSources, saveStoredSources, type SourceItem } from "@/lib/mockService";

export default function AdminSourcesPage() {
  const router = useRouter();
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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
  const filteredSources = sources.filter((source) =>
    [source.title, source.publisher, source.url, source.note]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("id")
      .includes(normalizedSearch),
  );

  useEffect(() => {
    if (!localStorage.getItem("jejak_bencana_auth")) {
      router.push("/admin/login");
      return;
    }

    startTransition(() => {
      setSources(getStoredSources());
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
    if (editingId) {
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
      updated = [newItem, ...sources];
    }

    setSources(updated);
    saveStoredSources(updated);
    setFormError("");
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!sourceToDelete) return;

    const updated = sources.filter((source) => source.id !== sourceToDelete.id);
    setSources(updated);
    saveStoredSources(updated);
    setSourceToDelete(null);
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
          <header className="admin-main__header">
            <div>
              <span className="admin-source-eyebrow">RUJUKAN & VERIFIKASI</span>
              <h1>Manajemen Sumber Dokumen</h1>
              <p>Kelola referensi, surat keputusan, dan laporan instansi yang mendukung data.</p>
            </div>
            <button className="button-primary" onClick={handleOpenCreate} type="button">
              <span aria-hidden="true" className="admin-source-add-icon">+</span>
              Tambah Sumber
            </button>
          </header>

          <section className="admin-source-card admin-card" aria-label="Daftar sumber dokumen">
            <div className="admin-source-card__heading">
              <div>
                <h2>Sumber dokumen</h2>
                <p>Referensi yang tercatat untuk transparansi dan pemeriksaan data.</p>
              </div>
              <label className="admin-source-search">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="10.8" cy="10.8" r="6.8" />
                  <path d="m16 16 4.5 4.5" />
                </svg>
                <span className="admin-source-visually-hidden">Cari sumber dokumen</span>
                <input
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Cari judul, penerbit..."
                  type="search"
                  value={searchQuery}
                />
              </label>
            </div>
            <div className="admin-source-summary" aria-live="polite">
              <span className="admin-source-summary__count">{filteredSources.length}</span>
              <span>{searchQuery ? `dari ${sources.length} sumber` : "sumber tersimpan"}</span>
            </div>
            {isLoading ? (
              <div className="admin-data-loading">
                <div className="content-skeleton content-skeleton--list" role="status" aria-label="Memuat sumber dokumen" aria-live="polite">
                  <span className="sr-only">Memuat sumber dokumen...</span>
                  <div className="skeleton-list" aria-hidden="true">
                    {[0, 1, 2].map((item) => <article className="skeleton-card" key={item}><span className="skeleton-block skeleton-block--short" /><span className="skeleton-block skeleton-block--title" /><span className="skeleton-block skeleton-block--text" /></article>)}
                  </div>
                </div>
              </div>
            ) : sources.length === 0 ? (
              <div className="admin-source-empty">
                <span aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
                    <path d="M14 3.5V8h4m-9 4h6m-6 4h6" />
                  </svg>
                </span>
                <strong>Belum ada sumber dokumen</strong>
                <p>Tambahkan referensi agar sumber data dapat ditinjau dan dikelola di sini.</p>
                <button className="button-secondary" onClick={handleOpenCreate} type="button">
                  Tambah sumber pertama
                </button>
              </div>
            ) : filteredSources.length === 0 ? (
              <div className="admin-source-empty admin-source-empty--compact">
                <strong>Tidak ada sumber yang cocok</strong>
                <p>Coba kata kunci lain atau hapus pencarian.</p>
                <button className="button-secondary" onClick={() => setSearchQuery("")} type="button">
                  Hapus pencarian
                </button>
              </div>
            ) : (
              <div className="admin-source-table-wrap">
                <table className="admin-source-table">
                  <thead>
                    <tr>
                      <th scope="col">Dokumen</th>
                      <th scope="col">Penerbit</th>
                      <th scope="col">Tanggal publikasi</th>
                      <th scope="col">Terakhir diperiksa</th>
                      <th scope="col">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSources.map((source) => (
                      <tr key={source.id}>
                        <th scope="row">
                          <span className="admin-source-title">{source.title}</span>
                          {source.url && (
                            <a
                              className="admin-source-link"
                              href={source.url}
                              rel="noreferrer"
                              target="_blank"
                            >
                              {source.url}
                            </a>
                          )}
                          {source.note && <span className="admin-source-note">{source.note}</span>}
                        </th>
                        <td data-label="Penerbit">{source.publisher}</td>
                        <td data-label="Tanggal publikasi">{source.publishedAt || "—"}</td>
                        <td data-label="Terakhir diperiksa">{source.checkedAt || "—"}</td>
                        <td data-label="Aksi">
                          <div className="admin-source-actions">
                            <button
                              className="admin-source-action"
                              aria-label={`Edit sumber ${source.title}`}
                              onClick={() => handleOpenEdit(source)}
                              title="Edit sumber"
                              type="button"
                            >
                              <svg
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
                              className="admin-source-action admin-source-action--delete"
                              aria-label={`Hapus sumber ${source.title}`}
                              onClick={() => setSourceToDelete(source)}
                              title="Hapus sumber"
                              type="button"
                            >
                              <svg
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
