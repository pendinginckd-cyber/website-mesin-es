# Development Progress Tracker

## Project: Website Mesin Es Kristal - 8 Fitur Tambahan

### Project Info
- **Start Date:** 25 Agustus 2026
- **Target Completion:** TBD
- **Status:** 🚧 IN PROGRESS
- **Total Estimasi:** ~13-17 jam kerja
- **Tech Stack:** Next.js 16 + TypeScript + Tailwind CSS v4 + Firebase

---

## ✅ Bonus Feature: Produk Terkait + Produk Lainnya (COMPLETED)

**Status:** ✅ SELESAI | **Deployed:** 25 Agustus 2026

**Description:** Tambah section "Produk Terkait" dan "Produk Lainnya" di halaman detail produk untuk meningkatkan navigasi dan konversi.

**Features Implemented:**
- ✅ Section "Produk Terkait" (produk dengan category sama)
- ✅ Section "Produk Lainnya" (produk dengan category berbeda)
- ✅ Limit 8 produk per section
- ✅ "Lihat Lebih Banyak" button dengan load more inline
- ✅ Responsive grid: 2 kolom mobile, 3 tablet, 4 desktop
- ✅ Server component untuk SEO + Client component untuk interactivity
- ✅ Loading states dan error handling

**Files Created:**
- ✅ `src/components/public/product-related-section.tsx`

**Files Modified:**
- ✅ `src/lib/firestore/products.ts` (add getRelatedProducts, getOtherProducts)
- ✅ `src/app/(public)/produk/[slug]/page.tsx` (add ProductRelatedSection)

**Firestore Collections:** None (client-side only)

---

## ✅ Phase 2: Advanced Filter & Search (COMPLETED)

**Status:** ✅ SELESAI | **Deployed:** 25 Agustus 2026

**Description:** Tambah advanced filter dan search di halaman katalog produk `/produk` untuk meningkatkan UX dan konversi.

**Features Implemented:**
- ✅ Search input dengan debounce 500ms
- ✅ Category tabs dinamis (hanya kategori yang ada produknya)
- ✅ Sort dropdown (6 opsi: harga, kapasitas, nama)
- ✅ Price range slider dengan dynamic step
- ✅ Capacity range slider (0.5-10 Ton)
- ✅ Product count display
- ✅ Clear filters button
- ✅ Shareable filter URLs
- ✅ Responsive layout (mobile stack, desktop horizontal)

**Files Created:**
- ✅ `src/components/public/produk-filter-bar.tsx`
- ✅ `src/components/public/produk-search-input.tsx`
- ✅ `src/components/public/produk-category-tabs.tsx`
- ✅ `src/components/public/produk-sort-select.tsx`
- ✅ `src/components/public/produk-price-range.tsx`
- ✅ `src/components/public/produk-capacity-range.tsx`
- ✅ `src/components/public/produk-count-display.tsx`
- ✅ `src/components/public/produk-clear-filters.tsx`

**Files Modified:**
- ✅ `src/app/(public)/produk/page.tsx` (add searchParams handling)
- ✅ `src/lib/firestore/products.ts` (add searchProducts function)
- ✅ `src/lib/constants.ts` (add SORT_OPTIONS)

**Dependencies Added:**
- ✅ `rc-slider` (dual-handle range slider library)

**Firestore Collections:** None (client-side only)

---

## Phase 1: Kalkulator ROI Enhanced + Product Comparison

### ✅ Fitur 1: Kalkulator ROI Enhanced
**Status:** ⏳ PENDING | **Estimasi:** 2-3 jam | **Priority:** HIGH

**Existing Files:**
- `src/components/public/roi-calculator.tsx` - Basic calculator component
- `src/lib/utils.ts` - `calculateROI()` function

**Enhancement Checklist:**
- [ ] Buat standalone page `/kalkulator`
- [ ] Tambah chart/graph visualization (revenue vs cost)
- [ ] Save results ke localStorage
- [ ] Share hasil via WhatsApp
- [ ] Multiple scenarios comparison (2-3 skenario)
- [ ] PDF export (optional)

