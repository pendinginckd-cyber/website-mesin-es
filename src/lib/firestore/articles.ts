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
  limit,
  Timestamp,
  type Firestore,
} from "firebase/firestore";
import { safeFirestore } from "./safe";
import { db } from "@/lib/firebase/client";
import { Article } from "@/types/article";
import { COLLECTIONS } from "@/lib/constants";

function getCollection(firestore: Firestore) {
  return collection(firestore, COLLECTIONS.ARTICLES);
}

export async function getArticles(params?: {
  category?: string;
  isPublished?: boolean;
  limit?: number;
}): Promise<Article[]> {
  if (!db) return [];

  // Fetch all articles first (no orderBy to avoid excluding docs without publishedAt)
  let q = query(getCollection(db));
  if (params?.category) q = query(q, where("category", "==", params.category));

  const snapshot = await getDocs(q);
  let articles = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    publishedAt: doc.data().publishedAt?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Article[];

  // Only filter by isPublished if explicitly provided
  if (params?.isPublished !== undefined) {
    articles = articles.filter((a) => a.isPublished === params.isPublished);
  }

  // Sort client-side by publishedAt descending
  articles.sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));

  // Apply limit after sorting
  if (params?.limit) {
    articles = articles.slice(0, params.limit);
  }

  return articles;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!db) return null;
  const firestore = db;

  return safeFirestore(async () => {
    const q = query(getCollection(firestore), where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docSnap = snapshot.docs[0];
    const article = { id: docSnap.id, ...docSnap.data(), publishedAt: docSnap.data().publishedAt?.toDate(), createdAt: docSnap.data().createdAt?.toDate(), updatedAt: docSnap.data().updatedAt?.toDate() } as Article;
    if (!article.isPublished) return null;
    return article;
  }, null);
}

export async function getArticleById(id: string): Promise<Article | null> {
  if (!db) return null;
  const docRef = doc(db, COLLECTIONS.ARTICLES, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data(), publishedAt: docSnap.data().publishedAt?.toDate(), createdAt: docSnap.data().createdAt?.toDate(), updatedAt: docSnap.data().updatedAt?.toDate() } as Article;
}

export async function createArticle(data: Omit<Article, "id" | "createdAt" | "updatedAt">): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const now = Timestamp.now();
  const docRef = await addDoc(getCollection(db), {
    ...data,
    publishedAt: data.publishedAt || now,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updateArticle(id: string, data: Partial<Omit<Article, "id" | "createdAt" | "updatedAt">>): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.ARTICLES, id);
  await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
}

export async function deleteArticle(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.ARTICLES, id);
  await deleteDoc(docRef);
}

export async function getPublishedArticles(limitCount: number = 12): Promise<Article[]> {
  return getArticles({ isPublished: true, limit: limitCount });
}
