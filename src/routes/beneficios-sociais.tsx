import { createFileRoute } from "@tanstack/react-router";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DonutChartCard } from "@/components/dashboard/DonutChartCard";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { useFilters } from "@/components/dashboard/filters-context";
import { useDashboardData } from "@/lib/dashboard-data";

export const Route = createFileRoute("/beneficios-sociais")({
  head: () => ({
    meta: [
      { title: "Benefícios Sociais — Cadastro Único de Natal/RN" },
      {
        name: "description",
        content:
          "Módulo de benefícios sociais do Cadastro Único de Natal/RN: Bolsa Família, BPC e demais transferências.",
      },
      { property: "og:title", content: "Benefícios Sociais — Natal/RN" },
      {
        property: "og:description",
        content: "Cobertura de benefícios e programas sociais entre as famílias cadastradas em Natal/RN.",
      },
    ],
  }),
  component: BeneficiosPage,
});

function BeneficiosPage() {
  const { filters } = useFilters();
  const { data: { beneficiosCards, beneficiosCobertura } } = useDashboardData(filters);
  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {beneficiosCards.map((card) => (
          <MetricCard key={card.id} label={card.label} value={card.value} hint={card.hint} icon={card.icon} />
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle title="Cobertura de benefícios" description="Programas de transferência e proteção social presentes no cadastro." />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <DonutChartCard title="Benefícios sociais" description="Cobertura por programa social." data={beneficiosCobertura} height={300} />
        </div>
      </section>
    </div>
  );
}
