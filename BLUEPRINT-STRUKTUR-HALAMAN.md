# BLUEPRINT STRUKTUR HALAMAN & KOMPONEN

## 1. HALAMAN PUBLIK

### 1.1 Homepage (/)

#### Wireframe Layout
```
┌─────────────────────────────────────────────────────┐
│                      NAVBAR                         │
│  [Logo]  [Beranda] [Produk] [Artikel] [Tentang]     │
│  [Kontak]                    [Tombol Hubungi Kami]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│                  HERO SECTION                       │
│                                                     │
│   "Mesin Es Kristal Berkualitas Tinggi"             │
│   "Garansi Resmi & Hemat Listrik"                   │
│                                                     │
│   [Lihat Produk]  [Konsultasi WhatsApp]             │
│                                                     │
│   [Background: Video/Foto Mesin Beroperasi]         │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│              KEUNGGULAN SECTION                     │
│                                                     │
│   [Icon] Kapasitas Riil    [Icon] Garansi Resmi     │
│   [Icon] Suku Cadang Lengkap [Icon] Hemat Listrik   │
│   [Icon] Teknisi Siap Datang [Icon] Free Konsultasi │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│              PRODUK UNGGULAN SECTION                │
│                                                     │
│   [Produk Card 1] [Produk Card 2] [Produk Card 3]   │
│   [Produk Card 4]                                   │
│                                                     │
│  [Lihat Semua Produk →]                 │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│              FAQ SECTION                            │
│                                                     │
│  [Pertanyaan 1 ▼]                                   │
│  [Pertanyaan 2 ▶]                                   │
│  [Pertanyaan 3 ▶]                                   │
│                                                     │
│              [Lihat Semua FAQ →]                    │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│              TESTIMONI SECTION                      │
│                                                     │
│   ← [Testimoni Card 1] [Testimoni Card 2] →         │
│      [Foto + Nama + Rating + Isi Testimoni]         │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│              VIDEO SECTION                          │
│                                                     │
│   "Lihat Mesin Kami Beroperasi"                     │
│                                                     │
│   [Video 1] [Video 2] [Video 3]                     │
│   [Thumbnail + Play Button]                         │
│                                                     │
│              [Lihat Semua Video →]                  │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│              CTA SECTION                            │
│                                                     │
│   "Butuh Konsultasi Kebutuhan Mesin Es?"            │
│   "Hubungi Kami Sekarang, Gratis!"                  │
│                                                     │
│   [Konsultasi via WhatsApp]                         │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│              ARTIKEL TERBARU SECTION                │
│                                                     │
│   [Artikel 1] [Artikel 2] [Artikel 3]               │
│                                                     │
│              [Lihat Semua Artikel →]                │
│                                                     │
├─────────────────────────────────────────────────────┤
│                      FOOTER                         │
│  [Logo] [Alamat] [Telepon] [Email] [Jam Operasional]│
│  [Link Cepat] [Media Sosial]                        │
│  © 2025 Mesin Es Kristal. All rights reserved.      │
└─────────────────────────────────────────────────────┘
```

#### Komponen yang Digunakan
| Section | Komponen | Data Source |
|---------|----------|-------------|
| Navbar | `layout/navbar.tsx` | Static |
| Hero | `public/hero-section.tsx` | Banner dari Firestore |
| Keunggulan | `public/keunggulan-section.tsx` | Static |
| Produk Unggulan | `public/produk-grid.tsx` + `produk-card.tsx` | Firestore (featured products) |
| Testimoni | `public/testimoni-section.tsx` | Firestore (featured testimonials) |
| FAQ | `public/faq-accordion.tsx` | Firestore (featured faqs) |
| Video | `public/video-section.tsx` | Firestore (featured videos) |
| CTA | `public/cta-section.tsx` | Static |
| Artikel | `public/artikel-preview.tsx` | Firestore (latest articles) |
| Floating WA | `public/floating-whatsapp.tsx` | Static (env variable) |
| Footer | `layout/footer.tsx` | Static |

---

### 1.2 Halaman Produk (/produk)

#### Wireframe Layout
```
┌─────────────────────────────────────────────────────┐
│                      NAVBAR                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Breadcrumb: Beranda > Produk                       │
│                                                     │
│  <h1>Katalog Mesin Es Kristal</h1>                  │
│                                                     │
│  [Filter: Semua | Kecil | Menengah | Besar]         │
│  [Sortir: Terbaru | Harga Terendah | Harga Tertinggi]│
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │[Gambar]  │ │[Gambar]  │ │[Gambar]  │             │
│  │Nama      │ │Nama      │ │Nama      │             │
│  │Kapasitas │ │Kapasitas │ │Kapasitas │             │
│  │Harga     │ │Harga     │ │Harga     │             │
│  │[Detail]  │ │[Detail]  │ │[Detail]  │             │
│  └──────────┘ └──────────┘ └──────────┘             │
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │[Gambar]  │ │[Gambar]  │ │[Gambar]  │             │
│  │...       │ │...       │ │...       │             │
│  └──────────┘ └──────────┘ └──────────┘             │
│                                                     │
│  [← 1] [2] [3] [4] [→]                              │
│                                                     │
├─────────────────────────────────────────────────────┤
│                      FOOTER                         │
└─────────────────────────────────────────────────────┘
```

#### Komponen yang Digunakan
| Element | Komponen | Data Source |
|---------|----------|-------------|
| Breadcrumb | `shared/breadcrumb.tsx` | Static |
| Filter | `public/produk-filter.tsx` | Static |
| Grid | `public/produk-grid.tsx` | Firestore (products) |
| Card | `public/produk-card.tsx` | Firestore (product item) |
| Pagination | `shared/pagination.tsx` | Static |

---

### 1.3 Halaman Detail Produk (/produk/[slug])

