import Link from "next/link";
import { YouTubeEmbed } from "@/components/shared/youtube-embed";
import { Video } from "@/types/video";

interface VideoSectionProps {
  videos: Video[];
  title?: string;
}

export function VideoSection({ videos, title = "Lihat Mesin Kami Beroperasi" }: VideoSectionProps) {
  if (videos.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Lihat langsung bagaimana mesin es kristal kami beroperasi dan hasil
            es kristal yang dihasilkan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.slice(0, 3).map((video) => (
            <div key={video.id} className="space-y-3">
              <YouTubeEmbed videoId={video.youtubeId} title={video.title} />
              <h3 className="font-semibold text-gray-900">{video.title}</h3>
              <p className="text-sm text-gray-500 capitalize">{video.category}</p>
            </div>
          ))}
        </div>

        {videos.length > 3 && (
          <div className="text-center mt-10">
            <Link
              href="/video"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
            >
              Lihat Semua Video
              <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
