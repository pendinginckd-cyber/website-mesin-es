export interface KeunggulanSettings {
  id: string;
  title: string;
  subtitle: string;
  icon?: string;
  updatedAt: Date;
}

export interface KeunggulanItem {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
}
