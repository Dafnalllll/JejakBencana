"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DemoDataBanner from "@/components/DemoDataBanner";
import PublicFooter from "@/components/PublicFooter";
import { getPublishedCases } from "@/lib/mockService";
import { formatRupiah } from "@/lib/mockService";
import type { DisasterCase, FundCategory } from "@/types";

const MotionLink = motion.create(Link);

const categoryLabels: Record<FundCategory, string> = {
  ALLOCATION: "Alokasi / Penetapan",
  DISTRIBUTION: "Penyaluran",
  REALIZATION: "Realisasi dilaporkan",
  PLAN: "Rencana / Pengajuan",
};

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [cases, setCases] = useState<DisasterCase[]>([]);

  useEffect(() => {
    getPublishedCases().then(setCases);
  }, []);

  useLayoutEffect(() => {
    const main = mainRef.current;
    if (!main || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-scroll-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          },
        );
      });
    }, main);

    return () => context.revert();
  }, []);

  const featuredCase =
    cases.find((item) => item.slug === "penanganan-banjir-longsor-pesisir-barat") ??
    cases[0];
  const allocation = featuredCase?.fundRecords.find(
    (record) => record.category === "ALLOCATION",
  );
  const distribution = featuredCase?.fundRecords.find(
    (record) => record.category === "DISTRIBUTION",
  );
  const plan = featuredCase?.fundRecords.find((record) => record.category === "PLAN");

  return (
    <>
      <DemoDataBanner />
      <main className="home-page" ref={mainRef}>
        <section className="home-hero">
          <div className="page-container home-hero__content">
            <span className="section-kicker">Portal informasi publik</span>
            <h1>
              Memahami Dana Siap Pakai dari sumber resmi, dengan bahasa yang
              lebih sederhana.
            </h1>
            <p className="home-hero__description">
              Jejak Bencana membantu masyarakat membaca informasi Dana Siap
              Pakai (DSP) melalui konteks kejadian, kategori dana, dan dokumen
              resmi yang menjadi rujukan.
            </p>
            <div className="home-hero__actions">
              <MotionLink
                className="button-primary"
                href="/kasus"
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
              >
                Lihat kasus bencana
              </MotionLink>
              <MotionLink
                className="button-secondary"
                href="/glosarium"
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
              >
                Pelajari istilah DSP
              </MotionLink>
            </div>
          </div>
        </section>

        <div className="page-container">
          <div className="disclaimer-banner" role="note">
            <span aria-hidden="true">!</span>
            <div>
              <strong>Portal informasi, bukan penggalangan dana.</strong>{" "}
              Jejak Bencana tidak menerima donasi, pembayaran, atau transfer.
              Informasi ditampilkan untuk membantu memahami dokumen publik.
            </div>
          </div>
        </div>

        <section className="page-container home-content" aria-labelledby="active-case-title">
          <div className="home-case-section" data-scroll-reveal>
            <div className="home-section-heading">
              <div>
                <span className="section-kicker">Informasi kasus</span>
                <h2 className="section-title" id="active-case-title">
                  Kasus Tanggap Bencana Aktif
                </h2>
                <p className="section-description">
                  Ringkasan konteks dan catatan dana dari dokumen rujukan.
                </p>
              </div>
              <Link className="text-link" href="/kasus">
                Semua kasus
              </Link>
            </div>

            {featuredCase ? (
              <motion.article
                className="card featured-case"
                whileHover={shouldReduceMotion ? undefined : { y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
              >
                <div className="featured-case__top">
                  <div>
                    <span className="tag">Konteks tanggap darurat</span>
                    <h3>{featuredCase.title}</h3>
                  </div>
                  <span className="tag">{featuredCase.affectedArea}</span>
                </div>
                <p className="featured-case__summary">
                  {featuredCase.summary}
                </p>
                <div className="featured-case__details">
                  <div className="featured-case__detail">
                    <strong>Konteks darurat</strong>
                    <span>
                      {featuredCase.contextNote ??
                        "Lihat catatan konteks pada detail kasus dan dokumen rujukan."}
                    </span>
                  </div>
                  <div className="featured-case__detail">
                    <strong>Dokumen penetapan</strong>
                    <span>
                      {featuredCase.sourceDocuments[0]?.title ??
                        "Dokumen sumber belum tersedia pada data contoh."}
                    </span>
                  </div>
                  <div className="featured-case__detail">
                    <strong>Operasional posko &amp; logistik</strong>
                    <span>
                      {distribution?.purpose ??
                        "Rincian operasional mengikuti informasi pada dokumen sumber."}
                    </span>
                  </div>
                  <div className="featured-case__detail">
                    <strong>{allocation ? categoryLabels.ALLOCATION : "Catatan dana"}</strong>
                    <span>
                      {allocation
                        ? formatRupiah(allocation.amount)
                        : "Belum ada catatan alokasi pada data contoh."}
                    </span>
                  </div>
                </div>
                {plan && (
                  <div className="featured-case__note">
                    {plan.notes ??
                      "Rencana pengajuan belum menjadi alokasi resmi dan tidak dijumlahkan ke total anggaran aktif."}
                    {" "}Nilai rencana tidak digabungkan dengan alokasi atau realisasi.
                  </div>
                )}
                <div className="featured-case__footer">
                  <span className="featured-case__meta">
                    {featuredCase.sourceDocuments.length} dokumen sumber •
                    {" "}Diperbarui{" "}
                    {new Date(featuredCase.updatedAt).toLocaleDateString("id-ID")}
                  </span>
                  <Link
                    className="button-primary"
                    href={`/kasus/${featuredCase.slug}`}
                  >
                    Lihat detail kasus lengkap
                  </Link>
                </div>
              </motion.article>
            ) : (
              <div className="card featured-case">
                Belum ada kasus contoh yang tersedia.
              </div>
            )}
          </div>

          <aside className="card context-card" data-scroll-reveal>
            <span className="section-kicker">Batasan informasi</span>
            <h2>Catatan konteks dan ruang lingkup data</h2>
            <p>
              Angka yang ditampilkan mengikuti kategori dan isi dokumen yang
              tersedia. Setiap kategori harus dibaca secara terpisah.
            </p>
            <div className="context-card__list">
              <div className="context-card__item">
                <span className="context-card__number">1</span>
                <div>
                  <strong>Rujukan dokumen</strong>
                  <span>Periksa judul, penerbit, dan tanggal dokumen sumber.</span>
                </div>
              </div>
              <div className="context-card__item">
                <span className="context-card__number">2</span>
                <div>
                  <strong>Kategori tidak dijumlahkan</strong>
                  <span>Alokasi, penyaluran, dan realisasi menunjukkan hal yang berbeda.</span>
                </div>
              </div>
              <div className="context-card__item">
                <span className="context-card__number">3</span>
                <div>
                  <strong>Data contoh</strong>
                  <span>Konten ini bukan pernyataan faktual untuk diterbitkan.</span>
                </div>
              </div>
            </div>
            <p className="context-card__footnote">
              Lihat juga{" "}
              <Link className="text-link" href="/metodologi">
                metodologi dan batasan data
              </Link>
              .
            </p>
          </aside>
        </section>

        <section className="home-bottom" data-scroll-reveal>
          <div className="page-container home-bottom__grid">
            <div>
              <span className="section-kicker">Pahami konteksnya</span>
              <h2 className="section-title">Apa itu DSP (Dana Siap Pakai)?</h2>
              <p className="section-description">
                Dana negara untuk kebutuhan penanganan bencana yang dibaca
                melalui informasi dan dokumen resmi.
              </p>
              <div className="definition-cards">
                <article className="definition-card">
                  <strong>Anggaran siap pakai negara</strong>
                  <p>
                    Dana pemerintah untuk mendukung kebutuhan penanganan
                    darurat sesuai ketentuan.
                  </p>
                </article>
                <article className="definition-card">
                  <strong>Disalurkan instansi terkait</strong>
                  <p>
                    Catatan penyaluran perlu dibaca bersama penerima, tujuan,
                    periode, dan sumber dokumennya.
                  </p>
                </article>
                <article className="definition-card">
                  <strong>Bukan donasi publik</strong>
                  <p>
                    DSP bukan pengumpulan donasi dan bukan layanan transaksi
                    atau pembayaran.
                  </p>
                </article>
              </div>
              <p className="section-description">
                <Link className="text-link" href="/glosarium">
                  Buka glosarium DSP
                </Link>
              </p>
            </div>

            <div>
              <span className="section-kicker">Cara membaca informasi</span>
              <h2 className="section-title">Standar verifikasi tiga langkah</h2>
              <div className="verification-list">
                <div className="verification-list__item">
                  <b>1</b>
                  <span>
                    <strong>Temukan sumber resminya.</strong> Buka dokumen dari
                    instansi penerbit.
                  </span>
                </div>
                <div className="verification-list__item">
                  <b>2</b>
                  <span>
                    <strong>Kenali jenis informasinya.</strong> Bedakan
                    penetapan, penyaluran, realisasi, dan rencana.
                  </span>
                </div>
                <div className="verification-list__item">
                  <b>3</b>
                  <span>
                    <strong>Baca tanggal dan batasannya.</strong> Informasi
                    mengikuti cakupan dokumen yang tersedia.
                  </span>
                </div>
              </div>
              <p className="section-description">
                <Link className="text-link" href="/metodologi">
                  Catatan metodologi &amp; batasan
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
