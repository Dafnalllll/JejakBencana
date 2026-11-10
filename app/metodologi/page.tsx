import Link from "next/link";
import DemoDataBanner from "@/components/DemoDataBanner";
import PublicFooter from "@/components/PublicFooter";

const methodology = [
  {
    title: "Pengumpulan data berbasis dokumen resmi",
    description:
      "Informasi angka dan alokasi dana di portal ini diambil dari dokumen publik resmi, seperti SK Kepala BNPB, laporan pertanggungjawaban BPBD, dan siaran pers instansi berwenang. Dokumen rujukan dicantumkan pada bagian sumber setiap kasus.",
  },
  {
    title: "Verifikasi manual",
    description:
      "Admin memasukkan dan memeriksa data secara manual. Tanggal penerbitan dokumen dapat berbeda dari tanggal kejadian bencana maupun tanggal pemeriksaan di portal. Portal ini tidak melakukan sinkronisasi otomatis ke sistem pemerintah.",
  },
  {
    title: "Pemisahan kategori dana",
    description:
      "Angka dari kategori Alokasi, Penyaluran, Realisasi, dan Rencana tidak digabungkan menjadi satu total. Setiap kategori menunjukkan tahap berbeda dan perlu dibaca sesuai dokumen sumbernya.",
  },
];

const limitations = [
  "Jejak Bencana adalah portal informasi publik, bukan lembaga audit negara.",
  "Jejak Bencana bukan platform donasi dan tidak menerima transaksi finansial.",
  "Informasi yang tidak tersedia pada dokumen rujukan tidak diisi dengan asumsi atau estimasi.",
];

export default function MethodologyPage() {
  return (
    <>
      <DemoDataBanner />
      <main className="page-container methodology-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Beranda</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Metodologi</span>
        </nav>

        <header className="methodology-heading">
          <span className="section-kicker">Cara membaca data</span>
          <h1 className="section-title">Metodologi &amp; Batasan Informasi</h1>
          <p className="section-description">
            Penjelasan tentang sumber data, proses pemeriksaan, dan ruang lingkup
            informasi yang disajikan Jejak Bencana.
          </p>
        </header>

        <section className="methodology-list" aria-label="Metodologi pengelolaan data">
          {methodology.map((item, index) => (
            <article className="card methodology-card" key={item.title}>
              <span className="methodology-card__number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </section>

        <aside className="glossary-note methodology-limitations" aria-labelledby="methodology-limitations-title">
          <span className="glossary-note__icon" aria-hidden="true">i</span>
          <div className="methodology-limitations__content">
            <h2 id="methodology-limitations-title">Batasan dan sanggahan</h2>
            <ul>
              {limitations.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </aside>

        <p className="methodology-related">
          Istilah yang digunakan dijelaskan di{" "}
          <Link className="text-link" href="/glosarium">glosarium Dana Siap Pakai</Link>.
        </p>
      </main>
      <PublicFooter />
    </>
  );
}
