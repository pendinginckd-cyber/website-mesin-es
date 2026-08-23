"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Snowflake,
  Menu,
  X,
  Phone,
  LogIn,
} from "lucide-react";
import { useContact } from "@/contexts/contact-context";
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/constants";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/produk", label: "Produk" },
  { href: "/artikel", label: "Artikel" },
  { href: "/video", label: "Video" },
  { href: "/galeri", label: "Galeri" },
  { href: "/tentang", label: "Tentang" },
  { href: "/kontak", label: "Kontak" },
];

export function Navbar() {
  const { contact } = useContact();
  const [isOpen, setIsOpen] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const waNumber = contact?.whatsappNumber || WHATSAPP_NUMBER;
  const waMessage = contact?.whatsappMessage || WHATSAPP_MESSAGE;

  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;

    const handleToggle = () => {
      setIsOpen(details.open);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (details.open && !details.contains(e.target as Node)) {
        details.open = false;
        setIsOpen(false);
      }
    };

    details.addEventListener("toggle", handleToggle);
    document.addEventListener("click", handleClickOutside);
    return () => {
      details.removeEventListener("toggle", handleToggle);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const closeMenu = () => {
    if (detailsRef.current) {
      detailsRef.current.open = false;
      setIsOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Snowflake className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">
              Mesin Es Kristal
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/admin/login"
              className="flex items-center gap-2 border border-gray-300 hover:border-primary text-gray-700 hover:text-primary px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Masuk
            </Link>
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              Hubungi Kami
            </a>
          </div>

          {/* Mobile menu using native <details> with enhanced UX */}
          <details ref={detailsRef} className="lg:hidden relative">
            <summary className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-gray-100 active:bg-gray-200 cursor-pointer list-none">
              {isOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </summary>
            <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="block text-gray-600 hover:text-primary transition-colors px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-100 mt-1 pt-1">
                <Link
                  href="/admin/login"
                  onClick={closeMenu}
                  className="block text-gray-600 hover:text-primary transition-colors px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  Masuk
                </Link>
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors mx-3 mt-2"
                >
                  <Phone className="w-4 h-4" />
                  Hubungi Kami
                </a>
              </div>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
