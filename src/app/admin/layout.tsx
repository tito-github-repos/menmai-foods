"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import AdminSidebar from "../components/admin/sidebar";
import AdminHeader from "../components/admin/header";
import Providers from "./providers";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";
import SessionExpiredModal from "../components/admin/SessionExpiredModal"; // ← ADD
import "./admin.css";

// ── Inner layout (separate so hook runs inside Providers) ──
function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const isLoginPage = pathname === "/admin";

  // 5 min inactivity logout — only on protected pages, not on login page
  useInactivityLogout(isLoginPage ? undefined : 60);

  // Hide sidebar & header on login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="admin-wrapper">
      <AdminSidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <div className="admin-content">
        <AdminHeader
          handleDrawerToggle={handleDrawerToggle}
        />

        <main className="admin-main">
          {children}
        </main>
      </div>

      {/* Session expired modal */}
      <SessionExpiredModal /> {/* ← ADD */}
    </div>
  );
}

// ── Main layout wraps everything in Providers ──
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </Providers>
  );
}
