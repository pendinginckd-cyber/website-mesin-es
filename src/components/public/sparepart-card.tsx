import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SparepartCardProps {
  name: string;
  slug: string;
  thumbnail: string;
  priceText: string;
  category?: string;
  stock?: string;
  href?: string;
}

export function SparepartCard({
  name,
  slug,
  thumbnail,
  priceText,
  category,
  stock,
  href,
}: SparepartCardProps) {
  const stockBadgeClass =
    stock === "tersedia"
      ? "bg-green-500 text-white"
      : stock === "indent"
      ? "bg-yellow-500 text-white"
      : stock === "habis"
      ? "bg-red-500 text-white"
      : null;

  return (
    <Link
      href={href || `/sparepart/${slug}`}
      className="block h-full tap-effect"
      aria-label={`Lihat detail ${name}`}
    >
      <Card hover className="h-full flex flex-col group relative overflow-hidden bg-white">
        {stock && stockBadgeClass && (
          <div className="absolute top-2 right-2 z-10" style={{ fontSize: "10px" }}>
            <Badge className={`${stockBadgeClass} px-1.5 py-0.5 shadow-md capitalize`}>
              {stock}
            </Badge>
          </div>
        )}

        <div className="relative overflow-hidden aspect-square bg-gray-100">
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-sm">No Image</span>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col p-2.5">
          <h3 className="font-medium text-gray-900 leading-snug line-clamp-2" style={{ fontSize: "13px" }}>
            {name}
          </h3>

          <div className="mt-1.5">
            <span className="font-bold text-primary text-sm">{priceText}</span>
          </div>

          {category && (
            <div className="mt-0.5 text-gray-500 line-clamp-1 capitalize" style={{ fontSize: "11px" }}>
              {category}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
