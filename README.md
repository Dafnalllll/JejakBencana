# Jejak Bencana

**Jejak Bencana** adalah portal informasi publik untuk membantu masyarakat memahami informasi **Dana Siap Pakai (DSP)** dalam konteks penanganan bencana. Informasi disusun berdasarkan konteks kasus, kategori dana, dan dokumen rujukan agar lebih mudah ditelusuri dan dibaca.

> **Penting:** Aplikasi ini saat ini masih menggunakan **data contoh** dan penyimpanan di browser. Data maupun fitur admin belum terhubung ke backend pemerintah atau sistem produksi. Jejak Bencana bukan platform donasi dan tidak menerima pembayaran atau transfer.

## Daftar Isi

- [Tujuan dan ruang lingkup](#tujuan-dan-ruang-lingkup)
- [Fitur](#fitur)
- [Kategori informasi dana](#kategori-informasi-dana)
- [Halaman aplikasi](#halaman-aplikasi)
- [Teknologi](#teknologi)
- [Menjalankan aplikasi](#menjalankan-aplikasi)
- [Perintah yang tersedia](#perintah-yang-tersedia)
- [Struktur proyek](#struktur-proyek)
- [Sumber data dan batasan](#sumber-data-dan-batasan)
- [Kontribusi](#kontribusi)

## Tujuan dan ruang lingkup

Informasi kebencanaan dan pendanaan darurat dapat tersebar di berbagai dokumen dengan istilah serta tahapan yang berbeda. Jejak Bencana menyajikan informasi tersebut per kasus supaya pembaca dapat:

- memahami konteks kejadian dan wilayah terdampak;
- membaca catatan alokasi, penyaluran, dan realisasi secara terpisah;
- membedakan nilai yang sudah ditetapkan dari rencana atau pengajuan;
- menemukan dokumen sumber yang menjadi rujukan; dan
- memahami istilah DSP melalui glosarium.

Portal ini berfokus pada **penyajian dan pemahaman informasi**, bukan audit, penggalangan dana, atau pengganti publikasi resmi instansi.

## Fitur

- **Beranda informatif** — menampilkan pengantar portal dan ringkasan kasus pilihan.
- **Daftar dan pencarian kasus** — menelusuri kasus berdasarkan nama atau wilayah.
- **Halaman detail kasus** — membaca konteks, ringkasan kategori dana, dokumen sumber, dan catatan kasus.
- **Pemisahan tahapan dana** — kategori dana ditampilkan terpisah agar nilai dengan makna berbeda tidak tercampur.
- **Glosarium DSP** — penjelasan istilah yang digunakan di dalam portal.
- **Metodologi dan batasan** — penjelasan mengenai rujukan, pemeriksaan data, serta keterbatasan informasi.
- **Dashboard admin demo** — simulasi pengelolaan dan publikasi kasus; belum memakai autentikasi atau penyimpanan server yang aman.
- **Interaksi dan animasi** — transisi antarmuka menggunakan Motion, dengan animasi saat menggulir menggunakan GSAP.
- **Dukungan pengurangan gerakan** — animasi interaksi tertentu menyesuaikan preferensi `prefers-reduced-motion`.
- **Tampilan responsif** — antarmuka dirancang untuk berbagai ukuran layar.

## Kategori informasi dana

| Kategori | Makna ringkas | Cara membaca |
|---|---|---|
| **Alokasi / Penetapan** | Nilai yang ditetapkan melalui dokumen atau keputusan resmi untuk suatu penanganan bencana. | Periksa dokumen penetapan, tanggal, tujuan, dan cakupan alokasinya. |
| **Penyaluran** | Nilai dana atau bantuan yang dilaporkan telah disalurkan kepada pelaksana atau wilayah terkait. | Baca sesuai catatan penyaluran dan periode pada dokumen sumber. |
| **Realisasi dilaporkan** | Nilai penggunaan atau penyerapan yang dicatat dalam laporan. | Perhatikan tanggal laporan; angka dapat berubah mengikuti pembaruan dokumen. |
| **Rencana / Pengajuan** | Usulan atau rencana anggaran yang belum tentu ditetapkan atau dicairkan. | Jangan menganggapnya sebagai dana yang sudah dialokasikan atau direalisasikan. |

Kategori-kategori tersebut menunjukkan **tahapan yang berbeda**. Nilainya tidak dijumlahkan sebagai satu total karena dapat mewakili hal yang berbeda dan berasal dari dokumen atau periode yang berbeda.

## Halaman aplikasi

| Halaman | Rute | Kegunaan |
|---|---|---|
| Beranda | `/` | Pengantar portal dan ringkasan kasus pilihan. |
| Daftar kasus | `/kasus` | Menelusuri dan mencari kasus yang dipublikasikan. |
| Detail kasus | `/kasus/[slug]` | Melihat rincian kasus, catatan dana, serta dokumen rujukan. |
| Glosarium | `/glosarium` | Mempelajari istilah DSP dan kategori dana. |
| Metodologi | `/metodologi` | Membaca pendekatan pengelolaan data dan batasan portal. |
| Login admin demo | `/admin/login` | Masuk ke simulasi dashboard admin. |
| Dashboard admin demo | `/admin` | Mengelola data kasus contoh. |

### Akses admin demo

Halaman login demo saat ini menerima kredensial berikut:

| Kolom | Nilai demo |
|---|---|
| Username | `admin` |
| Password | `admin123` |

Kredensial tersebut ditanam untuk kebutuhan demonstrasi dan **bukan autentikasi yang aman**. Jangan gunakan pola atau kredensial ini untuk aplikasi produksi, jangan memasukkan data sensitif, dan jangan menganggap dashboard demo membatasi akses secara aman.

## Teknologi

| Teknologi | Peran |
|---|---|
| [Next.js](https://nextjs.org/) 16 | Framework aplikasi web dan perutean halaman. |
| [React](https://react.dev/) 19 | Pustaka antarmuka pengguna. |
| [TypeScript](https://www.typescriptlang.org/) | Pemeriksaan tipe pada kode aplikasi. |
| [Tailwind CSS](https://tailwindcss.com/) 4 | Utilitas dan styling antarmuka. |
| [Motion](https://motion.dev/) | Animasi dan interaksi komponen. |
| [GSAP](https://gsap.com/) | Animasi berbasis gulir pada halaman yang menggunakannya. |
| [ESLint](https://eslint.org/) | Pemeriksaan kualitas dan konsistensi kode. |

## Menjalankan aplikasi

### Prasyarat

- Node.js yang kompatibel dengan Next.js 16.
- npm.

### Langkah

1. Kloning repositori dan masuk ke direktori proyek.
2. Pasang dependensi:

   ```bash
   npm install
   ```

3. Jalankan server pengembangan:

   ```bash
   npm run dev
   ```

4. Buka [http://localhost:3000](http://localhost:3000) di browser.

Untuk menghentikan server pengembangan, tekan `Ctrl+C` pada terminal tempat server berjalan.

## Perintah yang tersedia

| Perintah | Kegunaan |
|---|---|
| `npm run dev` | Menjalankan server pengembangan Next.js. |
| `npm run lint` | Menjalankan ESLint. |
| `npm run build` | Membuat build aplikasi untuk produksi. |
| `npm run start` | Menjalankan build produksi yang sudah dibuat. Jalankan `npm run build` terlebih dahulu. |

## Struktur proyek

```text
.
├── app/
│   ├── admin/             # Halaman admin demo dan pengelolaan kasus
│   ├── glosarium/         # Halaman glosarium DSP
│   ├── kasus/             # Daftar kasus dan halaman detail
│   ├── metodologi/        # Metodologi dan batasan informasi
│   ├── globals.css        # Gaya global
│   ├── layout.tsx         # Layout utama aplikasi
│   └── page.tsx           # Halaman beranda
├── components/            # Komponen antarmuka yang digunakan bersama
├── lib/
│   └── mockService.ts     # Data contoh dan layanan penyimpanan lokal
├── public/                # Aset statis
├── types/
│   └── index.ts           # Tipe data kasus dan informasi dana
├── package.json           # Dependensi dan perintah proyek
└── README.md
```

## Integrasi Backend ASP.NET Core (`Jejak-Bencana-API`)

Proyek ini terhubung dengan backend API ASP.NET Core (`Jejak-Bencana-API`) melalui proxy Next.js (`rewrites` di `next.config.ts`).

1. **Jalankan Backend:**
   ```bash
   cd "D:\Dafa Code\Jejak-Bencana-API"
   dotnet run
   ```
   Backend akan berjalan di `http://localhost:5260`.

2. **Jalankan Frontend:**
   ```bash
   cd "D:\Dafa Code\jejakbencana"
   npm run dev
   ```
   Frontend akan berjalan di `http://localhost:3000` dan meneruskan request `/api/*` ke backend `http://localhost:5260`.

3. **Fallback Mekanisme:**
   Jika backend belum aktif, layanan data pada frontend secara otomatis menggunakan mock data lokal / `localStorage`.

## Sumber data dan batasan

- Aplikasi saat ini menggunakan **data contoh** yang didefinisikan di `lib/mockService.ts`.
- Perubahan data dari simulasi admin disimpan di `localStorage` browser, bukan database atau server. Data tersebut bersifat lokal pada browser yang digunakan dan dapat hilang jika penyimpanan browser dihapus.
- Beberapa catatan pada data contoh menampilkan dokumen rujukan, tetapi tautan dokumen belum tentu tersedia. Verifikasi dokumen asli sebelum menggunakan informasi untuk keperluan di luar demonstrasi.
- Implementasi ini belum melakukan sinkronisasi otomatis dengan BNPB, BPBD, atau instansi lainnya.
- Data nyata perlu diperiksa terhadap dokumen resmi dan tanggal penerbitannya. Jika informasi tidak tersedia pada sumber, jangan mengisinya dengan asumsi.
- Rencana atau pengajuan bukan bukti bahwa dana telah ditetapkan, disalurkan, atau digunakan.
- Portal ini bukan lembaga audit, bukan kanal bantuan darurat, dan bukan sarana untuk melakukan transaksi finansial.

## Kontribusi

Kontribusi untuk meningkatkan kejelasan informasi, aksesibilitas, pengalaman pengguna, dokumentasi, dan kualitas kode sangat dihargai.

1. Buat perubahan pada branch terpisah.
2. Pastikan perubahan mengikuti pola dan struktur proyek.
3. Jalankan pemeriksaan yang relevan, misalnya `npm run lint` dan `npm run build`.
4. Jelaskan tujuan perubahan saat mengirim pull request.
