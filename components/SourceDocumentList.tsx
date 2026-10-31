import { SourceDocument } from "@/types";

interface Props {
  sources: SourceDocument[];
}

export default function SourceDocumentList({ sources }: Props) {
  if (!sources || sources.length === 0) {
    return (
      <div className="text-xs text-zinc-500 italic py-2">
        Belum ada dokumen sumber resmi yang dilampirkan.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sources.map((doc) => (
        <div key={doc.id} className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <span className="font-semibold text-xs text-zinc-900 dark:text-white flex items-center gap-2">
              <svg className="h-4 w-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {doc.title}
            </span>
            {doc.url && (
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                Buka Dokumen
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Penerbit: <strong>{doc.publisher}</strong></span>
            {doc.publicationDate && <span>Tanggal: {doc.publicationDate}</span>}
            {doc.lastCheckedAt && <span>Diperiksa: {doc.lastCheckedAt}</span>}
          </div>
          {doc.verificationNote && (
            <div className="text-[11px] text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg mt-1">
              Catatan Verifikasi: {doc.verificationNote}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
