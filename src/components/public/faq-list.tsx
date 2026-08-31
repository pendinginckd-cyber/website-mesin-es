"use client";

import { useState } from "react";
import { ChevronDown, Phone } from "lucide-react";
import Link from "next/link";
import { useContact } from "@/contexts/contact-context";
import { Faq } from "@/types/faq";
import { FAQ_CATEGORIES } from "@/lib/constants";

interface FaqListProps {
  faqs: Faq[];
}

export function FaqList({ faqs }: FaqListProps) {
  const { contact } = useContact();
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  function toggleItem(id: string) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function getGrouped() {
    const filtered = filterCategory === "all"
      ? faqs
      : faqs.filter((f) => f.category === filterCategory);

    const grouped: Record<string, Faq[]> = {};
    filtered.forEach((faq) => {
      if (!grouped[faq.category]) grouped[faq.category] = [];
      grouped[faq.category].push(faq);
    });

    return grouped;
  }

  const grouped = getGrouped();

  return (
    <>
      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        <button
          onClick={() => setFilterCategory("all")}
          className={`px-4 py-2 text-sm rounded-full border transition-colors ${
            filterCategory === "all"
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-300 hover:border-primary"
          }`}
        >
          Semua
        </button>
        {FAQ_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 text-sm rounded-full border transition-colors ${
              filterCategory === cat
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-300 hover:border-primary"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* FAQ Groups */}
      {Object.keys(grouped).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 capitalize">
                {category}
              </h2>
              <div className="space-y-2">
                {items.map((faq) => {
                  const isOpen = openItems.has(faq.id);
                  return (
                    <div
                      key={faq.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(faq.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-500 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-600 whitespace-pre-line">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 mb-1">Belum ada FAQ untuk kategori ini.</p>
          <button
            onClick={() => setFilterCategory("all")}
            className="text-primary text-sm hover:underline"
          >
            Lihat semua FAQ
          </button>
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 bg-gradient-to-r from-primary to-primary-dark rounded-xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Masih Punya Pertanyaan?</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Jangan ragu untuk menghubungi kami. Tim kami siap membantu Anda.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`https://wa.me/${contact?.whatsappNumber || "6281326440039"}?text=${encodeURIComponent(contact?.whatsappMessage || "Halo saya tertarik dengan mesin es kristal")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Phone className="w-5 h-5" />
            Hubungi via WhatsApp
          </Link>
          <Link
            href="/kontak"
            className="inline-flex items-center justify-center gap-2 bg-white/20 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/30 transition-colors"
          >
            Kirim Pesan
          </Link>
        </div>
      </div>
    </>
  );
}