import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DashboardFilters, SelectOption } from "@/types/dashboard";
import { useDashboardData } from "@/lib/dashboard-data";

interface FilterFieldProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

function FilterField({ label, value, options, onChange }: FilterFieldProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-card">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export interface FilterBarProps {
  filters: DashboardFilters;
  onChange: (patch: Partial<DashboardFilters>) => void;
  onReset: () => void;
}

/**
 * Filtros globais. A lógica de aplicação está centralizada em
 * src/components/dashboard/filters-context.tsx — quando os dados vierem do
 * banco, basta usar o estado de filtros na consulta.
 */
export function FilterBar({ filters, onChange, onReset }: FilterBarProps) {
  const { data } = useDashboardData(filters);
  const { filterOptions } = data;

  return (
    <section className="panel p-4 lg:p-5" aria-label="Filtros globais">
      <div className="mb-3 flex items-center gap-2">
        <Filter className="size-4 text-primary" aria-hidden />
        <h2 className="text-sm font-semibold tracking-tight text-foreground">Filtros globais</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <FilterField
          label="Zona"
          value={filters.zona}
          options={filterOptions.zonas}
          onChange={(zona) => onChange({ zona })}
        />
        <FilterField
          label="Localidade / Bairro"
          value={filters.localidade}
          options={filterOptions.localidades}
          onChange={(localidade) => onChange({ localidade })}
        />
        <FilterField
          label="CRAS / CREAS"
          value={filters.equipamento}
          options={filterOptions.equipamentos}
          onChange={(equipamento) => onChange({ equipamento })}
        />
        <FilterField
          label="Faixa de renda per capita"
          value={filters.faixaRenda}
          options={filterOptions.faixasRenda}
          onChange={(faixaRenda) => onChange({ faixaRenda })}
        />
        <FilterField
          label="Programa Bolsa Família"
          value={filters.pbf}
          options={filterOptions.pbf}
          onChange={(pbf) => onChange({ pbf: pbf as DashboardFilters["pbf"] })}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="size-4" aria-hidden />
          Limpar filtros
        </Button>
      </div>
    </section>
  );
}
