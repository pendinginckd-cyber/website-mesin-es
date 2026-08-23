import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase/client";

export async function uploadImage(
  file: File,
  path: string
): Promise<string> {
  if (!storage) throw new Error("Firebase Storage not configured");
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

export async function uploadMultipleImages(
  files: File[],
  basePath: string
): Promise<string[]> {
  const uploadPromises = files.map((file, index) => {
    const path = `${basePath}/${Date.now()}-${index}-${file.name}`;
    return uploadImage(file, path);
  });
  return Promise.all(uploadPromises);
}

export async function deleteImage(url: string): Promise<void> {
  if (!storage) throw new Error("Firebase Storage not configured");
  const imageRef = ref(storage, url);
  await deleteObject(imageRef);
}
