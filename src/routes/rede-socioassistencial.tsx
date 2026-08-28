import { createFileRoute } from "@tanstack/react-router";
import { ModulePlaceholder } from "@/components/dashboard/ModulePlaceholder";

export const Route = createFileRoute("/rede-socioassistencial")({
  head: () => ({
    meta: [
      { title: "Rede Socioassistencial — Cadastro Único de Natal/RN" },
      {
        name: "description",
        content:
          "Módulo da rede socioassistencial de Natal/RN: CRAS, CREAS, Centro POP e instituições de atendimento.",
      },
      { property: "og:title", content: "Rede Socioassistencial — Natal/RN" },
      {
        property: "og:description",
        content: "Cobertura territorial dos equipamentos e serviços socioassistenciais de Natal/RN.",
      },
    ],
  }),
  component: () => (
    <ModulePlaceholder
      title="Rede Socioassistencial"
      plannedIndicators={[
        "CRAS",
        "CREAS",
        "Centro POP",
        "instituições governamentais",
        "instituições não governamentais",
        "hospitais e clínicas",
      ]}
    />
  ),
});
