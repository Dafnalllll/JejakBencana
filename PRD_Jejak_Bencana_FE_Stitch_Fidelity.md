

PRD FE — Jejak Bencana

## Replikasi Desain Google Stitch secara Setia

**Versi:** 2.0
**Tanggal:** 29 Oktober 2026
**Jenis pekerjaan:** Frontend implementation / visual reproduction
**Referensi utama:** Google Stitch project — https://stitch.withgoogle.com/projects/1502152474818333960
**Ekspor desain:** `stitch_remix_of_jejak_bencana_ui_design/`
**Design system:** `jejak_bencana/DESIGN.md`

---

## 1. Instruksi Utama

Bangun frontend Jejak Bencana dengan **mereplikasi desain Stitch yang diberikan sedekat mungkin secara visual**, bukan membuat desain baru yang hanya terinspirasi darinya.

Screenshot dan file `code.html` hasil ekspor Stitch adalah acuan utama untuk:

- komposisi dan urutan section;
- posisi dan ukuran elemen;
- lebar konten dan kolom;
- jarak/padding/margin;
- warna;
- tipografi;
- bentuk kartu, badge, tombol, border, dan shadow;
- navigasi;
- perilaku layout pada desktop dan mobile;
- teks, label, serta hierarki informasi.

`DESIGN.md` adalah acuan token desain. Jika ada perbedaan antara deskripsi generik di dokumen ini dan tampilan screenshot/HTML Stitch, **ikuti screenshot dan HTML Stitch untuk susunan visual**, serta gunakan `DESIGN.md` untuk token warna, tipografi, spacing, radius, dan komponen.

**Jangan membuat redesign, jangan menyederhanakan layout, jangan mengganti komposisi, dan jangan menambah section baru atas inisiatif sendiri.** Jangan mengganti halaman dengan template dashboard atau landing page generik.

## 2. Hasil yang Harus Dibangun

Replikasi enam layar berikut dari ekspor Stitch:

1. `beranda_jejak_bencana_desktop`
2. `detail_kasus_jejak_bencana_desktop`
3. `beranda_jejak_bencana_mobile`
4. `dashboard_admin_jejak_bencana_mobile`
5. `detail_kasus_jejak_bencana_mobile`
6. `dashboard_admin_jejak_bencana_desktop`

Setiap layar memiliki file `code.html`; gunakan screenshot `screen.png` sebagai pembanding visual. File screenshot beranda mobile pada ekspor mungkin tidak valid/tidak lengkap; dalam kasus tersebut gunakan `code.html` mobile, lalu cocokkan dengan struktur layar desktop dan design system tanpa mengarang desain baru.

### Batasan penting

- Jangan menambahkan halaman glosarium, metodologi, login, detail tambahan, atau halaman lain sebagai halaman desain baru apabila tidak ada pada enam layar referensi. Tautan yang tampil pada mockup tetap dapat menjadi tautan navigasi/placeholder sesuai kemampuan aplikasi.
- Jangan mengubah label, judul, atau urutan konten yang tampak pada referensi tanpa alasan fungsional yang diperlukan.
- Jangan mengarang data baru. Konten contoh Stitch harus tetap ditandai sebagai data contoh/demo.
- Jangan mengganti seluruh tampilan dengan komponen generik yang menghilangkan ciri khas desain Stitch.

## 3. Tujuan Produk dan Konteks

Jejak Bencana adalah portal informasi tentang Dana Siap Pakai (DSP) yang membantu masyarakat memahami informasi dana kebencanaan dengan konteks yang jelas dan rujukan resmi.

Portal ini **bukan platform donasi atau pembayaran**. UI harus mempertahankan penekanan desain pada:

- informasi berbasis rujukan;
- pembedaan kategori dana;
- konteks dan batasan informasi;
- sumber dokumen resmi;
- label data contoh agar tidak dianggap fakta.

Jangan menambahkan fitur donasi, checkout, transfer, pembayaran, atau ajakan penggalangan dana.

