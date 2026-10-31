import type { DisasterCase } from "@/types";

export const INITIAL_MOCK_CASES: DisasterCase[] = [
  {
    id: "case-stitch-1",
    title: "Penanganan Banjir & Longsor Pesisir Barat (Konteks Tanggap Darurat)",
    slug: "penanganan-banjir-longsor-pesisir-barat",
    affectedArea: "Kabupaten Pesisir Barat, Provinsi Lampung",
    summary: "Memahami Dana Siap Pakai dari sumber resmi, dengan bahasa yang lebih sederhana. Portal informasi publik pemantauan Dana Siap Pakai (DSP) BNPB.",
    incidentDate: "2026-10-15",
    periodStart: "2026-10-16",
    periodEnd: "2026-11-15",
    contextNote: "Data bersumber dari laporan resmi tanggap darurat BNPB tahap 1. Penyaluran logistik dikoordinasikan melalui posko utama.",
    scopeLimitations: "Angka realisasi merupakan laporan penyerapan per tanggal dokumen diterbitkan. Tidak mencakup donasi pihak swasta di luar DSP.",
    status: "PUBLISHED",
    publishedAt: "2026-10-18T10:00:00Z",
    updatedAt: "2026-10-25T14:30:00Z",
    sourceDocuments: [
      {
        id: "doc-stitch-1",
        title: "Laporan Pertanggungjawaban DSP BNPB Tanggap Darurat Pesisir Barat",
        url: "",
        publisher: "Badan Nasional Penanggulangan Bencana (BNPB)",
        publicationDate: "2026-10-20",
        lastCheckedAt: "2026-10-28",
        verificationNote: "Diperiksa secara manual dari dokumen PDF publik BNPB."
      },
      {
        id: "doc-stitch-2",
        title: "SK Penetapan Status Tanggap Darurat Kepala BNPB",
        url: "",
        publisher: "BNPB",
        publicationDate: "2026-10-16",
        lastCheckedAt: "2026-10-28",
        verificationNote: "SK resmi alokasi Dana Siap Pakai."
      }
    ],
    fundRecords: [
      {
        id: "fr-s1",
        caseId: "case-stitch-1",
        category: "ALLOCATION",
        amount: 14500000000,
        currency: "IDR",
        purpose: "Penetapan Dana Siap Pakai untuk Operasi Darurat & Logistik Dasar",
        documentDate: "2026-10-16",
        periodLabel: "SK Penetapan Tahap 1",
        notes: "Alokasi awal berdasarkan SK Kepala BNPB Nomor 412/2026.",
        sources: [
          {
            id: "doc-stitch-2",
            title: "SK Penetapan Status Tanggap Darurat Kepala BNPB",
            url: "",
            publisher: "BNPB"
          }
        ]
      },
      {
        id: "fr-s2",
        caseId: "case-stitch-1",
        category: "DISTRIBUTION",
        amount: 11200000000,
        currency: "IDR",
        purpose: "Penyaluran Tenda Pengungsian, Sembako, dan Air Bersih",
        documentDate: "2026-10-20",
        periodLabel: "Penyaluran Minggu ke-1",
        notes: "Telah disalurkan ke 8 posko pengungsian utama.",
        sources: [
          {
            id: "doc-stitch-1",
            title: "Laporan Pertanggungjawaban DSP BNPB",
            url: "",
            publisher: "BNPB"
          }
        ]
      },
      {
        id: "fr-s3",
        caseId: "case-stitch-1",
        category: "REALIZATION",
        amount: 9800000000,
        currency: "IDR",
        purpose: "Realisasi Pengadaan Makanan Siap Saji & BBM Operasional Evakuasi",
        documentDate: "2026-10-24",
        periodLabel: "Laporan Penyerapan Aktual",
        notes: "Berdasarkan laporan harian posko komando tanggap darurat.",
        sources: [
          {
            id: "doc-stitch-1",
            title: "Laporan Pertanggungjawaban DSP BNPB",
            url: "",
            publisher: "BNPB"
          }
        ]
      },
      {
        id: "fr-s4",
        caseId: "case-stitch-1",
        category: "PLAN",
        amount: 20000000000,
        currency: "IDR",
        purpose: "Rencana Pengajuan Rekonstruksi Jembatan & Hunian Tetap",
        documentDate: "2026-10-25",
        periodLabel: "Rencana Anggaran 2027",
        notes: "Catatan: Ini adalah RENCANA/PENGAJUAN, belum berarti dana definitif cair.",
        sources: [
          {
            id: "doc-stitch-1",
            title: "Laporan Pertanggungjawaban DSP BNPB",
            url: "",
            publisher: "BNPB"
          }
        ]
      }
    ]
  },
  {
    id: "case-stitch-2",
    title: "Penanganan Darurat Banjir Bandang & Tanah Longsor Wilayah Barat",
    slug: "penanganan-darurat-banjir-bandang-tanah-longsor-wilayah-barat",
    affectedArea: "Kabupaten Pesisir Barat & Tanggamus",
    summary: "Rincian alokasi, penyaluran, dan realisasi penanganan darurat bencana banjir bandang dan longsor wilayah barat.",
    incidentDate: "2026-09-10",
    status: "PUBLISHED",
    publishedAt: "2026-09-12T08:00:00Z",
    updatedAt: "2026-09-20T10:00:00Z",
    sourceDocuments: [
      {
        id: "doc-stitch-3",
        title: "SK BNPB Banjir Wilayah Barat",
        url: "",
        publisher: "BNPB",
        publicationDate: "2026-09-11"
      }
    ],
    fundRecords: [
      {
        id: "fr-s201",
        caseId: "case-stitch-2",
        category: "ALLOCATION",
        amount: 12000000000,
        currency: "IDR",
        purpose: "Penetapan DSP Darurat Banjir Bandang",
        documentDate: "2026-09-11",
        periodLabel: "SK Tahap 1",
        sources: [{ id: "doc-stitch-3", title: "SK BNPB", url: "", publisher: "BNPB" }]
      }
    ]
  }
];

