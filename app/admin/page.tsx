"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DemoDataBanner from "@/components/DemoDataBanner";
import {
  getAllCases,
  upsertCase,
} from "@/lib/mockService";
import type {
  CaseStatus,
  DisasterCase,
  FundCategory,
  SourceDocument,
} from "@/types";

type MobileStep = 0 | 1 | 2;

interface CaseForm {
  title: string;
  slug: string;
  affectedArea: string;
  summary: string;
  incidentDate: string;
  periodStart: string;
  periodEnd: string;
  contextNote: string;
  scopeLimitations: string;
  status: CaseStatus;
}

interface FundForm {
  id: string;
  category: FundCategory;
  amount: string;
  purpose: string;
  periodLabel: string;
  documentDate: string;
  sourceTitle: string;
}

interface SourceForm {
  id: string;
  title: string;
  url: string;
  publisher: string;
  publicationDate: string;
  lastCheckedAt: string;
}

const emptyCase: CaseForm = {
  title: "",
  slug: "",
  affectedArea: "",
  summary: "",
  incidentDate: "",
  periodStart: "",
  periodEnd: "",
  contextNote: "",
  scopeLimitations: "",
  status: "DRAFT",
};

const categoryOptions: { value: FundCategory; label: string }[] = [
  { value: "ALLOCATION", label: "Alokasi / Penetapan" },
  { value: "DISTRIBUTION", label: "Penyaluran" },
  { value: "REALIZATION", label: "Realisasi dilaporkan" },
  { value: "PLAN", label: "Rencana / Pengajuan" },
];

function toCaseForm(item?: DisasterCase): CaseForm {
  return item
    ? {
        title: item.title,
        slug: item.slug,
        affectedArea: item.affectedArea,
        summary: item.summary,
        incidentDate: item.incidentDate ?? "",
        periodStart: item.periodStart ?? "",
        periodEnd: item.periodEnd ?? "",
        contextNote: item.contextNote ?? "",
        scopeLimitations: item.scopeLimitations ?? "",
        status: item.status,
      }
    : { ...emptyCase };
}

function toFundForms(item?: DisasterCase): FundForm[] {
  return (
    item?.fundRecords.map((record) => ({
      id: record.id,
      category: record.category,
      amount: String(record.amount),
      purpose: record.purpose ?? "",
      periodLabel: record.periodLabel ?? "",
      documentDate: record.documentDate ?? "",
      sourceTitle: record.sources[0]?.title ?? "",
    })) ?? []
  );
}

function toSourceForms(item?: DisasterCase): SourceForm[] {
  return (
    item?.sourceDocuments.map((source) => ({
      id: source.id,
      title: source.title,
      url: source.url,
      publisher: source.publisher,
      publicationDate: source.publicationDate ?? "",
      lastCheckedAt: source.lastCheckedAt ?? "",
    })) ?? []
  );
}

