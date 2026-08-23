"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2, ZoomIn } from "lucide-react";
import { ImageLightbox } from "@/components/ui/image-lightbox";

interface ImageUploadSingleProps {
  image: string;
  onChange: (image: string) => void;
  label?: string;
  required?: boolean;
  path?: string;
}

interface PreviewImage {
  file?: File;
  preview: string;
  uploading?: boolean;
  url?: string;
  error?: string;
}

export function ImageUploadSingle({
  image,
  onChange,
  label = "Cover Image",
  required = false,
  path = "articles",
}: ImageUploadSingleProps) {
  const [preview, setPreview] = useState<PreviewImage | null>(
    image ? { preview: image, url: image } : null
  );
  const [showLightbox, setShowLightbox] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (image && (!preview || preview.url !== image)) {
      setPreview({ preview: image, url: image });
    }
  }, [image]);

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

    const storagePath = `${path}/${Date.now()}-${filename}`;
    const storageRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
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

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempPreview: PreviewImage = {
      file,
      preview: URL.createObjectURL(file),
      uploading: true,
    };
    setPreview(tempPreview);

    try {
      const compressed = await compressImage(file);
      const seoFilename = generateSeoFilename(file.name, path);
      const url = await uploadToFirebase(compressed, seoFilename);

      setPreview({ preview: url, url, uploading: false });
      onChange(url);
    } catch (error) {
      console.error("Upload failed:", error);
      setPreview((prev) =>
        prev
          ? { ...prev, error: "Upload gagal", uploading: false }
          : null
      );
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function removeImage() {
    setPreview(null);
    onChange("");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>

      {preview && !preview.error ? (
        <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100 group">
          <button
            type="button"
            onClick={() => setShowLightbox(true)}
            className="w-full h-full cursor-zoom-in"
            aria-label="Lihat gambar"
          >
            <img
              src={preview.url || preview.preview}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
          </button>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => setShowLightbox(true)}
              className="p-2 bg-white/80 rounded text-gray-700 hover:bg-white"
              title="Lihat besar"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={removeImage}
              className="p-2 bg-red-500/80 rounded text-white hover:bg-red-500"
              title="Hapus"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="aspect-video rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
          {preview?.uploading ? (
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-500">Mengunggah...</p>
            </div>
          ) : (
            <label
              htmlFor="single-image-upload"
              className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Klik untuk upload cover</span>
            </label>
          )}
        </div>
      )}

      <ImageLightbox
        images={preview?.url ? [preview.url] : []}
        initialIndex={0}
        isOpen={showLightbox}
        onClose={() => setShowLightbox(false)}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="single-image-upload"
      />

      <p className="text-xs text-gray-500">
        Format: JPG, PNG. Maks 2MB. Rasio 16:9 direkomendasikan.
      </p>
    </div>
  );
}
