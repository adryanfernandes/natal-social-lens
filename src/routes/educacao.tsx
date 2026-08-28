import { createFileRoute } from "@tanstack/react-router";
import { ModulePlaceholder } from "@/components/dashboard/ModulePlaceholder";

export const Route = createFileRoute("/educacao")({
  head: () => ({
    meta: [
      { title: "Educação — Cadastro Único de Natal/RN" },
      {
        name: "description",
        content:
          "Módulo de educação do Cadastro Único de Natal/RN: alfabetização, frequência escolar e grau de instrução.",
      },
      { property: "og:title", content: "Educação — Natal/RN" },
      {
        property: "og:description",
        content: "Indicadores educacionais das pessoas cadastradas no Cadastro Único de Natal/RN.",
      },
    ],
  }),
  component: () => (
    <ModulePlaceholder
      title="Educação"
      plannedIndicators={[
        "alfabetização",
        "frequência escolar",
        "curso frequentado",
        "série",
        "grau de instrução",
        "escolas frequentadas",
        "escola localizada no município",
      ]}
    />
  ),
});
