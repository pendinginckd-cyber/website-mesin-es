"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Snowflake,
  Menu,
  X,
  Phone,
  LogIn,
  Search,
  Scale,
} from "lucide-react";
import { useContact } from "@/contexts/contact-context";
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/constants";
import { useComparison } from "@/lib/comparison-store";
import { ProdukSearchDropdown } from "@/components/public/produk-search-dropdown";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/produk", label: "Produk" },
  { href: "/sparepart", label: "Sparepart" },
  { href: "/artikel", label: "Artikel" },
  { href: "/video", label: "Video" },
  { href: "/galeri", label: "Galeri" },
  { href: "/tentang", label: "Tentang" },
  { href: "/kontak", label: "Kontak" },
  { href: "/kalkulator", label: "Simulasi ROI" },
];

export function Navbar() {
  const { contact } = useContact();
  const { items: comparisonItems } = useComparison();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState<string | undefined>(undefined);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const waNumber = contact?.whatsappNumber || WHATSAPP_NUMBER;
  const waMessage = contact?.whatsappMessage || WHATSAPP_MESSAGE;

  // Click outside handler for search dropdown (desktop anchor + mobile overlay)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (dropdownRef.current?.contains(target)) return;
      if (mobileSearchRef.current?.contains(target)) return;
      setSearchOpen(false);
    }
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [searchOpen]);

  // Lock background scroll while mobile search overlay is open (iOS-safe)
  useEffect(() => {
    const isMobile = !window.matchMedia("(min-width: 1024px)").matches;
    if (!searchOpen || !isMobile) return;

    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;

    html.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      html.style.overflow = "";
      body.style.position = "";
      body.style.top = "";
      body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [searchOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (mobileMenuOpen && !(e.target as HTMLElement).closest('[data-mobile-menu]')) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [mobileMenuOpen]);

  function handleSearchClick() {
    setInitialQuery(
      new URLSearchParams(window.location.search).get("search") || undefined
    );
    setSearchOpen((v) => !v);
  }

  function handleSearch(query: string) {
    const path = window.location.pathname;
    const target = path.startsWith("/sparepart") ? "/sparepart" : "/produk";
    router.push(`${target}?search=${encodeURIComponent(query)}`);
    setSearchOpen(false);
  }

  function toggleMobileMenu() {
    setMobileMenuOpen(!mobileMenuOpen);
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function renderComparisonButton() {
    return (
      <Link
        href="/bandingkan"
        className="relative p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors tap-effect"
        aria-label="Bandingkan produk"
        onClick={closeMobileMenu}
      >
        <Scale className="w-5 h-5" />
        {comparisonItems.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full leading-none">
            {comparisonItems.length}
          </span>
        )}
      </Link>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <nav className="w-full px-3 sm:px-5 lg:px-6 2xl:px-8 relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title (Mobile: truncated) */}
          <Link href="/" className="flex items-center gap-1 shrink-0">
            <Snowflake className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold text-gray-900 truncate max-w-[100px] sm:max-w-[140px] md:max-w-none">
              Mesin Es Kristal
            </span>
          </Link>

          {/* Desktop Search Icon + Dropdown */}
          <div className="hidden lg:flex items-center gap-2 mx-4 relative" ref={dropdownRef}>
            <button
              onClick={handleSearchClick}
              className="flex items-center gap-2 px-3 xl:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-600 hover:text-primary max-w-xs"
              aria-label="Cari"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm hidden xl:inline">Cari disini...</span>
            </button>

            {/* Search Dropdown */}
            {searchOpen && (
              <div className="absolute top-full left-0 mt-2 z-50">
                <ProdukSearchDropdown
                  isOpen={searchOpen}
                  onClose={() => setSearchOpen(false)}
                  defaultValue={initialQuery}
                  onSearch={handleSearch}
                />
              </div>
            )}
          </div>

          {/* Nav Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-5 2xl:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary transition-colors text-sm font-medium whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Action Buttons (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            {renderComparisonButton()}
            <Link
              href="/admin/login"
              className="flex items-center gap-2 border border-gray-300 hover:border-primary text-gray-700 hover:text-primary px-2.5 xl:px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden xl:inline">Masuk</span>
            </Link>
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-2.5 xl:px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden xl:inline">Hubungi Kami</span>
            </a>
          </div>

          {/* Mobile Icons: Search, Comparison, Menu */}
          <div className="flex lg:hidden items-center gap-1 shrink-0">
            {/* Comparison Icon */}
            {renderComparisonButton()}

            {/* Search Icon */}
            <button
              onClick={handleSearchClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Cari"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            {/* Menu Icon */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {searchOpen && (
          <div
            ref={mobileSearchRef}
            className="lg:hidden fixed inset-x-0 top-16 z-50 bg-white border-b border-gray-100 shadow-lg"
          >
            <div className="p-4">
              <ProdukSearchDropdown
                fullWidth
                isOpen={searchOpen}
                onClose={() => setSearchOpen(false)}
                defaultValue={initialQuery}
                onSearch={handleSearch}
              />
            </div>
          </div>
        )}

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div
            data-mobile-menu
            className="lg:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg z-50 transition-all duration-200 animate-in slide-in-from-top-2"
          >
            <div className="px-4 py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="block text-gray-600 hover:text-primary transition-colors px-4 py-3 text-sm font-medium hover:bg-gray-50 rounded-lg"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-100 mt-2 pt-2 space-y-2">
                <Link
                  href="/admin/login"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors px-4 py-3 text-sm font-medium hover:bg-gray-50 rounded-lg"
                >
                  <LogIn className="w-4 h-4" />
                  Masuk
                </Link>
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white px-4 py-3 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Hubungi Kami
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}