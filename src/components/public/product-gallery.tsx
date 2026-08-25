"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageLightbox } from "@/components/ui/image-lightbox";

interface ProductGalleryProps {
  thumbnail: string;
  images: string[];
  videoUrl?: string;
  productName: string;
}

export function ProductGallery({ thumbnail, images, videoUrl, productName }: ProductGalleryProps) {
  const [activeTab, setActiveTab] = useState<"gambar" | "video">("gambar");
  const [mainImage, setMainImage] = useState(thumbnail);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const hasVideo = !!videoUrl;
  const validImages = images.filter(img => img && img.trim() !== "");
  const validThumbnail = thumbnail && thumbnail.trim() !== "";
  const allImages = validThumbnail ? [thumbnail, ...validImages.filter(img => img !== thumbnail)] : validImages;
  const hasImages = allImages.length > 0;

  const navigateMainImage = (dir: number) => {
    const currentIndex = allImages.indexOf(mainImage);
    const newIndex = (currentIndex + dir + allImages.length) % allImages.length;
    setMainImage(allImages[newIndex]);
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setActiveTab("gambar"); setIsVideoPlaying(false); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "gambar"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Gambar
        </button>
        {hasVideo && (
          <button
            type="button"
            onClick={() => setActiveTab("video")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "video"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Video
          </button>
        )}
      </div>

      {/* Main Display */}
      <div className="aspect-square max-h-96 rounded-xl overflow-hidden bg-gray-100 relative">
        {activeTab === "gambar" ? (
          hasImages ? (
            <>
              <button
                type="button"
                onClick={() => setLightboxIndex(allImages.indexOf(mainImage))}
                className="w-full h-full"
                aria-label="Lihat gambar besar"
              >
                <Image
                  src={mainImage}
                  alt={productName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <ZoomIn className="w-8 h-8 text-white/70 drop-shadow-lg" />
                </div>
              </button>

              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); navigateMainImage(-1); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
                    aria-label="Gambar sebelumnya"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); navigateMainImage(1); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
                    aria-label="Gambar berikutnya"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-sm">Tidak ada gambar</span>
            </div>
          )
        ) : (
          <div className="relative w-full h-full">
            {!isVideoPlaying ? (
              <button
                type="button"
                onClick={() => setIsVideoPlaying(true)}
                className="relative w-full h-full"
              >
                <img
                  src={`https://img.youtube.com/vi/${videoUrl}/maxresdefault.jpg`}
                  alt={`${productName} - Video`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoUrl}/hqdefault.jpg`;
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </button>
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${videoUrl}?autoplay=1&rel=0`}
                title={`${productName} - Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            )}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {activeTab === "gambar" && allImages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {allImages.slice(0, 8).map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setMainImage(img)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border-2 transition-colors relative ${
                mainImage === img ? "border-primary" : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} - Gambar ${idx + 1}`}
                fill
                className="object-cover"
                sizes="64px"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {hasImages && (
        <ImageLightbox
          images={allImages}
          initialIndex={lightboxIndex ?? 0}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
