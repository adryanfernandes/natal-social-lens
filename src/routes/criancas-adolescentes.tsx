import { createFileRoute } from "@tanstack/react-router";
import { ModulePlaceholder } from "@/components/dashboard/ModulePlaceholder";

export const Route = createFileRoute("/criancas-adolescentes")({
  head: () => ({
    meta: [
      { title: "Crianças e Adolescentes — Cadastro Único de Natal/RN" },
      {
        name: "description",
        content:
          "Módulo de crianças e adolescentes do Cadastro Único de Natal/RN: frequência escolar, trabalho infantil e proteção social.",
      },
      { property: "og:title", content: "Crianças e Adolescentes — Natal/RN" },
      {
        property: "og:description",
        content: "Indicadores sobre crianças e adolescentes cadastrados no Cadastro Único de Natal/RN.",
      },
    ],
  }),
  component: () => (
    <ModulePlaceholder
      title="Crianças e Adolescentes"
      plannedIndicators={[
        "faixas etárias de 0 a 17 anos",
        "frequência escolar",
        "marcação de trabalho infantil",
        "acompanhamento por serviços da rede",
        "famílias com crianças beneficiárias do PBF",
      ]}
    />
  ),
});
