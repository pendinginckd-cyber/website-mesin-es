import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { KeunggulanSettings, KeunggulanItem } from "@/types/keunggulan";

const SETTINGS_DOC_ID = "default";

// Settings
export async function getKeunggulanSettings(): Promise<KeunggulanSettings> {
  if (!db) return getDefaultKeunggulanSettings();

  try {
    const docRef = doc(db, "keunggulanSettings", SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title || "",
        subtitle: data.subtitle || "",
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    }
  } catch (error) {
    console.error("Error fetching keunggulan settings:", error);
  }

  return getDefaultKeunggulanSettings();
}

export async function updateKeunggulanSettings(data: Partial<Omit<KeunggulanSettings, "id" | "updatedAt">>): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, "keunggulanSettings", SETTINGS_DOC_ID);
  // Hanya field settings yang sah — key asing dari payload tidak ikut disimpan
  await setDoc(
    docRef,
    {
      title: data.title ?? "",
      subtitle: data.subtitle ?? "",
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
}

function getDefaultKeunggulanSettings(): KeunggulanSettings {
  return {
    id: SETTINGS_DOC_ID,
    title: "Kenapa Pilih Mesin Es Kristal Kami?",
    subtitle: "Kami memberikan yang terbaik untuk setiap pelanggan dengan kualitas produk dan layanan purna jual yang terjamin.",
    updatedAt: new Date(),
  };
}

// Items
export async function getKeunggulanItems(): Promise<KeunggulanItem[]> {
  if (!db) return [];

  try {
    const q = query(collection(db, "keunggulanItems"), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      icon: doc.data().icon || "star",
      title: doc.data().title || "",
      description: doc.data().description || "",
      order: doc.data().order || 0,
      isActive: doc.data().isActive ?? true,
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error("Error fetching keunggulan items:", error);
    return [];
  }
}

export async function createKeunggulanItem(data: Omit<KeunggulanItem, "id" | "createdAt">): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = await addDoc(collection(db, "keunggulanItems"), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateKeunggulanItem(id: string, data: Partial<Omit<KeunggulanItem, "id" | "createdAt">>): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await updateDoc(doc(db, "keunggulanItems", id), data);
}

export async function deleteKeunggulanItem(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await deleteDoc(doc(db, "keunggulanItems", id));
}
