# PRD — Jejak Bencana Frontend (FE)

**Versi:** 1.1
**Tanggal:** 29 Oktober 2026
**Fokus:** Implementasi frontend berdasarkan rancangan Stitch yang tersedia
**Status:** Spesifikasi implementasi FE MVP

---

## 1. Ringkasan

Jejak Bencana adalah portal informasi publik yang membantu masyarakat memahami informasi Dana Siap Pakai (DSP) dalam konteks bencana melalui bahasa yang mudah dipahami, konteks yang jelas, kategori informasi yang tegas, dan tautan sumber resmi.

Dokumen ini **khusus untuk implementasi Frontend (FE)**. Fokusnya adalah halaman, komponen, navigasi, interaksi UI, responsivitas, aksesibilitas, state tampilan, serta integrasi API dari sudut pandang frontend. Backend, desain database, autentikasi sisi server, migrasi, dan implementasi API tidak termasuk dalam ruang lingkup pekerjaan FE.

Frontend tidak boleh mengklaim bahwa data telah diverifikasi secara otomatis. Semua data contoh dari mockup harus ditandai sebagai demo dan tidak boleh disajikan sebagai fakta nyata.

## 2. Tujuan FE

1. Mengimplementasikan rancangan Stitch sebagai aplikasi frontend yang konsisten dan responsif.
2. Membantu pengguna memahami informasi DSP melalui hierarki visual, label kategori, konteks, dan sumber.
3. Menyediakan pengalaman membaca kasus bencana yang jelas di desktop dan mobile.
4. Menyediakan UI dashboard admin untuk mengelola tampilan kasus, sumber, catatan DSP, dan status draft/publikasi melalui API yang tersedia.
5. Menyediakan loading, error, empty, not-found, dan state sukses yang konsisten.
6. Menjaga struktur kode agar mudah dikembangkan tanpa menulis ulang keseluruhan proyek.

## 3. Prinsip Produk yang Wajib Dipertahankan

- Jejak Bencana adalah **portal informasi**, bukan platform donasi.
- Jangan menambahkan tombol donasi, pembayaran, checkout, atau ajakan transfer.
- Pisahkan kategori Alokasi/Penetapan, Penyaluran, Realisasi, dan Rencana/Pengajuan.
- Jangan menggabungkan angka dari kategori berbeda menjadi satu total tanpa dasar yang jelas.
- Jangan menampilkan angka, dokumen, tanggal, instansi, atau URL rekaan seolah-olah faktual.
- Data mockup/fixture harus diberi label `DATA DEMO` dan tidak boleh tercampur dengan data produksi.
- Tampilkan sumber dan catatan batasan data pada halaman terkait.
- Gunakan teks sebagai pembeda status; jangan mengandalkan warna saja.
- Jangan mengimplementasikan backend atau mengubah database dalam lingkup tugas FE.

## 4. Referensi Desain

Gunakan arsip Stitch yang tersedia di workspace sebagai sumber desain. Referensi yang diharapkan meliputi:

1. Beranda desktop.
2. Detail kasus desktop.
3. Beranda mobile.
4. Dashboard admin mobile.
5. Detail kasus mobile.
6. Dashboard admin desktop.
7. `DESIGN.md` untuk token desain dan aturan visual.

Sebelum implementasi, periksa struktur repositori dan lokasi aset desain. Jika file referensi tidak tersedia, lanjutkan dengan desain yang ada di PRD ini dan laporkan asumsi. Jangan menyalin HTML Stitch mentah tanpa adaptasi ke struktur komponen proyek.

## 5. Batasan Scope

### Termasuk dalam FE MVP

- Beranda publik.
- Daftar kasus bencana (dapat berupa bagian di beranda atau halaman tersendiri sesuai routing yang sudah ada).
- Halaman detail kasus.
- Bagian/glosarium istilah DSP.
- Halaman metodologi dan batasan informasi.
- Halaman login admin dari sisi UI.
- Dashboard admin.
- Daftar kasus di admin.
- Form buat/edit kasus.
- Form catatan DSP.
- Form dokumen sumber.
- UI simpan draft dan terbitkan.
- Konfirmasi sebelum publikasi.
- Validasi input sisi client untuk membantu pengguna.
- Integrasi dengan API yang sudah tersedia atau service layer yang disiapkan dengan kontrak yang terdokumentasi.
- Responsivitas, aksesibilitas, dan state UI.

