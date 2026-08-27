import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sparepart Mesin Es Kristal",
  description: "Jual sparepart mesin es kristal berkualitas. Tersedia berbagai komponen untuk semua tipe mesin.",
  openGraph: {
    title: "Sparepart Mesin Es Kristal",
    description: "Jual sparepart mesin es kristal berkualitas. Tersedia berbagai komponen untuk semua tipe mesin.",
    type: "website",
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
};

export default function SparepartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
