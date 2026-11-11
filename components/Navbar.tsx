"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const links = [
  { label: "Beranda", href: "/" },
  { label: "Kasus", href: "/kasus" },
  { label: "Glosarium", href: "/glosarium" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const isPublicRoute =
    pathname === "/" ||
    pathname === "/kasus" ||
    pathname === "/glosarium" ||
    pathname === "/metodologi" ||
    /^\/kasus\/[^/]+\/?$/.test(pathname);

  if (!isPublicRoute) return null;

  const isActive = (href: string) =>
    pathname === href || (href === "/kasus" && pathname.startsWith("/kasus/"));

  return (
    <header className="relative z-30 border-b border-[#DCE7E5] bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-[calc(100%-32px)] max-w-310 items-center justify-between gap-3 sm:min-h-18 sm:w-[calc(100%-48px)] lg:gap-6">
        <Link
          className="inline-flex min-w-0 shrink-0 items-center gap-2.5 text-[#172238] no-underline transition-opacity hover:opacity-85 sm:gap-3"
          href="/"
          onClick={() => setIsOpen(false)}
        >
          <span
            className="grid size-9 shrink-0 place-items-center rounded-xl border border-[#D4EFE8] bg-white shadow-md ring-4 ring-[#E6F4F0] sm:size-10"
            aria-hidden="true"
          >
            <Image
              src="/favicon.ico"
              alt=""
              width={28}
              height={28}
              className="size-6 object-contain sm:size-7"
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] leading-4.5 font-bold tracking-tight sm:text-base sm:leading-6">
              Jejak Bencana
            </span>
            <span className="mt-0.5 block truncate text-[9px] leading-3 text-[#64716F] sm:text-[11px] sm:leading-4">
              Transparansi Dana Kebencanaan
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Navigasi utama"
        >
          {links.map((link) => (
            <Link
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded-full px-3 py-2 text-[13px] leading-5 font-semibold no-underline transition-colors xl:px-4 ${
                isActive(link.href)
                  ? "bg-[#EAF7F3] text-[#006C62] shadow-sm"
                  : "text-[#52627A] hover:bg-[#F1F6F5] hover:text-[#006C62]"
              }`}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            className="hidden min-h-10 items-center justify-center gap-2 rounded-full bg-[#005C55] px-4 text-[12px] font-bold text-white no-underline shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#004943] hover:shadow-lg lg:inline-flex xl:px-5 xl:text-sm"
            href="/admin"
          >
            Portal Admin
            <svg
              className="size-4"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 10h12m-5-5 5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <motion.button
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-site-nav"
            className="grid size-10 place-items-center rounded-full border border-[#CFE2DC] bg-[#F1F8F5] text-[#006C62] shadow-sm transition-colors hover:bg-[#E4F2EC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087C67] lg:hidden"
            onClick={() => setIsOpen((open) => !open)}
            type="button"
            whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 24 }}
          >
            {isOpen ? (
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="m6 6 12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
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
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.nav
            id="mobile-site-nav"
            className="absolute inset-x-0 top-full z-30 grid gap-1 border-b border-[#DCE7E5] bg-white/95 px-4 py-3 shadow-xl backdrop-blur-xl lg:hidden"
            aria-label="Navigasi mobile"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.18,
              ease: "easeOut",
            }}
          >
            {links.map((link) => (
              <Link
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`flex min-h-11 items-center rounded-xl px-4 text-sm font-semibold no-underline transition-colors ${
                  isActive(link.href)
                    ? "bg-[#EAF7F3] text-[#006C62]"
                    : "text-[#52627A] hover:bg-[#F1F6F5] hover:text-[#006C62]"
                }`}
                href={link.href}
                key={link.href}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              className="mt-1 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#005C55] px-4 text-sm font-bold text-white no-underline shadow-md transition-colors hover:bg-[#004943]"
              href="/admin"
              onClick={() => setIsOpen(false)}
            >
              Portal Admin
              <svg
                className="size-4"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 10h12m-5-5 5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
