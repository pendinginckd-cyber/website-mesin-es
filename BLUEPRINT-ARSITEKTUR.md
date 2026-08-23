# BLUEPRINT ARSITEKTUR WEBSITE MESIN ES KRISTAL

## 1. INFORMASI PROYEK
- **Nama Proyek**: Website Penjualan Mesin Es Kristal
- **Tujuan**: Website penjualan B2B yang interaktif, responsif, ringan, dan SEO-friendly
- **Target Pengguna**: Pengusaha es batu, pelaku usaha F&B, distributor
- **Admin**: Pengelola produk, artikel, testimoni, dan leads

---

## 2. TECH STACK

### Frontend
| Komponen | Teknologi | Versi | Alasan |
|----------|-----------|-------|--------|
| Framework | Next.js | 15.x (App Router) | SSR/SSG untuk SEO, routing modern |
| Language | TypeScript | 5.x | Type safety, maintainability |
| Styling | Tailwind CSS | 4.x | Utility-first, ringan, responsif |
| Animasi | Framer Motion | 12.x | Interaktif, smooth transitions |
| Icon | Lucide React | Latest | Ringan, modern |
| Form | React Hook Form + Zod | Latest | Validasi form, performa |

### Backend (Firebase)
| Komponen | Layanan Firebase | Fungsi |
|----------|------------------|--------|
| Database | Firestore | Data produk, artikel, testimoni, leads |
| Storage | Firebase Storage | Gambar produk, gambar artikel, banner |
| Auth | Firebase Authentication | Login admin (email/password) |
| Hosting | Firebase Hosting | Deploy static/SSR, custom domain, SSL |
| Analytics | Google Analytics 4 | Tracking pengunjung, konversi |
| SEO | Firebase Hosting | Sitemap, robots.txt, custom domain |

---

## 3. STRUKTUR FOLDER PROYEK

