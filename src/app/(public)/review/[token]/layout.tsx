import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beri Review Mesin Es Kristal",
  description: "Bagikan pengalaman Anda menggunakan mesin es kristal kami.",
  openGraph: {
    title: "Beri Review Mesin Es Kristal",
    description: "Bagikan pengalaman Anda menggunakan mesin es kristal kami.",
    type: "website",
    images: [
      {
        url: "/icon.png?v=2",
        width: 512,
        height: 512,
        alt: "Mesin Es Kristal",
      },
    ],
  },
};

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