#### Wireframe Layout
```
┌─────────────────────────────────────────────────────┐
│                      NAVBAR                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Breadcrumb: Beranda > Produk > [Nama Produk]       │
│                                                     │
│  ┌─────────────────┐  ┌──────────────────────────┐  │
│  │                 │  │  Nama Produk              │  │
│  │  [Gambar Utama] │  │  Kapasitas: X Ton/Hari    │  │
│  │                 │  │  Harga: Rp XX.XXX.XXX     │  │
│  │                 │  │  Stok: Tersedia           │  │
│  │                 │  │  Garansi: X Tahun         │  │
│  │                 │  │  Material: SS 304 FG      │  │
│  │  [Thumb][Thumb] │  │  [SNI] [ISO] [FoodGrade]  │  │
│  │  [Thumb][Thumb] │  │                           │  │
│  │  [Thumb][Thumb] │  │  [Konsultasi WhatsApp]    │  │
│  │  [Thumb][Thumb] │  │  [Minta Penawaran]        │  │
│  └─────────────────┘  └──────────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Spesifikasi Teknis                           │  │
│  │  ┌─────────────────┬─────────────────────┐    │  │
│  │  │ Daya Listrik    │ 2200 Watt           │    │  │
│  │  │ Kapasitas       │ 1 Ton/Hari          │    │  │
│  │  │ Refrigeran      │ R404A               │    │  │
│  │  │ Material        │ SS 304 Food Grade   │    │  │
│  │  │ Dimensi         │ 120x80x150 cm       │    │  │
│  │  │ Berat           │ 250 kg              │    │  │
│  │  └─────────────────┴─────────────────────┘    │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Sertifikasi                                  │  │
│  │  [✓ SNI] [✓ ISO 9001] [✓ Food Grade SS 304]  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Deskripsi Lengkap                            │  │
│  │  <p>Paragraf deskripsi produk...</p>          │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  [Video YouTube Embed] (opsional)                   │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Simulasi Keuntungan Usaha                    │  │
│  │                                               │  │
│  │  Kapasitas: [1000] kg/hari                    │  │
│  │  Harga Jual Es: [Rp 3.000]/kg                 │  │
│  │  Biaya Listrik: [Rp 1.444]/kWh                │  │
│  │  Konsumsi Listrik: [2.2] kWh                  │  │
│  │  Biaya Air: [Rp 5.000]/m3                     │  │
│  │  Konsumsi Air: [1.5] m3/hari                  │  │
│  │                                               │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │ Pendapatan Harian:    Rp 3.000.000      │  │  │
│  │  │ Biaya Operasional:    Rp 850.000        │  │  │
│  │  │ Profit Bersih:        Rp 2.150.000/hari │  │  │
│  │  │ Profit Bulanan:       Rp 64.500.000     │  │  │
│  │  │ Estimasi Balik Modal: 8 bulan           │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  │                                               │  │
│  │  *Estimasi dapat berbeda tergantung kondisi   │  │
│  │   lapangan                                    │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Produk Terkait                               │  │
│  │  [Card 1] [Card 2] [Card 3]                   │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
├─────────────────────────────────────────────────────┤
│                      FOOTER                         │
└─────────────────────────────────────────────────────┘
```

#### Komponen yang Digunakan
| Element | Komponen | Data Source |
|---------|----------|-------------|
| Breadcrumb | `shared/breadcrumb.tsx` | Static |
| Galeri | `public/produk-gallery.tsx` | Firestore (product.images) |
| Info Produk | `public/produk-info.tsx` | Firestore (product) |
| Spesifikasi | `public/produk-specs.tsx` | Firestore (product.specifications) |
| Deskripsi | `public/produk-description.tsx` | Firestore (product.description) |
| Video | `shared/youtube-embed.tsx` | Firestore (product.videoUrl) |
| Sertifikasi | `public/certification-badges.tsx` | Firestore (product.certifications) |
| ROI Calculator | `public/roi-calculator.tsx` | Interaktif (input user + data produk) |
| Produk Terkait | `public/produk-grid.tsx` | Firestore (related products) |

---

### 1.4 Halaman Artikel (/artikel)

#### Wireframe Layout
```
┌─────────────────────────────────────────────────────┐
│                      NAVBAR                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Breadcrumb: Beranda > Artikel                      │
│                                                     │
│  <h1>Artikel & Tips Bisnis Es Kristal</h1>          │
│                                                     │
│  [Filter: Semua | Tips Bisnis | Perawatan | ROI]    │
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │[Cover]   │ │[Cover]   │ │[Cover]   │             │
│  │Judul     │ │Judul     │ │Judul     │             │
│  │Excerpt   │ │Excerpt   │ │Excerpt   │             │
│  │Tanggal   │ │Tanggal   │ │Tanggal   │             │
│  │[Baca →]  │ │[Baca →]  │ │[Baca →]  │             │
│  └──────────┘ └──────────┘ └──────────┘             │
│                                                     │
│  [← 1] [2] [3] [→]                                  │
│                                                     │
├─────────────────────────────────────────────────────┤
│                      FOOTER                         │
└─────────────────────────────────────────────────────┘
```

#### Komponen yang Digunakan
| Element | Komponen | Data Source |
|---------|----------|-------------|
| Breadcrumb | `shared/breadcrumb.tsx` | Static |
| Filter | `public/artikel-filter.tsx` | Static |
| Grid | `public/artikel-grid.tsx` | Firestore (articles) |
| Card | `public/artikel-card.tsx` | Firestore (article item) |
| Pagination | `shared/pagination.tsx` | Static |

---

### 1.5 Halaman Detail Artikel (/artikel/[slug])