```
website-mesin-es/
├── .next/                          # Build output (gitignore)
├── .firebase/                      # Firebase config (gitignore)
├── public/                         # Static assets
│   ├── images/                     # Gambar statis (logo, favicon)
│   ├── fonts/                      # Font lokal (opsional)
│   └── robots.txt                  # SEO robots
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (public)/               # Route group: halaman publik
│   │   │   ├── layout.tsx          # Layout publik (navbar, footer)
│   │   │   ├── page.tsx            # Homepage
│   │   │   ├── produk/             # Halaman katalog produk
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/         # Detail produk
│   │   │   │       └── page.tsx
│   │   │   ├── artikel/            # Halaman blog/artikel
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── tentang/            # Halaman tentang kami
│   │   │   │   └── page.tsx
│   │   │   └── kontak/             # Halaman kontak
│   │   │   │   └── page.tsx
│   │   │   └── faq/                # Halaman FAQ
│   │   │   │   └── page.tsx
│   │   │   └── video/              # Halaman Gallery Video (Fase 2)
│   │   │   │   └── page.tsx
│   │   │   └── galeri/             # Halaman Galeri Pabrik
│   │   │       └── page.tsx
│   │   ├── (admin)/                # Route group: halaman admin
│   │   │   ├── admin/
│   │   │   │   ├── layout.tsx      # Layout admin (sidebar, header)
│   │   │   │   ├── page.tsx        # Dashboard admin
│   │   │   │   ├── login/          # Login admin
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── produk/         # CRUD Produk
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── tambah/
│   │   │   │   │   └── edit/[id]/
│   │   │   │   ├── artikel/        # CRUD Artikel
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── tambah/
│   │   │   │   │   └── edit/[id]/
│   │   │   │   ├── testimoni/      # CRUD Testimoni
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── faq/            # CRUD FAQ
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── video/          # CRUD Video
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── galeri/         # CRUD Galeri Pabrik
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── banner/         # CRUD Banner/Promo
│   │   │   │   │   └── page.tsx
│   │   │   │   └── leads/          # Data leads/pesan
│   │   │   │       └── page.tsx
│   │   ├── api/                    # API Routes (jika diperlukan)
│   │   │   └── revalidate/         # ISR revalidation webhook
│   │   ├── layout.tsx              # Root layout
│   │   ├── not-found.tsx           # 404 page
│   │   └── sitemap.ts              # Dynamic sitemap
│   ├── components/                 # Reusable components
│   │   ├── ui/                     # UI primitives (button, input, card)
│   │   ├── layout/                 # Layout components
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── admin-sidebar.tsx
│   │   │   └── admin-header.tsx
│   │   ├── public/                 # Komponen halaman publik
│   │   │   ├── hero-section.tsx
│   │   │   ├── keunggulan-section.tsx
│   │   │   ├── produk-grid.tsx
│   │   │   ├── produk-card.tsx
│   │   │   ├── testimoni-section.tsx
│   │   │   ├── faq-accordion.tsx
│   │   │   ├── faq-item.tsx
│   │   │   ├── youtube-embed.tsx
│   │   │   ├── video-card.tsx
│   │   │   ├── video-gallery.tsx
│   │   │   ├── video-section.tsx
│   │   │   ├── video-testimoni.tsx
│   │   │   ├── roi-calculator.tsx
│   │   │   ├── certification-badges.tsx
│   │   │   ├── gallery-grid.tsx
│   │   │   ├── gallery-lightbox.tsx
│   │   │   ├── cta-section.tsx
│   │   │   ├── artikel-preview.tsx
│   │   │   └── floating-whatsapp.tsx
│   │   ├── admin/                  # Komponen halaman admin
│   │   │   ├── product-form.tsx
│   │   │   ├── article-form.tsx
│   │   │   ├── data-table.tsx
│   │   │   ├── image-uploader.tsx
│   │   │   └── stats-card.tsx
│   │   └── shared/                 # Komponen shared
│   │       ├── seo-head.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── pagination.tsx
│   │       └── loading-skeleton.tsx
│   ├── lib/                        # Utility & config
│   │   ├── firebase/
│   │   │   ├── client.ts           # Firebase client init
│   │   │   ├── admin.ts            # Firebase admin SDK (opsional)
│   │   │   └── config.ts           # Firebase config
│   │   ├── firestore/
│   │   │   ├── products.ts         # Product CRUD helpers
│   │   │   ├── articles.ts         # Article CRUD helpers
│   │   │   ├── testimonials.ts     # Testimonial CRUD helpers
│   │   │   ├── banners.ts          # Banner CRUD helpers
│   │   │   ├── faqs.ts             # FAQ CRUD helpers
│   │   │   ├── videos.ts           # Video CRUD helpers
│   │   │   ├── galleries.ts        # Gallery CRUD helpers
│   │   │   └── leads.ts            # Leads CRUD helpers
│   │   ├── storage/
│   │   │   └── upload.ts           # Storage upload helpers
│   │   ├── utils.ts                # General utilities
│   │   ├── constants.ts            # App constants
│   │   └── validations.ts          # Zod schemas
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-products.ts
│   │   ├── use-articles.ts
│   │   └── use-upload.ts
│   ├── types/                      # TypeScript types
│   │   ├── product.ts
│   │   ├── article.ts
│   │   ├── testimonial.ts
│   │   ├── faq.ts
│   │   ├── video.ts
│   │   ├── gallery.ts
│   │   ├── banner.ts
│   │   ├── lead.ts
│   │   └── user.ts
│   └── styles/
│       └── globals.css             # Global styles + Tailwind
├── .env.local                      # Environment variables (gitignore)
├── .env.example                    # Environment template
├── firebase.json                   # Firebase config
├── .firebaserc                     # Firebase project alias
├── next.config.ts                  # Next.js config
├── tailwind.config.ts              # Tailwind config
├── tsconfig.json
├── package.json
└── README.md
```

---

## 4. DATABASE SCHEMA (FIRESTORE)

