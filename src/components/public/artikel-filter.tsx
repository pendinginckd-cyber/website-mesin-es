"use client";

import { useRouter } from "next/navigation";

interface ArtikelFilterProps {
  categories: string[];
  activeCategory: string;
}

export function ArtikelFilter({ categories, activeCategory }: ArtikelFilterProps) {
  const router = useRouter();

  const handleCategoryChange = (category: string) => {
    if (category === "Semua") {
      router.push("/artikel");
    } else {
      router.push(`/artikel?kategori=${encodeURIComponent(category)}`);
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-8">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => handleCategoryChange(category)}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            activeCategory === category
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}