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
}) {
  const dailyRevenue = inputs.capacityKg * inputs.pricePerKg;
  const dailyElectricity = inputs.electricityKwh * inputs.electricityRate;
  const dailyWater = inputs.waterM3 * inputs.waterRate;
  const dailyOther = dailyRevenue * 0.1;
  const dailyCost = dailyElectricity + dailyWater + dailyOther;
  const dailyProfit = dailyRevenue - dailyCost;
  const monthlyProfit = dailyProfit * 30;
  const paybackMonths = monthlyProfit > 0 ? Math.ceil(inputs.machinePrice / monthlyProfit) : Infinity;

  return {
    dailyRevenue,
    dailyElectricity,
    dailyWater,
    dailyOther,
    dailyCost,
    dailyProfit,
    monthlyProfit,
    paybackMonths: paybackMonths === Infinity ? "N/A" : `${paybackMonths} bulan`,
  };
}
