import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  type Firestore,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Admin } from "@/types/user";
import { COLLECTIONS } from "@/lib/constants";

function getCollection(firestore: Firestore) {
  return collection(firestore, COLLECTIONS.ADMINS);
}

export async function getAdminByUid(uid: string): Promise<Admin | null> {
  if (!db) return null;
  const docRef = doc(db, COLLECTIONS.ADMINS, uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;

  return {
    uid: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate(),
  } as Admin;
}

export async function getAdminByEmail(email: string): Promise<Admin | null> {
  if (!db) return null;
  const q = query(getCollection(db), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  const adminDoc = snapshot.docs.find(
    (d) => d.data().email === email
  );
  if (!adminDoc) return null;

  return {
    uid: adminDoc.id,
    ...adminDoc.data(),
    createdAt: adminDoc.data().createdAt?.toDate(),
  } as Admin;
}

export async function getAllAdmins(): Promise<Admin[]> {
  if (!db) return [];
  const q = query(getCollection(db), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    uid: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate(),
  })) as Admin[];
}

export async function createAdmin(
  uid: string,
  data: Omit<Admin, "uid" | "createdAt">
): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.ADMINS, uid);
  await setDoc(docRef, {
    ...data,
    createdAt: Timestamp.now(),
  });
}

export async function updateAdmin(
  uid: string,
  data: Partial<Omit<Admin, "uid" | "createdAt">>
): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.ADMINS, uid);
  await updateDoc(docRef, data);
}

export async function updateLastLogin(uid: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.ADMINS, uid);
  await updateDoc(docRef, {
    lastLoginAt: Timestamp.now(),
  });
}

export async function deleteAdmin(uid: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.ADMINS, uid);
  await deleteDoc(docRef);
}

export async function isAdmin(uid: string): Promise<boolean> {
  if (!db) return false;
  const admin = await getAdminByUid(uid);
  return admin !== null;
}
