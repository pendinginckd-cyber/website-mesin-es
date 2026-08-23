import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, Timestamp, type Firestore,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Testimonial } from "@/types/testimonial";
import { COLLECTIONS } from "@/lib/constants";

function getCollection(firestore: Firestore) {
  return collection(firestore, COLLECTIONS.TESTIMONIALS);
}

export async function getTestimonials(params?: { isActive?: boolean; isFeatured?: boolean; limit?: number }): Promise<Testimonial[]> {
  if (!db) return [];
  let q = query(getCollection(db), orderBy("createdAt", "desc"));
  if (params?.isActive !== undefined) q = query(q, where("isActive", "==", params.isActive));
  if (params?.isFeatured !== undefined) q = query(q, where("isFeatured", "==", params.isFeatured));
  if (params?.limit) q = query(q, limit(params.limit));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate() })) as Testimonial[];
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  if (!db) return null;
  const docRef = doc(db, COLLECTIONS.TESTIMONIALS, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data(), createdAt: docSnap.data().createdAt?.toDate() } as Testimonial;
}

export async function createTestimonial(data: Omit<Testimonial, "id" | "createdAt">): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = await addDoc(getCollection(db), { ...data, createdAt: Timestamp.now() });
  return docRef.id;
}

export async function updateTestimonial(id: string, data: Partial<Omit<Testimonial, "id" | "createdAt">>): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.TESTIMONIALS, id);
  await updateDoc(docRef, data);
}

export async function deleteTestimonial(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.TESTIMONIALS, id);
  await deleteDoc(docRef);
}

export async function getFeaturedTestimonials(limitCount: number = 6): Promise<Testimonial[]> {
  return getTestimonials({ isFeatured: true, isActive: true, limit: limitCount });
}