### Tidak termasuk dalam FE MVP

- Membuat backend, API server, schema database, migrasi, atau mekanisme autentikasi server.
- Membuat akun admin atau menyimpan password sendiri.
- Menganggap proteksi route frontend sebagai keamanan backend.
- Sinkronisasi otomatis ke sumber pemerintah.
- Upload file ke cloud jika belum ada endpoint pendukung.
- Donasi, pembayaran, komentar publik, notifikasi push, GIS, dan analytics kompleks.
- Klaim audit atau verifikasi resmi otomatis.

## 6. Asumsi Teknologi

**Jangan mengasumsikan stack sebelum memeriksa repositori.**

- Pertahankan framework dan dependency yang sudah ada jika masih layak.
- Jika proyek memang menggunakan React + Vite + Tailwind CSS, lanjutkan dengan stack tersebut.
- Gunakan router yang sudah ada. Jangan memasang router kedua.
- Gunakan library ikon yang sudah tersedia. Jika belum ada, pilih satu library yang sesuai dan hindari campuran ikon tanpa konsistensi.
- Gunakan TypeScript jika proyek sudah menggunakannya; jangan mengonversi seluruh proyek dari JavaScript ke TypeScript tanpa kebutuhan dan persetujuan.
- Jangan memasang dependency baru jika fungsi yang sama sudah tersedia.
- Jangan mengubah konfigurasi build, deployment, atau environment yang tidak berkaitan dengan FE.

## 7. Arsitektur Halaman

Sesuaikan path dengan routing proyek yang ada. Struktur target:

### Halaman publik

- `/` — Beranda.
- `/kasus` — Daftar kasus, jika diperlukan sebagai halaman terpisah.
- `/kasus/:slug` — Detail kasus.
- `/glosarium` — Istilah dan definisi dasar.
- `/metodologi` — Penjelasan sumber, cara membaca kategori dana, dan batasan data.

### Halaman admin

- `/admin/login` — Form login.
- `/admin` — Ringkasan dashboard.
- `/admin/kasus` — Daftar kasus.
- `/admin/kasus/baru` — Form pembuatan kasus.
- `/admin/kasus/:id` — Form edit kasus.

**Catatan:** routing frontend tidak menggantikan autentikasi dan otorisasi backend. Gunakan status sesi/token sesuai kontrak API yang tersedia. Jika API belum tersedia, buat mock service terpisah dan beri label sebagai mode demo; jangan berpura-pura bahwa login atau publikasi benar-benar tersimpan di server.

## 8. Spesifikasi UI per Halaman

### 8.1 Beranda

Komponen dan konten:

- Header berisi identitas Jejak Bencana dan navigasi utama.
- Hero dengan headline yang menjelaskan tujuan portal.
- Deskripsi singkat yang tidak menjanjikan audit atau transparansi transaksi yang tidak tersedia.
- Disclaimer yang jelas: portal menyajikan informasi, bukan menerima donasi.
- Daftar/kartu kasus yang sudah dipublikasikan.
- Ringkasan informasi kasus: judul, wilayah, konteks singkat, tanggal jika tersedia, dan tautan detail.
- Bagian edukasi “Memahami DSP”.
- Penjelasan singkat perbedaan alokasi, penyaluran, realisasi, dan rencana/pengajuan.
- Tautan ke glosarium, metodologi, dan sumber resmi.
- Footer dengan identitas portal dan tautan pendukung.

Perilaku:

- Kartu kasus membuka halaman detail.
- Draft tidak boleh tampil pada data produksi.
- Saat belum ada data, tampilkan empty state yang menjelaskan bahwa belum ada kasus yang dipublikasikan.
- Jika memakai fixture, tampilkan banner `DATA DEMO — BUKAN DATA RESMI`.
- Tidak ada tombol donasi atau transaksi.

### 8.2 Daftar Kasus

Jika dibuat sebagai halaman tersendiri:

