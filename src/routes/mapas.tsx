import { createFileRoute } from "@tanstack/react-router";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { ThematicMap } from "@/components/dashboard/ThematicMap";
import { useFilters } from "@/components/dashboard/filters-context";
import { useDashboardData } from "@/lib/dashboard-data";

export const Route = createFileRoute("/mapas")({
  head: () => ({
    meta: [
      { title: "Mapas — Observatório do Cadastro Único de Natal/RN" },
      {
        name: "description",
        content:
          "Mapas temáticos dos indicadores agregados do Cadastro Único por bairro e zona de Natal/RN.",
      },
    ],
  }),
  component: Mapas,
});

function Mapas() {
  const { filters } = useFilters();
  const { data, loading, error } = useDashboardData(filters);

  return (
    <div className="flex flex-col gap-5">
      <SectionTitle
        title="Mapas temáticos"
        description="Explore a distribuição dos indicadores sociais por bairro ou zona administrativa."
      />
      {loading ? (
        <div className="panel flex min-h-[620px] items-center justify-center text-sm text-muted-foreground">
          Carregando dados do Supabase...
        </div>
      ) : null}
      {error ? <div className="panel p-5 text-sm text-destructive">{error}</div> : null}
      {!loading && !error ? <ThematicMap rows={data.tabelaIndicadores} /> : null}
    </div>
  );
}
