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
import { Sparepart } from "@/types/sparepart";
import { COLLECTIONS } from "@/lib/constants";
import { safeFirestore } from "./safe";

function getCollection(firestore: Firestore) {
  return collection(firestore, COLLECTIONS.SPAREPARTS);
}

export async function getSpareparts(params?: {
  category?: string;
  isActive?: boolean;
  limit?: number;
}): Promise<Sparepart[]> {
  if (!db) return [];

  let q = query(getCollection(db), orderBy("createdAt", "desc"));

  if (params?.category) {
    q = query(q, where("category", "==", params.category));
  }
  if (params?.isActive !== undefined) {
    q = query(q, where("isActive", "==", params.isActive));
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
  })) as Sparepart[];
}

export async function getSparepartBySlug(slug: string): Promise<Sparepart | null> {
  if (!db) return null;
  const firestore = db;

  return safeFirestore(async () => {
    const q = query(getCollection(firestore), where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const docSnap = snapshot.docs[0];
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate(),
    } as Sparepart;
  }, null);
}

export async function getSparepartById(id: string): Promise<Sparepart | null> {
  if (!db) return null;

  const docRef = doc(db, COLLECTIONS.SPAREPARTS, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate(),
    updatedAt: docSnap.data().updatedAt?.toDate(),
  } as Sparepart;
}

export async function createSparepart(
  data: Omit<Sparepart, "id" | "createdAt" | "updatedAt">
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

export async function updateSparepart(
  id: string,
  data: Partial<Omit<Sparepart, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.SPAREPARTS, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteSparepart(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.SPAREPARTS, id);
  await deleteDoc(docRef);
}

export async function searchSpareparts(params: {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Sparepart[]> {
  if (!db) return [];

  const allSpareparts = await getSpareparts({ isActive: true });
  let filtered = allSpareparts;

  if (params.search) {
    const keyword = params.search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(keyword) ||
        s.description.toLowerCase().includes(keyword) ||
        s.shortDescription.toLowerCase().includes(keyword) ||
        s.category.toLowerCase().includes(keyword)
    );
  }

  if (params.category) {
    filtered = filtered.filter((s) => s.category === params.category);
  }

  if (params.minPrice !== undefined) {
    filtered = filtered.filter((s) => s.price >= params.minPrice!);
  }
  if (params.maxPrice !== undefined) {
    filtered = filtered.filter((s) => s.price <= params.maxPrice!);
  }

  return filtered;
}
