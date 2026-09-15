import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ProdukGrid } from "@/components/public/produk-grid";
import { getFeaturedProducts, getProducts } from "@/lib/firestore/products";
import {
  SITE_NAME,
  SITE_URL,
  WHATSAPP_NUMBER,
  WHATSAPP_MESSAGE,
} from "@/lib/constants";
import {
  COMPANY_NAME,
  BRAND,
  BUSINESS_ADDRESS,
  BUSINESS_GEO,
  BUSINESS_PHONE,
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_MAPS_SHORT,
  BUSINESS_HOURS,
  SERVICE_AREAS,
} from "@/lib/business";
import { MapPin, Phone, Clock, ShieldCheck, Wrench, Package } from "lucide-react";
import type { Metadata } from "next";

const LANDING_PATH = "/mesin-es-kristal-semarang";
const LANDING_URL = `${SITE_URL}${LANDING_PATH}`;

export const metadata: Metadata = {
  title: "Jual Mesin Es Kristal Semarang | Pabrik & Service Ice Tube",
  description:
    "Pabrik & supplier mesin es kristal (ice tube) di Genuk Semarang oleh Cikal Jaya Teknik, merk EKN. Kapasitas 1-10 ton/hari, garansi resmi, sparepart lengkap, teknisi siap datang. Konsultasi gratis!",
  keywords: [
    "mesin es kristal semarang",
    "jual mesin es kristal semarang",
    "pabrik mesin es kristal semarang",
    "harga mesin es kristal semarang",
    "jual mesin es semarang",
    "mesin ice tube semarang",
  ],
  alternates: {
    canonical: LANDING_URL,
  },
  openGraph: {
    title: "Jual Mesin Es Kristal Semarang | Pabrik & Service Ice Tube",
    description:
      "Pabrik & supplier mesin es kristal (ice tube) di Genuk Semarang oleh Cikal Jaya Teknik, merk EKN. Kapasitas 1-10 ton, garansi resmi, sparepart lengkap.",
    url: LANDING_URL,
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "IndustrialBusiness",
  name: COMPANY_NAME,
  alternateName: `${SITE_NAME} (Merk ${BRAND})`,
  image: `${SITE_URL}/icon.png`,
  url: LANDING_URL,
  telephone: BUSINESS_PHONE,
  address: {
    "@type": "PostalAddress",
    ...BUSINESS_ADDRESS,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: BUSINESS_GEO.latitude,
    longitude: BUSINESS_GEO.longitude,
  },
  hasMap: BUSINESS_MAPS_SHORT,
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: BUSINESS_HOURS.days,
    opens: BUSINESS_HOURS.opens,
    closes: BUSINESS_HOURS.closes,
  },
  areaServed: [...SERVICE_AREAS],
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Mesin Es Kristal Semarang", item: LANDING_URL },
    ],
  },
};

