# BLUEPRINT INSTRUKSI AGENT
# Panduan AI Agent untuk Pengembangan Website Mesin Es Kristal

---

## 1. IDENTITAS AGENT

- **Nama Proyek**: Website Penjualan Mesin Es Kristal
- **Tech Stack**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + Firebase
- **Tujuan**: Website B2B yang interaktif, responsif, ringan, dan SEO-friendly
- **Target Pengguna**: Pengusaha es batu, pelaku usaha F&B, distributor

---

## 2. ATURAN UMUM AGENT

### 2.1 Aturan Wajib
1. **SELALU baca file yang ada sebelum mengedit** - jangan pernah menebak isi file
2. **SELALU ikuti konvensi kode yang sudah ada** - gaya penamaan, struktur import, dll
3. **SELALU gunakan TypeScript** - jangan gunakan `any`, buat interface/type yang jelas
4. **SELALU gunakan Tailwind CSS** untuk styling - jangan buat file CSS terpisah kecuali global
5. **SELALU buat komponen yang reusable** - hindari duplikasi kode
6. **SELALU handle loading dan error state** - jangan biarkan UI blank saat fetch data
7. **SELALU validasi form dengan Zod** - jangan trust user input
8. **SELALU gunakan `use client` directive** di komponen yang butuh interaktivitas
9. **JANGAN commit perubahan** kecuali user secara eksplisit meminta
10. **JANGAN tambahkan komentar** kecuali diminta user

### 2.2 Gaya Kode
```typescript
// ✅ BENAR - Import urut: external, internal, relative
import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/public/product-card";

// ✅ BENAR - Naming convention
// Komponen: PascalCase
// Fungsi/variabel: camelCase
// Konstanta: UPPER_SNAKE_CASE
// File: kebab-case

// ✅ BENAR - TypeScript strict
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
}

// ❌ SALAH - jangan gunakan any
const data: any = await fetchData();

// ✅ BENAR - gunakan type yang jelas
const data: Product[] = await fetchProducts();
```

### 2.3 Struktur Komponen
```typescript
// Urutan dalam file komponen:
// 1. Imports
// 2. Types/Interfaces
// 3. Komponen utama
// 4. Export default

"use client";

import { useState } from "react";

interface Props {
  title: string;
  description?: string;
}

export function ComponentName({ title, description }: Props) {
  const [state, setState] = useState(false);

  return (
    <div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
```

---

## 3. INSTRUKSI PER FASE PENGEMBANGAN

### FASE 1: SETUP & FOUNDATION

#### Langkah 1.1: Inisialisasi Project
```bash
# Command yang harus dijalankan:
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

#### Langkah 1.2: Install Dependencies
```bash
# Core
npm install firebase lucide-react framer-motion
npm install react-hook-form @hookform/resolvers zod

