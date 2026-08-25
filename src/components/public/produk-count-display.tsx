"use client";

interface ProdukCountDisplayProps {
  total: number;
  filtered: number;
}

export function ProdukCountDisplay({ total, filtered }: ProdukCountDisplayProps) {
  if (total === 0) {
    return (
      <p className="text-sm text-gray-600">
        Tidak ada produk
      </p>
    );
  }

  if (total === filtered) {
    return (
      <p className="text-sm text-gray-600">
        Menampilkan <strong>{total}</strong> produk
      </p>
    );
  }

  return (
    <p className="text-sm text-gray-600">
      Menampilkan <strong>{filtered}</strong> dari <strong>{total}</strong> produk
    </p>
  );
}