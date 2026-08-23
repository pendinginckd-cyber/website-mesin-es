"use client";

import { useState } from "react";
import { Calculator, Info } from "lucide-react";
import { formatCurrency, calculateROI } from "@/lib/utils";

interface ROICalculatorProps {
  capacityKg?: number;
  electricityKwh?: number;
  waterM3?: number;
  machinePrice?: number;
}

export function ROICalculator({
  capacityKg = 1000,
  electricityKwh = 2.2,
  waterM3 = 1.5,
  machinePrice = 50000000,
}: ROICalculatorProps) {
  const [inputs, setInputs] = useState({
    capacityKg,
    pricePerKg: 3000,
    electricityRate: 1444,
    electricityKwh,
    waterRate: 5000,
    waterM3,
    machinePrice,
  });

  const result = calculateROI(inputs);

  function handleChange(field: string, value: string) {
    const num = parseFloat(value) || 0;
    setInputs((prev) => ({ ...prev, [field]: num }));
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-gray-900">
          Simulasi Keuntungan Usaha
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Input</h4>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Kapasitas Mesin (kg/hari)
            </label>
            <input
              type="number"
              value={inputs.capacityKg}
              onChange={(e) => handleChange("capacityKg", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Harga Jual Es (Rp/kg)
            </label>
            <input
              type="number"
              value={inputs.pricePerKg}
              onChange={(e) => handleChange("pricePerKg", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Biaya Listrik (Rp/kWh)
            </label>
            <input
              type="number"
              value={inputs.electricityRate}
              onChange={(e) => handleChange("electricityRate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Konsumsi Listrik (kWh)
            </label>
            <input
              type="number"
              value={inputs.electricityKwh}
              onChange={(e) => handleChange("electricityKwh", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Biaya Air (Rp/m3)
            </label>
            <input
              type="number"
              value={inputs.waterRate}
              onChange={(e) => handleChange("waterRate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Konsumsi Air (m3/hari)
            </label>
            <input
              type="number"
              value={inputs.waterM3}
              onChange={(e) => handleChange("waterM3", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">
            Hasil Estimasi
          </h4>

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
              <span className="text-gray-600">Profit Bulanan</span>
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

          <div className="flex items-start gap-2 mt-4 text-xs text-gray-500">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <p>
              Estimasi dapat berbeda tergantung kondisi lapangan dan lokasi usaha.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
