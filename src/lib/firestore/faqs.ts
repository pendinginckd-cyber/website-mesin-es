import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, Timestamp, type Firestore,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Faq } from "@/types/faq";
import { COLLECTIONS } from "@/lib/constants";

function getCollection(firestore: Firestore) {
  return collection(firestore, COLLECTIONS.FAQS);
}

export async function getFaqs(params?: { category?: string; isActive?: boolean }): Promise<Faq[]> {
  if (!db) return [];
  let q = query(getCollection(db), orderBy("order", "asc"));
  if (params?.category) q = query(q, where("category", "==", params.category));
  if (params?.isActive !== undefined) q = query(q, where("isActive", "==", params.isActive));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate(), updatedAt: doc.data().updatedAt?.toDate() })) as Faq[];
}

export async function getFaqById(id: string): Promise<Faq | null> {
  if (!db) return null;
  const docRef = doc(db, COLLECTIONS.FAQS, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data(), createdAt: docSnap.data().createdAt?.toDate(), updatedAt: docSnap.data().updatedAt?.toDate() } as Faq;
}

export async function createFaq(data: Omit<Faq, "id" | "createdAt" | "updatedAt">): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const now = Timestamp.now();
  const docRef = await addDoc(getCollection(db), { ...data, createdAt: now, updatedAt: now });
  return docRef.id;
}

export async function updateFaq(id: string, data: Partial<Omit<Faq, "id" | "createdAt" | "updatedAt">>): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.FAQS, id);
  await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
}

export async function deleteFaq(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.FAQS, id);
  await deleteDoc(docRef);
}

export async function getActiveFaqs(): Promise<Faq[]> { return getFaqs({ isActive: true }); }
export async function getFaqsByCategory(category: string): Promise<Faq[]> { return getFaqs({ category, isActive: true }); }
