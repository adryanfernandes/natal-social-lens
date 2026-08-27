import { Construction } from "lucide-react";

export interface ModulePlaceholderProps {
  title: string;
  /** Lista de indicadores previstos para o módulo. */
  plannedIndicators?: string[];
}

/** Página base dos módulos que serão desenvolvidos nas próximas versões. */
export function ModulePlaceholder({ title, plannedIndicators = [] }: ModulePlaceholderProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="panel flex flex-col gap-3 p-6">
        <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Construction className="size-5" aria-hidden />
        </span>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Este módulo será desenvolvido nas próximas versões.
        </p>
      </div>

      {plannedIndicators.length > 0 ? (
        <section className="panel p-6">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Indicadores previstos
          </h3>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {plannedIndicators.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
