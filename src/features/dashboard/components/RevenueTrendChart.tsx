import { useMemo } from "react";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RevenueEntry } from "../../../types/dashboard.types";

interface RevenueTrendChartProps {
  data?: RevenueEntry[] | null;
  currencyFormatter?: (value: number) => string;
  title?: string;
  totalValue?: string;
}

interface ChartPoint {
  label: string;
  value: number;
}

const fallbackData: ChartPoint[] = [
  { label: "Week 1", value: 8200 },
  { label: "Week 2", value: 9700 },
  { label: "Week 3", value: 11300 },
  { label: "Week 4", value: 13800 },
  { label: "Week 5", value: 12500 },
];

const defaultFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
}).format;

export default function RevenueTrendChart({
  data,
  currencyFormatter,
  title = "Total Revenue",
  totalValue,
}: RevenueTrendChartProps) {
  const formatValue = currencyFormatter ?? defaultFormatter;

  const chartData = useMemo<ChartPoint[]>(() => {
    if (!data || data.length === 0) {
      return fallbackData;
    }

    return data.map((entry, index) => {
      const numericValue = typeof entry.amount === "string" ? Number(entry.amount) : entry.amount;
      const value = Number.isFinite(numericValue) ? Number(numericValue) : 0;
      const timestamp = entry.createdAt ? new Date(entry.createdAt) : null;
      const label = timestamp ? format(timestamp, "MMM d") : `Pt ${index + 1}`;

      return { label, value };
    });
  }, [data]);

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            {title} <span className="text-[10px] font-bold text-slate-400 ml-1">30 days</span>
          </h3>
          {totalValue && (
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{totalValue}</span>
            </div>
          )}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-100 bg-white text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
          30 days
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      <div className="flex-1 relative chart-gradient-bg rounded-2xl p-4">
        {(!data || data.length === 0) && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm border border-white/50">
              No data available
            </span>
          </div>
        )}
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F172A" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#0F172A" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} strokeOpacity={0.5} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => formatValue(value).replace(/\.00$/, "")}
              tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
              width={60}
            />
            <Tooltip
              cursor={{ stroke: "#94a3b8", strokeDasharray: "4 4" }}
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null;
                const point = payload[0].payload as ChartPoint;
                return (
                  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <p className="text-[10px] font-semibold text-slate-500">{point.label}</p>
                    <p className="text-sm font-bold text-slate-900">{formatValue(point.value)}</p>
                  </div>
                );
              }}
            />
            <Area
              dataKey="value"
              type="monotone"
              stroke="#0F172A"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              dot={{ stroke: "#0F172A", strokeWidth: 2, r: 3, fill: "#fff" }}
              activeDot={{ r: 4, strokeWidth: 0, fill: "#0F172A" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
