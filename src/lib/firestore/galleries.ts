import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, Timestamp, type Firestore,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Gallery } from "@/types/gallery";
import { COLLECTIONS } from "@/lib/constants";

function getCollection(firestore: Firestore) {
  return collection(firestore, COLLECTIONS.GALLERIES);
}

export async function getGalleries(params?: { category?: string; isActive?: boolean }): Promise<Gallery[]> {
  if (!db) return [];
  let q = query(getCollection(db), orderBy("order", "asc"));
  if (params?.category) q = query(q, where("category", "==", params.category));
  if (params?.isActive !== undefined) q = query(q, where("isActive", "==", params.isActive));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate() })) as Gallery[];
}

export async function getGalleryById(id: string): Promise<Gallery | null> {
  if (!db) return null;
  const docRef = doc(db, COLLECTIONS.GALLERIES, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data(), createdAt: docSnap.data().createdAt?.toDate() } as Gallery;
}

export async function createGallery(data: Omit<Gallery, "id" | "createdAt">): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = await addDoc(getCollection(db), { ...data, createdAt: Timestamp.now() });
  return docRef.id;
}

export async function updateGallery(id: string, data: Partial<Omit<Gallery, "id" | "createdAt">>): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.GALLERIES, id);
  await updateDoc(docRef, data);
}

export async function deleteGallery(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.GALLERIES, id);
  await deleteDoc(docRef);
}

export async function getActiveGalleries(): Promise<Gallery[]> { return getGalleries({ isActive: true }); }
export async function getGalleriesByCategory(category: string): Promise<Gallery[]> { return getGalleries({ category, isActive: true }); }
