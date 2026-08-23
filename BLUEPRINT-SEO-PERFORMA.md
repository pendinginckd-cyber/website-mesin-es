# BLUEPRINT SEO & PERFORMA

## 1. STRATEGI KEYWORD

### 1.1 Primary Keywords (Target Utama)
| Keyword | Volume | Difficulty | Target Halaman |
|---------|--------|------------|----------------|
| jual mesin es kristal | Tinggi | Medium | Homepage |
| harga mesin es kristal | Tinggi | Medium | Homepage, /produk |
| mesin es kristal | Tinggi | Medium | Homepage |
| mesin es batu kristal | Tinggi | Medium | Homepage |

### 1.2 Secondary Keywords
| Keyword | Target Halaman |
|---------|----------------|
| mesin es kristal 1 ton | /produk/mesin-es-kristal-1-ton |
| mesin es kristal 3 ton | /produk/mesin-es-kristal-3-ton |
| mesin es kristal 5 ton | /produk/mesin-es-kristal-5-ton |
| harga mesin es batu 1 ton | /produk/mesin-es-kristal-1-ton |
| mesin es kristal murah | /produk |
| mesin es kristal garansi | /tentang |

### 1.3 Long-tail Keywords (Artikel)
| Keyword | Target Artikel |
|---------|----------------|
| cara memulai usaha es batu kristal | /artikel/cara-memulai-usaha-es-batu-kristal |
| perhitungan modal usaha es kristal | /artikel/perhitungan-modal-usaha-es-kristal |
| tips merawat mesin es kristal | /artikel/tips-merawat-mesin-es-kristal |
| keuntungan bisnis es kristal | /artikel/keuntungan-bisnis-es-kristal |
| mesin es kristal vs es balok | /artikel/perbedaan-es-kristal-dan-es-balok |

---

## 2. META TAGS PER HALAMAN

### 2.1 Homepage
```typescript
export const metadata = {
  title: "Jual Mesin Es Kristal Berkualitas | Garansi Resmi & Hemat Listrik",
  description: "Jual mesin es kristal kapasitas 1-10 ton/hari. Garansi resmi, suku cadang lengkap, teknisi siap datang. Konsultasi gratis! Hubungi kami sekarang.",
  keywords: ["jual mesin es kristal", "harga mesin es kristal", "mesin es batu kristal", "mesin es kristal murah"],
  authors: [{ name: "Mesin Es Kristal" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://mesineskristal.com",
    title: "Jual Mesin Es Kristal Berkualitas | Garansi Resmi & Hemat Listrik",
    description: "Jual mesin es kristal kapasitas 1-10 ton/hari. Garansi resmi, suku cadang lengkap, teknisi siap datang.",
    siteName: "Mesin Es Kristal",
    images: [
      {
        url: "/images/og-homepage.jpg",
        width: 1200,
        height: 630,
        alt: "Mesin Es Kristal Berkualitas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jual Mesin Es Kristal Berkualitas | Garansi Resmi",
    description: "Jual mesin es kristal kapasitas 1-10 ton/hari. Garansi resmi, suku cadang lengkap.",
    images: ["/images/og-homepage.jpg"],
  },
  verification: {
    google: "google-site-verification-code",
  },
};
```

### 2.2 Halaman Produk
```typescript
export function generateMetadata({ params }: Props): Metadata {
  const product = await getProductBySlug(params.slug);
  
  return {
    title: `${product.name} | Mesin Es Kristal`,
    description: product.shortDescription,
    keywords: [`mesin es kristal ${product.capacity}`, `harga ${product.name}`],
    openGraph: {
      title: `${product.name} | Mesin Es Kristal`,
      description: product.shortDescription,
      images: [{ url: product.thumbnail, width: 1200, height: 630 }],
    },
  };
}
```

