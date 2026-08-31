import type { Specification } from "@/types/product";

export interface SpecFieldDef {
  label: string;
  placeholder: string;
}

export interface SpecCategoryDef {
  id: string;
  title: string;
  description: string;
  fields: SpecFieldDef[];
}

export const SPEC_CATEGORIES: SpecCategoryDef[] = [
  {
    id: "kapasitas",
    title: "Kapasitas & Performa",
    description: "Kapasitas Produksi Harian",
    fields: [
      {
        label: "Kapasitas Produksi Harian",
        placeholder: "cth: 500 kg / 24 jam, 1 Ton / 24 jam, 3 Ton / 24 jam",
      },
      {
        label: "Bentuk & Ukuran Es",
        placeholder: "cth: Tube Ø 28 mm (Hollow Center)",
      },
      {
        label: "Siklus Panen (Harvest Cycle)",
        placeholder: "cth: 20-25 menit per siklus",
      },
      {
        label: "Suhu Operasional Standar",
        placeholder: "cth: Input 20°C / Ambient 30°C",
      },
    ],
  },
  {
    id: "kelistrikan",
    title: "Sistem Kelistrikan",
    description: "Spesifikasi Kelistrikan",
    fields: [
      {
        label: "Tegangan & Fasa",
        placeholder: "cth: 220V 1-Phase 50Hz / 380V 3-Phase 50Hz",
      },
      {
        label: "Daya Listrik Total (Power Consumption)",
        placeholder: "cth: 4.5 kW / 6 HP",
      },
      {
        label: "Daya Motor Pemotong (Cutter Motor)",
        placeholder: "cth: 0.75 kW",
      },
      {
        label: "Daya Pompa Air (Water Pump)",
        placeholder: "cth: 0.5 kW",
      },
      {
        label: "Sistem Proteksi Listrik",
        placeholder: "cth: MCCB, MCB, Overload Relay, Phase & Voltage Failure Relay",
      },
    ],
  },
  {
    id: "refrigerasi",
    title: "Sistem Refrigerasi",
    description: "Sistem Refrigerasi & Pendingin",
    fields: [
      {
        label: "Kompresor",
        placeholder: "cth: Bitzer / Copeland / Maneurop (Semi-Hermetic / Scroll)",
      },
      {
        label: "Kapasitas Kompresor",
        placeholder: "cth: 5 HP, 10 HP, 15 HP",
      },
      {
        label: "Jenis Refrigeran (Freon)",
        placeholder: "cth: R404A / R22 / R134a",
      },
      {
        label: "Tipe Kondensor",
        placeholder: "cth: Air-Cooled / Water-Cooled (Cooling Tower)",
      },
      {
        label: "Tipe Evaporator",
        placeholder: "cth: Vertical Shell & Tube Evaporator",
      },
      {
        label: "Katup Ekspansi (Expansion Valve)",
        placeholder: "cth: Danfoss / Emerson",
      },
    ],
  },
  {
    id: "material",
    title: "Material & Konstruksi",
    description: "Material & Konstruksi",
    fields: [
      {
        label: "Material Pipa Cetakan (Evaporator Tube)",
        placeholder: "cth: Stainless Steel SUS 304L Food Grade",
      },
      {
        label: "Material Rangka Utama (Main Frame)",
        placeholder: "cth: Stainless Steel SUS 304 / Galvanized Anti-Korosi",
      },
      {
        label: "Material Pisau Pemotong (Cutter Blade)",
        placeholder: "cth: Stainless Steel SUS 304 tahan aus",
      },
      {
        label: "Material Tangki Air (Water Tank)",
        placeholder: "cth: Stainless Steel SUS 304",
      },
    ],
  },
  {
    id: "kontrol",
    title: "Kontrol & Otomasi",
    description: "Kontrol Sistem & Safety",
    fields: [
      {
        label: "Sistem Kontrol Utama",
        placeholder: "cth: Full Automatic PLC",
      },
      {
        label: "Interface Antarmuka",
        placeholder: "cth: Touchscreen HMI / Panel Tombol LED",
      },
      {
        label: "Tegangan Jalur Kontrol",
        placeholder: "cth: 24V DC Terisolasi",
      },
      {
        label: "Fitur Keamanan Otomatis",
        placeholder: "cth: High/Low Pressure Cut-off, Water Level Sensor, Ice Full Auto-Stop",
      },
    ],
  },
  {
    id: "dimensi",
    title: "Dimensi, Berat & Layanan",
    description: "Dimensi, Berat & Layanan Purna Jual",
    fields: [
      {
        label: "Dimensi Unit Utama (P x L x T)",
        placeholder: "cth: 1.500 x 1.000 x 1.800 mm",
      },
      {
        label: "Dimensi Kondensor / Cooling Tower",
        placeholder: "cth: 1.200 x 800 x 1.500 mm",
      },
      {
        label: "Berat Bersih (Net Weight)",
        placeholder: "cth: 800 kg",
      },
      {
        label: "Garansi & Layanan",
        placeholder: "cth: 12 Bulan (Sparepart & Service), QC Trial Run Test",
      },
    ],
  },
];

export function sortSpecificationsByCategory(
  specs: Specification[]
): Specification[] {
  const order = new Map(SPEC_CATEGORIES.map((c, i) => [c.id, i]));
  return [...specs].sort((a, b) => {
    const ai = order.has(a.category ?? "") ? order.get(a.category ?? "")! : -1;
    const bi = order.has(b.category ?? "") ? order.get(b.category ?? "")! : -1;
    return ai - bi;
  });
}

export function groupSpecificationsByCategory(
  specs: Specification[]
): { category: string; title: string; items: Specification[] }[] {
  const grouped = new Map<string, Specification[]>();
  for (const spec of specs) {
    if (!spec.category || !SPEC_CATEGORIES.some((c) => c.id === spec.category)) {
      continue;
    }
    if (!grouped.has(spec.category)) grouped.set(spec.category, []);
    grouped.get(spec.category)!.push(spec);
  }
  const result: { category: string; title: string; items: Specification[] }[] =
    [];
  for (const cat of SPEC_CATEGORIES) {
    if (grouped.has(cat.id)) {
      result.push({ category: cat.id, title: cat.title, items: grouped.get(cat.id)! });
    }
  }
  return result;
}
