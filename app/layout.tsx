import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import GlobalNavigationLoading from "@/components/GlobalNavigationLoading";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jejak Bencana — Informasi Dana Siap Pakai",
  description:
    "Portal informasi publik Dana Siap Pakai (DSP) kebencanaan berbasis dokumen resmi. Bukan platform donasi atau pembayaran.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body>
        <Navbar />
        <GlobalNavigationLoading />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
