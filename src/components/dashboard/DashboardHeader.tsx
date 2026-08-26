import { CalendarClock } from "lucide-react";

export interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  /** Data da última carga de dados (futuramente vinda do banco). */
  lastUpdate: string;
}

export function DashboardHeader({ title, subtitle, lastUpdate }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-border bg-card px-4 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-foreground lg:text-2xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/60 px-3 py-2">
        <CalendarClock className="size-5 shrink-0 text-primary" aria-hidden />
        <div>
          <p className="text-xs font-medium text-muted-foreground">Última atualização dos dados</p>
          <p className="text-sm font-semibold text-foreground">{lastUpdate}</p>
        </div>
      </div>
    </header>
  );
}
