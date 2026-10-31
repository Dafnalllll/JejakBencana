"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import DemoDataBanner from "@/components/DemoDataBanner";
import PublicFooter from "@/components/PublicFooter";
import { formatRupiah, getCaseBySlug } from "@/lib/mockService";
import type { DisasterCase, FundCategory } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

const categoryConfig: Record<
  FundCategory,
  { label: string; className: string }
> = {
  ALLOCATION: { label: "Alokasi / Penetapan", className: "allocation" },
  DISTRIBUTION: { label: "Penyaluran", className: "distribution" },
  REALIZATION: { label: "Realisasi dilaporkan", className: "realization" },
  PLAN: { label: "Rencana / Pengajuan", className: "plan" },
};

function CaseDetailContent({ slug }: { slug: string }) {
  const [caseItem, setCaseItem] = useState<DisasterCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [showCorrectionNote, setShowCorrectionNote] = useState(false);

  useEffect(() => {
    let active = true;

    getCaseBySlug(slug)
      .then((data) => {
        if (active) setCaseItem(data);
      })
      .catch(() => {
        if (active) setLoadError("Data kasus tidak dapat dimuat. Coba muat ulang halaman.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const totals = useMemo(() => {
    const records = caseItem?.fundRecords ?? [];
    const sum = (category: FundCategory) =>
      records
        .filter((record) => record.category === category)
        .reduce((total, record) => total + record.amount, 0);

    return {
      allocation: sum("ALLOCATION"),
      distribution: sum("DISTRIBUTION"),
      realization: sum("REALIZATION"),
    };
  }, [caseItem]);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: caseItem?.title ?? "Jejak Bencana",
          url,
        });
        setShareMessage("Tautan kasus berhasil dibagikan.");
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setShareMessage("Tautan tidak dapat dibagikan dari perangkat ini.");
        }
      }
      return;
    }

    try {
      if (!navigator.clipboard) {
        window.prompt("Salin tautan kasus ini:", url);
        setShareMessage("Tautan kasus siap disalin.");
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareMessage("Tautan kasus disalin.");
    } catch {
      setShareMessage("Tautan tidak dapat disalin. Salin alamat halaman dari browser.");
    }
  };

  if (loading) {
    return (
      <main className="page-container case-page" aria-live="polite">
        <p>Memuat rincian kasus…</p>
      </main>
    );
  }

  if (loadError || !caseItem) {
    return (
      <main className="page-container case-page">
        <div className="card case-panel" role="alert">
          <h1>{loadError ? "Kasus tidak dapat dimuat" : "Kasus tidak ditemukan"}</h1>
          <p className="case-panel__description">
            {loadError ||
              "Kasus yang dicari tidak tersedia atau belum dipublikasikan dalam data contoh."}
          </p>
          <Link className="button-secondary" href="/kasus">
            Kembali ke daftar kasus
          </Link>
        </div>
      </main>
    );
  }

  const absorption =
    totals.allocation > 0
      ? Math.min(100, Math.round((totals.realization / totals.allocation) * 100))
      : null;
  const dateRange =
    caseItem.periodStart && caseItem.periodEnd
      ? `${caseItem.periodStart} – ${caseItem.periodEnd}`
      : "Tidak dicantumkan pada data contoh";

  return (
    <main className="page-container case-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Beranda</Link>
        <span aria-hidden="true">/</span>
        <Link href="/kasus">Kasus</Link>
        <span aria-hidden="true">/</span>
        <span>Detail Kasus</span>
      </nav>

      <header className="card case-header">
        <div className="case-header__meta">
          <span className="tag">{caseItem.affectedArea}</span>
          {caseItem.incidentDate && <span>Tanggal kejadian: {caseItem.incidentDate}</span>}
          <span>Instansi rujukan: BNPB</span>
        </div>
        <h1>{caseItem.title}</h1>
        <p className="case-header__summary">{caseItem.summary}</p>
        <div className="case-header__actions">
          <button className="button-secondary" onClick={handleShare} type="button">
            Bagikan Kasus
          </button>
          <button
            className="button-secondary"
            onClick={() => setShowCorrectionNote((visible) => !visible)}
            type="button"
          >
            Koreksi Data
          </button>
        </div>
      </header>

      <div className="case-layout">
        <div className="case-main-column">
          <section className="card case-panel">
            <h2>Ringkasan Dana Siap Pakai (DSP)</h2>
            <p className="case-panel__description">
              Setiap jenis informasi ditampilkan terpisah sesuai catatan pada
              dokumen rujukan.
            </p>
            <div className="fund-summary">
              <div className="fund-summary__item fund-summary__item--allocation">
                <span>Alokasi / Penetapan</span>
                <strong>{formatRupiah(totals.allocation)}</strong>
                <small>Nilai penetapan tercatat</small>
              </div>
              <div className="fund-summary__item fund-summary__item--distribution">
                <span>Penyaluran</span>
                <strong>{formatRupiah(totals.distribution)}</strong>
                <small>Nilai penyaluran tercatat</small>
              </div>
              <div className="fund-summary__item fund-summary__item--realization">
                <span>Realisasi dilaporkan</span>
                <strong>{formatRupiah(totals.realization)}</strong>
                <small>Nilai realisasi tercatat</small>
              </div>
            </div>
            <div className="fund-record-list">
              {caseItem.fundRecords
                .filter((record) => record.category !== "PLAN")
                .map((record) => {
                  const category = categoryConfig[record.category];
                  return (
                    <article className="fund-record" key={record.id}>
                      <div>
                        <span className={`fund-badge fund-badge--${category.className}`}>
                          {category.label}
                        </span>
                        <p>
                          {record.purpose ?? "Tujuan penggunaan tidak dicantumkan."}
                          {record.periodLabel ? ` • ${record.periodLabel}` : ""}
                        </p>
                      </div>
                      <strong className="fund-record__amount">
                        {formatRupiah(record.amount)}
                      </strong>
                    </article>
                  );
                })}
            </div>
            {caseItem.fundRecords.some((record) => record.category === "PLAN") && (
              <div className="plan-note">
                Nominal rencana/pengajuan tidak digabungkan ke total alokasi
                aktif maupun realisasi.
              </div>
            )}
          </section>

          <section className="card case-panel">
            <h2>Status Serapan Terhadap Alokasi SK Penetapan</h2>
            <p className="case-panel__description">
              Perbandingan ini hanya ditampilkan jika nilai alokasi dan
              realisasi tersedia pada data contoh.
            </p>
            {absorption === null ? (
              <p className="case-notice">
                Rasio belum dapat dihitung karena nilai alokasi belum tersedia.
              </p>
            ) : (
              <div
                className="absorption"
                role="img"
                aria-label={`${absorption}% realisasi dibanding alokasi yang tercatat`}
              >
                <div className="absorption__labels">
                  <span>{formatRupiah(totals.realization)} realisasi</span>
                  <strong>{absorption}%</strong>
                </div>
                <div className="absorption__track">
                  <div className="absorption__bar" style={{ width: `${absorption}%` }} />
                </div>
                <p className="absorption__caption">
                  Dibandingkan dengan alokasi {formatRupiah(totals.allocation)}.
                  Ini bukan total gabungan kategori dana.
                </p>
              </div>
            )}
          </section>

          <section className="card case-panel">
            <h2>Tujuan Penggunaan Dana</h2>
            <p className="case-panel__description">
              Ringkasan mengikuti peruntukan yang tertulis pada catatan sumber.
            </p>
            <blockquote className="purpose-quote">
              {caseItem.fundRecords.find((record) => record.category !== "PLAN")?.purpose ??
                "Tujuan penggunaan belum dicantumkan pada catatan dana."}
            </blockquote>
          </section>

          <section className="card case-panel case-actions-panel">
            <h2>Bagikan atau koreksi informasi</h2>
            <div className="case-actions">
              <button className="button-primary" onClick={handleShare} type="button">
                Bagikan Kasus
              </button>
              <button
                className="button-secondary"
                onClick={() => setShowCorrectionNote((visible) => !visible)}
                type="button"
              >
                Koreksi Data
              </button>
            </div>
            {shareMessage && <p className="case-notice" role="status">{shareMessage}</p>}
            {showCorrectionNote && (
              <p className="correction-note" role="status">
                Saluran koreksi belum tersedia pada demo ini. Silakan rujuk
                dokumen sumber resmi sebelum menggunakan informasi.
              </p>
            )}
          </section>
        </div>

        <aside className="case-side-column">
          <section className="card case-panel">
            <h2>Wilayah &amp; Periode SK</h2>
            <dl className="case-info-list">
              <div>
                <dt>Wilayah</dt>
                <dd>{caseItem.affectedArea}</dd>
              </div>
              <div>
                <dt>Tanggal kejadian</dt>
                <dd>{caseItem.incidentDate ?? "Tidak dicantumkan"}</dd>
              </div>
              <div>
                <dt>Periode</dt>
                <dd>{dateRange}</dd>
              </div>
              <div>
                <dt>Instansi</dt>
                <dd>BNPB</dd>
              </div>
            </dl>
          </section>

          <section className="card case-panel">
            <h2>Sumber Informasi Resmi</h2>
            <p className="case-panel__description">
              Buka dokumen sumber untuk membaca informasi selengkapnya.
            </p>
            <div className="source-list">
              {caseItem.sourceDocuments.length > 0 ? (
                caseItem.sourceDocuments.map((source) => (
                  <article className="source-item" key={source.id}>
                    <strong>{source.title}</strong>
                    <span>{source.publisher}</span>
                    {source.publicationDate && (
                      <span>Tanggal dokumen: {source.publicationDate}</span>
                    )}
                    {source.url ? (
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        Buka sumber
                      </a>
                    ) : (
                      <span>Tautan sumber belum tersedia pada data contoh.</span>
                    )}
                  </article>
                ))
              ) : (
                <p className="case-notice">
                  Dokumen sumber belum tersedia pada data contoh.
                </p>
              )}
            </div>
          </section>

          <section className="card case-panel">
            <h2>Batasan Informasi &amp; Ruang Lingkup Data Terbuka</h2>
            <p className="case-panel__description">
              {caseItem.scopeLimitations ??
                "Informasi yang tersedia terbatas pada catatan dan dokumen contoh yang ditampilkan."}
            </p>
            {caseItem.contextNote && (
              <div className="scope-note">
                <strong>Catatan konteks:</strong> {caseItem.contextNote}
              </div>
            )}
            <p className="case-notice">
              Data ini merupakan contoh demo dan tidak boleh dianggap sebagai
              informasi faktual atau diterbitkan.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}

export default function CaseDetailPage({ params }: Props) {
  const { slug } = use(params);

  return (
    <>
      <DemoDataBanner />
      <CaseDetailContent slug={slug} />
      <PublicFooter />
    </>
  );
}
