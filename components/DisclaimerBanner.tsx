export default function DisclaimerBanner() {
  return (
    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
      <svg className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div>
        <span className="font-semibold block mb-0.5">Catatan Penting Portal Informasi</span>
        Jejak Bencana adalah portal informasi publik, <strong>bukan platform donasi atau penggalangan dana</strong>. Kami tidak menerima donasi, pembayaran, atau transaksi finansial apa pun. Informasi disajikan berdasarkan dokumen resmi yang diverifikasi secara manual.
      </div>
    </div>
  );
}
