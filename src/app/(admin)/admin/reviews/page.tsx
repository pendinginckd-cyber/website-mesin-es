"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getReviews,
  updateReviewStatus,
  deleteReview,
  getReviewSettings,
  updateReviewSettings,
  createReviewLink,
  getReviewLinks,
  deleteReviewLink,
} from "@/lib/firestore/reviews";
import { Review, ReviewLink } from "@/types/review";
import { SITE_URL } from "@/lib/constants";
import { copyToClipboard } from "@/lib/clipboard";
import { normalizeWaPhone } from "@/lib/phone";
import {
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  MessageSquare,
  Link2,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  approved: { label: "Approved", color: "bg-green-100 text-green-700", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
};

function generateToken(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [links, setLinks] = useState<ReviewLink[]>([]);
  const [settings, setSettings] = useState({ autoApprove: false });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [linkForm, setLinkForm] = useState({ customerPhone: "", customerName: "" });
  const [generated, setGenerated] = useState<{ link: string; name?: string; phone: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [reviewsData, linksData, settingsData] = await Promise.all([
        getReviews(),
        getReviewLinks(),
        getReviewSettings(),
      ]);
      setReviews(reviewsData);
      setLinks(linksData);
      setSettings({ autoApprove: settingsData.autoApprove });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }

  async function handleStatusChange(id: string, status: Review["status"]) {
    try {
      await updateReviewStatus(id, status);
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Gagal update status.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus review ini?")) return;
    try {
      await deleteReview(id);
      fetchData();
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Gagal menghapus.");
    }
  }

  async function handleToggleAutoApprove() {
    try {
      const newAutoApprove = !settings.autoApprove;
      await updateReviewSettings({ autoApprove: newAutoApprove });
      setSettings({ autoApprove: newAutoApprove });
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Gagal update setting.");
    }
  }

  async function handleGenerateLink() {
    if (!linkForm.customerPhone.trim()) {
      alert("Isi nomor WhatsApp pelanggan terlebih dahulu.");
      return;
    }
    try {
      const token = generateToken();
      await createReviewLink({
        token,
        customerPhone: linkForm.customerPhone.trim(),
        customerName: linkForm.customerName.trim() || undefined,
      });
      setGenerated({
        link: `${SITE_URL}/review/${token}`,
        name: linkForm.customerName.trim() || undefined,
        phone: linkForm.customerPhone.trim(),
      });
      setLinkForm({ customerPhone: "", customerName: "" });
      fetchData();
    } catch (error) {
      console.error("Error generating link:", error);
      alert("Gagal generate link.");
    }
  }

  async function handleCopy(value: string, id: string) {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }

  function buildWaMessage(name: string | undefined, link: string): string {
    return [
      `Halo ${name || "Kak"}, terima kasih telah mempercayai kami! 🙏`,
      "",
      "Bila berkenan, mohon luangkan waktu sejenak untuk memberikan ulasan melalui tautan berikut:",
      link,
      "",
      "Ulasan Anda sangat berarti bagi kami. Terima kasih!",
    ].join("\n");
  }

  function openWaFor(name: string | undefined, phone: string, link: string) {
    const target = normalizeWaPhone(phone);
    window.open(
      `https://wa.me/${target}?text=${encodeURIComponent(buildWaMessage(name, link))}`,
      "_blank"
    );
  }

  function sendGeneratedLink() {
    if (!generated) return;
    openWaFor(generated.name, generated.phone, generated.link);
  }

  async function handleDeleteLink(id: string) {
    if (!confirm("Hapus link review ini? Tautan yang sudah terlanjur dibagikan akan menjadi tidak valid.")) return;
    try {
      await deleteReviewLink(id);
      fetchData();
    } catch (error) {
      console.error("Error deleting link:", error);
      alert("Gagal menghapus link.");
    }
  }

  function getFiltered() {
    if (filterStatus === "all") return reviews;
    return reviews.filter((r) => r.status === filterStatus);
  }

  const filtered = getFiltered();
  const stats = {
    total: reviews.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Manajemen Review</h2>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Review</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          <p className="text-sm text-gray-500">Approved</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          <p className="text-sm text-gray-500">Rejected</p>
        </Card>
      </div>

      {/* Settings */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            Pengaturan Auto-Approve
          </h3>
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleAutoApprove}
              className={`relative w-11 h-6 rounded-full transition-colors ${settings.autoApprove ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.autoApprove ? "translate-x-5" : ""}`} />
            </button>
            <div>
              <p className="font-medium text-gray-900">
                {settings.autoApprove ? "Auto-Approve ON" : "Auto-Approve OFF"}
              </p>
              <p className="text-sm text-gray-500">
                {settings.autoApprove
                  ? "Review pelanggan langsung tampil di website setelah submit"
                  : "Review pelanggan masuk pending, admin harus approve manual"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Generate Review Link */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" />
            Kirim Link Review ke Pelanggan
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Link bersifat sekali pakai — otomatis tidak berlaku setelah pelanggan mengirim review.
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor WhatsApp Pelanggan
                </label>
                <input
                  type="tel"
                  value={linkForm.customerPhone}
                  onChange={(e) => setLinkForm((prev) => ({ ...prev, customerPhone: e.target.value }))}
                  placeholder="081234567890"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pelanggan (opsional)
                </label>
                <input
                  type="text"
                  value={linkForm.customerName}
                  onChange={(e) => setLinkForm((prev) => ({ ...prev, customerName: e.target.value }))}
                  placeholder="Pak Budi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            <Button variant="primary" size="sm" onClick={handleGenerateLink}>
              <Link2 className="w-4 h-4 mr-1" /> Generate Link
            </Button>

            {generated && (
              <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={generated.link}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(generated.link, "__generated")}
                    title="Salin link"
                  >
                    {copiedId === "__generated" ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button size="sm" variant="primary" onClick={sendGeneratedLink}>
                    <MessageSquare className="w-4 h-4 mr-1" /> Kirim via WhatsApp
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Riwayat Link */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Riwayat Link ({links.length})
          </h3>
          {links.length > 0 ? (
            <div className="space-y-2">
              {links.map((link) => {
                const isUsed = !!link.usedAt;
                return (
                  <div
                    key={link.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm text-gray-900">
                          {link.customerName || link.customerPhone}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            isUsed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {isUsed ? "Dipakai" : "Belum dipakai"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                        <span>{link.sentAt?.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                        <span className="truncate">{SITE_URL}/review/{link.token}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleCopy(`${SITE_URL}/review/${link.token}`, link.id)}
                        className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                        title="Salin link"
                      >
                        {copiedId === link.id ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      {!isUsed && (
                        <button
                          onClick={() =>
                            openWaFor(link.customerName, link.customerPhone, `${SITE_URL}/review/${link.token}`)
                          }
                          className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Kirim ulang via WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                        title="Hapus link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Belum ada link yang dibuat.</p>
          )}
        </div>
      </Card>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
            filterStatus === "all"
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-300 hover:border-primary"
          }`}
        >
          Semua ({stats.total})
        </button>
        <button
          onClick={() => setFilterStatus("pending")}
          className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
            filterStatus === "pending"
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-300 hover:border-primary"
          }`}
        >
          Pending ({stats.pending})
        </button>
        <button
          onClick={() => setFilterStatus("approved")}
          className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
            filterStatus === "approved"
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-300 hover:border-primary"
          }`}
        >
          Approved ({stats.approved})
        </button>
        <button
          onClick={() => setFilterStatus("rejected")}
          className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
            filterStatus === "rejected"
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-300 hover:border-primary"
          }`}
        >
          Rejected ({stats.rejected})
        </button>
      </div>

      {/* Reviews List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((review) => {
            const statusConfig = STATUS_CONFIG[review.status];
            const StatusIcon = statusConfig.icon;
            return (
              <Card key={review.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    {review.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={review.photo}
                        alt={review.customerName}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold text-lg">
                          {review.customerName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-gray-900">{review.customerName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3 inline mr-1" />
                        {statusConfig.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      {review.productUsed && (
                        <span className="text-xs text-gray-500">Produk: {review.productUsed}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 italic">
                      &ldquo;{review.content}&rdquo;
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {review.submittedAt?.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    {review.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(review.id, "approved")}
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(review.id, "rejected")}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">
            Belum ada review{filterStatus !== "all" ? ` dengan status "${filterStatus}"` : ""}.
          </p>
        </div>
      )}
    </div>
  );
}