## 4. Urutan Kerja Wajib: Audit sebelum Coding

Sebelum mengubah kode:

1. Audit repositori aktif: framework, struktur direktori, router, styling, komponen, aset, package/dependency, dan cara menjalankan proyek.
2. Cari semua file ekspor Stitch: keenam `code.html`, screenshot, dan `DESIGN.md`.
3. Identifikasi apakah proyek sudah memiliki halaman/komponen yang perlu dipertahankan.
4. Catat pemetaan setiap layar Stitch ke halaman/route dan komponen FE yang akan dibuat.
5. Jalankan aplikasi saat ini dan ambil screenshot baseline bila memungkinkan.
6. Buat rencana implementasi singkat sebelum refactor besar.

Jangan menginisialisasi proyek baru jika repositori yang sudah ada dapat digunakan. Jangan mengganti framework atau menambahkan dependency besar sebelum memeriksa stack saat ini.

## 5. Referensi Desain dan Prioritas Fidelity

Urutan sumber kebenaran visual:

1. Screenshot layar Stitch untuk komposisi dan tampilan akhir.
2. HTML/CSS ekspor Stitch untuk struktur, teks, ukuran, dan detail styling.
3. `DESIGN.md` untuk token dan aturan desain.
4. PRD ini untuk perilaku frontend dan aturan produk.

**Target visual:** hasil akhir harus menyerupai desain acuan pada viewport yang sama. Jangan menyatakan “sesuai desain” hanya karena warna dan tema umumnya mirip.

### Larangan visual

- Jangan mengganti teal, warna latar, atau warna semantic badge dengan palet lain.
- Jangan menggunakan gradient, glassmorphism, blur, ilustrasi, atau animasi dekoratif yang tidak ada di referensi.
- Jangan mengubah layout desktop menjadi tumpukan satu kolom jika referensi menampilkan beberapa kolom.
- Jangan mengubah card menjadi tabel atau tabel menjadi card tanpa mengikuti versi layar yang dirancang.
- Jangan menambah sidebar/navbar baru di layar yang tidak memilikinya.
- Jangan menghapus disclaimer, label, metadata, sumber, atau catatan batasan.
- Jangan mengubah teks menjadi placeholder generik seperti “Lorem ipsum” atau “Sample data”.
- Jangan mengandalkan asumsi visual dari nama halaman; buka file referensinya.

## 6. Design System — Gunakan Token Stitch

File `jejak_bencana/DESIGN.md` harus dibaca dan dijadikan sumber token. Jangan mengganti token dengan palet lain yang dianggap lebih modern.

### 6.1 Warna utama dari `DESIGN.md`

| Token                        | Nilai       |
| ---------------------------- | ----------- |
| `surface` / background     | `#FAF8FF` |
| `surface-container-lowest` | `#FFFFFF` |
| `surface-container-low`    | `#F2F3FF` |
| `surface-container`        | `#EAEDFF` |
| `surface-container-high`   | `#E2E7FF` |
| `on-surface`               | `#131B2E` |
| `on-surface-variant`       | `#3E4947` |
| `outline`                  | `#6E7977` |
| `outline-variant`          | `#BDC9C6` |
| `primary`                  | `#005C55` |
| `primary-container`        | `#0F766E` |
| `on-primary`               | `#FFFFFF` |
| `on-primary-container`     | `#A3FAEF` |
| `secondary`                | `#904D00` |
| `secondary-container`      | `#FE932C` |
| `tertiary`                 | `#005683` |
| `tertiary-container`       | `#006FA8` |
| `error`                    | `#BA1A1A` |
| `error-container`          | `#FFDAD6` |

HTML ekspor mungkin memuat variasi token Material-style dan utility colors. Pertahankan nilai yang benar-benar digunakan oleh layar referensi; jangan menerapkan satu warna secara global jika komponen aslinya memakai token yang berbeda.

### 6.2 Tipografi

Font utama: **Inter**.

