"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import FloatingContact from "./FloatingContact";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <div style={{ paddingTop: "66px" }}>
        <Header />
        {children}
        <FloatingContact />
        <Footer />
      </div>
    </>
  );
}