### 4.1 Collection: `products`
| Field | Type | Required | Deskripsi |
|-------|------|----------|-----------|
| `id` | string (auto) | ✅ | Document ID |
| `name` | string | ✅ | Nama produk |
| `slug` | string | ✅ | URL-friendly slug |
| `description` | string | ✅ | Deskripsi lengkap |
| `shortDescription` | string | ✅ | Deskripsi singkat (150 char) |
| `capacity` | string | ✅ | Kapasitas (contoh: "1 Ton/Hari") |
| `capacityValue` | number | ✅ | Kapasitas numerik (untuk sorting) |
| `price` | number | ✅ | Harga dalam Rupiah |
| `priceDisplay` | string | ✅ | Format harga ("Rp 50.000.000") |
| `specifications` | array of object | ✅ | Spesifikasi teknis |
| `specifications[].label` | string | ✅ | Label (contoh: "Daya Listrik") |
| `specifications[].value` | string | ✅ | Nilai (contoh: "2200 Watt") |
| `images` | array of string | ✅ | URL gambar dari Firebase Storage (min 3, max 8) |
| `thumbnail` | string | ✅ | URL gambar utama |
| `videoUrl` | string | ❌ | YouTube Video ID (bukan full URL) |
| `category` | string | ✅ | Kategori (kecil, menengah, besar) |
| `isActive` | boolean | ✅ | Status aktif/non-aktif |
| `isFeatured` | boolean | ✅ | Produk unggulan |
| `stock` | string | ✅ | Status stok (tersedia, indent, habis) |
| `warranty` | string | ✅ | Informasi garansi |
| `material` | string | ✅ | Material mesin (contoh: "Stainless Steel 304 Food Grade") |
| `certifications` | array of string | ❌ | Sertifikasi (contoh: ["SNI", "ISO 9001", "Food Grade"]) |
| `roiEstimation` | object | ❌ | Estimasi ROI untuk simulasi |
| `roiEstimation.dailyRevenue` | number | ❌ | Pendapatan estimasi per hari |
| `roiEstimation.dailyCost` | number | ❌ | Biaya produksi per hari |
| `roiEstimation.dailyProfit` | number | ❌ | Profit bersih per hari |
| `roiEstimation.paybackPeriod` | string | ❌ | Estimasi balik modal (contoh: "6 bulan") |
| `createdAt` | timestamp | ✅ | Waktu dibuat |
| `updatedAt` | timestamp | ✅ | Waktu terakhir update |

### 4.2 Collection: `articles`
| Field | Type | Required | Deskripsi |
|-------|------|----------|-----------|
| `id` | string (auto) | ✅ | Document ID |
| `title` | string | ✅ | Judul artikel |
| `slug` | string | ✅ | URL-friendly slug |
| `content` | string | ✅ | Konten artikel (HTML/Markdown) |
| `excerpt` | string | ✅ | Ringkasan (160 char untuk SEO) |
| `coverImage` | string | ✅ | URL gambar cover |
| `author` | string | ✅ | Nama penulis |
| `category` | string | ✅ | Kategori artikel |
| `tags` | array of string | ❌ | Tag artikel |
| `isPublished` | boolean | ✅ | Status publikasi |
| `publishedAt` | timestamp | ❌ | Tanggal publikasi |
| `createdAt` | timestamp | ✅ | Waktu dibuat |
| `updatedAt` | timestamp | ✅ | Waktu terakhir update |

### 4.3 Collection: `testimonials`
| Field | Type | Required | Deskripsi |
|-------|------|----------|-----------|
| `id` | string (auto) | ✅ | Document ID |
| `customerName` | string | ✅ | Nama pelanggan |
| `customerTitle` | string | ❌ | Jabatan/usaha |
| `location` | string | ❌ | Lokasi |
| `content` | string | ✅ | Isi testimoni |
| `rating` | number | ✅ | Rating (1-5) |
| `photo` | string | ❌ | URL foto pelanggan |
| `videoUrl` | string | ❌ | YouTube Video ID (video testimoni) |
| `productUsed` | string | ❌ | Produk yang digunakan |
| `isActive` | boolean | ✅ | Status tampil |
| `isFeatured` | boolean | ✅ | Testimoni unggulan |
| `createdAt` | timestamp | ✅ | Waktu dibuat |

### 4.4 Collection: `banners`
| Field | Type | Required | Deskripsi |
|-------|------|----------|-----------|
| `id` | string (auto) | ✅ | Document ID |
| `title` | string | ✅ | Judul banner |
| `imageUrl` | string | ✅ | URL gambar banner |
| `linkUrl` | string | ❌ | URL tujuan klik |
| `isActive` | boolean | ✅ | Status aktif |
| `order` | number | ✅ | Urutan tampil |
| `startDate` | timestamp | ✅ | Tanggal mulai |
| `endDate` | timestamp | ❌ | Tanggal berakhir |

### 4.5 Collection: `leads`
| Field | Type | Required | Deskripsi |
|-------|------|----------|-----------|
| `id` | string (auto) | ✅ | Document ID |
| `name` | string | ✅ | Nama calon pelanggan |
| `phone` | string | ✅ | Nomor WhatsApp |
| `email` | string | ❌ | Email |
| `message` | string | ✅ | Pesan/kebutuhan |
| `productInterest` | string | ❌ | Produk yang diminati |
| `status` | string | ✅ | Status (new, contacted, converted, closed) |
| `createdAt` | timestamp | ✅ | Waktu dibuat |

