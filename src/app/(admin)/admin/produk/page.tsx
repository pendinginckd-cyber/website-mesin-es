"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/ui/image-upload";
import { ChevronDown, ChevronUp, Plus, Trash2, Edit2 } from "lucide-react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/firestore/products";
import { Product, Specification } from "@/types/product";

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  capacity: string;
  capacityValue: number;
  power: string;
  price: number;
  priceDisplay: string;
  material: string;
  warranty: string;
  stock: string;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  specifications: Specification[];
  certifications: string[];
  videoUrl: string;
  images: string[];
  thumbnail: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoNoIndex: boolean;
  seoCanonical: string;
}

const initialFormData: ProductFormData = {
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  capacity: "",
  capacityValue: 1,
  power: "",
  price: 0,
  priceDisplay: "",
  material: "",
  warranty: "",
  stock: "tersedia",
  category: "kecil",
  isActive: true,
  isFeatured: false,
  specifications: [{ label: "", value: "" }],
  certifications: [],
  videoUrl: "",
  images: [],
  thumbnail: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  seoNoIndex: false,
  seoCanonical: "",
};

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
}

function InputField({ value, onChange, required, type = "text", placeholder, name }: {
  value: string | number;
  onChange: (name: string, value: string | number | boolean) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  name: string;
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={(e) => onChange(name, type === "number" ? Number(e.target.value) : e.target.value)}
      required={required}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
    />
  );
}

function TextareaField({ value, onChange, required, rows, maxLength, name, placeholder }: {
  value: string;
  onChange: (name: string, value: string) => void;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  name: string;
  placeholder?: string;
}) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      rows={rows}
      maxLength={maxLength}
      required={required}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
    />
  );
}

