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

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
