"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { createReview, markReviewLinkUsed, getReviewSettings } from "@/lib/firestore/reviews";
import { Review } from "@/types/review";
import { SITE_URL } from "@/lib/constants";
import { Star, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageUploadSingle } from "@/components/ui/image-upload-single";

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className="p-0.5"
        >
          <Star
            className={`w-8 h-8 ${
              i <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewPage() {
  const params = useParams();
  const token = params?.token as string;

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    rating: 5,
    content: "",
    photo: "",
    productUsed: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [autoApprove, setAutoApprove] = useState(false);

  useEffect(() => {
    async function checkToken() {
      try {
        const settings = await getReviewSettings();
        setAutoApprove(settings.autoApprove);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
      setLoading(false);
    }
    checkToken();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customerName || !form.content || form.rating === 0) {
      setError("Mohon isi nama, rating, dan review Anda.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const reviewData: Omit<Review, "id" | "submittedAt"> = {
        customerName: form.customerName,
        customerPhone: form.customerPhone || undefined,
        rating: form.rating,
        content: form.content,
        photo: form.photo || undefined,
        productUsed: form.productUsed || undefined,
        status: autoApprove ? "approved" : "pending",
        reviewToken: token,
      };

      const reviewId = await createReview(reviewData);
      await markReviewLinkUsed(token, reviewId);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Gagal mengirim review. Silakan coba lagi.");
    }

    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Terima Kasih!
          </h1>
          <p className="text-gray-600 mb-6">
            {autoApprove
              ? "Review Anda telah berhasil dikirim dan akan segera tampil di website kami."
              : "Review Anda telah berhasil dikirim dan akan ditinjau oleh tim kami sebelum ditampilkan."}
          </p>
          <a
            href={`https://wa.me/6281326440039?text=${encodeURIComponent("Halo, saya sudah mengisi review. Terima kasih!")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Hubungi Kami via WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Beri Review" },
          ]}
        />

        <div className="mt-6 mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Beri Review Mesin Es Kristal
          </h1>
          <p className="text-gray-600">
            Bagikan pengalaman Anda menggunakan mesin es kristal kami. Review Anda sangat berarti bagi kami!
          </p>
        </div>

        <Card>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Anda <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) => setForm((prev) => ({ ...prev, customerName: e.target.value }))}
                  placeholder="Pak Budi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor WhatsApp (opsional)
                </label>
                <input
                  type="tel"
                  value={form.customerPhone}
                  onChange={(e) => setForm((prev) => ({ ...prev, customerPhone: e.target.value }))}
                  placeholder="081234567890"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Produk yang Digunakan (opsional)
                </label>
                <input
                  type="text"
                  value={form.productUsed}
                  onChange={(e) => setForm((prev) => ({ ...prev, productUsed: e.target.value }))}
                  placeholder="Mesin Es 1 Ton/Hari"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating <span className="text-red-500">*</span>
                </label>
                <StarRating value={form.rating} onChange={(v) => setForm((prev) => ({ ...prev, rating: v }))} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Anda <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                  rows={5}
                  placeholder="Ceritakan pengalaman Anda menggunakan mesin es kristal kami..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{form.content.length} karakter</p>
              </div>

              <div>
                <ImageUploadSingle
                  image={form.photo}
                  onChange={(url) => setForm((prev) => ({ ...prev, photo: url }))}
                  label="Foto (opsional)"
                  path="reviews"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? "Mengirim..." : "Kirim Review"}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
