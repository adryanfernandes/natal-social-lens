import {
  Accessibility,
  AlertTriangle,
  Baby,
  ShieldAlert,
  Tent,
  TrendingDown,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { Indicator } from "@/types/dashboard";
import { formatValue } from "@/utils/format";
import { cn } from "@/lib/utils";

const iconById: Record<string, LucideIcon> = {
  "extrema-pobreza": TrendingDown,
  pobreza: TrendingDown,
  rua: Tent,
  pcd: Accessibility,
  "trabalho-infantil": Baby,
  "inseguranca-alimentar": UtensilsCrossed,
  "violacao-direitos": ShieldAlert,
};

const toneClass: Record<NonNullable<Indicator["tone"]>, string> = {
  neutral: "bg-accent text-accent-foreground",
  positive: "bg-success/12 text-success",
  alert: "bg-warning/18 text-warning-foreground",
  critical: "bg-destructive/12 text-destructive",
};

export interface IndicatorCardProps {
  indicator: Indicator;
  className?: string | undefined;
}

/** Card compacto usado na seção de Indicadores de Vulnerabilidade. */
export function IndicatorCard({ indicator, className }: IndicatorCardProps) {
  const Icon = iconById[indicator.id] ?? AlertTriangle;
  const tone = indicator.tone ?? "neutral";

  return (
    <article className={cn("panel flex items-start gap-3 p-4", className)}>
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg",
          toneClass[tone],
        )}
      >
        <Icon className="size-4.5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium leading-snug text-muted-foreground">{indicator.label}</p>
        <p className="mt-1 text-xl font-semibold tracking-tight text-foreground">
          {formatValue(indicator.value)}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatValue(indicator.percent, "percent")} · {indicator.unit}
        </p>
      </div>
    </article>
  );
}
