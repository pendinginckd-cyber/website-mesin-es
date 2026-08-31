import { calculateROI } from "@/lib/utils";

function compactRupiah(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    const formatted = (value / 1_000_000).toFixed(Math.abs(value) >= 10_000_000 ? 0 : 1);
    return `Rp ${formatted.replace(".", ",")} jt`;
  }
  if (Math.abs(value) >= 1_000) {
    return `Rp ${Math.round(value / 1_000).toLocaleString("id-ID")} rb`;
  }
  return `Rp ${Math.round(value)}`;
}

export function ROIChart({ result }: { result: ReturnType<typeof calculateROI> }) {
  const items = [
    { label: "Pendapatan", value: result.monthlyRevenue, color: "#3b82f6" },
    { label: "Listrik", value: result.monthlyElectricity, color: "#f59e0b" },
    { label: "Air", value: result.monthlyWater, color: "#06b6d4" },
    { label: "Lain-lain", value: result.monthlyOther, color: "#f97316" },
    { label: "Ops. Tamb.", value: result.monthlyOperational, color: "#ef4444" },
    { label: "Profit", value: result.monthlyProfit, color: "#22c55e" },
  ].filter((item) => item.value > 0);

  const max = Math.max(...items.map((item) => item.value), 1);

  const chartTop = 24;
  const chartBottom = 230;
  const chartHeight = chartBottom - chartTop;
  const left = 8;
  const right = 8;
  const chartWidth = 600 - left - right;
  const groupWidth = chartWidth / Math.max(items.length, 1);
  const barWidth = Math.min(groupWidth * 0.55, 56);

  const revenue = result.monthlyRevenue;
  const cost = result.monthlyCost;
  const profit = result.monthlyProfit;
  const costRatio = revenue > 0 ? Math.min(cost / revenue, 1) : 1;
  const profitRatio = revenue > 0 && profit > 0 ? Math.min(profit / revenue, 1 - costRatio) : 0;

  return (
    <div className="w-full">
      {/* Split bar: revenue vs cost vs profit */}
      {revenue > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Pendapatan Bulanan</span>
            <span className="font-medium text-gray-900">{compactRupiah(revenue)}</span>
          </div>
          <div className="flex h-6 w-full rounded-lg overflow-hidden border border-gray-200">
            <div
              className="bg-red-500"
              style={{ width: `${Math.max(costRatio * 100, 0)}%` }}
              title={`Total biaya: ${compactRupiah(cost)}`}
            />
            <div
              className="bg-green-500"
              style={{ width: `${profitRatio * 100}%` }}
              title={`Profit: ${compactRupiah(profit)}`}
            />
          </div>
          <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 bg-red-500 rounded-sm" />
              Biaya ({compactRupiah(cost)})
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-sm" />
              Profit ({compactRupiah(profit)})
            </span>
          </div>
        </div>
      )}

      {/* Bar chart */}
      <svg viewBox="0 0 600 260" className="w-full h-auto" role="img" aria-label="Grafik perbandingan pendapatan dan biaya bulanan">
        <line x1={left} y1={chartBottom} x2={600 - right} y2={chartBottom} stroke="#e5e7eb" strokeWidth={1} />
        {items.map((item, idx) => {
          const x = left + idx * groupWidth + (groupWidth - barWidth) / 2;
          const barHeight = Math.max((item.value / max) * chartHeight, 2);
          const y = chartBottom - barHeight;
          const textY = y > chartTop + 14 ? y - 6 : chartTop + 14;
          return (
            <g key={item.label}>
              <title>{`${item.label}: ${compactRupiah(item.value)}`}</title>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={3}
                fill={item.color}
              />
              <text
                x={x + barWidth / 2}
                y={textY}
                textAnchor="middle"
                fontSize="9"
                fill="#6b7280"
              >
                {compactRupiah(item.value)}
              </text>
              <text
                x={x + barWidth / 2}
                y={chartBottom + 16}
                textAnchor="middle"
                fontSize="10"
                fill="#374151"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="text-xs text-gray-400 mt-1">Proyeksi bulanan (30 hari) dari input yang dimasukkan.</p>
    </div>
  );
}