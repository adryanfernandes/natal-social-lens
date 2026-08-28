import { createFileRoute } from "@tanstack/react-router";
import { ModulePlaceholder } from "@/components/dashboard/ModulePlaceholder";

export const Route = createFileRoute("/beneficios-sociais")({
  head: () => ({
    meta: [
      { title: "Benefícios Sociais — Cadastro Único de Natal/RN" },
      {
        name: "description",
        content:
          "Módulo de benefícios sociais do Cadastro Único de Natal/RN: Bolsa Família, BPC e demais transferências.",
      },
      { property: "og:title", content: "Benefícios Sociais — Natal/RN" },
      {
        property: "og:description",
        content: "Cobertura de benefícios e programas sociais entre as famílias cadastradas em Natal/RN.",
      },
    ],
  }),
  component: () => (
    <ModulePlaceholder
      title="Benefícios Sociais"
      plannedIndicators={[
        "Programa Bolsa Família",
        "Benefício de Prestação Continuada",
        "benefícios eventuais",
        "tarifa social de energia",
        "outros programas de transferência de renda",
      ]}
    />
  ),
});