# Dev
npm install -D @types/node @types/react @types/react-dom
```

#### Langkah 1.3: Setup Firebase Config
Buat file: `src/lib/firebase/config.ts`
- Baca `.env.local` untuk konfigurasi
- Export semua variabel Firebase

Buat file: `src/lib/firebase/client.ts`
- Initialize Firebase app
- Export auth, db, storage instances

#### Langkah 1.4: Setup Tailwind Theme
Edit `tailwind.config.ts`:
- Tambahkan warna custom (primary: #0284c7, accent: #f97316)
- Tambahkan fontFamily (Inter, Plus Jakarta Sans)
- Tambahkan custom breakpoints jika perlu

#### Langkah 1.5: Setup Global Styles
Edit `src/styles/globals.css`:
- Tambahkan Tailwind directives
- Tambahkan CSS variables untuk warna
- Tambahkan base styles

#### Langkah 1.6: Setup Root Layout
Buat `src/app/layout.tsx`:
- Tambahkan metadata dasar (title, description)
- Tambahkan font optimization (next/font)
- Tambahkan HTML lang="id"

---

### FASE 2: KOMPONEN UI & LAYOUT

#### Instruksi Membuat Komponen UI
- Simpan di `src/components/ui/`
- Setiap komponen dalam file terpisah
- Gunakan forwardRef jika komponen menerima ref
- Tambahkan variant props dengan Tailwind

#### Komponen yang Harus Dibuat:
| Komponen | File | Props Utama |
|----------|------|-------------|
| Button | `ui/button.tsx` | variant, size, disabled, loading |
| Input | `ui/input.tsx` | type, placeholder, error, disabled |
| Textarea | `ui/textarea.tsx` | rows, placeholder, error |
| Card | `ui/card.tsx` | children, className |
| Badge | `ui/badge.tsx` | variant, children |
| Modal | `ui/modal.tsx` | isOpen, onClose, title, children |
| DataTable | `ui/data-table.tsx` | columns, data, pagination |
| ImageUploader | `ui/image-uploader.tsx` | onUpload, maxFiles, maxSize |

#### Instruksi Membuat Layout Publik
Buat `src/app/(public)/layout.tsx`:
- Import dan render Navbar
- Import dan render Footer
- Children sebagai content utama

#### Instruksi Membuat Layout Admin
Buat `src/app/(admin)/admin/layout.tsx`:
- Import dan render AdminSidebar
- Import dan render AdminHeader
- Children sebagai content utama
- Tambahkan auth check (redirect ke login jika belum login)

---

### FASE 3: FIREBASE INTEGRATION

#### Instruksi Setup Firestore Helpers
Buat file di `src/lib/firestore/`:

**products.ts:**
```typescript
// Fungsi yang harus ada:
- getProducts(params?) → Product[]
- getProductBySlug(slug) → Product
- createProduct(data) → docId
- updateProduct(id, data) → void
- deleteProduct(id) → void
- getFeaturedProducts(limit?) → Product[]
```

**articles.ts:**
```typescript
// Fungsi yang harus ada:
- getArticles(params?) → Article[]
- getArticleBySlug(slug) → Article
- createArticle(data) → docId
- updateArticle(id, data) → void
- deleteArticle(id) → void
- getPublishedArticles(limit?) → Article[]
```

**testimonials.ts:**
```typescript
// Fungsi yang harus ada:
- getTestimonials(params?) → Testimonial[]
- createTestimonial(data) → docId
- updateTestimonial(id, data) → void
- deleteTestimonial(id) → void
- getFeaturedTestimonials(limit?) → Testimonial[]
```

**faqs.ts:**
```typescript
// Fungsi yang harus ada:
- getFaqs(params?) → FAQ[]
- createFaq(data) → docId
- updateFaq(id, data) → void
- deleteFaq(id) → void
- getActiveFaqs() → FAQ[]
- getFaqsByCategory(category) → FAQ[]
```

**videos.ts:**
```typescript
// Fungsi yang harus ada:
- getVideos(params?) → Video[]
- getVideoById(id) → Video
- createVideo(data) → docId
- updateVideo(id, data) → void
- deleteVideo(id) → void
- getActiveVideos() → Video[]
- getFeaturedVideos(limit?) → Video[]
- getVideosByCategory(category) → Video[]
- getVideosByProduct(productId) → Video[]
```

**galleries.ts:**
```typescript
// Fungsi yang harus ada:
- getGalleries(params?) → Gallery[]
- getGalleryById(id) → Gallery
- createGallery(data) → docId
- updateGallery(id, data) → void
- deleteGallery(id) → void
- getActiveGalleries() → Gallery[]
- getGalleriesByCategory(category) → Gallery[]
```

**banners.ts:**
```typescript
// Fungsi yang harus ada:
- getBanners(params?) → Banner[]
- createBanner(data) → docId
- updateBanner(id, data) → void
- deleteBanner(id) → void
- getActiveBanners() → Banner[]
```

**leads.ts:**
```typescript
// Fungsi yang harus ada:
- getLeads(params?) → Lead[]
- createLead(data) → docId
- updateLeadStatus(id, status) → void
- deleteLead(id) → void
```

#### Instruksi Setup Storage Helper
Buat file: `src/lib/storage/upload.ts`
```typescript
// Fungsi yang harus ada:
- uploadImage(file, path) → url
- uploadMultipleImages(files, path) → urls[]
- deleteImage(url) → void
```

#### Instruksi Setup Auth Helper
Buat file: `src/lib/firebase/auth.ts`
```typescript
// Fungsi yang harus ada:
- loginAdmin(email, password) → UserCredential
- logoutAdmin() → void
- getCurrentAdmin() → User | null
- checkAdminRole(uid) → boolean
```

---

### FASE 4: HALAMAN PUBLIK

#### Instruksi Membuat Homepage
File: `src/app/(public)/page.tsx`

Section yang harus ada (urutan dari atas):
1. **HeroSection** - Judul besar, subtitle, CTA button, background image/video
2. **KeunggulanSection** - Grid 4-6 keunggulan dengan icon
3. **ProdukSection** - 3-4 produk unggulan dengan card
4. **TestimoniSection** - Slider/carousel testimoni
5. **CTASection** - Banner ajakan konsultasi + tombol WhatsApp
6. **ArtikelSection** - 3 artikel terbaru

#### Instruksi Membuat Halaman Produk
File: `src/app/(public)/produk/page.tsx`
- Grid produk (3 kolom desktop, 2 tablet, 1 mobile)
- Filter berdasarkan kapasitas
- Pagination (12 per halaman)
- Loading skeleton saat fetch data

#### Instruksi Membuat Halaman Detail Produk
File: `src/app/(public)/produk/[slug]/page.tsx`
- Galeri gambar (thumbnail + main image)
- Nama produk + harga
- Spesifikasi teknis (tabel)
- Deskripsi lengkap
- Tombol WhatsApp CTA (floating + inline)
- Produk terkait (3 produk)

#### Instruksi Membuat Halaman Artikel
File: `src/app/(public)/artikel/page.tsx`
- Grid artikel (3 kolom desktop, 2 tablet, 1 mobile)
- Filter berdasarkan kategori
- Pagination (12 per halaman)

#### Instruksi Membuat Halaman Detail Artikel
File: `src/app/(public)/artikel/[slug]/page.tsx`
- Cover image
- Judul + tanggal + author
- Konten artikel (render HTML)
- Artikel terkait

#### Instruksi Membuat Halaman Tentang
File: `src/app/(public)/tentang/page.tsx`
- Profil perusahaan
- Visi & misi
- Tim (opsional)
- Google Maps embed

#### Instruksi Membuat Halaman Kontak
File: `src/app/(public)/kontak/page.tsx`
- Form kontak (nama, telepon, email, pesan)
- Validasi dengan Zod
- Submit → simpan ke Firestore leads + redirect ke WhatsApp
- Informasi kontak (alamat, telepon, email, jam operasional)

#### Instruksi Membuat Halaman FAQ
File: `src/app/(public)/faq/page.tsx`
- Judul halaman + deskripsi
- Filter berdasarkan kategori (Umum, Produk, Layanan, Teknis)
- Accordion FAQ (expand/collapse dengan animasi)
- Group by kategori
- CTA "Masih punya pertanyaan?" → link WhatsApp
- Data dari Firestore (faqs collection)

#### Instruksi Membuat Komponen YouTube Embed
File: `src/components/shared/youtube-embed.tsx`
- Props: `videoId` (YouTube ID), `title`, `aspectRatio` (default 16:9)
- Tampilkan thumbnail dari `img.youtube.com/vi/{id}/maxresdefault.jpg`
- Overlay tombol play di tengah thumbnail
- Saat diklik → ganti dengan iframe YouTube
- Lazy load: hanya load iframe setelah user klik
- Tambahkan `loading="lazy"` pada thumbnail image
- Tambahkan title untuk accessibility

#### Instruksi Membuat Komponen ROI Calculator
File: `src/components/public/roi-calculator.tsx`
- Form interaktif dengan input:
  - Kapasitas mesin (kg/hari) — auto dari produk, bisa diubah
  - Harga jual es per kg (default: Rp 3.000)
  - Biaya listrik per kWh (default: Rp 1.444)
  - Konsumsi listrik mesin (kWh) — auto dari spesifikasi
  - Biaya air per m3 (default: Rp 5.000)
  - Konsumsi air mesin (m3/hari) — auto dari spesifikasi
- Output real-time:
  - Pendapatan harian = kapasitas × harga jual
  - Biaya listrik harian = kWh × tarif
  - Biaya air harian = m3 × tarif
  - Biaya operasional = listrik + air + lain-lain (10%)
  - Profit bersih = pendapatan - biaya operasional
  - Estimasi balik modal = harga mesin / profit per bulan
- Tampilkan hasil dalam format yang mudah dibaca
- Gunakan React state untuk kalkulasi real-time
- Tambahkan disclaimer "Estimasi dapat berbeda tergantung kondisi lapangan"

**Contoh kalkulasi:**
```typescript
interface CalculatorInputs {
  capacityKg: number;
  pricePerKg: number;
  electricityRate: number;
  electricityKwh: number;
  waterRate: number;
  waterM3: number;
}

