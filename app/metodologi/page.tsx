import Link from "next/link";
import DemoDataBanner from "@/components/DemoDataBanner";
import PublicFooter from "@/components/PublicFooter";

export default function MethodologyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DemoDataBanner />

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/" className="hover:underline">Beranda</Link>
            <span>/</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-medium">Metodologi & Batasan Informasi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">Metodologi & Batasan Informasi</h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Transparansi mengenai bagaimana data dikumpulkan, diverifikasi secara manual, serta batasan-batasan dalam portal Jejak Bencana.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-6 shadow-sm text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">1. Pengumpulan Data Berbasis Dokumen Resmi</h2>
            <p>
              Seluruh informasi angka dan alokasi dana di portal ini diambil langsung dari dokumen publik resmi (seperti SK Kepala BNPB, laporan pertanggungjawaban BPBD, dan press release instansi berwenang) yang dicantumkan pada bagian sumber setiap kasus.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">2. Verifikasi Manual</h2>
            <p>
              Admin memasukkan dan memeriksa data secara manual. Tanggal penerbitan dokumen sering kali berbeda dengan tanggal kejadian bencana maupun tanggal pemeriksaan di portal. Portal ini tidak melakukan sinkronisasi otomatis ke sistem pemerintah.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">3. Prinsip Pemisahan Kategori Dana</h2>
            <p>
              Kami tidak menggabungkan angka dari kategori berbeda (Alokasi, Penyaluran, Realisasi, dan Rencana) menjadi satu total angka tunggal untuk menghindari kesalahpahaman publik mengenai status penyerapan anggaran.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">4. Batasan & Sanggahan (Disclaimer)</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-600 dark:text-zinc-400">
              <li>Jejak Bencana adalah portal informasi publik, bukan lembaga audit negara.</li>
              <li>Jejak Bencana <strong>bukan platform donasi</strong> dan tidak pernah menerima transaksi finansial apa pun.</li>
              <li>Informasi yang belum tersedia pada dokumen rujukan tidak diisi dengan asumsi atau estimasi rekaan.</li>
            </ul>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