| Token                  | Ukuran | Weight | Line-height |
| ---------------------- | -----: | -----: | ----------: |
| `headline-xl`        |   36px |    700 |        44px |
| `headline-xl-mobile` |   28px |    700 |        36px |
| `headline-lg`        |   28px |    600 |        36px |
| `headline-lg-mobile` |   24px |    600 |        32px |
| `headline-md`        |   20px |    600 |        28px |
| `headline-sm`        |   18px |    600 |        24px |
| `body-lg`            |   18px |    400 |        28px |
| `body-md`            |   16px |    400 |        24px |
| `body-sm`            |   14px |    400 |        20px |
| `label-lg`           |   14px |    600 |        20px |
| `label-md`           |   12px |    600 |        16px |
| `label-sm`           |   11px |    700 |        14px |

Gunakan nilai spesifik yang tampak pada HTML ekspor jika terdapat variasi per komponen. Untuk nominal dan angka, gunakan angka tabular jika memungkinkan.

### 6.3 Spacing dan layout

- Desktop ≥ 1280px: grid 12 kolom, max canvas 1280px, gutter 24px, margin 32px.
- Tablet 768–1279px: grid 8 kolom, gutter 16px, margin 24px.
- Mobile < 768px: grid 4 kolom, gutter 16px, margin 16px.
- Gunakan ritme spacing berbasis kelipatan 8px sesuai `DESIGN.md`.
- Jangan menerapkan nilai max-width atau padding yang sama ke semua halaman jika HTML referensi berbeda.

### 6.4 Radius, border, dan elevation

- Radius umum: 8px.
- Radius kartu/kontainer utama: 16px.
- Badge status: pill/full radius.
- Kartu: border 1px yang halus dan shadow sangat ringan.
- Hindari shadow besar, glow, blur, dan elevasi dekoratif yang tidak ada pada referensi.
- Input: tinggi dasar sekitar 44px, tetapi sesuaikan dengan ukuran pada HTML ekspor.

### 6.5 Warna badge kategori dana

| Kategori             | Background  | Text        | Border      |
| -------------------- | ----------- | ----------- | ----------- |
| Alokasi/Penetapan    | `#E0F2FE` | `#0369A1` | `#BAE6FD` |
| Penyaluran           | `#EEF2FF` | `#4338CA` | `#C7D2FE` |
| Realisasi dilaporkan | `#ECFDF5` | `#047857` | `#A7F3D0` |
| Rencana/Pengajuan    | `#F1F5F9` | `#475569` | `#CBD5E1` |

Label harus berupa teks yang terlihat, bukan warna saja.

### 6.6 Banner data contoh

Label yang digunakan oleh referensi:

- `DATA CONTOH — JANGAN DITERBITKAN`
- `DEMO` bila tampil pada layar yang relevan.

Warna:

- background `#FFF1F2`;
- text `#9F1239`;
- border `#FECDD3`.

Posisi, ukuran, dan bentuk banner mengikuti screenshot/HTML layar masing-masing. Jangan membuat banner baru dengan posisi fixed apabila layar referensi tidak menggunakannya.

## 7. Spesifikasi Tiap Layar

Bagian ini mendefinisikan konten dan perilaku yang harus dipertahankan. Untuk ukuran, komposisi, urutan visual, dan jarak yang persis, ikuti file `code.html` dan screenshot masing-masing.

### 7.1 Beranda — Desktop

Sumber: `beranda_jejak_bencana_desktop/code.html` dan `screen.png`.

Pertahankan:

- header desktop dengan identitas/logo Jejak Bencana;
- navigasi `Beranda`, `Detail Kasus`, `Glosarium`;
- tautan `SISTALA-DSP BNPB`;
- akses `Portal Admin`;
- hero dengan judul: **“Memahami Dana Siap Pakai dari sumber resmi, dengan bahasa yang lebih sederhana.”**
- deskripsi platform berbasis rujukan resmi;
- disclaimer bahwa portal bukan penggalangan dana atau saluran pembayaran;
- konten utama kasus **“Penanganan Banjir & Longsor Pesisir Barat (Konteks Tanggap Darurat)”**;
- informasi konteks darurat, dokumen penetapan, dan operasional posko/logistik sesuai ekspor;
- tombol/tautan `Lihat detail kasus lengkap`;
- bagian catatan konteks dan batasan data;
- bagian **“Apa itu DSP (Dana Siap Pakai)?”**;
- tiga penjelasan: anggaran siap pakai negara, penyaluran instansi terkait, dan bukan donasi publik;
- tautan glosarium dan tautan footer sesuai referensi;
- catatan metodologi dan footer.