function calculateROI(inputs: CalculatorInputs) {
  const dailyRevenue = inputs.capacityKg * inputs.pricePerKg;
  const dailyElectricity = inputs.electricityKwh * inputs.electricityRate;
  const dailyWater = inputs.waterM3 * inputs.waterRate;
  const dailyOther = dailyRevenue * 0.1; // 10% untuk biaya lain
  const dailyCost = dailyElectricity + dailyWater + dailyOther;
  const dailyProfit = dailyRevenue - dailyCost;
  const monthlyProfit = dailyProfit * 30;
  const paybackMonths = Math.ceil(machinePrice / monthlyProfit);
  
  return { dailyRevenue, dailyCost, dailyProfit, monthlyProfit, paybackMonths };
}
```

#### Instruksi Membuat Komponen Certification Badges
File: `src/components/public/certification-badges.tsx`
- Props: `certifications` (array string)
- Tampilkan badge/logo untuk setiap sertifikasi:
  - SNI → logo SNI
  - ISO 9001 → logo ISO
  - Food Grade → icon food-safe
  - Stainless Steel 304 → icon material
- Gunakan Lucide icons atau custom SVG
- Tampilkan di halaman produk (bawah spesifikasi) dan halaman tentang

#### Instruksi Membuat Komponen Gallery Grid
File: `src/components/public/gallery-grid.tsx`
- Props: `galleries` (array Gallery), `columns` (default 3)
- Grid responsif: 3 kolom desktop, 2 tablet, 1 mobile
- Klik gambar → buka lightbox
- Filter berdasarkan kategori (workshop, produksi, pengiriman, tim, produk)

#### Instruksi Membuat Komponen Gallery Lightbox
File: `src/components/public/gallery-lightbox.tsx`
- Props: `images` (array), `initialIndex` (number)
- Modal fullscreen dengan gambar besar
- Navigasi prev/next
- Keyboard navigation (arrow keys, escape)
- Close button
- Caption/deskripsi gambar

#### Instruksi Floating WhatsApp
```typescript
"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  videoId: string;
  title?: string;
}

