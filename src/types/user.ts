export interface Admin {
  uid: string;
  email: string;
  displayName: string;
  role: "superadmin" | "admin";
  photoUrl?: string;
  createdAt: Date;
}
