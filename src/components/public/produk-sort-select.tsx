"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "default", label: "Urutkan" },
  { value: "price-asc", label: "Harga: Rendah ke Tinggi" },
  { value: "price-desc", label: "Harga: Tinggi ke Rendah" },
  { value: "capacity-asc", label: "Kapasitas: Kecil ke Besar" },
  { value: "capacity-desc", label: "Kapasitas: Besar ke Kecil" },
  { value: "name-asc", label: "Nama: A-Z" },
  { value: "name-desc", label: "Nama: Z-A" },
];

interface ProdukSortSelectProps {
  defaultValue?: string;
}

export function ProdukSortSelect({ defaultValue }: ProdukSortSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSortChange(sort: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === "default") {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="relative">
      <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <select
        value={defaultValue || "default"}
        onChange={(e) => handleSortChange(e.target.value)}
        className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none bg-white text-sm min-w-[180px]"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}