export function YouTubeEmbed({ videoId, title = "YouTube Video" }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full aspect-video rounded-lg"
      />
    );
  }

  return (
    <button
      onClick={() => setIsPlaying(true)}
      className="relative w-full aspect-video rounded-lg overflow-hidden group"
    >
      <Image
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt={title}
        fill
        className="object-cover group-hover:scale-105 transition-transform"
      />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <PlayIcon className="w-8 h-8 text-white ml-1" />
        </div>
      </div>
    </button>
  );
}
```

#### Instruksi Floating WhatsApp
File: `src/components/public/floating-whatsapp.tsx`
- Fixed position bottom-right
- Icon WhatsApp dengan animasi pulse
- Link ke wa.me/{nomor}?text={pesan}

---

### FASE 5: ADMIN DASHBOARD

#### Instruksi Membuat Login Page
File: `src/app/(admin)/admin/login/page.tsx`
- Form email + password
- Validasi dengan Zod
- Firebase Auth signInWithEmailAndPassword
- Error message jika login gagal
- Redirect ke /admin jika sudah login

#### Instruksi Membuat Dashboard Overview
File: `src/app/(admin)/admin/page.tsx`
- Stats cards: total produk, total artikel, total leads, leads baru
- Chart/grafik (opsional)
- Tabel leads terbaru (5 terakhir)
- Quick actions

#### Instruksi Membuat CRUD Produk
File: `src/app/(admin)/admin/produk/page.tsx`
- DataTable dengan kolom: gambar, nama, kapasitas, harga, status, aksi
- Tombol tambah produk
- Tombol edit & delete per baris
- Konfirmasi delete
- Pagination

File: `src/app/(admin)/admin/produk/tambah/page.tsx`
- Form: nama, slug (auto), deskripsi, harga, kapasitas, spesifikasi, material, sertifikasi, ROI estimasi, gambar
- Image uploader (multiple, min 3, max 8, WebP)
- Material input (contoh: "Stainless Steel 304 Food Grade")
- Sertifikasi checkboxes (SNI, ISO 9001, Food Grade, dll)
- ROI estimasi (daily revenue, daily cost, daily profit, payback period)
- Toggle aktif/non-aktif
- Toggle unggulan
- Submit → Firestore + Storage

File: `src/app/(admin)/admin/produk/edit/[id]/page.tsx`
- Sama seperti tambah, tapi pre-fill data
- Update → Firestore

#### Instruksi Membuat CRUD Artikel
File: `src/app/(admin)/admin/artikel/page.tsx`
- DataTable dengan kolom: cover, judul, kategori, tanggal, status, aksi
- Tombol tambah artikel
- Tombol edit & delete per baris

File: `src/app/(admin)/admin/artikel/tambah/page.tsx`
- Form: judul, slug (auto), konten (rich text), excerpt, cover image, kategori, tags
- Rich text editor (gunakan react-quill atau tip-tap)
- Toggle publikasi
- Submit → Firestore + Storage

#### Instruksi Membuat CRUD Testimoni
File: `src/app/(admin)/admin/testimoni/page.tsx`
- DataTable dengan kolom: nama, lokasi, rating, status, aksi
- Tombol tambah testimoni
- Tombol edit & delete per baris

#### Instruksi Membuat CRUD FAQ
File: `src/app/(admin)/admin/faq/page.tsx`
- DataTable dengan kolom: pertanyaan, kategori, urutan, status, aksi
- Tombol tambah FAQ
- Tombol edit & delete per baris
- Drag & drop untuk ubah urutan (opsional)

#### Instruksi Membuat CRUD Video
File: `src/app/(admin)/admin/video/page.tsx`
- DataTable dengan kolom: thumbnail, judul, kategori, featured, status, aksi
- Tombol tambah video
- Tombol edit & delete per baris
- Filter berdasarkan kategori

File: `src/app/(admin)/admin/video/tambah/page.tsx`
- Form: judul, YouTube URL (validasi), deskripsi, kategori
- Auto-extract YouTube ID dari URL (regex: `/(?:v=|\/videos\/|embed\/|\.be\/)([a-zA-Z0-9_-]{11})/`)
- Preview thumbnail otomatis dari YouTube
- Toggle featured
- Toggle aktif
- Submit → Firestore

File: `src/app/(admin)/admin/video/edit/[id]/page.tsx`
- Sama seperti tambah, tapi pre-fill data
- Update → Firestore

**Validasi YouTube URL:**
```typescript
function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
```

#### Instruksi Membuat CRUD Galeri
File: `src/app/(admin)/admin/galeri/page.tsx`
- Grid foto dengan thumbnail
- Tombol tambah foto
- Tombol edit & delete per foto
- Filter berdasarkan kategori

File: `src/app/(admin)/admin/galeri/tambah/page.tsx`
- Form: judul, deskripsi, kategori, upload gambar
- Multi-upload (max 10 foto sekaligus)
- Preview gambar sebelum upload
- Submit → Firebase Storage + Firestore

#### Instruksi Membuat CRUD Banner
File: `src/app/(admin)/admin/banner/page.tsx`
- DataTable dengan kolom: gambar, judul, urutan, status, aksi
- Tombol tambah banner
- Tombol edit & delete per baris
- Drag & drop untuk ubah urutan (opsional)

#### Instruksi Membuat Leads Management
File: `src/app/(admin)/admin/leads/page.tsx`
- DataTable dengan kolom: nama, telepon, pesan, produk, status, tanggal, aksi
- Filter berdasarkan status
- Ubah status leads (new → contacted → converted → closed)
- Tombol delete

---

### FASE 6: SEO & OPTIMASI

#### Instruksi SEO Per Halaman
Setiap halaman publik HARUS memiliki:
```typescript
export const metadata = {
  title: "Judul Halaman | Mesin Es Kristal",
  description: "Deskripsi halaman (max 160 karakter)",
  openGraph: {
    title: "...",
    description: "...",
    images: ["/images/og-image.jpg"],
    url: "https://mesineskristal.com/halaman",
  },
};
```

#### Instruksi Dynamic Sitemap
File: `src/app/sitemap.ts`
- Include semua halaman statis
- Include semua produk (dari Firestore)
- Include semua artikel published (dari Firestore)
- Generate lastmod dari updatedAt

#### Instruksi robots.txt
File: `public/robots.txt`
```
User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://mesineskristal.com/sitemap.xml
```

#### Instruksi Optimasi Gambar
- Gunakan Next.js Image component
- Format WebP
- Lazy loading default
- Placeholder blur
- Size yang sesuai viewport

#### Instruksi Optimasi Performa
- Gunakan `generateStaticParams` untuk halaman produk/artikel
- ISR dengan revalidate: 3600
- Code splitting otomatis (Next.js App Router)
- Minimize bundle size
- Hindari client-side rendering berlebihan

---

### FASE 7: TESTING & DEPLOY

#### Instruksi Testing Manual
Sebelum deploy, cek:
1. [ ] Responsivitas: mobile (375px), tablet (768px), desktop (1440px)
2. [ ] Semua link berfungsi (tidak ada broken link)
3. [ ] Form validasi bekerja
4. [ ] Login admin berfungsi
5. [ ] CRUD produk: create, read, update, delete
6. [ ] CRUD artikel: create, read, update, delete
7. [ ] CRUD testimoni: create, read, update, delete
8. [ ] CRUD banner: create, read, update, delete
9. [ ] Leads management: create, update status
10. [ ] Floating WhatsApp berfungsi
11. [ ] Loading state tampil saat fetch data
12. [ ] Error state tampil saat fetch gagal
13. [ ] 404 page tampil untuk halaman tidak ditemukan
14. [ ] SEO meta tags benar (cek view source)
15. [ ] Sitemap.xml generate dengan benar

#### Instruksi Deploy
```bash
# 1. Build
npm run build

