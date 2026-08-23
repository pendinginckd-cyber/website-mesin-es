import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export async function loginAdmin(email: string, password: string) {
  if (!auth) throw new Error("Firebase not configured");
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logoutAdmin() {
  if (!auth) throw new Error("Firebase not configured");
  return signOut(auth);
}

export function subscribeToAuthChange(
  callback: (user: User | null) => void
): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }
  const unsubscribe = onAuthStateChanged(auth, callback);
  return unsubscribe;
}
