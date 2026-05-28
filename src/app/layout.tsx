import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingContact from "./components/FloatingContact";
import Providers from "./providers";

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
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body style={{ paddingTop: "66px" }}>
        <ThemeRegistry>
          <Providers>
            <Header />
            {children}
            <FloatingContact />
            <Footer />
          </Providers>
        </ThemeRegistry>
      </body>
    </html>
  );
}
