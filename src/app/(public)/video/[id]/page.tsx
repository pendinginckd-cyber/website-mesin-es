import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { VideoCard } from "@/components/public/video-card";
import { ShareButton } from "@/components/shared/share-button";
import { getVideoById, getVideos } from "@/lib/firestore/videos";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video || !video.isActive) {
    return { title: "Video Tidak Ditemukan" };
  }

  return {
    title: `${video.title} | ${SITE_NAME}`,
    description: video.description,
    alternates: {
      canonical: `${SITE_URL}/video/${id}`,
    },
    openGraph: {
      title: video.title,
      description: video.description,
      images: [{ url: video.thumbnail, width: 1280, height: 720 }],
      url: `${SITE_URL}/video/${id}`,
    },
  };
}

export default async function VideoDetailPage({ params }: PageProps) {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video || !video.isActive) {
    notFound();
  }

  const allVideos = await getVideos({ isActive: true });
  const relatedVideos = allVideos
    .filter((v) => v.category === video.category && v.id !== video.id)
    .slice(0, 3);

  const formattedDate = video.publishedAt
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(video.publishedAt)
    : "";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Video", href: "/video" },
            { label: video.title },
          ]}
        />

        <div className="mt-6">
          <div className="aspect-video rounded-xl overflow-hidden bg-gray-900">
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full capitalize">
              {video.category}
            </span>
            {video.isFeatured && (
              <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                Featured
              </span>
            )}
            {formattedDate && (
              <span className="text-sm text-gray-500">{formattedDate}</span>
            )}
            <div className="ml-auto">
              <ShareButton title={video.title} text={video.description?.slice(0, 120)} />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            {video.title}
          </h1>

          {video.description && (
            <div className="prose prose-gray max-w-none prose-p:text-gray-700 prose-p:leading-relaxed">
              {video.description.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>

        {relatedVideos.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Video Terkait
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedVideos.map((related) => (
                <VideoCard key={related.id} video={related} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <Link
            href="/video"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            ← Kembali ke Video Gallery
          </Link>
        </div>
      </div>
    </div>
  );
}
