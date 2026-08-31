export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function extractYouTubeId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function calculateROI(inputs: {
  capacityKg: number;
  pricePerKg: number;
  electricityRate: number;
  electricityKwh: number;
  waterRate: number;
  waterM3: number;
  machinePrice: number;
  dailyOperationalCost?: number;
}) {
  const dailyRevenue = inputs.capacityKg * inputs.pricePerKg;
  const dailyElectricity = inputs.electricityKwh * inputs.electricityRate;
  const dailyWater = inputs.waterM3 * inputs.waterRate;
  const dailyOther = dailyRevenue * 0.1;
  const dailyOperational = inputs.dailyOperationalCost || 0;
  const dailyCost = dailyElectricity + dailyWater + dailyOther + dailyOperational;
  const dailyProfit = dailyRevenue - dailyCost;
  const monthlyProfit = dailyProfit * 30;
  const rawPayback = monthlyProfit > 0 ? inputs.machinePrice / monthlyProfit : Infinity;

  return {
    dailyRevenue,
    dailyElectricity,
    dailyWater,
    dailyOther,
    dailyOperational,
    dailyCost,
    dailyProfit,
    monthlyProfit,
    monthlyRevenue: dailyRevenue * 30,
    monthlyOther: dailyOther * 30,
    monthlyOperational: dailyOperational * 30,
    monthlyElectricity: dailyElectricity * 30,
    monthlyWater: dailyWater * 30,
    monthlyCost: dailyCost * 30,
    paybackMonthsNumber: rawPayback,
    paybackMonths: formatPayback(rawPayback),
  };
}

export function formatPayback(months: number): string {
  if (!isFinite(months) || months <= 0) return "N/A";
  const rounded = Math.ceil(months);
  if (rounded < 12) return `${rounded} bulan`;
  const years = Math.floor(rounded / 12);
  const rem = rounded % 12;
  if (rem === 0) return `${years} tahun`;
  return `${years} tahun ${rem} bulan`;
}

export interface RoiScenarioInfo {
  id: string;
  name: string;
  createdAt: string;
  inputs: {
    capacityKg: number;
    pricePerKg: number;
    electricityRate: number;
    electricityKwh: number;
    waterRate: number;
    waterM3: number;
    machinePrice: number;
    dailyOperationalCost?: number;
  };
  result: ReturnType<typeof calculateROI>;
}

const ROI_SCENARIOS_KEY = "roi_scenarios_v1";
const ROI_SCENARIO_MAX = 5;

function generateShortId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function saveRoiScenario(scenario: Omit<RoiScenarioInfo, "id" | "createdAt">): RoiScenarioInfo {
  const saved: RoiScenarioInfo = {
    ...scenario,
    id: generateShortId(),
    createdAt: new Date().toISOString(),
  };
  if (typeof window === "undefined") return saved;
  const next = [saved, ...loadRoiScenarios()].slice(0, ROI_SCENARIO_MAX);
  try {
    localStorage.setItem(ROI_SCENARIOS_KEY, JSON.stringify(next));
  } catch {
    /* localStorage unavailable */
  }
  return saved;
}

export function loadRoiScenarios(): RoiScenarioInfo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ROI_SCENARIOS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RoiScenarioInfo[]) : [];
  } catch {
    return [];
  }
}

export function deleteRoiScenario(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const next = loadRoiScenarios().filter((s) => s.id !== id);
    localStorage.setItem(ROI_SCENARIOS_KEY, JSON.stringify(next));
  } catch {
    /* localStorage unavailable */
  }
}

export function buildRoiWhatsAppMessage(
  inputs: RoiScenarioInfo["inputs"],
  result: RoiScenarioInfo["result"]
): string {
  const line = "━━━━━━━━━━━━━━━━━━━━";
  return [
    "❄️ *SIMULASI ROI MESIN ES KRISTAL* ❄️",
    line,
    `📦 Kapasitas: *${inputs.capacityKg} kg/hari*`,
    `💵 Harga mesin: *${formatCurrency(inputs.machinePrice)}*`,
    line,
    "",
    `💡 Pendapatan/hari: ${formatCurrency(result.dailyRevenue)}`,
    `⚡ Biaya listrik: -${formatCurrency(result.dailyElectricity)}`,
    `💧 Biaya air: -${formatCurrency(result.dailyWater)}`,
    `🧰 Biaya lain² (10%): -${formatCurrency(result.dailyOther)}`,
    `🏭 Ops. tambahan: -${formatCurrency(result.dailyOperational)}`,
    `➖ Total biaya/hari: -${formatCurrency(result.dailyCost)}`,
    "",
    `🟢 *Profit Bersih/hari:* ${formatCurrency(result.dailyProfit)}`,
    `🟢 *Profit Bersih/bulan:* ${formatCurrency(result.monthlyProfit)}`,
    `⏱️ *Estimasi Balik Modal:* ${result.paybackMonths}`,
    line,
    "📲 Dihitung via *www.eskristalnusantara.com*",
    "",
    "*Mau konsultasi lebih lanjut?* Kirim pesan ini, tim kami siap bantu pilih mesin dan hitung ulang sesuai kondisi Anda.",
  ].join("\n");
}
