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
  type Firestore,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { AboutContent, AboutStat, AboutGalleryItem } from "@/types/about";

const ABOUT_DOC_ID = "default";

// About Content (single document)
export async function getAboutContent(): Promise<AboutContent> {
  if (!db) {
    return getDefaultAboutContent();
  }

  try {
    const docRef = doc(db, "aboutContent", ABOUT_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        heroImage: data.heroImage || "",
        companyName: data.companyName || "",
        companyDescription: data.companyDescription || "",
        vision: data.vision || "",
        mission: data.mission || "",
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    }
  } catch (error) {
    console.error("Error fetching about content:", error);
  }

  return getDefaultAboutContent();
}

export async function updateAboutContent(data: Partial<Omit<AboutContent, "id" | "updatedAt">>): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, "aboutContent", ABOUT_DOC_ID);
  await setDoc(docRef, { ...data, updatedAt: Timestamp.now() }, { merge: true });
}

function getDefaultAboutContent(): AboutContent {
  return {
    id: ABOUT_DOC_ID,
    heroImage: "",
    companyName: "",
    companyDescription: "",
    vision: "",
    mission: "",
    updatedAt: new Date(),
  };
}

// About Stats
export async function getAboutStats(): Promise<AboutStat[]> {
  if (!db) return [];

  try {
    const q = query(collection(db, "aboutStats"), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      label: doc.data().label || "",
      value: doc.data().value || "",
      icon: doc.data().icon || "star",
      order: doc.data().order || 0,
      isActive: doc.data().isActive ?? true,
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error("Error fetching about stats:", error);
    return [];
  }
}

export async function createAboutStat(data: Omit<AboutStat, "id" | "createdAt">): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = await addDoc(collection(db, "aboutStats"), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateAboutStat(id: string, data: Partial<Omit<AboutStat, "id" | "createdAt">>): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await updateDoc(doc(db, "aboutStats", id), data);
}

export async function deleteAboutStat(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await deleteDoc(doc(db, "aboutStats", id));
}

// About Gallery
export async function getAboutGallery(): Promise<AboutGalleryItem[]> {
  if (!db) return [];

  try {
    const q = query(collection(db, "aboutGallery"), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      imageUrl: doc.data().imageUrl || "",
      caption: doc.data().caption || "",
      order: doc.data().order || 0,
      isActive: doc.data().isActive ?? true,
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error("Error fetching about gallery:", error);
    return [];
  }
}

export async function createAboutGalleryItem(data: Omit<AboutGalleryItem, "id" | "createdAt">): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = await addDoc(collection(db, "aboutGallery"), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateAboutGalleryItem(id: string, data: Partial<Omit<AboutGalleryItem, "id" | "createdAt">>): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await updateDoc(doc(db, "aboutGallery", id), data);
}

export async function deleteAboutGalleryItem(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await deleteDoc(doc(db, "aboutGallery", id));
}