**Files to Create:**
- [ ] `src/app/(public)/kalkulator/page.tsx`
- [ ] `src/components/public/roi-chart.tsx`
- [ ] `src/components/public/roi-scenario-compare.tsx`

**Files to Modify:**
- [ ] `src/components/public/roi-calculator.tsx`
- [ ] `src/lib/utils.ts`
- [ ] `src/components/layout/navbar.tsx` (add nav link)
- [ ] `src/components/layout/footer.tsx` (add footer link)

**Firestore Collections:** None (client-side only)

---

### ✅ Fitur 2: Product Comparison Tool
**Status:** ⏳ PENDING | **Estimasi:** 2-3 jam | **Priority:** HIGH

**Description:** Fitur untuk membandingkan 2-3 produk mesin es kristal side-by-side.

**Feature Checklist:**
- [ ] Product selector (modal/dropdown)
- [ ] Comparison table (kapasitas, daya, harga, garansi, sertifikasi, dimensi)
- [ ] Highlight differences automatically
- [ ] LocalStorage persistence
- [ ] Share results via WhatsApp
- [ ] Responsive (mobile: scroll horizontal, desktop: grid)

**Files to Create:**
- [ ] `src/app/(public)/bandingkan/page.tsx`
- [ ] `src/components/public/product-comparison.tsx`
- [ ] `src/components/public/product-selector.tsx`
- [ ] `src/contexts/comparison-context.tsx`
- [ ] `src/types/comparison.ts`

**Files to Modify:**
- [ ] `src/components/public/produk-card.tsx` (add "Bandingkan" button)
- [ ] `src/components/layout/navbar.tsx` (add comparison counter badge)
- [ ] `src/lib/constants.ts` (add COMPARISON_MAX constant)

**Firestore Collections:** None (client-side only)

---

## Phase 2: WhatsApp Chat Widget + Advanced Filter

### ✅ Fitur 3: WhatsApp Chat Widget (Embedded)
**Status:** ⏳ PENDING | **Estimasi:** 1-2 jam | **Priority:** MEDIUM

**Existing Files:**
- `src/components/public/floating-whatsapp.tsx` - Simple floating button

**Enhancement Checklist:**
- [ ] Chat window popup dengan pre-filled message
- [ ] Custom branding (logo, warna, greeting message)
- [ ] Quick replies: "Info Produk", "Nego Harga", "Konsultasi"
- [ ] Smooth open/close animation
- [ ] Auto-show setelah 30 detik atau scroll 50% (optional)

**Files to Create:**
- [ ] `src/components/public/whatsapp-chat-widget.tsx`

**Files to Modify:**
- [ ] `src/components/public/floating-whatsapp.tsx` (replace with new widget)
- [ ] `src/app/(public)/layout.tsx` (update import)

**Firestore Collections:** None

---

### ✅ Fitur 4: Advanced Product Filter & Search
**Status:** ⏳ PENDING | **Estimasi:** 2-3 jam | **Priority:** MEDIUM

**Existing Files:**
- `src/app/(public)/produk/page.tsx` - Basic product listing

**Feature Checklist:**
- [ ] Search by keyword (nama, deskripsi)
- [ ] Filter by kapasitas (range slider: 1-10 ton)
- [ ] Filter by harga (range slider: min-max price)
- [ ] Filter by sertifikasi (checkbox: SNI, ISO, CE, dll)
- [ ] Sort options (harga ↑↓, kapasitas ↑↓, nama A-Z)
- [ ] Real-time filtering tanpa reload
- [ ] Filter count (tampilkan jumlah hasil)
- [ ] Clear all filters button

**Files to Create:**
- [ ] `src/components/public/produk-filter-advanced.tsx`
- [ ] `src/components/public/produk-search.tsx`
- [ ] `src/components/public/range-slider.tsx`

