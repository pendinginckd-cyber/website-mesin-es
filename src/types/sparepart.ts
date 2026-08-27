export interface Sparepart {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  images: string[];
  thumbnail: string;
  category: string;
  isActive: boolean;
  stock: string;
  createdAt: Date;
  updatedAt: Date;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  seoNoIndex?: boolean;
  seoCanonical?: string;
}
