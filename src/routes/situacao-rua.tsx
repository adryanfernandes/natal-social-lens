import { createFileRoute } from "@tanstack/react-router";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { DonutChartCard } from "@/components/dashboard/DonutChartCard";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { useFilters } from "@/components/dashboard/filters-context";
import { useDashboardData } from "@/lib/dashboard-data";

export const Route = createFileRoute("/situacao-rua")({
  head: () => ({
    meta: [
      { title: "Situação de Rua — Cadastro Único de Natal/RN" },
      {
        name: "description",
        content:
          "Módulo de população em situação de rua do Cadastro Único de Natal/RN: tempo na rua, pernoite e vínculos familiares.",
      },
      { property: "og:title", content: "Situação de Rua — Natal/RN" },
      {
        property: "og:description",
        content: "Indicadores da população em situação de rua cadastrada no Cadastro Único de Natal/RN.",
      },
    ],
  }),
  component: RuaPage,
});

function RuaPage() {
  const { filters } = useFilters();
  const { data: { ruaCards, ruaDormir, ruaTempo } } = useDashboardData(filters);
  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ruaCards.map((card) => (
          <MetricCard key={card.id} label={card.label} value={card.value} hint={card.hint} icon={card.icon} />
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle title="Situação de rua" description="Duração e locomoção da população em situação de rua cadastrada." />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <BarChartCard title="Tempo na rua" description="Tempo médio em que a pessoa permanece em situação de rua." data={ruaTempo} orientation="vertical" multicolor height={300} />
          <DonutChartCard title="Onde dorme" description="Locais de pernoite da população em rua." data={ruaDormir} height={300} />
        </div>
      </section>
    </div>
  );
}
