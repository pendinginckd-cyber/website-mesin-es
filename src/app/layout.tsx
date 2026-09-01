import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import ServiceWorkerRegister from "@/components/pwa/service-worker-register";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mesin Es Kristal Berkualitas | Garansi Resmi & Hemat Listrik",
    template: "%s | Mesin Es Kristal",
  },
  description:
    "Jual mesin es kristal kapasitas 1-10 ton/hari. Garansi resmi, suku cadang lengkap, teknisi siap datang. Konsultasi gratis!",
  keywords: [
    "jual mesin es kristal",
    "harga mesin es kristal",
    "mesin es batu kristal",
    "mesin es kristal murah",
  ],
  authors: [{ name: "Mesin Es Kristal" }],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/icon.png", type: "image/png", sizes: "409x409" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "409x409" }],
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Mesin Es Kristal",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Mesin Es Kristal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/icon.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Mesin Es Kristal",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  interactiveWidget: "resizes-content",
  themeColor: "#0284c7",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} font-sans antialiased`}>
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