#### Wireframe Layout
```
┌─────────────────────────────────────────────────────┐
│                      NAVBAR                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Breadcrumb: Beranda > Artikel > [Judul Artikel]    │
│                                                     │
│  [Cover Image Full Width]                           │
│                                                     │
│  <h1>Judul Artikel</h1>                             │
│  [Kategori] | [Tanggal] | Oleh [Author]             │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │                                               │  │
│  │  <p>Paragraf 1...</p>                         │  │
│  │  <h2>Sub Judul</h2>                           │  │
│  │  <p>Paragraf 2...</p>                         │  │
│  │  <ul><li>List item</li></ul>                  │  │
│  │  <p>Paragraf 3...</p>                         │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Artikel Terkait                              │  │
│  │  [Card 1] [Card 2] [Card 3]                   │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
├─────────────────────────────────────────────────────┤
│                      FOOTER                         │
└─────────────────────────────────────────────────────┘
```

---

### 1.6 Halaman Tentang (/tentang)

#### Wireframe Layout
```
┌─────────────────────────────────────────────────────┐
│                      NAVBAR                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Breadcrumb: Beranda > Tentang Kami                 │
│                                                     │
│  <h1>Tentang Kami</h1>                              │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  [Foto Workshop/Kantor]                       │  │
│  │                                               │  │
│  │  <p>Profil perusahaan...</p>                  │  │
│  │  <p>Sejarah singkat...</p>                    │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Visi & Misi                                  │  │
│  │  <h2>Visi</h2><p>...</p>                      │  │
│  │  <h2>Misi</h2><ul><li>...</li></ul>           │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Kenapa Memilih Kami?                         │  │
│  │  [Icon] Pengalaman X Tahun                    │  │
│  │  [Icon] X+ Mesin Terjual                      │  │
│  │  [Icon] X+ Pelanggan Puas                     │  │
│  │  [Icon] Garansi Resmi                         │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  [Google Maps Embed]                                │
│                                                     │
├─────────────────────────────────────────────────────┤
│                      FOOTER                         │
└─────────────────────────────────────────────────────┘
```

---

### 1.7 Halaman Kontak (/kontak)

#### Wireframe Layout
```
┌─────────────────────────────────────────────────────┐
│                      NAVBAR                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Breadcrumb: Beranda > Kontak                       │
│                                                     │
│  <h1>Hubungi Kami</h1>                              │
│                                                     │
│  ┌─────────────────────────┐ ┌───────────────────┐  │
│  │  Form Kontak            │ │  Info Kontak      │  │
│  │                         │ │                   │  │
│  │  Nama: [________]       │ │  📍 Alamat        │  │
│  │  Telepon: [________]    │ │  Jl. ...          │  │
│  │  Email: [________]      │ │                   │  │
│  │  Produk: [Dropdown]     │ │  📞 Telepon       │  │
│  │  Pesan: [________]      │ │  0812-xxxx-xxxx   │  │
│  │         [________]      │ │                   │  │
│  │                         │ │  📧 Email         │  │
│  │  [Kirim Pesan]          │ │  info@...         │  │
│  │                         │ │                   │  │
│  │                         │ │  🕐 Jam Operasional│ │  │
│  │                         │ │  Senin-Sabtu      │  │
│  │                         │ │  08:00-17:00      │  │
│  └─────────────────────────┘ └───────────────────┘  │
│                                                     │
├─────────────────────────────────────────────────────┤
│                      FOOTER                         │
└─────────────────────────────────────────────────────┘
```

---

### 1.8 Halaman FAQ (/faq)

#### Wireframe Layout
```
┌─────────────────────────────────────────────────────┐
│                      NAVBAR                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Breadcrumb: Beranda > FAQ                          │
│                                                     │
│  <h1>Pertanyaan yang Sering Diajukan (FAQ)</h1>     │
│                                                     │
│  [Filter: Semua | Umum | Produk | Layanan | Teknis] │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Kategori: Umum                               │  │
│  │                                               │  │
│  │  ▼ Apa itu mesin es kristal?                  │  │
│  │    Mesin es kristal adalah mesin yang...      │  │
│  │                                               │  │
│  │  ▶ Berapa lama garansi mesin?                 │  │
│  │                                               │  │
│  │  ▶ Apakah bisa datang ke lokasi?              │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Kategori: Produk                             │  │
│  │                                               │  │
│  │  ▶ Berapa kapasitas mesin es kristal?         │  │
│  │                                               │  │
│  │  ▶ Apa perbedaan es kristal dan es balok?     │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Kategori: Layanan                            │  │
│  │                                               │  │
│  │  ▶ Apakah ada layanan purna jual?             │  │
│  │                                               │  │
│  │  ▶ Bagaimana cara konsultasi?                 │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Kategori: Teknis                             │  │
│  │                                               │  │
│  │  ▶ Berapa daya listrik yang dibutuhkan?       │  │
│  │                                               │  │
│  │  ▶ Apa jenis refrigeran yang digunakan?       │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Masih punya pertanyaan?                      │  │
│  │  [Hubungi Kami via WhatsApp]                  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
├─────────────────────────────────────────────────────┤
│                      FOOTER                         │
└─────────────────────────────────────────────────────┘
```

#### Komponen yang Digunakan
| Element | Komponen | Data Source |
|---------|----------|-------------|
| Breadcrumb | `shared/breadcrumb.tsx` | Static |
| Filter | `public/faq-filter.tsx` | Static |
| FAQ Accordion | `public/faq-accordion.tsx` | Firestore (faqs) |
| FAQ Item | `public/faq-item.tsx` | Firestore (faq item) |
| CTA | `public/cta-section.tsx` | Static |

---

### 1.9 Halaman Video (/video) - Fase 2

#### Wireframe Layout
```
┌─────────────────────────────────────────────────────┐
│                      NAVBAR                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Breadcrumb: Beranda > Video                        │
│                                                     │
│  <h1>Video Mesin Es Kristal</h1>                    │
│  <p>Lihat langsung mesin kami beroperasi, testimoni │
│   pelanggan, dan proses pengiriman.</p>             │
│                                                     │
│  [Filter: Semua | Demo | Testimoni | Edukasi | Kirim]│
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │[Thumbnail]│[Thumbnail]│[Thumbnail]│             │
│  │[  ▶    ] │[  ▶    ] │[  ▶    ] │             │
│  │Judul     │ │Judul     │ │Judul     │             │
│  │Kategori  │ │Kategori  │ │Kategori  │             │
│  └──────────┘ └──────────┘ └──────────┘             │
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │[Thumbnail]│[Thumbnail]│[Thumbnail]│             │
│  │...       │ │...       │ │...       │             │
│  └──────────┘ └──────────┘ └──────────┘             │
│                                                     │
│  [← 1] [2] [3] [→]                                  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Butuh konsultasi?                            │  │
│  │  [Hubungi Kami via WhatsApp]                  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
├─────────────────────────────────────────────────────┤
│                      FOOTER                         │
└─────────────────────────────────────────────────────┘
```

