"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminSystemSettings from "@/components/AdminSystemSettings";
import DemoDataBanner from "@/components/DemoDataBanner";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("jejak_bencana_auth")) {
      router.push("/login");
      return;
    }
    startTransition(() => setIsAuthorized(true));
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // The demo session is cleared locally even when the endpoint is unavailable.
    }
    localStorage.removeItem("jejak_bencana_auth");
    router.push("/login");
  };

  if (!isAuthorized) {
    return (
      <div className="admin-shell">
        <DemoDataBanner admin />
        <main className="admin-main" aria-live="polite">
          <p className="text-sm text-[#64716F]">Memeriksa sesi admin...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <DemoDataBanner admin />
      <div className="admin-layout">
        <AdminSidebar
          currentStep={0}
          onCreateCase={() => router.push("/admin")}
          onLogout={handleLogout}
          onNavigateToStep={() => router.push("/admin")}
        />
        <AdminSystemSettings />
      </div>
    </div>
  );
}