### 2.3 Halaman Detail Produk
```typescript
export function generateMetadata({ params }: Props): Metadata {
  const product = await getProductBySlug(params.slug);
  
  return {
    title: `${product.name} - Kapasitas ${product.capacity} | Mesin Es Kristal`,
    description: product.shortDescription,
    alternates: {
      canonical: `https://mesineskristal.com/produk/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} - Kapasitas ${product.capacity}`,
      description: product.shortDescription,
      type: "product",
      images: [{ url: product.thumbnail, width: 1200, height: 630 }],
    },
  };
}
```

### 2.4 Halaman Artikel
```typescript
export function generateMetadata({ params }: Props): Metadata {
  const article = await getArticleBySlug(params.slug);
  
  return {
    title: `${article.title} | Blog Mesin Es Kristal`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      images: [{ url: article.coverImage, width: 1200, height: 630 }],
    },
  };
}
```

### 2.5 Halaman Tentang
```typescript
export const metadata = {
  title: "Tentang Kami | Mesin Es Kristal Terpercaya",
  description: "Produsen dan distributor mesin es kristal terpercaya. Pengalaman X tahun, X+ mesin terjual, garansi resmi.",
};
```

### 2.6 Halaman Kontak
```typescript
export const metadata = {
  title: "Hubungi Kami | Konsultasi Mesin Es Kristal Gratis",
  description: "Hubungi kami untuk konsultasi gratis kebutuhan mesin es kristal. WhatsApp, telepon, email, atau kunjungi workshop kami.",
};
```

### 2.7 Halaman FAQ
```typescript
export const metadata = {
  title: "FAQ (Pertanyaan Umum) | Mesin Es Kristal",
  description: "Jawaban untuk pertanyaan umum tentang mesin es kristal, harga, garansi, layanan, dan spesifikasi teknis.",
};
```

---

## 3. STRUCTURED DATA (JSON-LD)

### 3.1 Organization Schema (Homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Mesin Es Kristal",
  "url": "https://mesineskristal.com",
  "logo": "https://mesineskristal.com/images/logo.png",
  "description": "Produsen dan distributor mesin es kristal berkualitas tinggi",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Jl. Contoh No. 123",
    "addressLocality": "Kota",
    "addressRegion": "Provinsi",
    "addressCountry": "ID"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+62-812-xxxx-xxxx",
    "contactType": "sales",
    "availableLanguage": "Indonesian"
  },
  "sameAs": [
    "https://facebook.com/mesineskristal",
    "https://instagram.com/mesineskristal",
    "https://youtube.com/@mesineskristal"
  ]
}
```

### 3.2 Product Schema (Detail Produk)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Mesin Es Kristal 1 Ton",
  "image": [
    "https://mesineskristal.com/images/mesin-1-ton-1.jpg",
    "https://mesineskristal.com/images/mesin-1-ton-2.jpg"
  ],
  "description": "Mesin es kristal kapasitas 1 ton per hari dengan kompresor berkualitas tinggi",
  "brand": {
    "@type": "Brand",
    "name": "Mesin Es Kristal"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://mesineskristal.com/produk/mesin-es-kristal-1-ton",
    "priceCurrency": "IDR",
    "price": "50000000",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Mesin Es Kristal"
    }
  }
}
```

### 3.3 Article Schema (Detail Artikel)
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Cara Memulai Usaha Es Batu Kristal",
  "description": "Panduan lengkap memulai usaha es batu kristal dari nol hingga sukses",
  "image": "https://mesineskristal.com/images/artikel-cover.jpg",
  "author": {
    "@type": "Organization",
    "name": "Mesin Es Kristal"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Mesin Es Kristal",
    "logo": {
      "@type": "ImageObject",
      "url": "https://mesineskristal.com/images/logo.png"
    }
  },
  "datePublished": "2025-01-15",
  "dateModified": "2025-01-20"
}
```

### 3.4 BreadcrumbList Schema (Semua Halaman)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Beranda",
      "item": "https://mesineskristal.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Produk",
      "item": "https://mesineskristal.com/produk"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Mesin Es Kristal 1 Ton",
      "item": "https://mesineskristal.com/produk/mesin-es-kristal-1-ton"
    }
  ]
}
```

### 3.5 FAQPage Schema (Halaman FAQ)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Apa itu mesin es kristal?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Mesin es kristal adalah mesin pembuat es batu berbentuk butiran kecil seperti kristal yang umumnya digunakan untuk mengawetkan ikan dan produk perikanan."
      }
    },
    {
      "@type": "Question",
      "name": "Berapa kapasitas mesin es kristal?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Kami menyediakan mesin es kristal dengan kapasitas 1 ton/hari, 3 ton/hari, 5 ton/hari, hingga 10 ton/hari."
      }
    },
    {
      "@type": "Question",
      "name": "Berapa lama garansi mesin?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Garansi resmi 1 tahun untuk kompresor dan 6 bulan untuk sparepart lainnya."
      }
    }
  ]
}
```

