import type { Metadata } from "next";
import { ROICalculator } from "@/components/public/roi-calculator";
import { RoiScenarioCompare } from "@/components/public/roi-scenario-compare";
import { Breadcrumb } from "@/components/shared/breadcrumb";

export const metadata: Metadata = {
  title: "Simulasi ROI Mesin Es Kristal - Kalkulator Estimasi Keuntungan Usaha",
  description:
    "Hitung estimasi pendapatan, biaya operasional, keuntungan bersih, dan waktu balik modal usaha es batu kristal secara interaktif. Bandingkan hingga 5 skenario usaha.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function KalkulatorPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const num = (key: string, fallback: number): number => {
    const raw = sp[key];
    const val = Array.isArray(raw) ? raw[0] : raw;
    if (!val) return fallback;
    const n = Number(val);
    return Number.isFinite(n) ? n : fallback;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Simulasi ROI" },
          ]}
        />

        <div className="mt-6 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Simulasi ROI Mesin Es Kristal
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Hitung estimasi pendapatan, biaya operasional, keuntungan bersih, dan
            kapan modal usaha es batu kristal Anda kembali. Sesuaikan angka sesuai
            kondisi usaha Anda, lalu simpan beberapa skenario untuk dibandingkan.
          </p>
        </div>

        <div className="space-y-8">
          <ROICalculator
            capacityKg={num("capacity", 1000)}
            electricityKwh={num("electricityKwh", 2.2)}
            waterM3={num("waterM3", 1.5)}
            machinePrice={num("machinePrice", 50000000)}
            pricePerKg={num("pricePerKg", 3000)}
          />
          <RoiScenarioCompare />
        </div>

        <div className="mt-10 bg-primary/5 border border-primary/20 rounded-xl p-6 text-sm text-gray-600">
          <h2 className="font-bold text-gray-900 mb-2">Catatan Penting</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Biaya lain-lain dihitung 10% dari pendapatan harian.</li>
            <li>Proyeksi bulanan memakai asumsi 30 hari produksi.</li>
            <li>
              Angka ini merupakan estimasi edukasi; hasil nyata bergantung lokasi,
              tarif listrik/air, dan permintaan pasar.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}