import { createFileRoute } from "@tanstack/react-router";
import { ModulePlaceholder } from "@/components/dashboard/ModulePlaceholder";

export const Route = createFileRoute("/domicilios")({
  head: () => ({
    meta: [
      { title: "Domicílios — Cadastro Único de Natal/RN" },
      {
        name: "description",
        content:
          "Módulo de domicílios do Cadastro Único de Natal/RN: saneamento, abastecimento de água, cômodos e materiais de construção.",
      },
      { property: "og:title", content: "Domicílios — Natal/RN" },
      {
        property: "og:description",
        content: "Indicadores habitacionais e de saneamento das famílias cadastradas em Natal/RN.",
      },
    ],
  }),
  component: () => (
    <ModulePlaceholder
      title="Domicílios"
      plannedIndicators={[
        "situação do domicílio",
        "espécie do domicílio",
        "quantidade de cômodos",
        "quantidade de dormitórios",
        "material do piso",
        "material das paredes",
        "água canalizada",
        "abastecimento de água",
        "banheiro",
        "esgotamento sanitário",
        "coleta de lixo",
        "iluminação",
        "calçamento",
      ]}
    />
  ),
});
