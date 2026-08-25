import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { VideoCard } from "@/components/public/video-card";
import { getVideos, getFeaturedVideos } from "@/lib/firestore/videos";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Video Gallery | ${SITE_NAME}`,
  description: "Lihat langsung bagaimana mesin es kristal kami beroperasi, testimoni pelanggan, dan proses pengiriman.",
  alternates: {
    canonical: `${SITE_URL}/video`,
  },
};

export default async function VideoPage() {
  const featuredVideos = await getFeaturedVideos(1);
  const allVideos = await getVideos({ isActive: true });
  const featuredVideo = featuredVideos.length > 0 ? featuredVideos[0] : allVideos.length > 0 ? allVideos[0] : null;

  const remainingVideos = allVideos.filter((v) => v.id !== featuredVideo?.id);

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

        {featuredVideo && (
          <Link
            href={`/video/${featuredVideo.id}`}
            className="block mb-12 group"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900">
                  <img
                    src={`https://img.youtube.com/vi/${featuredVideo.youtubeId}/maxresdefault.jpg`}
                    alt={featuredVideo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full mb-3 w-fit">
                  Featured
                </span>
                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {featuredVideo.title}
                </h2>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{featuredVideo.description}</p>
                <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full capitalize w-fit">
                  {featuredVideo.category}
                </span>
              </div>
            </div>
          </Link>
        )}

        {remainingVideos.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Semua Video ({remainingVideos.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        )}

        {allVideos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Belum ada video.</p>
          </div>
        )}
      </div>
    </div>
  );
}
