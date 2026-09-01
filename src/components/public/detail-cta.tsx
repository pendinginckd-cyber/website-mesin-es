"use client";

import { useContact } from "@/contexts/contact-context";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

interface DetailCtaProps {
  waMessage: string;
  waLabel?: string;
}

export function DetailCta({ waMessage, waLabel = "Pesan via WhatsApp" }: DetailCtaProps) {
  const { contact } = useContact();
  const waNumber = contact?.whatsappNumber || WHATSAPP_NUMBER;

  const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
        <Button variant="primary" size="lg" className="w-full tap-effect">
          <MessageCircle className="w-5 h-5 mr-2" />
          {waLabel}
        </Button>
      </a>
      <a href="tel:+6281326440039" className="flex-1">
        <Button variant="outline" size="lg" className="w-full tap-effect">
          <Phone className="w-5 h-5 mr-2" />
          Hubungi Kami
        </Button>
      </a>
    </div>
  );
}
