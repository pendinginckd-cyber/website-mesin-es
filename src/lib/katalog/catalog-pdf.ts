import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/lib/constants";

export interface KatalogPdfOptions {
  siteName: string;
  siteUrl: string;
  whatsappNumber?: string;
  email?: string;
  address?: string;
}

const PRIMARY: [number, number, number] = [2, 132, 199];
const ACCENT: [number, number, number] = [249, 115, 22];
const GRAY: [number, number, number] = [107, 114, 128];
const DARK: [number, number, number] = [15, 23, 42];
const LIGHT_BLUE: [number, number, number] = [224, 242, 254];
const ALT_ROW: [number, number, number] = [248, 250, 252];

const CATEGORY_LABELS: Record<string, string> = {
  kecil: "Mesin Kapasitas Kecil",
  menengah: "Mesin Kapasitas Menengah",
  besar: "Mesin Kapasitas Besar",
};

async function loadImageDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    if (!blob.type.startsWith("image/")) return null;
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("read error"));
      reader.readAsDataURL(blob);
    });
    return dataUrl;
  } catch {
    return null;
  }
}

function imageFormat(dataUrl: string): "PNG" | "JPEG" | "WEBP" {
  if (dataUrl.startsWith("data:image/png")) return "PNG";
  if (dataUrl.startsWith("data:image/webp")) return "WEBP";
  return "JPEG";
}

function groupProducts(products: Product[]) {
  return PRODUCT_CATEGORIES.map((category) => ({
    category,
    label: CATEGORY_LABELS[category] ?? category,
    items: products
      .filter((p) => p.category === category)
      .sort(
        (a, b) =>
          a.capacityValue - b.capacityValue ||
          a.price - b.price ||
          a.name.localeCompare(b.name)
      ),
  })).filter((group) => group.items.length > 0);
}

export async function buildKatalogPdf(
  products: Product[],
  options: KatalogPdfOptions
): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 30;
  const contentWidth = pageWidth - margin * 2;

  // Preload thumbnail → dataUrl (di-skip bila fetch gagal / CORS)
  const images = new Map<string, string | null>();
  await Promise.all(
    products
      .filter((p) => p.thumbnail)
      .map(async (p) => {
        images.set(p.id, await loadImageDataUrl(p.thumbnail));
      })
  );

  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  // Header branding
  doc.setFillColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
  doc.rect(0, 0, pageWidth, 108, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text(options.siteName.toUpperCase(), margin, 46);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(224, 242, 254);
  doc.text("Katalog Produk & Brosur Mesin Es Kristal", margin, 68);
  doc.setFontSize(11);
  doc.text(`Diperbarui: ${dateLabel}`, margin, 88);
  doc.setFillColor(ACCENT[0], ACCENT[1], ACCENT[2]);
  doc.rect(margin, 100, 130, 4, "F");

  let y = 132;

  // Intro
  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2]);
  doc.setFontSize(11);
  const intro = `${products.length} mesin es kristal berkualitas (kapasitas kecil, menengah, dan besar) dengan garansi resmi, suku cadang lengkap, dan hemat listrik. Harga bisa berubah sewaktu-waktu — konsultasikan kebutuhan Anda dengan tim kami.`;
  const introLines = doc.splitTextToSize(intro, contentWidth);
  doc.text(introLines, margin, y);
  y += introLines.length * 14 + 10;

  // Contact block
  const contactLines: string[] = [];
  if (options.whatsappNumber) contactLines.push(`WhatsApp/Telepon: +${options.whatsappNumber}`);
  if (options.email) contactLines.push(`Email: ${options.email}`);
  if (options.address) contactLines.push(`Alamat: ${options.address}`);
  contactLines.push(`Website: ${options.siteUrl}`);
  doc.setFontSize(9);
  doc.setTextColor(DARK[0], DARK[1], DARK[2]);
  doc.text(contactLines, margin, y);
  y += contactLines.length * 12 + 6;

  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  const groups = groupProducts(products);
  let startY = y;

  groups.forEach((group, groupIndex) => {
    if (startY > pageHeight - 110) {
      doc.addPage();
      startY = 50;
    }
    if (groupIndex > 0) startY += 10;

    // Category heading
    doc.setFillColor(LIGHT_BLUE[0], LIGHT_BLUE[1], LIGHT_BLUE[2]);
    doc.rect(margin, startY, contentWidth, 26, "F");
    doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(group.label, margin + 8, startY + 17);
    startY += 34;

    autoTable(doc, {
      startY,
      margin: { left: margin, right: margin },
      head: [["", "Mesin", "Kapasitas", "Daya", "Garansi", "Stok", "Harga"]],
      body: group.items.map((p) => [
        p.thumbnail || "",
        p.name,
        p.capacity || "-",
        p.power || "-",
        p.warranty || "-",
        p.stock || "-",
        p.priceDisplay || formatCurrency(p.price),
      ]),
      theme: "grid",
      styles: { fontSize: 8.5, cellPadding: 4, halign: "left", valign: "middle", overflow: "linebreak" },
      headStyles: { fillColor: PRIMARY, textColor: 255, fontStyle: "bold", halign: "left" },
      alternateRowStyles: { fillColor: ALT_ROW },
      columnStyles: {
        0: { cellWidth: 44, halign: "center" },
        1: { cellWidth: 158, fontStyle: "bold", textColor: DARK },
        2: { cellWidth: 84 },
        3: { cellWidth: 66 },
        4: { cellWidth: 66 },
        5: { cellWidth: 46 },
        6: { cellWidth: 95, fontStyle: "bold", textColor: PRIMARY, halign: "right" },
      },
      didDrawCell: (data) => {
        if (data.column.index !== 0) return;
        const product = group.items[data.row.index - 1];
        if (!product) return;
        const dataUrl = images.get(product.id);
        if (!dataUrl) return;
        try {
          const img = doc.getImageProperties(dataUrl);
          const w = 34;
          const h = Math.min(w * (img.height / img.width), 30);
          const cx = data.cell.x + (data.cell.width - w) / 2;
          const cy = data.cell.y + (data.cell.height - h) / 2;
          doc.addImage(dataUrl, imageFormat(dataUrl), cx, cy, w, h);
        } catch {
          /* skip gambar yang tidak bisa digambar */
        }
      },
    });

    startY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;
  });

  // Footer nomor halaman
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(GRAY[0], GRAY[1], GRAY[2]);
    doc.text(
      `Halaman ${i} dari ${pageCount}`,
      pageWidth / 2,
      pageHeight - 16,
      { align: "center" }
    );
    doc.text(options.siteUrl, margin, pageHeight - 16);
  }

  return doc;
}

export function downloadKatalogPdf(products: Product[], options: KatalogPdfOptions) {
  return buildKatalogPdf(products, options).then((doc) => {
    doc.save("Katalog-Mesin-Es-Kristal.pdf");
  });
}