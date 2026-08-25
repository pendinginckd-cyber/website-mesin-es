"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface ProdukCapacityRangeProps {
  min: number;
  max: number;
  currentMin?: number;
  currentMax?: number;
  onChange?: (minCapacity: number | undefined, maxCapacity: number | undefined) => void;
}

function formatCapacity(value: number): string {
  return `${value} Ton`;
}

export function ProdukCapacityRange({ min, max, currentMin, currentMax, onChange }: ProdukCapacityRangeProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialMin = currentMin && currentMin >= min ? currentMin : min;
  const initialMax = currentMax && currentMax <= max ? currentMax : max;

  const [range, setRange] = useState<[number, number]>([initialMin, initialMax]);

  useEffect(() => {
    if (onChange) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (range[0] > min) {
        params.set("minCapacity", range[0].toString());
      } else {
        params.delete("minCapacity");
      }
      if (range[1] < max) {
        params.set("maxCapacity", range[1].toString());
      } else {
        params.delete("maxCapacity");
      }
      router.push(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [range, min, max, router, pathname, searchParams, onChange]);

  const handleChange = (value: number | number[]) => {
    const newRange = value as [number, number];
    setRange(newRange);
    if (onChange) {
      const newMin = newRange[0] > min ? newRange[0] : undefined;
      const newMax = newRange[1] < max ? newRange[1] : undefined;
      onChange(newMin, newMax);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Range Kapasitas</span>
        <span className="text-sm text-gray-600">
          {formatCapacity(range[0])} - {formatCapacity(range[1])}
        </span>
      </div>
      <div className="px-2">
        <Slider
          range
          min={min}
          max={max}
          step={0.5}
          value={range}
          onChange={handleChange}
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