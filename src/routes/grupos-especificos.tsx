import { createFileRoute } from "@tanstack/react-router";
import { ModulePlaceholder } from "@/components/dashboard/ModulePlaceholder";

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
  component: () => (
    <ModulePlaceholder
      title="Grupos Específicos"
      plannedIndicators={[
        "famílias indígenas",
        "famílias quilombolas",
        "povos indígenas",
        "comunidades quilombolas",
        "grupos populacionais tradicionais e específicos",
      ]}
    />
  ),
});
