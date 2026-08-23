"use client";

import { useState } from "react";
import { useContact } from "@/contexts/contact-context";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, ExternalLink } from "lucide-react";
import { createLead } from "@/lib/firestore/leads";
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/constants";

export default function KontakPage() {
  const { contact, loading } = useContact();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    productInterest: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(name: string, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nama wajib diisi";
    if (!formData.phone.trim()) {
      newErrors.phone = "Nomor WhatsApp wajib diisi";
    } else if (!/^[0-9+\-\s]{8,15}$/.test(formData.phone)) {
      newErrors.phone = "Format nomor WhatsApp tidak valid";
    }
    if (!formData.message.trim()) newErrors.message = "Pesan wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      await createLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        message: formData.message.trim(),
        productInterest: formData.productInterest.trim() || undefined,
        status: "new",
      });

      setSubmitted(true);

      setTimeout(() => {
        const waNumber = contact?.whatsappNumber || WHATSAPP_NUMBER;
        const waMessage = contact?.whatsappMessage || WHATSAPP_MESSAGE;
        const fullMessage = `${waMessage}%0A%0ANama: ${formData.name}%0ANo. HP: ${formData.phone}%0AProduk: ${formData.productInterest || "-"}%0APesan: ${formData.message}`;
        window.open(`https://wa.me/${waNumber}?text=${fullMessage}`, "_blank");
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Gagal mengirim pesan. Silakan coba lagi atau hubungi kami via WhatsApp.");
    }

    setSubmitting(false);
  }

  const waNumber = contact?.whatsappNumber || WHATSAPP_NUMBER;
  const waMessage = contact?.whatsappMessage || WHATSAPP_MESSAGE;

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumb
            items={[
              { label: "Beranda", href: "/" },
              { label: "Kontak" },
            ]}
          />

          <div className="mt-8 text-center py-16">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Terima Kasih!</h1>
            <p className="text-lg text-gray-600 mb-2">
              Pesan Anda telah berhasil dikirim.
            </p>
            <p className="text-gray-500 mb-8">
              Kami akan segera menghubungi Anda. Anda akan dialihkan ke WhatsApp...
            </p>
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Phone className="w-5 h-5" />
              Chat WhatsApp Sekarang
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Kontak" },
          ]}
        />

        <div className="mt-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Hubungi Kami
          </h1>
          <p className="text-lg text-gray-600">
            {contact?.description || "Konsultasi gratis untuk kebutuhan mesin es kristal Anda."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  WhatsApp
                </h3>
                {loading ? (
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-32" />
                ) : (
                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    +{waNumber}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Email
                </h3>
                {loading ? (
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-40" />
                ) : contact?.email ? (
                  <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                    {contact.email}
                  </a>
                ) : (
                  <p className="text-gray-500 text-sm">-</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Alamat
                </h3>
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  </div>
                ) : contact?.address ? (
                  <p className="text-gray-600 text-sm whitespace-pre-line">{contact.address}</p>
                ) : (
                  <p className="text-gray-500 text-sm">-</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Jam Operasional
                </h3>
                {loading ? (
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-48" />
                ) : contact?.operatingHours ? (
                  <p className="text-gray-600 text-sm">{contact.operatingHours}</p>
                ) : (
                  <p className="text-gray-500 text-sm">-</p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Kirim Pesan</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Nama lengkap"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      No. WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="email@contoh.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Produk yang Diminati
                    </label>
                    <select
                      value={formData.productInterest}
                      onChange={(e) => handleChange("productInterest", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Pilih produk...</option>
                      <option value="Mesin Es Kristal 1 Ton">Mesin Es Kristal 1 Ton</option>
                      <option value="Mesin Es Kristal 3 Ton">Mesin Es Kristal 3 Ton</option>
                      <option value="Mesin Es Kristal 5 Ton">Mesin Es Kristal 5 Ton</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pesan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    rows={4}
                    placeholder="Tulis kebutuhan Anda..."
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                      errors.message ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                  {submitting ? "Mengirim..." : "Kirim Pesan"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {contact?.googleMapsEmbed && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Lokasi Kami</h2>
            {(() => {
              const mapsUrl = contact.googleMapsEmbed.includes('<iframe')
                ? (contact.googleMapsEmbed.match(/src="([^"]+)"/)?.[1] || "")
                : contact.googleMapsEmbed;

              return mapsUrl.startsWith("https://www.google.com/maps/embed?") ? (
                <div className="aspect-video rounded-xl overflow-hidden border border-gray-200">
                  <iframe
                    src={mapsUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi Kami di Google Maps"
                  />
                </div>
              ) : (
                <a
                  href={mapsUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-8 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:text-primary hover:border-primary transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  Buka di Google Maps
                </a>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
