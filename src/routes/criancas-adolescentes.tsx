import { createFileRoute } from "@tanstack/react-router";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { DonutChartCard } from "@/components/dashboard/DonutChartCard";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { useFilters } from "@/components/dashboard/filters-context";
import { useDashboardData } from "@/lib/dashboard-data";

export const Route = createFileRoute("/criancas-adolescentes")({
  head: () => ({
    meta: [
      { title: "Crianças e Adolescentes — Cadastro Único de Natal/RN" },
      {
        name: "description",
        content:
          "Módulo de crianças e adolescentes do Cadastro Único de Natal/RN: frequência escolar, trabalho infantil e proteção social.",
      },
      { property: "og:title", content: "Crianças e Adolescentes — Natal/RN" },
      {
        property: "og:description",
        content: "Indicadores sobre crianças e adolescentes cadastrados no Cadastro Único de Natal/RN.",
      },
    ],
  }),
  component: CriancasPage,
});

function CriancasPage() {
  const { filters } = useFilters();
  const { data: { criancasAtendimento, criancasCards, criancasFaixaEtaria, criancasPorZona, trabalhoInfantilPorZona } } = useDashboardData(filters);
  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {criancasCards.map((card) => (
          <MetricCard key={card.id} label={card.label} value={card.value} hint={card.hint} icon={card.icon} />
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle title="Crianças e adolescentes" description="Distribuição etária e acesso à educação na população jovem cadastrada." />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <BarChartCard title="Faixa etária" description="Pessoas de 0 a 17 anos por faixa etária." data={criancasFaixaEtaria} orientation="vertical" multicolor height={260} />
          <DonutChartCard title="Modalidade de atendimento" description="Local de escolarização e acesso dos jovens cadastrados." data={criancasAtendimento} height={260} />
          <BarChartCard title="Crianças e adolescentes por zona" description="População de até 17 anos cadastrada em cada zona." data={criancasPorZona} orientation="vertical" multicolor height={260} />
          <BarChartCard title="Trabalho infantil por zona" description="Marcações de trabalho infantil em cada zona." data={trabalhoInfantilPorZona} orientation="vertical" multicolor height={260} />
        </div>
      </section>
    </div>
  );
}
