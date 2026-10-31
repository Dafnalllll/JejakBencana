"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { DisasterCase } from "@/types";
import { getPublishedCases } from "@/lib/mockService";
import DemoDataBanner from "@/components/DemoDataBanner";
import PublicFooter from "@/components/PublicFooter";

const MotionLink = motion.create(Link);

export default function CasesPage() {
  const shouldReduceMotion = useReducedMotion();
  const [cases, setCases] = useState<DisasterCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getPublishedCases().then((data) => {
      setCases(data);
      setLoading(false);
    });
  }, []);

  const filteredCases = cases.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.affectedArea.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <DemoDataBanner />

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1">
        {/* Breadcrumb & Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/" className="hover:underline">Beranda</Link>
            <span>/</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-medium">Daftar Kasus Bencana</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">Daftar Kasus Bencana & Alokasi Dana</h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Pilih kasus bencana untuk melihat rincian alokasi, penyaluran, realisasi dana darurat, serta tautan dokumen sumber resmi.
          </p>
        </div>

        {/* Search Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama kasus atau wilayah..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-medium text-emerald-600 hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Cases List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 4].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Tidak ada kasus yang ditemukan.</p>
            <p className="text-xs text-zinc-500">Coba gunakan kata kunci pencarian yang lain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCases.map((item) => (
              <MotionLink
                key={item.id}
                href={`/kasus/${item.slug}`}
                className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                      {item.affectedArea}
                    </span>
                    {item.incidentDate && (
                      <span className="text-[11px] text-zinc-400">Kejadian: {item.incidentDate}</span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-emerald-600">
                  <span>Lihat Rincian Dana & Sumber</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </MotionLink>
            ))}
          </div>
        )}
      </div>

      <PublicFooter />
    </div>
  );
}