- Tampilkan judul dan penjelasan halaman.
- Tampilkan kartu/list kasus yang diterbitkan.
- Search/filter sederhana hanya jika bermanfaat dan dapat berfungsi dengan data yang tersedia.
- Filter yang dipilih harus terlihat dan dapat di-reset.
- Tampilkan jumlah hasil hanya jika berasal dari dataset aktual.
- Sediakan loading, error, dan empty state.

Jangan menambahkan pagination, filter kompleks, atau pencarian server sebelum ada kebutuhan nyata.

### 8.3 Detail Kasus

Tampilkan:

- breadcrumb kembali ke daftar/beranda;
- judul kasus dan wilayah;
- ringkasan situasi;
- tanggal kejadian/periode jika tersedia;
- waktu pembaruan informasi;
- ringkasan informasi DSP;
- daftar catatan dana dengan kategori dan nominal;
- tujuan penggunaan bila disebutkan sumber;
- sumber dokumen resmi yang mendukung informasi;
- catatan konteks, keterbatasan, dan informasi yang belum tersedia;
- tombol salin/bagikan tautan bila dapat diimplementasikan dengan API browser yang tersedia di aplikasi;
- footer.

Kategori informasi dana:

- `ALLOCATION` — Alokasi/Penetapan.
- `DISTRIBUTION` — Penyaluran.
- `REALIZATION` — Realisasi yang dilaporkan.
- `PLAN` — Rencana/Pengajuan.

Aturan tampilan:

- Selalu tampilkan label teks kategori, bukan warna saja.
- Untuk `PLAN`, tampilkan penjelasan bahwa rencana/pengajuan belum otomatis berarti dana telah ditetapkan atau disalurkan.
- Jangan membuat total gabungan dari kategori yang berbeda.
- Jika data tidak tersedia, tampilkan “Belum tersedia pada sumber yang dirujuk”.
- Format Rupiah dengan locale Indonesia.
- Setiap nominal harus memiliki konteks periode/tanggal dan sumber jika tersedia dalam data.
- Jangan menampilkan persentase serapan bila data pembilang dan penyebut tidak sebanding.

### 8.4 Glosarium

- Tampilkan daftar istilah dalam bahasa Indonesia yang mudah dipahami.
- Istilah minimal: DSP, alokasi/penetapan, penyaluran, realisasi, rencana/pengajuan, tanggap darurat, dan sumber resmi.
- Gunakan accordion hanya jika sesuai dengan desain referensi; pastikan keyboard-accessible.
- Definisi bukan pengganti peraturan resmi.
- Tampilkan sumber rujukan jika tersedia.

### 8.5 Metodologi

Jelaskan secara ringkas:

- informasi diambil dari dokumen/sumber yang dicantumkan;
- admin memasukkan dan memeriksa data secara manual;
- tanggal dokumen berbeda dari tanggal kejadian dan tanggal pemeriksaan;
- kategori dana tidak selalu dapat dibandingkan langsung;
- informasi yang tidak ditemukan tidak diisi dengan asumsi;
- portal bukan lembaga audit, bukan kanal donasi, dan bukan pengganti dokumen resmi.

### 8.6 Login Admin

UI:

- form username/email dan password mengikuti kontrak API;
- tombol tampil/sembunyikan password bila sesuai pola proyek;
- indikator loading saat submit;
- pesan error yang ringkas;
- validasi input kosong;
- tombol submit dinonaktifkan saat request berjalan.

Perilaku:

- gunakan service/auth flow yang sudah tersedia;
- jangan menyimpan password ke localStorage/sessionStorage;
- jangan mengarang flow token atau cookie jika backend belum ditentukan;
- jika API belum ada, mode demo harus dinyatakan jelas dan dipisahkan dari mode produksi.

### 8.7 Dashboard Admin

Tampilkan:

- header/sidebar atau navigasi yang sesuai desain Stitch;
- ringkasan jumlah draft dan published dari data aktual;
- daftar kasus: judul, wilayah, status, waktu update;
- tombol “Buat Kasus”;
- tindakan edit;
- link menuju tampilan publik jika kasus telah diterbitkan.

Dashboard harus memiliki:

