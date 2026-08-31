"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Faq } from "@/types/faq";

interface FaqAccordionProps {
  faqs: Faq[];
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
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

  if (faqs.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Belum ada FAQ terkait sparepart ini.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {faqs.map((faq) => {
        const isOpen = openItems.has(faq.id);
        return (
          <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleItem(faq.id)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900 pr-3">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="px-3 pb-3">
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}