export interface QuickReply {
  label: string;
  message: string;
}

export const QUICK_REPLIES: QuickReply[] = [
  {
    label: "Info Produk",
    message:
      "Halo, saya ingin tahu info lengkap mesin es kristal (kapasitas, harga, spesifikasi).",
  },
  {
    label: "Nego Harga",
    message: "Halo, saya ingin tanya harga / nego untuk mesin es kristal.",
  },
  {
    label: "Konsultasi",
    message:
      "Halo, saya ingin konsultasi memilih mesin es kristal yang cocok untuk usaha saya.",
  },
  {
    label: "Minta Katalog",
    message: "Halo, boleh minta katalog / brosur produk mesin es kristal?",
  },
];

export function buildWhatsAppUrl(
  number: string,
  message: string
): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}