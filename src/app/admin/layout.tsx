"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";

import AdminSidebar from "../components/admin/sidebar";
import AdminHeader from "../components/admin/header";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";
import SessionExpiredModal from "../components/admin/SessionExpiredModal";
import "./admin.css";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

 const isAuthPage =
  pathname === "/" ||
  pathname === "/admin" ||
  pathname === "/forgot-password" ||
  pathname === "/admin/forgot-password" ||
  pathname.startsWith("/reset-password") ||
  pathname.startsWith("/admin/reset-password");

  useInactivityLogout(isAuthPage ? undefined : 60);

  if (isAuthPage) return <>{children}</>;

  return (
    <div className="admin-wrapper">
      <AdminSidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <div className="admin-content">
        <AdminHeader handleDrawerToggle={handleDrawerToggle} />
        <main className="admin-main">{children}</main>
      </div>
      <SessionExpiredModal />
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  );
}