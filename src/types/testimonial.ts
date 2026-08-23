export interface Testimonial {
  id: string;
  customerName: string;
  customerTitle?: string;
  location?: string;
  content: string;
  rating: number;
  photo?: string;
  videoUrl?: string;
  productUsed?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
}