**Files to Modify:**
- [ ] `src/app/(public)/produk/page.tsx`
- [ ] `src/lib/firestore/products.ts` (add search/filter functions)
- [ ] `src/types/product.ts` (add filter types)

**Firestore Collections:** None (client-side filtering)

---

## Phase 3: Downloadable Catalog + Newsletter

### ✅ Fitur 5: Downloadable Catalog/Brochure
**Status:** ⏳ PENDING | **Estimasi:** 1-2 jam | **Priority:** MEDIUM

**Feature Checklist:**
- [ ] Admin upload PDF katalog
- [ ] Public preview PDF di browser
- [ ] Download button
- [ ] Track download count
- [ ] Support multiple katalog (produk, harga, teknis)
- [ ] Version control (tanggal update)

**Files to Create:**
- [ ] `src/app/(public)/katalog/page.tsx`
- [ ] `src/app/(admin)/admin/katalog/page.tsx`
- [ ] `src/lib/firestore/catalogs.ts`
- [ ] `src/types/catalog.ts`

**Files to Modify:**
- [ ] `src/components/layout/navbar.tsx` (add nav link)
- [ ] `src/components/layout/footer.tsx` (add footer link)
- [ ] `src/components/layout/admin-sidebar.tsx` (add admin menu)
- [ ] `storage.rules` (add catalogs/ path)
- [ ] `firestore.rules` (add catalogs collection rules)

**Firestore Collections:**
```
catalogs (collection)
├── id (auto)
├── title (string)
├── description (string)
├── pdfUrl (string) - Firebase Storage URL
├── fileSize (number) - in bytes
├── version (string)
├── updatedAt (timestamp)
├── isActive (boolean)
└── downloadCount (number)
```

---

### ✅ Fitur 6: Newsletter Subscription
**Status:** ⏳ PENDING | **Estimasi:** 1-2 jam | **Priority:** LOW

**Feature Checklist:**
- [ ] Email input dengan validasi
- [ ] Double opt-in (optional)
- [ ] Admin export email list ke CSV
- [ ] Subscriber count display
- [ ] Unsubscribe link (optional)
- [ ] GDPR compliance (checkbox persetujuan)

**Files to Create:**
- [ ] `src/app/(public)/newsletter/page.tsx` (optional)
- [ ] `src/components/public/newsletter-form.tsx`
- [ ] `src/lib/firestore/subscribers.ts`
- [ ] `src/types/subscriber.ts`
- [ ] `src/app/(admin)/admin/subscribers/page.tsx`

**Files to Modify:**
- [ ] `src/components/layout/footer.tsx` (add newsletter form)
- [ ] `src/components/layout/admin-sidebar.tsx` (add admin menu)
- [ ] `firestore.rules` (add subscribers collection rules)

**Firestore Collections:**
```
subscribers (collection)
├── id (auto)
├── email (string) - unique
├── name (string) - optional
── subscribedAt (timestamp)
├── isActive (boolean)
├── source (string) - footer, popup, dedicated page
└── consentGiven (boolean)
```

---

## Phase 4: Case Studies + Dark Mode

### ✅ Fitur 7: Customer Case Studies
**Status:** ⏳ PENDING | **Estimasi:** 3-4 jam | **Priority:** LOW

**Feature Checklist:**
- [ ] Admin CRUD (tambah/edit/hapus)
- [ ] Rich content (judul, deskripsi, gambar before/after, video testimonial)
- [ ] Data bisnis (ROI aktual, peningkatan profit, payback period)
- [ ] Filter by industri (F&B, perikanan, pertanian, dll)
- [ ] Featured case studies (tampilkan di homepage)
- [ ] SEO optimized (metadata, schema.org, canonical URLs)

**Files to Create:**
- [ ] `src/app/(public)/case-studies/page.tsx`
- [ ] `src/app/(public)/case-studies/[slug]/page.tsx`
- [ ] `src/app/(admin)/admin/case-studies/page.tsx`
- [ ] `src/lib/firestore/case-studies.ts`
- [ ] `src/types/case-study.ts`

