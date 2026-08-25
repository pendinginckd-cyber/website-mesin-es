"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface ProdukCategoryTabsProps {
  defaultValue?: string;
  categories: string[];
}

export function ProdukCategoryTabs({ defaultValue, categories }: ProdukCategoryTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleCategoryChange(category: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("kategori");
    } else {
      params.set("kategori", category);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  if (categories.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => handleCategoryChange("all")}
        className={`px-4 py-2 text-sm rounded-full border transition-colors ${
          !defaultValue || defaultValue === "all"
            ? "bg-primary text-white border-primary"
            : "bg-white text-gray-700 border-gray-300 hover:border-primary"
        }`}
      >
        Semua
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleCategoryChange(cat)}
          className={`px-4 py-2 text-sm rounded-full border transition-colors ${
            defaultValue === cat
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-300 hover:border-primary"
          }`}
        >
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
      ))}
    </div>
  );
}