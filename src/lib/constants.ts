export const SITE_NAME = "Mesin Es Kristal";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mesineskristal.com";

// Nilai env lama tersimpan dalam bentuk ter-encode (%20) karena pola
// pemakaian awal menyisipkannya mentah ke URL. Dekode defensif di sini
// agar seluruh konsumen menerima teks polos sebelum meng-encode ulang.
export function decodeSafe(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281326440039";
export const WHATSAPP_MESSAGE = decodeSafe(
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
    "Halo saya tertarik dengan mesin es kristal"
);

export const COLLECTIONS = {
  PRODUCTS: "products",
  ARTICLES: "articles",
  TESTIMONIALS: "testimonials",
  FAQS: "faqs",
  VIDEOS: "videos",
  GALLERIES: "galleries",
  BANNERS: "banners",
  LEADS: "leads",
  ADMINS: "admins",
  SPAREPARTS: "spareparts",
} as const;

export const VIDEO_CATEGORIES = [
  "demo",
  "testimoni",
  "edukasi",
  "pengiriman",
  "behind-the-scenes",
] as const;

export const GALLERY_CATEGORIES = [
  "workshop",
  "produksi",
  "pengiriman",
  "tim",
  "produk",
] as const;

export const FAQ_CATEGORIES = [
  "umum",
  "produk",
  "layanan",
  "teknis",
] as const;

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "converted",
  "closed",
] as const;

export const PRODUCT_CATEGORIES = ["kecil", "menengah", "besar"] as const;

export const STOCK_STATUSES = ["tersedia", "indent", "habis"] as const;

export const MAX_PRODUCT_IMAGES = 8;
export const MIN_PRODUCT_IMAGES = 3;
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const SORT_OPTIONS = [
  { value: "default", label: "Urutkan" },
  { value: "price-asc", label: "Harga: Rendah ke Tinggi" },
  { value: "price-desc", label: "Harga: Tinggi ke Rendah" },
  { value: "capacity-asc", label: "Kapasitas: Kecil ke Besar" },
  { value: "capacity-desc", label: "Kapasitas: Besar ke Kecil" },
  { value: "name-asc", label: "Nama: A-Z" },
  { value: "name-desc", label: "Nama: Z-A" },
] as const;
