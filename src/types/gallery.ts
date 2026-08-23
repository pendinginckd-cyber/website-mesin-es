export interface Gallery {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
}
