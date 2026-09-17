import { createFileRoute } from "@tanstack/react-router";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { DonutChartCard } from "@/components/dashboard/DonutChartCard";
import { IndicatorCard } from "@/components/dashboard/IndicatorCard";
import { EmptyMapPlaceholder } from "@/components/dashboard/EmptyMapPlaceholder";
import { DataTable, type DataTableColumn } from "@/components/dashboard/DataTable";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { useFilters } from "@/components/dashboard/filters-context";
import { useDashboardData } from "@/lib/dashboard-data";
import { formatValue } from "@/utils/format";
import type { TerritoryRow } from "@/types/dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visão Geral — Observatório do Cadastro Único de Natal/RN" },
      {
        name: "description",
        content:
          "Indicadores agregados do Cadastro Único de Natal/RN: pessoas e famílias cadastradas, renda per capita, Bolsa Família e vulnerabilidade social.",
      },
      { property: "og:title", content: "Observatório do Cadastro Único — Natal/RN" },
      {
        property: "og:description",
        content:
          "Painel de indicadores socioeconômicos das famílias e pessoas cadastradas no Cadastro Único de Natal/RN.",
      },
    ],
  }),
  component: VisaoGeral,
});

const colunas: DataTableColumn<TerritoryRow>[] = [
  { key: "regiao", header: "Região" },
  { key: "localidade", header: "Localidade" },
  { key: "familias", header: "Famílias", align: "right", render: (r) => formatValue(r.familias) },
  { key: "pessoas", header: "Pessoas", align: "right", render: (r) => formatValue(r.pessoas) },
  {
    key: "rendaPerCapita",
    header: "Renda per capita",
    align: "right",
    render: (r) => formatValue(r.rendaPerCapita, "currency"),
  },
  {
    key: "beneficiariosPbf",
    header: "Beneficiários PBF",
    align: "right",
    render: (r) => formatValue(r.beneficiariosPbf),
  },
  {
    key: "pessoasComDeficiencia",
    header: "Pessoas com deficiência",
    align: "right",
    render: (r) => formatValue(r.pessoasComDeficiencia),
  },
];

function VisaoGeral() {
  const { filters } = useFilters();
  const { data } = useDashboardData(filters);
  const {
    bairrosTop,
    corRaca,
    distribuicaoSexo,
    faixaEtaria,
    faixaRendaFamiliar,
    indicadoresVulnerabilidade,
    tabelaIndicadores: rows,
    visaoGeralCards,
  } = data;

  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visaoGeralCards.map((card) => (
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
          title="Indicadores gerais"
          description="Perfil demográfico e de renda das pessoas e famílias cadastradas."
        />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <BarChartCard
            title="População por faixa etária"
            description="Número de pessoas cadastradas por faixa de idade."
            data={faixaEtaria}
          />
          <DonutChartCard
            title="Distribuição por sexo"
            description="Pessoas cadastradas por sexo declarado."
            data={distribuicaoSexo}
          />
          <BarChartCard
            title="Cor ou raça"
            description="Autodeclaração de cor ou raça das pessoas cadastradas."
            data={corRaca}
            orientation="vertical"
            multicolor
            height={300}
          />
          <BarChartCard
            title="Faixa de renda familiar per capita"
            description="Famílias por faixa de renda per capita (categorias configuráveis)."
            data={faixaRendaFamiliar}
            height={300}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle
          title="Indicadores de Vulnerabilidade"
          description="Situações prioritárias para o planejamento da proteção social."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {indicadoresVulnerabilidade.map((indicator) => (
            <IndicatorCard key={indicator.id} indicator={indicator} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle
          title="Distribuição Territorial"
          description="Concentração de famílias cadastradas por bairro."
        />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <EmptyMapPlaceholder />
          <BarChartCard
            title="Bairros com maior número de famílias cadastradas"
            description="Cinco bairros com maior volume de cadastros."
            data={bairrosTop}
            orientation="vertical"
            multicolor
            height={320}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle
          title="Consulta de Indicadores"
          description="Dados agregados por região e localidade. Nenhuma informação individual é apresentada."
        />
        <DataTable
          title="Indicadores por território"
          description="Pesquise, ordene e navegue pelos indicadores agregados."
          columns={colunas}
          rows={rows}
          searchPlaceholder="Pesquisar região ou localidade..."
        />
      </section>
    </div>
  );
}
