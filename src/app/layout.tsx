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
  // Favicon: use PNG icons for modern browsers
  icons: {
    icon: [
      { url: "/icon.png?v=4", sizes: "32x32", type: "image/png" },
      { url: "/icon.png?v=4", sizes: "192x192", type: "image/png" },
      { url: "/icon.png?v=4", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon.png?v=4",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} font-sans antialiased`}>
      <head>
        <link rel="icon" href="/icon.png?v=5" type="image/png" sizes="32x32" />
        <link rel="icon" href="/icon.png?v=5" type="image/png" sizes="192x192" />
        <link rel="icon" href="/icon.png?v=5" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/icon.png?v=5" />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
