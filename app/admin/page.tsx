"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AdminCaseBrowser from "@/components/AdminCaseBrowser";
import AdminCaseEditor from "@/components/AdminCaseEditor";
import AdminCasesManagement from "@/components/AdminCasesManagement";
import AdminDashboardOverview from "@/components/AdminDashboardOverview";
import AdminFundsManagement from "@/components/AdminFundsManagement";
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
  const [view, setView] = useState<"dashboard" | "cases" | "funds" | "editor">("dashboard");
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
      router.push("/login");
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
    setView("editor");
    setSelectedId(item.id);
    setCaseForm(toCaseForm(item));
    setFundForms(toFundForms(item));
    setSourceForms(toSourceForms(item));
    setErrors({});
    setFeedback("");
    setFormStep(0);
  };

  const startNewCase = () => {
    setView("editor");
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
    router.push("/login");
  };

  const refreshCases = async () => {
    setErrors({});
    try {
      const data = await getAllCases();
      setCases(data);
      const current = data.find((item) => item.id === selectedId) ?? data[0];
      if (current) {
        setSelectedId(current.id);
        setCaseForm(toCaseForm(current));
        setFundForms(toFundForms(current));
        setSourceForms(toSourceForms(current));
        setFormStep(0);
      } else {
        setSelectedId("");
        setCaseForm({ ...emptyCase });
        setFundForms([]);
        setSourceForms([]);
      }
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

  const startNewFundRecord = () => {
    if (selectedCase) {
      setSelectedId(selectedCase.id);
      setCaseForm(toCaseForm(selectedCase));
      setFundForms([
        ...toFundForms(selectedCase),
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
      setSourceForms(toSourceForms(selectedCase));
      setErrors({});
      setFeedback("");
      setFormStep(1);
      setView("editor");
      return;
    }

    startNewCase();
    setFundForms([{
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
    setView("editor");
  };

  const openCases = () => {
    setView("cases");
    setErrors({});
    setFeedback("");
  };

  const openFunds = () => {
    setView("funds");
    setErrors({});
    setFeedback("");
  };

  const editFundsForCase = (item: DisasterCase) => {
    setSelectedId(item.id);
    setCaseForm(toCaseForm(item));
    setFundForms(toFundForms(item));
    setSourceForms(toSourceForms(item));
    setErrors({});
    setFeedback("");
    setFormStep(1);
    setView("editor");
  };

  useEffect(() => {
    if (view !== "editor") return;
    document.getElementById("admin-steps")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }, [view, formStep]);

  const exportReport = () => {
    const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const rows = [
      [
        "Judul kasus",
        "Status",
        "Wilayah",
        "Alokasi",
        "Penyaluran",
        "Realisasi",
        "Dokumen sumber",
      ],
      ...cases.map((item) => {
        const totalFor = (category: "ALLOCATION" | "DISTRIBUTION" | "REALIZATION") =>
          item.fundRecords
            .filter((record) => record.category === category)
            .reduce((total, record) => total + record.amount, 0);
        return [
          item.title,
          item.status === "PUBLISHED" ? "Dipublikasikan" : "Draft",
          item.affectedArea,
          String(totalFor("ALLOCATION")),
          String(totalFor("DISTRIBUTION")),
          String(totalFor("REALIZATION")),
          String(item.sourceDocuments.length),
        ];
      }),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map(quote).join(",")).join("\r\n")}`;
    const file = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "laporan-audit-jejak-bencana.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportFundReport = () => {
    const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const rows = [
      ["ID Catatan", "Kasus", "Wilayah", "Kategori", "Pos Penggunaan", "Nominal (IDR)", "Periode", "Tanggal Dokumen", "Dokumen Rujukan"],
      ...cases.flatMap((item) => item.fundRecords.map((record) => [
        record.id,
        item.title,
        item.affectedArea,
        record.category,
        record.purpose ?? "",
        String(record.amount),
        record.periodLabel ?? "",
        record.documentDate ?? "",
        record.sources.map((source) => source.title).join("; "),
      ])),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map(quote).join(",")).join("\r\n")}`;
    const file = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "catatan-alokasi-dsp-jejak-bencana.csv";
    anchor.click();
    URL.revokeObjectURL(url);
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
          isDashboardActive={view === "dashboard"}
          isCasesActive={view === "cases"}
          isFundsActive={view === "funds"}
          onCreateCase={startNewCase}
          onLogout={handleLogout}
          onNavigateToStep={goToFormStep}
          onShowCases={openCases}
          onShowFunds={openFunds}
          onShowDashboard={() => setView("dashboard")}
        />
        {view === "dashboard" ? (
          <AdminDashboardOverview
            cases={cases}
            error={errors.load || errors.save}
            feedback={feedback}
            onCreateCase={startNewCase}
            onEditCase={chooseCase}
            onEditStep={(step) => step === 0 ? openCases() : step === 1 ? openFunds() : goToFormStep(step)}
            onExport={exportReport}
            onRefresh={refreshCases}
            onViewSources={() => router.push("/admin/sumber")}
          />
        ) : view === "cases" ? (
          <AdminCasesManagement
            cases={cases}
            error={errors.load || errors.save}
            feedback={feedback}
            onCreateCase={startNewCase}
            onEditCase={chooseCase}
            onExport={exportReport}
            onRefresh={refreshCases}
          />
        ) : view === "funds" ? (
          <AdminFundsManagement
            cases={cases}
            onCreateFund={startNewFundRecord}
            onEditFund={editFundsForCase}
            onExport={exportFundReport}
          />
        ) : (
          <main className="admin-main min-w-0 flex-1" id="dashboard">
            <header className="admin-main__header">
              <div>
                <p className="mb-1 text-[10px] font-semibold tracking-wide text-[#718096]">
                  Admin Portal / Pengelolaan Data
                </p>
                <h1>Entri Bencana &amp; Kasus</h1>
                <p>Kelola informasi kasus, catatan DSP, dan dokumen rujukan.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="button-secondary"
                  onClick={openCases}
                  type="button"
                >
                  Kembali ke Daftar Kasus
                </button>
                <Link className="button-secondary" href="/">Lihat Tampilan Publik</Link>
              </div>
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
        )}
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
