"use client";

import { useSyncExternalStore } from "react";
import { Trash2, Share2, BarChart3 } from "lucide-react";
import {
  loadRoiScenarios,
  deleteRoiScenario,
  buildRoiWhatsAppMessage,
  formatCurrency,
  type RoiScenarioInfo,
} from "@/lib/utils";
import { useContact } from "@/contexts/contact-context";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const ROI_SCENARIOS_KEY = "roi_scenarios_v1";

let scenariosCache: RoiScenarioInfo[] | null = null;
const listeners = new Set<() => void>();

function refreshScenarios() {
  scenariosCache = loadRoiScenarios();
  listeners.forEach((cb) => cb());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("roi-scenario-updated", refreshScenarios);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("roi-scenario-updated", refreshScenarios);
  };
}

function getSnapshot(): RoiScenarioInfo[] {
  if (scenariosCache === null) scenariosCache = loadRoiScenarios();
  return scenariosCache;
}

const EMPTY_SCENARIOS: RoiScenarioInfo[] = [];

function getServerSnapshot(): RoiScenarioInfo[] {
  return EMPTY_SCENARIOS;
}

export function RoiScenarioCompare() {
  const { contact } = useContact();
  const waNumber = contact?.whatsappNumber || WHATSAPP_NUMBER;
  const scenarios = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function handleDelete(id: string) {
    deleteRoiScenario(id);
    refreshScenarios();
  }

  function handleClearAll() {
    localStorage.removeItem(ROI_SCENARIOS_KEY);
    refreshScenarios();
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">
            Perbandingan Skenario
          </h3>
        </div>
        {scenarios.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-gray-500 hover:text-red-600 transition-colors"
          >
            Hapus Semua
          </button>
        )}
      </div>

      {scenarios.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-gray-500 text-sm">
            Belum ada skenario tersimpan. Simpan dari kalkulator di atas untuk
            membandingkan 2-3 skenario usaha (maksimal 5 tersimpan di browser).
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-500">Skenario</th>
                <th className="text-right py-2 px-2 font-medium text-gray-500">Kapasitas</th>
                <th className="text-right py-2 px-2 font-medium text-gray-500">Harga Mesin</th>
                <th className="text-right py-2 px-2 font-medium text-gray-500">Profit/Hari</th>
                <th className="text-right py-2 px-2 font-medium text-gray-500">Profit/Bulan</th>
                <th className="text-right py-2 px-2 font-medium text-gray-500">Balik Modal</th>
                <th className="text-right py-2 pl-2 font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((scenario) => (
                <tr key={scenario.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 pr-4 font-medium text-gray-900">{scenario.name}</td>
                  <td className="py-3 px-2 text-right" title={`Harga jual Rp/kg: ${scenario.inputs.pricePerKg}`}>
                    {scenario.inputs.capacityKg} kg/hari
                  </td>
                  <td className="py-3 px-2 text-right">{formatCurrency(scenario.inputs.machinePrice)}</td>
                  <td className="py-3 px-2 text-right font-semibold text-green-600">
                    {formatCurrency(scenario.result.dailyProfit)}
                  </td>
                  <td className="py-3 px-2 text-right font-semibold text-green-600">
                    {formatCurrency(scenario.result.monthlyProfit)}
                  </td>
                  <td className="py-3 px-2 text-right">{scenario.result.paybackMonths}</td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`https://wa.me/${waNumber}?text=${encodeURIComponent(buildRoiWhatsAppMessage(scenario.inputs, scenario.result))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
                        title="Bagikan via WhatsApp"
                      >
                        <Share2 className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(scenario.id)}
                        className="p-1.5 hover:bg-red-100 rounded-lg text-red-500 transition-colors"
                        title="Hapus skenario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}