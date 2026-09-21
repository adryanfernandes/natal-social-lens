import { createFileRoute } from "@tanstack/react-router";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { DonutChartCard } from "@/components/dashboard/DonutChartCard";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { useFilters } from "@/components/dashboard/filters-context";
import { useDashboardData } from "@/lib/dashboard-data";

export const Route = createFileRoute("/domicilios")({
  head: () => ({
    meta: [
      { title: "Domicílios — Cadastro Único de Natal/RN" },
      {
        name: "description",
        content:
          "Módulo de domicílios do Cadastro Único de Natal/RN: saneamento, abastecimento de água, cômodos e materiais de construção.",
      },
      { property: "og:title", content: "Domicílios — Natal/RN" },
      {
        property: "og:description",
        content: "Indicadores habitacionais e de saneamento das famílias cadastradas em Natal/RN.",
      },
    ],
  }),
  component: DomiciliosPage,
});

function DomiciliosPage() {
  const { filters } = useFilters();
  const { data: { domiciliosCards, domiciliosComodos, domiciliosPessoas, domiciliosTipo, saneamentoDomiciliar } } = useDashboardData(filters);
  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {domiciliosCards.map((card) => (
          <MetricCard
            key={card.id}
            label={card.label}
            value={card.value}
            hint={card.hint}
            icon={card.icon}
          />
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle title="Habitação e saneamento" description="Estrutura dos domicílios e cobertura de saneamento." />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <BarChartCard title="Tipo de domicílio" description="Espécie dos domicílios cadastrados." data={domiciliosTipo} orientation="vertical" multicolor height={300} />
          <BarChartCard title="Quantidade de cômodos" description="Número de cômodos por domicílio." data={domiciliosComodos} height={300} />
          <DonutChartCard title="Saneamento" description="Domicílios com acesso a serviços básicos." data={saneamentoDomiciliar} height={300} />
          <BarChartCard title="Pessoas por domicílio" description="Quantidade de moradores nos domicílios cadastrados." data={domiciliosPessoas} height={300} />
        </div>
      </section>
    </div>
  );
}
