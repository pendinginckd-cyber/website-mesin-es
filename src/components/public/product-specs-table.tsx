"use client";

import { useMemo, useState } from "react";
import { Specification } from "@/types/product";
import {
  groupSpecificationsByCategory,
  FALLBACK_CATEGORY_TITLE,
} from "@/lib/product-specs";

const VISIBLE_LIMIT = 12;

interface ProductSpecsTableProps {
  specifications: Specification[];
}

export function ProductSpecsTable({ specifications }: ProductSpecsTableProps) {
  const groups = useMemo(() => groupSpecificationsByCategory(specifications), [specifications]);
  const totalRows = specifications.length;
  const isLong = totalRows > VISIBLE_LIMIT;
  const [expanded, setExpanded] = useState(false);

  const visibleLimit = isLong && !expanded ? VISIBLE_LIMIT : Number.MAX_SAFE_INTEGER;

  let rendered = 0;

  return (
    <div>
      {groups.map((group) => {
        const items = group.items.slice(0, Math.max(0, visibleLimit - rendered));
        rendered += items.length;
        if (items.length === 0) return null;
        return (
          <div key={group.category} className="mb-6 last:mb-0">
            <h3 className="text-sm font-bold text-primary mb-2">
              {group.title === FALLBACK_CATEGORY_TITLE ? "Spesifikasi Lainnya" : group.title}
            </h3>
            <table className="w-full">
              <tbody>
                {items.map((spec, idx) => (
                  <tr key={`${group.category}-${idx}`} className={idx !== 0 ? "border-t border-gray-100" : ""}>
                    <td className="py-3 pr-4 text-gray-500 w-[40%] align-top">{spec.label}</td>
                    <td className="py-3 font-medium text-gray-900 align-top">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold text-sm transition-colors tap-effect"
        >
          {expanded ? "Lihat Lebih Sedikit" : "Lihat Lebih Banyak"}
          <span>{expanded ? "↑" : "↓"}</span>
        </button>
      )}
    </div>
  );
}
