export interface Video {
  id: string;
  title: string;
  youtubeId: string;
  description: string;
  thumbnail: string;
  category: string;
  productId?: string;
  isFeatured: boolean;
  order: number;
  isActive: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
