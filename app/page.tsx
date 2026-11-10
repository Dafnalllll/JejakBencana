"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PublicFooter from "@/components/PublicFooter";
import { formatRupiah, getPublishedCases } from "@/lib/mockService";
import type { DisasterCase, FundCategory } from "@/types";

const MotionLink = motion.create(Link);

const fundCards: { category: FundCategory; label: string }[] = [
  { category: "ALLOCATION", label: "Alokasi penetapan" },
  { category: "REALIZATION", label: "Realisasi dilaporkan" },
  { category: "PLAN", label: "Rencana pengajuan" },
];

function getLocationParts(location: string) {
  const [district = "", ...rest] = location.split(",");
  const province = rest
    .join(",")
    .match(/(?:Provinsi|Prov\.)\s*(.+)/i)?.[1]
    ?.trim();

  return { district: district.trim(), province: province ?? "" };
}

function formatDate(value?: string) {
  if (!value) return "Belum dicantumkan";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Belum dicantumkan";

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getPeriodLabel(item: DisasterCase) {
  if (item.periodStart && item.periodEnd) {
    return `${formatDate(item.periodStart)} – ${formatDate(item.periodEnd)}`;
  }
  return item.periodStart ? `Mulai ${formatDate(item.periodStart)}` : "Periode belum dicantumkan";
}

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [cases, setCases] = useState<DisasterCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [provinceDraft, setProvinceDraft] = useState("");
  const [districtDraft, setDistrictDraft] = useState("");
  const [appliedProvince, setAppliedProvince] = useState("");
  const [appliedDistrict, setAppliedDistrict] = useState("");

  useEffect(() => {
    let active = true;
    getPublishedCases().then((publishedCases) => {
      if (active) {
        setCases(publishedCases);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
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
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              once: true,
            },
          },
        );
      });
    }, main);

    return () => context.revert();
  }, []);

  const provinces = useMemo(
    () =>
      Array.from(
        new Set(
          cases
            .map((item) => getLocationParts(item.affectedArea).province)
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b, "id")),
    [cases],
  );
  const districts = useMemo(
    () =>
      Array.from(
        new Set(cases.map((item) => getLocationParts(item.affectedArea).district).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b, "id")),
    [cases],
  );
  const filteredCases = cases.filter((item) => {
    const location = getLocationParts(item.affectedArea);
    return (
      (!appliedProvince || location.province === appliedProvince) &&
      (!appliedDistrict || location.district === appliedDistrict)
    );
  });

  function applyFilters() {
    setAppliedProvince(provinceDraft);
    setAppliedDistrict(districtDraft);
  }

  function resetFilters() {
    setProvinceDraft("");
    setDistrictDraft("");
    setAppliedProvince("");
    setAppliedDistrict("");
  }

  return (
    <>
      <main className="home-page" ref={mainRef}>
        <section className="home-hero py-11! max-md:py-8!">
          <div className="home-container home-hero__content w-[92%]! max-w-[1240px]! max-md:w-[calc(100%-32px)]!">
            <span className="home-kicker min-h-9! gap-2! px-4! py-2! text-xs! leading-5!">
              <span aria-hidden="true">⌂</span>
              Akuntabilitas publik dana darurat negara
            </span>
            <h1 className="text-[clamp(36px,4vw,52px)]! leading-[1.12]! max-md:text-[34px]!">
              Memahami Dana Siap Pakai dari sumber resmi, dengan bahasa yang
              lebih sederhana.
            </h1>
            <p className="home-hero__description mt-4! text-base! leading-7! max-md:text-sm! max-md:leading-6!">
              Platform keterbukaan data berbasis rujukan resmi untuk memantau
              alokasi dan realisasi dana kebencanaan secara transparan dan
              berimbang.
            </p>
            <p className="home-hero__notice mt-5! max-w-[820px]! gap-3! py-2! pl-4! text-sm! leading-6! max-md:text-xs! max-md:leading-5!">
              <span aria-hidden="true">ⓘ</span>
              <span>
                Bukan platform penggalangan dana, bukan saluran pembayaran.
                Seluruh data merujuk pada publikasi instansi terkait.
              </span>
            </p>
          </div>
        </section>

        <div className="home-container home-content w-[92%]! max-w-[1240px]! !gap-9 !pb-14 max-md:w-[calc(100%-32px)]! max-md:!gap-7">
          <section className="home-filter card !rounded-xl !p-6 max-md:!p-4" aria-labelledby="filter-title">
            <div className="home-filter__heading !gap-5 !pb-4">
              <h2 className="!text-lg max-md:!text-base" id="filter-title">
                <span aria-hidden="true">☷</span>
                Filter Wilayah &amp; Pemantauan Kasus
              </h2>
              <span className="home-filter__coverage !px-3 !py-1.5 !text-xs">
                {provinces.length
                  ? `${provinces.length} provinsi dari data tersedia`
                  : "Wilayah dari data tersedia"}
              </span>
            </div>
            <div className="home-filter__fields !gap-4 !py-4">
              <label className="!gap-2 !text-xs">
                <span>Provinsi</span>
                <select className="!min-h-12 !rounded-lg !px-3 !text-sm"
                  value={provinceDraft}
                  onChange={(event) => setProvinceDraft(event.target.value)}
                >
                  <option value="">Semua provinsi</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </label>
              <label className="!gap-2 !text-xs">
                <span>Kabupaten / Kota</span>
                <select className="!min-h-12 !rounded-lg !px-3 !text-sm"
                  value={districtDraft}
                  onChange={(event) => setDistrictDraft(event.target.value)}
                >
                  <option value="">Semua kabupaten / kota</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </label>
              <div className="home-filter__actions !gap-2 !text-xs">
                <span>Aksi penelusuran</span>
                <div>
                  <button className="home-button-primary !min-h-11 !rounded-lg !px-4 !text-xs" type="button" onClick={applyFilters}>
                    <span aria-hidden="true">⌕</span>
                    Terapkan filter
                  </button>
                  <button className="home-button-reset !min-h-11 !rounded-lg !px-4 !text-xs" type="button" onClick={resetFilters}>
                    Reset
                  </button>
                </div>
              </div>
            </div>
            <div className="home-filter__status !gap-3 !text-xs" aria-live="polite">
              <span>
                <strong className="!text-xs">Status data:</strong>
                <span className="home-status-pill !px-3 !py-1 !text-xs">Dipublikasikan</span>
              </span>
              <span className="home-filter__result">
                <i aria-hidden="true" />
                {loading
                  ? "Memuat kasus terpublikasi..."
                  : `Menampilkan ${filteredCases.length} dari ${cases.length} kasus terpublikasi`}
              </span>
            </div>
          </section>

          <section className="home-cases" aria-labelledby="active-case-title">
            <div className="home-section-heading">
              <h2 className="!text-lg max-md:!text-base" id="active-case-title">
                <span aria-hidden="true">◉</span>
                Kasus Tanggap Darurat Terpantau
              </h2>
              <span className="home-section-count !text-xs">
                <i aria-hidden="true" />
                {loading ? "Memuat data" : `${filteredCases.length} kasus terpublikasi`}
              </span>
            </div>

            {loading ? (
              <div className="home-skeleton-list" role="status" aria-label="Memuat informasi kasus" aria-live="polite">
                <span className="sr-only">Memuat informasi kasus...</span>
                {[0, 1].map((item) => (
                  <article className="skeleton-card" aria-hidden="true" key={item}>
                    <span className="skeleton-block skeleton-block--short" />
                    <span className="skeleton-block skeleton-block--title" />
                    <span className="skeleton-block skeleton-block--text" />
                    <span className="skeleton-block skeleton-block--text skeleton-block--text-last" />
                  </article>
                ))}
              </div>
            ) : filteredCases.length ? (
              <div className="home-case-list">
                {filteredCases.map((item) => (
                  <motion.article
                    className="home-case-card !rounded-[28px_0_36px_0]"
                    data-scroll-reveal
                    key={item.id}
                    whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  >
                    <div className="home-case-card__labels !gap-2 !px-5 !py-3">
                      <span className="home-case-label home-case-label--region !min-h-7 !px-3 !py-1 !text-[10px] !leading-4">
                        <span aria-hidden="true">⌖</span>
                        {item.affectedArea}
                      </span>
                      <span className="home-case-label home-case-label--type !min-h-7 !px-3 !py-1 !text-[10px] !leading-4">
                        Ringkasan kasus bencana
                      </span>
                      <span className="home-case-label !min-h-7 !px-3 !py-1 !text-[10px] !leading-4">
                        Periode data: {getPeriodLabel(item)}
                      </span>
                      <span className="home-case-label home-case-label--document !min-h-7 !px-3 !py-1 !text-[10px] !leading-4">
                        {item.sourceDocuments.length
                          ? "Dokumen sumber tercatat"
                          : "Dokumen belum dicantumkan"}
                      </span>
                    </div>
                    <div className="home-case-card__body !gap-6 !p-6 max-md:!gap-4 max-md:!p-4">
                      <div className="home-case-card__content">
                        <h3 className="!text-2xl max-md:!text-xl">{item.title}</h3>
                        <p className="home-case-card__summary !mt-3 !text-sm !leading-6">{item.summary}</p>
                        <div className="home-fund-grid">
                          {fundCards.map(({ category, label }) => {
                            const record = item.fundRecords.find(
                              (fundRecord) => fundRecord.category === category,
                            );

                            return (
                              <div
                                className={`home-fund-card !rounded-lg !p-4 max-md:!p-3${category === "REALIZATION" ? " home-fund-card--realized" : ""}`}
                                key={category}
                              >
                                <span className="!min-h-0 !text-xs !leading-5">{label}</span>
                                <strong className="!mt-2 !text-sm !leading-6">{record ? formatRupiah(record.amount) : "Belum tersedia"}</strong>
                                <small className="!mt-1 !text-[11px] !leading-4">
                                  {record?.periodLabel ??
                                    record?.purpose ??
                                    "Tidak tercantum pada data yang tersedia"}
                                </small>
                              </div>
                            );
                          })}
                        </div>
                        <div className="home-case-card__footer !gap-4 !pt-5 max-md:!items-start max-md:!flex-col">
                          <span className="!text-[11px] !leading-5">
                            <span aria-hidden="true">◷</span>
                            Terakhir diperbarui: {formatDate(item.updatedAt)}
                          </span>
                          <MotionLink
                            className="home-button-primary home-button-primary--detail !min-h-11 !px-4 !text-xs max-md:!w-full"
                            href={`/kasus/${item.slug}`}
                            whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 24 }}
                          >
                            Lihat detail kasus lengkap <span aria-hidden="true">→</span>
                          </MotionLink>
                        </div>
                      </div>
                      <div className="home-case-card__media !min-h-[260px] max-md:!min-h-[210px]" aria-label="Dokumentasi visual belum tersedia">
                        <span className="!px-3 !py-2 !text-[11px] !leading-4">Dokumentasi visual belum tersedia</span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
                <div className="home-empty card !rounded-xl !p-8 !text-base" role="status">
                Tidak ada kasus terpublikasi untuk wilayah yang dipilih.
              </div>
            )}

            <div className="home-all-cases">
              <MotionLink
                className="home-button-outline !min-h-12 !px-6 !text-sm"
                href="/kasus"
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
              >
                Lihat semua kasus tanggap darurat <span aria-hidden="true">→</span>
              </MotionLink>
            </div>
          </section>

          <aside className="home-context !rounded-xl !p-5" data-scroll-reveal>
            <h2 className="!text-base">
              <span aria-hidden="true">ⓘ</span>
              Catatan konteks &amp; batasan data
            </h2>
            <p className="!mt-3 !text-sm !leading-6">
              Data yang disajikan berasal dari ringkasan informasi kasus dan
              dokumen rujukan yang tersedia. Angka dapat berubah mengikuti
              pembaruan publikasi instansi terkait. Alokasi, penyaluran,
              realisasi, dan rencana merupakan kategori yang berbeda dan tidak
              dijumlahkan satu sama lain.
            </p>
          </aside>

          <section className="home-definition !gap-4" aria-labelledby="definition-title" data-scroll-reveal>
            <div className="home-definition__heading">
              <h2 className="!text-xl" id="definition-title">
                <span aria-hidden="true">♢</span>
                Apa itu DSP (Dana Siap Pakai)?
              </h2>
              <Link className="!text-xs" href="/glosarium">Buka glosarium lengkap ↗</Link>
            </div>
            <div className="home-definition__grid">
              <article className="home-definition-card !min-h-[180px] !rounded-xl !p-5">
                <span className="home-definition-card__icon home-definition-card__icon--blue" aria-hidden="true">▤</span>
                <h3 className="!text-sm !leading-6">1. Anggaran Siap Pakai Negara</h3>
                <p className="!mt-2 !text-sm !leading-6">
                  Dana yang selalu tersedia pada anggaran BNPB untuk kebutuhan
                  penanganan darurat bencana.
                </p>
              </article>
              <article className="home-definition-card !min-h-[180px] !rounded-xl !p-5">
                <span className="home-definition-card__icon home-definition-card__icon--green" aria-hidden="true">♧</span>
                <h3 className="!text-sm !leading-6">2. Penyaluran Instansi Terkait</h3>
                <p className="!mt-2 !text-sm !leading-6">
                  Disalurkan langsung ke instansi atau pemerintah daerah
                  pelaksana tugas darurat, mencakup operasional dan kebutuhan
                  penanganan.
                </p>
              </article>
              <article className="home-definition-card !min-h-[180px] !rounded-xl !p-5">
                <span className="home-definition-card__icon home-definition-card__icon--mint" aria-hidden="true">♢</span>
                <h3 className="!text-sm !leading-6">3. Bukan Donasi Publik</h3>
                <p className="!mt-2 !text-sm !leading-6">
                  Bersumber dari APBN pos dana darurat, bukan donasi publik dan
                  bukan saluran penggalangan dana.
                </p>
              </article>
            </div>
          </section>
        </div>
      </main>
      <PublicFooter home />
    </>
  );
}
