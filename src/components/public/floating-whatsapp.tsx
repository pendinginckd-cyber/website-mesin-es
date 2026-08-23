"use client";

import { MessageCircle } from "lucide-react";
import { useContact } from "@/contexts/contact-context";
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/constants";

export function FloatingWhatsApp() {
  const { contact } = useContact();
  const waNumber = contact?.whatsappNumber || WHATSAPP_NUMBER;
  const waMessage = contact?.whatsappMessage || WHATSAPP_MESSAGE;

  return (
    <a
      href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
      aria-label="Chat WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat via WhatsApp
      </span>
    </a>
  );
}
