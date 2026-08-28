import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "./ChartCard";
import type { CategoryDatum } from "@/types/dashboard";
import { formatValue, type ValueFormat } from "@/utils/format";
import { chartPalette, chartTooltipStyle } from "./chart-theme";

export interface BarChartCardProps {
  title: string;
  description?: string;
  meta?: string;
  data: CategoryDatum[];
  /** "vertical" = barras horizontais. */
  orientation?: "horizontal" | "vertical";
  valueFormat?: ValueFormat;
  /** Usa uma cor por categoria (útil para rankings). */
  multicolor?: boolean;
  height?: number;
  className?: string;
}

export function BarChartCard({
  title,
  description,
  meta,
  data,
  orientation = "horizontal",
  valueFormat = "integer",
  multicolor = false,
  height = 280,
  className,
}: BarChartCardProps) {
  const isVertical = orientation === "vertical";
  const axisProps = {
    tick: { fontSize: 11, fill: "var(--color-muted-foreground)" },
    stroke: "var(--color-border)",
  };

  return (
    <ChartCard title={title} description={description} meta={meta} className={className}>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout={isVertical ? "vertical" : "horizontal"}
            margin={
              isVertical
                ? { top: 4, right: 24, bottom: 4, left: 8 }
                : { top: 8, right: 8, bottom: 4, left: 0 }
            }
            barCategoryGap={isVertical ? "22%" : "28%"}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              horizontal={!isVertical}
              vertical={isVertical}
            />
            <XAxis
              type={isVertical ? "number" : "category"}
              interval={0}
              height={isVertical ? 30 : 48}
              {...(isVertical
                ? { tickFormatter: (v: number) => formatValue(v, valueFormat) }
                : { dataKey: "label" })}
              {...axisProps}
            />
            <YAxis
              type={isVertical ? "category" : "number"}
              width={isVertical ? 140 : 56}
              {...(isVertical
                ? { dataKey: "label" }
                : { tickFormatter: (v: number) => formatValue(v, valueFormat) })}
              {...axisProps}
            />

            <Tooltip
              {...chartTooltipStyle}
              formatter={(value) => [formatValue(Number(value), valueFormat), "Total"]}
            />
            <Bar dataKey="value" radius={isVertical ? [0, 6, 6, 0] : [6, 6, 0, 0]}>
              {data.map((item, index) => (
                <Cell
                  key={item.label}
                  fill={multicolor ? chartPalette[index % chartPalette.length] : chartPalette[0]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
