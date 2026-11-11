"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { AdminFormStep } from "@/types/admin";

interface AdminSidebarProps {
  onLogout: () => void;
  onCreateCase: () => void;
  onNavigateToStep: (step: AdminFormStep) => void;
  onShowDashboard?: () => void;
  onShowCases?: () => void;
  onShowFunds?: () => void;
  currentStep: AdminFormStep;
  isDashboardActive?: boolean;
  isCasesActive?: boolean;
  isFundsActive?: boolean;
}

const navigationLinks: {
  label: string;
  href?: string;
  step?: AdminFormStep;
  icon: "dashboard" | "cases" | "funds" | "sources" | "glossary" | "settings";
}[] = [
  { label: "Dashboard Ringkasan", href: "/admin#dashboard", icon: "dashboard" },
  { label: "Entri Bencana & Kasus", step: 0, icon: "cases" },
  { label: "Catatan Alokasi & DSP", step: 1, icon: "funds" },
  { label: "Verifikasi Sumber Data", href: "/admin/sumber", icon: "sources" },
  // { label: "Glosarium & Istilah", href: "/admin/glosarium", icon: "glossary" },
  { label: "Pengaturan Sistem", href: "/admin/pengaturan", icon: "settings" },
];

function SidebarIcon({ name }: { name: (typeof navigationLinks)[number]["icon"] }) {
  const paths = {
    dashboard: (
      <>
        <rect x="4" y="4" width="6" height="6" rx=".5" />
        <rect x="14" y="4" width="6" height="6" rx=".5" />
        <rect x="4" y="14" width="6" height="6" rx=".5" />
        <rect x="14" y="14" width="6" height="6" rx=".5" />
      </>
    ),
    cases: (
      <>
        <path d="M12 3 21 19H3L12 3Z" />
        <path d="M12 9v4m0 3h.01" />
      </>
    ),
    funds: (
      <>
        <path d="M3 9h18M5 6l7-3 7 3M5 21h14M7 9v9m5-9v9m5-9v9" />
      </>
    ),
    sources: (
      <>
        <path d="m12 3 2.2 2 3-.1.8 2.9 2.5 1.7-1 2.8 1 2.8-2.5 1.7-.8 2.9-3-.1-2.2 2-2.2-2-3 .1-.8-2.9-2.5-1.7 1-2.8-1-2.8 2.5-1.7.8-2.9 3 .1L12 3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    glossary: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
        <path d="M4 17a2.5 2.5 0 0 1 2.5-2.5H20M8 7h8m-8 3h6" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a7.7 7.7 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a7.7 7.7 0 0 1-1.7-1l-1.7.7-1.4-2.4L7.3 15a7.5 7.5 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a7.7 7.7 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a7.7 7.7 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a7.5 7.5 0 0 1 0 2Z" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export default function AdminSidebar({
  onLogout,
  onCreateCase,
  onNavigateToStep,
  onShowDashboard,
  onShowCases,
  onShowFunds,
  currentStep,
  isDashboardActive,
  isCasesActive,
  isFundsActive,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => setIsMobile(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (!isMobile || !isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobile, isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    if (isMobile) toggleRef.current?.focus();
  };

  return (
    <div className="admin-sidebar-shell">
      {isMobile && (
        <motion.button
          ref={toggleRef}
          aria-label={isOpen ? "Tutup navigasi admin" : "Buka navigasi admin"}
          aria-expanded={isOpen}
          aria-controls="admin-sidebar"
          className="admin-sidebar-toggle"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
          whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
          transition={{ type: "spring", stiffness: 400, damping: 24 }}
        >
          {isOpen ? (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
          <span>Menu admin</span>
        </motion.button>
      )}

      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.button
            aria-label="Tutup menu navigasi"
            className="admin-sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
            onClick={closeMenu}
            tabIndex={-1}
            type="button"
          />
        )}
      </AnimatePresence>

      <motion.aside
        id="admin-sidebar"
        role={isMobile && isOpen ? "dialog" : undefined}
        aria-label="Navigasi admin"
        aria-hidden={isMobile && !isOpen}
        aria-modal={isMobile && isOpen ? true : undefined}
        className={`admin-sidebar${isOpen ? " is-open" : ""}`}
        initial={false}
        animate={{ x: isMobile && !isOpen ? "-100%" : 0 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.24,
          ease: "easeOut",
        }}
        inert={isMobile && !isOpen}
      >
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 3.5 19 6v5.5c0 4.3-2.9 7.3-7 9-4.1-1.7-7-4.7-7-9V6l7-2.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <strong>Admin DSP Portal</strong>
            <span>Sistem Audit Dana Bencana</span>
          </div>
          <button
            ref={closeRef}
            aria-label="Tutup navigasi admin"
            className="admin-sidebar__close"
            onClick={closeMenu}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <button
          className="admin-sidebar__create"
          onClick={() => {
            onCreateCase();
            closeMenu();
          }}
          type="button"
        >
          <span aria-hidden="true">+</span>
          Buat Entri Kasus Baru
        </button>
        <nav className="admin-sidebar__links" aria-label="Navigasi admin">
          {navigationLinks.map((link) => {
            const isActive = link.step === 0
              ? pathname === "/admin" && (isCasesActive ?? currentStep === 0)
              : link.step === 1
                ? pathname === "/admin" && (isFundsActive ?? currentStep === 1)
              : link.step !== undefined
                ? pathname === "/admin" && currentStep === link.step
              : link.href === "/admin#dashboard"
                ? pathname === "/admin" && isDashboardActive
              : link.href === "/admin/sumber"
                ? pathname.startsWith("/admin/sumber")
                : link.href === "/admin/glosarium"
                  ? pathname.startsWith("/admin/glosarium")
                    : link.href === "/admin/pengaturan"
                      ? pathname.startsWith("/admin/pengaturan")
                    : false;
            const className = isActive ? "is-active" : undefined;
            const content = (
              <>
                <SidebarIcon name={link.icon} />
                <span>{link.label}</span>
              </>
            );

            if (typeof link.step === "number") {
              const step = link.step;

              return (
                <button
                  aria-current={isActive ? "page" : undefined}
                  className={className}
                  key={link.label}
                  onClick={() => {
                    if (step === 0 && onShowCases) onShowCases();
                    else if (step === 1 && onShowFunds) onShowFunds();
                    else onNavigateToStep(step);
                    closeMenu();
                  }}
                  type="button"
                >
                  {content}
                </button>
              );
            }

            const href = link.href;
            if (!href) return null;

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={className}
                href={href}
                key={link.label}
                onClick={() => {
                  if (href === "/admin#dashboard") onShowDashboard?.();
                  closeMenu();
                }}
              >
                {content}
              </Link>
            );
          })}
        </nav>
        <div className="admin-sidebar__bottom">
          <Link href="/" onClick={closeMenu}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M14 4h6v6m-10 4L20 4M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6" />
            </svg>
            Buka Portal Publik
          </Link>
          <button onClick={onLogout} type="button">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M10 17l5-5-5-5m5 5H3m9-9h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" />
            </svg>
            Keluar Sistem
          </button>
        </div>
      </motion.aside>
    </div>
  );
}
