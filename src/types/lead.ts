export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  productInterest?: string;
  status: "new" | "contacted" | "converted" | "closed";
  createdAt: Date;
}