#### Komponen yang Digunakan
| Element | Komponen | Data Source |
|---------|----------|-------------|
| Breadcrumb | `shared/breadcrumb.tsx` | Static |
| Filter | `public/video-filter.tsx` | Static |
| Grid | `public/video-gallery.tsx` | Firestore (videos) |
| Card | `public/video-card.tsx` | Firestore (video item) |
| Embed | `shared/youtube-embed.tsx` | YouTube API |
| Pagination | `shared/pagination.tsx` | Static |

---

### 1.10 Halaman Galeri Pabrik (/galeri)

#### Wireframe Layout
```
┌─────────────────────────────────────────────────────┐
│                      NAVBAR                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Breadcrumb: Beranda > Galeri                       │
│                                                     │
│  <h1>Galeri Workshop & Produksi Kami</h1>           │
│  <p>Lihat langsung proses pembuatan mesin es        │
│   kristal di workshop kami.</p>                     │
│                                                     │
│  [Filter: Semua | Workshop | Produksi | Pengiriman] │
│                                                     │
│  ┌────────┐ ┌────────┐ ┌────────┐                   │
│  │[Foto 1]│ │[Foto 2]│ │[Foto 3]│                   │
│  │[Foto 4]│ │[Foto 5]│ │[Foto 6]│                   │
│  │[Foto 7]│ │[Foto 8]│ │[Foto 9]│                   │
│  └────────┘ └────────┘ └────────┘                   │
│                                                     │
│  [← 1] [2] [3] [→]                                  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Ingin lihat langsung?                        │  │
│  │  Kunjungi workshop kami atau konsultasi online│  │
│  │  [Kunjungi Workshop] [Konsultasi WhatsApp]    │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
├─────────────────────────────────────────────────────┤
│                      FOOTER                         │
└─────────────────────────────────────────────────────┘
```

#### Komponen yang Digunakan
| Element | Komponen | Data Source |
|---------|----------|-------------|
| Breadcrumb | `shared/breadcrumb.tsx` | Static |
| Filter | `public/gallery-filter.tsx` | Static |
| Grid | `public/gallery-grid.tsx` | Firestore (galleries) |
| Lightbox | `public/gallery-lightbox.tsx` | Firestore (gallery images) |
| CTA | `public/cta-section.tsx` | Static |

---

### 1.11 Komponen YouTube Embed (src/components/shared/youtube-embed.tsx)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   [Thumbnail Image dari YouTube]                    │
│                                                     │
│                    [▶ PLAY]                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Behavior:**
- Tampilkan thumbnail dari `img.youtube.com/vi/{id}/maxresdefault.jpg`
- Overlay tombol play di tengah
- Saat diklik → ganti dengan iframe YouTube (autoplay)
- Hanya 1 video yang di-load per halaman
- Lazy load: thumbnail pakai `loading="lazy"`
- Aspect ratio 16:9

**Props:**
- `videoId`: string (YouTube ID, contoh: `dQw4w9WgXcQ`)
- `title`: string (untuk accessibility)
- `className`: string (opsional)

---

### 1.12 Komponen Video Card (src/components/public/video-card.tsx)

```
┌──────────────────┐
│                  │
│   [Thumbnail]    │
│      [▶]         │
│                  │
├──────────────────┤
│ Judul Video      │
│ [Kategori Badge] │
└──────────────────┘
```

**Props:**
- `video`: Video
- `variant`: "default" | "featured"

---

### 1.13 Komponen Video Section (src/components/public/video-section.tsx)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   "Lihat Mesin Kami Beroperasi"                     │
│                                                     │
│   [Video 1] [Video 2] [Video 3]                     │
│   [Thumbnail + Play Button]                         │
│                                                     │
│              [Lihat Semua Video →]                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Data Source:** Firestore (featured videos, limit 3)

---

### 1.14 Komponen Video Testimoni (src/components/public/video-testimoni.tsx)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   "Apa Kata Pelanggan Kami"                         │
│                                                     │
│   ← [Video Testimoni 1] [Video Testimoni 2] →       │
│     [Thumbnail + Play]                              │
│     [Nama + Lokasi + Produk]                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Data Source:** Firestore (testimonials with videoUrl)

---

### 1.15 Komponen ROI Calculator (src/components/public/roi-calculator.tsx)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   Simulasi Keuntungan Usaha Mesin Es Kristal        │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │ Input                                       │   │
│   │                                             │   │
│   │ Kapasitas Mesin:    [1000] kg/hari          │   │
│   │ Harga Jual Es:      [Rp 3.000]/kg           │   │
│   │ Biaya Listrik:      [Rp 1.444]/kWh          │   │
│   │ Konsumsi Listrik:   [2.2] kWh               │   │
│   │ Biaya Air:          [Rp 5.000]/m3           │   │
│   │ Konsumsi Air:       [1.5] m3/hari           │   │
│   └─────────────────────────────────────────────┘   │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │ Hasil Estimasi                              │   │
│   │                                             │   │
│   │ Pendapatan Harian:      Rp 3.000.000        │   │
│   │ Biaya Listrik Harian:   Rp 3.177            │   │
│   │ Biaya Air Harian:       Rp 7.500            │   │
│   │ Biaya Lain-lain (10%):  Rp 300.000          │   │
│   │ ─────────────────────────────────────────   │   │
│   │ Total Biaya Harian:     Rp 310.677          │   │
│   │ Profit Bersih Harian:   Rp 2.689.323        │   │
│   │ Profit Bulanan:         Rp 80.679.690       │   │
│   │                                             │   │
│   │ Estimasi Balik Modal:   6 bulan             │   │
│   └─────────────────────────────────────────────┘   │
│                                                     │
│   *Estimasi dapat berbeda tergantung kondisi        │
│    lapangan dan lokasi usaha                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Behavior:**
- Input auto-fill dari data produk, bisa diubah user
- Kalkulasi real-time saat input berubah
- Format currency Rupiah
- Disclaimer di bawah
- Responsive: 1 kolom mobile, 2 kolom desktop (input | hasil)

