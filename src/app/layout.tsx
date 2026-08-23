import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
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
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Mesin Es Kristal",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} font-sans antialiased`}>
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