### 3.6 VideoObject Schema (Video di Halaman Produk)
```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Demo Mesin Es Kristal 1 Ton",
  "description": "Video demonstrasi mesin es kristal kapasitas 1 ton per hari sedang beroperasi",
  "thumbnailUrl": "https://img.youtube.com/vi/{videoId}/maxresdefault.jpg",
  "uploadDate": "2025-01-15",
  "contentUrl": "https://www.youtube.com/watch?v={videoId}",
  "embedUrl": "https://www.youtube.com/embed/{videoId}",
  "publisher": {
    "@type": "Organization",
    "name": "Mesin Es Kristal",
    "logo": {
      "@type": "ImageObject",
      "url": "https://mesineskristal.com/images/logo.png"
    }
  }
}
```

### 3.7 ItemList Schema (Video Gallery)
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Video Mesin Es Kristal",
  "itemListElement": [
    {
      "@type": "VideoObject",
      "position": 1,
      "name": "Demo Mesin Es Kristal 1 Ton",
      "url": "https://mesineskristal.com/video/demo-mesin-1-ton"
    },
    {
      "@type": "VideoObject",
      "position": 2,
      "name": "Testimoni Pelanggan - Pak Budi Surabaya",
      "url": "https://mesineskristal.com/video/testimoni-pak-budi"
    }
  ]
}
```

### 3.8 ImageGallery Schema (Halaman Galeri)
```json
{
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  "name": "Galeri Workshop Mesin Es Kristal",
  "description": "Foto-foto workshop, proses produksi, dan pengiriman mesin es kristal",
  "associatedMedia": [
    {
      "@type": "ImageObject",
      "contentUrl": "https://mesineskristal.com/images/workshop-1.jpg",
      "description": "Workshop pembuatan mesin es kristal",
      "width": 1920,
      "height": 1080
    },
    {
      "@type": "ImageObject",
      "contentUrl": "https://mesineskristal.com/images/produksi-1.jpg",
      "description": "Proses pengelasan mesin",
      "width": 1920,
      "height": 1080
    }
  ]
}
```

### 3.9 Product Schema dengan Sertifikasi (Detail Produk)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Mesin Es Kristal 1 Ton",
  "image": [
    "https://mesineskristal.com/images/mesin-1-ton-1.jpg",
    "https://mesineskristal.com/images/mesin-1-ton-2.jpg",
    "https://mesineskristal.com/images/mesin-1-ton-3.jpg"
  ],
  "description": "Mesin es kristal kapasitas 1 ton per hari dengan kompresor berkualitas tinggi",
  "brand": {
    "@type": "Brand",
    "name": "Mesin Es Kristal"
  },
  "material": "Stainless Steel 304 Food Grade",
  "certification": ["SNI", "ISO 9001", "Food Grade"],
  "offers": {
    "@type": "Offer",
    "url": "https://mesineskristal.com/produk/mesin-es-kristal-1-ton",
    "priceCurrency": "IDR",
    "price": "50000000",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Mesin Es Kristal"
    }
  }
}
```

---

## 4. SITEMAP