const STORAGE_KEY = "jejak_bencana_stitch_cases_v1";

export function getStoredCases(): DisasterCase[] {
  if (typeof window === "undefined") return INITIAL_MOCK_CASES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_CASES));
      return INITIAL_MOCK_CASES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_CASES;
  }
}

export function saveStoredCases(cases: DisasterCase[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}

export async function getAllCases(): Promise<DisasterCase[]> {
  await new Promise((r) => setTimeout(r, 150));
  return getStoredCases();
}

export async function getPublishedCases(): Promise<DisasterCase[]> {
  const cases = await getAllCases();
  return cases.filter((c) => c.status === "PUBLISHED");
}

export async function getCaseBySlug(slug: string): Promise<DisasterCase | null> {
  const cases = await getAllCases();
  return cases.find((c) => c.slug === slug) || null;
}

export async function getCaseById(id: string): Promise<DisasterCase | null> {
  const cases = await getAllCases();
  return cases.find((c) => c.id === id) || null;
}

export async function upsertCase(caseData: Partial<DisasterCase>): Promise<DisasterCase> {
  const cases = getStoredCases();
  const now = new Date().toISOString();

  let target: DisasterCase;
  if (caseData.id) {
    const index = cases.findIndex((c) => c.id === caseData.id);
    if (index !== -1) {
      target = {
        ...cases[index],
        ...caseData,
        updatedAt: now,
        publishedAt: caseData.status === "PUBLISHED" && !cases[index].publishedAt ? now : cases[index].publishedAt
      };
      cases[index] = target;
    } else {
      throw new Error("Case not found");
    }
  } else {
    target = {
      id: `case-${Date.now()}`,
      title: caseData.title || "Kasus Baru",
      slug: (caseData.title || "kasus-baru").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      affectedArea: caseData.affectedArea || "-",
      summary: caseData.summary || "",
      status: caseData.status || "DRAFT",
      updatedAt: now,
      publishedAt: caseData.status === "PUBLISHED" ? now : undefined,
      fundRecords: caseData.fundRecords || [],
      sourceDocuments: caseData.sourceDocuments || [],
      ...caseData
    } as DisasterCase;
    cases.unshift(target);
  }

  target.fundRecords = target.fundRecords.map((record) => ({
    ...record,
    caseId: target.id,
  }));
  if (caseData.id) {
    const index = cases.findIndex((item) => item.id === target.id);
    cases[index] = target;
  }

  saveStoredCases(cases);
  return target;
}

export async function deleteCase(id: string): Promise<boolean> {
  let cases = getStoredCases();
  cases = cases.filter((c) => c.id !== id);
  saveStoredCases(cases);
  return true;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}
