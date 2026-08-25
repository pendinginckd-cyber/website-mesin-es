"use client";

import { useState } from "react";
import { X, Filter } from "lucide-react";
import { ProdukCategoryTabs } from "./produk-category-tabs";
import { ProdukSortSelect } from "./produk-sort-select";
import { ProdukPriceRange } from "./produk-price-range";
import { ProdukCapacityRange } from "./produk-capacity-range";

interface FilterState {
  search?: string;
  kategori?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  maxCapacity?: number;
}

interface ProdukFilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentParams: Record<string, string | undefined>;
  priceRange: { min: number; max: number };
  capacityRange: { min: number; max: number };
  categories: string[];
  onApply: (filters: FilterState) => void;
}

export function ProdukFilterBottomSheet({
  isOpen,
  onClose,
  currentParams,
  priceRange,
  capacityRange,
  categories,
  onApply,
}: ProdukFilterBottomSheetProps) {
  // Local state for filters (no URL update until Apply)
  const [localFilters, setLocalFilters] = useState<FilterState>({
    search: currentParams.search,
    kategori: currentParams.kategori,
    sort: currentParams.sort,
    minPrice: currentParams.minPrice ? parseInt(currentParams.minPrice) : undefined,
    maxPrice: currentParams.maxPrice ? parseInt(currentParams.maxPrice) : undefined,
    minCapacity: currentParams.minCapacity ? parseFloat(currentParams.minCapacity) : undefined,
    maxCapacity: currentParams.maxCapacity ? parseFloat(currentParams.maxCapacity) : undefined,
  });

  // Reset local filters when bottom sheet opens
  useState(() => {
    if (isOpen) {
      setLocalFilters({
        search: currentParams.search,
        kategori: currentParams.kategori,
        sort: currentParams.sort,
        minPrice: currentParams.minPrice ? parseInt(currentParams.minPrice) : undefined,
        maxPrice: currentParams.maxPrice ? parseInt(currentParams.maxPrice) : undefined,
        minCapacity: currentParams.minCapacity ? parseFloat(currentParams.minCapacity) : undefined,
        maxCapacity: currentParams.maxCapacity ? parseFloat(currentParams.maxCapacity) : undefined,
      });
    }
  });

  function handleApply() {
    onApply(localFilters);
  }

  function handleReset() {
    setLocalFilters({});
    onApply({});
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto transform transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Filter Produk</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Tutup filter"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Options */}
        <div className="p-4 space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <ProdukCategoryTabs
              defaultValue={localFilters.kategori}
              categories={categories}
              onChange={(kategori) => setLocalFilters({ ...localFilters, kategori })}
            />
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urutkan
            </label>
            <ProdukSortSelect
              defaultValue={localFilters.sort}
              onChange={(sort) => setLocalFilters({ ...localFilters, sort })}
            />
          </div>

          {/* Price Range */}
          <ProdukPriceRange
            min={priceRange.min}
            max={priceRange.max}
            currentMin={localFilters.minPrice}
            currentMax={localFilters.maxPrice}
            onChange={(minPrice, maxPrice) =>
              setLocalFilters({ ...localFilters, minPrice, maxPrice })
            }
          />

          {/* Capacity Range */}
          <ProdukCapacityRange
            min={capacityRange.min}
            max={capacityRange.max}
            currentMin={localFilters.minCapacity}
            currentMax={localFilters.maxCapacity}
            onChange={(minCapacity, maxCapacity) =>
              setLocalFilters({ ...localFilters, minCapacity, maxCapacity })
            }
          />
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors text-gray-700"
          >
            Reset Filter
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Terapkan Filter
          </button>
        </div>
      </div>
    </div>
  );
}