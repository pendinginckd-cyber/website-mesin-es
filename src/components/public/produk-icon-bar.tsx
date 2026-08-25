"use client";

import { Search, Filter, Menu } from "lucide-react";

interface ProdukIconBarProps {
  onSearchClick: () => void;
  onFilterClick: () => void;
  onMenuClick?: () => void;
  filterCount: number;
}

export function ProdukIconBar({
  onSearchClick,
  onFilterClick,
  onMenuClick,
  filterCount,
}: ProdukIconBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
      {/* Search Icon */}
      <button
        onClick={onSearchClick}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Cari produk"
      >
        <Search className="w-6 h-6 text-gray-600" />
      </button>

      {/* Filter Icon with Badge */}
      <button
        onClick={onFilterClick}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
        aria-label="Filter produk"
      >
        <Filter className="w-6 h-6 text-gray-600" />
        {filterCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
            {filterCount}
          </span>
        )}
      </button>

      {/* Menu Icon */}
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      )}
    </div>
  );
}