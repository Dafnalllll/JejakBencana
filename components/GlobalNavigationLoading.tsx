"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import GlobalLoadingView from "@/components/GlobalLoadingView";

interface LoadingStatus {
  visible: boolean;
  pathname: string;
}

export default function GlobalNavigationLoading() {
  const pathname = usePathname();
  const [loading, setLoading] = useState<LoadingStatus>(() => ({
    visible: true,
    pathname,
  }));
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearTimers = () => {
      if (revealTimer.current) clearTimeout(revealTimer.current);
      if (clearTimer.current) clearTimeout(clearTimer.current);
      revealTimer.current = null;
      clearTimer.current = null;
    };

    const dismissInitialOverlay = setTimeout(() => {
      setLoading((current) =>
        current.pathname === pathname ? { ...current, visible: false } : current,
      );
    }, 300);

    const startLoading = () => {
      clearTimers();
      revealTimer.current = setTimeout(() => {
        setLoading({ visible: true, pathname: window.location.pathname });
      }, 120);
      clearTimer.current = setTimeout(() => {
        setLoading((current) => ({ ...current, visible: false }));
      }, 10000);
    };

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.target || link.hasAttribute("download")) return;

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === window.location.pathname) return;

      startLoading();
    };

    const handlePopState = () => startLoading();

    document.addEventListener("click", handleClick);
    window.addEventListener("popstate", handlePopState);

    return () => {
      clearTimeout(dismissInitialOverlay);
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", handlePopState);
      clearTimers();
    };
  }, [pathname]);

  if (!loading.visible || loading.pathname !== pathname) return null;

  return (
    <div className="global-loading-overlay" aria-busy="true">
      <GlobalLoadingView />
    </div>
  );
}
