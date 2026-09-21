import { createFileRoute } from "@tanstack/react-router";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { useFilters } from "@/components/dashboard/filters-context";
import { useDashboardData } from "@/lib/dashboard-data";

export const Route = createFileRoute("/grupos-especificos")({
  head: () => ({
    meta: [
      { title: "Grupos Específicos — Cadastro Único de Natal/RN" },
      {
        name: "description",
        content:
          "Módulo de grupos populacionais tradicionais e específicos do Cadastro Único de Natal/RN: indígenas, quilombolas e outros.",
      },
      { property: "og:title", content: "Grupos Específicos — Natal/RN" },
      {
        property: "og:description",
        content: "Indicadores de povos e comunidades tradicionais cadastrados no Cadastro Único de Natal/RN.",
      },
    ],
  }),
  component: GruposPage,
});

function GruposPage() {
  const { filters } = useFilters();
  const { data: { gruposCards, gruposTradicionais } } = useDashboardData(filters);
  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {gruposCards.map((card) => (
          <MetricCard key={card.id} label={card.label} value={card.value} hint={card.hint} icon={card.icon} />
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle title="Grupos específicos" description="Povos e comunidades tradicionais no Cadastro Único." />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <BarChartCard
            title="Grupos tradicionais"
            description="Famílias e pessoas por grupos específicos."
            data={gruposTradicionais}
            orientation="vertical"
            multicolor
            height={Math.max(320, gruposTradicionais.length * 36 + 48)}
          />
        </div>
      </section>
    </div>
  );
}
