"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface ProdukPriceRangeProps {
  min: number;
  max: number;
  currentMin?: number;
  currentMax?: number;
}

function calculatePriceStep(min: number, max: number): number {
  const range = max - min;
  if (range < 1000000) return 50000;
  if (range < 10000000) return 500000;
  if (range < 100000000) return 1000000;
  return 5000000;
}

function formatCurrency(value: number): string {
  if (value >= 1000000000) {
    return `Rp ${(value / 1000000000).toFixed(1)}M`;
  }
  if (value >= 1000000) {
    return `Rp ${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}jt`;
  }
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export function ProdukPriceRange({ min, max, currentMin, currentMax }: ProdukPriceRangeProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialMin = currentMin && currentMin >= min ? currentMin : min;
  const initialMax = currentMax && currentMax <= max ? currentMax : max;

  const [range, setRange] = useState<[number, number]>([initialMin, initialMax]);
  const [debouncedRange, setDebouncedRange] = useState<[number, number]>([initialMin, initialMax]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedRange(range);
      const params = new URLSearchParams(searchParams.toString());
      if (range[0] > min) {
        params.set("minPrice", range[0].toString());
      } else {
        params.delete("minPrice");
      }
      if (range[1] < max) {
        params.set("maxPrice", range[1].toString());
      } else {
        params.delete("maxPrice");
      }
      router.push(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [range, min, max, router, pathname, searchParams]);

  const step = calculatePriceStep(min, max);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Range Harga</span>
        <span className="text-sm text-gray-600">
          {formatCurrency(range[0])} - {formatCurrency(range[1])}
        </span>
      </div>
      <div className="px-2">
        <Slider
          range
          min={min}
          max={max}
          step={step}
          value={range}
          onChange={(value) => setRange(value as [number, number])}
          trackStyle={[{ backgroundColor: "#0284c7", height: 6 }]}
          handleStyle={[
            { borderColor: "#0284c7", height: 18, width: 18, marginTop: -6, backgroundColor: "#fff" },
            { borderColor: "#0284c7", height: 18, width: 18, marginTop: -6, backgroundColor: "#fff" },
          ]}
          railStyle={{ backgroundColor: "#e5e7eb", height: 6 }}
        />
      </div>
    </div>
  );
}