import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  type Firestore,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Product } from "@/types/product";
import { COLLECTIONS } from "@/lib/constants";

function getCollection(firestore: Firestore) {
  return collection(firestore, COLLECTIONS.PRODUCTS);
}

export async function getProducts(params?: {
  category?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  limit?: number;
}): Promise<Product[]> {
  if (!db) return [];

  let q = query(getCollection(db), orderBy("createdAt", "desc"));

  if (params?.category) {
    q = query(q, where("category", "==", params.category));
  }
  if (params?.isActive !== undefined) {
    q = query(q, where("isActive", "==", params.isActive));
  }
  if (params?.isFeatured !== undefined) {
    q = query(q, where("isFeatured", "==", params.isFeatured));
  }
  if (params?.limit) {
    q = query(q, limit(params.limit));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!db) return null;

  const q = query(getCollection(db), where("slug", "==", slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate(),
    updatedAt: docSnap.data().updatedAt?.toDate(),
  } as Product;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!db) return null;

  const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate(),
    updatedAt: docSnap.data().updatedAt?.toDate(),
  } as Product;
}

export async function createProduct(
  data: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const now = Timestamp.now();
  const docRef = await addDoc(getCollection(db), {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
  await deleteDoc(docRef);
}

export async function getFeaturedProducts(
  limitCount: number = 4
): Promise<Product[]> {
  return getProducts({ isFeatured: true, isActive: true, limit: limitCount });
}