- loading skeleton/indicator;
- error state dengan tombol coba lagi jika request dapat diulang;
- empty state untuk belum ada kasus;
- layout mobile dengan navigasi yang tetap mudah digunakan.

Jangan menampilkan angka dashboard statis yang terlihat seperti data nyata.

### 8.8 Form Kasus

Field UI:

- judul;
- slug (otomatis dari judul dengan opsi edit bila sesuai pola aplikasi);
- wilayah;
- ringkasan;
- tanggal/periode jika diketahui;
- catatan konteks;
- batasan informasi;
- status draft/published sesuai alur UI.

Perilaku:

- validasi field wajib;
- tampilkan error di dekat field yang bermasalah;
- pertahankan input pengguna saat validasi gagal;
- tampilkan indikator dirty state jika pengguna berpotensi meninggalkan perubahan;
- konfirmasi sebelum meninggalkan form jika ada perubahan belum disimpan, bila pola aplikasi mendukungnya.

### 8.9 Form Catatan DSP

Field UI:

- kategori;
- nominal Rupiah;
- tujuan penggunaan;
- tanggal/periode dokumen;
- catatan;
- sumber terkait.

Validasi client:

- kategori wajib;
- nominal harus valid dan tidak negatif;
- nilai kosong tidak boleh otomatis diubah menjadi nol;
- sumber wajib untuk catatan yang akan dipublikasikan;
- jangan menghitung total lintas kategori berbeda.

### 8.10 Form Dokumen Sumber

Field UI:

- judul dokumen;
- URL;
- instansi/penerbit;
- tanggal publikasi jika diketahui;
- tanggal terakhir diperiksa;
- catatan pemeriksaan manual.

Perilaku:

- validasi format URL;
- utamakan `https`;
- tampilkan link preview/buka sumber dengan aman;
- jangan menyatakan bahwa URL telah diverifikasi otomatis hanya karena lolos validasi format;
- ingatkan admin untuk memeriksa apakah dokumen benar-benar mendukung klaim terkait.

### 8.11 Draft dan Publikasi

- Sediakan tombol “Simpan Draft”.
- Sediakan tombol “Terbitkan” hanya pada alur yang sesuai.
- Tampilkan dialog konfirmasi sebelum publikasi.
- Tampilkan ringkasan masalah jika data belum layak diterbitkan.
- Tampilkan status request: loading, berhasil, atau gagal.
- Jangan menampilkan toast sukses sebelum server mengonfirmasi keberhasilan.
- Setelah sukses, refresh data atau navigasikan sesuai pola aplikasi.
- Jika API belum tersedia, jangan menyimulasikan persistensi tanpa label demo yang jelas.

## 9. Design System

Utamakan `DESIGN.md` dan screenshot Stitch. Jika nilai desain tidak dapat diambil dari referensi, gunakan baseline berikut.

### Warna

- Canvas: `#F8FAFC`
- Surface/card: `#FFFFFF`
- Primary teal: `#0F766E`
- Primary hover: `#115E59`
- Text utama: `#0F172A`
- Text sekunder: `#334155`
- Text muted: `#64748B`
- Border: `#E2E8F0`
- Warning background: `#FEF3C7`
- Warning text: `#92400E`
- Demo background: `#FFF1F2`
- Demo text: `#9F1239`
- Demo border: `#FECDD3`

### Tipografi dan layout

- Gunakan font dari desain jika tersedia; jika tidak, Inter atau sans-serif sistem.
- Gunakan skala heading konsisten dan paragraf dengan line-height yang nyaman.
- Desktop: konten terpusat, maksimum sekitar 1280px.
- Tablet: grid menyesuaikan ruang.
- Mobile: satu kolom untuk konten utama dan padding sekitar 16px.
- Gunakan spacing, radius, border, shadow, dan ikon secara konsisten.
- Hindari efek visual berlebihan yang mengurangi kepercayaan atau keterbacaan informasi.

### Komponen reusable yang disarankan

Sesuaikan penamaan dengan pola repo:

