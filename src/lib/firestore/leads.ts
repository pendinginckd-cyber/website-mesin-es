import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, Timestamp, onSnapshot, type Firestore,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Lead } from "@/types/lead";
import { COLLECTIONS } from "@/lib/constants";

function getCollection(firestore: Firestore) {
  return collection(firestore, COLLECTIONS.LEADS);
}

export async function getLeads(params?: { status?: string; limit?: number }): Promise<Lead[]> {
  if (!db) return [];
  let q = query(getCollection(db), orderBy("createdAt", "desc"));
  if (params?.status) q = query(q, where("status", "==", params.status));
  if (params?.limit) q = query(q, limit(params.limit));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate() })) as Lead[];
}

export function subscribeLeads(
  callback: (leads: Lead[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(getCollection(db), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Lead[];
      callback(data);
    },
    (error) => onError?.(error)
  );
}

export async function getLeadById(id: string): Promise<Lead | null> {
  if (!db) return null;
  const docRef = doc(db, COLLECTIONS.LEADS, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data(), createdAt: docSnap.data().createdAt?.toDate() } as Lead;
}

export async function createLead(data: Omit<Lead, "id" | "createdAt">): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = await addDoc(getCollection(db), { ...data, createdAt: Timestamp.now() });
  return docRef.id;
}

export async function updateLeadStatus(id: string, status: Lead["status"]): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.LEADS, id);
  await updateDoc(docRef, { status });
}

export async function deleteLead(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.LEADS, id);
  await deleteDoc(docRef);
}
