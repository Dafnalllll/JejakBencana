"use client";

import type { CaseStatus, FundCategory } from "@/types";
import type {
  AdminFormStep,
  CaseForm,
  FundForm,
  SourceForm,
} from "@/types/admin";

interface AdminCaseEditorProps {
  step: AdminFormStep;
  caseForm: CaseForm;
  fundForms: FundForm[];
  sourceForms: SourceForm[];
  errors: Record<string, string>;
  saving: boolean;
  onStepChange: (step: AdminFormStep) => void;
  onCaseFieldChange: (field: keyof CaseForm, value: string) => void;
  onFundChange: (id: string, field: keyof FundForm, value: string) => void;
  onSourceChange: (id: string, field: keyof SourceForm, value: string) => void;
  onAddFund: () => void;
  onAddSource: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

const steps = ["Informasi Kasus", "Catatan Dana", "Dokumen & Validasi"];

const categories: { value: FundCategory; label: string }[] = [
  { value: "ALLOCATION", label: "Alokasi / Penetapan" },
  { value: "DISTRIBUTION", label: "Penyaluran" },
  { value: "REALIZATION", label: "Realisasi dilaporkan" },
  { value: "PLAN", label: "Rencana / Pengajuan" },
];

export default function AdminCaseEditor({
  step,
  caseForm,
  fundForms,
  sourceForms,
  errors,
  saving,
  onStepChange,
  onCaseFieldChange,
  onFundChange,
  onSourceChange,
  onAddFund,
  onAddSource,
  onSaveDraft,
  onPublish,
}: AdminCaseEditorProps) {
  return (
    <div className="admin-editor-stack">
      <nav className="admin-steps" id="admin-steps" aria-label="Tahapan pengelolaan kasus">
        {steps.map((name, index) => (
          <button
            aria-current={step === index ? "step" : undefined}
            className={
              step === index ? "is-active" : step > index ? "is-complete" : ""
            }
            key={name}
            onClick={() => onStepChange(index as AdminFormStep)}
            type="button"
          >
            <span className="admin-steps__number">{index + 1}</span>
            <span>{name}</span>
          </button>
        ))}
      </nav>

      <form
        className="admin-card admin-form"
        id="admin-editor"
        onSubmit={(event) => event.preventDefault()}
      >
        <section
          className={`admin-form__section ${step !== 0 ? "admin-step-hidden" : ""}`}
          id="case-fields"
        >
          <h2>a. Form Kasus</h2>
          <div className="admin-form__grid">
            <div className="admin-field admin-field--full">
              <label htmlFor="case-title">Judul resmi kasus *</label>
              <input
                id="case-title"
                onChange={(event) => onCaseFieldChange("title", event.target.value)}
                value={caseForm.title}
              />
              {errors.title && <span className="admin-field-error">{errors.title}</span>}
            </div>
            <div className="admin-field">
              <label htmlFor="case-slug">Slug *</label>
              <input
                id="case-slug"
                onChange={(event) => onCaseFieldChange("slug", event.target.value)}
                value={caseForm.slug}
              />
              {errors.slug && <span className="admin-field-error">{errors.slug}</span>}
            </div>
            <div className="admin-field">
              <label htmlFor="case-area">Wilayah terdampak *</label>
              <input
                id="case-area"
                onChange={(event) => onCaseFieldChange("affectedArea", event.target.value)}
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
                onChange={(event) => onCaseFieldChange("summary", event.target.value)}
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
                onChange={(event) => onCaseFieldChange("incidentDate", event.target.value)}
                type="date"
                value={caseForm.incidentDate}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="case-status">Status publikasi</label>
              <select
                id="case-status"
                onChange={(event) => onCaseFieldChange("status", event.target.value as CaseStatus)}
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
                onChange={(event) => onCaseFieldChange("periodStart", event.target.value)}
                type="date"
                value={caseForm.periodStart}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="period-end">Periode selesai</label>
              <input
                id="period-end"
                onChange={(event) => onCaseFieldChange("periodEnd", event.target.value)}
                type="date"
                value={caseForm.periodEnd}
              />
            </div>
            <div className="admin-field admin-field--full">
              <label htmlFor="context-note">Catatan konteks</label>
              <textarea
                id="context-note"
                onChange={(event) => onCaseFieldChange("contextNote", event.target.value)}
                value={caseForm.contextNote}
              />
            </div>
            <div className="admin-field admin-field--full">
              <label htmlFor="scope-limit">Batasan informasi</label>
              <textarea
                id="scope-limit"
                onChange={(event) =>
                  onCaseFieldChange("scopeLimitations", event.target.value)
                }
                value={caseForm.scopeLimitations}
              />
            </div>
          </div>
        </section>

        <section
          className={`admin-form__section ${step !== 1 ? "admin-step-hidden" : ""}`}
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
                    onFundChange(record.id, "category", event.target.value)
                  }
                  value={record.category}
                >
                  {categories.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="admin-field">
                <label htmlFor={`fund-amount-${record.id}`}>Nominal (Rp)</label>
                <input
                  id={`fund-amount-${record.id}`}
                  min="0"
                  onChange={(event) => onFundChange(record.id, "amount", event.target.value)}
                  type="number"
                  value={record.amount}
                />
              </div>
              <div className="admin-field admin-field--full">
                <label htmlFor={`fund-purpose-${record.id}`}>Tujuan / pos anggaran</label>
                <input
                  id={`fund-purpose-${record.id}`}
                  onChange={(event) => onFundChange(record.id, "purpose", event.target.value)}
                  value={record.purpose}
                />
              </div>
              <div className="admin-field">
                <label htmlFor={`fund-period-${record.id}`}>Periode</label>
                <input
                  id={`fund-period-${record.id}`}
                  onChange={(event) =>
                    onFundChange(record.id, "periodLabel", event.target.value)
                  }
                  value={record.periodLabel}
                />
              </div>
              <div className="admin-field">
                <label htmlFor={`fund-date-${record.id}`}>Tanggal dokumen</label>
                <input
                  id={`fund-date-${record.id}`}
                  onChange={(event) =>
                    onFundChange(record.id, "documentDate", event.target.value)
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
                    onFundChange(record.id, "sourceTitle", event.target.value)
                  }
                  value={record.sourceTitle}
                >
                  <option value="">Pilih dokumen resmi</option>
                  {sourceForms
                    .filter((source) => source.title.trim())
                    .map((source) => (
                      <option key={source.id} value={source.title}>{source.title}</option>
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
                  onClick={() => onStepChange(2)}
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
          <button className="button-secondary" onClick={onAddFund} type="button">
            Tambah Rincian DSP Baru
          </button>
          <p className="admin-field__hint">
            Rencana/pengajuan harus tetap terpisah dari alokasi dan realisasi.
          </p>
        </section>

        <section
          className={`admin-form__section ${step !== 2 ? "admin-step-hidden" : ""}`}
          id="source-documents"
        >
          <h2>c. Form Dokumen Sumber &amp; Validasi</h2>
          {sourceForms.map((source) => (
            <div className="admin-inline-card" key={source.id}>
              <div className="admin-field admin-field--full">
                <label htmlFor={`source-title-${source.id}`}>Nama dokumen resmi</label>
                <input
                  id={`source-title-${source.id}`}
                  onChange={(event) => onSourceChange(source.id, "title", event.target.value)}
                  value={source.title}
                />
              </div>
              <div className="admin-field admin-field--full">
                <label htmlFor={`source-url-${source.id}`}>URL dokumen</label>
                <input
                  id={`source-url-${source.id}`}
                  onChange={(event) => onSourceChange(source.id, "url", event.target.value)}
                  type="url"
                  value={source.url}
                />
              </div>
              <div className="admin-field">
                <label htmlFor={`source-publisher-${source.id}`}>Instansi penerbit</label>
                <input
                  id={`source-publisher-${source.id}`}
                  onChange={(event) =>
                    onSourceChange(source.id, "publisher", event.target.value)
                  }
                  value={source.publisher}
                />
              </div>
              <div className="admin-field">
                <label htmlFor={`source-date-${source.id}`}>Tanggal dokumen</label>
                <input
                  id={`source-date-${source.id}`}
                  onChange={(event) =>
                    onSourceChange(source.id, "publicationDate", event.target.value)
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
                    onSourceChange(source.id, "lastCheckedAt", event.target.value)
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
          <button className="button-secondary" onClick={onAddSource} type="button">
            Tambah Dokumen Resmi
          </button>
          <div className="admin-alert">
            Validasi publikasi: pastikan judul, wilayah, ringkasan, dan setidaknya satu
            tautan dokumen resmi terisi.
          </div>
        </section>

        <div className="admin-form__actions">
          {step > 0 && (
            <button
              className="button-secondary admin-step-back"
              onClick={() => onStepChange((step - 1) as AdminFormStep)}
              type="button"
            >
              ← Kembali
            </button>
          )}
          {step < 2 ? (
            <button
              className="button-primary admin-step-next"
              onClick={() => onStepChange((step + 1) as AdminFormStep)}
              type="button"
            >
              {step === 0 ? "Lanjut ke Catatan Dana" : "Lanjut ke Dokumen"}
              <span aria-hidden="true">→</span>
            </button>
          ) : (
            <>
              <button
                className="button-secondary"
                disabled={saving}
                onClick={onSaveDraft}
                type="button"
              >
                {saving ? "Menyimpan…" : "Simpan Draft"}
              </button>
              <button
                className="button-primary"
                disabled={saving}
                onClick={onPublish}
                type="button"
              >
                Terbitkan Kasus
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
