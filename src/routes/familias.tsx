import { createFileRoute } from "@tanstack/react-router";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { DonutChartCard } from "@/components/dashboard/DonutChartCard";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { useFilters } from "@/components/dashboard/filters-context";
import { useDashboardData } from "@/lib/dashboard-data";

export const Route = createFileRoute("/familias")({
  head: () => ({
    meta: [
      { title: "Famílias — Observatório do Cadastro Único de Natal/RN" },
      {
        name: "description",
        content:
          "Indicadores familiares do Cadastro Único de Natal/RN: composição dos domicílios, atualização cadastral e distribuição por região.",
      },
      { property: "og:title", content: "Famílias — Cadastro Único de Natal/RN" },
      {
        property: "og:description",
        content:
          "Composição familiar, atualização cadastral e distribuição territorial das famílias cadastradas em Natal/RN.",
      },
    ],
  }),
  component: FamiliasPage,
});

function FamiliasPage() {
  const { filters } = useFilters();
  const { data } = useDashboardData(filters);
  const { estadoCadastral, familiasCards, familiasPorRegiao, pessoasPorDomicilio, tempoUltimaAtualizacao } = data;
  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {familiasCards.map((card) => (
          <MetricCard
            key={card.id}
            label={card.label}
            value={card.value}
            hint={card.hint}
            icon={card.icon}
            {...(card.format ? { format: card.format } : {})}
          />
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle
          title="Indicadores familiares"
          description="Distribuição das famílias por território, composição e situação cadastral."
        />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <BarChartCard
            title="Famílias por zona de Natal"
            description="Total de famílias cadastradas em cada zona da cidade."
            data={familiasPorRegiao}
            orientation="vertical"
            multicolor
          />
          <BarChartCard
            title="Quantidade de pessoas por domicílio"
            description="Composição dos domicílios cadastrados."
            data={pessoasPorDomicilio}
          />
          <BarChartCard
            title="Tempo desde a última atualização cadastral"
            description="Famílias por intervalo de tempo desde a última atualização."
            data={tempoUltimaAtualizacao}
          />
          <DonutChartCard
            title="Estado cadastral da família"
            description="Proporção de cadastros atualizados e desatualizados."
            data={estadoCadastral}
          />
        </div>
      </section>
    </div>
  );
}
