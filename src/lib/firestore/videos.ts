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
import { Video } from "@/types/video";
import { COLLECTIONS } from "@/lib/constants";
import { safeFirestore } from "./safe";

function getCollection(firestore: Firestore) {
  return collection(firestore, COLLECTIONS.VIDEOS);
}

export async function getVideos(params?: {
  category?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  limit?: number;
}): Promise<Video[]> {
  if (!db) return [];

  const targetActive = params?.isActive ?? true;

  let q = query(getCollection(db), orderBy("publishedAt", "desc"));
  if (params?.category) q = query(q, where("category", "==", params.category));
  if (params?.isFeatured !== undefined) q = query(q, where("isFeatured", "==", params.isFeatured));
  if (params?.limit) q = query(q, limit(params.limit));

  try {
    const snapshot = await getDocs(q);
    let videos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Video[];

    if (targetActive) {
      videos = videos.filter((v) => v.isActive === true);
    }

    return videos;
  } catch {
    try {
      const snapshot = await getDocs(getCollection(db));
      let videos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        publishedAt: doc.data().publishedAt?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Video[];

      if (targetActive) {
        videos = videos.filter((v) => v.isActive === true);
      }
      if (params?.category) {
        videos = videos.filter((v) => v.category === params.category);
      }
      if (params?.isFeatured !== undefined) {
        videos = videos.filter((v) => v.isFeatured === params.isFeatured);
      }
      videos.sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));
      if (params?.limit) {
        videos = videos.slice(0, params.limit);
      }
      return videos;
    } catch {
      return [];
    }
  }
}

export async function getVideoById(id: string): Promise<Video | null> {
  if (!db) return null;
  const firestore = db;

  return safeFirestore(async () => {
    const docRef = doc(firestore, COLLECTIONS.VIDEOS, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data(), publishedAt: docSnap.data().publishedAt?.toDate(), createdAt: docSnap.data().createdAt?.toDate(), updatedAt: docSnap.data().updatedAt?.toDate() } as Video;
  }, null);
}

export async function createVideo(data: Omit<Video, "id" | "createdAt" | "updatedAt">): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const now = Timestamp.now();
  const docRef = await addDoc(getCollection(db), { ...data, createdAt: now, updatedAt: now });
  return docRef.id;
}

export async function updateVideo(id: string, data: Partial<Omit<Video, "id" | "createdAt" | "updatedAt">>): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.VIDEOS, id);
  await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
}

export async function deleteVideo(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.VIDEOS, id);
  await deleteDoc(docRef);
}

export async function getActiveVideos(limitCount: number = 12): Promise<Video[]> {
  return getVideos({ isActive: true, limit: limitCount });
}

export async function getFeaturedVideos(limitCount: number = 1): Promise<Video[]> {
  return getVideos({ isFeatured: true, isActive: true, limit: limitCount });
}

export async function getVideosByCategory(category: string): Promise<Video[]> {
  return getVideos({ category, isActive: true });
}
