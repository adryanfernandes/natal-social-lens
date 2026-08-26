import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { emptyFilters, type DashboardFilters, type TerritoryRow } from "@/types/dashboard";

interface FiltersContextValue {
  filters: DashboardFilters;
  setFilters: (patch: Partial<DashboardFilters>) => void;
  reset: () => void;
  /** Nº de filtros ativos (diferentes do padrão). */
  activeCount: number;
}

const FiltersContext = createContext<FiltersContextValue | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<DashboardFilters>(emptyFilters);

  const setFilters = useCallback((patch: Partial<DashboardFilters>) => {
    setFiltersState((current) => ({ ...current, ...patch }));
  }, []);

  const reset = useCallback(() => setFiltersState(emptyFilters), []);

  const value = useMemo<FiltersContextValue>(() => {
    const activeCount = (Object.keys(filters) as (keyof DashboardFilters)[]).filter(
      (key) => filters[key] !== emptyFilters[key],
    ).length;
    return { filters, setFilters, reset, activeCount };
  }, [filters, setFilters, reset]);

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
  const context = useContext(FiltersContext);
  if (!context) throw new Error("useFilters deve ser usado dentro de <FiltersProvider>");
  return context;
}

/**
 * Aplica os filtros globais a uma série territorial.
 * Hoje serve apenas para demonstrar o comportamento com dados fictícios;
 * ao conectar o banco, envie os filtros na consulta e remova esta função.
 */
export function applyFilters(rows: TerritoryRow[], filters: DashboardFilters): TerritoryRow[] {
  return rows.filter((row) => {
    if (filters.regiao !== "todas" && row.regiao !== filters.regiao) return false;
    if (filters.localidade !== "todas") {
      const slug = row.localidade
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-");
      if (!slug.includes(filters.localidade.replace(/^nossa-senhora-/, "nossa-senhora-da-"))) {
        return slug !== filters.localidade ? false : true;
      }
    }
    return true;
  });
}
