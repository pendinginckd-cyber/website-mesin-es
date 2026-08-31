"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { COLLECTIONS } from "@/lib/constants";
import { Video } from "@/types/video";
import { getYouTubeThumbnail } from "@/utils/youtube";
import { VideoCard } from "@/components/public/video-card";

function toVideo(doc: QueryDocumentSnapshot): Video {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    publishedAt: data.publishedAt?.toDate(),
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as Video;
}

interface LiveVideoGalleryProps {
  initialVideos: Video[];
}

export function LiveVideoGallery({ initialVideos }: LiveVideoGalleryProps) {
  const [videos, setVideos] = useState<Video[]>(initialVideos);

  useEffect(() => {
    if (!db) return;

    const videoQuery = query(
      collection(db, COLLECTIONS.VIDEOS),
      where("isActive", "==", true),
      orderBy("publishedAt", "desc")
    );

    const unsubscribe = onSnapshot(
      videoQuery,
      (snapshot) => {
        setVideos(snapshot.docs.map(toVideo));
      },
      (error) => {
        console.error("Live video sync error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const featuredVideo = videos.find((v) => v.isFeatured) ?? videos[0];
  const remainingVideos = videos.filter((v) => v.id !== featuredVideo?.id);

  if (videos.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Belum ada video.</p>
      </div>
    );
  }

  return (
    <div>
      {featuredVideo && (
        <Link
          href={`/video/${featuredVideo.id}`}
          className="block mb-12 group"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900">
                <img
                  src={getYouTubeThumbnail(featuredVideo.youtubeId)}
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
    </div>
  );
}