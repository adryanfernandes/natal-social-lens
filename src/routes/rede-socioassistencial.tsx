import { createFileRoute } from "@tanstack/react-router";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { DonutChartCard } from "@/components/dashboard/DonutChartCard";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { useFilters } from "@/components/dashboard/filters-context";
import { useDashboardData } from "@/lib/dashboard-data";

export const Route = createFileRoute("/rede-socioassistencial")({
  head: () => ({
    meta: [
      { title: "Rede Socioassistencial — Cadastro Único de Natal/RN" },
      {
        name: "description",
        content:
          "Módulo da rede socioassistencial de Natal/RN: CRAS, CREAS, Centro POP e instituições de atendimento.",
      },
      { property: "og:title", content: "Rede Socioassistencial — Natal/RN" },
      {
        property: "og:description",
        content: "Cobertura territorial dos equipamentos e serviços socioassistenciais de Natal/RN.",
      },
    ],
  }),
  component: RedePage,
});

function RedePage() {
  const { filters } = useFilters();
  const { data: { redeAtendimentosPorBairro, redeAtendimentosPorZona, redeCards, redeCobertura, redeFamiliasPorEquipamento } } = useDashboardData(filters);
  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {redeCards.map((card) => (
          <MetricCard key={card.id} label={card.label} value={card.value} hint={card.hint} icon={card.icon} />
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle title="Cobertura da rede" description="Estrutura da assistência social da cidade e serviços vinculados." />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <DonutChartCard title="Equipamentos de atendimento" description="Composição da rede socioassistencial." data={redeCobertura} height={300} />
          <BarChartCard title="Famílias por equipamento" description="Famílias vinculadas aos principais equipamentos informados." data={redeFamiliasPorEquipamento} orientation="vertical" multicolor height={380} />
          <BarChartCard title="Atendimentos por zona" description="Registros de serviços socioassistenciais em cada zona." data={redeAtendimentosPorZona} orientation="vertical" multicolor height={300} />
          <BarChartCard title="Atendimentos por bairro" description="Dez bairros com maior número de serviços registrados." data={redeAtendimentosPorBairro} orientation="vertical" multicolor height={420} />
        </div>
      </section>
    </div>
  );
}