### 4.6 Collection: `faqs`
| Field | Type | Required | Deskripsi |
|-------|------|----------|-----------|
| `id` | string (auto) | ✅ | Document ID |
| `question` | string | ✅ | Pertanyaan |
| `answer` | string | ✅ | Jawaban (bisa HTML) |
| `category` | string | ✅ | Kategori (umum, produk, layanan, teknis) |
| `order` | number | ✅ | Urutan tampil |
| `isActive` | boolean | ✅ | Status tampil |
| `createdAt` | timestamp | ✅ | Waktu dibuat |
| `updatedAt` | timestamp | ✅ | Waktu terakhir update |

### 4.7 Collection: `galleries`
| Field | Type | Required | Deskripsi |
|-------|------|----------|-----------|
| `id` | string (auto) | ✅ | Document ID |
| `title` | string | ✅ | Judul foto/galeri |
| `imageUrl` | string | ✅ | URL gambar dari Firebase Storage |
| `category` | string | ✅ | Kategori (workshop, produksi, pengiriman, tim, produk) |
| `description` | string | ❌ | Deskripsi foto |
| `order` | number | ✅ | Urutan tampil |
| `isActive` | boolean | ✅ | Status aktif |
| `createdAt` | timestamp | ✅ | Waktu dibuat |

### 4.8 Collection: `videos`
| Field | Type | Required | Deskripsi |
|-------|------|----------|-----------|
| `id` | string (auto) | ✅ | Document ID |
| `title` | string | ✅ | Judul video |
| `youtubeId` | string | ✅ | YouTube Video ID (contoh: dQw4w9WgXcQ) |
| `description` | string | ✅ | Deskripsi video |
| `thumbnail` | string | ✅ | Thumbnail URL (auto dari YouTube) |
| `category` | string | ✅ | Kategori (demo, testimoni, edukasi, pengiriman, behind-the-scenes) |
| `productId` | string | ❌ | Relasi ke produk (jika video demo produk) |
| `isFeatured` | boolean | ✅ | Video unggulan |
| `order` | number | ✅ | Urutan tampil |
| `isActive` | boolean | ✅ | Status aktif |
| `publishedAt` | timestamp | ✅ | Tanggal publish |
| `createdAt` | timestamp | ✅ | Waktu dibuat |
| `updatedAt` | timestamp | ✅ | Waktu terakhir update |

### 4.8 Collection: `admins`
| Field | Type | Required | Deskripsi |
|-------|------|----------|-----------|
| `uid` | string | ✅ | Firebase Auth UID |
| `email` | string | ✅ | Email admin |
| `displayName` | string | ✅ | Nama tampilan |
| `role` | string | ✅ | Role (superadmin, admin) |
| `photoUrl` | string | ❌ | Foto profil |
| `createdAt` | timestamp | ✅ | Waktu dibuat |

---

## 5. FIREBASE STORAGE STRUCTURE

```
storage/
├── products/
│   ├── {productId}/
│   │   ├── thumbnail.webp
│   │   ├── image-1.webp
│   │   ├── image-2.webp
│   │   └── image-3.webp
├── articles/
│   ├── {articleId}/
│   │   ├── cover.webp
│   │   └── content-image-1.webp
├── testimonials/
│   └── {testimonialId}/
│       └── photo.webp
├── banners/
│   └── {bannerId}/
│       └── banner.webp
└── admin/
    └── {adminId}/
        └── avatar.webp
```

---