### 4.1 Dynamic Sitemap (src/app/sitemap.ts)
```typescript
import { MetadataRoute } from "next";
import { getProducts } from "@/lib/firestore/products";
import { getPublishedArticles } from "@/lib/firestore/articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mesineskristal.com";

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/produk`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/artikel`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/video`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}/galeri`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}/tentang`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/kontak`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  // Dynamic product pages
  const products = await getProducts();
  const productPages = products.map((product) => ({
    url: `${baseUrl}/produk/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic article pages
  const articles = await getPublishedArticles();
  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/artikel/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Dynamic video pages (Fase 2)
  const videos = await getActiveVideos();
  const videoPages = videos.map((video) => ({
    url: `${baseUrl}/video/${video.id}`,
    lastModified: video.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  // Dynamic gallery pages
  const galleries = await getActiveGalleries();
  const galleryPages = galleries.map((gallery) => ({
    url: `${baseUrl}/galeri`,
    lastModified: gallery.createdAt,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...productPages, ...articlePages, ...videoPages, ...galleryPages];
}
```

### 4.2 robots.txt (public/robots.txt)
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /admin/login
Disallow: /api/

Sitemap: https://mesineskristal.com/sitemap.xml
```

---

## 5. OPTIMASI PERFORMA

### 5.1 Target Skor
| Metrik | Target | Alat Ukur |
|--------|--------|-----------|
| LCP (Largest Contentful Paint) | < 2.5s | PageSpeed Insights |
| FID (First Input Delay) | < 100ms | PageSpeed Insights |
| CLS (Cumulative Layout Shift) | < 0.1 | PageSpeed Insights |
| TTFB (Time to First Byte) | < 800ms | WebPageTest |
| Total Bundle Size | < 200KB (gzipped) | Webpack Bundle Analyzer |
| Page Load Time | < 3s | Chrome DevTools |

### 5.2 Optimasi Gambar
```typescript
// ✅ BENAR - Gunakan Next.js Image component
import Image from "next/image";

<Image
  src={product.thumbnail}
  alt={product.name}
  width={400}
  height={300}
  loading="lazy"
  placeholder="blur"
  blurDataURL="/images/placeholder.webp"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={false}
/>
```

**Aturan Optimasi Gambar:**
1. Semua gambar harus format **WebP**
2. Kompres gambar sebelum upload (max 200KB per gambar)
3. Gunakan `loading="lazy"` untuk gambar di bawah fold
4. Gunakan `priority={true}` untuk gambar di atas fold (hero)
5. Tentukan `width` dan `height` yang tepat untuk menghindari CLS
6. Gunakan `placeholder="blur"` untuk loading yang smooth
7. Gunakan `sizes` attribute untuk responsive images

### 5.3 Optimasi Font
```typescript
// ✅ BENAR - Gunakan next/font untuk optimasi
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});
```

**Aturan Optimasi Font:**
1. Gunakan `next/font` untuk self-host font
2. Gunakan `display: "swap"` untuk menghindari FOIT
3. Subset hanya karakter yang diperlukan
4. Maksimal 2 font family (Inter + 1 accent)

### 5.4 Optimasi Bundle
```typescript
// ✅ BENAR - Dynamic import untuk komponen berat
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/admin/rich-text-editor"), {
  ssr: false,
  loading: () => <Skeleton />,
});
```

**Aturan Optimasi Bundle:**
1. Dynamic import untuk komponen admin (tidak perlu SSR)
2. Code splitting otomatis oleh Next.js App Router
3. Hindari import library besar di client components
4. Tree shaking untuk library yang digunakan
5. Gunakan `use client` hanya di komponen yang butuh interaktivitas

### 5.5 Optimasi Fetch Data
```typescript
// ✅ BENAR - Gunakan ISR untuk halaman publik
export const revalidate = 3600; // Revalidate setiap 1 jam

export default async function ProdukPage() {
  const products = await getProducts();
  return <ProdukGrid products={products} />;
}

// ✅ BENAR - Gunakan generateStaticParams untuk halaman dinamis
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}
```

**Aturan Optimasi Fetch Data:**
1. Halaman publik: **SSG + ISR** (revalidate 3600 detik)
2. Halaman detail: **generateStaticParams** untuk pre-render
3. Halaman admin: **Client-side fetching** (tidak perlu SEO)
4. Gunakan `cache: "force-cache"` untuk data yang jarang berubah
5. Gunakan `cache: "no-store"` untuk data real-time (leads)

### 5.6 Optimasi Video YouTube
```typescript
// ✅ BENAR - Lazy load YouTube embed (click-to-play)
<YouTubeEmbed videoId="dQw4w9WgXcQ" title="Demo Mesin" />

// Thumbnail only (~50KB) → load iframe saat diklik
// TIDAK load iframe sampai user klik
```

**Aturan Optimasi Video:**
1. **JANGAN load iframe YouTube langsung** — pakai thumbnail + click-to-play
2. Thumbnail dari `img.youtube.com/vi/{id}/maxresdefault.jpg` (~50KB)
3. **Maximum 1 video aktif per halaman** — jangan load multiple iframe
4. Gunakan `Intersection Observer` untuk lazy load (opsional)
5. Saat user klik → ganti thumbnail dengan iframe (autoplay)
6. Tambahkan `title` untuk accessibility
7. Aspect ratio 16:9 dengan `aspect-video` Tailwind class

### 5.7 Optimasi CSS
```css
/* ✅ BENAR - Gunakan Tailwind utility classes */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* ... */}
</div>
```

**Aturan Optimasi CSS:**
1. Gunakan Tailwind utility classes (tidak perlu custom CSS)
2. Purge CSS otomatis oleh Tailwind (tree shaking)
3. Hindari inline styles
4. Gunakan CSS variables untuk tema

### 5.8 Optimasi JavaScript
```typescript
// ✅ BENAR - Debounce untuk search input
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

export function SearchInput() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  useEffect(() => {
    // Fetch data dengan debouncedSearch
  }, [debouncedSearch]);

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
}
```

**Aturan Optimasi JavaScript:**
1. Debounce untuk search input (300ms)
2. Throttle untuk scroll events
3. Virtualize untuk list panjang (jika >100 item)
4. Lazy load untuk komponen di bawah fold
5. Hindari re-render yang tidak perlu (React.memo, useMemo)

---

## 6. CHECKLIST SEO

### 6.1 On-Page SEO
- [ ] Title tag unik per halaman (max 60 karakter)
- [ ] Meta description unik per halaman (max 160 karakter)
- [ ] H1 unik per halaman (hanya 1 H1)
- [ ] H2, H3 hierarki yang benar
- [ ] URL ramah SEO (kebab-case, deskriptif)
- [ ] Internal linking antar halaman
- [ ] Alt text untuk semua gambar
- [ ] Canonical URL per halaman
- [ ] Open Graph tags per halaman
- [ ] Twitter Card tags per halaman
- [ ] FAQPage schema di halaman FAQ
- [ ] VideoObject schema di halaman produk dengan video
- [ ] ItemList schema di halaman gallery video
- [ ] ImageGallery schema di halaman galeri pabrik
- [ ] Product schema dengan material & certification

### 6.2 Technical SEO
- [ ] Sitemap.xml generate otomatis
- [ ] robots.txt benar
- [ ] SSL/HTTPS aktif
- [ ] Mobile-friendly (responsive)
- [ ] Page speed > 80 (PageSpeed Insights)
- [ ] Structured data (JSON-LD)
- [ ] Breadcrumb schema
- [ ] 404 page custom
- [ ] 301 redirect untuk URL lama (jika ada)
- [ ] Noindex untuk halaman admin

### 6.3 Content SEO
- [ ] Keyword di title tag
- [ ] Keyword di meta description
- [ ] Keyword di H1
- [ ] Keyword di paragraf pertama
- [ ] Keyword density 1-2%
- [ ] Internal link ke halaman terkait
- [ ] Gambar dengan alt text
- [ ] Konten minimal 300 kata per halaman
- [ ] Artikel blog minimal 800 kata

### 6.4 Off-Page SEO (Setelah Deploy)
- [ ] Submit sitemap ke Google Search Console
- [ ] Submit sitemap ke Bing Webmaster Tools
- [ ] Daftar Google My Business
- [ ] Backlink dari direktori lokal
- [ ] Social media profiles
- [ ] Guest posting di blog terkait

---

## 7. MONITORING & ANALYTICS

### 7.1 Google Analytics 4
```typescript
// ✅ Tambahkan di root layout
<script
  async
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
/>
<script
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
    `,
  }}
/>
```

### 7.2 Google Search Console
- Verifikasi domain di GSC
- Submit sitemap.xml
- Monitor search performance
- Monitor index coverage
- Monitor Core Web Vitals

### 7.3 Event Tracking (GA4)
| Event | Trigger | Parameter |
|-------|---------|-----------|
| `contact_form_submit` | Form kontak submit | name, phone, product |
| `whatsapp_click` | Klik tombol WA | page, phoneNumber |
| `product_view` | Lihat detail produk | productId, productName |
| `product_filter` | Filter produk | category, sort |
| `article_view` | Lihat artikel | articleId, articleTitle |

---

## 8. CORE WEB VITALS OPTIMIZATION

### 8.1 LCP (Largest Contentful Paint)
**Target: < 2.5 detik**

**Optimasi:**
1. Hero image gunakan `priority={true}`
2. Preload font utama
3. Minimize CSS critical path
4. Server response time < 200ms
5. Gunakan CDN (Firebase Hosting sudah include CDN)

### 8.2 FID (First Input Delay)
**Target: < 100ms**

**Optimasi:**
1. Minimize JavaScript execution time
2. Dynamic import untuk komponen berat
3. Code splitting per route
4. Defer non-critical JavaScript
5. Minimize third-party scripts

### 8.3 CLS (Cumulative Layout Shift)
**Target: < 0.1**

**Optimasi:**
1. Tentukan `width` dan `height` untuk semua gambar
2. Tentukan `min-height` untuk container dinamis
3. Hindari insert konten di atas konten existing
4. Gunakan font dengan `display: swap`
5. Reserve space untuk ads/embeds (jika ada)

---

## 9. TESTING SEO & PERFORMA

### 9.1 Alat Testing
| Alat | URL | Fungsi |
|------|-----|--------|
| PageSpeed Insights | https://pagespeed.web.dev/ | Skor performa |
| Lighthouse | Chrome DevTools | Audit lengkap |
| GTmetrix | https://gtmetrix.com/ | Waterfall analysis |
| WebPageTest | https://www.webpagetest.org/ | Deep performance |
| Mobile-Friendly Test | https://search.google.com/test/mobile-friendly | Responsive test |
| Rich Results Test | https://search.google.com/test/rich-results | Structured data |
| Schema Validator | https://validator.schema.org/ | JSON-LD validation |

### 9.2 Checklist Pre-Deploy
- [ ] Lighthouse score > 90 (Performance)
- [ ] Lighthouse score > 90 (SEO)
- [ ] Lighthouse score > 90 (Accessibility)
- [ ] Lighthouse score > 90 (Best Practices)
- [ ] Semua meta tags benar
- [ ] Sitemap.xml generate dengan benar
- [ ] robots.txt benar
- [ ] Structured data valid (JSON-LD)
- [ ] Mobile-friendly
- [ ] Semua link berfungsi (no broken links)
- [ ] Gambar teroptimasi (WebP, compressed)
- [ ] Font teroptimasi (self-hosted, swap)
- [ ] Bundle size < 200KB (gzipped)
- [ ] Page load time < 3s
- [ ] YouTube video lazy load berfungsi (tidak load iframe otomatis)
- [ ] VideoObject schema valid di Google Rich Results Test
- [ ] ROI Calculator berfungsi dengan kalkulasi real-time
- [ ] Sertifikasi tampil di halaman produk dan tentang
- [ ] Multi-foto produk (min 3) dengan lightbox
- [ ] Galeri pabrik tampil dengan grid dan lightbox
- [ ] Material mesin jelas (Stainless Steel 304 Food Grade)

### 9.3 Checklist Post-Deploy
- [ ] Submit sitemap ke Google Search Console
- [ ] Verifikasi domain di GSC
- [ ] Setup Google Analytics 4
- [ ] Test URL di Production
- [ ] Monitor Core Web Vitals di GSC
- [ ] Monitor index coverage di GSC
- [ ] Setup Google My Business
- [ ] Test sharing di social media (OG tags)

---

## 10. TARGET KEYWORD TRACKING

### 10.1 Keyword yang Harus Dipantau
| Keyword | Posisi Saat Ini | Target | Halaman Target |
|---------|-----------------|--------|----------------|
| jual mesin es kristal | - | Top 3 | Homepage |
| harga mesin es kristal | - | Top 3 | Homepage |
| mesin es kristal | - | Top 5 | Homepage |
| mesin es batu kristal | - | Top 5 | Homepage |
| mesin es kristal 1 ton | - | Top 3 | /produk/mesin-es-kristal-1-ton |
| mesin es kristal 3 ton | - | Top 3 | /produk/mesin-es-kristal-3-ton |
| cara memulai usaha es kristal | - | Top 5 | /artikel/cara-memulai-usaha-es-kristal |

### 10.2 Tools untuk Tracking
- Google Search Console (gratis)
- Ahrefs (berbayar)
- SEMrush (berbayar)
- Ubersuggest (freemium)

---

## 11. CATATAN PENTING

1. **SEO adalah proses jangka panjang** - hasil baru terlihat setelah 3-6 bulan
2. **Konten berkualitas adalah kunci** - buat artikel yang bermanfaat secara rutin
3. **Backlink berkualitas lebih penting dari kuantitas** - fokus pada backlink dari situs relevan
4. **User experience mempengaruhi SEO** - page speed, mobile-friendly, navigasi mudah
5. **Update konten secara berkala** - Google menyukai konten yang fresh
6. **Monitor analytics secara rutin** - analisis traffic, bounce rate, konversi
7. **Jangan gunakan black-hat SEO** - bisa kena penalty dari Google
8. **Local SEO penting untuk bisnis lokal** - daftar di Google My Business
9. **Social signals membantu SEO** - share konten di media sosial
10. **Test dan iterate** - A/B test title, meta description, CTA
