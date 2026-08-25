"use client";

import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import { ProdukCategoryTabs } from "./produk-category-tabs";
import { ProdukSortSelect } from "./produk-sort-select";
import { ProdukPriceRange } from "./produk-price-range";
import { ProdukCapacityRange } from "./produk-capacity-range";
import { ProdukClearFilters } from "./produk-clear-filters";
import { ProdukCountDisplay } from "./produk-count-display";

interface ProdukFilterSidebarProps {
  currentParams: Record<string, string | undefined>;
  totalProducts: number;
  filteredCount: number;
  priceRange: { min: number; max: number };
  capacityRange: { min: number; max: number };
  categories: string[];
  isOpen: boolean;
  onToggle: () => void;
}

function getFilterCount(params: Record<string, string | undefined>): number {
  let count = 0;
  if (params.search) count++;
  if (params.kategori) count++;
  if (params.sort) count++;
  if (params.minPrice || params.maxPrice) count++;
  if (params.minCapacity || params.maxCapacity) count++;
  return count;
}

export function ProdukFilterSidebar({
  currentParams,
  totalProducts,
  filteredCount,
  priceRange,
  capacityRange,
  categories,
  isOpen,
  onToggle,
}: ProdukFilterSidebarProps) {
  const filterCount = getFilterCount(currentParams);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900">Filter Produk</span>
          {filterCount > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
              {filterCount}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Filter Content */}
      {isOpen && (
        <div className="border-t border-gray-200 p-4 space-y-6">
          {/* Category Tabs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <ProdukCategoryTabs
              defaultValue={currentParams.kategori}
              categories={categories}
            />
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urutkan
            </label>
            <ProdukSortSelect defaultValue={currentParams.sort} />
          </div>

          {/* Price Range */}
          <ProdukPriceRange
            min={priceRange.min}
            max={priceRange.max}
            currentMin={currentParams.minPrice ? parseInt(currentParams.minPrice) : undefined}
            currentMax={currentParams.maxPrice ? parseInt(currentParams.maxPrice) : undefined}
          />

          {/* Capacity Range */}
          <ProdukCapacityRange
            min={capacityRange.min}
            max={capacityRange.max}
            currentMin={currentParams.minCapacity ? parseFloat(currentParams.minCapacity) : undefined}
            currentMax={currentParams.maxCapacity ? parseFloat(currentParams.maxCapacity) : undefined}
          />

          {/* Clear Filters */}
          <div className="pt-4 border-t border-gray-200">
            <ProdukClearFilters
              hasFilters={filterCount > 0}
            />
          </div>

          {/* Product Count */}
          <ProdukCountDisplay total={totalProducts} filtered={filteredCount} />
        </div>
      )}
    </div>
  );
}