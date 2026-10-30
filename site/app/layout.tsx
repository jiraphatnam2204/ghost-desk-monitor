import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Sarabun } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "@/components/iso/iso.css";
import "./globals.css";
import "./chrome.css";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "600", "700", "800"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ghost-Desk Monitor",
    template: "%s · Ghost-Desk Monitor",
  },
  description:
    "ป้ายบนโต๊ะห้องสมุดที่รู้จริงว่ามีคนนั่ง: AI บน gateway จาก mmWave + ToF และ cloud AI จากภาพ ปล่อยโต๊ะที่ถูกทิ้งไว้เกิน 30 นาทีเอง · Embedded System (CEDT) Final Project 2026",
};

export const viewport: Viewport = {
  themeColor: "#f8f9fb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={`${sarabun.variable} ${mono.variable}`}>
      <body className="iso" data-theme="light">
        <a className="skip" href="#main">
          ข้ามไปที่เนื้อหา
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
