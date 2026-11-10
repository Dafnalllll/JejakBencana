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
      <main className="mx-auto grid w-[calc(100%-2rem)] max-w-[1180px] flex-1 content-center gap-5 py-6 sm:w-[calc(100%-3rem)]">
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(330px,0.98fr)]">
          <section
            className="flex min-h-[430px] flex-col rounded-[9px] bg-gradient-to-br from-[#00695F] via-[#005B53] to-[#00685E] p-5 text-white sm:p-6"
            aria-labelledby="admin-login-feature-title"
          >
            <span className="inline-flex w-fit items-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-2 py-1 text-[8px] font-semibold text-[#E8FFFA]">
              <svg
                className="size-[13px]"
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
              className="mt-[18px] max-w-[560px] text-[clamp(22px,2.5vw,29px)] font-bold leading-[1.2] tracking-[-0.035em] text-white"
              id="admin-login-feature-title"
            >
              Sistem Pemantauan &amp; Verifikasi Dokumen Dana Siap Pakai (DSP)
            </h1>
            <p className="mt-2.5 max-w-[560px] text-[11px] leading-[18px] text-[#A8DCD4]">
              Portal pengelolaan data demo kasus, catatan DSP, dan dokumen
              rujukan untuk mendukung verifikasi informasi kebencanaan.
            </p>

            <div className="mt-[21px] grid gap-[9px]">
              <article className="flex min-h-[50px] items-center gap-2.5 rounded-[7px] border border-white/10 bg-white/[0.09] px-2.5 py-2">
                <span
                  className="grid size-[26px] shrink-0 place-items-center rounded-[5px] bg-white/10 text-[#B5E5DC]"
                  aria-hidden="true"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="none">
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
                  <strong className="block text-[9px] font-bold leading-[14px] text-white">
                    Keselarasan SK dan realisasi
                  </strong>
                  <p className="mt-0.5 text-[9px] leading-[14px] text-[#A8DCD4]">
                    Data alokasi dan catatan realisasi dapat ditinjau
                    berdampingan.
                  </p>
                </div>
              </article>
              <article className="flex min-h-[50px] items-center gap-2.5 rounded-[7px] border border-white/10 bg-white/[0.09] px-2.5 py-2">
                <span
                  className="grid size-[26px] shrink-0 place-items-center rounded-[5px] bg-white/10 text-[#B5E5DC]"
                  aria-hidden="true"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="none">
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
                  <strong className="block text-[9px] font-bold leading-[14px] text-white">
                    Verifikasi dokumen rujukan
                  </strong>
                  <p className="mt-0.5 text-[9px] leading-[14px] text-[#A8DCD4]">
                    Kelola sumber, tanggal pemeriksaan, dan catatan verifikasi.
                  </p>
                </div>
              </article>
              <article className="flex min-h-[50px] items-center gap-2.5 rounded-[7px] border border-white/10 bg-white/[0.09] px-2.5 py-2">
                <span
                  className="grid size-[26px] shrink-0 place-items-center rounded-[5px] bg-white/10 text-[#B5E5DC]"
                  aria-hidden="true"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="none">
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
                  <strong className="block text-[9px] font-bold leading-[14px] text-white">
                    Jejak pengelolaan data
                  </strong>
                  <p className="mt-0.5 text-[9px] leading-[14px] text-[#A8DCD4]">
                    Perubahan dicatat pada penyimpanan lokal untuk kebutuhan
                    demo.
                  </p>
                </div>
              </article>
            </div>

            <div className="mt-auto border-t border-white/20 pt-3.5">
              <strong className="flex items-center gap-1.5 text-[8px] font-bold tracking-[0.04em] text-[#A8DCD4]">
                <svg
                  className="size-[13px]"
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
              <p className="mt-1.5 text-[9px] leading-[15px] text-[#C0E4DE]">
                Gunakan data demo hanya untuk pengujian antarmuka. Verifikasi
                setiap informasi melalui dokumen resmi sebelum digunakan.
              </p>
            </div>
          </section>

          <section
            className="flex min-h-[430px] flex-col rounded-[9px] border border-[#C9D3D4] bg-white p-5 shadow-[0_2px_5px_rgb(19_27_46_/_3%)] sm:p-[22px] max-lg:min-h-0"
            aria-labelledby="admin-login-title"
          >
            <div className="flex items-center justify-between gap-2.5 border-b border-[#DDE4E4] pb-[13px] max-md:flex-col max-md:items-start">
              <div>
                <span className="mb-1 block text-[8px] font-extrabold tracking-[0.09em] text-[#087C67]">
                  AKSES INTERNAL
                </span>
                <h2
                  className="max-w-[220px] text-xl font-bold leading-[1.25] tracking-[-0.03em] text-[#182238]"
                  id="admin-login-title"
                >
                  Masuk ke Portal Verifikator
                </h2>
                <p className="mt-1 text-[9px] leading-[15px] text-[#66716F]">
                  Gunakan akun yang telah terdaftar untuk melanjutkan.
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#BCEBDD] bg-[#F0FCF7] px-[7px] py-1 text-[7px] font-extrabold text-[#087C67]">
                <svg
                  className="size-[11px]"
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
                className="mt-3 flex items-start gap-[7px] rounded-md border border-[#F2CACA] bg-[#FFF6F6] p-2 text-[9px] leading-[14px] text-[#A12B23]"
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

            <form onSubmit={handleLogin} className="mt-3.5 grid gap-3">
              <label className="grid gap-[5px] text-[9px] font-bold text-[#34413F]">
                <span>Email / username</span>
                <span className="flex min-h-9 items-center gap-2 rounded-md border border-[#CDD8D7] px-[9px] text-[#697875] focus-within:border-[#087C67] focus-within:outline focus-within:outline-[3px] focus-within:outline-[#087C67]/15">
                  <svg
                    className="size-[15px] shrink-0"
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
                    className="h-[34px] w-full min-w-0 border-0 bg-transparent text-[10px] text-[#202D2B] outline-none placeholder:text-[#8A9694]"
                    autoComplete="username"
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="nama@instansi.go.id"
                    required
                    type="text"
                    value={username}
                  />
                </span>
              </label>

              <label className="grid gap-[5px] text-[9px] font-bold text-[#34413F]">
                <span>Kata sandi</span>
                <span className="flex min-h-9 items-center gap-2 rounded-md border border-[#CDD8D7] px-[9px] text-[#697875] focus-within:border-[#087C67] focus-within:outline focus-within:outline-[3px] focus-within:outline-[#087C67]/15">
                  <svg
                    className="size-[15px] shrink-0"
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
                    className="h-[34px] w-full min-w-0 border-0 bg-transparent text-[10px] text-[#202D2B] outline-none placeholder:text-[#8A9694]"
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
                    className="grid size-[28px] shrink-0 place-items-center rounded bg-transparent text-[#697875] hover:bg-[#F1F5F4] hover:text-[#006C62] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#087C67]"
                    onClick={() => setShowPassword((visible) => !visible)}
                    type="button"
                  >
                    {showPassword ? (
                      <svg
                        className="size-4"
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
                        className="size-4"
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
                className="mt-0.5 flex min-h-[38px] items-center justify-center gap-2 rounded-md border border-[#087C67] bg-[#087C67] px-[13px] text-[10px] font-bold text-white transition hover:-translate-y-px hover:bg-[#006257] disabled:cursor-wait disabled:opacity-65"
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

            <div className="mt-auto grid gap-1 border-t border-[#E1E7E6] pt-3 text-[8px] leading-[14px] text-[#677572]">
              <strong className="text-[8px] text-[#40504D]">Akses demo</strong>
              <span className="flex flex-wrap items-center gap-[5px]">
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

        <aside className="flex items-start gap-2 rounded-md border border-[#F3D568] bg-[#FFF5C9] px-3 py-[11px] text-[#9B4A0B]">
          <svg
            className="mt-px size-[15px] shrink-0"
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
            <strong className="block text-[9px] font-extrabold leading-[14px]">
              Batasan Informasi &amp; Integritas Data Publik
            </strong>
            <p className="mt-[3px] text-[9px] leading-[15px]">
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
