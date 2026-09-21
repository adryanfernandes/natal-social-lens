import { createFileRoute } from "@tanstack/react-router";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { DonutChartCard } from "@/components/dashboard/DonutChartCard";
import { IndicatorCard } from "@/components/dashboard/IndicatorCard";
import { ExpenseStatisticsChart } from "@/components/dashboard/ExpenseStatisticsChart";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { useFilters } from "@/components/dashboard/filters-context";
import { useDashboardData, useExpenseStatistics } from "@/lib/dashboard-data";

export const Route = createFileRoute("/renda-vulnerabilidade")({
  head: () => ({
    meta: [
      { title: "Renda e Vulnerabilidade — Cadastro Único de Natal/RN" },
      {
        name: "description",
        content:
          "Renda média familiar e per capita, pobreza, extrema pobreza, despesas e Bolsa Família no Cadastro Único de Natal/RN.",
      },
      { property: "og:title", content: "Renda e Vulnerabilidade — Natal/RN" },
      {
        property: "og:description",
        content:
          "Indicadores de renda, pobreza e cobertura do Programa Bolsa Família entre as famílias cadastradas em Natal/RN.",
      },
    ],
  }),
  component: RendaPage,
});

function RendaPage() {
  const { filters } = useFilters();
  const { data } = useDashboardData(filters);
  const { data: despesasEstatisticas } = useExpenseStatistics(filters);
  const { despesasFamiliares, faixaRendaFamiliar, indicadoresVulnerabilidade, pbfDistribuicao, rendaCards, rendaMediaPorRegiao } = data;
  const destaques = indicadoresVulnerabilidade.filter((item) =>
    ["extrema-pobreza", "pobreza", "inseguranca-alimentar", "violacao-direitos"].includes(item.id),
  );

  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rendaCards.map((card) => (
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
          title="Renda das famílias"
          description="Distribuição da renda per capita e comparativo entre as zonas da cidade."
        />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <BarChartCard
            title="Distribuição das famílias por renda per capita"
            description="Famílias por faixa de renda per capita."
            data={faixaRendaFamiliar}
            height={300}
          />
          <BarChartCard
            title="Renda média por zona"
            description="Renda per capita média declarada em cada zona."
            data={rendaMediaPorRegiao}
            orientation="vertical"
            valueFormat="currency"
            multicolor
            height={300}
          />
          <BarChartCard
            title="Principais despesas das famílias"
            description="Número de famílias que declaram cada tipo de despesa."
            data={despesasFamiliares}
            orientation="vertical"
            height={320}
          />
          <ExpenseStatisticsChart data={despesasEstatisticas} />
          <DonutChartCard
            title="Beneficiários e não beneficiários do PBF"
            description="Cobertura do Programa Bolsa Família entre as famílias cadastradas."
            data={pbfDistribuicao}
            height={320}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle
          title="Vulnerabilidades associadas à renda"
          description="Situações que exigem atenção prioritária da rede socioassistencial."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {destaques.map((indicator) => (
            <IndicatorCard key={indicator.id} indicator={indicator} />
          ))}
        </div>
      </section>
    </div>
  );
}
