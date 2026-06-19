import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";
import Providers from "./providers";
import LayoutWrapper from "./components/LayoutWrapper";

export const metadata: Metadata = {
  title: "Menmai",
  description: "Fresh homemade Chapathi & Poori delivered to your doorstep",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body>
        <ThemeRegistry>
          <Providers>
            <LayoutWrapper>
              {children}
              {/* <FloatingContact /> */}
            </LayoutWrapper>
          </Providers>
        </ThemeRegistry>
      </body>
    </html>
  );
}
