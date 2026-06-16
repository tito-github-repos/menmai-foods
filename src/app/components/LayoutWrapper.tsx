"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import Header from "./Header";
import Footer from "./Footer";
import FloatingContact from "./FloatingContact";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdmin = useMemo(() => {
    if (typeof window === "undefined") return false;
    const isAdminSubdomain = window.location.hostname.startsWith("admin.");
    const isAdminRoute = pathname.startsWith("/admin");
    return isAdminSubdomain || isAdminRoute;
  }, [pathname]);

  if (isAdmin) return <>{children}</>;

  return (
    <div style={{ paddingTop: "66px" }}>
      <Header />
      {children}
      <FloatingContact />
      <Footer />
    </div>
  );
}