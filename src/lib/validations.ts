import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Nama produk minimal 3 karakter"),
  slug: z.string().min(3, "Slug minimal 3 karakter"),
  description: z.string().min(50, "Deskripsi minimal 50 karakter"),
  shortDescription: z
    .string()
    .min(20, "Deskripsi singkat minimal 20 karakter")
    .max(150, "Deskripsi singkat maksimal 150 karakter"),
  capacity: z.string().min(1, "Kapasitas wajib diisi"),
  capacityValue: z.coerce.number().min(1, "Kapasitas harus lebih dari 0"),
  price: z.coerce.number().min(1, "Harga harus lebih dari 0"),
  priceDisplay: z.string(),
  material: z.string().min(3, "Material wajib diisi"),
  warranty: z.string().min(1, "Garansi wajib diisi"),
  stock: z.enum(["tersedia", "indent", "habis"]),
  category: z.enum(["kecil", "menengah", "besar"]),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  specifications: z
    .array(
      z.object({
        label: z.string().min(1, "Label wajib diisi"),
        value: z.string().min(1, "Value wajib diisi"),
      })
    )
    .min(1, "Minimal 1 spesifikasi"),
  certifications: z.array(z.string()).optional(),
  videoUrl: z.string().optional(),
  images: z.array(z.string()).min(3, "Minimal 3 gambar produk"),
  thumbnail: z.string().min(1, "Thumbnail wajib diisi"),
  seoTitle: z.string().max(60, "SEO Title maksimal 60 karakter").optional().or(z.literal("")),
  seoDescription: z.string().max(160, "SEO Description maksimal 160 karakter").optional().or(z.literal("")),
  seoKeywords: z.array(z.string()).optional(),
  seoNoIndex: z.boolean().optional(),
  seoCanonical: z.string().url("Canonical URL tidak valid").optional().or(z.literal("")),
});

export const articleSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  slug: z.string().min(5, "Slug minimal 5 karakter"),
  content: z.string().min(100, "Konten minimal 100 karakter"),
  excerpt: z
    .string()
    .min(20, "Excerpt minimal 20 karakter")
    .max(160, "Excerpt maksimal 160 karakter"),
  coverImage: z.string().min(1, "Cover image wajib diisi"),
  author: z.string().min(1, "Author wajib diisi"),
  category: z.string().min(1, "Kategori wajib diisi"),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean(),
});

export const testimonialSchema = z.object({
  customerName: z.string().min(2, "Nama pelanggan minimal 2 karakter"),
  customerTitle: z.string().optional(),
  location: z.string().optional(),
  content: z.string().min(10, "Testimoni minimal 10 karakter"),
  rating: z.coerce.number().min(1).max(5),
  photo: z.string().optional(),
  videoUrl: z.string().optional(),
  productUsed: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
});

export const faqSchema = z.object({
  question: z.string().min(5, "Pertanyaan minimal 5 karakter"),
  answer: z.string().min(10, "Jawaban minimal 10 karakter"),
  category: z.enum(["umum", "produk", "layanan", "teknis"]),
  order: z.coerce.number().min(0),
  isActive: z.boolean(),
});

export const videoSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  youtubeUrl: z.string().url("URL YouTube tidak valid"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  category: z.enum(["demo", "testimoni", "edukasi", "pengiriman", "behind-the-scenes"]),
  productId: z.string().optional(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
});

export const bannerSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  imageUrl: z.string().min(1, "Gambar wajib diisi"),
  linkUrl: z.string().url().optional().or(z.literal("")),
  order: z.coerce.number().min(0),
  isActive: z.boolean(),
  startDate: z.date(),
  endDate: z.date().optional(),
});

export const leadSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .regex(/^(\+62|62|0)8[1-9][0-9]{7,11}$/, "Format nomor telepon tidak valid"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
  productInterest: z.string().optional(),
});

export const gallerySchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().optional(),
  category: z.enum(["workshop", "produksi", "pengiriman", "tim", "produk"]),
  order: z.coerce.number().min(0),
  isActive: z.boolean(),
});

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});
