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
import { Review, ReviewSettings, ReviewLink } from "@/types/review";

const SETTINGS_DOC_ID = "default";

// Review Settings
export async function getReviewSettings(): Promise<ReviewSettings> {
  if (!db) return getDefaultReviewSettings();

  try {
    const docRef = doc(db, "reviewSettings", SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        autoApprove: data.autoApprove ?? false,
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    }
  } catch (error) {
    console.error("Error fetching review settings:", error);
  }

  return getDefaultReviewSettings();
}

export async function updateReviewSettings(data: { autoApprove: boolean }): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, "reviewSettings", SETTINGS_DOC_ID);
  await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
}

function getDefaultReviewSettings(): ReviewSettings {
  return {
    id: SETTINGS_DOC_ID,
    autoApprove: false,
    updatedAt: new Date(),
  };
}

// Reviews
export async function getReviews(params?: {
  status?: string;
  limit?: number;
}): Promise<Review[]> {
  if (!db) return [];

  let q = query(collection(db, "reviews"), orderBy("submittedAt", "desc"));
  if (params?.status) q = query(q, where("status", "==", params.status));
  if (params?.limit) q = query(q, limit(params.limit));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    submittedAt: doc.data().submittedAt?.toDate(),
  })) as Review[];
}

export async function getApprovedReviews(limitCount: number = 12): Promise<Review[]> {
  return getReviews({ status: "approved", limit: limitCount });
}

export async function getReviewByToken(token: string): Promise<Review | null> {
  if (!db) return null;
  const q = query(collection(db, "reviews"), where("reviewToken", "==", token), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return {
    id: docSnap.id,
    ...docSnap.data(),
    submittedAt: docSnap.data().submittedAt?.toDate(),
  } as Review;
}

export async function createReview(data: Omit<Review, "id" | "submittedAt">): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = await addDoc(collection(db, "reviews"), {
    ...data,
    submittedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateReviewStatus(id: string, status: Review["status"]): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await updateDoc(doc(db, "reviews", id), { status });
}

export async function deleteReview(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await deleteDoc(doc(db, "reviews", id));
}

// Review Links
export async function createReviewLink(data: {
  token: string;
  customerPhone: string;
  customerName?: string;
}): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = await addDoc(collection(db, "reviewLinks"), {
    ...data,
    sentAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getReviewLinks(): Promise<ReviewLink[]> {
  if (!db) return [];
  const q = query(collection(db, "reviewLinks"), orderBy("sentAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    sentAt: doc.data().sentAt?.toDate(),
    usedAt: doc.data().usedAt?.toDate(),
  })) as ReviewLink[];
}

export async function markReviewLinkUsed(linkId: string, reviewId: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  await updateDoc(doc(db, "reviewLinks", linkId), {
    usedAt: Timestamp.now(),
    reviewId,
  });
}
