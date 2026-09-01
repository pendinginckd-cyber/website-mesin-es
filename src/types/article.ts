export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  seoNoIndex?: boolean;
  seoCanonical?: string;
}