# 2. Test build lokal
npm start

# 3. Deploy ke Firebase
firebase deploy --only hosting

# 4. Deploy semua (jika ada perubahan rules)
firebase deploy
```

---

## 4. CHECKLIST KOMPONEN & FILE

### Komponen UI (src/components/ui/)
- [ ] button.tsx
- [ ] input.tsx
- [ ] textarea.tsx
- [ ] card.tsx
- [ ] badge.tsx
- [ ] modal.tsx
- [ ] data-table.tsx
- [ ] image-uploader.tsx
- [ ] select.tsx
- [ ] skeleton.tsx

### Layout (src/components/layout/)
- [ ] navbar.tsx
- [ ] footer.tsx
- [ ] admin-sidebar.tsx
- [ ] admin-header.tsx

### Public Components (src/components/public/)
- [ ] hero-section.tsx
- [ ] keunggulan-section.tsx
- [ ] produk-grid.tsx
- [ ] produk-card.tsx
- [ ] testimoni-section.tsx
- [ ] faq-accordion.tsx
- [ ] faq-item.tsx
- [ ] youtube-embed.tsx
- [ ] video-card.tsx
- [ ] video-gallery.tsx
- [ ] video-section.tsx
- [ ] video-testimoni.tsx
- [ ] roi-calculator.tsx
- [ ] certification-badges.tsx
- [ ] gallery-grid.tsx
- [ ] gallery-lightbox.tsx
- [ ] cta-section.tsx
- [ ] artikel-preview.tsx
- [ ] floating-whatsapp.tsx

### Admin Components (src/components/admin/)
- [ ] product-form.tsx
- [ ] article-form.tsx
- [ ] data-table.tsx
- [ ] image-uploader.tsx
- [ ] stats-card.tsx

### Shared Components (src/components/shared/)
- [ ] seo-head.tsx
- [ ] breadcrumb.tsx
- [ ] pagination.tsx
- [ ] loading-skeleton.tsx

### Lib Files (src/lib/)
- [ ] firebase/client.ts
- [ ] firebase/config.ts
- [ ] firebase/auth.ts
- [ ] firestore/products.ts
- [ ] firestore/articles.ts
- [ ] firestore/testimonials.ts
- [ ] firestore/faqs.ts
- [ ] firestore/videos.ts
- [ ] firestore/galleries.ts
- [ ] firestore/banners.ts
- [ ] firestore/leads.ts
- [ ] storage/upload.ts
- [ ] utils.ts
- [ ] constants.ts
- [ ] validations.ts

### Types (src/types/)
- [ ] product.ts
- [ ] article.ts
- [ ] testimonial.ts
- [ ] faq.ts
- [ ] video.ts
- [ ] gallery.ts
- [ ] banner.ts
- [ ] lead.ts
- [ ] user.ts

### Pages - Public (src/app/(public)/)
- [ ] layout.tsx
- [ ] page.tsx (homepage)
- [ ] produk/page.tsx
- [ ] produk/[slug]/page.tsx
- [ ] artikel/page.tsx
- [ ] artikel/[slug]/page.tsx
- [ ] tentang/page.tsx
- [ ] kontak/page.tsx
- [ ] faq/page.tsx
- [ ] video/page.tsx (Fase 2)
- [ ] galeri/page.tsx

### Pages - Admin (src/app/(admin)/admin/)
- [ ] layout.tsx
- [ ] page.tsx (dashboard)
- [ ] login/page.tsx
- [ ] produk/page.tsx
- [ ] produk/tambah/page.tsx
- [ ] produk/edit/[id]/page.tsx
- [ ] artikel/page.tsx
- [ ] artikel/tambah/page.tsx
- [ ] artikel/edit/[id]/page.tsx
- [ ] testimoni/page.tsx
- [ ] faq/page.tsx
- [ ] video/page.tsx
- [ ] galeri/page.tsx
- [ ] banner/page.tsx
- [ ] leads/page.tsx

---

## 5. ERROR HANDLING GUIDE

### Fetch Data Error
```typescript
try {
  const products = await getProducts();
} catch (error) {
  // Tampilkan error state
  // Jangan biarkan UI blank
  // Tampilkan pesan user-friendly
}
```

### Form Error
```typescript
// Tampilkan error di bawah input
// Jangan submit jika ada error
// Tampilkan loading saat submit
```

### Auth Error
```typescript
// Redirect ke login jika belum auth
// Tampilkan pesan error yang jelas
// Jangan expose detail error ke user
```

---

## 6. KONVENSI PENAMAAN

| Item | Konvensi | Contoh |
|------|----------|--------|
| Komponen | PascalCase | `ProductCard` |
| File komponen | kebab-case | `product-card.tsx` |
| Fungsi | camelCase | `getProducts` |
| Variabel | camelCase | `productList` |
| Konstanta | UPPER_SNAKE_CASE | `MAX_FILE_SIZE` |
| Type/Interface | PascalCase | `Product` |
| Folder | kebab-case | `product-card/` |
| Route | kebab-case | `/produk-es-kristal` |
| Slug | kebab-case | `mesin-es-1-ton` |

---

## 7. CATATAN PENTING UNTUK AGENT

1. **SELALU gunakan `use client`** di komponen yang punya state/event handler
2. **SELALU export default** untuk page components
3. **SELALU gunakan named export** untuk reusable components
4. **SELALU handle loading state** dengan skeleton atau spinner
5. **SELALU handle error state** dengan pesan yang jelas
6. **SELALU validasi input** dengan Zod schema
7. **SELALU gunakan TypeScript strict** - jangan `any`
8. **SELALU ikuti struktur folder** yang sudah ditentukan
9. **SELALU buat komponen reusable** - hindari duplikasi
10. **SELALU test sebelum selesai** - pastikan tidak ada error

---

## 8. QUICK REFERENCE

### Firebase Collection Names
```typescript
const COLLECTIONS = {
  PRODUCTS: "products",
  ARTICLES: "articles",
  TESTIMONIALS: "testimonials",
  FAQS: "faqs",
  VIDEOS: "videos",
  GALLERIES: "galleries",
  BANNERS: "banners",
  LEADS: "leads",
  ADMINS: "admins",
} as const;
```

### Warna Tailwind
```
Primary: bg-primary, text-primary, border-primary
Accent: bg-accent, text-accent, border-accent
Gray: bg-gray-100, text-gray-600, dll
```

### Breakpoints
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### WhatsApp Link Format
```
https://wa.me/{nomor}?text={pesan_terencode}
Contoh: https://wa.me/6281234567890?text=Halo%20saya%20tertarik%20dengan%20mesin%20es%20kristal
```
