"use client";

import { useState } from "react";
import AdminSidebar from "../components/admin/sidebar";
import AdminHeader from "../components/admin/header";
import "./admin.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  return (
    <div className="admin-wrapper">
      <AdminSidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <div className="admin-content">
        <AdminHeader handleDrawerToggle={handleDrawerToggle} />
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}