Jangan mengubah hero, kartu kasus, atau bagian edukasi menjadi layout baru. Pertahankan urutan, rasio kolom, alignment, dan jarak sesuai screenshot.

### 7.2 Detail Kasus — Desktop

Sumber: `detail_kasus_jejak_bencana_desktop/code.html` dan `screen.png`.

Pertahankan:

- header dan navigasi desktop seperti referensi;
- breadcrumb `Beranda` / `Kasus`;
- judul **“Penanganan Darurat Banjir Bandang & Tanah Longsor Wilayah Barat”**;
- deskripsi konteks bencana dan cakupan wilayah;
- metadata tanggal, periode, instansi, dan DSP sebagaimana tertulis di ekspor;
- bagian **“Ringkasan Dana Siap Pakai (DSP)”**;
- metrik dan keterangan alokasi/penyaluran/realisasi sesuai struktur ekspor;
- bagian **“Status Serapan Terhadap Alokasi SK Penetapan”**;
- bagian **“Tujuan Penggunaan Dana”** dan kutipan;
- bagian **“Wilayah & Periode SK”**;
- bagian **“Sumber Informasi Resmi”** beserta dua kartu/entri sumber dan tombol `Buka sumber`;
- bagian **“Batasan Informasi & Ruang Lingkup Data Terbuka”**;
- footer dan tautan pendukung.

Pertahankan proporsi layout multi-kolom yang digunakan desain desktop. Jangan menyusun semua konten menjadi satu kolom panjang jika referensi menampilkan panel terpisah. Jangan menambahkan chart library atau grafik baru jika grafik/indikator pada HTML dapat dibuat dengan CSS.

### 7.3 Beranda — Mobile

Sumber: `beranda_jejak_bencana_mobile/code.html`; gunakan `screen.png` hanya jika file valid.

Pertahankan:

- header mobile ringkas;
- identitas Jejak Bencana;
- kontrol menu dan tautan sesuai referensi;
- banner `DATA CONTOH — JANGAN DITERBITKAN`/`DEMO` sesuai ekspor;
- navigasi mobile yang terlihat di file;
- hero dengan judul dan deskripsi yang sama seperti ekspor mobile;
- bagian **“Kasus Tanggap Bencana Aktif”**;
- kartu **“Penanganan Banjir & Longsor Pesisir Barat (Konteks Tanggap Darurat)”**;
- catatan bahwa rencana pengajuan belum menjadi alokasi resmi dan tidak dijumlahkan ke total anggaran aktif;
- tombol `Lihat detail kasus lengkap`;
- bagian batasan ruang lingkup data;
- bagian **“Memahami DSP dalam 1 Menit”** dengan tiga penjelasan;
- standar verifikasi tiga langkah;
- footer dan tautan pendukung.

Jangan sekadar mengecilkan screenshot desktop. Gunakan struktur dan urutan konten mobile yang terdapat di HTML mobile. Pertahankan padding tepi, ukuran heading, serta penumpukan konten sesuai referensi.

### 7.4 Detail Kasus — Mobile

Sumber: `detail_kasus_jejak_bencana_mobile/code.html` dan `screen.png`.

Pertahankan:

- header mobile dengan tombol kembali, identitas/ikon sesuai HTML, dan kontrol menu;
- breadcrumb/label `Beranda` dan `Detail Kasus`;
- judul detail kasus;
- deskripsi singkat kasus;
- bagian **“Ringkasan Dana Siap Pakai”**;
- kartu/angka/keterangan kategori dana sesuai ekspor;
- catatan bahwa nominal rencana tidak digabung ke total realisasi;
- bagian **“Tingkat Penyerapan Dana DSP”**;
- bagian **“Tujuan Penggunaan Dana”** dan kutipan;
- bagian **“Wilayah & Periode Darurat”**;
- bagian **“Sumber Informasi Resmi”** dengan dua entri sumber;
- disclaimer/batasan data;
- tombol `Bagikan Kasus` dan `Koreksi Data`;
- footer dan tautan pendukung.

Gunakan alur vertikal, urutan, dan gaya kartu versi mobile. Jangan memaksakan kolom desktop ke layar mobile. Tombol berbagi boleh menggunakan Web Share API jika tersedia, dengan fallback salin tautan; tombol koreksi harus mengarah ke mekanisme yang benar-benar tersedia atau diberi placeholder yang jelas, bukan berpura-pura mengirim laporan.

### 7.5 Dashboard Admin — Desktop

Sumber: `dashboard_admin_jejak_bencana_desktop/code.html` dan `screen.png`.

Pertahankan layout admin desktop seperti referensi, termasuk:

- sidebar/nav admin;
- label `DATA CONTOH SISTEM ADMIN — JANGAN DITERBITKAN`;
- menu `Dashboard Ringkasan`, `Entri Bencana & Kasus`, `Catatan Alokasi & DSP`, `Verifikasi Sumber Data`, `Pengaturan Sistem`;
- tautan `Buka Portal Publik` dan `Keluar Sistem`;
- judul `Dashboard Admin - Jejak Bencana`;
- tombol `Lihat Tampilan Publik`;
- bagian `Daftar Kasus Kebencanaan`;
- tiga kartu/list kasus contoh sebagaimana ada di HTML;
- kotak `Prosedur Integritas Data Admin`;
- tiga langkah/form section: `a. Form Kasus`, `b. Form Catatan Dana`, `c. Form Dokumen Sumber`;
- form informasi umum kasus, slug, wilayah, ringkasan, dan status publikasi;
- form catatan alokasi/DSP, jenis informasi, nominal, tujuan, periode, dan tautan dokumen;
- form verifikasi dokumen sumber;
- tombol `Simpan Draft` dan `Terbitkan Kasus`;
- modal/dialog validasi akhir dengan `Batal` dan `Ya, Terbitkan Data`;
- tautan footer.

Pertahankan struktur desktop dan hubungan visual antara navigasi, daftar kasus, form, dan validasi. Jangan mengganti desain ini dengan dashboard analytics generik atau membuat sidebar dengan menu berbeda.

### 7.6 Dashboard Admin — Mobile

Sumber: `dashboard_admin_jejak_bencana_mobile/code.html` dan `screen.png`.

Pertahankan:

- header `Admin Jejak Bencana`;
- tombol logout;
- navigasi tahap `Pilih Kasus`, `Formulir`, `Validasi`;
- panel kasus aktif `Banjir & Longsor Wilayah Pesisir Barat`;
- kontrol sinkronisasi dan `Buat Kasus Baru` sesuai ekspor;
- form judul resmi, slug, ringkasan situasi, status visibilitas;
- pilihan `Published` dan `Draft`;
- kategori keuangan DSP, nominal, tujuan/pos anggaran, tanggal dokumen;
- bagian kelengkapan tautan rujukan;
- pesan `Catatan dana #2 belum memiliki sumber resmi`;
- tombol `Tautkan SK atau Berita Acara Sekarang`;
- tombol `Tambah Rincian DSP Baru`;
- form dokumen resmi negara, URL, instansi penerbit, tanggal periksa;
- bagian `Validasi Publikasi Kasus`;
- tombol `Simpan Draft` dan `Terbitkan Kasus`.

Jangan mengubahnya menjadi versi mobile dari sidebar desktop secara otomatis. Ikuti alur/form bertahap yang terlihat pada desain mobile. Jika tombol navigasi tahap belum memiliki alur backend, interaksinya tetap harus mengubah state UI yang relevan.

