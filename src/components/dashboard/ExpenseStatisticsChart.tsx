import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ExpenseStatistics } from "@/types/dashboard";
import { formatValue } from "@/utils/format";
import { ChartCard } from "./ChartCard";
import { chartPalette, chartTooltipStyle } from "./chart-theme";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExpenseStatisticsChartProps {
  data: ExpenseStatistics[];
}

export function ExpenseStatisticsChart({ data }: ExpenseStatisticsChartProps) {
  const [selectedLabel, setSelectedLabel] = useState("");
  const selected = data.find((item) => item.label === selectedLabel) ?? data[0];

  return (
    <ChartCard
      title="Comportamento dos gastos"
      description="Valores declarados pelas famílias na categoria selecionada."
      meta={selected ? `${formatValue(selected.count)} famílias` : "Sem dados"}
    >
      {selected ? (
        <div className="flex flex-col gap-4">
          <Select value={selected.label} onValueChange={setSelectedLabel}>
            <SelectTrigger className="w-full bg-card sm:w-56" aria-label="Categoria de despesa">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {data.map((item) => (
                <SelectItem key={item.label} value={item.label}>{item.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <dl className="grid grid-cols-2 border-y border-border sm:grid-cols-4 sm:divide-x sm:divide-border">
            {[
              ["Mínimo", selected.min],
              ["Máximo", selected.max],
              ["Média", selected.mean],
              ["Mediana", selected.median],
            ].map(([label, value]) => (
              <div key={String(label)} className="px-2 py-3 first:pl-0 last:pr-0">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">
                  {formatValue(Number(value), "currency")}
                </dd>
              </div>
            ))}
          </dl>

          <div className="h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={selected.distribution} margin={{ top: 4, right: 8, bottom: 58, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="label"
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                  stroke="var(--color-border)"
                />
                <YAxis
                  width={48}
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                  tickFormatter={(value: number) => formatValue(value)}
                  stroke="var(--color-border)"
                />
                <Tooltip
                  {...chartTooltipStyle}
                  formatter={(value) => [formatValue(Number(value)), "Famílias"]}
                />
                <Bar dataKey="value" fill={chartPalette[0]} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="flex h-[290px] items-center justify-center text-sm text-muted-foreground">
          Nenhum gasto declarado para os filtros selecionados.
        </div>
      )}
    </ChartCard>
  );
}
