import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

const SETTINGS_DOC_ID = "default";

export interface SparepartSettings {
  id: string;
  categories: string[];
  updatedAt: Date;
}

export async function getSparepartSettings(): Promise<SparepartSettings> {
  if (!db) return { id: SETTINGS_DOC_ID, categories: [], updatedAt: new Date() };

  try {
    const docRef = doc(db, "sparepartSettings", SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        categories: data.categories || [],
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    }
  } catch (error) {
    console.error("Error fetching sparepart settings:", error);
  }

  return { id: SETTINGS_DOC_ID, categories: [], updatedAt: new Date() };
}

export async function addSparepartCategory(category: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const trimmed = category.trim();
  if (!trimmed) return;

  const docRef = doc(db, "sparepartSettings", SETTINGS_DOC_ID);
  await updateDoc(docRef, {
    categories: arrayUnion(trimmed),
    updatedAt: Timestamp.now(),
  });
}

export async function removeSparepartCategory(category: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, "sparepartSettings", SETTINGS_DOC_ID);
  await updateDoc(docRef, {
    categories: arrayRemove(category),
    updatedAt: Timestamp.now(),
  });
}
