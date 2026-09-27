'use client';

// ponytail: Pure SVG responsive Area Chart eliminating heavy apexcharts bundle.
import { useMemo, useState } from "react";
import { type DailyStatsProps } from "../../../analytics/stats";

export function RevenueAndProfitChart({ dailyStats }: { dailyStats?: DailyStatsProps }) {
  const [timeRange, setTimeRange] = useState<'Day' | 'Week' | 'Month'>('Day');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const profitData = [180, 240, 210, 320, 290, 380, 420];
  const revenueData = [240, 310, 280, 410, 380, 490, 560];

  const maxVal = Math.max(...revenueData, 600);

  // Generate SVG path points
  const width = 600;
  const height = 260;
  const padding = 20;

  const getPoints = (data: number[]) => {
    return data.map((val, idx) => {
      const x = padding + (idx / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - (val / maxVal) * (height - 2 * padding);
      return { x, y };
    });
  };

  const revenuePoints = useMemo(() => getPoints(revenueData), []);
  const profitPoints = useMemo(() => getPoints(profitData), []);

  const toSvgPath = (points: { x: number; y: number }[]) => {
    return points.reduce((acc, p, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  };

  const toAreaPath = (points: { x: number; y: number }[]) => {
    const line = toSvgPath(points);
    return `${line} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  };

  return (
    <div className="border-border bg-card shadow-default col-span-12 rounded-sm border p-5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap mb-6">
        <div className="flex w-full flex-wrap gap-5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <div>
              <p className="text-primary font-semibold text-sm">Total Profit</p>
              <p className="text-muted-foreground text-xs">Last 7 Days (₹2.14L)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-secondary" />
            <div>
              <p className="text-secondary font-semibold text-sm">Total Revenue</p>
              <p className="text-muted-foreground text-xs">Last 7 Days (₹2.85L)</p>
            </div>
          </div>
        </div>
        <div className="flex items-center bg-muted rounded-md p-1">
          {(['Day', 'Week', 'Month'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                timeRange === r
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64 overflow-visible">
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = height - padding - ratio * (height - 2 * padding);
            return (
              <line
                key={ratio}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Revenue Area & Line */}
          <path d={toAreaPath(revenuePoints)} fill="url(#revenueGrad)" />
          <path d={toSvgPath(revenuePoints)} fill="none" stroke="hsl(var(--secondary))" strokeWidth="2.5" />

          {/* Profit Area & Line */}
          <path d={toAreaPath(profitPoints)} fill="url(#profitGrad)" />
          <path d={toSvgPath(profitPoints)} fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" />

          {/* Data Points */}
          {revenuePoints.map((p, idx) => (
            <circle key={`rev-${idx}`} cx={p.x} cy={p.y} r="4" fill="hsl(var(--secondary))" />
          ))}
          {profitPoints.map((p, idx) => (
            <circle key={`prof-${idx}`} cx={p.x} cy={p.y} r="3.5" fill="hsl(var(--primary))" />
          ))}

          {/* X Axis Labels */}
          {revenuePoints.map((p, idx) => (
            <text
              key={`label-${idx}`}
              x={p.x}
              y={height - 2}
              textAnchor="middle"
              className="text-[11px] fill-muted-foreground font-mono"
            >
              {daysOfWeek[idx]}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
export default RevenueAndProfitChart;