---

### 1.16 Komponen Certification Badges (src/components/public/certification-badges.tsx)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  [✓ SNI]  [✓ ISO 9001]  [✓ Food Grade SS 304]      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Props:**
- `certifications`: string[] (contoh: ["SNI", "ISO 9001", "Food Grade"])
- `variant`: "default" | "compact"

**Behavior:**
- Tampilkan badge untuk setiap sertifikasi
- Icon/checkmark untuk setiap badge
- Warna hijau untuk verified
- Tooltip dengan deskripsi sertifikasi

---

### 1.17 Komponen Gallery Grid (src/components/public/gallery-grid.tsx)

```
┌────────┐ ┌────────┐ ┌────────┐
│[Foto 1]│ │[Foto 2]│ │[Foto 3]│
│Caption │ │Caption │ │Caption │
└────────┘ └────────┘ └────────┘
┌────────┐ ┌────────┐ ┌────────┐
│[Foto 4]│ │[Foto 5]│ │[Foto 6]│
│Caption │ │Caption │ │Caption │
└────────┘ └────────┘ └────────┘
```

**Behavior:**
- Grid responsif: 3 kolom desktop, 2 tablet, 1 mobile
- Klik gambar → buka lightbox
- Hover effect: zoom + overlay
- Lazy load gambar

---

### 1.18 Komponen Gallery Lightbox (src/components/public/gallery-lightbox.tsx)

```
┌─────────────────────────────────────────────────────┐
│  [←]                                    [✕ Close]   │
│                                                     │
│                                                     │
│              [GAMBAR BESAR]                         │
│                                                     │
│                                                     │
│                        [→]                          │
│                                                     │
│  Caption: Foto workshop proses produksi             │
│  Foto 3 dari 12                                     │
└─────────────────────────────────────────────────────┘
```

**Behavior:**
- Modal fullscreen dengan backdrop gelap
- Navigasi prev/next (klik + keyboard arrows)
- Close dengan tombol X, klik backdrop, atau Escape
- Counter "Foto X dari Y"
- Caption di bawah gambar
- Swipe gesture di mobile

---

### 1.19 Komponen FAQ Accordion (src/components/public/faq-accordion.tsx)

```
┌─────────────────────────────────────────────────────┐
│  ▼ Apa itu mesin es kristal?                   [▲] │
├─────────────────────────────────────────────────────┤
│  Mesin es kristal adalah mesin pembuat es batu      │
│  berbentuk butiran kecil seperti kristal yang       │
│  umumnya digunakan untuk mengawetkan ikan dan       │
│  produk perikanan.                                  │
└─────────────────────────────────────────────────────┘
```

**Props:**
- `faq`: FAQ
- `isOpen`: boolean
- `onToggle`: () => void

**Behavior:**
- Accordion expand/collapse dengan animasi
- Hanya 1 item terbuka per kategori (opsional)
- Icon panah rotate saat expand

---

### 1.10 Komponen FAQ Item (src/components/public/faq-item.tsx)

```
┌─────────────────────────────────────────────────────┐
│  [Kategori Badge]                                   │
│  <h3>Pertanyaan</h3>                                │
│  <p>Jawaban (HTML)</p>                              │
└─────────────────────────────────────────────────────┘
```

**Props:**
- `faq`: FAQ

---

### 2.1 Admin Layout

#### Wireframe Layout
```
┌─────────────────────────────────────────────────────┐
│  [Logo]        ADMIN PANEL        [User] [Logout]   │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│  📊 Dashboard│                                      │
│  📦 Produk   │                                      │
│  📝 Artikel  │         CONTENT AREA                 │
│  💬 Testimoni│                                      │
│  ❓ FAQ      │                                      │
│  🎥 Video    │                                      │
│  🖼️  Galeri   │                                      │
│  🖼️  Banner   │                                      │
│  📋 Leads    │                                      │
│              │                                      │
│              │                                      │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

---

### 2.2 Dashboard Admin (/admin)

#### Wireframe Layout
```
┌─────────────────────────────────────────────────────┐
│  Dashboard > Overview                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │📦 Produk│ │📝 Artikel│ │📋 Leads │ │🆕 Leads │   │
│  │   24    │ │   12    │ │   45    │ │    5    │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Leads Terbaru                                │  │
│  │  ┌────┬────────┬──────────┬────────┬───────┐  │  │
│  │  │No  │ Nama   │ Telepon  │ Pesan  │ Status│  │  │
│  │  ├────┼────────┼──────────┼────────┼───────┤  │  │
│  │  │ 1  │ Budi   │ 0812...  │ Saya...│ New   │  │  │
│  │  │ 2  │ Ani    │ 0813...  │ Saya...│ Contacted│ │
│  │  │ 3  │ Candra │ 0814...  │ Saya...│ New   │  │  │
│  │  │ 4  │ Dewi   │ 0815...  │ Saya...│ New   │  │  │
│  │  │ 5  │ Eko    │ 0816...  │ Saya...│ Converted│ │
│  │  └────┴────────┴──────────┴────────┴───────┘  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 2.3 CRUD Produk (/admin/produk)

