"use client";

import Link from "next/link";

interface AdminPageHeaderProps {
  title: string;
  onPrimaryAction: () => void;
  primaryLabel: string;
  primaryIcon?: string;
  onExport: () => void;
  exportLabel?: string;
  statusLabel?: string;
  showPublicPortal?: boolean;
}

export default function AdminPageHeader({
  title,
  onPrimaryAction,
  primaryLabel,
  primaryIcon = "+",
  onExport,
  exportLabel = "Ekspor Laporan",
  statusLabel = "DATA DEMO · LOKAL",
  showPublicPortal = true,
}: AdminPageHeaderProps) {
  return (
    <header className="sticky top-[34px] z-20 border-b border-[#D8E0E7] bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold tracking-wide text-[#718096]">
            <span>Admin Portal</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#087C67]">{title}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg leading-6 font-bold tracking-[-0.025em] text-[#202B40] sm:text-xl">
              {title}
            </h1>
            <span className="inline-flex min-h-7 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 text-[9px] font-semibold text-emerald-800">
              <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              {statusLabel}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {showPublicPortal && (
            <Link
              className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-[#D3DCE6] bg-white px-3 text-[11px] font-semibold text-[#46556A] no-underline shadow-sm transition hover:border-[#93A6B7] hover:bg-[#F9FBFC]"
              href="/"
              target="_blank"
            >
              <span aria-hidden="true">◉</span>
              Buka Portal Publik
            </Link>
          )}
          <button
            className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-[#D3DCE6] bg-white px-3 text-[11px] font-semibold text-[#46556A] shadow-sm transition hover:border-[#93A6B7] hover:bg-[#F9FBFC]"
            onClick={onExport}
            type="button"
          >
            <span aria-hidden="true">⇩</span>
            {exportLabel}
          </button>
          <button
            className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#006C62] px-3 text-[11px] font-bold text-white shadow-sm transition hover:-translate-y-px hover:bg-[#00564F]"
            onClick={onPrimaryAction}
            type="button"
          >
            <span className="text-base leading-none" aria-hidden="true">{primaryIcon}</span>
            {primaryLabel}
          </button>
        </div>
      </div>
    </header>
  );
}
