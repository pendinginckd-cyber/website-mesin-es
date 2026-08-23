import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, Timestamp, type Firestore,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Banner } from "@/types/banner";
import { COLLECTIONS } from "@/lib/constants";

function getCollection(firestore: Firestore) {
  return collection(firestore, COLLECTIONS.BANNERS);
}

export async function getBanners(params?: { isActive?: boolean }): Promise<Banner[]> {
  if (!db) return [];
  let q = query(getCollection(db), orderBy("order", "asc"));
  if (params?.isActive !== undefined) q = query(q, where("isActive", "==", params.isActive));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), startDate: doc.data().startDate?.toDate(), endDate: doc.data().endDate?.toDate() })) as Banner[];
}

export async function getBannerById(id: string): Promise<Banner | null> {
  if (!db) return null;
  const docRef = doc(db, COLLECTIONS.BANNERS, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data(), startDate: docSnap.data().startDate?.toDate(), endDate: docSnap.data().endDate?.toDate() } as Banner;
}

export async function createBanner(data: Omit<Banner, "id">): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = await addDoc(getCollection(db), data);
  return docRef.id;
}

export async function updateBanner(id: string, data: Partial<Omit<Banner, "id">>): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.BANNERS, id);
  await updateDoc(docRef, data);
}

export async function deleteBanner(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.BANNERS, id);
  await deleteDoc(docRef);
}

export async function getActiveBanners(): Promise<Banner[]> { return getBanners({ isActive: true }); }