#### List View
```
┌─────────────────────────────────────────────────────┐
│  Produk > Daftar Produk              [+ Tambah]     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Search: ________________] [Filter: Semua | Aktif] │
│                                                     │
│  ┌────┬──────┬──────────┬──────────┬────────┬────┐  │
│  │No  │Foto  │ Nama     │ Kapasitas│ Harga  │Aksi│  │
│  ├────┼──────┼──────────┼──────────┼────────┼────┤  │
│  │ 1  │[img] │ Mesin A  │ 1 Ton    │ 50jt   │✏️🗑️│  │
│  │ 2  │[img] │ Mesin B  │ 3 Ton    │ 120jt  │✏️🗑️│  │
│  │ 3  │[img] │ Mesin C  │ 5 Ton    │ 200jt  │✏️🗑️│  │
│  └────┴──────┴──────────┴──────────┴────────┴────┘  │
│                                                     │
│  [← 1] [2] [3] [→]                                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Form Tambah/Edit Produk
```
┌─────────────────────────────────────────────────────┐
│  Produk > Tambah Produk                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Nama Produk: [________________________]            │
│  Slug: [mesin-es-kristal-1-ton] (auto)              │
│                                                     │
│  Deskripsi Singkat:                                 │
│  [_____________________________________]            │
│  [_____________________________________]            │
│                                                     │
│  Deskripsi Lengkap:                                 │
│  [Rich Text Editor ___________________]             │
│  [_____________________________________]            │
│  [_____________________________________]            │
│                                                     │
│  Kapasitas: [1 Ton/Hari ▼]                          │
│  Kapasitas Nilai: [1] (untuk sorting)               │
│  Harga: [50000000]                                  │
│  Kategori: [Kecil ▼]                                │
│  Stok: [Tersedia ▼]                                 │
│  Garansi: [1 Tahun]                                 │
│                                                     │
│  Spesifikasi Teknis:                                │
│  ┌─────────────────────┬──────────────────────┐     │
│  │ Label               │ Value                │     │
│  ├─────────────────────┼──────────────────────┤     │
│  │ [Daya Listrik    ]  │ [2200 Watt        ]  │ [+] │
│  │ [Refrigeran      ]  │ [R404A            ]  │ [+] │
│  │ [Dimensi         ]  │ [120x80x150 cm    ]  │ [+] │
│  └─────────────────────┴──────────────────────┘     │
│                                                     │
│  Gambar Produk (max 5, WebP):                       │
│  [Upload Area - Drag & Drop]                        │
│  [Thumb] [Img1] [Img2] [Img3] [Img4]                │
│  [x]     [x]    [x]    [x]    [x]                   │
│                                                     │
│  Video URL (opsional): [________________]           │
│                                                     │
│  [ ] Produk Unggulan                                │
│  [✓] Aktif                                          │
│                                                     │
│  [Simpan] [Batal]                                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 2.4 CRUD Artikel (/admin/artikel)

#### Form Tambah/Edit Artikel
```
┌─────────────────────────────────────────────────────┐
│  Artikel > Tambah Artikel                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Judul: [________________________________]          │
│  Slug: [cara-memulai-usaha-es-kristal] (auto)       │
│                                                     │
│  Excerpt (160 karakter untuk SEO):                  │
│  [_____________________________________]            │
│                                                     │
│  Cover Image:                                       │
│  [Upload Area - Drag & Drop]                        │
│  [Preview Cover]                                    │
│                                                     │
│  Konten:                                            │
│  [Rich Text Editor ___________________]             │
│  [_____________________________________]            │
│  [_____________________________________]            │
│  [_____________________________________]            │
│                                                     │
│  Kategori: [Tips Bisnis ▼]                          │
│  Tags: [tips, bisnis, es kristal]                   │
│                                                     │
│  [✓] Publikasi Sekarang                             │
│                                                     │
│  [Simpan] [Batal]                                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 2.5 CRUD Testimoni (/admin/testimoni)

#### Form Tambah/Edit Testimoni
```
┌─────────────────────────────────────────────────────┐
│  Testimoni > Tambah Testimoni                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Nama Pelanggan: [____________________]             │
│  Jabatan/Usaha: [____________________]              │
│  Lokasi: [____________________]                     │
│                                                     │
│  Isi Testimoni:                                     │
│  [_____________________________________]            │
│  [_____________________________________]            │
│                                                     │
│  Rating: [⭐] [⭐] [⭐] [⭐] [⭐]                     │
│                                                     │
│  Foto Pelanggan (opsional):                         │
│  [Upload Area]                                      │
│                                                     │
│  Produk yang Digunakan: [Dropdown]                  │
│                                                     │
│  [✓] Tampilkan di Website                           │
│  [ ] Testimoni Unggulan                             │
│                                                     │
│  [Simpan] [Batal]                                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 2.7 CRUD Galeri (/admin/galeri)

#### List View
```
┌─────────────────────────────────────────────────────┐
│  Galeri > Foto Pabrik/Workshop       [+ Tambah]     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Filter: Semua | Workshop | Produksi | Pengiriman] │
│                                                     │
│  ┌────┬──────────┬──────────────┬──────────┬────┐   │
│  │No  │Thumbnail │ Judul        │ Kategori │Aksi│   │
│  ├────┼──────────┼──────────────┼──────────┼────┤   │
│  │ 1  │[img]     │ Workshop     │ Workshop │✏️🗑️│   │
│  │ 2  │[img]     │ Proses Las   │ Produksi │✏️🗑️│   │
│  │ 3  │[img]     │ Kirim ke Sby │ Pengiriman│✏️🗑️│   │
│  └────┴──────────┴──────────────┴──────────┴────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Form Tambah/Edit Foto
```
┌─────────────────────────────────────────────────────┐
│  Galeri > Tambah Foto                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Judul: [________________________________]          │
│                                                     │
│  Deskripsi: [____________________________]          │
│                                                     │
│  Kategori: [Workshop ▼]                             │
│  Urutan Tampil: [1]                                 │
│                                                     │
│  Upload Foto (max 10 sekaligus):                    │
│  [Upload Area - Drag & Drop]                        │
│  [Preview 1] [Preview 2] [Preview 3]                │
│  [    x    ] [    x    ] [    x    ]                │
│                                                     │
│  [✓] Aktif                                          │
│                                                     │
│  [Simpan] [Batal]                                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 2.8 CRUD Video (/admin/video)

