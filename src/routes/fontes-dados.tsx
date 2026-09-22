import { createFileRoute } from "@tanstack/react-router";
import { Database, Filter, Rows3, ShieldCheck } from "lucide-react";
import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { DonutChartCard } from "@/components/dashboard/DonutChartCard";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import { useFilters } from "@/components/dashboard/filters-context";
import { useDashboardData } from "@/lib/dashboard-data";

export const Route = createFileRoute("/fontes-dados")({
  head: () => ({
    meta: [
      { title: "Fontes de Dados - Cadastro Unico de Natal/RN" },
      { name: "description", content: "Informacoes sobre a base agregada utilizada pelo observatorio." },
    ],
  }),
  component: FontesDadosPage,
});

function FontesDadosPage() {
  const { filters } = useFilters();
  const { data, loading, error } = useDashboardData(filters);
  const people = data.visaoGeralCards.find((card) => card.id === "pessoas")?.value || 0;
  const items = [
    { label: "Origem", value: "Supabase", detail: "Tabela privada excel_rows", icon: Database },
    { label: "Registros na seleção", value: people.toLocaleString("pt-BR"), detail: "Dados agregados, sem identificadores", icon: Rows3 },
    { label: "Filtros da base", value: "5 dimensoes", detail: "Zona, localidade, equipamento, renda e PBF", icon: Filter },
    { label: "Protecao", value: "RLS ativo", detail: "A chave secreta permanece no servidor", icon: ShieldCheck },
  ];

  return (
    <div className="flex flex-col gap-8">
      <SectionTitle
        title="Fontes de dados"
        description="Indicadores calculados exclusivamente a partir da base agregada armazenada no Supabase."
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map(({ label, value, detail, icon: Icon }) => (
          <article key={label} className="panel p-5">
            <Icon className="mb-4 size-5 text-primary" aria-hidden />
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-1 text-xl font-semibold text-foreground">{loading ? "Carregando..." : value}</p>
            <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
          </article>
        ))}
      </section>
      <section className="flex flex-col gap-4">
        <SectionTitle
          title="Cobertura da base"
          description="Distribuição dos registros agregados disponíveis para análise."
        />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <BarChartCard title="Famílias por zona" description="Cobertura territorial dos cadastros familiares." data={data.familiasPorRegiao} orientation="vertical" multicolor height={300} />
          <DonutChartCard title="Pessoas por sexo" description="Distribuição dos registros por sexo declarado." data={data.distribuicaoSexo} height={300} />
          <BarChartCard title="Pessoas por faixa etária" description="Cobertura dos registros por grupos de idade." data={data.faixaEtaria} height={300} />
          <BarChartCard title="Famílias por faixa de renda" description="Cobertura dos registros por renda familiar per capita." data={data.faixaRendaFamiliar} height={300} />
        </div>
      </section>
    </div>
  );
}