- `PublicHeader`
- `PublicFooter`
- `AdminLayout`
- `CaseCard`
- `FundCategoryBadge`
- `SourceDocumentList`
- `DisclaimerBanner`
- `DemoDataBanner`
- `EmptyState`
- `ErrorState`
- `LoadingState`
- `FormField`
- `ConfirmPublishDialog`
- `StatusBadge`

Jangan membuat komponen terpisah untuk setiap elemen kecil jika tidak meningkatkan keterawatan.

## 10. Struktur Data Frontend (Konseptual)

Sesuaikan nama properti dengan kontrak API yang sebenarnya.

### Case

- `id`
- `title`
- `slug`
- `affectedArea`
- `summary`
- `incidentDate?`
- `periodStart?`
- `periodEnd?`
- `contextNote?`
- `scopeLimitations?`
- `status: "DRAFT" | "PUBLISHED"`
- `publishedAt?`
- `updatedAt`

### FundRecord

- `id`
- `caseId`
- `category: "ALLOCATION" | "DISTRIBUTION" | "REALIZATION" | "PLAN"`
- `amount`
- `currency: "IDR"`
- `purpose?`
- `documentDate?`
- `periodLabel?`
- `notes?`
- `sources`

### SourceDocument

- `id`
- `title`
- `url`
- `publisher`
- `publicationDate?`
- `lastCheckedAt?`
- `verificationNote?`

Jangan menganggap bentuk data ini sebagai kontrak backend final. Buat adapter/mapper pada service layer jika bentuk API berbeda, bukan menyebarkan transformasi di seluruh komponen.

## 11. Integrasi API dari Sisi FE

1. Audit service/API client yang sudah ada.
2. Gunakan satu lapisan service untuk request data, bukan `fetch` yang tersebar di setiap komponen.
3. Ambil base URL dari environment variable sesuai framework yang dipakai.
4. Jangan menyimpan secret server di environment variable yang diekspos ke browser.
5. Tangani status HTTP, error jaringan, respons kosong, dan data yang tidak sesuai schema.
6. Jangan hardcode URL backend di komponen UI.
7. Jangan menebak endpoint. Jika kontrak API belum tersedia, dokumentasikan endpoint yang diperlukan dan gunakan mock service terpisah.
8. Mock service harus dapat diganti dengan API nyata tanpa menulis ulang komponen.
9. Jangan menganggap route guard FE sebagai pengganti otorisasi backend.
10. Untuk aksi mutasi, tampilkan keberhasilan hanya setelah respons API menyatakan sukses.

## 12. State UI Wajib

Halaman yang mengambil data harus menangani state yang relevan:

- `loading`: data sedang dimuat;
- `success`: data berhasil ditampilkan;
- `empty`: request sukses tetapi belum ada data;
- `error`: request gagal;
- `not-found`: entitas tidak ditemukan;
- `unauthorized`: pengguna perlu login atau sesi tidak berlaku, sesuai kontrak API;
- `submitting`: form sedang dikirim;
- `validation-error`: data belum memenuhi persyaratan.

Gunakan state dan komponen bersama bila pola proyek mendukungnya. Hindari halaman kosong atau error mentah yang membingungkan pengguna.

## 13. Aksesibilitas dan Responsivitas

- Semua input memiliki label yang dapat diakses.
- Tombol memiliki nama aksi yang jelas.
- Fokus keyboard terlihat.
- Modal/dialog mendukung keyboard dan fokus yang sesuai.
- Kontras teks memadai, target WCAG AA.
- Status kategori ditampilkan sebagai teks, bukan warna saja.
- Link eksternal yang dibuka di tab baru menggunakan `rel="noopener noreferrer"`.
- Elemen interaktif memiliki ukuran sentuh yang memadai pada mobile.
- Tabel atau daftar nominal dapat dibaca di layar kecil.
- Hindari layout overflow horizontal.
- Uji setidaknya pada viewport sekitar 360px, 768px, 1024px, dan 1440px.

## 14. Penanganan Data Demo