#### List View
```
┌─────────────────────────────────────────────────────┐
│  Video > Daftar Video                [+ Tambah]     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Filter: Semua | Demo | Testimoni | Edukasi]       │
│                                                     │
│  ┌────┬──────────┬──────────────┬──────────┬────┐   │
│  │No  │Thumbnail │ Judul        │ Kategori │Aksi│   │
│  ├────┼──────────┼──────────────┼──────────┼────┤   │
│  │ 1  │[img]     │ Demo Mesin 1T│ Demo     │✏️🗑️│   │
│  │ 2  │[img]     │ Testi Pak Budi│Testimoni│✏️🗑️│   │
│  │ 3  │[img]     │ Tips Es Kristal│Edukasi │✏️🗑️│   │
│  └────┴──────────┴──────────────┴──────────┴────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Form Tambah/Edit Video
```
┌─────────────────────────────────────────────────────┐
│  Video > Tambah Video                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Judul Video: [________________________________]    │
│                                                     │
│  YouTube URL:                                       │
│  [https://youtube.com/watch?v=________________]     │
│  [Preview Thumbnail]                                │
│  [Thumbnail otomatis dari YouTube]                  │
│                                                     │
│  Deskripsi:                                         │
│  [_____________________________________]            │
│  [_____________________________________]            │
│                                                     │
│  Kategori: [Demo ▼]                                 │
│  Produk Terkait: [Dropdown - opsional]              │
│                                                     │
│  [✓] Video Unggulan                                 │
│  [✓] Aktif                                          │
│                                                     │
│  [Simpan] [Batal]                                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 2.9 CRUD FAQ (/admin/faq)

#### List View
```
┌─────────────────────────────────────────────────────┐
│  FAQ > Daftar FAQ                    [+ Tambah]     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Filter: Semua | Umum | Produk | Layanan | Teknis] │
│                                                     │
│  ┌────┬──────────────────────┬──────────┬────┬────┐  │
│  │No  │ Pertanyaan           │ Kategori │Urut│Aksi│  │
│  ├────┼──────────────────────┼──────────┼────┼────┤  │
│  │ 1  │ Apa itu mesin es...  │ Umum     │ 1  │✏️🗑️│  │
│  │ 2  │ Berapa kapasitas...  │ Produk   │ 2  │✏️🗑️│  │
│  │ 3  │ Apakah ada layan...  │ Layanan  │ 3  │✏️🗑️│  │
│  └────┴──────────────────────┴──────────┴────┴────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Form Tambah/Edit FAQ
```
┌─────────────────────────────────────────────────────┐
│  FAQ > Tambah FAQ                                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Pertanyaan: [________________________________]     │
│                                                     │
│  Jawaban:                                           │
│  [Rich Text Editor ___________________]             │
│  [_____________________________________]            │
│  [_____________________________________]            │
│                                                     │
│  Kategori: [Umum ▼]                                 │
│  Urutan Tampil: [1]                                 │
│                                                     │
│  [✓] Tampilkan di Website                           │
│                                                     │
│  [Simpan] [Batal]                                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 2.10 CRUD Banner (/admin/banner)

#### Form Tambah/Edit Banner
```
┌─────────────────────────────────────────────────────┐
│  Banner > Tambah Banner                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Judul Banner: [____________________]               │
│                                                     │
│  Gambar Banner:                                     │
│  [Upload Area - Recommended: 1920x600px]            │
│  [Preview Banner]                                   │
│                                                     │
│  Link Tujuan (opsional): [________________]         │
│  Urutan Tampil: [1]                                 │
│                                                     │
│  Tanggal Mulai: [DD/MM/YYYY]                        │
│  Tanggal Berakhir (opsional): [DD/MM/YYYY]          │
│                                                     │
│  [✓] Aktif                                          │
│                                                     │
│  [Simpan] [Batal]                                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 2.11 CRUD Leads Management (/admin/leads)

#### List View
```
┌─────────────────────────────────────────────────────┐
│  Leads > Daftar Leads                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Filter: Semua | New | Contacted | Converted]      │
│                                                     │
│  ┌────┬────────┬──────────┬──────────┬────────┬───┐ │
│  │No  │ Nama   │ Telepon  │ Pesan    │ Status │Aksi│ │
│  ├────┼────────┼──────────┼──────────┼────────┼───┤ │
│  │ 1  │ Budi   │ 0812...  │ Saya...  │ New    │✏️🗑️│ │
│  │ 2  │ Ani    │ 0813...  │ Saya...  │Contacted│✏️🗑️│ │
│  │ 3  │ Candra │ 0814...  │ Saya...  │Converted│✏️🗑️│ │
│  └────┴────────┴──────────┴──────────┴────────┴───┘ │
│                                                     │
│  [← 1] [2] [3] [→]                                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 3. KOMPONEN DETAIL

### 3.1 Navbar (src/components/layout/navbar.tsx)

```
┌─────────────────────────────────────────────────────┐
│ [Logo]  [Beranda] [Produk] [Artikel] [Tentang]      │
│ [Kontak]                    [Hubungi Kami (Oranye)]  │
└─────────────────────────────────────────────────────┘
```

**Props:**
- `sticky`: boolean (default: true)
- `transparent`: boolean (untuk hero section)

**Behavior:**
- Desktop: horizontal menu
- Mobile: hamburger menu (slide dari kanan)
- Sticky on scroll
- Active link highlight

---

### 3.2 Footer (src/components/layout/footer.tsx)