## 8. Perilaku FE yang Diperlukan

Visual fidelity adalah prioritas, tetapi kontrol yang tampak interaktif tidak boleh sepenuhnya inert.

- Navigasi antarhalaman menggunakan router yang sudah tersedia.
- Tautan sumber membuka URL yang sesuai; gunakan `target="_blank"` hanya bila tepat dan sertakan `rel="noopener noreferrer"`.
- Tombol `Lihat detail kasus lengkap` membuka halaman detail.
- Tombol menu mobile membuka/menutup menu.
- Tombol `Bagikan Kasus` menggunakan Web Share API bila tersedia dan fallback salin tautan.
- Tombol `Simpan Draft` memberi feedback sesuai hasil operasi aktual.
- Tombol `Terbitkan Kasus` membuka dialog konfirmasi yang tampilannya mengikuti desain.
- Tombol `Ya, Terbitkan Data` menjalankan operasi hanya jika service/API tersedia; tampilkan sukses hanya setelah operasi berhasil.
- Validasi form memberi pesan dekat field yang salah.
- Tombol tambah rincian DSP menambah baris/form input baru di UI.
- Pilihan `Published`/`Draft` memperbarui state form.
- Tab/langkah `Pilih Kasus`, `Formulir`, `Validasi` mengubah tahap yang terlihat.
- Tombol `Koreksi Data` membuka form atau tautan kontak yang benar-benar tersedia; jangan mengklaim koreksi terkirim bila belum ada endpoint.
- Bila backend belum tersedia, gunakan mock service terpisah dengan indikator mode demo. Jangan membuat seolah-olah data tersimpan permanen.

## 9. Aturan Data dan Copy

- Pertahankan copy dan label dari HTML Stitch sedekat mungkin.
- Jangan mengganti konten referensi dengan copywriting baru.
- Konten angka dan kasus pada mockup adalah **data contoh**, bukan fakta yang otomatis benar.
- Pertahankan disclaimer bahwa rencana/pengajuan tidak ditambahkan ke total alokasi/realisasi.
- Jangan menambahkan total lintas kategori yang berbeda.
- Jangan menyatakan sumber telah diverifikasi secara otomatis.
- Jangan membuat tautan sumber palsu. Bila URL asli tidak ada pada data referensi, tampilkan status/placeholder yang jelas dan jangan mengarang URL.

## 10. Teknologi dan Struktur Implementasi

- Audit stack sebelum coding.
- Pertahankan framework, router, CSS framework, dan pola komponen yang telah digunakan proyek.
- Jika proyek menggunakan React + Vite + Tailwind, lanjutkan dengan stack tersebut; jangan menginisialisasi ulang.
- Jangan mengonversi JavaScript ke TypeScript atau sebaliknya di seluruh proyek tanpa alasan.
- Gunakan `DESIGN.md` untuk membuat CSS variables/theme tokens agar konsisten.
- Bangun komponen reusable untuk elemen yang memang berulang, misalnya header, footer, badge kategori, alert data contoh, kartu sumber, dan field form.
- Jangan terlalu mengabstraksi sampai komposisi tiap layar tidak lagi dapat dicocokkan dengan HTML Stitch.
- Pisahkan data fixture dari komponen dan service API.
- Jangan menambahkan backend/database dalam pekerjaan ini.
- Jangan memasang dependency baru jika kebutuhan dapat dipenuhi dengan kode dan library yang sudah tersedia.

Struktur file harus mengikuti pola repositori. Jangan memaksakan struktur folder baru yang berbeda dari proyek yang ada.

## 11. Responsive Fidelity

Wajib mengimplementasikan desain desktop dan mobile yang memang tersedia secara terpisah. Jangan menganggap responsivitas hanya berarti `width: 100%`.

