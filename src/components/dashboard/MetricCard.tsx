import {
  Accessibility,
  AlertTriangle,
  CheckCircle2,
  HandHeart,
  Home,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { formatValue, type ValueFormat } from "@/utils/format";
import { cn } from "@/lib/utils";

export type MetricIcon =
  | "users"
  | "home"
  | "handHeart"
  | "wallet"
  | "accessibility"
  | "alert"
  | "check"
  | "trending";

const icons: Record<MetricIcon, LucideIcon> = {
  users: Users,
  home: Home,
  handHeart: HandHeart,
  wallet: Wallet,
  accessibility: Accessibility,
  alert: AlertTriangle,
  check: CheckCircle2,
  trending: TrendingUp,
};

export interface MetricCardProps {
  label: string;
  value: number;
  hint?: string;
  suffix?: string;
  format?: ValueFormat;
  icon?: MetricIcon;
  className?: string;
}

export function MetricCard({
  label,
  value,
  hint,
  suffix,
  format = "integer",
  icon = "users",
  className,
}: MetricCardProps) {
  const Icon = icons[icon];

  return (
    <article className={cn("panel flex flex-col gap-3 p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium leading-snug text-muted-foreground">{label}</p>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="size-4.5" aria-hidden />
        </span>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
        {formatValue(value, format)}
        {suffix ? <span className="ml-1 text-base font-medium text-muted-foreground">{suffix}</span> : null}
      </p>
      {hint ? <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p> : null}
    </article>
  );
}
