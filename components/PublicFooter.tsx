import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-footer__inner">
        <div className="public-footer__identity">
          <strong>Jejak Bencana</strong>
          <p>
            Portal informasi publik Dana Siap Pakai (DSP) kebencanaan. Bukan
            platform donasi atau pembayaran.
          </p>
        </div>
        <nav className="public-footer__links" aria-label="Tautan pendukung">
          <Link href="/">Beranda</Link>
          <Link href="/kasus">Daftar Kasus</Link>
          <Link href="/glosarium">Glosarium</Link>
          <Link href="/metodologi">Metodologi &amp; Batasan</Link>
        </nav>
      </div>
      <div className="public-footer__note">
        Data pada tampilan ini adalah contoh dan harus diverifikasi melalui
        dokumen resmi sebelum digunakan atau diterbitkan.
      </div>
    </footer>
  );
}