function makeSource(source: SourceForm): SourceDocument {
  return {
    id: source.id || `source-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: source.title.trim(),
    url: source.url.trim(),
    publisher: source.publisher.trim(),
    publicationDate: source.publicationDate || undefined,
    lastCheckedAt: source.lastCheckedAt || undefined,
  };
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function AdminDashboardPage() {
  const [cases, setCases] = useState<DisasterCase[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [caseForm, setCaseForm] = useState<CaseForm>({ ...emptyCase });
  const [fundForms, setFundForms] = useState<FundForm[]>([]);
  const [sourceForms, setSourceForms] = useState<SourceForm[]>([]);
  const [mobileStep, setMobileStep] = useState<MobileStep>(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");

  const selectedCase = useMemo(
    () => cases.find((item) => item.id === selectedId),
    [cases, selectedId],
  );

  useEffect(() => {
    let active = true;
    getAllCases()
      .then((data) => {
        if (!active) return;
        setCases(data);
        const firstCase = data[0];
        if (firstCase) {
          setSelectedId(firstCase.id);
          setCaseForm(toCaseForm(firstCase));
          setFundForms(toFundForms(firstCase));
          setSourceForms(toSourceForms(firstCase));
        }
      })
      .catch(() => {
        if (active) {
          setErrors({ load: "Data contoh gagal dimuat. Coba muat ulang halaman." });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const chooseCase = (item: DisasterCase) => {
    setSelectedId(item.id);
    setCaseForm(toCaseForm(item));
    setFundForms(toFundForms(item));
    setSourceForms(toSourceForms(item));
    setErrors({});
    setFeedback("");
    setMobileStep(1);
  };

  const startNewCase = () => {
    setSelectedId("");
    setCaseForm({ ...emptyCase });
    setFundForms([]);
    setSourceForms([]);
    setErrors({});
    setFeedback("");
    setMobileStep(1);
  };

  const refreshCases = async () => {
    setErrors({});
    try {
      const data = await getAllCases();
      setCases(data);
      const current = data.find((item) => item.id === selectedId) ?? data[0];
      if (current) chooseCase(current);
      else startNewCase();
      setFeedback("Data demo berhasil disinkronkan dari penyimpanan lokal.");
    } catch {
      setErrors({ load: "Sinkronisasi data demo gagal. Coba lagi." });
    }
  };

  const validate = (status: CaseStatus) => {
    const nextErrors: Record<string, string> = {};
    if (!caseForm.title.trim()) nextErrors.title = "Judul resmi wajib diisi.";
    if (!caseForm.slug.trim()) nextErrors.slug = "Slug wajib diisi.";
    if (!caseForm.affectedArea.trim()) nextErrors.affectedArea = "Wilayah wajib diisi.";
    if (!caseForm.summary.trim()) nextErrors.summary = "Ringkasan situasi wajib diisi.";

    if (
      fundForms.some(
        (record) =>
          record.amount.trim() === "" ||
          !Number.isFinite(Number(record.amount)) ||
          Number(record.amount) < 0,
      )
    ) {
      nextErrors.fundRecords = "Isi nominal setiap rincian dana dengan angka nol atau lebih.";
    }

    if (
      status === "PUBLISHED" &&
      !sourceForms.some(
        (source) =>
          source.title.trim() &&
          source.publisher.trim() &&
          isHttpUrl(source.url.trim()),
      )
    ) {
      nextErrors.sourceDocuments =
        "Tambahkan minimal satu dokumen resmi dengan judul, penerbit, dan URL HTTP/HTTPS yang valid.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveCase = async (status: CaseStatus) => {
    if (!validate(status)) {
      const hasCompleteSource = sourceForms.some(
        (source) =>
          source.title.trim() &&
          source.publisher.trim() &&
          isHttpUrl(source.url.trim()),
      );
      setMobileStep(status === "PUBLISHED" && !hasCompleteSource ? 2 : 1);
      return false;
    }

    setSaving(true);
    setFeedback("");
    try {
      const documents = sourceForms
        .filter((source) => source.title.trim() || source.url.trim() || source.publisher.trim())
        .map(makeSource);
      const base = {
        ...(selectedId ? { id: selectedId } : {}),
        title: caseForm.title.trim(),
        slug: caseForm.slug.trim(),
        affectedArea: caseForm.affectedArea.trim(),
        summary: caseForm.summary.trim(),
        incidentDate: caseForm.incidentDate || undefined,
        periodStart: caseForm.periodStart || undefined,
        periodEnd: caseForm.periodEnd || undefined,
        contextNote: caseForm.contextNote.trim() || undefined,
        scopeLimitations: caseForm.scopeLimitations.trim() || undefined,
        status,
        sourceDocuments: documents,
        fundRecords: fundForms.map((record) => {
          const source = documents.find(
            (document) => document.title === record.sourceTitle,
          );
          return {
            id: record.id || `fund-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            caseId: selectedId,
            category: record.category,
            amount: Number(record.amount),
            currency: "IDR" as const,
            purpose: record.purpose.trim() || undefined,
            periodLabel: record.periodLabel.trim() || undefined,
            documentDate: record.documentDate || undefined,
            sources: source ? [source] : [],
          };
        }),
      };

      const saved = await upsertCase(base);
      const updatedCases = await getAllCases();
      setCases(updatedCases);
      setSelectedId(saved.id);
      setCaseForm(toCaseForm(saved));
      setFundForms(toFundForms(saved));
      setSourceForms(toSourceForms(saved));
      setFeedback(
        status === "PUBLISHED"
          ? "Kasus demo diterbitkan di penyimpanan lokal."
          : "Draft demo tersimpan di penyimpanan lokal.",
      );
      setErrors({});
      return true;
    } catch (error) {
      setErrors({
        save:
          error instanceof Error
            ? `Data tidak berhasil disimpan: ${error.message}`
            : "Data tidak berhasil disimpan. Coba lagi.",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const requestPublish = () => {
    if (validate("PUBLISHED")) setIsConfirmOpen(true);
    else setMobileStep(2);
  };

  const confirmPublish = async () => {
    const saved = await saveCase("PUBLISHED");
    if (saved) setIsConfirmOpen(false);
  };

  const updateCaseField = (field: keyof CaseForm, value: string) => {
    setCaseForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const updateFund = (id: string, field: keyof FundForm, value: string) => {
    setFundForms((current) =>
      current.map((record) => (record.id === id ? { ...record, [field]: value } : record)),
    );
    setErrors((current) => ({ ...current, fundRecords: "" }));
  };

  const updateSource = (id: string, field: keyof SourceForm, value: string) => {
    setSourceForms((current) =>
      current.map((source) => (source.id === id ? { ...source, [field]: value } : source)),
    );
    setErrors((current) => ({ ...current, sourceDocuments: "" }));
  };

  const addFundRecord = () => {
    setFundForms((current) => [
      ...current,
      {
        id: `new-fund-${Date.now()}`,
        category: "ALLOCATION",
        amount: "",
        purpose: "",
        periodLabel: "",
        documentDate: "",
        sourceTitle: "",
      },
    ]);
    setMobileStep(1);
  };

  const addSource = () => {
    setSourceForms((current) => [
      ...current,
      {
        id: `new-source-${Date.now()}`,
        title: "",
        url: "",
        publisher: "",
        publicationDate: "",
        lastCheckedAt: "",
      },
    ]);
  };

  const stepNames = ["Pilih Kasus", "Formulir", "Validasi"];

  if (loading) {
    return (
      <div className="admin-shell">
        <DemoDataBanner admin />
        <main className="admin-main" aria-live="polite">
          Memuat data demo…
        </main>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <DemoDataBanner admin />
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar__brand">
            <span className="brand__mark" aria-hidden="true">JB</span>
            <div>
              <strong>Admin Jejak Bencana</strong>
              <span>Mode data contoh</span>
            </div>
          </div>
          <p className="admin-sidebar__label">Menu utama</p>
          <nav className="admin-sidebar__links" aria-label="Navigasi admin">
            <a className="is-active" href="#dashboard">Dashboard Ringkasan</a>
            <a href="#case-list">Entri Bencana &amp; Kasus</a>
            <a href="#fund-records">Catatan Alokasi &amp; DSP</a>
            <a href="#source-documents">Verifikasi Sumber Data</a>
            <a href="#integrity">Pengaturan Sistem</a>
          </nav>
          <div className="admin-sidebar__bottom">
            <Link href="/">Buka Portal Publik</Link>
            <Link href="/admin/login">Keluar Sistem</Link>
          </div>
        </aside>

        <main className="admin-main" id="dashboard">
          <header className="admin-main__header">
            <div>
              <h1>Dashboard Admin - Jejak Bencana</h1>
              <p>Pengelolaan data demo kasus, catatan DSP, dan dokumen rujukan.</p>
            </div>
            <Link className="button-secondary" href="/">
              Lihat Tampilan Publik
            </Link>
          </header>

          <div className="admin-mobile-case-select">
            <div className="admin-mobile-case-select__top">
              <div>
                <span className="admin-sidebar__label">Kasus aktif</span>
                <strong>
                  {selectedCase?.title ?? "Kasus baru"}
                </strong>
                <span>{selectedCase?.affectedArea ?? "Lengkapi informasi kasus"}</span>
              </div>
              <button
                className="button-secondary"
                onClick={refreshCases}
                type="button"
              >
                Sinkronisasi
              </button>
            </div>
            <div className="admin-mobile-case-select__actions">
              <label className="admin-field">
                <span className="admin-sidebar__label">Pilih kasus</span>
                <select
                  aria-label="Pilih kasus demo"
                  onChange={(event) => {
                    const item = cases.find((candidate) => candidate.id === event.target.value);
                    if (item) chooseCase(item);
                  }}
                  value={selectedId}
                >
                  <option value="">Pilih kasus demo</option>
                  {cases.map((item) => (
                    <option key={item.id} value={item.id}>{item.title}</option>
                  ))}
                </select>
              </label>
              <button className="button-primary" onClick={startNewCase} type="button">
                Buat Kasus Baru
              </button>
            </div>
          </div>

          <nav className="admin-steps" aria-label="Tahapan pengelolaan kasus">
            {stepNames.map((name, index) => (
              <button
                aria-current={mobileStep === index ? "step" : undefined}
                className={mobileStep === index ? "is-active" : ""}
                key={name}
                onClick={() => setMobileStep(index as MobileStep)}
                type="button"
              >
                {name}
              </button>
            ))}
          </nav>

          {errors.load && <div className="admin-alert admin-alert--error" role="alert">{errors.load}</div>}
          {errors.save && <div className="admin-alert admin-alert--error" role="alert">{errors.save}</div>}
          {feedback && <div className="admin-feedback" role="status">{feedback}</div>}

          <div className="admin-content-grid">
            <section className="admin-card admin-case-list" id="case-list">
              <div className="admin-case-list__heading">
                <h2>Daftar Kasus Kebencanaan</h2>
                <button className="text-link" onClick={refreshCases} type="button">
                  Sinkronisasi
                </button>
              </div>
              {cases.map((item) => (
                <button
                  className={`admin-case-option ${item.id === selectedId ? "is-selected" : ""}`}
                  key={item.id}
                  onClick={() => chooseCase(item)}
                  type="button"
                >
                  <strong>{item.title}</strong>
                  <span>{item.affectedArea}</span>
                  <span>{item.status === "PUBLISHED" ? "Published" : "Draft"}</span>
                </button>
              ))}
              <button className="button-secondary" onClick={startNewCase} type="button">
                Buat Kasus Baru
              </button>
              <div className="admin-integrity" id="integrity">
                <h2>Prosedur Integritas Data Admin</h2>
                <ol>
                  <li>Catat informasi berdasarkan dokumen resmi.</li>
                  <li>Pisahkan alokasi, penyaluran, realisasi, dan rencana.</li>
                  <li>Periksa sumber sebelum mengubah status publikasi.</li>
                </ol>
              </div>
            </section>

            <form
              className="admin-card admin-form"
              onSubmit={(event) => event.preventDefault()}
            >
              <section
                className={`admin-form__section ${mobileStep !== 1 ? "admin-mobile-hidden" : ""}`}
                id="case-fields"
              >
                <h2>a. Form Kasus</h2>
                <div className="admin-form__grid">
                  <div className="admin-field admin-field--full">
                    <label htmlFor="case-title">Judul resmi kasus *</label>
                    <input
                      id="case-title"
                      onChange={(event) => updateCaseField("title", event.target.value)}
                      value={caseForm.title}
                    />
                    {errors.title && <span className="admin-field-error">{errors.title}</span>}
                  </div>
                  <div className="admin-field">
                    <label htmlFor="case-slug">Slug *</label>
                    <input
                      id="case-slug"
                      onChange={(event) => updateCaseField("slug", event.target.value)}
                      value={caseForm.slug}
                    />
                    {errors.slug && <span className="admin-field-error">{errors.slug}</span>}
                  </div>
                  <div className="admin-field">
                    <label htmlFor="case-area">Wilayah terdampak *</label>
                    <input
                      id="case-area"
                      onChange={(event) => updateCaseField("affectedArea", event.target.value)}
                      value={caseForm.affectedArea}
                    />
                    {errors.affectedArea && (
                      <span className="admin-field-error">{errors.affectedArea}</span>
                    )}
                  </div>
                  <div className="admin-field admin-field--full">
                    <label htmlFor="case-summary">Ringkasan situasi *</label>
                    <textarea
                      id="case-summary"
                      onChange={(event) => updateCaseField("summary", event.target.value)}
                      value={caseForm.summary}
                    />
                    {errors.summary && (
                      <span className="admin-field-error">{errors.summary}</span>
                    )}
                  </div>
                  <div className="admin-field">
                    <label htmlFor="case-date">Tanggal kejadian</label>
                    <input
                      id="case-date"
                      onChange={(event) => updateCaseField("incidentDate", event.target.value)}
                      type="date"
                      value={caseForm.incidentDate}
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="case-status">Status publikasi</label>
                    <select
                      id="case-status"
                      onChange={(event) =>
                        updateCaseField("status", event.target.value as CaseStatus)
                      }
                      value={caseForm.status}
                    >
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                    </select>
                  </div>
                  <div className="admin-field">
                    <label htmlFor="period-start">Periode mulai</label>
                    <input
                      id="period-start"
                      onChange={(event) => updateCaseField("periodStart", event.target.value)}
                      type="date"
                      value={caseForm.periodStart}
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="period-end">Periode selesai</label>
                    <input
                      id="period-end"
                      onChange={(event) => updateCaseField("periodEnd", event.target.value)}
                      type="date"
                      value={caseForm.periodEnd}
                    />
                  </div>
                  <div className="admin-field admin-field--full">
                    <label htmlFor="context-note">Catatan konteks</label>
                    <textarea
                      id="context-note"
                      onChange={(event) => updateCaseField("contextNote", event.target.value)}
                      value={caseForm.contextNote}
                    />
                  </div>
                  <div className="admin-field admin-field--full">
                    <label htmlFor="scope-limit">Batasan informasi</label>
                    <textarea
                      id="scope-limit"
                      onChange={(event) => updateCaseField("scopeLimitations", event.target.value)}
                      value={caseForm.scopeLimitations}
                    />
                  </div>
                </div>
              </section>

              <section
                className={`admin-form__section ${mobileStep !== 1 ? "admin-mobile-hidden" : ""}`}
                id="fund-records"
              >
                <h2>b. Form Catatan Dana</h2>
                {fundForms.map((record, index) => (
                  <div className="admin-inline-card" key={record.id}>
                    <div className="admin-field">
                      <label htmlFor={`fund-category-${record.id}`}>Jenis informasi</label>
                      <select
                        id={`fund-category-${record.id}`}
                        onChange={(event) =>
                          updateFund(record.id, "category", event.target.value)
                        }
                        value={record.category}
                      >
                        {categoryOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="admin-field">
                      <label htmlFor={`fund-amount-${record.id}`}>Nominal (Rp)</label>
                      <input
                        id={`fund-amount-${record.id}`}
                        min="0"
                        onChange={(event) =>
                          updateFund(record.id, "amount", event.target.value)
                        }
                        type="number"
                        value={record.amount}
                      />
                    </div>
                    <div className="admin-field admin-field--full">
                      <label htmlFor={`fund-purpose-${record.id}`}>Tujuan / pos anggaran</label>
                      <input
                        id={`fund-purpose-${record.id}`}
                        onChange={(event) =>
                          updateFund(record.id, "purpose", event.target.value)
                        }
                        value={record.purpose}
                      />
                    </div>
                    <div className="admin-field">
                      <label htmlFor={`fund-period-${record.id}`}>Periode</label>
                      <input
                        id={`fund-period-${record.id}`}
                        onChange={(event) =>
                          updateFund(record.id, "periodLabel", event.target.value)
                        }
                        value={record.periodLabel}
                      />
                    </div>
                    <div className="admin-field">
                      <label htmlFor={`fund-date-${record.id}`}>Tanggal dokumen</label>
                      <input
                        id={`fund-date-${record.id}`}
                        onChange={(event) =>
                          updateFund(record.id, "documentDate", event.target.value)
                        }
                        type="date"
                        value={record.documentDate}
                      />
                    </div>
                    <div className="admin-field admin-field--full">
                      <label htmlFor={`fund-source-${record.id}`}>Dokumen rujukan</label>
                      <select
                        id={`fund-source-${record.id}`}
                        onChange={(event) =>
                          updateFund(record.id, "sourceTitle", event.target.value)
                        }
                        value={record.sourceTitle}
                      >
                        <option value="">Pilih dokumen resmi</option>
                        {sourceForms
                          .filter((source) => source.title.trim())
                          .map((source) => (
                            <option key={source.id} value={source.title}>
                              {source.title}
                            </option>
                          ))}
                      </select>
                      {index === 1 && !record.sourceTitle && (
                        <span className="admin-field-error">
                          Catatan dana #2 belum memiliki sumber resmi.
                        </span>
                      )}
                    </div>
                    <div className="admin-field admin-field--full">
                      <button
                        className="text-link"
                        onClick={() =>
                          setMobileStep(2)
                        }
                        type="button"
                      >
                        Tautkan SK atau Berita Acara Sekarang
                      </button>
                    </div>
                  </div>
                ))}
                {errors.fundRecords && (
                  <div className="admin-alert admin-alert--error" role="alert">
                    {errors.fundRecords}
                  </div>
                )}
                <button className="button-secondary" onClick={addFundRecord} type="button">
                  Tambah Rincian DSP Baru
                </button>
                <p className="admin-field__hint">
                  Rencana/pengajuan harus tetap terpisah dari alokasi dan realisasi.
                </p>
              </section>

              <section
                className={`admin-form__section ${mobileStep !== 2 ? "admin-mobile-hidden" : ""}`}
                id="source-documents"
              >
                <h2>c. Form Dokumen Sumber &amp; Validasi</h2>
                {sourceForms.map((source) => (
                  <div className="admin-inline-card" key={source.id}>
                    <div className="admin-field admin-field--full">
                      <label htmlFor={`source-title-${source.id}`}>Nama dokumen resmi</label>
                      <input
                        id={`source-title-${source.id}`}
                        onChange={(event) =>
                          updateSource(source.id, "title", event.target.value)
                        }
                        value={source.title}
                      />
                    </div>
                    <div className="admin-field admin-field--full">
                      <label htmlFor={`source-url-${source.id}`}>URL dokumen</label>
                      <input
                        id={`source-url-${source.id}`}
                        onChange={(event) =>
                          updateSource(source.id, "url", event.target.value)
                        }
                        type="url"
                        value={source.url}
                      />
                    </div>
                    <div className="admin-field">
                      <label htmlFor={`source-publisher-${source.id}`}>Instansi penerbit</label>
                      <input
                        id={`source-publisher-${source.id}`}
                        onChange={(event) =>
                          updateSource(source.id, "publisher", event.target.value)
                        }
                        value={source.publisher}
                      />
                    </div>
                    <div className="admin-field">
                      <label htmlFor={`source-date-${source.id}`}>Tanggal dokumen</label>
                      <input
                        id={`source-date-${source.id}`}
                        onChange={(event) =>
                          updateSource(source.id, "publicationDate", event.target.value)
                        }
                        type="date"
                        value={source.publicationDate}
                      />
                    </div>
                    <div className="admin-field">
                      <label htmlFor={`source-checked-${source.id}`}>Tanggal diperiksa</label>
                      <input
                        id={`source-checked-${source.id}`}
                        onChange={(event) =>
                          updateSource(source.id, "lastCheckedAt", event.target.value)
                        }
                        type="date"
                        value={source.lastCheckedAt}
                      />
                    </div>
                  </div>
                ))}
                {errors.sourceDocuments && (
                  <div className="admin-alert admin-alert--error" role="alert">
                    {errors.sourceDocuments}
                  </div>
                )}
                <button className="button-secondary" onClick={addSource} type="button">
                  Tambah Dokumen Resmi
                </button>
                <div className="admin-alert">
                  Validasi publikasi: pastikan judul, wilayah, ringkasan, dan
                  setidaknya satu tautan dokumen resmi terisi.
                </div>
              </section>

              <div className="admin-form__actions">
                {mobileStep < 2 && (
                  <button
                    className="button-secondary admin-mobile-next"
                    onClick={() => setMobileStep((step) => (step === 0 ? 1 : 2))}
                    type="button"
                  >
                    {mobileStep === 0 ? "Lanjut ke Formulir" : "Lanjut ke Validasi"}
                  </button>
                )}
                <button
                  className={`button-secondary admin-mobile-hidden ${mobileStep !== 2 ? "admin-mobile-action-hidden" : ""}`}
                  disabled={saving}
                  onClick={() => saveCase("DRAFT")}
                  type="button"
                >
                  {saving ? "Menyimpan…" : "Simpan Draft"}
                </button>
                <button
                  className={`button-primary admin-mobile-hidden ${mobileStep !== 2 ? "admin-mobile-action-hidden" : ""}`}
                  disabled={saving}
                  onClick={requestPublish}
                  type="button"
                >
                  Terbitkan Kasus
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      {isConfirmOpen && (
        <div
          className="admin-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) setIsConfirmOpen(false);
          }}
        >
          <section
            aria-labelledby="publish-title"
            aria-modal="true"
            className="admin-modal"
            role="dialog"
          >
            <h2 id="publish-title">Validasi Publikasi Kasus</h2>
            <p>
              Publikasikan data contoh ini ke penyimpanan lokal demo? Pastikan
              informasi bersumber dari dokumen resmi. Data tidak dikirim ke
              backend atau layanan publik.
            </p>
            <div className="admin-modal__actions">
              <button
                className="button-secondary"
                disabled={saving}
                onClick={() => setIsConfirmOpen(false)}
                type="button"
              >
                Batal
              </button>
              <button
                className="button-primary"
                disabled={saving}
                onClick={confirmPublish}
                type="button"
              >
                {saving ? "Menerbitkan…" : "Ya, Terbitkan Data"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