export default function ProdukAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSeo, setShowSeo] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  }

  function handleChange(name: string, value: string | number | boolean) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSpecificationChange(index: number, field: "label" | "value", value: string) {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      ),
    }));
  }

  function addSpecification() {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { label: "", value: "" }],
    }));
  }

  function removeSpecification(index: number) {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  }

  function handleCertificationsChange(value: string) {
    const certs = value.split(",").map((c) => c.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, certifications: certs }));
  }

  function handleImageChange(index: number, value: string) {
    setFormData((prev) => {
      const newImages = [...prev.images];
      newImages[index] = value;
      while (newImages.length < 3) newImages.push("");
      return { ...prev, images: newImages };
    });
  }

  function addImageField() {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  }

  function openNewForm() {
    setFormData(initialFormData);
    setEditingId(null);
    setShowForm(true);
    setShowSeo(false);
  }

  function openEditForm(product: Product) {
    setFormData({
      name: product.name || "",
      slug: product.slug || "",
      description: product.description || "",
      shortDescription: product.shortDescription || "",
      capacity: product.capacity || "",
      capacityValue: product.capacityValue || 1,
      power: product.power || "",
      price: product.price || 0,
      priceDisplay: product.priceDisplay || "",
      material: product.material || "",
      warranty: product.warranty || "",
      stock: (product.stock as string) || "tersedia",
      category: (product.category as string) || "kecil",
      isActive: product.isActive ?? true,
      isFeatured: product.isFeatured ?? false,
      specifications: product.specifications?.length ? product.specifications : [{ label: "", value: "" }],
      certifications: product.certifications || [],
      videoUrl: product.videoUrl || "",
      images: product.images?.length ? product.images : [],
      thumbnail: product.thumbnail || "",
      seoTitle: product.seoTitle || "",
      seoDescription: product.seoDescription || "",
      seoKeywords: (product.seoKeywords || []).join(", "),
      seoNoIndex: product.seoNoIndex || false,
      seoCanonical: product.seoCanonical || "",
    });
    setEditingId(product.id);
    setShowForm(true);
    setShowSeo(false);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialFormData);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const thumbnailFromGallery = formData.images[0] || "";

      const submitData: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
        ...formData,
        thumbnail: thumbnailFromGallery,
        seoKeywords: formData.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean),
      } as Omit<Product, "id" | "createdAt" | "updatedAt">;

      if (editingId) {
        await updateProduct(editingId, submitData);
        alert("Produk berhasil diupdate!");
      } else {
        await createProduct(submitData);
        alert("Produk berhasil ditambahkan!");
      }

      closeForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Gagal menyimpan produk. Silakan coba lagi.");
    }

    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      await deleteProduct(id);
      alert("Produk berhasil dihapus!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Gagal menghapus produk.");
    }
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
        <h2 className="text-2xl font-bold text-gray-900">Manajemen Produk</h2>
        <Button variant="primary" onClick={openNewForm}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Produk
        </Button>
      </div>

      {showForm && (
        <Card className="max-w-4xl">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? "Edit Produk" : "Tambah Produk Baru"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nama Produk</Label>
                  <InputField name="name" value={formData.name} onChange={handleChange} required placeholder="Mesin Es Kristal 1 Ton" />
                </div>
                <div>
                  <Label>Slug</Label>
                  <InputField name="slug" value={formData.slug} onChange={handleChange} required placeholder="mesin-es-kristal-1-ton" />
                </div>
                <div>
                  <Label>Harga (angka)</Label>
                  <InputField name="price" value={formData.price} onChange={handleChange} required type="number" />
                </div>
                <div>
                  <Label>Harga Tampil</Label>
                  <InputField name="priceDisplay" value={formData.priceDisplay} onChange={handleChange} required placeholder="Rp 50.000.000" />
                </div>
                <div>
                  <Label>Kapasitas Value</Label>
                  <InputField name="capacityValue" value={formData.capacityValue} onChange={handleChange} required type="number" />
                </div>
                <div>
                  <Label>Kapasitas Text</Label>
                  <InputField name="capacity" value={formData.capacity} onChange={handleChange} required placeholder="1 Ton/Hari" />
                </div>
                <div>
                  <Label>Daya Listrik</Label>
                  <InputField name="power" value={formData.power} onChange={handleChange} placeholder="18.5 kW" />
                </div>
                <div>
                  <Label>Kategori</Label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="kecil">Kecil (1 Ton)</option>
                    <option value="menengah">Menengah (3 Ton)</option>
                    <option value="besar">Besar (5 Ton)</option>
                  </select>
                </div>
                <div>
                  <Label>Stok</Label>
                  <select
                    name="stock"
                    value={formData.stock}
                    onChange={(e) => handleChange("stock", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="tersedia">Tersedia</option>
                    <option value="indent">Indent</option>
                    <option value="habis">Habis</option>
                  </select>
                </div>
                <div>
                  <Label>Material</Label>
                  <InputField name="material" value={formData.material} onChange={handleChange} required placeholder="Stainless Steel 304" />
                </div>
                <div>
                  <Label>Garansi</Label>
                  <InputField name="warranty" value={formData.warranty} onChange={handleChange} required placeholder="1 Tahun (Kompresor) / 6 Bulan (Sparepart)" />
                </div>
              </div>

              <div>
                <Label>Deskripsi</Label>
                <TextareaField name="description" value={formData.description} onChange={handleChange} required rows={3} />
              </div>

              <div>
                <Label>Deskripsi Singkat (max 150)</Label>
                <TextareaField name="shortDescription" value={formData.shortDescription} onChange={handleChange} required rows={2} maxLength={150} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Video YouTube ID</Label>
                  <InputField name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="dQw4w9WgXcQ" />
                </div>
                <div>
                  <Label>Thumbnail (gambar pertama galeri)</Label>
                  <p className="text-xs text-gray-500 mt-1">Gambar utama akan diambil dari gambar pertama galeri di atas</p>
                </div>
              </div>

              <div>
                <ImageUpload
                  images={formData.images}
                  onChange={(images) => setFormData((prev) => ({ ...prev, images }))}
                  maxImages={8}
                  productSlug={formData.slug || "produk"}
                  label="Gambar Produk"
                  required
                />
              </div>

              <div>
                <Label>Spesifikasi</Label>
                <div className="space-y-2">
                  {formData.specifications.map((spec, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <input
                        type="text"
                        value={spec.label}
                        onChange={(e) => handleSpecificationChange(i, "label", e.target.value)}
                        placeholder="Label (cth: Daya Listrik)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleSpecificationChange(i, "value", e.target.value)}
                        placeholder="Value (cth: 2200 Watt)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                      {formData.specifications.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeSpecification(i)} className="mt-1 text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {formData.specifications.length < 6 && (
                    <Button type="button" variant="outline" size="sm" onClick={addSpecification}>
                      <Plus className="w-4 h-4 mr-1" /> Tambah Spec
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <Label>Sertifikasi (pisahkan dengan koma)</Label>
                <input
                  name="certifications"
                  value={formData.certifications.join(", ")}
                  onChange={(e) => handleCertificationsChange(e.target.value)}
                  placeholder="SNI, ISO 9001, Food Grade"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={(e) => handleChange("isActive", e.target.checked)} className="w-4 h-4 text-primary rounded" />
                  <span className="text-sm">Aktif</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={(e) => handleChange("isFeatured", e.target.checked)} className="w-4 h-4 text-primary rounded" />
                  <span className="text-sm">Produk Unggulan</span>
                </label>
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button type="button" onClick={() => setShowSeo(!showSeo)} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-t-lg">
                  <span className="font-medium text-gray-900">Pengaturan SEO (Opsional)</span>
                  {showSeo ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {showSeo && (
                  <div className="p-4 space-y-4">
                    <p className="text-sm text-gray-500">Kosongkan field di bawah untuk menggunakan nilai otomatis dari data produk.</p>
                    <div>
                      <Label>SEO Title (max 60 karakter)</Label>
                      <InputField name="seoTitle" value={formData.seoTitle} onChange={handleChange} placeholder="Kosongkan untuk pakai nama produk" />
                    </div>
                    <div>
                      <Label>SEO Description (max 160 karakter)</Label>
                      <TextareaField name="seoDescription" value={formData.seoDescription} onChange={handleChange} rows={2} maxLength={160} placeholder="Kosongkan untuk pakai deskripsi singkat" />
                    </div>
                    <div>
                      <Label>Keywords (pisahkan dengan koma)</Label>
                      <InputField name="seoKeywords" value={formData.seoKeywords} onChange={handleChange} placeholder="mesin es, es kristal, ice maker" />
                    </div>
                    <div>
                      <Label>Canonical URL</Label>
                      <InputField name="seoCanonical" value={formData.seoCanonical} onChange={handleChange} placeholder="https://mesineskristal.com/produk/slug" />
                    </div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" name="seoNoIndex" checked={formData.seoNoIndex} onChange={(e) => handleChange("seoNoIndex", e.target.checked)} className="w-4 h-4 text-primary rounded" />
                      <span className="text-sm">Sembunyikan dari Google (No Index)</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? "Menyimpan..." : editingId ? "Update Produk" : "Simpan Produk"}
                </Button>
                <Button type="button" variant="outline" onClick={closeForm}>
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daftar Produk ({products.length})</h3>
          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada produk. Tambahkan produk pertama Anda!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Nama</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Kategori</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Harga</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Stok</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.slug}</div>
                      </td>
                      <td className="py-3 px-2">
                        <Badge className={product.category === "kecil" ? "bg-blue-100 text-blue-800" : product.category === "menengah" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                          {product.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-sm">{product.priceDisplay}</td>
                      <td className="py-3 px-2">
                        <Badge className={product.stock === "tersedia" ? "bg-green-100 text-green-800" : product.stock === "indent" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                          {product.stock}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        {product.isActive ? (
                          <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Nonaktif</Badge>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditForm(product)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}