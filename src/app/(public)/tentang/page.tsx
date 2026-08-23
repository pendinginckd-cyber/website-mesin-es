"use client";

import { useState, useEffect } from "react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { useContact } from "@/contexts/contact-context";
import { getAboutContent, getAboutStats, getAboutGallery } from "@/lib/firestore/about";
import { AboutContent, AboutStat, AboutGalleryItem } from "@/types/about";
import {
  Star,
  Award,
  Users,
  Package,
  Shield,
  Zap,
  Heart,
  CheckCircle,
  Target,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, React.ElementType> = {
  star: Star,
  award: Award,
  users: Users,
  package: Package,
  shield: Shield,
  zap: Zap,
  heart: Heart,
  "check-circle": CheckCircle,
};

export default function TentangPage() {
  const { contact } = useContact();
  const [content, setContent] = useState<AboutContent | null>(null);
  const [stats, setStats] = useState<AboutStat[]>([]);
  const [gallery, setGallery] = useState<AboutGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      const [contentData, statsData, galleryData] = await Promise.all([
        getAboutContent(),
        getAboutStats(),
        getAboutGallery(),
      ]);
      setContent(contentData);
      setStats(statsData.filter((s) => s.isActive));
      setGallery(galleryData.filter((g) => g.isActive));
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="aspect-video bg-gray-200 rounded"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  const missionItems = content?.mission
    ? content.mission.split("\n").filter((line) => line.trim())
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Tentang Kami" },
        ]}
      />

      {/* Hero Section */}
      <div className="mt-6 mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {content?.companyName || "Tentang Kami"}
        </h1>

        {content?.heroImage && (
          <div className="aspect-video rounded-xl overflow-hidden mb-8">
            <img
              src={content.heroImage}
              alt={content.companyName || "Tentang Kami"}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {content?.companyDescription && (
          <div className="prose prose-lg max-w-none">
            {content.companyDescription.split("\n").map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Visi & Misi */}
      {(content?.vision || content?.mission) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {content?.vision && (
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">Visi</h2>
              </div>
              {content.vision.split("\n").map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {content?.mission && missionItems.length > 0 && (
            <div className="bg-orange-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-accent" />
                <h2 className="text-xl font-bold text-gray-900">Misi</h2>
              </div>
              <ul className="space-y-2">
                {missionItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Kenapa Memilih Kami (Stats) */}
      {stats.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kenapa Memilih Kami?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = iconMap[stat.icon] || Star;
              return (
                <div
                  key={stat.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Galeri Workshop */}
      {gallery.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Galeri Workshop Kami</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setLightboxIndex(index)}
                className="group relative aspect-video rounded-lg overflow-hidden border border-gray-200"
              >
                <img
                  src={item.imageUrl}
                  alt={item.caption || "Galeri workshop"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-white text-sm truncate">{item.caption}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && gallery[lightboxIndex] && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setLightboxIndex(null)}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {lightboxIndex > 0 && (
            <button
              className="absolute left-4 text-white hover:text-gray-300 p-2"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex - 1);
              }}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {lightboxIndex < gallery.length - 1 && (
            <button
              className="absolute right-4 text-white hover:text-gray-300 p-2"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex + 1);
              }}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={gallery[lightboxIndex].imageUrl}
              alt={gallery[lightboxIndex].caption || "Galeri workshop"}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            {gallery[lightboxIndex].caption && (
              <p className="text-white text-center mt-4 text-sm">
                {gallery[lightboxIndex].caption}
              </p>
            )}
            <p className="text-white/60 text-center mt-2 text-xs">
              Foto {lightboxIndex + 1} dari {gallery.length}
            </p>
          </div>
        </div>
      )}

      {/* Google Maps */}
      {contact?.googleMapsEmbed && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            Lokasi Kami
          </h2>
          {(() => {
            const mapsUrl = contact.googleMapsEmbed.includes('<iframe')
              ? (contact.googleMapsEmbed.match(/src="([^"]+)"/)?.[1] || "")
              : contact.googleMapsEmbed;

            return mapsUrl.startsWith("https://www.google.com/maps/embed?") ? (
              <div className="aspect-video rounded-xl overflow-hidden border border-gray-200">
                <iframe
                  src={mapsUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Kami di Google Maps"
                />
              </div>
            ) : (
              <a
                href={mapsUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-8 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:text-primary hover:border-primary transition-colors"
              >
                <MapPin className="w-5 h-5" />
                Buka di Google Maps
              </a>
            );
          })()}
          {contact?.address && (
            <div className="mt-4 flex items-start gap-2 text-gray-700">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p>{contact.address}</p>
            </div>
          )}
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Tertarik dengan Mesin Es Kristal Kami?</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Hubungi kami untuk konsultasi gratis dan dapatkan penawaran terbaik sesuai kebutuhan Anda.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`https://wa.me/${contact?.whatsappNumber || "6281326440039"}?text=${encodeURIComponent(contact?.whatsappMessage || "Halo saya tertarik dengan mesin es kristal")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Phone className="w-5 h-5" />
            Hubungi via WhatsApp
          </Link>
          <Link
            href="/kontak"
            className="inline-flex items-center justify-center gap-2 bg-white/20 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/30 transition-colors"
          >
            Kirim Pesan
          </Link>
        </div>
      </div>
    </div>
  );
}
