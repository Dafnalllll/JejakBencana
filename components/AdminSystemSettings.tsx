"use client";

import { startTransition, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import AdminPageHeader from "@/components/AdminPageHeader";

const storageKey = "jejak_bencana_admin_settings_demo_v1";

const settingOptions = [
  {
    id: "officialDomainOnly",
    title: "Tolak domain non-pemerintah",
    label: "Pembatasan domain",
    description: "Pratinjau aturan yang membatasi rujukan ke domain pemerintah.",
    status: "SIMULASI · .go.id",
  },
  {
    id: "blockDonationLinks",
    title: "Blokir tautan donasi",
    label: "Parameter non-donasi",
    description: "Pratinjau aturan untuk menandai tautan donasi atau crowdfunding.",
    status: "SIMULASI · NON-DONASI",
  },
  {
    id: "apiSync",
    title: "Sinkronisasi API BNPB & BMKG",
    label: "Integrasi layanan",
    description: "Pilihan ini tidak menjalankan sinkronisasi API pada aplikasi.",
    status: "BELUM TERHUBUNG",
  },
  {
    id: "appendOnlyAudit",
    title: "Catat perubahan metadata",
    label: "Jejak audit",
    description: "Penyimpanan lokal tidak menyediakan log append-only atau hash kriptografis.",
    status: "SIMULASI · LOKAL",
  },
] as const;

type SettingId = (typeof settingOptions)[number]["id"];
type SettingsState = Record<SettingId, boolean>;
type SettingsTab = "staff" | "integrations" | "compliance" | "audit";

const defaultSettings: SettingsState = {
  officialDomainOnly: true,
  blockDonationLinks: true,
  apiSync: false,
  appendOnlyAudit: false,
};

const tabs: { id: SettingsTab; label: string; icon: string; target: string }[] = [
  { id: "staff", label: "Manajemen Akses Staf", icon: "♙", target: "staff-access" },
  { id: "integrations", label: "Integrasi API BNPB & BMKG", icon: "⇄", target: "api-integrations" },
  { id: "compliance", label: "Kepatuhan & Parameter Non-Donasi", icon: "◈", target: "system-controls" },
  { id: "audit", label: "Log Audit", icon: "▤", target: "audit-log" },
];

const demoStaff = [
  {
    name: "Auditor Demo 01",
    identity: "DEMO-0001",
    role: "SUPER ADMIN / AUDITOR",
    access: "Validasi & kelola metadata",
    status: "SIMULASI",
  },
  {
    name: "Verifikator Demo 02",
    identity: "DEMO-0002",
    role: "VERIFIKATOR DOKUMEN",
    access: "Tinjau sumber dokumen",
    status: "SIMULASI",
  },
  {
    name: "Operator Demo 03",
    identity: "DEMO-0003",
    role: "OPERATOR DATA",
    access: "Kelola entri kasus",
    status: "SIMULASI",
  },
];

const auditExamples = [
  {
    time: "Contoh waktu",
    actor: "Auditor Demo 01",
    address: "Tidak tersedia",
    action: "VALIDATE_DOC",
    description: "Contoh format catatan pemeriksaan dokumen.",
    fingerprint: "Tidak tersedia",
  },
  {
    time: "Contoh waktu",
    actor: "SISTEM DEMO",
    address: "Tidak tersedia",
    action: "SYNC_API",
    description: "Contoh format catatan integrasi layanan.",
    fingerprint: "Tidak tersedia",
  },
  {
    time: "Contoh waktu",
    actor: "Verifikator Demo 02",
    address: "Tidak tersedia",
    action: "UPDATE_SOURCE",
    description: "Contoh format catatan perubahan metadata sumber.",
    fingerprint: "Tidak tersedia",
  },
];

function isSettingsState(value: unknown): value is SettingsState {
  if (!value || typeof value !== "object") return false;
  return settingOptions.every((option) => typeof (value as Record<string, unknown>)[option.id] === "boolean");
}

export default function AdminSystemSettings() {
  const shouldReduceMotion = useReducedMotion();
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [activeTab, setActiveTab] = useState<SettingsTab>("staff");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return;
      const parsed: unknown = JSON.parse(stored);
      if (!isSettingsState(parsed)) {
        startTransition(() => {
          setFeedback("Pengaturan demo tersimpan memiliki format yang tidak dikenal. Nilai awal digunakan.");
        });
        return;
      }
      startTransition(() => setSettings(parsed));
    } catch {
      startTransition(() => {
        setFeedback("Pengaturan demo lokal tidak dapat dibaca. Nilai awal digunakan.");
      });
    }
  }, []);

  const saveSettings = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
      setFeedback("Preferensi demo tersimpan di browser ini. Tidak ada perubahan pada server atau akses akun.");
    } catch {
      setFeedback("Preferensi demo tidak berhasil disimpan di browser.");
    }
  };

  const downloadAuditExamples = () => {
    const rows = [
      ["Jenis", "Waktu", "Aktor", "Alamat", "Tindakan", "Deskripsi", "Hash"],
      ...auditExamples.map((entry) => [
        "ILUSTRASI — BUKAN LOG AKTUAL",
        entry.time,
        entry.actor,
        entry.address,
        entry.action,
        entry.description,
        entry.fingerprint,
      ]),
    ];
    const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const csv = `\uFEFF${rows.map((row) => row.map(quote).join(",")).join("\r\n")}`;
    const objectUrl = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = "contoh-log-audit-jejak-bencana.csv";
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  };

  const selectTab = (tab: (typeof tabs)[number]) => {
    setActiveTab(tab.id);
    document.getElementById(tab.target)?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const setOption = (id: SettingId, value: boolean) => {
    setSettings((current) => ({ ...current, [id]: value }));
    setFeedback("Ada perubahan preferensi demo yang belum disimpan.");
  };

  return (
    <div className="min-w-0 flex-1 bg-[#F7F8FC] text-[#202B40]">
      <AdminPageHeader
        exportLabel="Unduh Log Contoh"
        onExport={downloadAuditExamples}
        onPrimaryAction={saveSettings}
        primaryIcon="▣"
        primaryLabel="Simpan Perubahan"
        showPublicPortal={false}
        statusLabel="PENGATURAN DEMO · LOKAL"
        title="Pengaturan Sistem"
      />

      <nav className="sticky top-[88px] z-10 overflow-x-auto border-b border-[#DDE3EA] bg-white" aria-label="Navigasi bagian pengaturan">
        <div className="mx-auto flex min-w-max max-w-[1500px] gap-1 px-4 sm:px-6 lg:px-8" role="tablist">
          {tabs.map((tab) => (
            <button
              aria-current={activeTab === tab.id ? "page" : undefined}
              className={`inline-flex min-h-11 items-center gap-2 border-b-2 px-3 text-[10px] font-semibold transition-colors ${
                activeTab === tab.id
                  ? "border-[#087C67] text-[#006C62]"
                  : "border-transparent text-[#5D6A7E] hover:text-[#006C62]"
              }`}
              key={tab.id}
              onClick={() => selectTab(tab)}
              type="button"
            >
              <span aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="px-4 py-5 sm:px-6 lg:px-7 lg:py-6">
        <div className="mx-auto grid max-w-[1500px] gap-4">
          {feedback && (
            <p className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2.5 text-[10px] leading-4 text-blue-900" role="status">
              {feedback}
            </p>
          )}

          <aside className="grid gap-2 rounded-lg border border-amber-300 bg-[#FFFBEB] p-3 text-amber-900 sm:grid-cols-[20px_minmax(0,1fr)_auto] sm:items-center sm:px-4">
            <span className="grid size-5 place-items-center rounded-full border border-amber-600 text-[11px] font-bold" aria-hidden="true">!</span>
            <div>
              <h2 className="text-[11px] font-bold">Pengaturan sistem dalam mode demonstrasi</h2>
              <p className="mt-0.5 text-[10px] leading-4 text-amber-800">
                Akun, integrasi, kontrol kepatuhan, dan log di halaman ini hanya contoh tampilan. Perubahan disimpan lokal dan tidak memberi atau mencabut akses, menghubungkan API, maupun menegakkan aturan pada server.
              </p>
            </div>
            <span className="text-[9px] font-semibold tracking-wide text-amber-800 sm:text-right">TIDAK TERHUBUNG KE SERVER</span>
          </aside>

          <motion.section
            className="scroll-mt-36 overflow-hidden rounded-lg border border-[#DDE3EA] bg-white shadow-[0_2px_8px_rgb(19_27_46_/_4%)]"
            id="staff-access"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6EBF0] px-4 py-3.5 sm:px-5">
              <div>
                <h2 className="text-sm font-bold text-[#29364C]">Manajemen Staf Verifikator</h2>
                <p className="mt-1 text-[10px] text-[#718096]">Daftar contoh tampilan akun dan peran pengelola.</p>
              </div>
              <span className="rounded border border-blue-200 bg-blue-50 px-2 py-1 text-[8px] font-bold text-blue-700">DATA AKUN CONTOH</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead className="bg-[#F1F2FC] text-[9px] font-bold text-[#536176]">
                  <tr>
                    <th className="px-3 py-2.5">Nama &amp; ID</th>
                    <th className="px-3 py-2.5">Peran Penugasan</th>
                    <th className="px-3 py-2.5">Akses Contoh</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5">Aktivitas Akun</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6EBF0] text-[10px]">
                  {demoStaff.map((staff, index) => (
                    <tr className="hover:bg-[#FBFCFD]" key={staff.identity}>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className={`grid size-7 shrink-0 place-items-center rounded-full text-[9px] font-bold text-white ${index === 0 ? "bg-[#087C67]" : index === 1 ? "bg-[#0873A5]" : "bg-slate-500"}`}>
                            D{index + 1}
                          </span>
                          <span>
                            <strong className="block text-[#29364C]">{staff.name}</strong>
                            <span className="mt-0.5 block text-[8px] text-[#7C899A]">{staff.identity}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex max-w-[170px] rounded border border-blue-200 bg-blue-50 px-2 py-1 text-[8px] font-bold leading-3 text-blue-800">{staff.role}</span>
                      </td>
                      <td className="px-3 py-3 text-[#536176]">{staff.access}</td>
                      <td className="px-3 py-3">
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[8px] font-bold text-emerald-700">{staff.status}</span>
                      </td>
                      <td className="px-3 py-3 text-[9px] text-[#718096]">Tidak tersedia pada mode lokal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-[#E6EBF0] px-4 py-2.5 text-[9px] text-[#718096] sm:px-5">
              Data staf dan status akses di atas merupakan placeholder visual, bukan akun pengguna aktif.
            </div>
          </motion.section>

          <motion.section
            className="scroll-mt-36 overflow-hidden rounded-lg border border-[#DDE3EA] bg-white p-4 shadow-[0_2px_8px_rgb(19_27_46_/_4%)] sm:p-5"
            id="api-integrations"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18, delay: shouldReduceMotion ? 0 : 0.04 }}
          >
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#29364C]">Integrasi Layanan Eksternal</h2>
                <p className="mt-1 text-[10px] leading-4 text-[#718096]">Koneksi API belum dikonfigurasi pada aplikasi ini.</p>
              </div>
              <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[8px] font-bold text-slate-600">STATUS: BELUM TERHUBUNG</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { name: "BNPB", title: "Badan Nasional Penanggulangan Bencana", detail: "Endpoint dan kredensial API belum dikonfigurasi." },
                { name: "BMKG", title: "Badan Meteorologi, Klimatologi, dan Geofisika", detail: "Endpoint dan kredensial API belum dikonfigurasi." },
              ].map((service) => (
                <article className="rounded-md border border-[#DDE3EA] bg-[#F8FAFC] p-3.5" key={service.name}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-md border border-teal-200 bg-teal-50 text-[10px] font-extrabold text-teal-800">{service.name}</span>
                      <div>
                        <h3 className="text-[11px] font-bold text-[#344258]">{service.title}</h3>
                        <p className="mt-1 text-[9px] leading-4 text-[#718096]">{service.detail}</p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[8px] font-bold text-amber-800">BELUM AKTIF</span>
                  </div>
                </article>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="scroll-mt-36 overflow-hidden rounded-lg border border-[#DDE3EA] bg-white p-4 shadow-[0_2px_8px_rgb(19_27_46_/_4%)] sm:p-5"
            id="system-controls"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18, delay: shouldReduceMotion ? 0 : 0.08 }}
          >
            <div className="mb-3">
              <h2 className="text-sm font-bold text-[#29364C]">Parameter Kepatuhan &amp; Sistem</h2>
              <p className="mt-1 text-[10px] leading-4 text-[#718096]">Kontrol berikut hanya preferensi demo lokal dan tidak menegakkan kebijakan aplikasi.</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {settingOptions.map((option) => (
                <article className="rounded-md border border-[#D7DFEA] bg-[#F3F4FC] p-3.5" key={option.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[8px] font-bold uppercase tracking-wide text-[#087C67]">{option.label}</span>
                      <h3 className="mt-1 text-[10px] font-bold text-[#344258]">{option.title}</h3>
                    </div>
                    <button
                      aria-checked={settings[option.id]}
                      aria-label={`${option.title} (preferensi demo)`}
                      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087C67] ${
                        settings[option.id] ? "border-[#087C67] bg-[#087C67]" : "border-slate-300 bg-slate-300"
                      }`}
                      onClick={() => setOption(option.id, !settings[option.id])}
                      role="switch"
                      type="button"
                    >
                      <span className={`size-3.5 rounded-full bg-white shadow-sm transition-transform ${settings[option.id] ? "translate-x-[17px]" : "translate-x-[2px]"}`} />
                    </button>
                  </div>
                  <p className="mt-2 min-h-8 text-[9px] leading-4 text-[#5D6A7E]">{option.description}</p>
                  <div className="mt-2 flex items-center justify-between gap-2 rounded border border-[#D1D8E5] bg-white/70 px-2 py-1.5">
                    <span className="font-mono text-[8px] text-[#718096]">Preferensi lokal</span>
                    <span className="text-[8px] font-bold text-[#087C67]">{option.status}</span>
                  </div>
                </article>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="scroll-mt-36 overflow-hidden rounded-lg border border-[#DDE3EA] bg-white shadow-[0_2px_8px_rgb(19_27_46_/_4%)]"
            id="audit-log"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18, delay: shouldReduceMotion ? 0 : 0.12 }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6EBF0] px-4 py-3.5 sm:px-5">
              <div>
                <h2 className="text-sm font-bold text-[#29364C]">Cuplikan Log Audit Sistem</h2>
                <p className="mt-1 text-[10px] text-[#718096]">Contoh struktur tabel; aplikasi belum menyediakan catatan audit aktual.</p>
              </div>
              <span className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-[8px] font-bold text-amber-800">ILUSTRASI · BUKAN LOG AKTUAL</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead className="bg-[#F1F2FC] text-[9px] font-bold text-[#536176]">
                  <tr>
                    <th className="px-3 py-2.5">Waktu</th>
                    <th className="px-3 py-2.5">Pengguna / Aktor</th>
                    <th className="px-3 py-2.5">Alamat / Asal</th>
                    <th className="px-3 py-2.5">Deskripsi Tindakan</th>
                    <th className="px-3 py-2.5">Hash Kriptografi</th>
                    <th className="px-3 py-2.5">Jenis Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6EBF0] text-[9px]">
                  {auditExamples.map((entry, index) => (
                    <tr className="hover:bg-[#FBFCFD]" key={`${entry.action}-${index}`}>
                      <td className="whitespace-nowrap px-3 py-3 font-mono text-[#536176]">{entry.time}</td>
                      <td className="px-3 py-3">
                        <strong className="block text-[#344258]">{entry.actor}</strong>
                        <span className="text-[8px] text-[#718096]">Aktor contoh</span>
                      </td>
                      <td className="px-3 py-3 text-[#718096]">{entry.address}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex rounded bg-blue-50 px-1.5 py-0.5 font-bold text-blue-700">{entry.action}</span>
                        <span className="mt-1 block max-w-[250px] leading-4 text-[#536176]">{entry.description}</span>
                      </td>
                      <td className="px-3 py-3 font-mono text-[#718096]">{entry.fingerprint}</td>
                      <td className="px-3 py-3">
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[8px] font-bold text-amber-800">SIMULASI</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E6EBF0] px-4 py-3 text-[9px] text-[#718096] sm:px-5">
              <span>Log aktual tidak tersedia pada versi demo lokal.</span>
              <button className="font-bold text-[#087C67] hover:underline" onClick={downloadAuditExamples} type="button">Unduh contoh CSV →</button>
            </div>
          </motion.section>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#D9DFE8] py-3 text-[9px] leading-4 text-[#718096]">
            <p>© 2026 Jejak Bencana · Panel administrasi demonstrasi</p>
            <p>Perubahan tidak tersinkron ke server atau akun lain.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
