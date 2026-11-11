"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

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

  if (!isPublicRoute) {
    return null;
  }

  const links = [
    { label: "Beranda", href: "/" },
    { label: "Kasus", href: "/kasus" },
    { label: "Glosarium", href: "/glosarium" },
  ];

  return (
    <header
      className={`site-header border-b-[#DCE7E5]! bg-white/90! shadow-sm! backdrop-blur-xl!${pathname === "/" ? " site-header--home" : ""}${pathname.startsWith("/kasus") ? " site-header--cases" : ""}${pathname === "/glosarium" ? " site-header--glossary" : ""}`}
    >
      <div className="site-header__inner min-h-[72px]! w-[92%]! max-w-[1240px]! gap-5! max-md:min-h-[60px]! max-md:w-[calc(100%-32px)]!">
        <Link className="brand gap-3! transition-opacity! hover:opacity-85!" href="/" onClick={() => setIsOpen(false)}>
          <span className="brand__mark h-10! w-10! rounded-xl! border border-[#D4EFE8]! bg-white! shadow-lg! ring-4! ring-[#E6F4F0]!" aria-hidden="true">
            <Image
              src="/favicon.ico"
              alt=""
              width={28}
              height={28}
              className="h-7! w-7! object-contain!"
            />
          </span>
          <span>
            <span className="brand__name text-base! leading-6! tracking-[-0.025em]!">Jejak Bencana</span>
            <span className="brand__caption text-[11px]! leading-4!">Transparansi Dana Kebencanaan</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Navigasi utama">
          {links.map((link) => (
            <Link
              aria-current={
                pathname === link.href ||
                (link.href === "/kasus" && pathname.startsWith("/kasus/"))
                  ? "page"
                  : undefined
              }
              key={link.href}
              href={link.href}
              className={`rounded-full! border-b-0! px-4! py-2.5! text-sm! leading-5! transition-colors! ${pathname === link.href || (link.href === "/kasus" && pathname.startsWith("/kasus/")) ? "bg-[#EAF7F3]! text-[#006C62]! shadow-sm!" : "text-[#52627A]! hover:bg-[#F1F6F5]! hover:text-[#006C62]!"}`}
            >
              {link.label}
            </Link>
          ))}
          <span className="site-nav__external rounded-full! bg-[#F0F6F4]! px-3! py-2! text-[11px]! leading-5!" aria-label="SISTALA-DSP BNPB">
            SISTALA-DSP BNPB
          </span>
        </nav>

        <div className="site-header__actions">
          <Link className="portal-admin-link min-h-11! rounded-full! border-transparent! bg-[#005C55]! px-5! text-sm! text-white! shadow-md! transition-all! hover:-translate-y-0.5! hover:bg-[#004943]! hover:shadow-lg!" href="/admin">
            Portal Admin
            <svg className="ml-2! h-4! w-4!" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <motion.button
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-site-nav"
            className="mobile-menu-button h-11! w-11! rounded-full! border-[#CFE2DC]! bg-[#F1F8F5]! text-[#006C62]! shadow-sm! transition-all! hover:bg-[#E4F2EC]!"
            onClick={() => setIsOpen((open) => !open)}
            type="button"
            whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 24 }}
          >
            {isOpen ? (
              <svg className="h-6! w-6!" width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="h-6! w-6!" width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.nav
            id="mobile-site-nav"
            className="mobile-site-nav rounded-b-2xl! border-[#DCE7E5]! bg-white/95! px-4! pb-5! pt-3! shadow-xl! backdrop-blur-xl!"
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
                aria-current={pathname === link.href || (link.href === "/kasus" && pathname.startsWith("/kasus/")) ? "page" : undefined}
                key={link.href}
                href={link.href}
                className={`min-h-12! rounded-xl! px-4! py-3! text-base! transition-colors! ${pathname === link.href || (link.href === "/kasus" && pathname.startsWith("/kasus/")) ? "bg-[#EAF7F3]! text-[#006C62]!" : "text-[#52627A]! hover:bg-[#F1F6F5]! hover:text-[#006C62]!"}`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <span className="min-h-12! rounded-xl! px-4! py-3! text-xs! font-semibold! text-[#71807F]!">SISTALA-DSP BNPB</span>
            <Link
              className="portal-admin-link min-h-12! rounded-xl! border-transparent! bg-[#005C55]! px-4! text-sm! text-white! shadow-md!"
              href="/admin"
              onClick={() => setIsOpen(false)}
            >
              Portal Admin
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
