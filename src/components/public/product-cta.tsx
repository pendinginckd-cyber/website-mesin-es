"use client";

import { useContact } from "@/contexts/contact-context";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone } from "lucide-react";
import { SITE_URL } from "@/lib/constants";

interface ProductCtaProps {
  product: Product;
}

export function ProductCta({ product }: ProductCtaProps) {
  const { contact } = useContact();
  const waNumber = contact?.whatsappNumber || "6281326440039";

  const whatsappMessage = encodeURIComponent(
    `Halo, saya tertarik dengan ${product.name} - ${product.priceDisplay || `Rp ${product.price?.toLocaleString("id-ID")}`}\n\n${SITE_URL}/produk/${product.slug}`
  );

  const whatsappUrl = `https://wa.me/${waNumber}?text=${whatsappMessage}`;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
        <Button variant="primary" size="lg" className="w-full tap-effect">
          <MessageCircle className="w-5 h-5 mr-2" />
          Nego Harga
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
