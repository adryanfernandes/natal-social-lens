import { createFileRoute } from "@tanstack/react-router";
import { ModulePlaceholder } from "@/components/dashboard/ModulePlaceholder";

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
  component: () => (
    <ModulePlaceholder
      title="Perfil da População"
      plannedIndicators={[
        "sexo",
        "faixa etária",
        "cor ou raça",
        "relação de parentesco",
        "distribuição por território",
      ]}
    />
  ),
});