- Semua data fixture harus berada di file/module terpisah dari komponen UI.
- Tambahkan flag atau konfigurasi yang jelas untuk mode demo.
- Tampilkan `DATA DEMO — BUKAN DATA RESMI` pada UI demo.
- Jangan mencampur data demo dengan respons API produksi.
- Jangan menggunakan nominal atau sumber dari mockup sebagai fakta tanpa pemeriksaan manual.
- Jangan biarkan demo mode aktif secara tidak sengaja pada deployment produksi.
- Jika API belum tersedia, UI dapat dikembangkan memakai fixture tetapi harus melaporkan bahwa integrasi backend belum selesai.

## 15. Tahapan Implementasi

### Tahap 0 — Audit Repo

- Periksa framework, struktur folder, routing, styling, komponen, dependency, aset, service/API, dan test.
- Temukan screenshot Stitch dan `DESIGN.md`.
- Laporkan temuan dan rencana perubahan sebelum melakukan refactor besar.

**Kriteria selesai:** stack diketahui, komponen yang bisa digunakan ulang teridentifikasi, dan rencana implementasi disetujui/ditampilkan.

### Tahap 1 — Design System dan Layout

- Implementasikan token warna, tipografi, spacing, container, tombol, badge, card, alert, dan state bersama.
- Buat header/footer publik dan layout admin.
- Validasi responsivitas awal.

**Kriteria selesai:** komponen dasar konsisten dan build berjalan.

### Tahap 2 — Halaman Publik

- Implementasikan beranda.
- Implementasikan daftar kasus.
- Implementasikan detail kasus.
- Implementasikan glosarium dan metodologi.
- Tambahkan empty/loading/error/not-found state.
- Pastikan kategori DSP dan sumber ditampilkan benar.

**Kriteria selesai:** seluruh halaman publik dapat dinavigasi dengan data fixture yang ditandai sebagai demo atau data API yang tersedia.

### Tahap 3 — UI Admin

- Implementasikan login UI mengikuti kontrak autentikasi yang tersedia.
- Implementasikan dashboard dan daftar kasus.
- Implementasikan form kasus, catatan DSP, dan sumber.
- Implementasikan simpan draft dan konfirmasi publikasi.
- Gunakan mock service bila API belum tersedia, dengan penanda demo yang jelas.

**Kriteria selesai:** alur UI dapat diuji; jangan mengklaim penyimpanan server berfungsi tanpa API nyata.

### Tahap 4 — Integrasi API

- Hubungkan service layer dengan endpoint yang benar-benar tersedia.
- Implementasikan loading/error/success untuk setiap request.
- Cocokkan DTO frontend dengan respons API.
- Jangan mengubah backend dalam tugas FE ini; laporkan kebutuhan endpoint jika belum tersedia.

**Kriteria selesai:** fitur FE yang didukung API dapat berjalan tanpa mock pada environment integrasi.

### Tahap 5 — QA dan Build

- Uji navigasi seluruh halaman.
- Uji semua state UI.
- Uji validasi form.
- Uji responsive layout di viewport target.
- Uji akses UI tanpa sesi; ingat route guard hanya untuk UX, bukan keamanan server.
- Jalankan lint, type-check, test, dan build yang tersedia.
- Perbaiki error yang ditemukan.

**Kriteria selesai:** hasil tes dan build dilaporkan secara faktual.

### Tahap 6 — Dokumentasi

- Perbarui README untuk setup FE dan environment variable.
- Dokumentasikan mode demo dan cara menonaktifkannya.
- Catat endpoint yang digunakan dan endpoint yang masih dibutuhkan.
- Catat fitur yang belum terintegrasi.

## 16. Acceptance Criteria

### Beranda

- [ ] Tampilan sesuai arah visual Stitch dan responsif.
- [ ] Tujuan portal mudah dipahami.
- [ ] Disclaimer non-donasi terlihat.
- [ ] Kartu kasus menuju detail yang benar.
- [ ] Draft tidak ditampilkan oleh API publik.
- [ ] Empty/error/loading state tersedia.
- [ ] Data fixture memiliki banner demo yang jelas.

### Detail Kasus

- [ ] Konteks kasus dan informasi DSP tersusun dengan jelas.
- [ ] Kategori setiap nominal ditampilkan sebagai teks.
- [ ] `PLAN` dibedakan dari alokasi, penyaluran, dan realisasi.
- [ ] Sumber dapat dibuka dengan aman.
- [ ] Batasan data dan nilai yang tidak tersedia dijelaskan.
- [ ] Tampilan tidak overflow pada mobile.

