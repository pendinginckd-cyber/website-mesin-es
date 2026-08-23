"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2, ZoomIn } from "lucide-react";
import { ImageLightbox } from "@/components/ui/image-lightbox";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  productSlug?: string;
  label?: string;
  required?: boolean;
}

interface PreviewImage {
  file?: File;
  preview: string;
  uploading?: boolean;
  url?: string;
  error?: string;
}

export function ImageUpload({
  images,
  onChange,
  maxImages = 8,
  productSlug = "product",
  label = "Gambar",
  required = false,
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<PreviewImage[]>(
    images.map((url) => ({ preview: url, url }))
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewsRef = useRef(previews);

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  // Sync parent images prop to previews (e.g., when editing)
  useEffect(() => {
    const currentUrls = previewsRef.current.filter((p) => p.url && !p.error).map((p) => p.url!);
    const imagesChanged = images.length !== currentUrls.length || images.some((u, i) => u !== currentUrls[i]);
    if (imagesChanged) {
      setPreviews(images.map((url) => ({ preview: url, url })));
    }
  }, [images]);

  function notifyParent(urls: string[]) {
    setTimeout(() => onChange(urls), 0);
  }

  async function compressImage(file: File, maxSizeKB: number = 200): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const maxDimension = 1200;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size > maxSizeKB * 1024) {
              const quality = (maxSizeKB * 1024) / blob.size;
              canvas.toBlob(
                (compressed) => {
                  if (compressed) {
                    resolve(compressed);
                  } else {
                    reject(new Error("Compression failed"));
                  }
                },
                "image/jpeg",
                quality
              );
            } else if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Could not create blob"));
            }
          },
          "image/jpeg",
          0.9
        );
      };
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = URL.createObjectURL(file);
    });
  }

  async function uploadToFirebase(file: Blob, filename: string): Promise<string> {
    const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
    const { storage } = await import("@/lib/firebase/client");

    if (!storage) {
      throw new Error("Firebase Storage not configured");
    }

    const path = `products/${productSlug}/${Date.now()}-${filename}`;
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = maxImages - previews.filter((p) => !p.error).length;
    if (files.length > remainingSlots) {
      alert(`Maksimal ${maxImages} gambar. Sisa slot: ${remainingSlots}`);
      return;
    }

    const newPreviews: PreviewImage[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: true,
    }));

    setPreviews((prev) => [...prev, ...newPreviews]);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const previewIndex = previews.length + i;

      try {
        const compressed = await compressImage(file);
        const seoFilename = generateSeoFilename(file.name, productSlug);
        const url = await uploadToFirebase(compressed, seoFilename);

        setPreviews((prev) => {
          const updated = [...prev];
          updated[previewIndex] = { ...updated[previewIndex], url, uploading: false };
          const urls = updated.filter((p) => p.url && !p.error).map((p) => p.url!);
          notifyParent(urls);
          return updated;
        });
      } catch (error) {
        console.error("Upload failed:", error);
        setPreviews((prev) => {
          const updated = [...prev];
          updated[previewIndex] = {
            ...updated[previewIndex],
            error: "Upload gagal",
            uploading: false,
          };
          const urls = updated.filter((p) => p.url && !p.error).map((p) => p.url!);
          notifyParent(urls);
          return updated;
        });
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function generateSeoFilename(originalName: string, slug: string): string {
    const extension = originalName.split(".").pop()?.toLowerCase() || "jpg";
    const baseName = originalName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase()
      .substring(0, 30);
    return `${slug}-${baseName}.${extension}`;
  }

  function removeImage(index: number) {
    setPreviews((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      const urls = updated.filter((p) => p.url && !p.error).map((p) => p.url!);
      notifyParent(urls);
      return updated;
    });
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= previews.length) return;
    setPreviews((prev) => {
      const updated = [...prev];
      const [removed] = updated.splice(from, 1);
      updated.splice(to, 0, removed);
      const urls = updated.filter((p) => p.url && !p.error).map((p) => p.url!);
      notifyParent(urls);
      return updated;
    });
  }

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const validPreviews = previews.filter((p) => p.url && !p.error);
  const validUrls = validPreviews.map((p) => p.url!);
  const isFull = validPreviews.length >= maxImages;
  const hasUploading = previews.some((p) => p.uploading);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
          <span className="text-gray-500 font-normal ml-1">
            ({validPreviews.length}/{maxImages})
          </span>
        </label>
      </div>

      {validPreviews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {validPreviews.map((preview, index) => (
            <div
              key={preview.url || index}
              className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100 group"
            >
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="w-full h-full cursor-zoom-in"
                aria-label={`Lihat gambar ${index + 1}`}
              >
                <img
                  src={preview.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
              {index === 0 && (
                <span className="absolute top-1 left-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded">
                  Utama
                </span>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="p-1.5 bg-white/80 rounded text-gray-700 hover:bg-white"
                  title="Lihat besar"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="p-1.5 bg-white/80 rounded text-gray-700 hover:bg-white"
                    title="Pindah kiri"
                  >
                    ←
                  </button>
                )}
                {index < validPreviews.length - 1 && validPreviews.length > 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    className="p-1.5 bg-white/80 rounded text-gray-700 hover:bg-white"
                    title="Pindah kanan"
                  >
                    →
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(previews.indexOf(preview))}
                  className="p-1.5 bg-red-500/80 rounded text-white hover:bg-red-500"
                  title="Hapus"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ImageLightbox
        images={validUrls}
        initialIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload"
      />

      {!isFull && (
        <label
          htmlFor="image-upload"
          className={`flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            hasUploading
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 hover:border-primary hover:bg-primary/5"
          }`}
        >
          {hasUploading ? (
            <>
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              <span className="text-sm text-gray-500">Mengunggah gambar...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                Klik untuk upload gambar{isFull ? "" : ` (max ${maxImages})`}
              </span>
            </>
          )}
        </label>
      )}

      {validPreviews.length === 0 && required && (
        <p className="text-xs text-red-500">Minimal {maxImages} gambar diperlukan</p>
      )}

      <p className="text-xs text-gray-500">
        Format: JPG, PNG. Maks 2MB per file. Gambar akan di-compress otomatis untuk SEO.
      </p>
    </div>
  );
}