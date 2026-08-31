"use client";

import { useState } from "react";
import { Calculator, Info, Share2, Save } from "lucide-react";
import { formatCurrency, calculateROI, saveRoiScenario, loadRoiScenarios, buildRoiWhatsAppMessage } from "@/lib/utils";
import { ROIChart } from "@/components/public/roi-chart";
import { useContact } from "@/contexts/contact-context";
import { WHATSAPP_NUMBER } from "@/lib/constants";

interface ROICalculatorProps {
  capacityKg?: number;
  electricityKwh?: number;
  waterM3?: number;
  machinePrice?: number;
  pricePerKg?: number;
}

interface RoiInputs {
  capacityKg: number;
  pricePerKg: number;
  electricityRate: number;
  electricityKwh: number;
  waterRate: number;
  waterM3: number;
  machinePrice: number;
  dailyOperationalCost: number;
}

export function ROICalculator({
  capacityKg = 1000,
  electricityKwh = 2.2,
  waterM3 = 1.5,
  machinePrice = 50000000,
  pricePerKg = 3000,
}: ROICalculatorProps) {
  const { contact } = useContact();
  const [inputs, setInputs] = useState<RoiInputs>({
    capacityKg,
    pricePerKg,
    electricityRate: 1444,
    electricityKwh,
    waterRate: 5000,
    waterM3,
    machinePrice,
    dailyOperationalCost: 0,
  });
  const [saved, setSaved] = useState(false);

  const result = calculateROI(inputs);
  const waNumber = contact?.whatsappNumber || WHATSAPP_NUMBER;
  const waMessage = encodeURIComponent(buildRoiWhatsAppMessage(inputs, result));

  function handleChange(field: string, value: string) {
    const num = parseFloat(value) || 0;
    setInputs((prev) => ({ ...prev, [field]: num }));
  }

  function handleSaveScenario() {
    const name = `Skenario ${loadRoiScenarios().length + 1}`;
    saveRoiScenario({ name, inputs: { ...inputs }, result });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    window.dispatchEvent(new Event("roi-scenario-updated"));
  }

  function inputField(
    name: string,
    label: string,
    value: number,
    step?: string,
    helper?: string
  ) {
    return (
      <div>
        <label className="block text-xs text-gray-500 mb-1">{label}</label>
        <input
          type="number"
          step={step || "any"}
          value={value}
          onChange={(e) => handleChange(name, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {helper && <p className="text-xs text-gray-400 mt-1">{helper}</p>}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-gray-900">
          Simulasi Keuntungan Usaha
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Input</h3>

          {inputField("capacityKg", "Kapasitas Mesin (kg/hari)", inputs.capacityKg)}
          {inputField("pricePerKg", "Harga Jual Es (Rp/kg)", inputs.pricePerKg, "100")}
          {inputField("machinePrice", "Harga Mesin (Rp)", inputs.machinePrice, "1000000")}
          <div className="border-t border-gray-100 pt-4 space-y-4">
            {inputField("electricityRate", "Biaya Listrik (Rp/kWh)", inputs.electricityRate, "50")}
            {inputField("electricityKwh", "Konsumsi Listrik (kWh/hari)", inputs.electricityKwh, "0.1")}
            {inputField("waterRate", "Biaya Air (Rp/m3)", inputs.waterRate, "100")}
            {inputField("waterM3", "Konsumsi Air (m3/hari)", inputs.waterM3, "0.1")}
            {inputField(
              "dailyOperationalCost",
              "Biaya Operasional Tambahan (Rp/hari)",
              inputs.dailyOperationalCost,
              "10000",
              "Contoh: gaji karyawan, sewa tempat, kemasan, distribusi."
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Hasil Estimasi
          </h3>

          <div className="bg-primary/5 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pendapatan Harian</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(result.dailyRevenue)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Biaya Listrik</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(result.dailyElectricity)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Biaya Air</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(result.dailyWater)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Biaya Lain-lain (10%)</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(result.dailyOther)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Ops. Tambahan</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(result.dailyOperational)}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-3 flex justify-between text-sm">
              <span className="text-gray-600">Total Biaya Harian</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(result.dailyCost)}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="font-medium text-gray-900">Profit Bersih/Hari</span>
              <span className="font-bold text-green-600 text-lg">
                {formatCurrency(result.dailyProfit)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Profit Bulanan (30 hr)</span>
              <span className="font-bold text-green-600">
                {formatCurrency(result.monthlyProfit)}
              </span>
            </div>

            <div className="bg-green-100 rounded-lg p-3 mt-3 text-center">
              <p className="text-xs text-green-700 mb-1">Estimasi Balik Modal</p>
              <p className="text-2xl font-bold text-green-800">
                {result.paybackMonths}
              </p>
            </div>
          </div>

          <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4">
            <ROIChart result={result} />
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`https://wa.me/${waNumber}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold text-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Bagikan Hasil
            </a>
            <button
              onClick={handleSaveScenario}
              className="flex items-center justify-center gap-2 border border-gray-300 hover:border-primary text-gray-700 hover:text-primary px-4 py-3 rounded-lg font-semibold text-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              {saved ? "Tersimpan!" : "Simpan Skenario"}
            </button>
          </div>

          <div className="flex items-start gap-2 mt-4 text-xs text-gray-500">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <p>
              Estimasi dapat berbeda tergantung kondisi lapangan, tarif listrik/air
              di daerah Anda, dan biaya operasional aktual.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}