- Desktop harus mengikuti screenshot desktop.
- Mobile harus mengikuti HTML dan screenshot mobile yang tersedia.
- Tablet dapat menggunakan adaptasi fluid di antara dua layout referensi, tanpa mengubah identitas visual.
- Uji minimal pada lebar 390px, 768px, 1024px, dan 1440px.
- Cegah horizontal overflow, tetapi jangan menghapus informasi untuk mengatasinya.
- Pertahankan urutan, hierarki, jarak, dan bentuk kontrol pada setiap breakpoint.

## 12. Proses Visual QA Wajib

Setiap layar harus dibandingkan dengan referensi Stitch, bukan hanya diperiksa secara fungsional.

Untuk setiap layar:

1. Jalankan aplikasi pada viewport yang sebanding dengan referensi.
2. Ambil screenshot hasil implementasi.
3. Bandingkan berdampingan dengan screenshot Stitch.
4. Periksa:
   - lebar kontainer dan posisi awal konten;
   - tinggi header dan hero;
   - ukuran, weight, dan line-height heading;
   - jarak antarsection;
   - jumlah kolom dan rasio kolom;
   - dimensi kartu, tombol, badge, dan input;
   - warna latar, border, dan shadow;
   - wrapping teks;
   - urutan konten;
   - footer dan banner data contoh.
5. Perbaiki perbedaan terbesar terlebih dahulu.
6. Ulangi sampai tidak ada perbedaan besar yang terlihat.

**Jangan berhenti pada tahap “halaman sudah muncul”.** Build yang berhasil bukan bukti bahwa desain sudah cocok.

Jika tersedia tooling screenshot/browser di lingkungan developer, gunakan untuk perbandingan visual. Jika tidak tersedia, jelaskan keterbatasannya dan berikan checklist screenshot manual. Jangan mengklaim pixel-perfect jika tidak dilakukan perbandingan.

## 13. Acceptance Criteria

### Fidelity

- [ ] Keenam layar Stitch telah diimplementasikan.
- [ ] Susunan section dan hierarki konten cocok dengan referensi masing-masing.
- [ ] Teks dan label utama dipertahankan.
- [ ] Warna dan tipografi menggunakan token Stitch.
- [ ] Desktop dan mobile mengikuti desainnya masing-masing, bukan hanya hasil scaling.
- [ ] Tidak ada section, card, sidebar, chart, atau dekorasi baru yang tidak diminta.
- [ ] Screenshot hasil implementasi telah dibandingkan dengan referensi.

### Fungsi FE

- [ ] Navigasi dan tombol utama berfungsi atau memiliki placeholder yang dinyatakan dengan jelas.
- [ ] Menu mobile dapat dibuka/ditutup.
- [ ] Form memiliki validasi UI.
- [ ] Dialog publikasi dapat dibuka dan ditutup.
- [ ] Tambah rincian DSP dan perpindahan tahap admin mengubah UI.
- [ ] State loading/error/success disesuaikan dengan operasi yang benar-benar tersedia.
- [ ] Data demo diberi penanda.

### Kualitas

- [ ] Tidak ada horizontal overflow pada viewport target.
- [ ] Tidak ada error build/lint yang diketahui tanpa laporan.
- [ ] Komponen reusable tidak menghilangkan detail spesifik layar.
- [ ] Tidak ada backend/database baru yang dibuat sebagai bagian pekerjaan FE.
- [ ] Hasil tes dan keterbatasan integrasi dilaporkan dengan jujur.

## 14. Urutan Implementasi

### Tahap 1 — Audit dan pemetaan

Laporkan stack, file referensi yang ditemukan, route/komponen yang ada, dan rencana pemetaan enam layar.

### Tahap 2 — Design tokens dan komponen dasar

Implementasikan token dari `DESIGN.md`, font Inter, warna, badge, tombol, input, kartu, alert, dan layout primitives yang dibutuhkan.

### Tahap 3 — Beranda desktop dan mobile

Implementasikan kedua layout berdasarkan file Stitch masing-masing. Lakukan visual QA sebelum lanjut.

### Tahap 4 — Detail kasus desktop dan mobile

Implementasikan kedua layout berdasarkan file Stitch masing-masing. Lakukan visual QA sebelum lanjut.

