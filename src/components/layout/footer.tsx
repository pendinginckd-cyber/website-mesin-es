"use client";

import Link from "next/link";
import { Snowflake, MapPin, Phone, Mail, Clock } from "lucide-react";
import { useContact } from "@/contexts/contact-context";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const quickLinks = [
  { href: "/", label: "Beranda" },
  { href: "/produk", label: "Produk" },
  { href: "/artikel", label: "Artikel" },
  { href: "/faq", label: "FAQ" },
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/kontak", label: "Kontak" },
];

export function Footer() {
  const { contact, loading } = useContact();
  const waNumber = contact?.whatsappNumber || WHATSAPP_NUMBER;

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Snowflake className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-white">
                Mesin Es Kristal
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Produsen dan distributor mesin es kristal berkualitas tinggi.
              Garansi resmi, suku cadang lengkap, teknisi siap datang.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-sm hover:text-primary transition-colors">
                Facebook
              </a>
              <a href="#" className="text-sm hover:text-primary transition-colors">
                Instagram
              </a>
              <a href="#" className="text-sm hover:text-primary transition-colors">
                YouTube
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Link Cepat</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                {loading ? (
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-32" />
                ) : contact?.address ? (
                  <span className="whitespace-pre-line">{contact.address}</span>
                ) : (
                  <span>Jl. Contoh No. 123, Kota, Provinsi</span>
                )}
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                {loading ? (
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-24" />
                ) : (
                  <a href={`tel:+${waNumber}`} className="hover:text-primary transition-colors">
                    +{waNumber}
                  </a>
                )}
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                {loading ? (
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-32" />
                ) : contact?.email ? (
                  <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">
                    {contact.email}
                  </a>
                ) : (
                  <a href="mailto:info@mesineskristal.com" className="hover:text-primary transition-colors">
                    info@mesineskristal.com
                  </a>
                )}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Jam Operasional</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                {loading ? (
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-40" />
                ) : contact?.operatingHours ? (
                  <span>{contact.operatingHours}</span>
                ) : (
                  <span>Senin - Sabtu: 08:00 - 17:00</span>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Mesin Es Kristal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
