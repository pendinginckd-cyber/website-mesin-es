"use client";

import { useState } from "react";
import { uploadImage, uploadMultipleImages } from "@/lib/storage/upload";

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function uploadSingle(file: File, path: string): Promise<string> {
    try {
      setUploading(true);
      setError(null);
      const url = await uploadImage(file, path);
      return url;
    } catch (err) {
      setError("Gagal mengupload gambar");
      throw err;
    } finally {
      setUploading(false);
    }
  }

  async function uploadMultiple(
    files: File[],
    basePath: string
  ): Promise<string[]> {
    try {
      setUploading(true);
      setError(null);
      const urls = await uploadMultipleImages(files, basePath);
      return urls;
    } catch (err) {
      setError("Gagal mengupload gambar");
      throw err;
    } finally {
      setUploading(false);
    }
  }

  return { uploadSingle, uploadMultiple, uploading, progress, error };
}
