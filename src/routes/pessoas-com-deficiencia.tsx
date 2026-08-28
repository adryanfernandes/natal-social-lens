import { createFileRoute } from "@tanstack/react-router";
import { ModulePlaceholder } from "@/components/dashboard/ModulePlaceholder";

export const Route = createFileRoute("/pessoas-com-deficiencia")({
  head: () => ({
    meta: [
      { title: "Pessoas com Deficiência — Cadastro Único de Natal/RN" },
      {
        name: "description",
        content:
          "Módulo de pessoas com deficiência do Cadastro Único de Natal/RN: tipos de deficiência e auxílios recebidos.",
      },
      { property: "og:title", content: "Pessoas com Deficiência — Natal/RN" },
      {
        property: "og:description",
        content: "Indicadores sobre pessoas com deficiência cadastradas no Cadastro Único de Natal/RN.",
      },
    ],
  }),
  component: () => (
    <ModulePlaceholder
      title="Pessoas com Deficiência"
      plannedIndicators={[
        "pessoas com deficiência",
        "cegueira",
        "baixa visão",
        "surdez",
        "deficiência física",
        "deficiência intelectual",
        "síndrome de Down",
        "transtorno ou doença mental",
        "tipo de auxílio recebido",
      ]}
    />
  ),
});