export default async function MesinEsKristalSemarangPage() {
  let featuredProducts = await getFeaturedProducts(4);
  if (featuredProducts.length === 0) {
    featuredProducts = await getProducts({ isActive: true });
  }

  const waMessage =
    "Halo Cikal Jaya Teknik, saya tertarik dengan mesin es kristal untuk area Semarang. Bisa dibantu info harga dan spesifikasinya?";

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[{ label: "Beranda", href: "/" }, { label: "Mesin Es Kristal Semarang" }]}
        />

        <header className="mt-4 mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Jual & Fabrikasi Mesin Es Kristal di Semarang
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">
            {COMPANY_NAME} — pabrikan mesin es kristal (ice tube) dengan merk{" "}
            <strong>{BRAND}</strong> berlokasi di Genuk, Kota Semarang, Jawa Tengah. Kami
            melayani pengiriman dan pemasangan ke seluruh Jawa Tengah: Semarang, Demak, Kudus,
            Kendal, Ungaran, Salatiga, Solo, Pati, dan sekitarnya.
          </p>
          <p className="text-gray-700 max-w-3xl mb-8">
            Setiap unit bergaransi resmi, suku cadang lengkap, dan didukung teknisi yang siap
            datang ke lokasi. Konsultasikan kebutuhan kapasitas 1–10 ton/hari bersama tim kami
            secara gratis.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
            >
              <Phone className="w-5 h-5" />
              Konsultasi via WhatsApp
            </a>
            <a
              href={`tel:${BUSINESS_PHONE}`}
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-300 hover:border-primary hover:text-primary px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
            >
              <Phone className="w-5 h-5" />
              Telepon {BUSINESS_PHONE_DISPLAY}
            </a>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            {
              icon: ShieldCheck,
              title: "Garansi Resmi",
              desc: "Garansi unit + kompresor, dukungan purna jual terjamin.",
            },
            {
              icon: Wrench,
              title: "Teknisi Siap Datang",
              desc: "Instalasi & service langsung ke lokasi Anda di Semarang & Jateng.",
            },
            {
              icon: Package,
              title: "Sparepart Lengkap",
              desc: "Suku cadang tersedia, tidak perlu menunggu lama.",
            },
            {
              icon: Clock,
              title: `Buka Senin–Sabtu ${BUSINESS_HOURS.opens}–${BUSINESS_HOURS.closes}`,
              desc: "Kunjungi workshop kami di Genuk, Kota Semarang.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-gray-50 rounded-xl p-5">
              <item.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </section>
      </div>

      <ProdukGrid
        products={featuredProducts}
        title="Produk Mesin Es Kristal Kami"
        showViewAll
        compact
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Area Layanan di Jawa Tengah
          </h2>
          <p className="text-gray-700 mb-4 max-w-3xl">
            Workshop kami di Genuk, Kota Semarang menjadi pusat produksi dan distribusi mesin es
            kristal untuk wilayah Jawa Tengah. Kami melayani pengiriman, instalasi, dan perawatan
            mesin es kristal di:
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {SERVICE_AREAS.map((area) => (
              <li
                key={area}
                className="flex items-center gap-2 text-gray-700 bg-gray-50 rounded-lg px-3 py-2 text-sm"
              >
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                {area}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Layanan & Purna Jual
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Konsultasi & Survey</h3>
              <p className="text-sm text-gray-600 mb-4">
                Tim kami membantu menghitung kapasitas mesin yang sesuai kebutuhan produksi es
                Anda, termasuk analisis daya listrik dan biaya operasional.
              </p>
              <Link href="/artikel" className="text-primary font-semibold hover:underline text-sm">
                Baca panduan di blog →
              </Link>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Instalasi & Perawatan</h3>
              <p className="text-sm text-gray-600 mb-4">
                Pemasangan oleh teknisi kami di lokasi, plus jadwal perawatan berkala untuk
                menjaga performa kompresor dan descaling evaporator.
              </p>
              <Link href="/sparepart" className="text-primary font-semibold hover:underline text-sm">
                Lihat sparepart →
              </Link>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Garansi & Dukungan</h3>
              <p className="text-sm text-gray-600 mb-4">
                Garansi resmi unit dan kompresor. Suku cadang tersedia lengkap dan cepat, langsung
                dari workshop Genuk.
              </p>
              <Link href="/kontak" className="text-primary font-semibold hover:underline text-sm">
                Hubungi tim kami →
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Alamat Workshop di Semarang
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">{COMPANY_NAME}</h3>
                  <p className="text-gray-700">
                    {BUSINESS_ADDRESS.streetAddress}, {BUSINESS_ADDRESS.addressLocality},{" "}
                    {BUSINESS_ADDRESS.addressRegion}, {BUSINESS_ADDRESS.postalCode}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href={`tel:${BUSINESS_PHONE}`} className="text-gray-700 hover:text-primary">
                  {BUSINESS_PHONE_DISPLAY}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <p className="text-gray-700">
                  Senin–Sabtu, {BUSINESS_HOURS.opens}–{BUSINESS_HOURS.closes} WIB
                </p>
              </div>
              <a
                href={BUSINESS_MAPS_SHORT}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                <MapPin className="w-4 h-4" />
                Buka di Google Maps →
              </a>
            </div>

            <div className="min-h-[280px] rounded-xl overflow-hidden border border-gray-200">
              <iframe
                src={`https://maps.google.com/maps?q=${BUSINESS_GEO.latitude},${BUSINESS_GEO.longitude}&z=16&hl=id&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Workshop Mesin Es Kristal Semarang di Google Maps"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}