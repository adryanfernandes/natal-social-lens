import { createFileRoute } from "@tanstack/react-router";
import { ModulePlaceholder } from "@/components/dashboard/ModulePlaceholder";

export const Route = createFileRoute("/trabalho-renda")({
  head: () => ({
    meta: [
      { title: "Trabalho e Renda — Cadastro Único de Natal/RN" },
      {
        name: "description",
        content:
          "Módulo de trabalho e renda do Cadastro Único de Natal/RN: situação de trabalho, remuneração e outras fontes de renda.",
      },
      { property: "og:title", content: "Trabalho e Renda — Natal/RN" },
      {
        property: "og:description",
        content: "Indicadores de ocupação e renda das pessoas cadastradas em Natal/RN.",
      },
    ],
  }),
  component: () => (
    <ModulePlaceholder
      title="Trabalho e Renda"
      plannedIndicators={[
        "situação de trabalho",
        "trabalho na semana anterior",
        "meses trabalhados",
        "atividade principal",
        "remuneração",
        "trabalho remunerado nos últimos 12 meses",
        "seguro-desemprego",
        "aposentadoria",
        "pensão",
        "outras fontes de renda",
      ]}
    />
  ),
});
