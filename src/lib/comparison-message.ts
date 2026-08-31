import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { SITE_URL } from "@/lib/constants";

const line = "━━━━━━━━━━━━━━━━━━━━";

export function buildComparisonWhatsAppMessage(products: Product[]): string {
  const header = ["⚖️ *PERBANDINGAN MESIN ES KRISTAL* ⚖️", line];

  const body = products.flatMap((product, index) => [
    `${index + 1}. *${product.name}*`,
    `   💰 Harga: ${product.priceDisplay || formatCurrency(product.price)}`,
    `   📦 Kapasitas: ${product.capacity}`,
    ...(product.power ? [`   ⚡ Daya: ${product.power}`] : []),
    ...(product.warranty ? [`   🛡️ Garansi: ${product.warranty}`] : []),
    ...(product.material ? [`   🧊 Bahan: ${product.material}`] : []),
    `   🔗 ${SITE_URL}/produk/${product.slug}`,
    "",
  ]);

  const footer = [
    line,
    "Mau bantuan memilih mesin yang tepat? Kirim pesan ini, tim kami siap konsultasi.",
  ];

  return [...header, ...body, ...footer].join("\n");
}