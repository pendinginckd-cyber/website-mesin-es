"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Scale } from "lucide-react";
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
    <Card hover className="h-full flex flex-col group relative overflow-hidden bg-white">
      {certBadge && (
        <div className="absolute top-2 left-2 z-10" style={{ fontSize: "10px" }}>
          <Badge variant="success" className="px-1.5 py-0.5 shadow-md">
            {certBadge}
          </Badge>
        </div>
      )}

      <Link
        href={`/produk/${product.slug}`}
        className="block relative overflow-hidden aspect-square tap-effect"
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

      <CardContent className="flex-1 flex flex-col p-2.5">
        <h3 className="font-medium text-gray-900 leading-snug line-clamp-2" style={{ fontSize: "13px" }}>
          <Link
            href={`/produk/${product.slug}`}
            className="hover:text-primary transition-colors"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-1.5">
          <span className="font-bold text-primary text-sm">{priceText}</span>
          <span className="text-gray-400 ml-1" style={{ fontSize: "10px" }}>/ unit</span>
        </div>

        <div className="mt-0.5 text-gray-500 line-clamp-1" style={{ fontSize: "11px" }}>
          {product.capacity}
          {product.power ? ` • ${product.power}` : ""}
        </div>

        <div className="mt-auto pt-2 flex items-center gap-1.5">
          <Link
            href={`https://wa.me/${waNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 bg-primary hover:bg-primary-dark text-white rounded-md py-1.5 transition-colors tap-effect"
            style={{ fontSize: "11px" }}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Nego
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
            aria-label={inComparison ? "Hapus dari perbandingan" : "Bandingkan produk"}
            className={`w-8 h-8 shrink-0 flex items-center justify-center border rounded-md transition-colors tap-effect ${
              inComparison
                ? "bg-primary text-white border-primary"
                : comparison.isFull
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : "border-gray-300 text-primary hover:bg-primary hover:text-white hover:border-primary"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
