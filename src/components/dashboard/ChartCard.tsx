import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ChartCardProps {
  title: string;
  description?: string;
  /** Informação auxiliar exibida no canto superior direito. */
  meta?: string;
  className?: string;
  children: ReactNode;
}

/** Container padrão de qualquer visualização do dashboard. */
export function ChartCard({ title, description, meta, className, children }: ChartCardProps) {
  return (
    <section className={cn("panel flex flex-col gap-4 p-5", className)}>
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
          {description ? (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {meta ? (
          <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            {meta}
          </span>
        ) : null}
      </header>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