### Admin

- [ ] Form login mengikuti kontrak API.
- [ ] Dashboard menggunakan data aktual atau banner demo yang jelas.
- [ ] Form memiliki validasi dan pesan error dekat field.
- [ ] Tombol simpan/publikasi menunjukkan loading.
- [ ] Dialog konfirmasi muncul sebelum publikasi.
- [ ] Pesan sukses hanya muncul setelah respons sukses.
- [ ] Draft tidak terlihat pada daftar publik.
- [ ] Jika API belum ada, status mock dijelaskan dan tidak diklaim sebagai persistensi nyata.

### Kualitas

- [ ] Komponen reusable mengikuti pola repo.
- [ ] Tidak ada dependency duplikat yang tidak perlu.
- [ ] Tidak ada secret dalam bundle frontend.
- [ ] Aksesibilitas dasar dan keyboard navigation diperhatikan.
- [ ] Lint/type-check/test/build yang tersedia telah dijalankan atau keterbatasannya dilaporkan.

## 17. Prompt Kerja untuk AI di VS Code

Gunakan instruksi ini bersama dokumen PRD:

> Implementasikan hanya bagian Frontend (FE) Jejak Bencana sesuai `PRD_Jejak_Bencana_FE.md` dan referensi Stitch di workspace.
>
> Langkah pertama adalah audit repositori. Identifikasi framework, routing, styling, komponen, aset, API client, dan pola autentikasi yang telah ada. Pertahankan stack dan pola kode yang layak. Jangan membuat backend, schema database, migrasi, atau server API. Jangan mengubah backend; jika endpoint belum tersedia, dokumentasikan kebutuhan endpoint dan gunakan mock service yang terpisah serta jelas berstatus demo.
>
> Implementasikan bertahap: (1) design system/layout, (2) halaman publik, (3) UI admin, (4) integrasi API yang tersedia, (5) QA dan build, (6) dokumentasi.
>
> Gunakan screenshot Stitch dan `DESIGN.md` sebagai referensi visual, tetapi adaptasikan ke komponen dan struktur repo. Jangan menyalin HTML mentah secara langsung.
>
> Jangan menambahkan donasi, pembayaran, integrasi otomatis pemerintah, atau fitur di luar scope. Jangan mengarang data faktual. Data demo harus diberi banner `DATA DEMO — BUKAN DATA RESMI`. Kategori DSP harus konsisten dan tidak boleh digabungkan ke total yang menyesatkan.
>
> Pastikan semua halaman responsif, form memiliki validasi, dan semua request memiliki loading/error/success state yang sesuai. Jangan menampilkan keberhasilan sebelum API mengonfirmasi sukses. Jangan menganggap route guard FE sebagai pengamanan server.
>
> Setelah setiap tahap, laporkan file yang berubah, keputusan teknis, tes yang benar-benar dijalankan, hasilnya, dan pekerjaan yang masih tertunda. Jangan melakukan rewrite besar tanpa alasan yang jelas.

## 18. Definition of Done

FE MVP dianggap selesai apabila:

- seluruh halaman publik dan UI admin yang disepakati tersedia;
- navigasi berjalan;
- desain konsisten dengan referensi Stitch;
- responsivitas dan aksesibilitas dasar diuji;
- kategori DSP dan sumber ditampilkan secara akurat;
- state loading, error, empty, dan not-found tersedia pada tempat yang relevan;
- form memiliki validasi client-side;
- integrasi memakai API nyata jika tersedia, atau mock yang secara eksplisit ditandai;
- tidak ada fitur donasi/pembayaran;
- tidak ada klaim bahwa fungsi backend telah selesai jika belum tersedia;
- lint/type-check/test/build yang tersedia telah dijalankan dan hasilnya dilaporkan;
- dokumentasi FE diperbarui.

---

**Prinsip utama:** Bangun frontend yang jelas, responsif, mudah dipelihara, dan jujur terhadap status data. Prioritaskan pengalaman membaca informasi dan keterlacakan sumber sebelum menambahkan fitur lanjutan.
