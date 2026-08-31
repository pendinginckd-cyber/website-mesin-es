import { Breadcrumb } from "@/components/shared/breadcrumb";
import { LiveVideoGallery } from "@/components/public/live-video-gallery";
import { getVideos } from "@/lib/firestore/videos";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Video Gallery | ${SITE_NAME}`,
  description: "Lihat langsung bagaimana mesin es kristal kami beroperasi, testimoni pelanggan, dan proses pengiriman.",
  alternates: {
    canonical: `${SITE_URL}/video`,
  },
};

export default async function VideoPage() {
  const allVideos = await getVideos({ isActive: true });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Video" },
          ]}
        />

        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Video Gallery
          </h1>
          <p className="text-lg text-gray-600">
            Lihat langsung bagaimana mesin es kristal kami beroperasi dan testimoni pelanggan.
          </p>
        </div>

        <LiveVideoGallery initialVideos={allVideos} />
      </div>
    </div>
  );
}