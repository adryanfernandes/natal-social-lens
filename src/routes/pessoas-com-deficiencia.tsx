import { createFileRoute } from "@tanstack/react-router";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { DonutChartCard } from "@/components/dashboard/DonutChartCard";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { useFilters } from "@/components/dashboard/filters-context";
import { useDashboardData } from "@/lib/dashboard-data";

export const Route = createFileRoute("/pessoas-com-deficiencia")({
  head: () => ({
    meta: [
      { title: "Pessoas com Deficiência — Cadastro Único de Natal/RN" },
      {
        name: "description",
        content:
          "Módulo de pessoas com deficiência do Cadastro Único de Natal/RN: tipos de deficiência e auxílios recebidos.",
      },
      { property: "og:title", content: "Pessoas com Deficiência — Natal/RN" },
      {
        property: "og:description",
        content: "Indicadores sobre pessoas com deficiência cadastradas no Cadastro Único de Natal/RN.",
      },
    ],
  }),
  component: DeficienciaPage,
});

function DeficienciaPage() {
  const { filters } = useFilters();
  const { data: { deficienciaCards, tipoDeficiencia } } = useDashboardData(filters);
  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {deficienciaCards.map((card) => (
          <MetricCard key={card.id} label={card.label} value={card.value} hint={card.hint} icon={card.icon} />
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle title="Deficiências" description="Tipos de deficiência presentes na população cadastrada." />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <BarChartCard title="Tipos de deficiência" description="Classificação principal das pessoas com deficiência." data={tipoDeficiencia} orientation="vertical" multicolor height={320} />
        </div>
      </section>
    </div>
  );
}
