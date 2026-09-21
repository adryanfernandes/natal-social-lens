import { createFileRoute } from "@tanstack/react-router";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { DonutChartCard } from "@/components/dashboard/DonutChartCard";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { useFilters } from "@/components/dashboard/filters-context";
import { useDashboardData } from "@/lib/dashboard-data";

export const Route = createFileRoute("/trabalho-renda")({
  head: () => ({
    meta: [
      { title: "Trabalho e Renda — Cadastro Único de Natal/RN" },
      {
        name: "description",
        content:
          "Módulo de trabalho e renda do Cadastro Único de Natal/RN: situação de trabalho, remuneração e outras fontes de renda.",
      },
      { property: "og:title", content: "Trabalho e Renda — Natal/RN" },
      {
        property: "og:description",
        content: "Indicadores de ocupação e renda das pessoas cadastradas em Natal/RN.",
      },
    ],
  }),
  component: TrabalhoRendaPage,
});

function TrabalhoRendaPage() {
  const { filters } = useFilters();
  const { data: { atividadePrincipal, situacaoTrabalho, trabalhoPorZona, trabalhoRendaCards, trabalhoRendaPorZona } } = useDashboardData(filters);
  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {trabalhoRendaCards.map((card) => (
          <MetricCard key={card.id} label={card.label} value={card.value} hint={card.hint} icon={card.icon} {...(card.format ? { format: card.format } : {})} />
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle title="Trabalho e renda" description="Situação ocupacional e atividade principal da população cadastrada." />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <DonutChartCard title="Situação de trabalho" description="Composição da população por vínculo de trabalho." data={situacaoTrabalho} height={300} />
          <BarChartCard title="Atividade principal" description="Principais setores econômicos de ocupação." data={atividadePrincipal} orientation="vertical" multicolor height={300} />
          <BarChartCard title="Situação de trabalho por zona" description="Pessoas com situação ocupacional informada em cada zona." data={trabalhoPorZona} orientation="vertical" multicolor height={300} />
          <BarChartCard title="Renda familiar média por zona" description="Renda familiar média declarada em cada zona." data={trabalhoRendaPorZona} orientation="vertical" valueFormat="currency" multicolor height={300} />
        </div>
      </section>
    </div>
  );
}