**Files to Modify:**
- [ ] `src/components/layout/navbar.tsx` (add nav link)
- [ ] `src/components/layout/footer.tsx` (add footer link)
- [ ] `src/components/layout/admin-sidebar.tsx` (add admin menu)
- [ ] `storage.rules` (add case-studies/ path)
- [ ] `firestore.rules` (add case-studies collection rules)

**Type Definition:**
```typescript
interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  customerName: string;
  industry: string; // F&B, perikanan, pertanian, dll
  location: string;
  description: string;
  content: string; // Rich text
  beforeImage: string;
  afterImage: string;
  videoUrl?: string; // YouTube ID
  roiData: {
    investment: number;
    monthlyRevenue: number;
    monthlyProfit: number;
    paybackPeriod: string;
  };
  testimonial: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Firestore Collections:**
```
caseStudies (collection)
├── id, title, slug, customerName, industry, location
├── description, content (rich text)
├── beforeImage, afterImage (Firebase Storage URLs)
├── videoUrl (optional YouTube ID)
├── roiData (object)
├── testimonial (string)
├── isFeatured, isActive (boolean)
└── createdAt, updatedAt (timestamp)
```

---

### ✅ Fitur 8: Dark Mode Toggle
**Status:** ⏳ PENDING | **Estimasi:** 2-3 jam | **Priority:** LOW

**Feature Checklist:**
- [ ] Toggle button (Sun/Moon icon) di navbar
- [ ] LocalStorage persistence
- [ ] Respect OS dark mode setting
- [ ] Smooth CSS transition
- [ ] All public components support dark mode
- [ ] Admin panel support (optional)

**Files to Create:**
- [ ] `src/contexts/theme-context.tsx`
- [ ] `src/components/shared/theme-toggle.tsx`

**Files to Modify:**
- [ ] `src/app/(public)/layout.tsx` (wrap with ThemeProvider)
- [ ] `src/app/layout.tsx` (add theme class to html)
- [ ] `src/app/globals.css` (add dark mode CSS variables)
- [ ] `src/components/layout/navbar.tsx` (add toggle button)
- [ ] `src/components/layout/footer.tsx` (adapt colors)
- [ ] `src/components/public/*.tsx` (update all public components)

**CSS Variables Pattern:**
```css
@theme inline {
  /* Light mode (default) */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  
  /* Dark mode */
  [data-theme="dark"] {
    --color-bg-primary: #111827;
    --color-bg-secondary: #1f2937;
    --color-text-primary: #f9fafb;
    --color-text-secondary: #9ca3af;
  }
}
```

---

## Firestore Rules & Indexes Updates

### Collections Baru yang Perlu Ditambahkan:

| Collection | Read | Write | Indexes Needed |
|------------|------|-------|----------------|
| `catalogs` | public | admin | isActive, updatedAt |
| `subscribers` | admin | public (create only) | email (unique), subscribedAt |
| `caseStudies` | public | admin | isActive, isFeatured, industry |

### Storage Paths Baru:

| Path | Read | Write |
|------|------|-------|
| `catalogs/` | public | admin |
| `case-studies/` | public | admin |

---

## Testing Strategy

### Testing Checklist per Fitur:

| Fitur | Unit Test | Integration Test | E2E Test |
|-------|-----------|------------------|----------|
| Kalkulator ROI | ✅ Calculation logic | ✅ UI interactions | ✅ Full flow |
| Product Comparison | ✅ Comparison logic | ✅ Product selection | ✅ Full flow |
| WhatsApp Widget | ✅ Message formatting | ✅ Chat window | ✅ Mobile test |
| Advanced Filter | ✅ Filter logic | ✅ Search + filter | ✅ Full flow |
| Downloadable Catalog | ✅ Upload logic | ✅ Download flow | ✅ Admin + public |
| Newsletter | ✅ Email validation | ✅ Subscribe flow | ✅ Admin export |
| Case Studies | ✅ CRUD operations | ✅ Display + filter | ✅ Admin + public |
| Dark Mode | ✅ Theme switching | ✅ All components | ✅ Cross-browser |

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Firebase quota limits** | Medium | Monitor usage, optimize queries |
| **Browser compatibility** | Low | Test di Chrome, Firefox, Safari, Edge |
| **Mobile responsiveness** | Medium | Test di berbagai device sizes |
| **Performance impact** | Low | Lazy loading, code splitting |
| **SEO impact** | Low | Maintain SSR for public pages |

---

## Success Metrics

| Fitur | Metric | Target |
|-------|--------|--------|
| Kalkulator ROI | Usage rate | >30% visitors use calculator |
| Product Comparison | Comparison rate | >20% visitors compare products |
| WhatsApp Widget | Click-through rate | >50% increase in WhatsApp clicks |
| Advanced Filter | Filter usage | >40% visitors use filters |
| Downloadable Catalog | Download rate | >100 downloads/month |
| Newsletter | Subscription rate | >5% visitors subscribe |
| Case Studies | Engagement time | >2 min average time on page |
| Dark Mode | Adoption rate | >30% users enable dark mode |

---

## Deployment Checklist

### Pre-Deployment:
- [ ] Build check (`npm run build`)
- [ ] TypeScript errors check
- [ ] Lint check
- [ ] Test all features locally

### Deployment:
- [ ] Git commit dengan message yang jelas
- [ ] Push ke GitHub main branch
- [ ] Vercel auto-deploy monitoring
- [ ] Production testing

### Post-Deployment:
- [ ] Firestore rules deploy
- [ ] Storage rules deploy
- [ ] Production testing semua fitur
- [ ] Monitor Firebase usage
- [ ] Update documentation

---

## Notes & Decisions

### Decision Log:
| Date | Decision | Reason |
|------|----------|--------|
| 25 Aug 2026 | Plan mode untuk 8 fitur | Butuh perencanaan matang sebelum eksekusi |
| 25 Aug 2026 | Phase-based approach | Memudahkan tracking dan testing |
| 25 Aug 2026 | Client-side filtering untuk produk | Lebih cepat, tidak perlu query Firestore berulang |

### Technical Notes:
- Semua fitur public pages tetap menggunakan **Server Components** untuk SEO
- Admin pages menggunakan **Client Components** untuk interactivity
- Firebase Storage untuk semua file uploads (PDF, images)
- LocalStorage untuk client-side preferences (dark mode, comparison, calculator results)
- Context API untuk shared state (theme, comparison)

---

## Contact & Resources

### Project Links:
- **GitHub:** https://github.com/pendinginckd-cyber/website-mesin-es.git
- **Vercel:** https://vercel.com/cikal1/website-mesin-es
- **Live Site:** https://www.eskristalnusantara.com
- **Firebase Project:** mesin-es-kristal-web

### Admin Access:
- **Email:** adminhvac@gmail.com
- **Password:** adminweb123!

### WhatsApp Number:
- **Number:** 081326440039
- **Format:** 6281326440039 (untuk wa.me links)

---

## Progress Summary

| Phase | Fitur | Status | Progress |
|-------|-------|--------|----------|
| **Phase 1** | Kalkulator ROI Enhanced | ⏳ PENDING | 0% |
| **Phase 1** | Product Comparison | ⏳ PENDING | 0% |
| **Phase 2** | WhatsApp Chat Widget |  PENDING | 0% |
| **Phase 2** | Advanced Filter | ⏳ PENDING | 0% |
| **Phase 3** | Downloadable Catalog | ⏳ PENDING | 0% |
| **Phase 3** | Newsletter | ⏳ PENDING | 0% |
| **Phase 4** | Case Studies |  PENDING | 0% |
| **Phase 4** | Dark Mode | ⏳ PENDING | 0% |

**Overall Progress:** 0% (0/8 fitur selesai)

---

*Last Updated: 25 Agustus 2026*
