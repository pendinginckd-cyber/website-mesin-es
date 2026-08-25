"use client";

import { ProdukSearchInput } from "./produk-search-input";
import { ProdukCategoryTabs } from "./produk-category-tabs";
import { ProdukSortSelect } from "./produk-sort-select";
import { ProdukPriceRange } from "./produk-price-range";
import { ProdukCapacityRange } from "./produk-capacity-range";
import { ProdukCountDisplay } from "./produk-count-display";
import { ProdukClearFilters } from "./produk-clear-filters";

interface ProdukFilterBarProps {
  currentParams: Record<string, string | undefined>;
  totalProducts: number;
  filteredCount: number;
  priceRange: { min: number; max: number };
  capacityRange: { min: number; max: number };
  categories: string[];
}

export function ProdukFilterBar({
  currentParams,
  totalProducts,
  filteredCount,
  priceRange,
  capacityRange,
  categories,
}: ProdukFilterBarProps) {
  const hasFilters = Object.keys(currentParams).some(
    (key) => currentParams[key] && currentParams[key] !== "all"
  );

  return (
    <div className="mb-8 space-y-6">
      {/* Top Row: Search, Categories, Sort, Clear */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
          <ProdukSearchInput defaultValue={currentParams.search} />
          <ProdukCategoryTabs defaultValue={currentParams.kategori} categories={categories} />
        </div>
        <div className="flex gap-4 items-center w-full lg:w-auto">
          <ProdukSortSelect defaultValue={currentParams.sort} />
          <ProdukClearFilters hasFilters={hasFilters} />
        </div>
      </div>

      {/* Range Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white rounded-lg border border-gray-200">
        <ProdukPriceRange
          min={priceRange.min}
          max={priceRange.max}
          currentMin={currentParams.minPrice ? parseInt(currentParams.minPrice) : undefined}
          currentMax={currentParams.maxPrice ? parseInt(currentParams.maxPrice) : undefined}
        />
        <ProdukCapacityRange
          min={capacityRange.min}
          max={capacityRange.max}
          currentMin={currentParams.minCapacity ? parseFloat(currentParams.minCapacity) : undefined}
          currentMax={currentParams.maxCapacity ? parseFloat(currentParams.maxCapacity) : undefined}
        />
      </div>

      {/* Product Count */}
      <ProdukCountDisplay total={totalProducts} filtered={filteredCount} />
    </div>
  );
}