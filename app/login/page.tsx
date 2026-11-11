"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username / Email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      // 1. Try real backend API login (`/api/admin/login`)
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
      });

      if (res.ok) {
        if (typeof window !== "undefined") {
          localStorage.setItem("jejak_bencana_auth", "true");
        }
        router.push("/admin");
        return;
      }

      // If backend returned error response
      let errorMsg = "Kredensial tidak valid.";
      try {
        const errData = await res.json();
        if (errData && errData.errors && errData.errors.length > 0) {
          errorMsg = errData.errors
            .map((err: { message: string }) => err.message)
            .join(", ");
        }
      } catch {
        // ignore json parse error
      }

      // 2. Fallback to demo mode acceptance if offline or backend unavailable
      if (username === "admin" && password === "admin123") {
        if (typeof window !== "undefined") {
          localStorage.setItem("jejak_bencana_auth", "true");
        }
        router.push("/admin");
        return;
      }

      setError(errorMsg);
    } catch {
      // Network error or backend offline -> check demo credentials fallback
      if (username === "admin" && password === "admin123") {
        if (typeof window !== "undefined") {
          localStorage.setItem("jejak_bencana_auth", "true");
        }
        router.push("/admin");
        return;
      }
      setError(
        "Gagal terhubung ke server backend. Gunakan mode demo (admin / admin123).",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8FF] text-[#172235]">
      <main className="mx-auto grid w-[calc(100%-2rem)] max-w-7xl flex-1 content-center gap-7 py-8 sm:w-[calc(100%-3rem)] max-sm:gap-5 max-sm:py-5">
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(380px,0.98fr)] max-lg:gap-5">
          <section
            className="flex min-h-130 flex-col rounded-2xl bg-linear-to-br from-[#00695F] via-[#005B53] to-[#00685E] p-8 text-white shadow-xl shadow-[#005B53]/10 sm:p-9 max-md:min-h-0 max-md:p-6"
            aria-labelledby="admin-login-feature-title"
          >
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-[#E8FFFA]">
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 3 20 7v5c0 4.2-3.4 7.4-8 9-4.6-1.6-8-4.8-8-9V7l8-4Z"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                />
                <path
                  d="m9 12 2 2 4-4"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                />
              </svg>
              Portal Pengawasan &amp; Verifikasi Dokumen
            </span>
            <h1
              className="mt-6 max-w-160 text-[clamp(30px,3.2vw,42px)] font-bold leading-[1.15] tracking-[-0.035em] text-white"
              id="admin-login-feature-title"
            >
              Sistem Pemantauan &amp; Verifikasi Dokumen Dana Siap Pakai (DSP)
            </h1>
            <p className="mt-4 max-w-160 text-base leading-7 text-[#A8DCD4] max-sm:text-sm max-sm:leading-6">
              Portal pengelolaan data demo kasus, catatan DSP, dan dokumen
              rujukan untuk mendukung verifikasi informasi kebencanaan.
            </p>

            <div className="mt-7 grid gap-3">
              <article className="flex min-h-17 items-center gap-4 rounded-xl border border-white/15 bg-white/9 px-4 py-3">
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/10 text-[#B5E5DC]"
                  aria-hidden="true"
                >
                  <svg className="size-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 9h18M5 6l7-3 7 3M5 21h14M7 9v9m5-9v9m5-9v9"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.7"
                    />
                  </svg>
                </span>
                <div>
                  <strong className="block text-sm font-bold leading-5 text-white">
                    Keselarasan SK dan realisasi
                  </strong>
                  <p className="mt-1 text-xs leading-5 text-[#A8DCD4]">
                    Data alokasi dan catatan realisasi dapat ditinjau
                    berdampingan.
                  </p>
                </div>
              </article>
              <article className="flex min-h-17 items-center gap-4 rounded-xl border border-white/15 bg-white/9 px-4 py-3">
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/10 text-[#B5E5DC]"
                  aria-hidden="true"
                >
                  <svg className="size-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="m12 3 2.2 2 3-.1.8 2.9 2.5 1.7-1 2.8 1 2.8-2.5 1.7-.8 2.9-3-.1-2.2 2-2.2-2-3 .1-.8-2.9-2.5-1.7 1-2.8-1-2.8 2.5-1.7.8-2.9 3 .1L12 3Z"
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="m9 12 2 2 4-4"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.7"
                    />
                  </svg>
                </span>
                <div>
                  <strong className="block text-sm font-bold leading-5 text-white">
                    Verifikasi dokumen rujukan
                  </strong>
                  <p className="mt-1 text-xs leading-5 text-[#A8DCD4]">
                    Kelola sumber, tanggal pemeriksaan, dan catatan verifikasi.
                  </p>
                </div>
              </article>
              <article className="flex min-h-17 items-center gap-4 rounded-xl border border-white/15 bg-white/9 px-4 py-3">
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/10 text-[#B5E5DC]"
                  aria-hidden="true"
                >
                  <svg className="size-5" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="4"
                      y="10"
                      width="16"
                      height="11"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                    <path
                      d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="1.7"
                    />
                  </svg>
                </span>
                <div>
                  <strong className="block text-sm font-bold leading-5 text-white">
                    Jejak pengelolaan data
                  </strong>
                  <p className="mt-1 text-xs leading-5 text-[#A8DCD4]">
                    Perubahan dicatat pada penyimpanan lokal untuk kebutuhan
                    demo.
                  </p>
                </div>
              </article>
            </div>

            <div className="mt-auto border-t border-white/20 pt-5">
              <strong className="flex items-center gap-2 text-xs font-bold tracking-[0.04em] text-[#A8DCD4]">
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12 3 3.5 19h17L12 3Z"
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M12 9v4m0 3h.01"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.7"
                  />
                </svg>
                CATATAN PENGGUNAAN
              </strong>
              <p className="mt-2 text-xs leading-5 text-[#C0E4DE]">
                Gunakan data demo hanya untuk pengujian antarmuka. Verifikasi
                setiap informasi melalui dokumen resmi sebelum digunakan.
              </p>
            </div>
          </section>

          <section
            className="flex min-h-130 flex-col rounded-2xl border border-[#C9D3D4] bg-white p-8 shadow-xl shadow-[#172235]/5 sm:p-9 max-lg:min-h-0 max-md:p-6"
            aria-labelledby="admin-login-title"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#DDE4E4] pb-5 max-md:flex-col max-md:items-start">
              <div>
                <span className="mb-2 block text-[11px] font-extrabold tracking-[0.09em] text-[#087C67]">
                  AKSES INTERNAL
                </span>
                <h2
                  className="max-w-[320px] text-2xl font-bold leading-[1.2] tracking-[-0.03em] text-[#182238]"
                  id="admin-login-title"
                >
                  Masuk ke Portal Verifikator
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#66716F]">
                  Gunakan akun yang telah terdaftar untuk melanjutkan.
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#BCEBDD] bg-[#F0FCF7] px-3 py-2 text-[10px] font-extrabold text-[#087C67]">
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="11"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M8 10V7a4 4 0 0 1 8 0v3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
                AKSES TERBATAS
              </span>
            </div>

            {error && (
              <div
                className="mt-4 flex items-start gap-2 rounded-lg border border-[#F2CACA] bg-[#FFF6F6] p-3 text-xs leading-5 text-[#A12B23]"
                role="alert"
              >
                <svg
                  className="size-3.5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M12 8v5m0 3h.01"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.8"
                  />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-6 grid gap-5">
              <label className="grid gap-2 text-sm font-bold text-[#34413F]">
                <span>Email / username</span>
                <span className="flex min-h-12 items-center gap-3 rounded-lg border border-[#CDD8D7] px-3 text-[#697875] focus-within:border-[#087C67]  focus-within:outline-[3px] focus-within:outline-[#087C67]/15">
                  <svg
                    className="size-5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                    <path
                      d="m4 7 8 6 8-6"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.7"
                    />
                  </svg>
                  <input
                    className="h-11 w-full min-w-0 border-0 bg-transparent text-base text-[#202D2B] outline-none placeholder:text-sm placeholder:text-[#8A9694]"
                    autoComplete="username"
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="nama@instansi.go.id"
                    required
                    type="text"
                    value={username}
                  />
                </span>
              </label>

              <label className="grid gap-2 text-sm font-bold text-[#34413F]">
                <span>Kata sandi</span>
                <span className="flex min-h-12 items-center gap-3 rounded-lg border border-[#CDD8D7] px-3 text-[#697875] focus-within:border-[#087C67]  focus-within:outline-[3px] focus-within:outline-[#087C67]/15">
                  <svg
                    className="size-5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="8"
                      cy="15"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                    <path
                      d="m11 12 7-7 3 3-2 2 2 2-3 3-2-2-2 2"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.7"
                    />
                  </svg>
                  <input
                    className="h-11 w-full min-w-0 border-0 bg-transparent text-base text-[#202D2B] outline-none placeholder:text-sm placeholder:text-[#8A9694]"
                    autoComplete="current-password"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Masukkan kata sandi"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                  />
                  <button
                    aria-label={
                      showPassword
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"
                    }
                    className="grid size-10 shrink-0 place-items-center rounded-lg bg-transparent text-[#697875] hover:bg-[#F1F5F4] hover:text-[#006C62]  focus-visible:outline-2 focus-visible:outline-[#087C67]"
                    onClick={() => setShowPassword((visible) => !visible)}
                    type="button"
                  >
                    {showPassword ? (
                      <svg
                        className="size-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 3 21 21M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 5.2A10.7 10.7 0 0 1 12 5c5.2 0 8.7 4.5 9.5 6-.3.6-1.2 1.8-2.7 3M6.2 6.2C4.2 7.5 2.9 9.5 2.5 11c.5 1 3.9 6 9.5 6 1 0 1.9-.2 2.7-.5"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="size-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                          stroke="currentColor"
                          strokeLinejoin="round"
                          strokeWidth="1.7"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="2.5"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                      </svg>
                    )}
                  </button>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex min-h-12 items-center justify-center gap-3 rounded-lg border border-[#087C67] bg-[#087C67] px-5 text-sm font-bold text-white shadow-md transition hover:-translate-y-px hover:bg-[#006257] hover:shadow-lg disabled:cursor-wait disabled:opacity-65"
              >
                {loading
                  ? "Memproses autentikasi..."
                  : "Masuk ke Dashboard Admin"}
                {!loading && (
                  <span className="text-base font-normal" aria-hidden="true">
                    →
                  </span>
                )}
              </button>
            </form>

            <div className="mt-auto grid gap-2 border-t border-[#E1E7E6] pt-5 text-xs leading-5 text-[#677572]">
              <strong className="text-sm text-[#40504D]">Akses demo</strong>
              <span className="flex flex-wrap items-center gap-2">
                Username{" "}
                <code className="rounded-sm bg-[#F0F5F3] px-1 py-px font-bold text-[#006C62]">
                  admin
                </code>
                <span aria-hidden="true">·</span>
                Kata sandi{" "}
                <code className="rounded-sm bg-[#F0F5F3] px-1 py-px font-bold text-[#006C62]">
                  admin123
                </code>
              </span>
            </div>
          </section>
        </div>

        <aside className="flex items-start gap-3 rounded-lg border border-[#F3D568] bg-[#FFF5C9] px-5 py-4 text-[#9B4A0B]">
          <svg
            className="mt-0.5 size-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M12 11v5m0-8h.01"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
          </svg>
          <div>
            <strong className="block text-sm font-extrabold leading-5">
              Batasan Informasi &amp; Integritas Data Publik
            </strong>
            <p className="mt-1 text-xs leading-5">
              Portal ini menyajikan data contoh pemantauan{" "}
              <b>Dana Siap Pakai (DSP)</b> berdasarkan rujukan dokumen. Portal
              ini <b>bukan platform donasi</b> dan tidak mengelola rekening atau
              penggalangan dana. Verifikasi informasi melalui dokumen resmi
              sebelum digunakan.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
