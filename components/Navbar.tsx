"use client";

import Link from "next/link";
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
      className={`site-header${pathname === "/" ? " site-header--home" : ""}${pathname.startsWith("/kasus") ? " site-header--cases" : ""}${pathname === "/glosarium" ? " site-header--glossary" : ""}`}
    >
      <div className="site-header__inner">
        <Link className="brand" href="/" onClick={() => setIsOpen(false)}>
          <span className="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 3.5 19 6v5.5c0 4.3-2.9 7.3-7 9-4.1-1.7-7-4.7-7-9V6l7-2.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="m9.2 11.8 1.8 1.8 3.8-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>
            <span className="brand__name">Jejak Bencana</span>
            <span className="brand__caption">Informasi Dana Siap Pakai</span>
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
            >
              {link.label}
            </Link>
          ))}
          <span className="site-nav__external" aria-label="SISTALA-DSP BNPB">
            SISTALA-DSP BNPB
          </span>
        </nav>

        <div className="site-header__actions">
          <Link className="portal-admin-link" href="/admin">
            Portal Admin
          </Link>
          <motion.button
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-site-nav"
            className="mobile-menu-button"
            onClick={() => setIsOpen((open) => !open)}
            type="button"
            whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 24 }}
          >
            {isOpen ? (
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
            className="mobile-site-nav"
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
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <span>SISTALA-DSP BNPB</span>
            <Link
              className="portal-admin-link"
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
