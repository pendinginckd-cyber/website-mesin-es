"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { Video } from "@/types/video";
import { getYouTubeThumbnail } from "@/utils/youtube";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link
      href={`/video/${video.id}`}
      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-video overflow-hidden bg-gray-900">
        <img
          src={getYouTubeThumbnail(video.youtubeId)}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
          }}
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <Play className="w-7 h-7 text-white ml-0.5" fill="white" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full mb-2 capitalize">
          {video.category}
        </span>
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{video.description}</p>
        )}
      </div>
    </Link>
  );
}
