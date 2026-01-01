import { useMemo } from "react";
import { format } from "date-fns";
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
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={chartData} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0F172A" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#0F172A" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#f1f5f9" strokeDasharray="4 4" vertical={false} />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => formatValue(value).replace(/\.00$/, "")}
          tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }}
          width={64}
        />
        <Tooltip
          cursor={{ stroke: "#94a3b8", strokeDasharray: "4 4" }}
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            const point = payload[0].payload as ChartPoint;
            return (
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <p className="text-[11px] font-semibold text-slate-500">{point.label}</p>
                <p className="text-base font-bold text-slate-900">{formatValue(point.value)}</p>
              </div>
            );
          }}
        />
        <Area
          dataKey="value"
          type="monotone"
          stroke="#0F172A"
          strokeWidth={2.5}
          fill="url(#revenueGradient)"
          dot={{ stroke: "#0F172A", strokeWidth: 2, r: 4, fill: "#fff" }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
