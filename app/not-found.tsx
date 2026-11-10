import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[calc(100vh-72px)] place-items-center bg-[radial-gradient(ellipse_at_50%_42%,rgb(226_231_255_/_70%),transparent_55%),var(--surface)] px-6 py-12 max-md:min-h-[calc(100vh-60px)] max-md:px-4 max-md:py-8">
      <section
        className="motion-safe:animate-[not-found-enter_360ms_ease-out_both] grid w-full max-w-[560px] justify-items-center rounded-[20px] border border-[#005C55]/10 bg-white/95 p-[42px_44px_30px] text-center shadow-[0_18px_55px_rgb(19_27_46_/_8%),0_2px_8px_rgb(19_27_46_/_4%)] max-md:p-[32px_22px_24px]"
        aria-labelledby="not-found-title"
      >
        <div className="relative mb-[22px] grid size-[142px] place-items-center text-[#005C55]" aria-hidden="true">
          <span className="absolute size-[112px] rounded-full border border-[#005C55]/10" />
          <span className="absolute size-[82px] rounded-full border border-[#005C55]/10 bg-[#F2F3FF]/75" />
          <span className="relative z-[1] mt-[3px] text-[31px] font-extrabold tracking-[-0.07em]">
            404
          </span>
          <span className="absolute top-[9px] right-2 z-[2] grid size-[34px] place-items-center rounded-full border-[3px] border-white bg-[#FE932C] text-white shadow-[0_3px_10px_rgb(144_77_0_/_20%)]">
            <svg className="size-[18px] fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24">
              <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
              <circle cx="12" cy="10" r="2.3" />
            </svg>
          </span>
        </div>

        <span className="text-[9px] leading-[14px] font-extrabold tracking-[0.13em] text-[#005C55]">
          HALAMAN TIDAK TERSEDIA
        </span>
        <h1
          className="mt-[9px] text-[clamp(23px,4vw,29px)] leading-[1.2] font-bold tracking-[-0.045em] text-[#131B2E]"
          id="not-found-title"
        >
          Jejak ini belum ditemukan
        </h1>
        <p className="mt-[11px] max-w-[390px] text-[13px] leading-[21px] text-[#64716F]">
          Tautan mungkin sudah berubah atau alamat yang Anda masukkan kurang
          tepat. Mari kembali ke informasi yang tersedia.
        </p>

        <div className="mt-[25px] flex w-full flex-wrap justify-center gap-[10px] max-md:flex-col">
          <Link
            className="inline-flex min-h-[43px] items-center justify-center gap-[9px] rounded-[7px] border border-[#005C55] bg-[#005C55] px-4 text-xs font-bold text-white no-underline transition-[background-color,color,transform] duration-[140ms] ease-out hover:-translate-y-px hover:bg-[#004943] motion-reduce:transition-none max-md:w-full"
            href="/"
          >
            Kembali ke Beranda
            <svg className="size-[15px] fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.8]" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 10h12m-5-5 5 5-5 5" />
            </svg>
          </Link>
          <Link
            className="inline-flex min-h-[43px] items-center justify-center gap-[9px] rounded-[7px] border border-[#005C55] bg-white px-4 text-xs font-bold text-[#005C55] no-underline transition-[background-color,color,transform] duration-[140ms] ease-out hover:-translate-y-px hover:bg-[#F2F3FF] motion-reduce:transition-none max-md:w-full"
            href="/kasus"
          >
            Lihat Daftar Kasus
          </Link>
        </div>

        <span className="mt-7 w-full border-t border-[#E9ECEF] pt-[18px] text-[8px] font-extrabold tracking-[0.12em] text-[#84908F]">
          JEJAK BENCANA · INFORMASI PUBLIK
        </span>
      </section>
    </main>
  );
}
