export interface Review {
  id: string;
  customerName: string;
  customerPhone?: string;
  rating: number;
  content: string;
  photo?: string;
  videoUrl?: string;
  productUsed?: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
  reviewToken?: string;
}

export interface ReviewSettings {
  id: string;
  autoApprove: boolean;
  updatedAt: Date;
}

export interface ReviewLink {
  id: string;
  token: string;
  customerPhone: string;
  customerName?: string;
  sentAt: Date;
  usedAt?: Date;
  reviewId?: string;
}
