import { createFileRoute } from "@tanstack/react-router";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { DonutChartCard } from "@/components/dashboard/DonutChartCard";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { useFilters } from "@/components/dashboard/filters-context";
import { useDashboardData } from "@/lib/dashboard-data";

export const Route = createFileRoute("/educacao")({
  head: () => ({
    meta: [
      { title: "Educação — Cadastro Único de Natal/RN" },
      {
        name: "description",
        content:
          "Módulo de educação do Cadastro Único de Natal/RN: alfabetização, frequência escolar e grau de instrução.",
      },
      { property: "og:title", content: "Educação — Natal/RN" },
      {
        property: "og:description",
        content: "Indicadores educacionais das pessoas cadastradas no Cadastro Único de Natal/RN.",
      },
    ],
  }),
  component: EducacaoPage,
});

function EducacaoPage() {
  const { filters } = useFilters();
  const { data: { educacaoCards, educacaoSerie, frequenciaEscolar } } = useDashboardData(filters);
  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {educacaoCards.map((card) => (
          <MetricCard key={card.id} label={card.label} value={card.value} hint={card.hint} icon={card.icon} />
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle title="Educação" description="Frequência escolar e graus de instrução da população cadastrada." />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <BarChartCard title="Nível de instrução" description="Distribuição por nível escolar da população." data={frequenciaEscolar} orientation="vertical" multicolor height={300} />
          <DonutChartCard title="Etapa escolar" description="Etapas de escolarização mais frequentes." data={educacaoSerie} height={300} />
        </div>
      </section>
    </div>
  );
}
