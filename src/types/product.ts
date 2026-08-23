export interface Specification {
  label: string;
  value: string;
}

export interface RoiEstimation {
  dailyRevenue: number;
  dailyCost: number;
  dailyProfit: number;
  paybackPeriod: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  capacity: string;
  capacityValue: number;
  power?: string;
  price: number;
  priceDisplay: string;
  specifications: Specification[];
  images: string[];
  thumbnail: string;
  videoUrl?: string;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  stock: string;
  warranty: string;
  material: string;
  certifications: string[];
  roiEstimation?: RoiEstimation;
  createdAt: Date;
  updatedAt: Date;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  seoNoIndex?: boolean;
  seoCanonical?: string;
}
