export interface AboutContent {
  id: string;
  heroImage: string;
  companyName: string;
  companyDescription: string;
  vision: string;
  mission: string;
  updatedAt: Date;
}

export interface AboutStat {
  id: string;
  label: string;
  value: string;
  icon: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
}

export interface AboutGalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
}
