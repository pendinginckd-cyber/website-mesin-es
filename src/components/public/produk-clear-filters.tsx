"use client";

import { useRouter, usePathname } from "next/navigation";
import { X } from "lucide-react";

interface ProdukClearFiltersProps {
  hasFilters: boolean;
}

export function ProdukClearFilters({ hasFilters }: ProdukClearFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (!hasFilters) return null;

  return (
    <button
      onClick={() => router.push(pathname)}
      className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
    >
      <X className="w-4 h-4" />
      Reset Filter
    </button>
  );
}