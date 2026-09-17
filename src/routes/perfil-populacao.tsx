import { createFileRoute } from "@tanstack/react-router";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { DonutChartCard } from "@/components/dashboard/DonutChartCard";
import { SectionTitle } from "@/components/dashboard/SectionTitle";
import {
  perfilCorRaca,
  perfilFaixaEtaria,
  perfilParentesco,
  perfilPopulacaoCards,
  perfilSexo,
} from "@/data/realData";

export const Route = createFileRoute("/perfil-populacao")({
  head: () => ({
    meta: [
      { title: "Perfil da População — Cadastro Único de Natal/RN" },
      {
        name: "description",
        content:
          "Módulo de perfil da população cadastrada no Cadastro Único de Natal/RN: sexo, faixa etária, cor ou raça e parentesco.",
      },
      { property: "og:title", content: "Perfil da População — Natal/RN" },
      {
        property: "og:description",
        content: "Indicadores demográficos das pessoas cadastradas no Cadastro Único de Natal/RN.",
      },
    ],
  }),
  component: PerfilPopulacaoPage,
});

function PerfilPopulacaoPage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {perfilPopulacaoCards.map((card) => (
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
        <SectionTitle
          title="Composição demográfica"
          description="Distribuição da população cadastrada por sexo, idade, cor ou raça e vínculo familiar."
        />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <DonutChartCard title="Sexo" description="Distribuição por sexo" data={perfilSexo} />
          <BarChartCard
            title="Faixa etária"
            description="Pessoas por grupos etários.
"
            data={perfilFaixaEtaria}
            orientation="vertical"
            multicolor
            height={300}
          />
          <BarChartCard
            title="Cor ou raça"
            description="Autodeclaração racial da população cadastrada."
            data={perfilCorRaca}
            multicolor
            height={300}
          />
          <BarChartCard
            title="Parentesco"
            description="Vínculo dos moradores com a unidade domiciliar."
            data={perfilParentesco}
            orientation="vertical"
            multicolor
            height={300}
          />
        </div>
      </section>
    </div>
  );
}
