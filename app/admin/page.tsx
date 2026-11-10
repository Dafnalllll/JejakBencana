"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AdminCaseBrowser from "@/components/AdminCaseBrowser";
import AdminCaseEditor from "@/components/AdminCaseEditor";
import AdminPublishDialog from "@/components/AdminPublishDialog";
import AdminSidebar from "@/components/AdminSidebar";
import DemoDataBanner from "@/components/DemoDataBanner";
import LoadingState from "@/components/LoadingState";
import { getAllCases, upsertCase } from "@/lib/mockService";
import type { CaseStatus, DisasterCase, SourceDocument } from "@/types";
import type {
  AdminFormStep,
  CaseForm,
  FundForm,
  SourceForm,
} from "@/types/admin";

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
  return item?.fundRecords.map((record) => ({
    id: record.id,
    category: record.category,
    amount: String(record.amount),
    purpose: record.purpose ?? "",
    periodLabel: record.periodLabel ?? "",
    documentDate: record.documentDate ?? "",
    sourceTitle: record.sources[0]?.title ?? "",
  })) ?? [];
}

function toSourceForms(item?: DisasterCase): SourceForm[] {
  return item?.sourceDocuments.map((source) => ({
    id: source.id,
    title: source.title,
    url: source.url,
    publisher: source.publisher,
    publicationDate: source.publicationDate ?? "",
    lastCheckedAt: source.lastCheckedAt ?? "",
  })) ?? [];
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
  const router = useRouter();
  const [cases, setCases] = useState<DisasterCase[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [caseForm, setCaseForm] = useState<CaseForm>({ ...emptyCase });
  const [fundForms, setFundForms] = useState<FundForm[]>([]);
  const [sourceForms, setSourceForms] = useState<SourceForm[]>([]);
  const [formStep, setFormStep] = useState<AdminFormStep>(0);
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
    if (!localStorage.getItem("jejak_bencana_auth")) {
      router.push("/admin/login");
      return;
    }

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
        if (active) setErrors({ load: "Data contoh gagal dimuat. Coba muat ulang halaman." });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router]);

  const chooseCase = (item: DisasterCase) => {
    setSelectedId(item.id);
    setCaseForm(toCaseForm(item));
    setFundForms(toFundForms(item));
    setSourceForms(toSourceForms(item));
    setErrors({});
    setFeedback("");
    setFormStep(0);
  };

  const startNewCase = () => {
    setSelectedId("");
    setCaseForm({ ...emptyCase });
    setFundForms([]);
    setSourceForms([]);
    setErrors({});
    setFeedback("");
    setFormStep(0);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // The demo session is cleared locally even when the endpoint is unavailable.
    }
    localStorage.removeItem("jejak_bencana_auth");
    router.push("/admin/login");
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

    if (fundForms.some((record) =>
      record.amount.trim() === "" ||
      !Number.isFinite(Number(record.amount)) ||
      Number(record.amount) < 0
    )) {
      nextErrors.fundRecords = "Isi nominal setiap rincian dana dengan angka nol atau lebih.";
    }

    if (
      status === "PUBLISHED" &&
      !sourceForms.some((source) =>
        source.title.trim() &&
        source.publisher.trim() &&
        isHttpUrl(source.url.trim())
      )
    ) {
      nextErrors.sourceDocuments =
        "Tambahkan minimal satu dokumen resmi dengan judul, penerbit, dan URL HTTP/HTTPS yang valid.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const firstInvalidStep = (status: CaseStatus): AdminFormStep => {
    if (
      !caseForm.title.trim() ||
      !caseForm.slug.trim() ||
      !caseForm.affectedArea.trim() ||
      !caseForm.summary.trim()
    ) return 0;

    if (fundForms.some((record) =>
      record.amount.trim() === "" ||
      !Number.isFinite(Number(record.amount)) ||
      Number(record.amount) < 0
    )) return 1;

    if (
      status === "PUBLISHED" &&
      !sourceForms.some((source) =>
        source.title.trim() &&
        source.publisher.trim() &&
        isHttpUrl(source.url.trim())
      )
    ) return 2;

    return 0;
  };

  const saveCase = async (status: CaseStatus) => {
    if (!validate(status)) {
      setFormStep(firstInvalidStep(status));
      return false;
    }

    setSaving(true);
    setFeedback("");
    try {
      const documents = sourceForms
        .filter((source) => source.title.trim() || source.url.trim() || source.publisher.trim())
        .map(makeSource);
      const saved = await upsertCase({
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
          const source = documents.find((document) => document.title === record.sourceTitle);
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
      });

      setCases(await getAllCases());
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
        save: error instanceof Error
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
    else setFormStep(firstInvalidStep("PUBLISHED"));
  };

  const confirmPublish = async () => {
    if (await saveCase("PUBLISHED")) setIsConfirmOpen(false);
  };

  const updateCaseField = (field: keyof CaseForm, value: string) => {
    setCaseForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const updateFund = (id: string, field: keyof FundForm, value: string) => {
    setFundForms((current) =>
      current.map((record) => record.id === id ? { ...record, [field]: value } : record),
    );
    setErrors((current) => ({ ...current, fundRecords: "" }));
  };

  const updateSource = (id: string, field: keyof SourceForm, value: string) => {
    setSourceForms((current) =>
      current.map((source) => source.id === id ? { ...source, [field]: value } : source),
    );
    setErrors((current) => ({ ...current, sourceDocuments: "" }));
  };

  const addFundRecord = () => {
    setFundForms((current) => [...current, {
      id: `new-fund-${Date.now()}`,
      category: "ALLOCATION",
      amount: "",
      purpose: "",
      periodLabel: "",
      documentDate: "",
      sourceTitle: "",
    }]);
    setFormStep(1);
  };

  const addSource = () => {
    setSourceForms((current) => [...current, {
      id: `new-source-${Date.now()}`,
      title: "",
      url: "",
      publisher: "",
      publicationDate: "",
      lastCheckedAt: "",
    }]);
  };

  const goToFormStep = (step: AdminFormStep) => {
    setFormStep(step);
    document.getElementById("admin-steps")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  };

  if (loading) {
    return (
      <div className="admin-shell">
        <DemoDataBanner admin />
        <main className="admin-main" aria-live="polite">
          <LoadingState label="Memuat data demo..." variant="dashboard" />
        </main>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <DemoDataBanner admin />
      <div className="admin-layout">
        <AdminSidebar
          currentStep={formStep}
          onCreateCase={startNewCase}
          onLogout={handleLogout}
          onNavigateToStep={goToFormStep}
        />
        <main className="admin-main" id="dashboard">
          <header className="admin-main__header">
            <div>
              <h1>Dashboard Admin - Jejak Bencana</h1>
              <p>Pengelolaan data demo kasus, catatan DSP, dan dokumen rujukan.</p>
            </div>
            <Link className="button-secondary" href="/">Lihat Tampilan Publik</Link>
          </header>

          {errors.load && <div className="admin-alert admin-alert--error" role="alert">{errors.load}</div>}
          {errors.save && <div className="admin-alert admin-alert--error" role="alert">{errors.save}</div>}
          {feedback && <div className="admin-feedback" role="status">{feedback}</div>}

          <div className="admin-content-grid">
            <AdminCaseBrowser
              cases={cases}
              onChoose={chooseCase}
              onCreate={startNewCase}
              onRefresh={refreshCases}
              selectedCase={selectedCase}
              selectedId={selectedId}
            />
            <AdminCaseEditor
              caseForm={caseForm}
              errors={errors}
              fundForms={fundForms}
              onAddFund={addFundRecord}
              onAddSource={addSource}
              onCaseFieldChange={updateCaseField}
              onFundChange={updateFund}
              onPublish={requestPublish}
              onSaveDraft={() => saveCase("DRAFT")}
              onSourceChange={updateSource}
              onStepChange={goToFormStep}
              saving={saving}
              sourceForms={sourceForms}
              step={formStep}
            />
          </div>
        </main>
      </div>

      {isConfirmOpen && (
        <AdminPublishDialog
          onCancel={() => setIsConfirmOpen(false)}
          onConfirm={confirmPublish}
          saving={saving}
        />
      )}
    </div>
  );
}
