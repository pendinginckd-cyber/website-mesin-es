"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Plus, Scale, Share2, Trash2, X } from "lucide-react";
import { Product } from "@/types/product";
import { useComparison } from "@/lib/comparison-store";
import { buildComparisonWhatsAppMessage } from "@/lib/comparison-message";
import { useContact } from "@/contexts/contact-context";
import { COMPARISON_MAX, WHATSAPP_NUMBER } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { ProdukCard } from "@/components/public/produk-card";

interface ProductComparisonProps {
  products: Product[];
}

interface CompareRow {
  label: string;
  values: (string | null)[];
}

function buildRows(products: Product[]): CompareRow[] {
  if (products.length === 0) return [];
  const cells = (get: (p: Product) => string | null) => products.map(get);

  const rows: CompareRow[] = [
    { label: "Harga", values: cells((p) => p.priceDisplay || formatCurrency(p.price)) },
    { label: "Kapasitas", values: cells((p) => p.capacity) },
    { label: "Daya", values: cells((p) => p.power ?? null) },
    { label: "Garansi", values: cells((p) => p.warranty) },
    { label: "Bahan", values: cells((p) => p.material) },
    { label: "Stok", values: cells((p) => p.stock) },
    { label: "Kategori", values: cells((p) => p.category) },
    {
      label: "Sertifikasi",
      values: cells((p) =>
        p.certifications?.length ? p.certifications.join(", ") : null
      ),
    },
    {
      label: "Deskripsi Singkat",
      values: cells((p) => p.shortDescription || p.description),
    },
  ];

  const labels = new Set<string>();
  products.forEach((p) => p.specifications?.forEach((s) => labels.add(s.label)));
  labels.forEach((label) => {
    rows.push({
      label,
      values: cells(
        (p) => p.specifications?.find((s) => s.label === label)?.value ?? null
      ),
    });
  });

  return rows;
}

function isRowDifferent(row: CompareRow): boolean {
  const present = row.values.filter(Boolean);
  if (present.length !== row.values.length) return true;
  return new Set(present).size > 1;
}

export function ProductComparison({ products }: ProductComparisonProps) {
  const { contact } = useContact();
  const waNumber = contact?.whatsappNumber || WHATSAPP_NUMBER;
  const { items, toggle, remove, clear, isFull, has } = useComparison();

  const selected = items
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const available = products.filter((p) => !has(p.id));
  const [picked, setPicked] = useState("");

  function handleAdd(id: string) {
    if (!id || isFull) return;
    toggle(id);
    setPicked("");
  }

  const rows = buildRows(selected);
  const shareUrl =
    selected.length > 0
      ? `https://wa.me/${waNumber}?text=${encodeURIComponent(
          buildComparisonWhatsAppMessage(selected)
        )}`
      : null;

  return (
    <div>
      {/* Selector Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Scale className="w-5 h-5 text-primary" />
            Produk dipilih
            <span className="text-gray-500 font-normal">
              ({selected.length}/{COMPARISON_MAX})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {selected.length > 0 && shareUrl && (
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Bagikan via WhatsApp
              </a>
            )}
            {selected.length > 0 && (
              <button
                onClick={clear}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Hapus Semua
              </button>
            )}
          </div>
        </div>

        {selected.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {selected.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg pl-1.5 pr-2 py-1.5"
              >
                {product.thumbnail && (
                  <div className="relative w-8 h-8 rounded overflow-hidden shrink-0">
                    <Image
                      src={product.thumbnail}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-900 max-w-[180px] truncate">
                  {product.name}
                </span>
                <button
                  onClick={() => remove(product.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  aria-label={`Hapus ${product.name} dari perbandingan`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {!isFull && available.length > 0 && (
              <div className="flex items-center gap-2">
                <select
                  value={picked}
                  onChange={(e) => handleAdd(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary"
                >
                  <option value="" disabled>
                    Tambah produk...
                  </option>
                  {available.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {isFull && (
              <span className="text-xs text-gray-500">
                Sudah {COMPARISON_MAX} produk. Hapus salah satu untuk menambah.
              </span>
            )}
          </div>
        )}
      </div>

      {selected.length === 0 ? (
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
              <Scale className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Belum Ada Produk untuk Dibandingkan
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Klik tombol{" "}
              <span className="font-semibold text-primary">Bandingkan</span> pada
              2-3 mesin di bawah untuk melihat spesifikasinya secara berdampingan.
            </p>
          </div>

          {products.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProdukCard key={product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {selected.length < 2 && (
            <div className="p-4 border-b border-gray-100 text-center text-sm text-gray-500 bg-blue-50 rounded-t-xl">
              Pilih minimal 2 produk agar perbedaan spesifikasi lebih mudah terlihat.
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[560px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-1.5 px-2 w-10"></th>
                  {selected.map((product) => (
                    <th key={product.id} className="py-4 px-3 min-w-[180px] align-top">
                      <div className="relative text-center">
                        <button
                          onClick={() => remove(product.id)}
                          className="absolute -top-1 -right-1 p-1.5 hover:bg-red-100 rounded-full text-gray-400 hover:text-red-600 transition-colors"
                          aria-label={`Hapus ${product.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {product.thumbnail && (
                          <div className="relative w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden">
                            <Image
                              src={product.thumbnail}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                        )}
                        <Link
                          href={`/produk/${product.slug}`}
                          className="block font-semibold text-gray-900 hover:text-primary transition-colors text-sm leading-snug"
                        >
                          {product.name}
                        </Link>
                        <span className="block mt-1 text-primary font-bold text-xs">
                          {product.priceDisplay || formatCurrency(product.price)}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const different = isRowDifferent(row);
                  return (
                    <tr key={row.label} className="border-b border-gray-100 last:border-0">
                      <td
                        className={`py-2.5 px-3 font-medium text-gray-700 whitespace-nowrap ${
                          different ? "bg-amber-50/60" : ""
                        }`}
                      >
                        {row.label}
                      </td>
                      {row.values.map((value, idx) => (
                        <td
                          key={idx}
                          className={`py-2.5 px-3 align-top ${
                            value === null
                              ? "text-gray-300 italic"
                              : different
                              ? "bg-amber-50/70"
                              : "text-gray-700"
                          }`}
                        >
                          {value ?? "—"}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}