"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import AdminSidebar from "../components/admin/sidebar";
import AdminHeader from "../components/admin/header";
import "./admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const handleDrawerToggle = () =>
    setMobileOpen((prev) => !prev);

  // Hide sidebar & header on login page
  if (pathname === "/admin") {
    return <>{children}</>;
  }

  return (
    <div className="admin-wrapper">
      <AdminSidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={
          handleDrawerToggle
        }
      />

      <div className="admin-content">
        <AdminHeader
          handleDrawerToggle={
            handleDrawerToggle
          }
        />

        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}