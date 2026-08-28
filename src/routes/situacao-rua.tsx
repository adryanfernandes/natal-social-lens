import { createFileRoute } from "@tanstack/react-router";
import { ModulePlaceholder } from "@/components/dashboard/ModulePlaceholder";

export const Route = createFileRoute("/situacao-rua")({
  head: () => ({
    meta: [
      { title: "Situação de Rua — Cadastro Único de Natal/RN" },
      {
        name: "description",
        content:
          "Módulo de população em situação de rua do Cadastro Único de Natal/RN: tempo na rua, pernoite e vínculos familiares.",
      },
      { property: "og:title", content: "Situação de Rua — Natal/RN" },
      {
        property: "og:description",
        content: "Indicadores da população em situação de rua cadastrada no Cadastro Único de Natal/RN.",
      },
    ],
  }),
  component: () => (
    <ModulePlaceholder
      title="Situação de Rua"
      plannedIndicators={[
        "pessoas em situação de rua",
        "tempo vivendo na rua",
        "onde dormem",
        "motivos da situação de rua",
        "vínculos familiares",
        "atividades econômicas",
        "atendimento por serviços públicos",
      ]}
    />
  ),
});
