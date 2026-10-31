import Link from "next/link";
import DemoDataBanner from "@/components/DemoDataBanner";
import PublicFooter from "@/components/PublicFooter";

export default function GlossaryPage() {
  const terms = [
    {
      term: "Dana Siap Pakai (DSP)",
      definition: "Dana yang dicadangkan dan dapat digunakan segera untuk penanganan darurat pada saat terjadi bencana, termasuk tanggap darurat dan evakuasi awal."
    },
    {
      term: "Alokasi / Penetapan (Allocation)",
      definition: "Jumlah anggaran atau dana yang secara resmi ditetapkan melalui Surat Keputusan (SK) atau dokumen otoritas untuk dialokasikan pada suatu bencana tertentu."
    },
    {
      term: "Penyaluran (Distribution)",
      definition: "Tahap di mana dana atau logistik darurat telah ditransfer atau dikirimkan dari pusat ke posko daerah, BPBD, atau instansi pelaksana lapangan."
    },
    {
      term: "Realisasi (Realization)",
      definition: "Jumlah dana yang terbukti telah digunakan dan diserap untuk pengadaan barang/jasa darurat berdasarkan laporan pertanggungjawaban."
    },
    {
      term: "Rencana / Pengajuan (Plan)",
      definition: "Usulan anggaran lanjutan (seperti rencana rehabilitasi dan rekonstruksi) yang diajukan namun belum tentu berarti dana definitif telah cair."
    },
    {
      term: "Tanggap Darurat",
      definition: "Serangkaian kegiatan yang dilakukan dengan segera pada saat kejadian bencana untuk menangani dampak buruk yang ditimbulkan."
    },
    {
      term: "Sumber Resmi",
      definition: "Dokumen publik, SK Kepala BNPB, laporan instansi pemerintah, atau press release resmi yang dapat diverifikasi keasliannya."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <DemoDataBanner />

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/" className="hover:underline">Beranda</Link>
            <span>/</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-medium">Glosarium Istilah DSP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">Glosarium Istilah & Kategori Dana</h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Panduan definisi istilah teknis dan kategori keuangan dalam portal Jejak Bencana agar mudah dipahami oleh publik.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {terms.map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-2">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-xs font-bold">
                  {idx + 1}
                </span>
                {item.term}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 pl-8 leading-relaxed">
                {item.definition}
              </p>
            </div>
          ))}
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
