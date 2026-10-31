"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DemoDataBanner from "@/components/DemoDataBanner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Demo authentication acceptance
      if (username === "admin" && password === "admin123") {
        if (typeof window !== "undefined") {
          localStorage.setItem("jejak_bencana_auth", "true");
        }
        router.push("/admin");
      } else {
        setError("Kredensial demo salah. Gunakan username: admin, password: admin123");
      }
    }, 600);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <DemoDataBanner />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
          <div className="space-y-2 text-center">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Mode Demo Admin</span>
            <h1 className="text-xl font-extrabold text-zinc-900 dark:text-white">Login Dashboard Admin</h1>
            <p className="text-xs text-zinc-500">Kelola data kasus bencana, catatan DSP, dan publikasi informasi.</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Username / Email</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: admin"
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contoh: admin123"
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
            >
              {loading ? "Memproses Autentikasi..." : "Masuk ke Dashboard"}
            </button>
          </form>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center text-[11px] text-zinc-500 space-y-1">
            <p>Hint Demo: Username <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-emerald-600">admin</code> | Password <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-emerald-600">admin123</code></p>
            <p><Link href="/" className="text-emerald-600 hover:underline">&larr; Kembali ke Beranda Publik</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
