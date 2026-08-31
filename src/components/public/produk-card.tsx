"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, Scale } from "lucide-react";
import { Card, CardImage, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { useContact } from "@/contexts/contact-context";
import { useComparison } from "@/lib/comparison-store";
import { COMPARISON_MAX, SITE_URL } from "@/lib/constants";

interface ProdukCardProps {
  product: Product;
}

export function ProdukCard({ product }: ProdukCardProps) {
  const { contact } = useContact();
  const waNumber = contact?.whatsappNumber || "6281326440039";
  const comparison = useComparison();
  const inComparison = comparison.has(product.id);

  const certBadge = product.certifications?.length
    ? product.certifications.join(", ")
    : null;

  const priceText = product.priceDisplay || `Rp ${product.price?.toLocaleString("id-ID")}`;
  const whatsappMessage = encodeURIComponent(
    `Halo, saya tertarik dengan ${product.name} - ${priceText}\n\n${SITE_URL}/produk/${product.slug}`
  );

  return (
    <Card hover className="h-full flex flex-col group relative overflow-hidden">
      {certBadge && (
        <div className="absolute top-3 left-3 z-10" style={{ fontSize: "11px" }}>
          <Badge variant="success" className="px-2 py-1 shadow-md">
            {certBadge}
          </Badge>
        </div>
      )}

      <Link
        href={`/produk/${product.slug}`}
        className="block relative overflow-hidden aspect-[4/3] tap-effect"
        aria-label={`Lihat detail ${product.name}`}
      >
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
        />
      </Link>

      <CardContent className="flex-1 flex flex-col p-3">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2" style={{ fontSize: "13px" }}>
          <Link
            href={`/produk/${product.slug}`}
            className="hover:text-primary transition-colors"
          >
            {product.name}
          </Link>
        </h3>

        <div className="space-y-0.5 mb-0.5" style={{ fontSize: "10px" }}>
          <div className="text-gray-700 line-clamp-1">
            Kapasitas: {product.capacity}
          </div>

          {product.power && (
            <div className="text-gray-700 line-clamp-1">
              Daya: {product.power}
            </div>
          )}
        </div>

        <div className="mb-0.5">
          <span className="font-bold text-primary" style={{ fontSize: "10px" }}>
            {priceText}
          </span>
          <span className="text-gray-500 ml-1" style={{ fontSize: "11px" }}>/ unit</span>
        </div>

        <div className="mt-auto flex flex-col gap-2" style={{ fontSize: "11px" }}>
          <Link
            href={`/produk/${product.slug}`}
            className="text-primary font-medium hover:underline inline-flex items-center gap-1 tap-effect"
          >
            Lihat Spesifikasi
            <ArrowRight className="w-3 h-3" />
          </Link>
          <Link
            href={`https://wa.me/${waNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium hover:underline inline-flex items-center gap-1 tap-effect"
          >
            <MessageCircle className="w-3 h-3" />
             Nego Harga
          </Link>
          <button
            type="button"
            onClick={() => comparison.toggle(product.id)}
            disabled={comparison.isFull && !inComparison}
            title={
              comparison.isFull && !inComparison
                ? `Maksimal ${COMPARISON_MAX} produk untuk dibandingkan`
                : inComparison
                ? "Hapus dari perbandingan"
                : "Tambahkan ke perbandingan"
            }
            className={`flex items-center justify-center gap-1.5 border rounded-lg py-1.5 px-2 transition-colors tap-effect ${
              inComparison
                ? "bg-primary text-white border-primary"
                : comparison.isFull
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : "border-primary/30 text-primary hover:bg-primary hover:text-white"
            }`}
          >
            <Scale className="w-3 h-3" />
            {inComparison ? "Sedang Dibanding" : "Bandingkan"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