### Tahap 5 — Dashboard admin desktop dan mobile

Implementasikan kedua layout dan interaksi UI yang terlihat. Lakukan visual QA sebelum lanjut.

### Tahap 6 — Interaksi, state, dan integrasi

Sambungkan ke service/API yang benar-benar tersedia. Jika belum tersedia, gunakan mock service yang terpisah dan berlabel demo.

### Tahap 7 — Visual QA akhir

Ambil screenshot keenam layar, bandingkan dengan acuan, perbaiki perbedaan layout/spacing/typography/color, lalu jalankan lint dan build.

Jangan mengerjakan semua tahap sekaligus tanpa validasi. Setelah setiap tahap, laporkan file yang berubah, hasil build/test, dan perbedaan visual yang masih tersisa.

## 15. Prompt Implementasi untuk AI Coding Assistant

Salin instruksi ini setelah menempatkan PRD, ekspor Stitch, dan `DESIGN.md` di workspace:

> Implementasikan frontend Jejak Bencana dengan **visual fidelity tinggi terhadap Google Stitch**, menggunakan `PRD_Jejak_Bencana_FE.md`, keenam file `code.html`, keenam screenshot yang valid, dan `jejak_bencana/DESIGN.md`.
>
> Mulai dengan mengaudit repositori dan menemukan seluruh file referensi. Jangan mulai dengan redesign atau membuat landing page/dashboard generik. Jangan menebak tampilan dari judul halaman: buka dan baca HTML serta screenshot tiap layar.
>
> Replikasi enam layar secara terpisah: beranda desktop, detail kasus desktop, beranda mobile, dashboard admin mobile, detail kasus mobile, dan dashboard admin desktop. Pertahankan komposisi, urutan section, jumlah kolom, lebar kontainer, spacing, warna, tipografi, card, badge, tombol, teks, dan footer sesuai referensi.
>
> `DESIGN.md` adalah sumber token desain. Jangan mengganti palet atau menambah gradient, glassmorphism, shadow besar, animasi dekoratif, section baru, chart baru, sidebar baru, atau komponen yang tidak ada di referensi. Jangan menghapus konten penting agar layout lebih mudah dibuat.
>
> Pertahankan stack dan pola kode proyek yang sudah ada. Jangan membangun backend/database. Jika API belum tersedia, buat mock service terpisah dan tandai dengan jelas sebagai demo.
>
> Konten contoh pada mockup bukan data faktual. Pertahankan banner data contoh dan disclaimer non-donasi. Jangan mengarang angka atau URL sumber.
>
> Kerjakan satu pasang layout pada satu waktu. Setelah setiap tahap, jalankan aplikasi, ambil screenshot pada viewport yang sama dengan referensi, bandingkan hasilnya, lalu perbaiki perbedaan visual sebelum melanjutkan. Jangan menyatakan desain cocok hanya karena build berhasil.
>
> Pada akhir pekerjaan, laporkan keenam layar yang selesai, file yang diubah, hasil lint/build/test, dan perbedaan visual yang masih belum terselesaikan.

---

## 16. Definition of Done

Pekerjaan selesai apabila:

- keenam layar tersedia;
- layout tiap layar mengikuti desain Stitch yang sesuai;
- desktop dan mobile menggunakan komposisi yang benar untuk masing-masing referensi;
- design tokens berasal dari `DESIGN.md`;
- tidak ada redesign atau fitur visual tambahan yang tidak diminta;
- elemen interaktif utama berfungsi atau memiliki placeholder yang jelas;
- data demo ditandai dan tidak disajikan sebagai fakta;
- screenshot hasil implementasi sudah dibandingkan dengan acuan;
- build dan pemeriksaan kode yang tersedia telah dijalankan;
- semua keterbatasan yang belum terselesaikan dilaporkan.

**Ukuran keberhasilan utama adalah kesesuaian visual terhadap Stitch, bukan banyaknya fitur atau kebebasan kreativitas AI.**