```
┌─────────────────────────────────────────────────────┐
│  [Logo]                                             │
│  Jl. Contoh No. 123, Kota, Provinsi                 │
│  📞 0812-xxxx-xxxx | 📧 info@mesineskristal.com     │
│                                                     │
│  Link Cepat          Ikuti Kami                     │
│  - Beranda           - Facebook                     │
│  - Produk            - Instagram                    │
│  - Artikel           - YouTube                      │
│  - Tentang Kami                                     │
│  - Kontak                                           │
│                                                     │
│  © 2025 Mesin Es Kristal. All rights reserved.      │
└─────────────────────────────────────────────────────┘
```

---

### 3.3 Produk Card (src/components/public/produk-card.tsx)

```
┌──────────────────┐
│                  │
│   [Gambar]       │
│                  │
├──────────────────┤
│ Nama Produk      │
│ Kapasitas        │
│ Harga            │
│ [Lihat Detail →] │
└──────────────────┘
```

**Props:**
- `product`: Product
- `variant`: "default" | "featured" | "related"

---

### 3.4 Testimoni Card (src/components/public/testimoni-card.tsx)

```
┌──────────────────┐
│ [Foto] Nama      │
│ Lokasi           │
│ ⭐⭐⭐⭐⭐         │
│ "Isi testimoni   │
│  pelanggan..."   │
│ Produk: Mesin A  │
└──────────────────┘
```

**Props:**
- `testimonial`: Testimonial
- `variant`: "default" | "featured"

---

### 3.5 Artikel Card (src/components/public/artikel-card.tsx)

```
┌──────────────────┐
│                  │
│   [Cover Image]  │
│                  │
├──────────────────┤
│ [Kategori]       │
│ Judul Artikel    │
│ Excerpt...       │
│ 📅 Tanggal       │
│ [Baca Selengkapnya →] │
└──────────────────┘
```

**Props:**
- `article`: Article

---

### 3.6 Floating WhatsApp (src/components/public/floating-whatsapp.tsx)

```
                    ┌──────┐
                    │  💬  │  (pulse animation)
                    └──────┘
```

**Props:**
- `phoneNumber`: string (from env)
- `message`: string (from env)

**Behavior:**
- Fixed position bottom-right
- Pulse animation
- Link ke wa.me

---

### 3.7 Data Table (src/components/ui/data-table.tsx)

```
┌─────────────────────────────────────────────────────┐
│ [Search] [Filter]                          [+ Tambah]│
├────┬────────┬────────┬────────┬────────┬────────────┤
│ ☐  │ Col 1  │ Col 2  │ Col 3  │ Col 4  │ Aksi       │
├────┼────────┼────────┼────────┼────────┼────────────┤
│ ☐  │ Data 1 │ Data 1 │ Data 1 │ Data 1 │ ✏️ 🗑️      │
│ ☐  │ Data 2 │ Data 2 │ Data 2 │ Data 2 │ ✏️ 🗑️      │
├────┴────────┴────────┴────────┴────────┴────────────┤
│ Showing 1-10 of 50    [← 1] [2] [3] [→]             │
└─────────────────────────────────────────────────────┘
```

**Props:**
- `columns`: Column[]
- `data`: T[]
- `pagination`: PaginationConfig
- `actions`: Action[]
- `searchable`: boolean
- `filterable`: boolean

---

### 3.8 Image Uploader (src/components/ui/image-uploader.tsx)

```
┌─────────────────────────────────────────────────────┐
│  Drag & drop gambar di sini                         │
│  atau [Pilih File]                                  │
│  Max 5 file, format WebP/JPG/PNG, max 2MB per file  │
├─────────────────────────────────────────────────────┤
│  [Thumb] [Thumb] [Thumb]                            │
│  [  x  ] [  x  ] [  x  ]                            │
└─────────────────────────────────────────────────────┘
```

**Props:**
- `maxFiles`: number
- `maxSize`: number (bytes)
- `onUpload`: (urls: string[]) => void
- `existingImages`: string[]

---

## 4. RESPONSIVE BREAKPOINTS

| Komponen | Mobile (<768px) | Tablet (768-1024px) | Desktop (>1024px) |
|----------|-----------------|---------------------|-------------------|
| Navbar | Hamburger menu | Horizontal menu | Horizontal menu |
| Produk Grid | 1 kolom | 2 kolom | 3 kolom |
| Artikel Grid | 1 kolom | 2 kolom | 3 kolom |
| Testimoni | 1 card | 2 cards | 3 cards |
| Form Kontak | 1 kolom | 2 kolom | 2 kolom |
| Admin Sidebar | Drawer (overlay) | Drawer (overlay) | Sidebar (fixed) |
| Footer | Stack vertikal | 2 kolom | 4 kolom |

---

## 5. ANIMASI & INTERAKSI

| Komponen | Animasi | Library |
|----------|---------|---------|
| Hero | Fade in + slide up | Framer Motion |
| Card | Hover scale + shadow | Framer Motion |
| Navbar | Sticky + background on scroll | CSS + JS |
| Testimoni | Carousel slide | Framer Motion |
| Loading | Skeleton pulse | CSS |
| Modal | Fade in + scale | Framer Motion |
| Floating WA | Pulse animation | CSS |
| Page transition | Fade in | Framer Motion |

---

## 6. LOADING & ERROR STATES

### Loading Skeleton
```
┌──────────────────┐
│ [████████████]   │  (image placeholder)
│                  │
├──────────────────┤
│ [████████]       │  (title placeholder)
│ [████]           │  (subtitle placeholder)
│ [██████]         │  (price placeholder)
└──────────────────┘
```

### Error State
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│           ⚠️ Terjadi Kesalahan                      │
│                                                     │
│   Gagal memuat data. Silakan coba lagi.             │
│                                                     │
│           [Coba Lagi]                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Empty State
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│           📦 Belum Ada Produk                       │
│                                                     │
│   Produk yang Anda tambahkan akan muncul di sini.   │
│                                                     │
│           [+ Tambah Produk]                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```
