"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, MessageSquare, Save } from "lucide-react";
import { getContactInfo, updateContactInfo } from "@/lib/firestore/contact";
import { ContactInfo } from "@/types/contact";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
}

export default function KontakAdmin() {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    whatsappNumber: "",
    whatsappMessage: "",
    email: "",
    address: "",
    operatingHours: "",
    googleMapsEmbed: "",
    description: "",
  });

  useEffect(() => {
    fetchContact();
  }, []);

  function extractMapsUrl(value: string): string {
    if (!value) return "";
    if (value.includes('<iframe')) {
      const match = value.match(/src="([^"]+)"/);
      if (match) return match[1];
    }
    return value;
  }

  async function fetchContact() {
    setLoading(true);
    try {
      const data = await getContactInfo();
      setContact(data);
      setFormData({
        whatsappNumber: data.whatsappNumber || "",
        whatsappMessage: data.whatsappMessage || "",
        email: data.email || "",
        address: data.address || "",
        operatingHours: data.operatingHours || "",
        googleMapsEmbed: extractMapsUrl(data.googleMapsEmbed || ""),
        description: data.description || "",
      });
    } catch (error) {
      console.error("Error fetching contact info:", error);
    }
    setLoading(false);
  }

  function handleChange(name: string, value: string) {
    setFormData((prev) => ({ ...prev, [name]: extractMapsUrl(value) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const cleanedData = {
        ...formData,
        googleMapsEmbed: extractMapsUrl(formData.googleMapsEmbed),
      };
      await updateContactInfo(cleanedData);
      alert("Informasi kontak berhasil diupdate! Perubahan akan tampil di semua halaman.");
      fetchContact();
    } catch (error) {
      console.error("Error saving contact info:", error);
      alert("Gagal menyimpan informasi kontak. Silakan coba lagi.");
    }

    setSaving(false);
  }

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
        <h2 className="text-2xl font-bold text-gray-900">Pengaturan Kontak</h2>
      </div>

      <Card className="max-w-4xl">
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-6">
            Informasi kontak ini akan tampil di halaman publik dan terintegrasi dengan tombol WhatsApp di semua halaman.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                WhatsApp
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nomor WhatsApp</Label>
                  <input
                    type="text"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                    placeholder="6281326440039"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: 62xxxxxxxxxx (tanpa + atau spasi)
                  </p>
                </div>
                <div>
                  <Label>Pesan WhatsApp Otomatis</Label>
                  <input
                    type="text"
                    name="whatsappMessage"
                    value={formData.whatsappMessage}
                    onChange={(e) => handleChange("whatsappMessage", e.target.value)}
                    placeholder="Halo saya tertarik dengan mesin es kristal"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Pesan otomatis saat user klik tombol WhatsApp
                  </p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Email & Deskripsi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="info@mesineskristal.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <Label>Deskripsi Singkat</Label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Hubungi kami untuk konsultasi gratis..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Alamat & Peta
              </h3>
              <div className="space-y-4">
                <div>
                  <Label>Alamat Lengkap</Label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    rows={2}
                    placeholder="Jl. Contoh No. 123, Kota, Provinsi"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <Label>Google Maps Embed URL</Label>
                  <input
                    type="text"
                    name="googleMapsEmbed"
                    value={formData.googleMapsEmbed}
                    onChange={(e) => handleChange("googleMapsEmbed", e.target.value)}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Buka Google Maps → Cari lokasi → Klik Share → Pilih "Embed a map" → Copy URL dari <code className="bg-gray-100 px-1 rounded">src="..."</code>
                  </p>
                  {formData.googleMapsEmbed && formData.googleMapsEmbed.startsWith("https://www.google.com/maps/embed?") ? (
                    <div className="mt-3 aspect-video rounded-lg overflow-hidden border border-gray-200">
                      <iframe
                        src={formData.googleMapsEmbed}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Preview Maps"
                      />
                    </div>
                  ) : formData.googleMapsEmbed ? (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-700">
                        URL tidak valid. Pastikan URL dimulai dengan <code className="bg-yellow-100 px-1 rounded">https://www.google.com/maps/embed?pb=</code>
                      </p>
                      <p className="text-xs text-yellow-600 mt-1">
                        URL saat ini: {formData.googleMapsEmbed.substring(0, 80)}...
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Jam Operasional
              </h3>
              <div>
                <Label>Jam Operasional</Label>
                <input
                  type="text"
                  name="operatingHours"
                  value={formData.operatingHours}
                  onChange={(e) => handleChange("operatingHours", e.target.value)}
                  placeholder="Senin - Sabtu, 08:00 - 17:00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
              <Button type="button" variant="outline" onClick={fetchContact}>
                Reset
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