## 6. FIREBASE SECURITY RULES

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Products: read publik, write hanya admin
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Articles: read publik, write hanya admin
    match /articles/{articleId} {
      allow read: if resource.data.isPublished == true || request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Testimonials: read publik, write hanya admin
    match /testimonials/{testimonialId} {
      allow read: if resource.data.isActive == true || request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Banners: read publik, write hanya admin
    match /banners/{bannerId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Leads: read/write hanya admin
    match /leads/{leadId} {
      allow read, write: if request.auth != null;
    }
    
    // FAQs: read publik, write hanya admin
    match /faqs/{faqId} {
      allow read: if resource.data.isActive == true || request.auth != null;
      allow write: if request.auth != null;
    }

    // Galleries: read publik, write hanya admin
    match /galleries/{galleryId} {
      allow read: if resource.data.isActive == true || request.auth != null;
      allow write: if request.auth != null;
    }

    // Videos: read publik, write hanya admin
    match /videos/{videoId} {
      allow read: if resource.data.isActive == true || request.auth != null;
      allow write: if request.auth != null;
    }

    // Admins: read/write hanya admin
    match /admins/{adminId} {
      allow read, write: if request.auth != null && request.auth.uid == adminId;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /articles/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /testimonials/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /banners/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /admin/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 7. ALUR DATA (DATA FLOW)

### 7.1 Alur CRUD Produk (Admin)
```
Admin Login → Dashboard → Produk → Tambah Produk
  1. Admin mengisi form (nama, deskripsi, harga, spesifikasi)
  2. Upload gambar → Firebase Storage → dapatkan URL
  3. Submit form → Firestore (collection: products)
  4. Generate slug otomatis dari nama produk
  5. Revalidate ISR → halaman publik update
```

### 7.2 Alur Tampil Produk (Publik)
```
User buka /produk
  1. Next.js fetch data dari Firestore (SSR/SSG)
  2. Render produk grid dengan pagination
  3. User klik produk → /produk/[slug]
  4. Fetch detail produk + gambar dari Firestore
  5. Render halaman detail + tombol WhatsApp CTA
```

### 7.3 Alur Leads (Form Kontak)
```
User isi form kontak → Submit
  1. Validasi form (Zod)
  2. Simpan ke Firestore (collection: leads)
  3. Redirect ke WhatsApp dengan pesan otomatis
  4. Admin dapat melihat leads di dashboard
```

### 7.4 Alur Login Admin
```
Admin buka /admin/login
  1. Input email + password
  2. Firebase Auth signInWithEmailAndPassword
  3. Cek collection admins untuk role
  4. Redirect ke /admin/dashboard
  5. Protected route via middleware
```

---

## 8. ROUTING STRATEGY

### Public Routes
| Path | Komponen | Data Source | Render Method |
|------|----------|-------------|---------------|
| `/` | Homepage | Firestore (products, testimonials, banners) | SSG + ISR |
| `/produk` | Product Listing | Firestore (products) | SSG + ISR |
| `/produk/[slug]` | Product Detail | Firestore (products) | SSG + ISR |
| `/artikel` | Article Listing | Firestore (articles) | SSG + ISR |
| `/artikel/[slug]` | Article Detail | Firestore (articles) | SSG + ISR |
| `/tentang` | About Page | Static | Static |
| `/kontak` | Contact Page | Static + Form | Static |
| `/faq` | FAQ Page | Firestore (faqs) | SSG + ISR |
| `/video` | Video Gallery (Fase 2) | Firestore (videos) | SSG + ISR |
| `/galeri` | Galeri Pabrik | Firestore (galleries) | SSG + ISR |

### Admin Routes (Protected)
| Path | Komponen | Data Source | Render Method |
|------|----------|-------------|---------------|
| `/admin/login` | Login Page | Firebase Auth | Client |
| `/admin` | Dashboard | Firestore (stats) | Client |
| `/admin/produk` | Product List | Firestore (products) | Client |
| `/admin/produk/tambah` | Product Form | Firestore + Storage | Client |
| `/admin/produk/edit/[id]` | Product Edit | Firestore + Storage | Client |
| `/admin/artikel` | Article List | Firestore (articles) | Client |
| `/admin/artikel/tambah` | Article Form | Firestore + Storage | Client |
| `/admin/artikel/edit/[id]` | Article Edit | Firestore + Storage | Client |
| `/admin/testimoni` | Testimonial CRUD | Firestore (testimonials) | Client |
| `/admin/banner` | Banner CRUD | Firestore (banners) | Client |
| `/admin/leads` | Leads Management | Firestore (leads) | Client |

---

## 9. WARNA & DESAIN SYSTEM

### Color Palette
```css
/* Primary */
--color-primary: #0284c7;        /* Biru Laut - utama */
--color-primary-dark: #0369a1;   /* Biru gelap - hover */
--color-primary-light: #e0f2fe;  /* Biru muda - background */

/* Secondary / Accent */
--color-accent: #f97316;         /* Oranye - CTA */
--color-accent-dark: #ea580c;    /* Oranye gelap - hover */
--color-accent-light: #fff7ed;   /* Oranye muda - background */

/* Neutral */
--color-white: #ffffff;
--color-gray-50: #f9fafb;
--color-gray-100: #f3f4f6;
--color-gray-200: #e5e7eb;
--color-gray-300: #d1d5db;
--color-gray-400: #9ca3af;
--color-gray-500: #6b7280;
--color-gray-600: #4b5563;
--color-gray-700: #374151;
--color-gray-800: #1f2937;
--color-gray-900: #111827;

/* Semantic */
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-info: #3b82f6;
```

### Typography
| Element | Font | Size | Weight |
|---------|------|------|--------|
| Heading 1 | Inter/Plus Jakarta Sans | 48px (desktop), 32px (mobile) | 700 |
| Heading 2 | Inter/Plus Jakarta Sans | 36px (desktop), 28px (mobile) | 700 |
| Heading 3 | Inter/Plus Jakarta Sans | 24px (desktop), 20px (mobile) | 600 |
| Body | Inter | 16px | 400 |
| Small | Inter | 14px | 400 |
| Button | Inter | 16px | 600 |

### Spacing Scale
```
xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px, 3xl: 64px
```

### Breakpoints
```
sm: 640px (mobile)
md: 768px (tablet)
lg: 1024px (laptop)
xl: 1280px (desktop)
2xl: 1536px (large desktop)
```

---

## 10. DEPLOYMENT

### Firebase Hosting Config (firebase.json)
```json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "function": "nextjsFunc"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|ico)",
        "headers": [
          { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
        ]
      }
    ]
  }
}
```

### Deploy Command
```bash
# Build
npm run build

# Deploy ke Firebase Hosting
firebase deploy --only hosting

# Deploy semua (hosting + firestore rules + storage rules)
firebase deploy
```

---

## 11. ENVIRONMENT VARIABLES

```env
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=6281234567890
NEXT_PUBLIC_WHATSAPP_MESSAGE=Halo%20saya%20tertarik%20dengan%20mesin%20es%20kristal

# App
NEXT_PUBLIC_SITE_URL=https://mesineskristal.com
NEXT_PUBLIC_SITE_NAME=Mesin Es Kristal
```

---

## 12. DEVELOPMENT WORKFLOW

### Phase 1: Setup & Foundation (Minggu 1)
- [ ] Inisialisasi Next.js project + TypeScript
- [ ] Setup Tailwind CSS + konfigurasi tema
- [ ] Setup Firebase project + konfigurasi
- [ ] Buat struktur folder sesuai blueprint
- [ ] Buat root layout + global styles

### Phase 2: Komponen UI & Layout (Minggu 2)
- [ ] Buat komponen UI dasar (button, input, card, modal)
- [ ] Buat navbar + footer (publik)
- [ ] Buat admin sidebar + header
- [ ] Buat loading skeleton + error boundary

### Phase 3: Firebase Integration (Minggu 3)
- [ ] Setup Firebase Auth (login admin)
- [ ] Setup Firestore helpers (CRUD)
- [ ] Setup Storage upload helper
- [ ] Buat protected route middleware

### Phase 4: Halaman Publik (Minggu 4-5)
- [ ] Homepage (hero, keunggulan, produk, testimoni, video section, CTA)
- [ ] Halaman produk + detail produk (dengan embed video demo, multi-foto, ROI calculator)
- [ ] Halaman artikel + detail artikel
- [ ] Halaman tentang + kontak + FAQ + section legalitas
- [ ] Halaman galeri pabrik (/galeri)
- [ ] Floating WhatsApp button
- [ ] Komponen YouTube lazy load (click-to-play)
- [ ] Komponen ROI Calculator (simulasi keuntungan)
- [ ] Komponen Certification Badges (SNI, ISO, Food Grade)

### Phase 5: Admin Dashboard (Minggu 6-7)
- [ ] Dashboard overview + stats
- [ ] CRUD Produk (form, upload multi-gambar, video URL, sertifikasi, ROI estimasi, tabel)
- [ ] CRUD Artikel (rich text editor, upload cover)
- [ ] CRUD Testimoni (teks + video)
- [ ] CRUD FAQ
- [ ] CRUD Video (input YouTube URL, kategori, featured)
- [ ] CRUD Galeri (upload foto pabrik, kategori, order)
- [ ] CRUD Banner
- [ ] Leads management

### Phase 6: SEO & Optimasi (Minggu 8)
- [ ] Meta tags dinamis per halaman
- [ ] Dynamic sitemap.xml + video sitemap
- [ ] robots.txt
- [ ] Open Graph tags + VideoObject schema
- [ ] Lazy loading gambar + video
- [ ] Image optimization (WebP)
- [ ] Page speed optimization

### Phase 7: Testing & Deploy (Minggu 9)
- [ ] Test responsivitas (mobile, tablet, desktop)
- [ ] Test CRUD admin
- [ ] Test form validasi
- [ ] Test Firebase security rules
- [ ] Test YouTube lazy load (tidak berat)
- [ ] Deploy ke Firebase Hosting
- [ ] Setup custom domain + SSL

### Phase 8: Gallery Video (Fase 2 - Opsional)
- [ ] Halaman /video dengan filter kategori
- [ ] Grid video dengan thumbnail lazy load
- [ ] Auto-fetch title/thumbnail via YouTube API (opsional)

---

## 13. CATATAN PENTING

1. **Semua gambar produk/artikel harus dikompres ke WebP** sebelum upload
2. **Slug harus unik** dan auto-generate dari nama produk/artikel
3. **ISR (Incremental Static Regeneration)** dengan revalidate 3600 detik
4. **Admin hanya bisa diakses** oleh user yang terautentikasi
5. **WhatsApp CTA** harus selalu terlihat di halaman produk
6. **Form kontak** harus validasi nomor telepon Indonesia
7. **Pagination** untuk produk dan artikel (max 12 per halaman)
8. **Breadcrumb** untuk navigasi yang jelas
9. **Loading state** harus ditampilkan saat fetch data
10. **Error handling** yang user-friendly
11. **YouTube video WAJIB lazy load** — tampilkan thumbnail dulu, baru load iframe saat diklik
12. **Video URL simpan YouTube ID saja** (bukan full URL) untuk konsistensi
13. **Thumbnail video otomatis** dari `img.youtube.com/vi/{id}/maxresdefault.jpg`
14. **Maximum 1 video aktif per halaman** — jangan load multiple iframe sekaligus
15. **Video testimoni lebih powerful** dari teks — prioritaskan koleksi video dari pelanggan
16. **Multi-foto produk WAJIB** — minimal 3 foto (tampak depan, samping, detail, hasil es)
17. **ROI Calculator harus interaktif** — user bisa input angka sendiri (harga jual es, biaya listrik, biaya air)
18. **Sertifikasi harus terlihat** — tampilkan logo SNI, ISO, Food Grade di halaman produk dan tentang
19. **Material mesin harus jelas** — sebutkan jenis stainless steel (304/316) dan grade food-safe
20. **Galeri pabrik harus real** — foto workshop asli, bukan stock photo, untuk bangun trust
21. **Error "unique key" di ProdukGrid sudah diperbaiki** — gunakan `product.slug` sebagai kunci unik (bukan `product.id`)
22. **Firestore Rules sudah dipublish** ke Firebase Console
23. **Storage Rules sudah dipublish** ke Firebase Console
24. **Firestore composite index** perlu dibuat di Firebase Console untuk query products dengan kategori
11. **YouTube video WAJIB lazy load** — tampilkan thumbnail dulu, baru load iframe saat diklik
12. **Video URL simpan YouTube ID saja** (bukan full URL) untuk konsistensi
13. **Thumbnail video otomatis** dari `img.youtube.com/vi/{id}/maxresdefault.jpg`
14. **Maximum 1 video aktif per halaman** — jangan load multiple iframe sekaligus
15. **Video testimoni lebih powerful** dari teks — prioritaskan koleksi video dari pelanggan
16. **Multi-foto produk WAJIB** — minimal 3 foto (tampak depan, samping, detail, hasil es)
17. **ROI Calculator harus interaktif** — user bisa input angka sendiri (harga jual es, biaya listrik, biaya air)
18. **Sertifikasi harus terlihat** — tampilkan logo SNI, ISO, Food Grade di halaman produk dan tentang
19. **Material mesin harus jelas** — sebutkan jenis stainless steel (304/316) dan grade food-safe
20. **Galeri pabrik harus real** — foto workshop asli, bukan stock photo, untuk bangun trust
