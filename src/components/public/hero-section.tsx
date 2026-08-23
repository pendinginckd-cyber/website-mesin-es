"use client";

import Link from "next/link";
import { ArrowRight, Phone, Snowflake } from "lucide-react";
import { useContact } from "@/contexts/contact-context";
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/constants";

export function HeroSection() {
  const { contact } = useContact();
  const waNumber = contact?.whatsappNumber || WHATSAPP_NUMBER;
  const waMessage = contact?.whatsappMessage || WHATSAPP_MESSAGE;

  return (
    <section className="relative bg-gradient-to-br from-primary-dark via-primary to-blue-600 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTMwIDBMNjAgMzAgMzAgNjAgMCAzMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNnKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] bg-repeat" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
            <Snowflake className="w-4 h-4" />
            <span>Produsen Mesin Es Kristal Terpercaya</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Mesin Es Kristal{" "}
            <span className="text-accent">Berkualitas Tinggi</span>
            <br />
            Garansi Resmi & Hemat Listrik
          </h1>

          <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl">
            Kapasitas 1-10 ton/hari. Suku cadang lengkap, teknisi siap datang,
            dan garansi resmi untuk setiap mesin. Mulai usaha es kristal Anda
            sekarang!
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/produk"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors text-lg"
            >
              Lihat Produk
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-lg font-semibold transition-colors text-lg"
            >
              <Phone className="w-5 h-5" />
              Konsultasi Gratis
            </a>
          </div>

          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20">
            <div>
              <p className="text-3xl font-bold">500+</p>
              <p className="text-blue-200 text-sm">Mesin Terjual</p>
            </div>
            <div>
              <p className="text-3xl font-bold">10+</p>
              <p className="text-blue-200 text-sm">Tahun Pengalaman</p>
            </div>
            <div>
              <p className="text-3xl font-bold">98%</p>
              <p className="text-blue-200 text-sm">Pelanggan Puas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
